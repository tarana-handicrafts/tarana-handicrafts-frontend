import type { NextConfig } from "next";
import categories from "./content/categories.json";

type CategoryNode = { slug: string; children?: CategoryNode[] };
const categorySlugs = (nodes: CategoryNode[]): string[] =>
  nodes.flatMap((c) => [c.slug, ...categorySlugs(c.children ?? [])]);

const nextConfig: NextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,

  // Use standalone output only for Docker; Vercel handles this automatically
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" as const } : {}),

  // Image Optimization Configuration
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
    unoptimized: false,
  },

  // Enable compression
  compress: true,

  // Remove X-Powered-By header for security
  poweredByHeader: false,

  // Security and Performance Headers
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' ${isDev ? "'unsafe-eval'" : ""} 'unsafe-inline'`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube.com",
              "connect-src 'self'",
              "form-action 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
      {
        // Files in public/ keep their names when edited, so don't mark them immutable.
        source: "/(.*)\\.(ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },

  // Old backend URLs: Mongo-id product pages, category pages, and removed features.
  async redirects() {
    return [
      { source: "/products/:id([0-9a-f]{24})", destination: "/products", permanent: true },
      ...categorySlugs(categories as CategoryNode[]).map((slug) => ({
        source: `/products/${slug}`,
        destination: `/collections/${slug}`,
        permanent: true,
      })),
      { source: "/blog/:path*", destination: "/", permanent: true },
      { source: "/sample-order", destination: "/", permanent: true },
    ];
  },

  // Content JSON is read from disk at runtime by API routes (e.g. product names in enquiries).
  outputFileTracingIncludes: {
    "/api/**": ["./content/**/*"],
  },
};

export default nextConfig;
