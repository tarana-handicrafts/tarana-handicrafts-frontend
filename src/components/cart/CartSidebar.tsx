"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart, type CartLine } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { nextTier, unitPrice } from "@/lib/pricing";
import { siteConfig, whatsappLink } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/** Short human-friendly reference shared between the WhatsApp message and the admin log. */
function makeOrderRef(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return "WA-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

const clean = (text: string) => String(text).replace(/[<>*_~]/g, "").slice(0, 100).trim();

function buildMessage(ref: string, cart: CartLine[], lineTotal: (l: CartLine) => number, total: number) {
  const lines = cart
    .slice(0, 30)
    .map(
      (l, i) =>
        `${i + 1}. ${clean(l.name)} — ${clean(l.size)}\n    ${l.qty} × ${formatPrice(unitPrice(l, l.qty))} = ${formatPrice(lineTotal(l))}`
    )
    .join("\n");

  return `*${siteConfig.name} — Order ${ref}*

I would like to order:
${lines}

*Estimated total: ${formatPrice(total)}*

Please confirm availability, shipping cost and delivery time.`;
}

export function CartSidebar() {
  const { cart, isCartOpen, closeCart, removeFromCart, setQty, lineTotal, cartTotal, cartCount } = useCart();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isCartOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen, closeCart]);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const ref = makeOrderRef();

    // Open WhatsApp synchronously (inside the click) so pop-up blockers allow it.
    window.open(whatsappLink(buildMessage(ref, cart, lineTotal, cartTotal)), "_blank", "noopener,noreferrer");

    // Log the order intent for the admin panel; never blocks the customer.
    const payload = JSON.stringify({
      type: "whatsapp_order",
      ref,
      items: cart.map((l) => ({ slug: l.slug, name: l.name, size: l.size, quantity: l.qty, unitPrice: unitPrice(l, l.qty) })),
      total: cartTotal,
    });
    try {
      const blob = new Blob([payload], { type: "application/json" });
      if (!navigator.sendBeacon?.("/api/enquiries", blob)) {
        fetch("/api/enquiries", { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
      }
    } catch {
      // Logging is best-effort
    }
    closeCart();
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm transition-opacity" onClick={closeCart} aria-hidden="true" />

      {/* Sidebar */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="fixed right-0 top-0 z-[150] flex h-full w-full max-w-md flex-col bg-[#F9F8F6] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 p-5">
          <h2 className="font-serif text-xl">Your Cart ({cartCount})</h2>
          <button
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-stone-200"
            aria-label="Close cart"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-stone-200">
                <svg className="h-10 w-10 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="mb-2 font-serif text-lg">Your cart is empty</h3>
              <p className="mb-6 text-sm text-stone-500">Add a hand-carved piece to get started.</p>
              <Link
                href="/products"
                onClick={closeCart}
                className="rounded-full bg-stone-900 px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-[#C5A059]"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map((line) => {
                const each = unitPrice(line, line.qty);
                const tier = nextTier(line, line.qty);
                return (
                  <li key={`${line.slug}|${line.size}`} className="flex gap-4 rounded-xl border border-stone-200 bg-white p-3">
                    <Link
                      href={`/products/${line.slug}`}
                      onClick={closeCart}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-100"
                    >
                      <Image src={line.image} alt={line.name} fill className="object-cover" sizes="80px" />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="line-clamp-1 font-serif text-sm text-stone-900">{line.name}</h4>
                          <p className="text-xs text-stone-500">Size: {line.size}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(line.slug, line.size)}
                          className="shrink-0 p-1 text-stone-400 transition-colors hover:text-red-500"
                          aria-label={`Remove ${line.name} (${line.size}) from cart`}
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-2">
                        <div className="flex items-center rounded-full border border-stone-200">
                          <button
                            onClick={() => setQty(line.slug, line.size, line.qty - 1)}
                            disabled={line.qty <= 1}
                            className="h-7 w-7 text-stone-600 disabled:opacity-30"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={line.qty}
                            onChange={(e) => setQty(line.slug, line.size, Number(e.target.value))}
                            className="w-10 bg-transparent text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                            aria-label={`Quantity for ${line.name}`}
                          />
                          <button
                            onClick={() => setQty(line.slug, line.size, line.qty + 1)}
                            className="h-7 w-7 text-stone-600"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-stone-900">{formatPrice(lineTotal(line))}</p>
                          <p className={`text-[11px] ${each < line.price ? "text-green-700" : "text-stone-400"}`}>
                            {formatPrice(each)} each{each < line.price ? " · bulk price" : ""}
                          </p>
                        </div>
                      </div>

                      {tier && (
                        <p className="text-[11px] text-[#B8934E]">
                          Add {tier.minQty - line.qty} more for {formatPrice(tier.price)} each
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-stone-200 bg-white p-5">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-stone-600">Estimated total</span>
              <span className="font-serif text-2xl text-stone-900">{formatPrice(cartTotal)}</span>
            </div>
            <p className="mb-4 text-xs text-stone-500">Shipping is confirmed on WhatsApp. No payment is taken on the website.</p>
            <button
              onClick={handleCheckout}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-4 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[#128C7E]"
            >
              <WhatsAppIcon />
              Order via WhatsApp
            </button>
            <Link
              href="/rfq?from=cart"
              onClick={closeCart}
              className="mt-3 block w-full py-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-stone-500 transition-colors hover:text-[#C5A059]"
            >
              Need a formal quote instead?
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
