import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";

// SEO Metadata for Products Page
export const metadata: Metadata = {
  title: "Shop Handcrafted Wooden Art | Elephant Sculptures & Home Decor",
  description:
    "Browse our curated collection of handcrafted wooden elephant sculptures, home decor, and traditional Rajasthani handicrafts. Premium quality with worldwide shipping.",
  keywords: [
    "wooden elephant sculptures",
    "handcrafted art",
    "Rajasthani handicrafts",
    "wooden home decor",
    "Jaipur art",
    "traditional Indian crafts",
    "elephant figurines",
    "wooden sculptures India",
  ],
  openGraph: {
    title: "Shop Handcrafted Wooden Art | Tarana Handicrafts",
    description:
      "Browse our curated collection of handcrafted wooden elephant sculptures and traditional Rajasthani handicrafts.",
    type: "website",
    images: [
      {
        url: "/og-products.jpg",
        width: 1200,
        height: 630,
        alt: "Tarana Handicrafts - Handcrafted Wooden Art Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Handcrafted Wooden Art | Tarana Handicrafts",
    description:
      "Browse our curated collection of handcrafted wooden elephant sculptures.",
    images: ["/og-products.jpg"],
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
          <h1 className="mb-4 font-serif text-4xl md:text-5xl">Our Collection</h1>
          <p className="mx-auto max-w-2xl text-stone-500">
            Explore our curated collection of handcrafted masterpieces. Each
            piece is unique and made with love by skilled artisans.
          </p>
        </header>

        {/* Client-side filtering and products grid */}
        <ProductsClient />
      </div>
    </div>
  );
}
