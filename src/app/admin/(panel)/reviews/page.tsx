import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import { getDb, REVIEW_STATUSES, type ReviewDoc, type ReviewStatus } from "@/lib/mongodb";
import { getProduct } from "@/lib/catalog";
import { deleteReview, replyToReview, setReviewStatus } from "../../actions";
import { ConfirmButton } from "../ConfirmButton";
import { formatDate } from "../labels";

const STYLES: Record<ReviewStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default async function ReviewsAdminPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const { status } = await searchParams;
  const active = (REVIEW_STATUSES as readonly string[]).includes(status ?? "") ? (status as ReviewStatus) : undefined;
  const db = await getDb();
  const reviews = await db
    .collection<ReviewDoc>("reviews")
    .find(active ? { status: active } : {}, { projection: { ip: 0 } })
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();

  const tab = (s?: ReviewStatus) =>
    `rounded-full px-4 py-1.5 text-sm ${active === s ? "bg-[#8B4513] text-white" : "border border-stone-200 bg-white text-stone-600 hover:border-[#8B4513]"}`;

  return (
    <div className="max-w-5xl">
      <h1 className="mb-2 font-serif text-3xl">Reviews</h1>
      <p className="mb-6 text-sm text-stone-500">New reviews stay hidden until you approve them. Approved reviews can take up to 5 minutes to show on the site.</p>

      <nav className="mb-6 flex flex-wrap gap-2">
        <Link href="/admin/reviews" className={tab()}>All</Link>
        {REVIEW_STATUSES.map((s) => (
          <Link key={s} href={`/admin/reviews?status=${s}`} className={tab(s)}>{s}</Link>
        ))}
      </nav>

      <div className="space-y-4">
        {reviews.map((r) => {
          const id = r._id.toString();
          const product = getProduct(r.product);
          return (
            <article key={id} className="rounded-xl border border-stone-200 bg-white p-5">
              <header className="mb-2 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm">
                    <span className="text-amber-500">{"★".repeat(r.rating)}</span>
                    <span className="text-stone-300">{"★".repeat(5 - r.rating)}</span>
                    <span className="ml-2 font-semibold">{r.name}</span>
                    {r.email && <span className="ml-2 text-stone-500">{r.email}</span>}
                  </p>
                  <p className="text-xs text-stone-400">
                    {formatDate(r.createdAt)} · on{" "}
                    <Link href={`/products/${r.product}`} target="_blank" className="underline">{product?.name ?? r.product}</Link>
                  </p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs ${STYLES[r.status]}`}>{r.status}</span>
              </header>
              {r.title && <p className="font-medium">{r.title}</p>}
              <p className="mb-4 whitespace-pre-line text-sm text-stone-700">{r.content}</p>

              <form action={replyToReview} className="mb-3 flex gap-2">
                <input type="hidden" name="id" value={id} />
                <input name="reply" defaultValue={r.adminReply ?? ""} placeholder="Public reply (optional)" maxLength={2000} className="min-w-0 flex-1 rounded-lg border border-stone-200 px-3 py-1.5 text-sm" />
                <button type="submit" className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm hover:border-[#8B4513]">Save reply</button>
              </form>

              <div className="flex flex-wrap items-center gap-2">
                {r.status !== "approved" && (
                  <form action={setReviewStatus}>
                    <input type="hidden" name="id" value={id} />
                    <input type="hidden" name="status" value="approved" />
                    <button type="submit" className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700">Approve</button>
                  </form>
                )}
                {r.status !== "rejected" && (
                  <form action={setReviewStatus}>
                    <input type="hidden" name="id" value={id} />
                    <input type="hidden" name="status" value="rejected" />
                    <button type="submit" className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm hover:border-red-400">{r.status === "approved" ? "Hide" : "Reject"}</button>
                  </form>
                )}
                <form action={deleteReview} className="ml-auto">
                  <input type="hidden" name="id" value={id} />
                  <ConfirmButton message="Delete this review permanently?" className="text-sm text-red-600 hover:underline">Delete</ConfirmButton>
                </form>
              </div>
            </article>
          );
        })}
      </div>
      {reviews.length === 0 && <p className="text-stone-500">No reviews here.</p>}
    </div>
  );
}
