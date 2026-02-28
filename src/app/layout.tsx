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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com"),
  title: {
    default: "Tarana Handicrafts - Authentic Handcrafted Art & Decor",
    template: "%s | Tarana Handicrafts",
  },
  description:
    "Discover exquisite handcrafted art, home decor, and traditional handicrafts. Shop authentic artisan-made products with worldwide shipping.",
  keywords: [
    "handicrafts",
    "handmade",
    "artisan",
    "home decor",
    "traditional art",
    "handcrafted",
    "Indian handicrafts",
    "ethnic decor",
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
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com"}/#organization`,
      name: "Tarana Handicrafts",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com"}/logo.png`,
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
        availableLanguage: ["English", "Hindi"],
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com"}/#localbusiness`,
      name: "Tarana Handicrafts",
      image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com"}/og-image.jpg`,
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com",
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
    {
      "@type": "WebSite",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com"}/#website`,
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com",
      name: "Tarana Handicrafts",
      publisher: {
        "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com"}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com"}/products?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
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
        {/* Structured Data for SEO */}
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
