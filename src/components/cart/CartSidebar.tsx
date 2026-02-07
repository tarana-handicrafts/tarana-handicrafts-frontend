"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

// WhatsApp business number - Update this with your actual number
const WHATSAPP_NUMBER = "919509669135"; // Format: country code + number without +

export function CartSidebar() {
  const { cart, isCartOpen, closeCart, removeFromCart, cartTotal } = useCart();

  // Close cart on escape key
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

  // Generate WhatsApp message with order details
  const generateWhatsAppMessage = () => {
    const itemsList = cart
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} (${item.material}) - ${formatPrice(item.price)}`
      )
      .join("\n");

    const message = `*Tarana Handicrafts - Order Inquiry*

I am interested in the following pieces:
${itemsList}

*Total Estimate: ${formatPrice(cartTotal)}*

Please confirm availability and shipping timelines.`;

    return encodeURIComponent(message);
  };

  // Handle checkout - redirect to WhatsApp
  const handleCheckout = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, "_blank");
    closeCart();
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[var(--background)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
          <h2 className="text-xl font-bold">Your Cart ({cart.length})</h2>
          <button
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-border)]"
            aria-label="Close cart"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-border)]">
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Your cart is empty</h3>
              <p className="mb-6 text-[var(--color-muted)]">
                Add some beautiful handicrafts to your cart!
              </p>
              <button
                onClick={closeCart}
                className="rounded-lg bg-[var(--color-primary)] px-6 py-3 font-medium text-white transition-all hover:bg-[var(--color-primary-dark)]"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li
                  key={item.cartId}
                  className="flex gap-4 rounded-lg border border-[var(--color-border)] p-3"
                >
                  {/* Product Image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="font-medium line-clamp-1">{item.name}</h4>
                      <p className="text-sm text-[var(--color-muted)]">
                        {item.category}
                      </p>
                    </div>
                    <p className="font-semibold text-[var(--color-primary)]">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="self-start p-1 text-[var(--color-muted)] transition-colors hover:text-red-500"
                    aria-label={`Remove ${item.name} from cart`}
                  >
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-[var(--color-border)] p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-xl font-bold text-[var(--color-primary)]">
                {formatPrice(cartTotal)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-4 text-center font-medium text-white transition-all hover:bg-[#128C7E]"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Order via WhatsApp
            </button>
            <button
              onClick={closeCart}
              className="mt-3 w-full py-2 text-center text-[var(--color-muted)] transition-colors hover:text-[var(--foreground)]"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
