import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ | Tarana Handicrafts",
  description:
    "Answers to common questions about Tarana Handicrafts' handcrafted wooden products, wholesale and export orders, customisation, shipping, and payments.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    q: "Are your products really handmade?",
    a: "Yes. Every piece is hand-carved by skilled artisans in Jaipur, Rajasthan. Slight variations in grain, finish, and size are natural and confirm that each item is genuinely handmade.",
  },
  {
    q: "Do you supply wholesale and bulk orders?",
    a: "Absolutely. We are a manufacturer and supply wholesale and export quantities with tiered pricing. Share your product, quantity, and destination through our quote request form and we will prepare a quotation.",
  },
  {
    q: "Can products be customised?",
    a: "Many of our products can be customised by size, finish, and packaging, and we can produce custom designs for bulk orders. Mention your requirements when requesting a quote.",
  },
  {
    q: "What is the minimum order quantity (MOQ)?",
    a: "MOQ depends on the product and level of customisation. For many items single-piece retail purchase is available, while wholesale pricing applies above the product's MOQ. We will confirm the MOQ in your quotation.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we ship worldwide by air or sea freight. We support export orders on agreed Incoterms and assist with documentation, HS codes, and port-of-loading details.",
  },
  {
    q: "How long does an order take?",
    a: "As products are handmade and often made to order, lead times vary by item and quantity. Your quotation or order confirmation includes an estimated production and shipping timeline.",
  },
  {
    q: "How do I request a quote?",
    a: "Use the Request a Quote form on our site, message us on WhatsApp at +91 9509669135, or email taranahandicrafts@gmail.com with the products and quantities you need.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept standard bank transfers and other methods agreed during ordering. For bulk and export orders, production typically begins after an agreed advance payment is received.",
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="px-4 pb-10 pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
            Support
          </span>
          <h1 className="font-serif text-4xl md:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-stone-500">
            Everything you need to know about ordering our handcrafted pieces.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-serif text-lg text-stone-900">
                {f.q}
                <span className="ml-4 text-[#C5A059] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-stone-600">{f.a}</p>
            </details>
          ))}

          <div className="rounded-2xl border border-[#C5A059]/30 bg-white p-8 text-center shadow-sm">
            <h2 className="font-serif text-2xl">Still have questions?</h2>
            <p className="mt-2 text-stone-600">
              Our team is happy to help with product, wholesale, and export enquiries.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/rfq"
                className="rounded-xl bg-[#C5A059] px-6 py-3 font-medium text-white transition-colors hover:bg-[#B8934E]"
              >
                Request a Quote
              </Link>
              <a
                href="https://wa.me/919509669135"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border-2 border-[#C5A059] px-6 py-3 font-medium text-[#C5A059] transition-colors hover:bg-[#C5A059] hover:text-white"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
