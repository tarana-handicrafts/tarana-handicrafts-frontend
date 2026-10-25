import { NextResponse } from "next/server";
import { randomInt } from "node:crypto";
import { z } from "zod";
import { getDb, type EnquiryDoc, type EnquiryItem, type EnquiryType } from "@/lib/mongodb";
import { getProduct } from "@/lib/catalog";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const text = (max: number) => z.string().trim().max(max).optional().transform((v) => v || undefined);

const itemSchema = z.object({
  slug: text(120),
  name: text(200),
  size: text(80),
  quantity: z.coerce.number().int().min(1).max(100000),
  unitPrice: z.coerce.number().min(0).max(10_000_000).optional(),
});

const baseSchema = z.object({
  website: z.string().max(200).optional(), // honeypot
  name: text(100),
  email: z.union([z.literal(""), z.string().trim().email().max(254)]).optional().transform((v) => v || undefined),
  phone: text(30),
  company: text(120),
  country: text(60),
  subject: text(150),
  message: text(5000),
  items: z.array(itemSchema).max(50).default([]),
  details: z
    .record(z.string().max(40), z.string().trim().max(200))
    .refine((d) => Object.keys(d).length <= 12, "too many fields")
    .optional(),
});

const schema = z.discriminatedUnion("type", [
  baseSchema.extend({ type: z.literal("quote") }),
  baseSchema.extend({ type: z.literal("contact") }),
  baseSchema.extend({
    type: z.literal("whatsapp_order"),
    ref: z.string().regex(/^WA-[A-Z0-9]{6}$/),
    total: z.coerce.number().min(0).max(100_000_000).optional(),
  }),
]);

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const REF_PREFIX: Record<EnquiryType, string> = { quote: "QT", contact: "CT", whatsapp_order: "WA" };

function makeRef(type: EnquiryType) {
  let s = "";
  for (let i = 0; i < 6; i++) s += REF_ALPHABET[randomInt(REF_ALPHABET.length)];
  return `${REF_PREFIX[type]}-${s}`;
}

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`enquiry:${ip}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many submissions. Please try again in a few minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    // sendBeacon may arrive without a JSON content type, so parse the raw text.
    body = JSON.parse(await req.text());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json({ error: `Please check ${issue?.path.join(".") || "your details"}.` }, { status: 400 });
  }
  const data = parsed.data;

  // Bots fill hidden fields; pretend success so they don't retry.
  if (data.website) return NextResponse.json({ ok: true, ref: makeRef(data.type) });

  if (data.type === "quote" && !data.name) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (data.type !== "whatsapp_order" && !data.email && !data.phone) {
    return NextResponse.json({ error: "Please give an email or phone number so we can reply." }, { status: 400 });
  }
  if (data.type === "contact" && !data.message) {
    return NextResponse.json({ error: "Please enter a message." }, { status: 400 });
  }

  // Catalog items take their name from the catalog; custom items keep the typed name.
  const items: EnquiryItem[] = data.items.flatMap((i) => {
    const product = i.slug ? getProduct(i.slug) : undefined;
    if (product) return [{ slug: product.slug, name: product.name, size: i.size, quantity: i.quantity, unitPrice: i.unitPrice }];
    return i.name ? [{ name: i.name, size: i.size, quantity: i.quantity }] : [];
  });
  if (data.type === "quote" && items.length === 0) {
    return NextResponse.json({ error: "Add at least one product with a quantity." }, { status: 400 });
  }
  const details = data.details && Object.fromEntries(Object.entries(data.details).filter(([, v]) => v));

  const now = new Date();
  const ref = data.type === "whatsapp_order" ? data.ref : makeRef(data.type);
  const doc: EnquiryDoc = {
    ref,
    type: data.type,
    status: "new",
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    country: data.country,
    subject: data.subject,
    message: data.message,
    items,
    total: data.type === "whatsapp_order" ? data.total : undefined,
    details: details && Object.keys(details).length ? details : undefined,
    notes: [],
    ip,
    userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? undefined,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const db = await getDb();
    await db.collection<EnquiryDoc>("enquiries").insertOne(doc);
  } catch (err) {
    // A repeated WhatsApp beacon with the same ref is already stored.
    if ((err as { code?: number }).code === 11000 && data.type === "whatsapp_order") {
      return NextResponse.json({ ok: true, ref });
    }
    console.error("[api/enquiries] insert failed", err);
    return NextResponse.json({ error: "We couldn't save your request. Please message us on WhatsApp instead." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, ref }, { status: 201 });
}
