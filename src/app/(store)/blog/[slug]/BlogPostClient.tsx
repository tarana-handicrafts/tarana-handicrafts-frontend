"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/storeApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BlogPostClient() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_URL}/api/blog/public/${slug}`)
      .then(res => { if (!res.ok) throw new Error("Not found"); return res.json(); })
      .then(data => setPost(data.post))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F8F6] pt-24">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#C5A059] border-t-transparent" />
          <p className="text-stone-500">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F8F6] pt-24">
        <div className="text-center">
          <h1 className="mb-4 font-serif text-4xl">Article Not Found</h1>
          <Link href="/blog" className="text-[#C5A059] hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      {/* Breadcrumb */}
      <div className="border-b border-stone-200 bg-white px-4 pt-28 pb-4">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-sm text-stone-500">
            <Link href="/" className="transition-colors hover:text-[#C5A059]">Home</Link>
            <span>/</span>
            <Link href="/blog" className="transition-colors hover:text-[#C5A059]">Blog</Link>
            <span>/</span>
            <span className="text-stone-800 line-clamp-1">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <section className="px-4 pb-12 pt-12">
        <div className="mx-auto max-w-3xl text-center">
          {/* Category */}
          {post.category && (
            <span className="mb-4 inline-block rounded-full bg-[#C5A059]/10 px-4 py-1 text-xs font-medium text-[#C5A059] capitalize">
              {post.category.replace(/_/g, " ")}
            </span>
          )}

          {/* Title */}
          <h1 className="mb-6 font-serif text-3xl md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mx-auto mb-8 max-w-2xl text-lg font-light leading-relaxed text-stone-500">
              {post.excerpt}
            </p>
          )}

          {/* Author & Date */}
          <div className="flex items-center justify-center gap-4 border-t border-stone-200 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C5A059]/10 text-sm font-bold text-[#C5A059]">
                {post.author?.charAt(0) || "T"}
              </div>
              <div className="text-left">
                <p className="font-medium text-stone-800">{post.author || "Tarana Handicrafts"}</p>
                {post.publishedAt && (
                  <p className="text-sm text-stone-500">{formatDate(post.publishedAt)}</p>
                )}
              </div>
            </div>
            {post.readTime && (
              <>
                <span className="text-stone-300">|</span>
                <span className="text-sm text-stone-500">{post.readTime} min read</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <section className="px-4 pb-12">
          <div className="mx-auto max-w-5xl">
            <div className="relative aspect-[21/9] overflow-hidden rounded-2xl border border-stone-200 bg-white">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <article className="px-4 pb-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-stone-200 bg-white p-8 md:p-12">
            <div className="prose prose-lg prose-stone max-w-none">
              {post.content ? (
                <div
                  dangerouslySetInnerHTML={{ __html: formatBlogContent(post.content) }}
                />
              ) : post.excerpt ? (
                <p className="text-lg font-light leading-relaxed text-stone-600">{post.excerpt}</p>
              ) : null}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 border-t border-stone-200 pt-6">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-stone-200 bg-[#F9F8F6] px-4 py-1.5 text-xs font-medium text-stone-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Back to Blog */}
          <div className="mt-10 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900 transition-all hover:border-[#C5A059] hover:text-[#C5A059]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L3 12m0 0l4-5m-4 5h18" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="px-4 pb-16">
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

function formatBlogContent(content: string): string {
  return content
    .split(/\n\n+/)
    .map(para => {
      const trimmed = para.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("# ")) return `<h1 class="font-serif text-3xl md:text-4xl mb-6 mt-10">${trimmed.slice(2)}</h1>`;
      if (trimmed.startsWith("## ")) return `<h2 class="font-serif text-2xl md:text-3xl mb-4 mt-8">${trimmed.slice(3)}</h2>`;
      if (trimmed.startsWith("### ")) return `<h3 class="font-serif text-xl md:text-2xl mb-3 mt-6">${trimmed.slice(4)}</h3>`;
      return `<p class="mb-5 text-base md:text-lg font-light leading-relaxed text-stone-600">${trimmed.replace(/\n/g, "<br/>")}</p>`;
    })
    .filter(Boolean)
    .join("\n");
}
