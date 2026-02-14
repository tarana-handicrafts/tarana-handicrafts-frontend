import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById, productsData } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";

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
  const product = getProductById(productId);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const description = product.description ||
    `Shop ${product.name} - Premium handcrafted ${product.category.toLowerCase()} made from ${product.material}. Authentic Rajasthani craftsmanship.`;

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
    ],
    openGraph: {
      title: product.name,
      description: description,
      images: [
        {
          url: product.image,
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
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  const product = getProductById(productId);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient productId={id} />;
}
