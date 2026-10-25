import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductSummary } from "@/lib/pricing";

export function FeaturedProducts({ products }: { products: ProductSummary[] }) {
  if (products.length === 0) return null;
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">Curated Selection</span>
          <h2 className="mb-4 font-serif text-3xl sm:text-4xl">Featured Pieces</h2>
          <p className="mx-auto max-w-2xl text-stone-500">Our most loved designs, each carved by hand in our Jaipur workshop.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-block rounded-full border border-stone-900 px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] transition-colors hover:bg-stone-900 hover:text-white"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
