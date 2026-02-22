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
              <Link href={`/products/${product.id}`} className="block">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Quick Add Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}
                      className="rounded-lg bg-white px-6 py-3 font-medium text-[var(--color-primary)] transition-transform hover:scale-105"
                    >
                      Add to Cart
                    </button>
                    <span className="rounded-lg bg-white/80 px-4 py-2 text-sm font-medium text-stone-700">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <p className="mb-1 text-xs uppercase tracking-wider text-[var(--color-muted)]">
                  {product.category} • {product.material}
                </p>
                <Link href={`/products/${product.id}`}>
                  <h3 className="mb-2 font-semibold line-clamp-1 transition-colors hover:text-[var(--color-primary)]">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-[var(--color-primary)]">
                    {formatPrice(product.price)}
                  </p>
                  {product.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium">{product.rating}</span>
                    </div>
                  )}
                </div>
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
