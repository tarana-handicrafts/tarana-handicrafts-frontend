import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch",
  description:
    "Contact Tarana Handicrafts for wooden elephant sculptures, custom orders, and bulk exports. Located in Jaipur, Rajasthan. Call +91 9509669135 or email taranahandicrafts@gmail.com",
  keywords: [
    "contact Tarana Handicrafts",
    "Jaipur handicrafts shop",
    "wooden elephant orders",
    "custom handicrafts",
    "bulk export handicrafts",
    "Rajasthan artisans",
  ],
  openGraph: {
    title: "Contact Tarana Handicrafts - Jaipur",
    description:
      "Get in touch for handcrafted wooden art, custom orders, and worldwide shipping from Jaipur, Rajasthan.",
    type: "website",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
