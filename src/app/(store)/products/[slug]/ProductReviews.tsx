"use client";

import { useEffect, useRef, useState } from "react";

interface Review {
  id: string;
  name: string;
  rating: number;
  title?: string;
  content?: string;
  adminReply?: string;
  createdAt: string;
}

interface ReviewStats {
  avgRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
}

const EMPTY_FORM = { name: "", email: "", rating: 5, title: "", content: "", website: "" };

function Stars({ rating, size = "h-5 w-5" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`${size} ${star <= Math.round(rating) ? "text-amber-400" : "text-stone-300"}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/** Reviews load only when this section scrolls near the viewport, so they never delay the page. */
export default function ProductReviews({ productSlug }: { productSlug: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/reviews?product=${encodeURIComponent(productSlug)}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        setReviews(data.reviews ?? []);
        setStats(data.stats ?? null);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") setLoadError(true);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [visible, productSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, product: productSlug }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not submit your review. Please try again.");
      setMessage({ ok: true, text: "Thank you! Your review will appear once it has been approved." });
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Could not submit your review." });
    } finally {
      setSubmitting(false);
    }
  };

  const input = "w-full rounded-lg border border-stone-200 bg-white px-4 py-2 focus:border-[#C5A059] focus:outline-none";

  return (
    <section ref={sectionRef} id="reviews" className="border-t border-stone-200 bg-white px-4 py-16" aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 id="reviews-heading" className="mb-2 font-serif text-3xl">Customer Reviews</h2>
            {stats && stats.totalReviews > 0 ? (
              <div className="flex items-center gap-3">
                <Stars rating={stats.avgRating} />
                <span className="text-lg font-semibold">{stats.avgRating.toFixed(1)} out of 5</span>
                <span className="text-stone-500">({stats.totalReviews} review{stats.totalReviews === 1 ? "" : "s"})</span>
              </div>
            ) : (
              !loading && <p className="text-stone-500">{loadError ? "Reviews are unavailable right now." : "No reviews yet. Be the first to review this piece!"}</p>
            )}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-xl bg-[#C5A059] px-6 py-3 font-medium text-white transition-colors hover:bg-[#B8934E]"
          >
            Write a Review
          </button>
        </div>

        {message && (
          <div role="status" className={`mb-6 rounded-lg p-3 text-sm ${message.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-stone-200 bg-stone-50 p-6">
            <h3 className="mb-4 font-serif text-xl">Share Your Experience</h3>
            {/* Spam trap: hidden from people, bots fill it in */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="hidden"
              aria-hidden="true"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="review-name" className="mb-1 block text-sm font-medium text-stone-700">Your Name *</label>
                <input id="review-name" type="text" required maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
              </div>
              <div>
                <label htmlFor="review-email" className="mb-1 block text-sm font-medium text-stone-700">
                  Email <span className="font-normal text-stone-400">(optional, never shown)</span>
                </label>
                <input id="review-email" type="email" maxLength={254} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
              </div>
            </div>
            <fieldset className="mt-4">
              <legend className="mb-1 block text-sm font-medium text-stone-700">Rating *</legend>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm({ ...form, rating: star })}
                    className={`text-3xl transition-colors ${star <= form.rating ? "text-amber-400" : "text-stone-300"}`}
                    aria-label={`${star} star${star === 1 ? "" : "s"}`}
                    aria-pressed={star === form.rating}
                  >
                    ★
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="mt-4">
              <label htmlFor="review-title" className="mb-1 block text-sm font-medium text-stone-700">Title</label>
              <input id="review-title" type="text" maxLength={120} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} placeholder="Summarize your experience" />
            </div>
            <div className="mt-4">
              <label htmlFor="review-content" className="mb-1 block text-sm font-medium text-stone-700">Review *</label>
              <textarea
                id="review-content"
                rows={4}
                required
                minLength={10}
                maxLength={2000}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className={input}
                placeholder="How does the piece look in person? How was delivery?"
              />
            </div>
            <div className="mt-4 flex gap-3">
              <button type="submit" disabled={submitting} className="rounded-xl bg-[#C5A059] px-6 py-2 font-medium text-white transition-colors hover:bg-[#B8934E] disabled:opacity-50">
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-stone-200 px-6 py-2 font-medium text-stone-600 transition-colors hover:bg-stone-100">
                Cancel
              </button>
            </div>
          </form>
        )}

        {stats && stats.totalReviews > 0 && (
          <div className="mb-8 rounded-2xl border border-stone-200 bg-stone-50 p-6">
            <h3 className="mb-4 font-semibold">Rating Breakdown</h3>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.distribution[rating] || 0;
              const pct = (count / stats.totalReviews) * 100;
              return (
                <div key={rating} className="mb-2 flex items-center gap-3">
                  <span className="w-8 text-sm text-stone-600">{rating}★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-right text-sm text-stone-500">{count}</span>
                </div>
              );
            })}
          </div>
        )}

        {loading ? (
          <div className="py-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-[#C5A059]" />
          </div>
        ) : (
          reviews.length > 0 && (
            <div className="space-y-6">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-2xl border border-stone-200 bg-white p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C5A059]/10 text-lg font-bold text-[#C5A059]">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold">{review.name}</span>
                        <span className="block text-sm text-stone-500">
                          {new Date(review.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                    <Stars rating={review.rating} size="h-4 w-4" />
                  </div>
                  {review.title && <h3 className="mb-2 font-semibold">{review.title}</h3>}
                  {review.content && <p className="whitespace-pre-line text-stone-600">{review.content}</p>}
                  {review.adminReply && (
                    <div className="mt-4 rounded-xl border border-[#C5A059]/20 bg-[#C5A059]/5 p-4">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#C5A059]">Reply from Tarana Handicrafts</p>
                      <p className="text-sm text-stone-600">{review.adminReply}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
}
