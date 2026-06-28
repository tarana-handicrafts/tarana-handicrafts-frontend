import type { Metadata } from "next";
import BlogPostClient from "./BlogPostClient";

export const metadata: Metadata = {
  title: "Blog Post | Tarana Handicrafts",
  description: "Read our latest articles about handcrafted wooden art and handicrafts.",
};

export default function BlogPostPage() {
  return <BlogPostClient />;
}
