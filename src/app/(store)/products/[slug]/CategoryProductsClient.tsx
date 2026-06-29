"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/storeApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface CategoryProductsClientProps {
  categoryId: string;
  categoryName: string;
}

export default function CategoryProductsClient({ categoryId, categoryName }: CategoryProductsClientProps) {
  const { addToCart, cart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [material, setMaterial] = useState("");
  const [materials, setMaterials] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    if (!categoryId) { setLoading(false); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", "20");
      params.set("categoryId", categoryId);
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
      if (material) params.set("material", material);

      const res = await fetch(`${API_URL}/api/products/public?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, pages: 0 });

      if (!material && data.products?.length) {
        const mats = [...new Set(data.products.map((p: Product) => p.material).filter(Boolean))] as string[];
        setMaterials(mats);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId, currentPage, sortBy, sortOrder, material]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setCurrentPage(1); }, [sortBy, sortOrder, material]);

  const isInCart = (productId: string) => cart.some((item) => (item as unknown as { _id?: string })._id === productId);

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4">
        <p className="text-stone-500" aria-live="polite">
          Showing {products.length} of {pagination.total} products
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {materials.length > 0 && (
            <select value={material} onChange={(e) => setMaterial(e.target.value)}
              className="rounded-lg border border-stone-200 bg-white px-4 py-2 focus:border-[#C5A059] focus:outline-none">
              <option value="">All Materials</option>
              {materials.map((m) => <option key={m} value={m!}>{m}</option>)}
            </select>
          )}
          <select value={`${sortBy}-${sortOrder}`}
            onChange={(e) => { const [field, order] = e.target.value.split("-"); setSortBy(field); setSortOrder(order); }}
            className="rounded-lg border border-stone-200 bg-white px-4 py-2 focus:border-[#C5A059] focus:outline-none">
            <option value="createdAt-desc">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name A-Z</option>
            <option value="rating-desc">Top Rated</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-[#C5A059]" />
          <p className="mt-4 text-stone-500">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center">
          <h3 className="mb-2 text-xl font-semibold text-stone-700">No products in this category</h3>
          <p className="text-stone-500">Check back soon or browse our other categories.</p>
          <Link href="/products" className="mt-4 inline-block text-[#C5A059] hover:underline">View All Products</Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <article key={product._id} className="group relative overflow-hidden rounded-xl border border-stone-200 bg-white transition-all hover:shadow-xl">
                <Link href={`/products/${product._id}`} className="block">
                  <div className="relative aspect-square overflow-hidden">
                    {product.tag && (
                      <span className="absolute left-3 top-3 z-10 rounded-full bg-[#C5A059] px-3 py-1 text-xs font-medium text-white">{product.tag}</span>
                    )}
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="absolute right-3 top-3 z-10 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    )}
                    <Image src={product.image} alt={`${product.name} - ${product.category} handcrafted`} fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      loading={index < 4 ? "eager" : "lazy"} priority={index < 4} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <button onClick={(e) => { e.preventDefault(); addToCart(product as never); }} disabled={isInCart(product._id)}
                        className={`rounded-lg px-6 py-3 font-medium transition-transform hover:scale-105 ${isInCart(product._id) ? "bg-green-500 text-white" : "bg-white text-[#C5A059]"}`}>
                        {isInCart(product._id) ? "✓ Added" : "Add to Cart"}
                      </button>
                      <span className="rounded-lg bg-white/80 px-4 py-2 text-sm font-medium text-stone-700">View Details</span>
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <p className="mb-1 text-xs uppercase tracking-wider text-stone-500">
                    {product.category}{product.material ? ` • ${product.material}` : ""}
                  </p>
                  <Link href={`/products/${product._id}`}>
                    <h3 className="mb-2 font-semibold line-clamp-1 transition-colors hover:text-[#C5A059]">{product.name}</h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-[#C5A059]">{formatPrice(product.price)}</p>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-sm text-stone-500 line-through">{formatPrice(product.originalPrice)}</p>
                      )}
                    </div>
                    {product.rating ? (
                      <div className="flex items-center gap-1 text-sm">
                        <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-medium">{product.rating}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium hover:bg-stone-50 disabled:opacity-50">Previous</button>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const start = Math.max(1, Math.min(currentPage - 2, pagination.pages - 4));
                const pageNum = start + i;
                if (pageNum > pagination.pages) return null;
                return (
                  <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${currentPage === pageNum ? "bg-[#C5A059] text-white" : "border border-stone-200 hover:bg-stone-50"}`}>
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))} disabled={currentPage === pagination.pages}
                className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium hover:bg-stone-50 disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}
    </>
  );
}
