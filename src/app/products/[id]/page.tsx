import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productsData } from "@/lib/products";
import { getAllProducts, getProductById } from "@/lib/productsStore";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

// Generate static params for all products
export function generateStaticParams() {
  return productsData.map((product) => ({
    id: product.id.toString(),
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const productId = Number(id);
  const product = await getProductById(productId);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com";

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const description = product.description ||
    `Shop ${product.name} - Premium handcrafted ${product.category.toLowerCase()} made from ${product.material}. Authentic Rajasthani craftsmanship.`;

  const imageUrl = product.image.startsWith("http") ? product.image : `${baseUrl}${product.image}`;

  return {
    title: `${product.name} - ${product.category}`,
    description: description,
    keywords: [
      product.name,
      product.category,
      product.material,
      "handcrafted",
      "handicrafts",
      "wooden art",
      "Rajasthani crafts",
      "Indian art",
      "Jaipur handicrafts",
      "elephant sculpture",
    ],
    openGraph: {
      title: product.name,
      description: description,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `/products/${product.id}`,
    },
  };
}

// Generate JSON-LD for Product
function generateProductJsonLd(product: NonNullable<Awaited<ReturnType<typeof getProductById>>>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com";

  const imageUrl = product.image.startsWith("http") ? product.image : `${baseUrl}${product.image}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `Handcrafted ${product.category} made from ${product.material}`,
    image: imageUrl,
    sku: product.sku || `TH-${product.id}`,
    brand: {
      "@type": "Brand",
      name: "Tarana Handicrafts",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Tarana Handicrafts",
      url: baseUrl,
    },
    category: product.category,
    material: product.material,
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/products/${product.id}`,
      price: product.price,
      priceCurrency: "INR",
      availability: product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Tarana Handicrafts",
      },
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        bestRating: 5,
        worstRating: 1,
        reviewCount: product.reviewCount || 1,
      },
    }),
    ...(product.reviews && product.reviews.length > 0 && {
      review: product.reviews.slice(0, 5).map((review) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: review.author,
        },
        datePublished: review.date,
        reviewBody: review.content,
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating,
          bestRating: 5,
        },
      })),
    }),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  // Similar products are derived from the full store (static + dynamic).
  const products = await getAllProducts();
  const similarProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.material === product.material))
    .slice(0, 4);

  const jsonLd = generateProductJsonLd(product);

  return (
    <>
      {/* JSON-LD Structured Data for Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        productId={id}
        initialProduct={product}
        initialSimilarProducts={similarProducts}
      />
    </>
  );
}
