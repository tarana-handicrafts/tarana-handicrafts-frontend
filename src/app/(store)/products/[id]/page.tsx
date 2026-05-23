import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById as fetchProduct } from "@/lib/storeApi";
import { generateProductJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import ProductDetailClient from "./ProductDetailClient";

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.taranahandicrafts.com";

  try {
    const { product } = await fetchProduct(id);
    const description = product.description ||
      `Shop ${product.name} - Premium handcrafted ${product.category.toLowerCase()}${product.material ? ` made from ${product.material}` : ''}. Authentic Rajasthani craftsmanship from Jaipur artisans.`;
    const imageUrl = product.image?.startsWith("http") ? product.image : `${baseUrl}${product.image}`;

    return {
      title: `${product.name} - ${product.category}`,
      description: description.substring(0, 160),
      keywords: [
        product.name,
        product.category,
        product.material || "",
        "handcrafted",
        "handicrafts",
        "wooden art",
        "Rajasthani crafts",
        "buy online",
      ].filter(Boolean),
      openGraph: {
        title: `${product.name} | Tarana Handicrafts`,
        description,
        images: [{ url: imageUrl, width: 800, height: 800, alt: product.name }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} | Tarana Handicrafts`,
        description,
        images: [imageUrl],
      },
      alternates: { canonical: `${baseUrl}/products/${product._id}` },
    };
  } catch {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
      robots: { index: false, follow: false },
    };
  }
}

async function getProduct(id: string) {
  try {
    const { product } = await fetchProduct(id);
    return product;
  } catch {
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Generate structured data
  const productJsonLd = generateProductJsonLd(product);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: product.category, url: `/products?category=${encodeURIComponent(product.category)}` },
    { name: product.name, url: `/products/${product._id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient productId={id} />
    </>
  );
}
