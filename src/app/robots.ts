import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

// One rule for every crawler (Google, Bing, DuckDuckGo, Yandex, AI search...).
// Never block /_next/: crawlers need the CSS and JS to render the pages.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
