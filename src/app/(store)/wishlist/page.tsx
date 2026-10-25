import type { Metadata } from "next";
import { getAllProducts, toSummary } from "@/lib/catalog";
import WishlistClient from "./WishlistClient";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved items from Tarana Handicrafts.",
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return <WishlistClient products={getAllProducts().map(toSummary)} />;
}
