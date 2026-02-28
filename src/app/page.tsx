import { Hero, TopSeller, VideoSection, Testimonials, ProfessionalQA } from "@/components/home";
import { productsData } from "@/lib/products";

// Homepage JSON-LD for rich snippets
function generateHomeJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/#webpage`,
        url: baseUrl,
        name: "Tarana Handicrafts - Authentic Handcrafted Art & Decor",
        description: "Discover exquisite handcrafted wooden elephant sculptures, home decor, and traditional Rajasthani handicrafts from Jaipur artisans.",
        isPartOf: {
          "@id": `${baseUrl}/#website`,
        },
        about: {
          "@id": `${baseUrl}/#organization`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${baseUrl}/og-image.jpg`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: baseUrl,
          },
        ],
      },
    ],
  };
}

export default function Home() {
  const jsonLd = generateHomeJsonLd();

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <TopSeller products={productsData} />
      <VideoSection />
      <Testimonials />
      <ProfessionalQA />
    </>
  );
}
