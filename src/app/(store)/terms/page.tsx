import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service | Tarana Handicrafts",
  description:
    "The terms and conditions governing your use of the Tarana Handicrafts website, quotations, and orders.",
  alternates: { canonical: "/terms" },
};

const h2 = "font-serif text-2xl text-stone-900";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" subtitle="Legal" updated="February 2025">
      <p>
        These Terms govern your use of www.taranahandicrafts.com and any quotation, sample, or order
        arranged through it. By using the site or placing an enquiry, you agree to these Terms.
      </p>

      <h2 className={h2}>Products &amp; Handcrafted Nature</h2>
      <p>
        Our pieces are hand-carved by artisans. As a result, minor variations in grain, finish,
        size, and colour are natural and are not defects — they are the mark of a genuinely handmade
        product. Product images are representative; the item you receive may differ slightly.
      </p>

      <h2 className={h2}>Quotations &amp; Pricing</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>Quotations are valid for the period stated in the quote; prices may change afterwards.</li>
        <li>
          Wholesale and export pricing depends on quantity, customisation, packaging, and shipping
          terms (Incoterms) agreed in writing.
        </li>
        <li>Retail prices shown on the website are inclusive of applicable charges as indicated at checkout.</li>
      </ul>

      <h2 className={h2}>Orders &amp; Payment</h2>
      <p>
        An order is confirmed once payment (or the agreed advance, for bulk/export orders) is
        received. For custom and bulk orders, production begins after the advance is confirmed.
      </p>

      <h2 className={h2}>Lead Times</h2>
      <p>
        Because items are made by hand and often to order, lead times vary by product and quantity.
        Estimated lead times are shared in your quotation or order confirmation.
      </p>

      <h2 className={h2}>Intellectual Property</h2>
      <p>
        All content on this website — including designs, images, and text — belongs to Tarana
        Handicrafts and may not be copied or reused without permission.
      </p>

      <h2 className={h2}>Limitation of Liability</h2>
      <p>
        To the extent permitted by law, our liability for any order is limited to the value of that
        order. We are not liable for delays caused by events outside our reasonable control,
        including customs, courier, or shipping-line delays.
      </p>

      <h2 className={h2}>Governing Law</h2>
      <p>
        These Terms are governed by the laws of India, and any disputes are subject to the
        jurisdiction of the courts of Jaipur, Rajasthan.
      </p>
    </LegalLayout>
  );
}
