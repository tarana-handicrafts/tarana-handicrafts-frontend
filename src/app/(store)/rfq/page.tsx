import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProducts, getCategoryPath } from "@/lib/catalog";
import RFQForm, { type RFQProduct } from "./RFQForm";

export const metadata: Metadata = {
  title: "Wholesale Handicrafts from Jaipur – Request a Bulk Quote",
  description:
    "Manufacturer-direct wholesale pricing on handcrafted wooden elephants and decor from Jaipur. Request a bulk or export quote and get a reply within 24 business hours.",
  alternates: { canonical: "/rfq" },
};

export default function RFQPage() {
  const products: RFQProduct[] = getAllProducts()
    .map((p) => ({ slug: p.slug, name: p.name, category: getCategoryPath(p.category).at(-1)?.name ?? "" }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <section className="px-4 pb-12 pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
            Wholesale & Export
          </span>
          <h1 className="mb-4 font-serif text-4xl md:text-5xl">
            Request a <span className="font-light italic text-stone-500">Bulk Quote</span>
          </h1>
          <p className="mx-auto max-w-2xl text-stone-500">
            Direct-from-manufacturer pricing for wholesalers, importers, retailers, and
            interior designers. Tell us what you need and our export team will send a
            tailored quotation within 24 business hours.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-10">
          {/* useSearchParams (prefill from ?product=) needs a Suspense boundary on a static page */}
          <Suspense fallback={<div className="py-10 text-center text-stone-400">Loading form…</div>}>
            <RFQForm products={products} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
