import type { MetadataRoute } from "next";
import { getAllCategories, getAllProducts } from "@/lib/catalog";
import { siteConfig } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/products`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/rfq`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/use-cases`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/shipping`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/returns`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ].map((page) => ({ ...page, lastModified: now }) as MetadataRoute.Sitemap[number]);

  const collectionPages: MetadataRoute.Sitemap = getAllCategories().map((category) => ({
    url: `${baseUrl}/collections/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = getAllProducts().map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
    images: product.images.map((img) => `${baseUrl}${img.src}`),
  }));

  return [...staticPages, ...collectionPages, ...productPages];
}
