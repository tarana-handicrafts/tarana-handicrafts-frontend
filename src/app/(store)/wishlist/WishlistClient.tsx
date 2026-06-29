"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/storeApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function WishlistClient() {
  const { items, toggleWishlist, count } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Fetch each product individually (or batch if API supports)
    Promise.all(
      items.map(id =>
        fetch(`${API_URL}/api/products/${id}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => data?.product || null)
          .catch(() => null)
      )
    )
      .then(results => setProducts(results.filter(Boolean)))
      .finally(() => setLoading(false));
  }, [items]);

  return (
    <div className="min-h-screen bg-[#F9F8F6] px-4 pb-16 pt-32">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
            Your Collection
          </span>
          <h1 className="mb-4 font-serif text-4xl md:text-5xl">Wishlist</h1>
          <p className="text-stone-500">
            {count > 0 ? `${count} item${count !== 1 ? "s" : ""} saved` : "Your wishlist is empty"}
          </p>
        </header>

        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-[#C5A059]" />
            <p className="mt-4 text-stone-500">Loading...</p>
          </div>
        ) : products.length === 0 ? (
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
            {products.map((product) => (
              <article key={product._id} className="group relative overflow-hidden rounded-xl border border-stone-200 bg-white transition-all hover:shadow-xl">
                <Link href={`/products/${product._id}`} className="block">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <p className="mb-1 text-xs uppercase tracking-wider text-stone-500">{product.category}</p>
                  <Link href={`/products/${product._id}`}>
                    <h3 className="mb-2 font-semibold line-clamp-1 transition-colors hover:text-[#C5A059]">{product.name}</h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-[#C5A059]">{formatPrice(product.price)}</p>
                    <button
                      onClick={() => toggleWishlist(product._id)}
                      className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                      aria-label="Remove from wishlist"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
