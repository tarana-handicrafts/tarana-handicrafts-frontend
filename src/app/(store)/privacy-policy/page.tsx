import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Tarana Handicrafts",
  description:
    "How Tarana Handicrafts collects, uses, and protects your personal information when you browse our store or request a quote.",
  alternates: { canonical: "/privacy-policy" },
};

const h2 = "font-serif text-2xl text-stone-900";
const h3 = "mt-6 font-semibold text-stone-900";

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" subtitle="Legal" updated="February 2025">
      <p>
        Tarana Handicrafts (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) respects your
        privacy. This policy explains what information we collect, how we use it, and the choices
        you have. It applies to www.taranahandicrafts.com and our quotation and order processes.
      </p>

      <h2 className={h2}>Information We Collect</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          <strong>Contact details</strong> you provide — name, email, phone/WhatsApp number,
          company, and country — when you submit an enquiry, quote request, or place an order.
        </li>
        <li>
          <strong>Order &amp; quote details</strong> — products, quantities, shipping destination,
          and any requirements you share.
        </li>
        <li>
          <strong>Technical data</strong> — basic, anonymised analytics such as pages visited and
          device type, used to improve the website.
        </li>
      </ul>

      <h2 className={h2}>How We Use Your Information</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>To prepare and send quotations and respond to your enquiries.</li>
        <li>To process, manufacture, pack, and ship your orders.</li>
        <li>To keep you updated about the status of an order or quote you requested.</li>
        <li>To improve our products, website, and customer service.</li>
      </ul>

      <h2 className={h2}>Sharing of Information</h2>
      <p>
        We do not sell your personal data. We share information only with trusted partners needed to
        fulfil your request — such as logistics and courier companies for shipping, and payment
        providers — and only to the extent required.
      </p>

      <h2 className={h2}>Cookies</h2>
      <p>
        Our website may use essential cookies and basic analytics to function correctly and
        understand how visitors use the site. You can control cookies through your browser settings;
        disabling them may affect some features.
      </p>

      <h2 className={h2}>Data Retention &amp; Security</h2>
      <p>
        We keep your information only as long as necessary to serve your enquiry or order and to meet
        legal and accounting requirements. We use reasonable technical and organisational measures to
        protect your data.
      </p>

      <h2 className={h2}>Your Rights</h2>
      <p>
        You may ask us to access, correct, or delete the personal information we hold about you.
        To make a request, email us at{" "}
        <a href="mailto:taranahandicrafts@gmail.com" className="font-medium text-[#C5A059] hover:underline">
          taranahandicrafts@gmail.com
        </a>
        .
      </p>

      <h3 className={h3}>Contact</h3>
      <p>
        Tarana Handicrafts, B81, North Avenue, Harmara Ghati, Sikar Road, Jaipur, Rajasthan 302039,
        India. Phone: +91 9509669135 / +91 8952819888.
      </p>
    </LegalLayout>
  );
}
