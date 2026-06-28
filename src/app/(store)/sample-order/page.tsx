import type { Metadata } from "next";
import SampleOrderClient from "./SampleOrderClient";

export const metadata: Metadata = {
  title: "Sample Order | Tarana Handicrafts",
  description:
    "Order 1-3 samples of our handcrafted wooden art. Sample cost credited against your first bulk purchase. Perfect for importers and retailers.",
  keywords: ["sample order handicrafts", "try before buy wholesale", "handicraft sample India"],
  openGraph: {
    title: "Sample Order | Tarana Handicrafts",
    description: "Order samples of our handcrafted wooden art. Cost credited against first bulk PO.",
    type: "website",
  },
  alternates: { canonical: "/sample-order" },
};

export default function SampleOrderPage() {
  return <SampleOrderClient />;
}
