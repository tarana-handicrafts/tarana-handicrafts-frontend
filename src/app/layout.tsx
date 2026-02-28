import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { CartSidebar } from "@/components/cart/CartSidebar";
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

// SEO Metadata Configuration
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.taranahandicrafts.com"),
  title: {
    default: "Tarana Handicrafts - Authentic Handcrafted Art & Decor",
    template: "%s | Tarana Handicrafts",
  },
  description:
    "Discover exquisite handcrafted art, home decor, and traditional handicrafts. Shop authentic artisan-made products with worldwide shipping.",
  applicationName: "Tarana Handicrafts",
  generator: "Next.js",
  keywords: [
    "handicrafts",
    "handmade",
    "artisan",
    "home decor",
    "traditional art",
    "handcrafted",
    "Indian handicrafts",
    "ethnic decor",
    "wooden elephant",
    "Jaipur crafts",
    "Rajasthani art",
  ],
  authors: [{ name: "Tarana Handicrafts" }],
  creator: "Tarana Handicrafts",
  publisher: "Tarana Handicrafts",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Tarana Handicrafts",
    title: "Tarana Handicrafts - Authentic Handcrafted Art & Decor",
    description:
      "Discover exquisite handcrafted art, home decor, and traditional handicrafts. Shop authentic artisan-made products with worldwide shipping.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tarana Handicrafts - Handcrafted Art & Decor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarana Handicrafts - Authentic Handcrafted Art & Decor",
    description:
      "Discover exquisite handcrafted art, home decor, and traditional handicrafts.",
    images: ["/og-image.jpg"],
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
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
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

// JSON-LD Structured Data for SEO
// WebSite schema is first - this is what Google uses for site name in breadcrumbs
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.taranahandicrafts.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: "Tarana Handicrafts",
      alternateName: ["Tarana", "Tarana Handicrafts India", "Tarana Jaipur"],
      description: "Authentic handcrafted wooden art, home decor, and traditional Rajasthani handicrafts from Jaipur artisans.",
      publisher: {
        "@id": `${baseUrl}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${baseUrl}/products?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "en-IN",
    },
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: "Tarana Handicrafts",
      legalName: "Tarana Handicrafts",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        "@id": `${baseUrl}/#logo`,
        url: `${baseUrl}/logo.png`,
        contentUrl: `${baseUrl}/logo.png`,
        caption: "Tarana Handicrafts Logo",
        inLanguage: "en-IN",
        width: 512,
        height: 512,
      },
      image: {
        "@id": `${baseUrl}/#logo`,
      },
      description: "Authentic handcrafted art, home decor, and traditional handicrafts from Jaipur, Rajasthan.",
      sameAs: [
        "https://facebook.com/taranahandicrafts",
        "https://instagram.com/taranahandicrafts",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-9509669135",
        contactType: "customer service",
        areaServed: ["IN", "US", "GB", "AE", "AU"],
        availableLanguage: ["English", "Hindi"],
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "B81, North Avenue, Harmara Ghati, Sikar Road",
        addressLocality: "Jaipur",
        addressRegion: "Rajasthan",
        postalCode: "302039",
        addressCountry: "IN",
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": `${baseUrl}/#localbusiness`,
      name: "Tarana Handicrafts",
      image: `${baseUrl}/og-image.jpg`,
      url: baseUrl,
      telephone: "+91-9509669135",
      email: "taranahandicrafts@gmail.com",
      priceRange: "₹₹",
      address: {
        "@type": "PostalAddress",
        streetAddress: "B81, North Avenue, Harmara Ghati, Sikar Road",
        addressLocality: "Jaipur",
        addressRegion: "Rajasthan",
        postalCode: "302039",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 27.021601,
        longitude: 75.767587,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "10:00",
          closes: "19:00",
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Simple WebSite Schema for Google Site Name in Breadcrumbs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Tarana Handicrafts",
              "url": "https://www.taranahandicrafts.com/"
            })
          }}
        />
        {/* Full Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://wa.me" />
        {/* Preload critical hero image for LCP optimization */}
        <link
          rel="preload"
          href="/2.jpg"
          as="image"
          type="image/jpeg"
          fetchPriority="high"
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
        <CartProvider>
          <Header />
          <CartSidebar />
          <main id="main-content" className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
