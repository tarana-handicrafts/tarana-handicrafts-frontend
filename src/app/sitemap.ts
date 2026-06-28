import { MetadataRoute } from "next";
import {
  getPublicProducts,
  getUseCases,
  getCategoryTree,
  getBlogPosts,
} from "@/lib/storeApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.taranahandicrafts.com";

  // Static pages with priority
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/use-cases`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/rfq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },

    { url: `${baseUrl}/sample-order`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/shipping`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/returns`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const data = await getPublicProducts({ limit: 100, page: 1 });
    const totalPages = data.pagination.pages;
    productPages = data.products.map((product) => ({
      url: `${baseUrl}/products/${product._id}`,
      lastModified: product.createdAt ? new Date(product.createdAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
    for (let page = 2; page <= Math.min(totalPages, 5); page++) {
      try {
        const pageData = await getPublicProducts({ limit: 100, page });
        productPages.push(
          ...pageData.products.map((product) => ({
            url: `${baseUrl}/products/${product._id}`,
            lastModified: product.createdAt ? new Date(product.createdAt) : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.6,
          }))
        );
      } catch { break; }
    }
  } catch {}

  // Use case pages
  let useCasePages: MetadataRoute.Sitemap = [];
  try {
    const { useCases } = await getUseCases();
    useCasePages = useCases
      .filter((uc) => uc.isActive)
      .map((uc) => ({
        url: `${baseUrl}/use-cases/${uc.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
  } catch {}

  // Category pages (slug-based)
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const { categories } = await getCategoryTree();
    const flattenCategories = (cats: typeof categories): MetadataRoute.Sitemap =>
      cats.flatMap((cat) => [
        {
          url: `${baseUrl}/products/${cat.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        },
        ...(cat.children ? flattenCategories(cat.children) : []),
      ]);
    categoryPages = flattenCategories(categories);
  } catch {}

  // Blog pages
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const { posts } = await getBlogPosts({ limit: 50 });
    blogPages = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {}

  return [...staticPages, ...categoryPages, ...productPages, ...useCasePages, ...blogPages];
}
