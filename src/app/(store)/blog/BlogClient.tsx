"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/storeApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BlogClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch(`${API_URL}/api/blog/public/categories`)
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", "12");
      if (selectedCategory) params.set("category", selectedCategory);

      const res = await fetch(`${API_URL}/api/blog/public?${params.toString()}`);
      const data = await res.json();
      setPosts(data.posts || []);
      setPagination(data.pagination || { page: 1, limit: 12, total: 0, pages: 0 });
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);
  useEffect(() => { setCurrentPage(1); }, [selectedCategory]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  const categoryColors: Record<string, string> = {
    craft: "bg-amber-100 text-amber-800",
    product: "bg-blue-100 text-blue-800",
    trade: "bg-green-100 text-green-800",
    heritage: "bg-purple-100 text-purple-800",
    "behind-the-scenes": "bg-rose-100 text-rose-800",
    news: "bg-cyan-100 text-cyan-800",
  };

  const featured = posts.length > 0 ? posts[0] : null;
  const restPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-[#F9F8F6] pb-16 pt-32">
      {/* Header */}
      <section className="px-4 pb-12">
        <div className="mx-auto max-w-7xl text-center">
          <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
            Our Journal
          </span>
          <h1 className="mb-4 font-serif text-4xl md:text-5xl">
            Blog &{" "}
            <span className="font-light italic text-stone-500">Insights</span>
          </h1>
          <p className="mx-auto max-w-2xl text-stone-500">
            Stories from the workshop, guides for buyers, and insights into the world of handcrafted wooden art.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      {categories.length > 0 && (
        <section className="px-4 pb-10">
          <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory("")}
              className={`rounded-full border px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                !selectedCategory
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full border px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                  selectedCategory === cat
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                }`}
              >
                {cat.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Content */}
      <section className="px-4">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="py-20 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-[#C5A059]" />
              <p className="mt-4 text-stone-500">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center">
              <h3 className="mb-2 font-serif text-2xl text-stone-700">No posts yet</h3>
              <p className="text-stone-500">Check back soon for new articles and guides.</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group mb-12 block overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all duration-500 hover:shadow-xl"
                >
                  <div className="grid gap-0 md:grid-cols-2">
                    <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto">
                      {featured.coverImage ? (
                        <Image
                          src={featured.coverImage}
                          alt={featured.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                      ) : (
                        <div className="flex h-full min-h-[300px] items-center justify-center bg-stone-100">
                          <span className="font-serif text-6xl text-stone-300">T</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center p-8 md:p-12">
                      <div className="mb-4 flex items-center gap-3">
                        {featured.category && (
                          <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${categoryColors[featured.category] || "bg-stone-100 text-stone-600"}`}>
                            {featured.category.replace(/_/g, " ")}
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                          Featured
                        </span>
                      </div>
                      <h2 className="mb-3 font-serif text-2xl leading-tight text-stone-900 transition-colors group-hover:text-[#C5A059] md:text-3xl">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="mb-6 line-clamp-3 text-sm font-light leading-relaxed text-stone-500">
                          {featured.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-sm text-stone-400">
                        <span>{featured.author || "Tarana Handicrafts"}</span>
                        {featured.publishedAt && (
                          <>
                            <span className="text-stone-300">·</span>
                            <span>{formatDate(featured.publishedAt)}</span>
                          </>
                        )}
                        {featured.readTime && (
                          <>
                            <span className="text-stone-300">·</span>
                            <span>{featured.readTime} min read</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Posts Grid */}
              {restPosts.length > 0 && (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {restPosts.map((post) => (
                    <Link
                      key={post._id}
                      href={`/blog/${post.slug}`}
                      className="group overflow-hidden rounded-xl border border-stone-200 bg-white transition-all duration-500 hover:shadow-xl"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {post.coverImage ? (
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-stone-100">
                            <span className="font-serif text-5xl text-stone-300">T</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="mb-3 flex items-center gap-3">
                          {post.category && (
                            <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${categoryColors[post.category] || "bg-stone-100 text-stone-600"}`}>
                              {post.category.replace(/_/g, " ")}
                            </span>
                          )}
                          {post.readTime && (
                            <span className="text-xs text-stone-400">{post.readTime} min read</span>
                          )}
                        </div>
                        <h3 className="mb-2 font-serif text-xl font-semibold leading-snug text-stone-900 transition-colors group-hover:text-[#C5A059]">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="mb-4 line-clamp-2 text-sm font-light leading-relaxed text-stone-500">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-stone-400">
                          <span>{post.author || "Tarana Handicrafts"}</span>
                          {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium hover:bg-stone-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const start = Math.max(1, Math.min(currentPage - 2, pagination.pages - 4));
                    const pageNum = start + i;
                    if (pageNum > pagination.pages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium ${
                          currentPage === pageNum ? "bg-[#C5A059] text-white" : "border border-stone-200 hover:bg-stone-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                    disabled={currentPage === pagination.pages}
                    className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium hover:bg-stone-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl bg-[#C5A059] px-6 py-16 text-center md:px-16">
            <span className="mb-3 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-white/70">
              Explore Our Collection
            </span>
            <h2 className="mb-4 font-serif text-3xl text-white md:text-4xl">
              Discover Handcrafted{" "}
              <span className="font-light italic">Artistry</span>
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-sm font-light text-white/80">
              Each piece tells a story of centuries-old tradition, crafted by skilled artisans in Jaipur, India.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/products"
                className="rounded-lg bg-white px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059] transition-all hover:bg-stone-900 hover:text-white"
              >
                Shop Now
              </Link>
              <Link
                href="/about"
                className="rounded-lg border-2 border-white/40 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:border-white hover:bg-white hover:text-[#C5A059]"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
