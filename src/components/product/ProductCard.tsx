"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";
import type { ProductSummary } from "@/lib/pricing";

interface ProductCardProps {
  product: ProductSummary;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const saved = isWishlisted(product.slug);
  const href = `/products/${product.slug}`;

  const quickAdd = () => {
    if (!product.onlySize) return;
    addToCart({
      slug: product.slug,
      name: product.name,
      image: product.image.src,
      size: product.onlySize.label,
      price: product.onlySize.price,
      bulk: product.onlySize.bulk,
    });
  };

  return (
    <article className="group relative overflow-hidden rounded-xl border border-stone-200 bg-white transition-all hover:shadow-xl">
      <Link href={href} className="block">
        <div className="relative aspect-square overflow-hidden bg-stone-100">
          {product.bulkFromPrice && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-[#C5A059] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Bulk from {formatPrice(product.bulkFromPrice)}
            </span>
          )}
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
          />
        </div>
      </Link>

      <button
        onClick={() => toggleWishlist(product.slug)}
        className={`absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 shadow-sm transition-colors ${
          saved ? "text-red-500" : "text-stone-500 hover:text-red-500"
        }`}
        aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        aria-pressed={saved}
      >
        <svg className="h-4 w-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <div className="p-4">
        <p className="mb-1 text-xs uppercase tracking-wider text-stone-500">
          {product.categoryName}
          {product.material ? ` • ${product.material}` : ""}
        </p>
        <Link href={href}>
          <h3 className="mb-1 line-clamp-1 font-semibold transition-colors hover:text-[#C5A059]">{product.name}</h3>
        </Link>
        <p className="mb-3 line-clamp-2 text-sm text-stone-500">{product.shortDescription}</p>
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-[#C5A059]">
              {product.sizeCount > 1 && <span className="mr-1 text-xs font-medium text-stone-500">from</span>}
              {formatPrice(product.fromPrice)}
            </p>
            {product.sizeCount > 1 && <p className="text-xs text-stone-500">{product.sizeCount} sizes</p>}
          </div>
          {product.onlySize ? (
            <button
              onClick={quickAdd}
              className="rounded-lg bg-[#C5A059]/10 p-2 text-[#C5A059] transition-colors hover:bg-[#C5A059] hover:text-white"
              aria-label={`Add ${product.name} to cart`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          ) : (
            <Link
              href={href}
              className="rounded-lg bg-[#C5A059]/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] transition-colors hover:bg-[#C5A059] hover:text-white"
            >
              Choose size
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
