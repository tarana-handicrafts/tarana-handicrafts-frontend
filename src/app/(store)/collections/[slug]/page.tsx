import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCategories, getCategory, getCategoryPath, getProductsInCategory, toSummary } from "@/lib/catalog";
import { DEFAULT_OG_IMAGE, generateBreadcrumbJsonLd, generateCollectionJsonLd } from "@/lib/seo";
import { ProductCard } from "@/components/product/ProductCard";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

function describe(name: string, description?: string) {
  return description ?? `Shop handcrafted ${name.toLowerCase()} carved by artisans in Jaipur, India. Factory-direct prices with bulk discounts.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Collection Not Found", robots: { index: false, follow: false } };
  const description = describe(category.name, category.description);
  const metaDescription = /jaipur/i.test(description)
    ? description
    : `${description} Hand-carved in Jaipur, Rajasthan. Retail and wholesale.`;
  return {
    title: `${category.name} – Hand-Carved in Jaipur`,
    description: metaDescription.slice(0, 160),
    openGraph: {
      title: `${category.name} | Tarana Handicrafts`,
      description,
      type: "website",
      images: [category.image ? { url: category.image, alt: category.name } : DEFAULT_OG_IMAGE],
    },
    alternates: { canonical: `/collections/${category.slug}` },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const trail = getCategoryPath(slug);
  const parent = trail.length > 1 ? trail[trail.length - 2] : undefined;
  const products = getProductsInCategory(slug).map(toSummary);
  const description = describe(category.name, category.description);

  const jsonLd = [
    generateCollectionJsonLd(
      category.name,
      description,
      products.map((p) => ({ name: p.name, url: `/products/${p.slug}`, image: p.image.src, price: p.fromPrice })),
      `/collections/${category.slug}`
    ),
    generateBreadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Products", url: "/products" },
      ...trail.map((c) => ({ name: c.name, url: `/collections/${c.slug}` })),
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="min-h-screen bg-[#F9F8F6] px-4 pb-16 pt-32">
        <div className="mx-auto max-w-7xl">
          <header className="mb-12 text-center">
            <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
              {parent ? (
                <Link href={`/collections/${parent.slug}`} className="hover:underline">{parent.name}</Link>
              ) : (
                "Collection"
              )}
            </span>
            <h1 className="mb-4 font-serif text-4xl md:text-5xl">{category.name}</h1>
            <p className="mx-auto max-w-2xl text-stone-500">{description}</p>
          </header>

          {category.children.length > 0 && (
            <nav aria-label="Sub-collections" className="mb-10 flex flex-wrap justify-center gap-3">
              {category.children.map((child) => (
                <Link
                  key={child.slug}
                  href={`/collections/${child.slug}`}
                  className="rounded-full border border-stone-200 bg-white px-5 py-2 text-sm font-medium text-stone-600 transition-all hover:border-[#C5A059] hover:text-[#C5A059]"
                >
                  {child.name}
                </Link>
              ))}
            </nav>
          )}

          {products.length === 0 ? (
            <div className="py-20 text-center">
              <h2 className="mb-2 text-xl font-semibold">New pieces coming soon</h2>
              <p className="mb-6 text-stone-500">We&apos;re carving new designs for this collection.</p>
              <Link href="/products" className="text-[#C5A059] hover:underline">Browse all products →</Link>
            </div>
          ) : (
            <>
              <p className="mb-6 text-stone-500">{products.length} product{products.length === 1 ? "" : "s"}</p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p, i) => (
                  <ProductCard key={p.slug} product={p} priority={i < 4} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
