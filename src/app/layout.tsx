import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { siteConfig } from "@/lib/constants";
import { SEARCH_TOPICS, generateSiteJsonLd } from "@/lib/seo";
import "./globals.css";

// Primary font for body text - optimized for readability
// Using only necessary weights for better performance
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

// Elegant font for headings - perfect for handicrafts brand
// Using only necessary weights for better performance
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const defaultTitle = "Tarana Handicrafts Jaipur | Hand-Carved Wooden Elephants & Handicrafts";
const defaultDescription =
  "Tarana Handicrafts, Jaipur: hand-carved wooden elephants, jaali and shikargah carvings, figurines and home decor made by Rajasthani artisans. Retail, wholesale and corporate gifts, shipped worldwide.";

// SEO Metadata Configuration
// The share image comes from app/opengraph-image.tsx, which Next.js applies to every route.
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: "%s | Tarana Handicrafts",
  },
  description: defaultDescription,
  applicationName: siteConfig.name,
  keywords: SEARCH_TOPICS,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "shopping",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: siteConfig.name,
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Google is verified via public/google*.html. Set these env vars to verify Bing and Yandex.
  verification: {
    other: {
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION && { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }),
      ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION && { "yandex-verification": process.env.NEXT_PUBLIC_YANDEX_VERIFICATION }),
    },
  },
  other: {
    "geo.region": "IN-RJ",
    "geo.placename": "Jaipur",
    "geo.position": "27.021601;75.767587",
    ICBM: "27.021601, 75.767587",
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", sizes: "180x180" }],
    shortcut: ["/favicon.png"],
  },
  manifest: "/manifest.json",
};

// Viewport Configuration for optimal mobile experience
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// JSON-LD Structured Data: WebSite (site name in results), Organization (logo,
// socials) and Store (Google Maps / local results)
const jsonLd = generateSiteJsonLd();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        {/* Skip to content link for accessibility - improves keyboard navigation */}
        <a
          href="#main-content"
          className="skip-to-content"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
