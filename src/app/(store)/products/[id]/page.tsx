import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById as fetchProduct } from "@/lib/storeApi";
import ProductDetailClient from "./ProductDetailClient";

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com";

  try {
    const { product } = await fetchProduct(id);
    const description = product.description ||
      `Shop ${product.name} - Premium handcrafted ${product.category.toLowerCase()}${product.material ? ` made from ${product.material}` : ''}. Authentic Rajasthani craftsmanship.`;
    const imageUrl = product.image?.startsWith("http") ? product.image : `${baseUrl}${product.image}`;

    return {
      title: `${product.name} - ${product.category}`,
      description,
      keywords: [
        product.name,
        product.category,
        product.material || "",
        "handcrafted",
        "handicrafts",
        "wooden art",
        "Rajasthani crafts",
      ].filter(Boolean),
      openGraph: {
        title: product.name,
        description,
        images: [{ url: imageUrl, width: 800, height: 800, alt: product.name }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description,
        images: [imageUrl],
      },
      alternates: { canonical: `/products/${product._id}` },
    };
  } catch {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const { product } = await fetchProduct(id);
    if (!product) notFound();

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com";
    const imageUrl = product.image?.startsWith("http") ? product.image : `${baseUrl}${product.image}`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description || `Handcrafted ${product.category}`,
      image: imageUrl,
      sku: product.sku || `TH-${product._id}`,
      brand: { "@type": "Brand", name: "Tarana Handicrafts" },
      category: product.category,
      offers: {
        "@type": "Offer",
        url: `${baseUrl}/products/${product._id}`,
        price: product.price,
        priceCurrency: "INR",
        availability: product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
      ...(product.rating && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          bestRating: 5,
          reviewCount: product.reviewCount || 1,
        },
      }),
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ProductDetailClient productId={id} />
      </>
    );
  } catch {
    notFound();
  }
}
