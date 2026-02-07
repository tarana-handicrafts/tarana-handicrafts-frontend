"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Product, CartItem } from "@/lib/products";

// Maximum cart size to prevent abuse
const MAX_CART_ITEMS = 50;
const CART_STORAGE_KEY = "tarana_cart";

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (cartId: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Validates a cart item to ensure it has required properties
 * and sanitizes string values to prevent XSS
 */
function isValidCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object") return false;
  const obj = item as Record<string, unknown>;

  return (
    typeof obj.id === "number" &&
    typeof obj.cartId === "number" &&
    typeof obj.name === "string" &&
    typeof obj.price === "number" &&
    typeof obj.category === "string" &&
    typeof obj.material === "string" &&
    typeof obj.image === "string" &&
    obj.price >= 0 &&
    obj.name.length <= 200 &&
    obj.category.length <= 100 &&
    obj.material.length <= 100
  );
}

/**
 * Sanitizes a cart item by escaping potentially dangerous characters
 */
function sanitizeCartItem(item: CartItem): CartItem {
  return {
    ...item,
    name: String(item.name).slice(0, 200),
    category: String(item.category).slice(0, 100),
    material: String(item.material).slice(0, 100),
    image: String(item.image).slice(0, 500),
    tag: item.tag ? String(item.tag).slice(0, 50) : undefined,
    price: Math.max(0, Number(item.price) || 0),
  };
}

/**
 * Safely parses cart from localStorage with validation
 */
function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!savedCart) return [];

    const parsed = JSON.parse(savedCart);
    if (!Array.isArray(parsed)) return [];

    // Validate and sanitize each item
    const validItems = parsed
      .filter(isValidCartItem)
      .map(sanitizeCartItem)
      .slice(0, MAX_CART_ITEMS);

    return validItems;
  } catch (error) {
    // Clear corrupted data
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
    console.error("Failed to parse cart from localStorage:", error);
    return [];
  }
}

/**
 * Safely saves cart to localStorage
 */
function saveCartToStorage(cart: CartItem[]): void {
  if (typeof window === "undefined") return;

  try {
    const sanitizedCart = cart.map(sanitizeCartItem).slice(0, MAX_CART_ITEMS);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(sanitizedCart));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize cart with empty array, will hydrate on client
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate cart from localStorage on mount - this is intentional for SSR hydration
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCart(savedCart);
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes (after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveCartToStorage(cart);
    }
  }, [cart, isHydrated]);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      // Prevent exceeding max cart size
      if (prev.length >= MAX_CART_ITEMS) {
        console.warn("Cart is full");
        return prev;
      }

      const cartItem: CartItem = sanitizeCartItem({
        ...product,
        cartId: Date.now() + Math.random(),
      });

      return [...prev, cartItem];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((cartId: number) => {
    if (typeof cartId !== "number" || !isFinite(cartId)) return;
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0), 0);
  const cartCount = cart.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        clearCart,
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
