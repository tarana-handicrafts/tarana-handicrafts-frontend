import type { Metadata } from "next";
import { Hero, FeaturedProducts, ShopByCategory, AboutJaipurCraft, VideoSection, Testimonials, ProfessionalQA } from "@/components/home";
import { getCategoryTree, getFeaturedProducts, getProductsInCategory, toSummary } from "@/lib/catalog";
import { siteConfig } from "@/lib/constants";

const title = "Tarana Handicrafts Jaipur | Hand-Carved Wooden Elephants & Handicrafts";
const description =
  "Tarana Handicrafts, Jaipur: hand-carved wooden elephants, jaali and shikargah carvings, figurines and home decor by Rajasthani artisans. Retail, wholesale and corporate gifts, shipped worldwide.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
};

// Homepage JSON-LD for rich snippets
function generateHomeJsonLd() {
  const baseUrl = siteConfig.url;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}/#webpage`,
    url: `${baseUrl}/`,
    name: title,
    description,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${baseUrl}/#website` },
    about: { "@id": `${baseUrl}/#localbusiness` },
    primaryImageOfPage: { "@type": "ImageObject", url: `${baseUrl}/opengraph-image` },
  };
}

export default function Home() {
  const jsonLd = generateHomeJsonLd();
  const featured = getFeaturedProducts(4).map(toSummary);
  const categories = getCategoryTree().map((c) => ({ ...c, count: getProductsInCategory(c.slug).length }));

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <FeaturedProducts products={featured} />
      <ShopByCategory categories={categories} />
      <AboutJaipurCraft />
      <VideoSection />
      <Testimonials />
      <ProfessionalQA />
    </>
  );
}
