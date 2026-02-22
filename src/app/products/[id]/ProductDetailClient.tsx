"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, getProductById, getSimilarProducts, ProductImage, ProductReview } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

interface ProductDetailClientProps {
  productId: string;
}

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const numericId = Number(productId);

  // Derive product and similar products from productId using useMemo
  const product = useMemo(() => getProductById(numericId), [numericId]);
  const similarProducts = useMemo(
    () => (product ? getSimilarProducts(product, 4) : []),
    [product]
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">("description");
  const [isZoomed, setIsZoomed] = useState(false);
  const { addToCart, cart } = useCart();


  if (!product) {
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
  const isInCart = cart.some((item) => item.id === product.id);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-5 w-5 ${star <= Math.round(rating) ? "text-amber-400" : "text-stone-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      {/* Breadcrumb */}
      <div className="border-b border-stone-200 bg-white px-4 pt-28 pb-4">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-sm text-stone-500">
            <Link href="/" className="transition-colors hover:text-[#C5A059]">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="transition-colors hover:text-[#C5A059]">
              Products
            </Link>
            <span>/</span>
            <Link href={`/products?category=${product.category}`} className="transition-colors hover:text-[#C5A059]">
              {product.category}
            </Link>
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
              {/* Main Image */}
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
                <div className="absolute bottom-4 right-4 rounded-full bg-white/80 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <svg className="h-5 w-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        selectedImage === index
                          ? "border-[#C5A059] ring-2 ring-[#C5A059]/30"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category & SKU */}
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-[#C5A059]/10 px-4 py-1 text-sm font-medium text-[#C5A059]">
                  {product.category}
                </span>
                {product.sku && (
                  <span className="text-sm text-stone-400">SKU: {product.sku}</span>
                )}
              </div>

              {/* Title */}
              <h1 className="mb-4 font-serif text-3xl md:text-4xl lg:text-5xl">{product.name}</h1>

              {/* Rating */}
              {product.rating && (
                <div className="mb-6 flex items-center gap-3">
                  {renderStars(product.rating)}
                  <span className="font-medium text-stone-800">{product.rating.toFixed(1)}</span>
                  <span className="text-stone-400">|</span>
                  <Link href="#reviews" className="text-stone-500 transition-colors hover:text-[#C5A059]">
                    {product.reviewCount || 0} Reviews
                  </Link>
                </div>
              )}

              {/* Price */}
              <div className="mb-6 flex items-baseline gap-4">
                <span className="font-serif text-4xl font-bold text-[#C5A059]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-stone-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="rounded-lg bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>

              {/* Short Description */}
              <p className="mb-6 text-lg leading-relaxed text-stone-600">
                {product.description || "A beautiful handcrafted piece from our collection."}
              </p>

              {/* Material & Dimensions */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-stone-200 bg-white p-4">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-400">Material</span>
                  <span className="text-lg font-medium">{product.material}</span>
                </div>
                {product.dimensions && (
                  <div className="rounded-xl border border-stone-200 bg-white p-4">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-400">Dimensions</span>
                    <span className="text-lg font-medium">{product.dimensions}</span>
                  </div>
                )}
              </div>

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
                      <span className="text-sm text-amber-600">
                        (Only {product.stockCount} left!)
                      </span>
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
                {/* Quantity Selector */}
                <div className="flex items-center rounded-xl border border-stone-200 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-stone-600 transition-colors hover:text-[#C5A059]"
                    aria-label="Decrease quantity"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="px-4 py-3 text-stone-600 transition-colors hover:text-[#C5A059]"
                    aria-label="Increase quantity"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isInCart || product.inStock === false}
                  className={`flex-1 rounded-xl px-8 py-4 text-lg font-semibold transition-all ${
                    isInCart
                      ? "bg-green-500 text-white"
                      : product.inStock === false
                      ? "cursor-not-allowed bg-stone-300 text-stone-500"
                      : "bg-[#C5A059] text-white hover:bg-[#B8934E] hover:shadow-lg"
                  }`}
                >
                  {isInCart ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Added to Cart
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Add to Cart
                    </span>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  className="rounded-xl border border-stone-200 bg-white p-4 text-stone-600 transition-all hover:border-red-200 hover:text-red-500"
                  aria-label="Add to wishlist"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-stone-200 bg-white p-4 sm:grid-cols-4">
                <div className="flex flex-col items-center text-center">
                  <svg className="mb-2 h-8 w-8 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span className="text-xs font-medium text-stone-600">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <svg className="mb-2 h-8 w-8 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs font-medium text-stone-600">Authentic Product</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <svg className="mb-2 h-8 w-8 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-xs font-medium text-stone-600">Easy Returns</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <svg className="mb-2 h-8 w-8 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-xs font-medium text-stone-600">Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="border-t border-stone-200 bg-white px-4 py-12">
        <div className="mx-auto max-w-7xl">
          {/* Tab Navigation */}
          <div className="mb-8 flex flex-wrap gap-2 border-b border-stone-200">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "description"
                  ? "border-b-2 border-[#C5A059] text-[#C5A059]"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("specifications")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "specifications"
                  ? "border-b-2 border-[#C5A059] text-[#C5A059]"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "reviews"
                  ? "border-b-2 border-[#C5A059] text-[#C5A059]"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Reviews ({product.reviewCount || 0})
            </button>
          </div>

          {/* Tab Content */}
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
                {product.specifications && product.specifications.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {product.specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-5 py-4"
                      >
                        <span className="font-medium text-stone-500">{spec.label}</span>
                        <span className="text-stone-800">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-5 py-4">
                      <span className="font-medium text-stone-500">Material</span>
                      <span className="text-stone-800">{product.material}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-5 py-4">
                      <span className="font-medium text-stone-500">Category</span>
                      <span className="text-stone-800">{product.category}</span>
                    </div>
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
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div id="reviews">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="mb-2 font-serif text-2xl">Customer Reviews</h3>
                    {product.rating && (
                      <div className="flex items-center gap-3">
                        {renderStars(product.rating)}
                        <span className="text-lg font-semibold">{product.rating.toFixed(1)} out of 5</span>
                        <span className="text-stone-500">({product.reviewCount} reviews)</span>
                      </div>
                    )}
                  </div>
                  <button className="rounded-xl bg-[#C5A059] px-6 py-3 font-medium text-white transition-colors hover:bg-[#B8934E]">
                    Write a Review
                  </button>
                </div>

                {/* Reviews List */}
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
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
              <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
                You May Also Like
              </span>
              <h2 className="font-serif text-3xl md:text-4xl">Similar Products</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((item) => (
                <SimilarProductCard key={item.id} product={item} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#C5A059] px-8 py-3 font-medium text-[#C5A059] transition-all hover:bg-[#C5A059] hover:text-white"
              >
                View All Products
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// Review Card Component
function ReviewCard({ review }: { review: ProductReview }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C5A059]/10 text-lg font-bold text-[#C5A059]">
            {review.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{review.author}</span>
              {review.verified && (
                <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            <span className="text-sm text-stone-500">{formatDate(review.date)}</span>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`h-4 w-4 ${star <= review.rating ? "text-amber-400" : "text-stone-300"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      <h4 className="mb-2 font-semibold">{review.title}</h4>
      <p className="text-stone-600">{review.content}</p>
    </div>
  );
}

// Similar Product Card Component
function SimilarProductCard({ product }: { product: Product }) {
  const { addToCart, cart } = useCart();
  const isInCart = cart.some((item) => item.id === product.id);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative overflow-hidden rounded-xl border border-stone-200 bg-white transition-all hover:shadow-xl"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        {product.tag && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#C5A059] px-3 py-1 text-xs font-medium text-white">
            {product.tag}
          </span>
        )}
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
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            disabled={isInCart}
            className={`rounded-lg px-6 py-3 font-medium transition-transform hover:scale-105 ${
              isInCart ? "bg-green-500 text-white" : "bg-white text-[#C5A059]"
            }`}
          >
            {isInCart ? "✓ Added" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="mb-1 text-xs uppercase tracking-wider text-stone-500">
          {product.category} • {product.material}
        </p>
        <h3 className="mb-2 font-semibold line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-[#C5A059]">{formatPrice(product.price)}</p>
          {product.rating && (
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
