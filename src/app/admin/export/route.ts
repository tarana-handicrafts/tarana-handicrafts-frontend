import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { getDb, buildEnquiryFilter, type EnquiryDoc } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cell(value: unknown): string {
  let s = value == null ? "" : String(value);
  // Stop spreadsheet apps from treating user input as a formula.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

/** CSV download of enquiries, using the same filters as the admin list. */
export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sp = new URL(req.url).searchParams;
  const filter = buildEnquiryFilter({ type: sp.get("type") ?? undefined, status: sp.get("status") ?? undefined, q: sp.get("q") ?? undefined });
  const db = await getDb();
  const rows = await db.collection<EnquiryDoc>("enquiries").find(filter).sort({ createdAt: -1 }).limit(10000).toArray();

  const header = ["Ref", "Date", "Type", "Status", "Name", "Email", "Phone", "Company", "Country", "Subject", "Message", "Items", "Total", "Details", "Notes"];
  const lines = rows.map((e) =>
    [
      e.ref,
      e.createdAt.toISOString(),
      e.type,
      e.status,
      e.name,
      e.email,
      e.phone,
      e.company,
      e.country,
      e.subject,
      e.message,
      e.items.map((i) => `${i.name}${i.size ? ` (${i.size})` : ""} x${i.quantity}${i.unitPrice != null ? ` @${i.unitPrice}` : ""}`).join("; "),
      e.total,
      Object.entries(e.details ?? {}).map(([k, v]) => `${k}: ${v}`).join("; "),
      e.notes.map((n) => n.text).join(" | "),
    ]
      .map(cell)
      .join(",")
  );

  const csv = "\uFEFF" + [header.map(cell).join(","), ...lines].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tarana-enquiries-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
