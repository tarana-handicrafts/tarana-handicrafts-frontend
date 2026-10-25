"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

const STORAGE_KEY = "tarana_wishlist";
const MAX_ITEMS = 100;

interface WishlistContextType {
  items: string[]; // product slugs
  count: number;
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  count: 0,
  toggleWishlist: () => {},
  isWishlisted: () => false,
});

function load(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string").slice(0, MAX_ITEMS) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(load());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, [items, isHydrated]);

  const toggleWishlist = useCallback((slug: string) => {
    setItems((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug].slice(0, MAX_ITEMS)));
  }, []);

  const isWishlisted = useCallback((slug: string) => items.includes(slug), [items]);

  return (
    <WishlistContext.Provider value={{ items, count: items.length, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
