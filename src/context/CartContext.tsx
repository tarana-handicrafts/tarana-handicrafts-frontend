"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import { unitPrice, type BulkTier } from "@/lib/pricing";

// Maximum distinct lines / quantity per line to prevent abuse
const MAX_CART_LINES = 50;
const MAX_LINE_QTY = 10000;
// v2: lines are keyed by product + size (v1 stored one entry per unit)
const CART_STORAGE_KEY = "tarana_cart_v2";

export interface CartLine {
  slug: string;
  name: string;
  image: string;
  size: string;
  price: number;
  bulk?: BulkTier[];
  qty: number;
}

type NewCartLine = Omit<CartLine, "qty">;

interface CartContextType {
  cart: CartLine[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (line: NewCartLine, qty?: number) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  removeFromCart: (slug: string, size: string) => void;
  clearCart: () => void;
  lineTotal: (line: CartLine) => number;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const clampQty = (qty: number) => Math.min(MAX_LINE_QTY, Math.max(1, Math.floor(Number(qty) || 1)));

function isValidLine(item: unknown): item is CartLine {
  if (!item || typeof item !== "object") return false;
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.slug === "string" &&
    typeof obj.name === "string" &&
    typeof obj.image === "string" &&
    typeof obj.size === "string" &&
    typeof obj.price === "number" &&
    typeof obj.qty === "number" &&
    obj.price >= 0 &&
    (obj.bulk === undefined || Array.isArray(obj.bulk))
  );
}

function sanitizeLine(item: CartLine): CartLine {
  return {
    slug: String(item.slug).slice(0, 100),
    name: String(item.name).slice(0, 200),
    image: String(item.image).slice(0, 500),
    size: String(item.size).slice(0, 100),
    price: Math.max(0, Number(item.price) || 0),
    bulk: item.bulk
      ?.filter((t) => typeof t?.minQty === "number" && typeof t?.price === "number")
      .map((t) => ({ minQty: t.minQty, price: t.price })),
    qty: clampQty(item.qty),
  };
}

function loadCartFromStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidLine).map(sanitizeLine).slice(0, MAX_CART_LINES);
  } catch (error) {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
    console.error("Failed to parse cart from localStorage:", error);
    return [];
  }
}

function saveCartToStorage(cart: CartLine[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.slice(0, MAX_CART_LINES)));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
}

const sameLine = (a: Pick<CartLine, "slug" | "size">, slug: string, size: string) => a.slug === slug && a.size === size;

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate cart from localStorage on mount - this is intentional for SSR hydration
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCart(loadCartFromStorage());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) saveCartToStorage(cart);
  }, [cart, isHydrated]);

  const addToCart = useCallback((line: NewCartLine, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((l) => sameLine(l, line.slug, line.size));
      if (existing) {
        return prev.map((l) => (l === existing ? { ...l, qty: clampQty(l.qty + qty) } : l));
      }
      if (prev.length >= MAX_CART_LINES) {
        console.warn("Cart is full");
        return prev;
      }
      return [...prev, sanitizeLine({ ...line, qty })];
    });
    setIsCartOpen(true);
  }, []);

  const setQty = useCallback((slug: string, size: string, qty: number) => {
    setCart((prev) => prev.map((l) => (sameLine(l, slug, size) ? { ...l, qty: clampQty(qty) } : l)));
  }, []);

  const removeFromCart = useCallback((slug: string, size: string) => {
    setCart((prev) => prev.filter((l) => !sameLine(l, slug, size)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const lineTotal = useCallback((line: CartLine) => unitPrice(line, line.qty) * line.qty, []);
  const cartTotal = useMemo(() => cart.reduce((sum, l) => sum + lineTotal(l), 0), [cart, lineTotal]);
  const cartCount = useMemo(() => cart.reduce((sum, l) => sum + l.qty, 0), [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        setQty,
        removeFromCart,
        clearCart,
        lineTotal,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
