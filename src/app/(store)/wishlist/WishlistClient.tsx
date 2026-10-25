"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductSummary } from "@/lib/pricing";

export default function WishlistClient({ products }: { products: ProductSummary[] }) {
  const { items } = useWishlist();
  const saved = products.filter((p) => items.includes(p.slug));

  return (
    <div className="min-h-screen bg-[#F9F8F6] px-4 pb-16 pt-32">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 text-center">
          <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
            Your Collection
          </span>
          <h1 className="mb-4 font-serif text-4xl md:text-5xl">Wishlist</h1>
          <p className="text-stone-500">
            {saved.length > 0 ? `${saved.length} item${saved.length !== 1 ? "s" : ""} saved` : "Your wishlist is empty"}
          </p>
        </header>

        {saved.length === 0 ? (
          <div className="py-20 text-center">
            <svg className="mx-auto mb-4 h-16 w-16 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="mb-2 text-xl font-semibold text-stone-700">Your wishlist is empty</h3>
            <p className="mb-6 text-stone-500">Browse our collection and save items you love.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-[#C5A059] px-8 py-3 font-medium text-white transition-all hover:bg-[#B8934E]"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {saved.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
