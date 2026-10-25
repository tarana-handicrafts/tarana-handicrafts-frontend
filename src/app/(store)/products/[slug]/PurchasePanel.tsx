"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";
import { nextTier, unitPrice, type ProductSize } from "@/lib/pricing";
import { whatsappLink } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

interface PurchasePanelProps {
  slug: string;
  name: string;
  image: string;
  sizes: ProductSize[];
  /** Absolute product URL, included in the WhatsApp message. */
  url: string;
}

export default function PurchasePanel({ slug, name, image, sizes, url }: PurchasePanelProps) {
  const [sizeIndex, setSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(slug);

  const size = sizes[sizeIndex];
  const each = unitPrice(size, quantity);
  const tier = nextTier(size, quantity);

  const handleAddToCart = () => {
    addToCart({ slug, name, image, size: size.label, price: size.price, bulk: size.bulk }, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const buyNowMessage = `Hi, I'd like to order:\n${name} — ${size.label}\nQuantity: ${quantity} × ${formatPrice(each)} = ${formatPrice(
    each * quantity
  )}\n\n${url}`;

  return (
    <div>
      {/* Price */}
      <div className="mb-2 flex items-baseline gap-3">
        <span className="font-serif text-4xl font-bold text-[#C5A059]">{formatPrice(each)}</span>
        <span className="text-sm text-stone-500">per piece</span>
        {each < size.price && (
          <span className="rounded-lg bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
            Bulk price · save {formatPrice((size.price - each) * quantity)}
          </span>
        )}
      </div>
      {tier && (
        <p className="mb-6 text-sm text-[#B8934E]">
          Order {tier.minQty}+ pieces for {formatPrice(tier.price)} each
        </p>
      )}

      {/* Size selector */}
      {sizes.length > 1 && (
        <fieldset className="mb-6">
          <legend className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-500">
            Size: <span className="text-stone-900">{size.label}</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setSizeIndex(i)}
                aria-pressed={i === sizeIndex}
                className={`rounded-xl border px-4 py-2 text-left transition-all ${
                  i === sizeIndex ? "border-[#C5A059] bg-[#C5A059]/10 ring-2 ring-[#C5A059]/30" : "border-stone-200 bg-white hover:border-stone-300"
                }`}
              >
                <span className="block text-sm font-semibold text-stone-900">{s.label}</span>
                <span className="block text-xs text-stone-500">{formatPrice(s.price)}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {sizes.length === 1 && (
        <p className="mb-6 text-sm text-stone-600">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Size: </span>
          {size.label}
        </p>
      )}

      {/* Bulk pricing table */}
      {size.bulk && size.bulk.length > 0 && (
        <div className="mb-6 rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/5 p-4">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-[#C5A059]">Wholesale Pricing · {size.label}</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#C5A059]/20 text-left">
                <th className="pb-2 pr-4 font-medium text-stone-500">Quantity</th>
                <th className="pb-2 font-medium text-stone-500">Unit Price</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stone-100">
                <td className="py-2 pr-4 text-stone-700">1+ pcs</td>
                <td className="py-2 font-semibold text-stone-800">{formatPrice(size.price)}</td>
              </tr>
              {[...size.bulk].sort((a, b) => a.minQty - b.minQty).map((t) => (
                <tr key={t.minQty} className="border-b border-stone-100 last:border-0">
                  <td className="py-2 pr-4 text-stone-700">{t.minQty}+ pcs</td>
                  <td className="py-2 font-semibold text-[#C5A059]">{formatPrice(t.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-xl border border-stone-200 bg-white">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-3 text-stone-600 transition-colors hover:text-[#C5A059]"
            aria-label="Decrease quantity"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(10000, Math.floor(Number(e.target.value) || 1))))}
            className="w-14 bg-transparent text-center text-lg font-semibold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            aria-label="Quantity"
          />
          <button
            onClick={() => setQuantity(Math.min(10000, quantity + 1))}
            className="px-4 py-3 text-stone-600 transition-colors hover:text-[#C5A059]"
            aria-label="Increase quantity"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-8 py-4 text-lg font-semibold text-white transition-all ${
            justAdded ? "bg-green-600" : "bg-[#C5A059] hover:bg-[#B8934E] hover:shadow-lg"
          }`}
        >
          {justAdded ? (
            <>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Added to Cart
            </>
          ) : (
            <>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              Add to Cart · {formatPrice(each * quantity)}
            </>
          )}
        </button>

        <button
          onClick={() => toggleWishlist(slug)}
          className={`rounded-xl border p-4 transition-all ${
            wishlisted ? "border-red-200 bg-red-50 text-red-500" : "border-stone-200 bg-white text-stone-600 hover:border-red-200 hover:text-red-500"
          }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
        >
          <svg className="h-6 w-6" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <a
        href={whatsappLink(buyNowMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-8 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] py-3 font-semibold text-[#1a9e4b] transition-all hover:bg-[#25D366] hover:text-white"
      >
        <WhatsAppIcon />
        Buy now on WhatsApp
      </a>

      <Link
        href={`/rfq?product=${encodeURIComponent(slug)}`}
        className="mb-8 flex items-center justify-between gap-4 rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/5 px-5 py-4 transition-all hover:border-[#C5A059] hover:bg-[#C5A059]/10"
      >
        <span className="flex items-center gap-3">
          <svg className="h-6 w-6 shrink-0 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>
            <span className="block text-sm font-semibold text-stone-900">Buying in bulk, custom sizes or for export?</span>
            <span className="block text-xs text-stone-500">Get manufacturer-direct pricing, branding options &amp; lead times.</span>
          </span>
        </span>
        <span className="hidden shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] sm:inline">Request Quote →</span>
      </Link>
    </div>
  );
}
