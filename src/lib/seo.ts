/**
 * SEO Utilities
 * Centralized SEO configuration for the application
 */
import site from "@content/site.json";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || site.url;
const SITE_NAME = site.name;

/**
 * Brand share image (app/opengraph-image.tsx). A page that sets its own
 * `openGraph` replaces the inherited one, so it must list this explicitly.
 */
export const DEFAULT_OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE_NAME}, Jaipur` };

/** Phrases people search for; used in page keywords and the business schema. */
export const SEARCH_TOPICS = [
  "Tarana Handicrafts",
  "handicrafts in Jaipur",
  "Jaipur handicrafts",
  "wooden elephants",
  "wooden elephants in Jaipur",
  "hand-carved wooden elephant",
  "jaali elephant",
  "wooden handicrafts",
  "Rajasthani handicrafts",
  "wooden figurines",
  "wooden home decor",
  "corporate gifts Jaipur",
  "wholesale handicrafts India",
];

// ─── Site-wide Schema (WebSite + Organization + Store) ───
// Rendered once in the root layout. Pages reference these nodes by @id.
export function generateSiteJsonLd() {
  const address = {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  };
  const sameAs = Object.values(site.socials).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: `${BASE_URL}/`,
        name: SITE_NAME,
        alternateName: ["Tarana", "Tarana Jaipur", "Tarana Handicrafts Jaipur"],
        description: site.description,
        publisher: { "@id": `${BASE_URL}/#organization` },
        inLanguage: "en-IN",
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: "Tarana",
        url: `${BASE_URL}/`,
        logo: {
          "@type": "ImageObject",
          "@id": `${BASE_URL}/#logo`,
          url: `${BASE_URL}/favicon.png`,
          width: 180,
          height: 180,
          caption: `${SITE_NAME} logo`,
        },
        image: { "@id": `${BASE_URL}/#logo` },
        description: site.description,
        email: site.email,
        telephone: site.phone,
        address,
        sameAs,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: site.phone,
          email: site.email,
          contactType: "customer service",
          areaServed: "Worldwide",
          availableLanguage: ["English", "Hindi"],
        },
      },
      {
        "@type": "Store",
        "@id": `${BASE_URL}/#localbusiness`,
        name: SITE_NAME,
        description: site.description,
        url: `${BASE_URL}/`,
        image: `${BASE_URL}/opengraph-image`,
        logo: { "@id": `${BASE_URL}/#logo` },
        telephone: site.phone,
        email: site.email,
        priceRange: "₹₹",
        currenciesAccepted: site.currency,
        address,
        geo: { "@type": "GeoCoordinates", latitude: 27.021601, longitude: 75.767587 },
        hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${SITE_NAME}, ${site.address.street}, ${site.address.city}`
        )}`,
        areaServed: [
          { "@type": "City", name: "Jaipur" },
          { "@type": "State", name: "Rajasthan" },
          { "@type": "Country", name: "India" },
        ],
        knowsAbout: SEARCH_TOPICS,
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "10:00",
            closes: "19:00",
          },
        ],
        parentOrganization: { "@id": `${BASE_URL}/#organization` },
        sameAs,
      },
    ],
  };
}

// ─── Product Schema.org (JSON-LD) ───
export function generateProductJsonLd(product: {
  slug: string;
  name: string;
  description: string;
  images: string[];
  /** Retail (1-piece) price of each size. */
  prices: number[];
  category?: string;
  material?: string;
}) {
  const url = `${BASE_URL}/products/${product.slug}`;
  const low = Math.min(...product.prices);
  const high = Math.max(...product.prices);
  const seller = { "@type": "Organization", name: SITE_NAME };
  const availability = "https://schema.org/InStock";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((src) => (src.startsWith("http") ? src : `${BASE_URL}${src}`)),
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    category: product.category,
    material: product.material,
    offers:
      low === high
        ? { "@type": "Offer", url, priceCurrency: "INR", price: low, availability, seller }
        : {
            "@type": "AggregateOffer",
            url,
            priceCurrency: "INR",
            lowPrice: low,
            highPrice: high,
            offerCount: product.prices.length,
            availability,
            seller,
          },
    // NOTE: aggregateRating intentionally omitted. Do NOT emit AggregateRating
    // schema until reviews come from real, verifiable customer data — fabricated
    // ratings violate Google's review snippet policy and risk manual penalties.
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
  products: { name: string; url: string; image?: string; price: number }[],
  path = "/products"
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${BASE_URL}${path}`,
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
