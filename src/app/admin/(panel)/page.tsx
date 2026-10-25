import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import { getDb, type EnquiryDoc, type ReviewDoc } from "@/lib/mongodb";
import { formatPrice } from "@/lib/utils";
import { STATUS_STYLES, TYPE_LABELS, formatDate } from "./labels";

export default async function AdminDashboard() {
  // Layouts and pages render in parallel, so each page checks auth itself too.
  await requireAdmin();
  const db = await getDb();
  const enquiries = db.collection<EnquiryDoc>("enquiries");
  // This page is dynamic, so reading the clock per request is intended.
  // eslint-disable-next-line react-hooks/purity
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [newCount, weekCount, pendingReviews, byType, recent] = await Promise.all([
    enquiries.countDocuments({ status: "new" }),
    enquiries.countDocuments({ createdAt: { $gte: weekAgo } }),
    db.collection<ReviewDoc>("reviews").countDocuments({ status: "pending" }),
    enquiries.aggregate<{ _id: keyof typeof TYPE_LABELS; count: number }>([{ $group: { _id: "$type", count: { $sum: 1 } } }]).toArray(),
    enquiries.find({}, { projection: { ip: 0, userAgent: 0 } }).sort({ createdAt: -1 }).limit(8).toArray(),
  ]);

  const cards = [
    { label: "New enquiries", value: newCount, href: "/admin/enquiries?status=new" },
    { label: "Last 7 days", value: weekCount, href: "/admin/enquiries" },
    { label: "Reviews to approve", value: pendingReviews, href: "/admin/reviews?status=pending" },
    ...byType.map((t) => ({ label: TYPE_LABELS[t._id] ?? t._id, value: t.count, href: `/admin/enquiries?type=${t._id}` })),
  ];

  return (
    <div className="max-w-6xl">
      <h1 className="mb-6 font-serif text-3xl">Dashboard</h1>
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-xl border border-stone-200 bg-white p-5 hover:border-[#8B4513]">
            <p className="text-sm text-stone-500">{c.label}</p>
            <p className="mt-1 text-3xl font-semibold text-stone-900">{c.value}</p>
          </Link>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-semibold">Latest enquiries</h2>
      {recent.length === 0 ? (
        <p className="text-stone-500">Nothing yet. Submissions from the quote, contact and cart pages appear here.</p>
      ) : (
        <div className="divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white">
          {recent.map((e) => (
            <Link key={e._id.toString()} href={`/admin/enquiries?q=${e.ref}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm hover:bg-stone-50">
              <span className="flex items-center gap-3">
                <span className="font-mono text-xs text-stone-500">{e.ref}</span>
                <span className="font-medium">{e.name || TYPE_LABELS[e.type]}</span>
                {e.total != null && <span className="text-stone-500">{formatPrice(e.total)}</span>}
              </span>
              <span className="flex items-center gap-3">
                <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[e.status]}`}>{e.status}</span>
                <span className="text-stone-400">{formatDate(e.createdAt)}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
