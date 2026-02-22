import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { CartSidebar } from "@/components/cart/CartSidebar";
import "./globals.css";

// Primary font for body text - optimized for readability
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Elegant font for headings - perfect for handicrafts brand
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  preload: true,
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
  "@type": "Organization",
  name: "Tarana Handicrafts",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com",
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com"}/logo.png`,
  description:
    "Authentic handcrafted art, home decor, and traditional handicrafts.",
  sameAs: [
    "https://facebook.com/taranahandicrafts",
    "https://instagram.com/taranahandicrafts",
    "https://twitter.com/taranahandicrafts",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Hindi"],
  },
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
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <CartProvider>
          <Header />
          <CartSidebar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
