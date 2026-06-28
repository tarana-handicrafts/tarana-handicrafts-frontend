"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";
import type { Product, ProductImage } from "@/lib/storeApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ProductDetailClientProps {
  productId: string;
}

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">("description");
  const [isZoomed, setIsZoomed] = useState(false);
  const { addToCart, cart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  // Reviews state
  const [reviews, setReviews] = useState<{ _id: string; name: string; rating: number; title?: string; content?: string; verified: boolean; adminReply?: string; createdAt: string }[]>([]);
  const [reviewStats, setReviewStats] = useState<{ avgRating: number; totalReviews: number; distribution: Record<number, number> } | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", email: "", rating: 5, title: "", content: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_URL}/api/products/${productId}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data.product);

        if (data.product?.category) {
          const simRes = await fetch(
            `${API_URL}/api/products/public?category=${encodeURIComponent(data.product.category)}&limit=5`
          );
          if (simRes.ok) {
            const simData = await simRes.json();
            setSimilarProducts(
              (simData.products || []).filter((p: Product) => p._id !== productId).slice(0, 4)
            );
          }
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [productId]);

  // Fetch reviews
  useEffect(() => {
    if (activeTab !== "reviews" || !productId) return;
    setReviewLoading(true);
    fetch(`${API_URL}/api/reviews/product/${productId}`)
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews || []);
        setReviewStats(data.stats || null);
      })
      .catch(() => {})
      .finally(() => setReviewLoading(false));
  }, [activeTab, productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewMessage("");
    try {
      const res = await fetch(`${API_URL}/api/reviews/product/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setReviewMessage(data.message || "Review submitted!");
      setReviewForm({ name: "", email: "", rating: 5, title: "", content: "" });
      setShowReviewForm(false);
      // Refresh reviews
      const refreshRes = await fetch(`${API_URL}/api/reviews/product/${productId}`);
      const refreshData = await refreshRes.json();
      setReviews(refreshData.reviews || []);
      setReviewStats(refreshData.stats || null);
    } catch (err: unknown) {
      setReviewMessage(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F8F6] pt-24">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#C5A059] border-t-transparent"></div>
          <p className="text-stone-500">Loading product...</p>
        </div>
      </div>
    );
  }

  const images: ProductImage[] = product.images || [{ url: product.image, alt: product.name }];
  const isInCart = cart.some((item) => (item as unknown as { _id?: string })._id === product._id);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product as never);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`h-5 w-5 ${star <= Math.round(rating) ? "text-amber-400" : "text-stone-300"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      {/* Breadcrumb */}
      <div className="border-b border-stone-200 bg-white px-4 pt-28 pb-4">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-sm text-stone-500">
            <Link href="/" className="transition-colors hover:text-[#C5A059]">Home</Link>
            <span>/</span>
            <Link href="/products" className="transition-colors hover:text-[#C5A059]">Products</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category}`} className="transition-colors hover:text-[#C5A059]">{product.category}</Link>
            <span>/</span>
            <span className="text-stone-800">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div
                className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-stone-200 bg-white"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                {product.tag && (
                  <span className="absolute left-4 top-4 z-10 rounded-full bg-[#C5A059] px-4 py-1.5 text-sm font-medium text-white shadow-lg">
                    {product.tag}
                  </span>
                )}
                {discount > 0 && (
                  <span className="absolute right-4 top-4 z-10 rounded-full bg-red-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg">
                    -{discount}%
                  </span>
                )}
                <Image
                  src={images[selectedImage]?.url || product.image}
                  alt={images[selectedImage]?.alt || product.name}
                  fill
                  className={`object-cover transition-transform duration-500 ${isZoomed ? "scale-150" : "group-hover:scale-105"}`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        selectedImage === index ? "border-[#C5A059] ring-2 ring-[#C5A059]/30" : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-[#C5A059]/10 px-4 py-1 text-sm font-medium text-[#C5A059]">{product.category}</span>
                {product.sku && <span className="text-sm text-stone-500">SKU: {product.sku}</span>}
              </div>

              <h1 className="mb-4 font-serif text-3xl md:text-4xl lg:text-5xl">{product.name}</h1>

              {/* Rating from real reviews */}
              {reviewStats && reviewStats.totalReviews > 0 ? (
                <div className="mb-6 flex items-center gap-3">
                  {renderStars(reviewStats.avgRating)}
                  <span className="font-medium text-stone-800">{reviewStats.avgRating.toFixed(1)}</span>
                  <span className="text-stone-500">|</span>
                  <button onClick={() => setActiveTab("reviews")} className="text-stone-500 transition-colors hover:text-[#C5A059]">
                    {reviewStats.totalReviews} Reviews
                  </button>
                </div>
              ) : product.rating && product.rating > 0 ? (
                <div className="mb-6 flex items-center gap-3">
                  {renderStars(product.rating)}
                  <span className="font-medium text-stone-800">{product.rating.toFixed(1)}</span>
                  <span className="text-stone-500">|</span>
                  <button onClick={() => setActiveTab("reviews")} className="text-stone-500 transition-colors hover:text-[#C5A059]">
                    {product.reviewCount || 0} Reviews
                  </button>
                </div>
              ) : null}

              {/* Price */}
              <div className="mb-6 flex items-baseline gap-4">
                <span className="font-serif text-4xl font-bold text-[#C5A059]">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-stone-500 line-through">{formatPrice(product.originalPrice)}</span>
                    <span className="rounded-lg bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>

              <p className="mb-6 text-lg leading-relaxed text-stone-600">
                {product.description || "A beautiful handcrafted piece from our collection."}
              </p>

              {/* Material & Dimensions */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                {product.material && (
                  <div className="rounded-xl border border-stone-200 bg-white p-4">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-500">Material</span>
                    <span className="text-lg font-medium">{product.material}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="rounded-xl border border-stone-200 bg-white p-4">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-500">Dimensions</span>
                    <span className="text-lg font-medium">{product.dimensions}</span>
                  </div>
                )}
                {product.woodType && (
                  <div className="rounded-xl border border-stone-200 bg-white p-4">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-500">Wood Type</span>
                    <span className="text-lg font-medium">{product.woodType}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="rounded-xl border border-stone-200 bg-white p-4">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-500">Weight</span>
                    <span className="text-lg font-medium">{product.weight}</span>
                  </div>
                )}
              </div>

              {/* MOQ & Wholesale Pricing */}
              {product.moq && product.moq > 1 && (
                <div className="mb-6 rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/5 p-4">
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-[#C5A059]">Wholesale Pricing</h3>
                  <p className="text-sm text-stone-600">Minimum Order Quantity: <strong>{product.moq} pieces</strong></p>
                  {product.priceTiers && product.priceTiers.length > 0 && (
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#C5A059]/20 text-left">
                            <th className="pb-2 pr-4 font-medium text-stone-500">Quantity</th>
                            <th className="pb-2 font-medium text-stone-500">Unit Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.priceTiers.map((tier, i) => (
                            <tr key={i} className="border-b border-stone-100">
                              <td className="py-2 pr-4 text-stone-700">{tier.minQty}+ pcs</td>
                              <td className="py-2 font-semibold text-[#C5A059]">{formatPrice(tier.unitPrice)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Availability */}
              <div className="mb-6 flex items-center gap-3">
                {product.inStock !== false ? (
                  <>
                    <span className="flex h-3 w-3">
                      <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                    </span>
                    <span className="font-medium text-green-700">In Stock</span>
                    {product.stockCount && product.stockCount <= 5 && (
                      <span className="text-sm text-amber-600">(Only {product.stockCount} left!)</span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="h-3 w-3 rounded-full bg-red-500"></span>
                    <span className="font-medium text-red-700">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="mb-8 flex flex-wrap items-center gap-4">
                <div className="flex items-center rounded-xl border border-stone-200 bg-white">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-stone-600 transition-colors hover:text-[#C5A059]" aria-label="Decrease quantity">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                  </button>
                  <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stockCount || 99, quantity + 1))} className="px-4 py-3 text-stone-600 transition-colors hover:text-[#C5A059]" aria-label="Increase quantity">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isInCart || product.inStock === false}
                  className={`flex-1 rounded-xl px-8 py-4 text-lg font-semibold transition-all ${
                    isInCart ? "bg-green-500 text-white" : product.inStock === false ? "cursor-not-allowed bg-stone-300 text-stone-500" : "bg-[#C5A059] text-white hover:bg-[#B8934E] hover:shadow-lg"
                  }`}
                >
                  {isInCart ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Added to Cart
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                      Add to Cart
                    </span>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product._id)}
                  className={`rounded-xl border p-4 transition-all ${
                    wishlisted
                      ? "border-red-200 bg-red-50 text-red-500"
                      : "border-stone-200 bg-white text-stone-600 hover:border-red-200 hover:text-red-500"
                  }`}
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg className="h-6 w-6" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Bulk / Wholesale CTA */}
              <Link
                href={`/rfq?product=${encodeURIComponent(product._id)}&name=${encodeURIComponent(product.name)}`}
                className="mb-8 flex items-center justify-between gap-4 rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/5 px-5 py-4 transition-all hover:border-[#C5A059] hover:bg-[#C5A059]/10"
              >
                <span className="flex items-center gap-3">
                  <svg className="h-6 w-6 shrink-0 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>
                    <span className="block text-sm font-semibold text-stone-900">Buying in bulk or for export?</span>
                    <span className="block text-xs text-stone-500">Get manufacturer-direct wholesale pricing &amp; lead times.</span>
                  </span>
                </span>
                <span className="hidden shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] sm:inline">Request Quote →</span>
              </Link>

              {/* Trust Badges (truthful) */}
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-stone-200 bg-white p-4 sm:grid-cols-4">
                <div className="flex flex-col items-center text-center">
                  <svg className="mb-2 h-8 w-8 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span className="text-xs font-medium text-stone-600">Handcrafted</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <svg className="mb-2 h-8 w-8 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs font-medium text-stone-600">Authentic Product</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <svg className="mb-2 h-8 w-8 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium text-stone-600">{product.leadTimeDays ? `${product.leadTimeDays}-day lead time` : "Quick Dispatch"}</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <svg className="mb-2 h-8 w-8 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium text-stone-600">Global Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="border-t border-stone-200 bg-white px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap gap-2 border-b border-stone-200">
            <button onClick={() => setActiveTab("description")} className={`px-6 py-3 font-medium transition-colors ${activeTab === "description" ? "border-b-2 border-[#C5A059] text-[#C5A059]" : "text-stone-500 hover:text-stone-800"}`}>
              Description
            </button>
            <button onClick={() => setActiveTab("specifications")} className={`px-6 py-3 font-medium transition-colors ${activeTab === "specifications" ? "border-b-2 border-[#C5A059] text-[#C5A059]" : "text-stone-500 hover:text-stone-800"}`}>
              Specifications
            </button>
            <button onClick={() => setActiveTab("reviews")} className={`px-6 py-3 font-medium transition-colors ${activeTab === "reviews" ? "border-b-2 border-[#C5A059] text-[#C5A059]" : "text-stone-500 hover:text-stone-800"}`}>
              Reviews ({reviewStats?.totalReviews || product.reviewCount || 0})
            </button>
          </div>

          <div className="min-h-[300px]">
            {/* Description Tab */}
            {activeTab === "description" && (
              <div className="prose prose-lg max-w-none">
                <div className="grid gap-8 lg:grid-cols-2">
                  <div>
                    <h3 className="mb-4 font-serif text-2xl">About This Product</h3>
                    <div className="whitespace-pre-line text-stone-600">
                      {product.longDescription || product.description || "A beautiful handcrafted piece from our collection."}
                    </div>
                    {product.careInstructions && (
                      <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-4">
                        <h4 className="mb-2 font-semibold text-stone-800">Care Instructions</h4>
                        <p className="text-sm text-stone-600">{product.careInstructions}</p>
                      </div>
                    )}
                  </div>
                  {product.features && product.features.length > 0 && (
                    <div>
                      <h3 className="mb-4 font-serif text-2xl">Key Features</h3>
                      <ul className="space-y-3">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <svg className="mt-1 h-5 w-5 flex-shrink-0 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-stone-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === "specifications" && (
              <div>
                <h3 className="mb-6 font-serif text-2xl">Product Specifications</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {product.specifications && product.specifications.length > 0 ? (
                    product.specifications.map((spec, index) => (
                      <div key={index} className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-5 py-4">
                        <span className="font-medium text-stone-500">{spec.label}</span>
                        <span className="text-stone-800">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      {product.material && (
                        <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-5 py-4">
                          <span className="font-medium text-stone-500">Material</span>
                          <span className="text-stone-800">{product.material}</span>
                        </div>
                      )}
                      {product.category && (
                        <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-5 py-4">
                          <span className="font-medium text-stone-500">Category</span>
                          <span className="text-stone-800">{product.category}</span>
                        </div>
                      )}
                      {product.weight && (
                        <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-5 py-4">
                          <span className="font-medium text-stone-500">Weight</span>
                          <span className="text-stone-800">{product.weight}</span>
                        </div>
                      )}
                      {product.dimensions && (
                        <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-5 py-4">
                          <span className="font-medium text-stone-500">Dimensions</span>
                          <span className="text-stone-800">{product.dimensions}</span>
                        </div>
                      )}
                      {product.woodType && (
                        <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-5 py-4">
                          <span className="font-medium text-stone-500">Wood Type</span>
                          <span className="text-stone-800">{product.woodType}</span>
                        </div>
                      )}
                      {product.hsCode && (
                        <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-5 py-4">
                          <span className="font-medium text-stone-500">HS Code</span>
                          <span className="text-stone-800">{product.hsCode}</span>
                        </div>
                      )}
                      {product.portOfLoading && (
                        <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-5 py-4">
                          <span className="font-medium text-stone-500">Port of Loading</span>
                          <span className="text-stone-800">{product.portOfLoading}</span>
                        </div>
                      )}
                      {product.originCountry && (
                        <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-5 py-4">
                          <span className="font-medium text-stone-500">Origin</span>
                          <span className="text-stone-800">{product.originCountry}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Packaging Info */}
                {product.packaging && (product.packaging.unitsPerCarton || product.packaging.cartonCBM) && (
                  <div className="mt-8">
                    <h4 className="mb-4 font-serif text-xl">Packaging & Export Info</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {product.packaging.unitsPerCarton && (
                        <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-5 py-4">
                          <span className="font-medium text-stone-500">Units per Carton</span>
                          <span className="text-stone-800">{product.packaging.unitsPerCarton}</span>
                        </div>
                      )}
                      {product.packaging.cartonCBM && (
                        <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-5 py-4">
                          <span className="font-medium text-stone-500">Carton CBM</span>
                          <span className="text-stone-800">{product.packaging.cartonCBM} m³</span>
                        </div>
                      )}
                      {product.packaging.netWeight && (
                        <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-5 py-4">
                          <span className="font-medium text-stone-500">Net Weight (per unit)</span>
                          <span className="text-stone-800">{product.packaging.netWeight}</span>
                        </div>
                      )}
                      {product.packaging.grossWeight && (
                        <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-5 py-4">
                          <span className="font-medium text-stone-500">Gross Weight (per carton)</span>
                          <span className="text-stone-800">{product.packaging.grossWeight}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab (Real Reviews) */}
            {activeTab === "reviews" && (
              <div id="reviews">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="mb-2 font-serif text-2xl">Customer Reviews</h3>
                    {reviewStats && reviewStats.totalReviews > 0 ? (
                      <div className="flex items-center gap-3">
                        {renderStars(reviewStats.avgRating)}
                        <span className="text-lg font-semibold">{reviewStats.avgRating.toFixed(1)} out of 5</span>
                        <span className="text-stone-500">({reviewStats.totalReviews} reviews)</span>
                      </div>
                    ) : (
                      <p className="text-stone-500">No reviews yet. Be the first to review this product!</p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="rounded-xl bg-[#C5A059] px-6 py-3 font-medium text-white transition-colors hover:bg-[#B8934E]"
                  >
                    Write a Review
                  </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="mb-8 rounded-2xl border border-stone-200 bg-stone-50 p-6">
                    <h4 className="mb-4 font-serif text-xl">Share Your Experience</h4>
                    {reviewMessage && (
                      <div className={`mb-4 rounded-lg p-3 text-sm ${reviewMessage.includes("Thank") || reviewMessage.includes("submitted") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {reviewMessage}
                      </div>
                    )}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-stone-700">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={reviewForm.name}
                          onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                          className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2 focus:border-[#C5A059] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-stone-700">Email *</label>
                        <input
                          type="email"
                          required
                          value={reviewForm.email}
                          onChange={e => setReviewForm({ ...reviewForm, email: e.target.value })}
                          className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2 focus:border-[#C5A059] focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="mb-1 block text-sm font-medium text-stone-700">Rating *</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="text-2xl transition-colors"
                          >
                            {star <= reviewForm.rating ? "★" : "☆"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="mb-1 block text-sm font-medium text-stone-700">Title</label>
                      <input
                        type="text"
                        value={reviewForm.title}
                        onChange={e => setReviewForm({ ...reviewForm, title: e.target.value })}
                        className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2 focus:border-[#C5A059] focus:outline-none"
                        placeholder="Summarize your experience"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="mb-1 block text-sm font-medium text-stone-700">Review</label>
                      <textarea
                        rows={4}
                        value={reviewForm.content}
                        onChange={e => setReviewForm({ ...reviewForm, content: e.target.value })}
                        className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2 focus:border-[#C5A059] focus:outline-none"
                        placeholder="Tell others about your experience with this product..."
                      />
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button
                        type="submit"
                        disabled={reviewSubmitting}
                        className="rounded-xl bg-[#C5A059] px-6 py-2 font-medium text-white transition-colors hover:bg-[#B8934E] disabled:opacity-50"
                      >
                        {reviewSubmitting ? "Submitting..." : "Submit Review"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="rounded-xl border border-stone-200 px-6 py-2 font-medium text-stone-600 transition-colors hover:bg-stone-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Rating Distribution */}
                {reviewStats && reviewStats.totalReviews > 0 && (
                  <div className="mb-8 rounded-2xl border border-stone-200 bg-stone-50 p-6">
                    <h4 className="mb-4 font-semibold">Rating Breakdown</h4>
                    {[5, 4, 3, 2, 1].map(rating => {
                      const count = reviewStats.distribution[rating] || 0;
                      const pct = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
                      return (
                        <div key={rating} className="mb-2 flex items-center gap-3">
                          <span className="w-8 text-sm text-stone-600">{rating}★</span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200">
                            <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-8 text-right text-sm text-stone-500">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Reviews List */}
                {reviewLoading ? (
                  <div className="py-10 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-[#C5A059]" />
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="rounded-2xl border border-stone-200 bg-white p-6">
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C5A059]/10 text-lg font-bold text-[#C5A059]">
                              {review.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{review.name}</span>
                                {review.verified && (
                                  <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Verified
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-stone-500">
                                {new Date(review.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                              <svg key={star} className={`h-4 w-4 ${star <= review.rating ? "text-amber-400" : "text-stone-300"}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        {review.title && <h4 className="mb-2 font-semibold">{review.title}</h4>}
                        {review.content && <p className="text-stone-600">{review.content}</p>}
                        {review.adminReply && (
                          <div className="mt-4 rounded-xl border border-[#C5A059]/20 bg-[#C5A059]/5 p-4">
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#C5A059]">Reply from Tarana Handicrafts</p>
                            <p className="text-sm text-stone-600">{review.adminReply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 py-16 text-center">
                    <svg className="mx-auto mb-4 h-16 w-16 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h4 className="mb-2 text-xl font-semibold text-stone-700">No reviews yet</h4>
                    <p className="text-stone-500">Be the first to share your thoughts about this product!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <section className="border-t border-stone-200 bg-[#F9F8F6] px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">You May Also Like</span>
              <h2 className="font-serif text-3xl md:text-4xl">Similar Products</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((item) => (
                <SimilarProductCard key={item._id} product={item} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/products" className="inline-flex items-center gap-2 rounded-xl border-2 border-[#C5A059] px-8 py-3 font-medium text-[#C5A059] transition-all hover:bg-[#C5A059] hover:text-white">
                View All Products
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function SimilarProductCard({ product }: { product: Product }) {
  const { addToCart, cart } = useCart();
  const isInCart = cart.some((item) => (item as unknown as { _id?: string })._id === product._id);

  return (
    <Link href={`/products/${product._id}`} className="group relative overflow-hidden rounded-xl border border-stone-200 bg-white transition-all hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden">
        {product.tag && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#C5A059] px-3 py-1 text-xs font-medium text-white">{product.tag}</span>
        )}
        <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product as never); }}
            disabled={isInCart}
            className={`rounded-lg px-6 py-3 font-medium transition-transform hover:scale-105 ${isInCart ? "bg-green-500 text-white" : "bg-white text-[#C5A059]"}`}
          >
            {isInCart ? "✓ Added" : "Add to Cart"}
          </button>
        </div>
      </div>
      <div className="p-4">
        <p className="mb-1 text-xs uppercase tracking-wider text-stone-500">{product.category} {product.material ? `• ${product.material}` : ""}</p>
        <h3 className="mb-2 font-semibold line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-[#C5A059]">{formatPrice(product.price)}</p>
          {product.rating && (
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
