import { MetadataRoute } from "next";
import {
  getPublicProducts,
  getUseCases,
  getCategoryTree,
} from "@/lib/storeApi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.taranahandicrafts.com";

  // Static pages with priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/use-cases`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    // Fetch all products (paginated - up to 500 for sitemap)
    const data = await getPublicProducts({ limit: 100, page: 1 });
    const totalPages = data.pagination.pages;

    productPages = data.products.map((product) => ({
      url: `${baseUrl}/products/${product._id}`,
      lastModified: product.createdAt ? new Date(product.createdAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    // Fetch additional pages if available (up to 5 pages)
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
      } catch {
        break;
      }
    }
  } catch {
    // If API is unavailable, return static pages only
  }

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
  } catch {
    // Continue without use case pages
  }

  // Category pages
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const { categories } = await getCategoryTree();
    const flattenCategories = (cats: typeof categories): MetadataRoute.Sitemap =>
      cats.flatMap((cat) => [
        {
          url: `${baseUrl}/products?categoryId=${cat._id}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        },
        ...(cat.children ? flattenCategories(cat.children) : []),
      ]);
    categoryPages = flattenCategories(categories);
  } catch {
    // Continue without category pages
  }

  return [...staticPages, ...categoryPages, ...productPages, ...useCasePages];
}
