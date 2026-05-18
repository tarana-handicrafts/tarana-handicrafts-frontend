"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import type { Product, ProductFilters, CategoryNode } from "@/lib/storeApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProductsClient() {
  const { addToCart, cart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilters | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch filter options
  useEffect(() => {
    fetch(`${API_URL}/api/products/filters`)
      .then(res => res.json())
      .then(data => setFilters(data))
      .catch(err => console.error("Failed to fetch filters:", err));
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", "20");
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory) params.set("categoryId", selectedCategory);
      if (selectedMaterial) params.set("material", selectedMaterial);
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);

      const res = await fetch(`${API_URL}/api/products/public?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory, selectedMaterial, sortBy, sortOrder]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedMaterial, sortBy, sortOrder]);

  const isInCart = (productId: string) => {
    return cart.some((item) => (item as unknown as { _id?: string })._id === productId);
  };

  // Flatten category tree for dropdown
  const flatCategories = flattenCategories(filters?.categories || []);

  return (
    <>
      {/* Filters Bar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4">
        {/* Search */}
        <div className="relative w-full sm:w-auto">
          <label htmlFor="product-search" className="sr-only">Search products</label>
          <input
            id="product-search"
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            maxLength={100}
            className="w-full rounded-lg border border-stone-200 bg-transparent px-4 py-2 pl-10 focus:border-[#C5A059] focus:outline-none sm:w-64"
          />
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Category Filter */}
          <label htmlFor="category-filter" className="sr-only">Filter by category</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-stone-200 bg-white px-4 py-2 focus:border-[#C5A059] focus:outline-none"
          >
            <option value="">All Categories</option>
            {flatCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {"—".repeat(cat.level)} {cat.name}
              </option>
            ))}
          </select>

          {/* Material Filter */}
          <label htmlFor="material-filter" className="sr-only">Filter by material</label>
          <select
            id="material-filter"
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
            className="rounded-lg border border-stone-200 bg-white px-4 py-2 focus:border-[#C5A059] focus:outline-none"
          >
            <option value="">All Materials</option>
            {(filters?.materials || []).map((mat) => (
              <option key={mat} value={mat}>{mat}</option>
            ))}
          </select>

          {/* Sort */}
          <label htmlFor="sort-filter" className="sr-only">Sort products</label>
          <select
            id="sort-filter"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortBy(field);
              setSortOrder(order);
            }}
            className="rounded-lg border border-stone-200 bg-white px-4 py-2 focus:border-[#C5A059] focus:outline-none"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name A-Z</option>
            <option value="rating-desc">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <p className="mb-6 text-stone-500" aria-live="polite">
        Showing {products.length} of {pagination.total} products
      </p>

      {/* Loading State */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-[#C5A059]" />
          <p className="mt-4 text-stone-500">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-stone-200">
            <svg className="h-10 w-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold">No products found</h3>
          <p className="text-stone-500">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => addToCart(product as never)}
                isInCart={isInCart(product._id)}
                priority={index < 4}
              />
            ))}
          </div>

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
                      currentPage === pageNum
                        ? "bg-[#C5A059] text-white"
                        : "border border-stone-200 hover:bg-stone-50"
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
    </>
  );
}

// Helper: flatten category tree for select dropdown
function flattenCategories(categories: CategoryNode[], level = 0): (CategoryNode & { level: number })[] {
  const result: (CategoryNode & { level: number })[] = [];
  for (const cat of categories) {
    result.push({ ...cat, level });
    if (cat.children && cat.children.length > 0) {
      result.push(...flattenCategories(cat.children, level + 1));
    }
  }
  return result;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  isInCart: boolean;
  priority?: boolean;
}

function ProductCard({ product, onAddToCart, isInCart, priority = false }: ProductCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-stone-200 bg-white transition-all hover:shadow-xl">
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          {product.tag && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-[#C5A059] px-3 py-1 text-xs font-medium text-white">
              {product.tag}
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="absolute right-3 top-3 z-10 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
          <Image
            src={product.image}
            alt={`${product.name} - ${product.category} handcrafted${product.material ? ` from ${product.material}` : ''}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={(e) => { e.preventDefault(); onAddToCart(); }}
              disabled={isInCart}
              className={`rounded-lg px-6 py-3 font-medium transition-transform hover:scale-105 ${isInCart ? "bg-green-500 text-white" : "bg-white text-[#C5A059]"}`}
            >
              {isInCart ? "✓ Added" : "Add to Cart"}
            </button>
            <span className="rounded-lg bg-white/80 px-4 py-2 text-sm font-medium text-stone-700">View Details</span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <p className="mb-1 text-xs uppercase tracking-wider text-stone-500">
          {product.category}{product.material ? ` • ${product.material}` : ''}
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
          <div className="flex items-center gap-2">
            {product.rating ? (
              <div className="flex items-center gap-1 text-sm">
                <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">{product.rating}</span>
              </div>
            ) : null}
            <button
              onClick={onAddToCart}
              disabled={isInCart}
              className="rounded-lg bg-[#C5A059]/10 p-2 text-[#C5A059] transition-colors hover:bg-[#C5A059] hover:text-white disabled:opacity-50"
              aria-label={`Add ${product.name} to cart`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

