import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { productsData } from "@/lib/products";

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

// JSON-LD for Product Collection
function generateCollectionJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com";

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Handcrafted Wooden Art Collection",
    description: "Curated collection of handcrafted wooden elephant sculptures and traditional Rajasthani handicrafts.",
    url: `${baseUrl}/products`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: productsData.length,
      itemListElement: productsData.slice(0, 10).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          description: product.description || `Handcrafted ${product.category} made from ${product.material}`,
          image: product.image.startsWith("http") ? product.image : `${baseUrl}${product.image}`,
          url: `${baseUrl}/products/${product.id}`,
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "INR",
            availability: product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
          ...(product.rating && {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviewCount || 1,
            },
          }),
        },
      })),
    },
  };
}

export default function ProductsPage() {
  const jsonLd = generateCollectionJsonLd();

  return (
    <div className="min-h-screen bg-[#F9F8F6] px-4 pb-16 pt-32">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
