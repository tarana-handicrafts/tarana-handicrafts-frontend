"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

interface TopSellerProps {
  products: Product[];
}

export function TopSeller({ products }: TopSellerProps) {
  const { addToCart } = useCart();

  // Get top 4 products for display
  const topProducts = products.slice(0, 4);

  return (
    <section className="py-20 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
            Curated Selection
          </span>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Top Sellers
          </h2>
          <p className="mx-auto max-w-2xl text-[var(--color-muted)]">
            Discover our most loved pieces, handpicked by art enthusiasts
            worldwide.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {topProducts.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--background)] transition-all hover:shadow-xl"
            >
              {/* Product Tag */}
              {product.tag && (
                <span className="absolute left-3 top-3 z-10 rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-medium text-white">
                  {product.tag}
                </span>
              )}

              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Quick Add Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => addToCart(product)}
                    className="rounded-lg bg-white px-6 py-3 font-medium text-[var(--color-primary)] transition-transform hover:scale-105"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <p className="mb-1 text-xs uppercase tracking-wider text-[var(--color-muted)]">
                  {product.category} • {product.material}
                </p>
                <h3 className="mb-2 font-semibold line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-[var(--color-primary)]">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-[var(--color-primary)] px-8 py-3 font-medium text-[var(--color-primary)] transition-all hover:bg-[var(--color-primary)] hover:text-white"
          >
            View All Products
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
