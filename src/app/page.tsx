import { Hero, TopSeller, VideoSection, Testimonials, ProfessionalQA } from "@/components/home";
import { productsData } from "@/lib/products";

export default function Home() {
  return (
    <>
      <Hero />
      <TopSeller products={productsData} />
      <VideoSection />
      <Testimonials />
      <ProfessionalQA />
    </>
  );
}
