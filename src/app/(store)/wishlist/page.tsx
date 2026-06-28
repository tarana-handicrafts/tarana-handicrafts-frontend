import type { Metadata } from "next";
import WishlistClient from "./WishlistClient";

export const metadata: Metadata = {
  title: "Wishlist | Tarana Handicrafts",
  description: "Your saved items from Tarana Handicrafts.",
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return <WishlistClient />;
}
