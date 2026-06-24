import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Shipping & Delivery | Tarana Handicrafts",
  description:
    "How Tarana Handicrafts packs and ships handcrafted wooden products across India and worldwide, including export and bulk orders.",
  alternates: { canonical: "/shipping" },
};

const h2 = "font-serif text-2xl text-stone-900";

export default function ShippingPage() {
  return (
    <LegalLayout title="Shipping & Delivery" subtitle="Support" updated="February 2025">
      <p>
        We ship our handcrafted wooden pieces across India and to customers worldwide. Every order is
        packed with care so it reaches you safely.
      </p>

      <h2 className={h2}>Packaging</h2>
      <p>
        Each item is individually wrapped and cushioned, then placed in sturdy export-grade cartons.
        For bulk and export shipments we provide carton dimensions, weights, and CBM details so you
        can plan logistics accurately.
      </p>

      <h2 className={h2}>Domestic Shipping (India)</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>Dispatched via reliable courier and surface partners.</li>
        <li>Delivery time depends on destination and the product&rsquo;s production lead time.</li>
        <li>Tracking details are shared once your order is dispatched.</li>
      </ul>

      <h2 className={h2}>International &amp; Export Shipping</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>We ship worldwide by air or sea freight depending on order size and your preference.</li>
        <li>
          Export orders can be arranged on agreed Incoterms (e.g. EXW, FOB, CIF). We assist with
          documentation, HS codes, and port-of-loading details.
        </li>
        <li>
          Import duties, taxes, and customs clearance at the destination are the buyer&rsquo;s
          responsibility unless agreed otherwise.
        </li>
      </ul>

      <h2 className={h2}>Lead Times</h2>
      <p>
        As our products are handmade and often produced to order, dispatch timelines vary by item and
        quantity. Your quotation or order confirmation will include an estimated production and
        shipping timeline.
      </p>

      <h2 className={h2}>Need a Shipping Estimate?</h2>
      <p>
        Tell us your destination and quantity and we&rsquo;ll prepare a shipping plan. Message us on
        WhatsApp at +91 9509669135 or{" "}
        <a href="/rfq" className="font-medium text-[#C5A059] hover:underline">
          request a quote
        </a>
        .
      </p>
    </LegalLayout>
  );
}
