import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Returns & Refunds | Tarana Handicrafts",
  description:
    "Our returns, replacement, and refund policy for handcrafted wooden products, including damaged-in-transit and bulk orders.",
  alternates: { canonical: "/returns" },
};

const h2 = "font-serif text-2xl text-stone-900";

export default function ReturnsPage() {
  return (
    <LegalLayout title="Returns & Refunds" subtitle="Support" updated="February 2025">
      <p>
        We want you to be happy with your purchase. Because every piece is hand-carved, please read
        how returns and refunds work for handmade products.
      </p>

      <h2 className={h2}>Damaged or Defective Items</h2>
      <p>
        If your item arrives damaged or defective, contact us within <strong>48 hours</strong> of
        delivery with photos of the product and packaging. We will arrange a replacement or a refund
        for verified transit damage or genuine manufacturing defects.
      </p>

      <h2 className={h2}>Handmade Variations</h2>
      <p>
        Natural variations in wood grain, finish, colour, and minor size differences are inherent to
        handcrafted goods and are not considered defects. These characteristics make each piece
        unique.
      </p>

      <h2 className={h2}>How to Request a Return</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          Email{" "}
          <a href="mailto:taranahandicrafts@gmail.com" className="font-medium text-[#C5A059] hover:underline">
            taranahandicrafts@gmail.com
          </a>{" "}
          or WhatsApp +91 9509669135 with your order details and photos.
        </li>
        <li>Keep the item in its original packaging until the request is resolved.</li>
        <li>Once approved, we will guide you through the return or replacement steps.</li>
      </ul>

      <h2 className={h2}>Refunds</h2>
      <p>
        Approved refunds are processed to your original payment method. The time to appear in your
        account depends on your bank or payment provider.
      </p>

      <h2 className={h2}>Custom &amp; Bulk Orders</h2>
      <p>
        Custom-made and bulk/export orders are produced specifically for you and are generally not
        eligible for return except in the case of verified damage or defect. Specific terms are
        confirmed in your quotation before production begins.
      </p>
    </LegalLayout>
  );
}
