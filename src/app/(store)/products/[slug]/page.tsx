import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts, getCategoryPath, getProduct, getRelatedProducts, toSummary } from "@/lib/catalog";
import { generateBreadcrumbJsonLd, generateFAQJsonLd, generateProductJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";
import { ProductCard } from "@/components/product/ProductCard";
import ProductGallery from "./ProductGallery";
import PurchasePanel from "./PurchasePanel";
import ProductReviews from "./ProductReviews";

type Props = { params: Promise<{ slug: string }> };

// Every product page is pre-rendered at build time; unknown slugs 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product Not Found", robots: { index: false, follow: false } };

  const trail = getCategoryPath(product.category);
  const image = product.images[0];
  const imageUrl = `${siteConfig.url}${image.src}`;
  const title = `${product.name} – Handcrafted in Jaipur`;

  return {
    title,
    description: product.shortDescription.slice(0, 160),
    keywords: [product.name, ...trail.map((c) => c.name), product.material ?? "", ...product.tags, "handcrafted", "Jaipur handicrafts"].filter(Boolean),
    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,
      description: product.shortDescription,
      images: [{ url: imageUrl, width: 1200, height: 1200, alt: image.alt }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${siteConfig.name}`,
      description: product.shortDescription,
      images: [imageUrl],
    },
    alternates: { canonical: `/products/${product.slug}` },
  };
}

const TRUST_BADGES = [
  { title: "Handcrafted", text: "Carved by Jaipur artisans" },
  { title: "Factory Direct", text: "No middlemen pricing" },
  { title: "Ships Worldwide", text: "Safely packed" },
];

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const trail = getCategoryPath(product.category);
  const related = getRelatedProducts(product).map(toSummary);
  const url = `${siteConfig.url}/products/${product.slug}`;

  const jsonLd = [
    generateProductJsonLd({
      slug: product.slug,
      name: product.name,
      description: product.description,
      images: product.images.map((i) => i.src),
      prices: product.sizes.map((s) => s.price),
      category: trail.map((c) => c.name).join(" > "),
      material: product.material,
    }),
    generateBreadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Products", url: "/products" },
      ...trail.map((c) => ({ name: c.name, url: `/collections/${c.slug}` })),
      { name: product.name, url: `/products/${product.slug}` },
    ]),
    ...(product.faqs.length ? [generateFAQJsonLd(product.faqs)] : []),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <div className="min-h-screen bg-[#F9F8F6] px-4 pb-16 pt-32">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 text-sm">
            <ol className="flex flex-wrap items-center gap-2 text-stone-500">
              <li><Link href="/" className="hover:text-[#C5A059]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/products" className="hover:text-[#C5A059]">Products</Link></li>
              {trail.map((c) => (
                <li key={c.slug} className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  <Link href={`/collections/${c.slug}`} className="hover:text-[#C5A059]">{c.name}</Link>
                </li>
              ))}
              <li aria-hidden="true">/</li>
              <li className="text-stone-900" aria-current="page">{product.name}</li>
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-2">
            <ProductGallery images={product.images} />

            <div>
              {trail.length > 0 && (
                <Link
                  href={`/collections/${trail[trail.length - 1].slug}`}
                  className="mb-4 inline-block rounded-full bg-[#C5A059]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8934E] hover:bg-[#C5A059]/20"
                >
                  {trail[trail.length - 1].name}
                </Link>
              )}
              <h1 className="mb-4 font-serif text-3xl md:text-4xl">{product.name}</h1>
              <p className="mb-6 text-lg leading-relaxed text-stone-600">{product.shortDescription}</p>
              {product.material && (
                <p className="mb-6 text-sm text-stone-600">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Material: </span>
                  {product.material}
                </p>
              )}

              <PurchasePanel slug={product.slug} name={product.name} image={product.images[0].src} sizes={product.sizes} url={url} />

              <div className="grid grid-cols-3 gap-3 border-t border-stone-200 pt-6 text-center">
                {TRUST_BADGES.map((b) => (
                  <div key={b.title}>
                    <p className="text-sm font-semibold text-stone-900">{b.title}</p>
                    <p className="text-xs text-stone-500">{b.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Static product content: rendered as HTML for speed and SEO */}
          <div className="mt-16 grid gap-12 lg:grid-cols-3">
            <section className="lg:col-span-2" aria-labelledby="about-heading">
              <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">The Craft</span>
              <h2 id="about-heading" className="mb-6 font-serif text-3xl">About This Product</h2>
              <div className="space-y-4 leading-relaxed text-stone-600">
                {product.description.split(/\n{2,}/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {product.details.length > 0 && (
              <section aria-labelledby="details-heading">
                <h2 id="details-heading" className="mb-6 font-serif text-2xl">Product Details</h2>
                <dl className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
                  {product.details.map((d) => (
                    <div key={d.label} className="flex justify-between gap-4 px-5 py-3 text-sm">
                      <dt className="text-stone-500">{d.label}</dt>
                      <dd className="text-right font-medium text-stone-900">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </div>

          {product.faqs.length > 0 && (
            <section className="mt-16 max-w-4xl" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="mb-6 font-serif text-3xl">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {product.faqs.map((faq) => (
                  <details key={faq.question} className="group rounded-xl border border-stone-200 bg-white px-5 py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-stone-900">
                      {faq.question}
                      <span className="text-[#C5A059] transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                    </summary>
                    <p className="mt-3 leading-relaxed text-stone-600">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <ProductReviews productSlug={product.slug} />

      {related.length > 0 && (
        <section className="bg-[#F9F8F6] px-4 py-16" aria-labelledby="related-heading">
          <div className="mx-auto max-w-7xl">
            <h2 id="related-heading" className="mb-8 text-center font-serif text-3xl">You May Also Like</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
