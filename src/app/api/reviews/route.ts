import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb, type ReviewDoc } from "@/lib/mongodb";
import { getProduct } from "@/lib/catalog";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const EMPTY = { reviews: [], stats: { avgRating: 0, totalReviews: 0, distribution: {} } };

/** Approved reviews for one product. Cached at the CDN so product pages stay fast. */
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("product") ?? "";
  if (!getProduct(slug)) return NextResponse.json({ error: "Unknown product." }, { status: 404 });

  try {
    const db = await getDb();
    const docs = await db
      .collection<ReviewDoc>("reviews")
      .find({ product: slug, status: "approved" }, { projection: { email: 0, ip: 0 } })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    const distribution: Record<number, number> = {};
    let sum = 0;
    for (const r of docs) {
      distribution[r.rating] = (distribution[r.rating] ?? 0) + 1;
      sum += r.rating;
    }

    return NextResponse.json(
      {
        reviews: docs.map((r) => ({
          id: r._id.toString(),
          name: r.name,
          rating: r.rating,
          title: r.title,
          content: r.content,
          adminReply: r.adminReply,
          createdAt: r.createdAt.toISOString(),
        })),
        stats: { avgRating: docs.length ? sum / docs.length : 0, totalReviews: docs.length, distribution },
      },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } }
    );
  } catch (err) {
    console.error("[api/reviews] read failed", err);
    // Fail soft: the page still works, it just shows no reviews.
    return NextResponse.json(EMPTY, { headers: { "Cache-Control": "no-store" } });
  }
}

const reviewSchema = z.object({
  product: z.string().max(120),
  website: z.string().max(200).optional(), // honeypot
  name: z.string().trim().min(1).max(80),
  email: z.union([z.literal(""), z.string().trim().email().max(254)]).optional().transform((v) => v || undefined),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().max(120).optional().transform((v) => v || undefined),
  content: z.string().trim().min(10).max(2000),
});

/** New reviews are saved as pending and only appear after approval in the admin panel. */
export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`review:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many reviews submitted. Please try again later." }, { status: 429 });
  }

  const parsed = reviewSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path.join(".");
    return NextResponse.json({ error: field === "content" ? "Please write at least 10 characters." : "Please check your review details." }, { status: 400 });
  }
  const data = parsed.data;
  if (!getProduct(data.product)) return NextResponse.json({ error: "Unknown product." }, { status: 404 });
  if (data.website) return NextResponse.json({ ok: true });

  const now = new Date();
  try {
    const db = await getDb();
    await db.collection<ReviewDoc>("reviews").insertOne({
      product: data.product,
      name: data.name,
      email: data.email,
      rating: data.rating,
      title: data.title,
      content: data.content,
      status: "pending",
      ip,
      createdAt: now,
      updatedAt: now,
    });
  } catch (err) {
    console.error("[api/reviews] insert failed", err);
    return NextResponse.json({ error: "We couldn't save your review. Please try again later." }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
