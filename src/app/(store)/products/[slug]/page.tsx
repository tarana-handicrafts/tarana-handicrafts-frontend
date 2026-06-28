import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById as fetchProduct } from "@/lib/storeApi";
import { generateProductJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import ProductDetailClient from "./ProductDetailClient";
import CategoryProductsClient from "../[slug]/CategoryProductsClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Check if string looks like a MongoDB ObjectId
function isObjectId(str: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(str);
}

// Try to fetch a category by slug
async function getCategoryBySlug(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/categories/slug/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.category;
  } catch {
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.taranahandicrafts.com";

  // Try product first if it looks like an ObjectId
  if (isObjectId(slug)) {
    try {
      const { product } = await fetchProduct(slug);
      const description = product.description ||
        `Shop ${product.name} - Premium handcrafted ${product.category.toLowerCase()}${product.material ? ` made from ${product.material}` : ''}. Authentic Rajasthani craftsmanship from Jaipur artisans.`;
      const imageUrl = product.image?.startsWith("http") ? product.image : `${baseUrl}${product.image}`;

      return {
        title: `${product.name} - ${product.category}`,
        description: description.substring(0, 160),
        keywords: [
          product.name, product.category, product.material || "",
          "handcrafted", "handicrafts", "wooden art", "Rajasthani crafts", "buy online",
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
      return { title: "Product Not Found", robots: { index: false, follow: false } };
    }
  }

  // Try category
  const category = await getCategoryBySlug(slug);
  if (category) {
    return {
      title: category.seo?.metaTitle || `${category.name} | Tarana Handicrafts`,
      description: category.seo?.metaDescription || category.description || `Shop our collection of ${category.name} handcrafted wooden art from Jaipur, India.`,
      keywords: category.seo?.keywords || [category.name, "handicrafts", "wooden art", "Jaipur"],
      openGraph: {
        title: category.seo?.metaTitle || `${category.name} | Tarana Handicrafts`,
        description: category.description || `Shop our collection of ${category.name}.`,
        type: "website",
      },
      alternates: { canonical: `/products/${slug}` },
    };
  }

  return { title: "Not Found", robots: { index: false, follow: false } };
}

export default async function ProductOrCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Try product if it looks like an ObjectId
  if (isObjectId(slug)) {
    try {
      const { product } = await fetchProduct(slug);
      const productJsonLd = generateProductJsonLd(product);
      const breadcrumbJsonLd = generateBreadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Products", url: "/products" },
        { name: product.category, url: `/products?category=${encodeURIComponent(product.category)}` },
        { name: product.name, url: `/products/${product._id}` },
      ]);

      return (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
          <ProductDetailClient productId={slug} />
        </>
      );
    } catch {
      notFound();
    }
  }

  // Try category
  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] px-4 pb-16 pt-32">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 text-center">
          <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
            {category.ancestors?.length ? category.ancestors.map((a: { name: string }) => a.name).join(" / ") : "Collection"}
          </span>
          <h1 className="mb-4 font-serif text-4xl md:text-5xl">{category.name}</h1>
          {category.description && (
            <p className="mx-auto max-w-2xl text-stone-500">{category.description}</p>
          )}
        </header>

        {category.children && category.children.length > 0 && (
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {category.children.map((child: { _id: string; name: string; slug: string }) => (
              <a
                key={child._id}
                href={`/products/${child.slug}`}
                className="rounded-full border border-stone-200 bg-white px-5 py-2 text-sm font-medium text-stone-600 transition-all hover:border-[#C5A059] hover:text-[#C5A059]"
              >
                {child.name}
              </a>
            ))}
          </div>
        )}

        <CategoryProductsClient categoryId={category._id} categoryName={category.name} />
      </div>
    </div>
  );
}
