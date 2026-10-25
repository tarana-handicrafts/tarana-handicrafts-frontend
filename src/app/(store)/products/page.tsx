import type { Metadata } from "next";
import { getAllProducts, getCategoryTree, toSummary } from "@/lib/catalog";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import ProductsClient from "./ProductsClient";

// SEO Metadata for Products Page
export const metadata: Metadata = {
  title: "Shop Wooden Elephants & Jaipur Handicrafts",
  description:
    "Shop hand-carved wooden elephants, figurines, spiritual sculptures and home decor from Jaipur, Rajasthan. Factory-direct prices, bulk discounts and worldwide shipping.",
  keywords: [
    "buy wooden elephant",
    "wooden elephants Jaipur",
    "Jaipur handicrafts online",
    "Rajasthani handicrafts",
    "wooden home decor",
    "wooden figurines",
    "handicrafts wholesale India",
  ],
  openGraph: {
    title: "Shop Wooden Elephants & Jaipur Handicrafts | Tarana Handicrafts",
    description:
      "Hand-carved wooden elephants, figurines and home decor from Jaipur artisans.",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: {
    canonical: "/products",
  },
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] px-4 pb-16 pt-32">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <header className="mb-12 text-center">
          <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
            Curated Collection
          </span>
          <h1 className="mb-4 font-serif text-4xl md:text-5xl">Wooden Elephants &amp; Handicrafts</h1>
          <p className="mx-auto max-w-2xl text-stone-500">
            Hand-carved in Jaipur, Rajasthan. Each piece is individually made by
            skilled artisans, so no two are exactly alike.
          </p>
        </header>

        {/* Client-side filtering over the pre-rendered catalog */}
        <ProductsClient products={getAllProducts().map(toSummary)} categories={getCategoryTree()} />
      </div>
    </div>
  );
}
