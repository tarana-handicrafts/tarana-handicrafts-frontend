/**
 * SEO Utilities
 * Centralized SEO configuration for the application
 */
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.taranahandicrafts.com";
const SITE_NAME = "Tarana Handicrafts";

// ─── Default Metadata Generator ───
export function generateMetadata({
  title,
  description,
  path = "",
  image = "/og-image.jpg",
  type = "website",
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const url = `${BASE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [
        {
          url: image.startsWith("http") ? image : `${BASE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.startsWith("http") ? image : `${BASE_URL}${image}`],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

// ─── Product Schema.org (JSON-LD) ───
export function generateProductJsonLd(product: {
  name: string;
  description?: string;
  image?: string;
  price: number;
  originalPrice?: number;
  sku?: string;
  category?: string;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
  _id: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} - Handcrafted art from Tarana Handicrafts`,
    image: product.image || `${BASE_URL}/og-image.jpg`,
    sku: product.sku || product._id,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/products/${product._id}`,
      priceCurrency: "INR",
      price: product.price,
      ...(product.originalPrice && product.originalPrice > product.price && {
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }),
      availability: product.inStock !== false
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
    ...(product.rating && product.reviewCount && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

// ─── Breadcrumb Schema ───
export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

// ─── FAQ Schema ───
export function generateFAQJsonLd(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ─── Collection/Category Schema ───
export function generateCollectionJsonLd(
  name: string,
  description: string,
  products: { name: string; url: string; image?: string; price: number }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${BASE_URL}/products`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 10).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: p.url.startsWith("http") ? p.url : `${BASE_URL}${p.url}`,
        name: p.name,
      })),
    },
  };
}

// ─── Local Business Schema (for contact page) ───
export function generateLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#localbusiness`,
    name: SITE_NAME,
    image: `${BASE_URL}/og-image.jpg`,
    url: BASE_URL,
    telephone: "+91-9509669135",
    email: "taranahandicrafts@gmail.com",
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "B81, North Avenue, Harmara Ghati, Sikar Road",
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      postalCode: "302039",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 27.021601,
      longitude: 75.767587,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "19:00",
      },
    ],
    sameAs: [
      "https://facebook.com/taranahandicrafts",
      "https://instagram.com/taranahandicrafts",
    ],
  };
}

