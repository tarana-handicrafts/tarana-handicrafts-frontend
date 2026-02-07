"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Product, productsData } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

const categories = ["All", ...new Set(productsData.map((p) => p.category))];
const materials = ["All", ...new Set(productsData.map((p) => p.material))];

export default function ProductsPage() {
  const { addToCart, cart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    let products = [...productsData];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.material.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      products = products.filter((p) => p.category === selectedCategory);
    }

    // Filter by material
    if (selectedMaterial !== "All") {
      products = products.filter((p) => p.material === selectedMaterial);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;
      case "name":
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return products;
  }, [selectedCategory, selectedMaterial, sortBy, searchQuery]);

  const isInCart = (productId: number) => {
    return cart.some((item) => item.id === productId);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Our Collection</h1>
          <p className="mx-auto max-w-2xl text-[var(--color-muted)]">
            Explore our curated collection of handcrafted masterpieces. Each
            piece is unique and made with love by skilled artisans.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--background)] p-4">
          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-transparent px-4 py-2 pl-10 focus:border-[var(--color-primary)] focus:outline-none sm:w-64"
            />
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-transparent px-4 py-2 focus:border-[var(--color-primary)] focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>

            {/* Material Filter */}
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-transparent px-4 py-2 focus:border-[var(--color-primary)] focus:outline-none"
            >
              {materials.map((mat) => (
                <option key={mat} value={mat}>
                  {mat === "All" ? "All Materials" : mat}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-transparent px-4 py-2 focus:border-[var(--color-primary)] focus:outline-none"
            >
              <option value="default">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="mb-6 text-[var(--color-muted)]">
          Showing {filteredProducts.length} of {productsData.length} products
        </p>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-border)]">
              <svg
                className="h-10 w-10 text-[var(--color-muted)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">No products found</h3>
            <p className="text-[var(--color-muted)]">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addToCart(product)}
                isInCart={isInCart(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  isInCart: boolean;
}

function ProductCard({ product, onAddToCart, isInCart }: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--background)] transition-all hover:shadow-xl">
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
            onClick={onAddToCart}
            disabled={isInCart}
            className={`rounded-lg px-6 py-3 font-medium transition-transform hover:scale-105 ${
              isInCart
                ? "bg-green-500 text-white"
                : "bg-white text-[var(--color-primary)]"
            }`}
          >
            {isInCart ? "✓ Added" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="mb-1 text-xs uppercase tracking-wider text-[var(--color-muted)]">
          {product.category} • {product.material}
        </p>
        <h3 className="mb-2 font-semibold line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-[var(--color-primary)]">
            {formatPrice(product.price)}
          </p>
          <button
            onClick={onAddToCart}
            disabled={isInCart}
            className="rounded-lg bg-[var(--color-primary)]/10 p-2 text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-white disabled:opacity-50"
            aria-label="Add to cart"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
