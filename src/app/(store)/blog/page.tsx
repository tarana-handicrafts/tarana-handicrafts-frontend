import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Journal | Tarana Handicrafts",
  description:
    "Stories from the workshop, buying guides, and insights into handcrafted wooden art from Jaipur, India.",
  keywords: ["handicraft blog", "wooden elephant guide", "import handicrafts from India", "Jaipur crafts", "artisan stories"],
  openGraph: {
    title: "Journal | Tarana Handicrafts",
    description: "Stories from the workshop, buying guides, and insights into handcrafted wooden art.",
    type: "website",
  },
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return <BlogClient />;
}
