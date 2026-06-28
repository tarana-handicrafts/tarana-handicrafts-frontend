"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface WishlistContextType {
  items: string[]; // product IDs
  count: number;
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  count: 0,
  toggleWishlist: async () => {},
  isWishlisted: () => false,
  loading: false,
});

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("wishlist_visitor_id");
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("wishlist_visitor_id", id);
  }
  return id;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist on mount
  useEffect(() => {
    const visitorId = getVisitorId();
    if (!visitorId) return;
    setLoading(true);
    fetch(`${API_URL}/api/wishlist?visitorId=${encodeURIComponent(visitorId)}`)
      .then(res => res.json())
      .then(data => {
        const ids = (data.items || []).map((p: { _id: string }) => p._id);
        setItems(ids);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleWishlist = useCallback(async (productId: string) => {
    const visitorId = getVisitorId();
    if (!visitorId) return;

    const isCurrentlyWishlisted = items.includes(productId);

    // Optimistic update
    setItems(prev =>
      isCurrentlyWishlisted
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );

    try {
      if (isCurrentlyWishlisted) {
        await fetch(`${API_URL}/api/wishlist`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, productId }),
        });
      } else {
        await fetch(`${API_URL}/api/wishlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, productId }),
        });
      }
    } catch {
      // Revert on error
      setItems(prev =>
        isCurrentlyWishlisted
          ? [...prev, productId]
          : prev.filter(id => id !== productId)
      );
    }
  }, [items]);

  const isWishlisted = useCallback((productId: string) => items.includes(productId), [items]);

  return (
    <WishlistContext.Provider value={{ items, count: items.length, toggleWishlist, isWishlisted, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
