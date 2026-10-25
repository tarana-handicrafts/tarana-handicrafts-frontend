"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Category, ProductSummary } from "@/lib/pricing";

type SortKey = "featured" | "price-asc" | "price-desc" | "name-asc";

interface ProductsClientProps {
  products: ProductSummary[];
  categories: Category[];
}

/** Filters run in the browser over the full (small) catalog shipped with the page. */
export default function ProductsClient({ products, categories }: ProductsClientProps) {
  const [rootSlug, setRootSlug] = useState("");
  const [subSlug, setSubSlug] = useState("");
  const [material, setMaterial] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [query, setQuery] = useState("");

  const materials = useMemo(
    () => [...new Set(products.map((p) => p.material).filter(Boolean) as string[])].sort(),
    [products]
  );
  const subCategories = categories.find((c) => c.slug === rootSlug)?.children ?? [];

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = products.filter((p) => {
      if (rootSlug && !p.categoryPath.includes(rootSlug)) return false;
      if (subSlug && !p.categoryPath.includes(subSlug)) return false;
      if (material && p.material !== material) return false;
      if (q && !`${p.name} ${p.shortDescription} ${p.categoryName} ${p.material ?? ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.fromPrice - b.fromPrice);
    else if (sort === "price-desc") sorted.sort((a, b) => b.fromPrice - a.fromPrice);
    else if (sort === "name-asc") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    return sorted;
  }, [products, rootSlug, subSlug, material, sort, query]);

  const chip = (active: boolean) =>
    `rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
      active ? "bg-stone-900 text-white shadow" : "border border-stone-200 bg-white text-stone-600 hover:border-[#C5A059] hover:text-[#C5A059]"
    }`;

  return (
    <>
      {/* Category chips */}
      <div className="mb-4 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by category">
        <button className={chip(!rootSlug)} onClick={() => { setRootSlug(""); setSubSlug(""); }} aria-pressed={!rootSlug}>
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            className={chip(rootSlug === c.slug)}
            onClick={() => { setRootSlug(c.slug); setSubSlug(""); }}
            aria-pressed={rootSlug === c.slug}
          >
            {c.name}
          </button>
        ))}
      </div>
      {subCategories.length > 0 && (
        <div className="mb-6 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by sub-category">
          {subCategories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setSubSlug(subSlug === c.slug ? "" : c.slug)}
              aria-pressed={subSlug === c.slug}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                subSlug === c.slug ? "bg-[#C5A059] text-white" : "bg-[#C5A059]/10 text-[#B8934E] hover:bg-[#C5A059]/20"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Filters Bar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4">
        <div className="relative w-full sm:w-auto">
          <label htmlFor="product-search" className="sr-only">Search products</label>
          <input
            id="product-search"
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={100}
            className="w-full rounded-lg border border-stone-200 bg-transparent px-4 py-2 pl-10 focus:border-[#C5A059] focus:outline-none sm:w-64"
          />
          <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label htmlFor="material-filter" className="sr-only">Filter by material</label>
          <select
            id="material-filter"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="rounded-lg border border-stone-200 bg-white px-4 py-2 focus:border-[#C5A059] focus:outline-none"
          >
            <option value="">All Materials</option>
            {materials.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <label htmlFor="sort-filter" className="sr-only">Sort products</label>
          <select
            id="sort-filter"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-stone-200 bg-white px-4 py-2 focus:border-[#C5A059] focus:outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name A-Z</option>
          </select>
        </div>
      </div>

      <p className="mb-6 text-stone-500" aria-live="polite">
        Showing {visible.length} of {products.length} products
      </p>

      {visible.length === 0 ? (
        <div className="py-20 text-center">
          <h3 className="mb-2 text-xl font-semibold">No products found</h3>
          <p className="text-stone-500">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((product, index) => (
            <ProductCard key={product.slug} product={product} priority={index < 4} />
          ))}
        </div>
      )}
    </>
  );
}
