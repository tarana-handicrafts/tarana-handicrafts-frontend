import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import useCasesData from "@/data/usecaseCategories.json";

export const metadata: Metadata = {
  title: "Use Cases - Interior Inspiration",
  description:
    "Discover how our handcrafted pieces can transform your living spaces. Get inspiration for your home decor.",
};

// Type definition for use cases
interface UseCase {
  id: number;
  title: string;
  description: string;
  image: string;
  products: string[];
}

// Load use cases from JSON file
const useCases: UseCase[] = useCasesData.useCases;

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] px-4 pb-16 pt-32">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-16 text-center">
          <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
            Inspiration Gallery
          </span>
          <h1 className="mb-4 font-serif text-4xl sm:text-5xl">
            Transform Your Space
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-stone-500">
            Discover how our handcrafted pieces can elevate any space. From
            cozy homes to grand lobbies, our artisan creations bring warmth and
            character to every corner.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase, index) => (
            <article
              key={useCase.id}
              className="group overflow-hidden rounded-xl border border-stone-200 bg-white transition-all hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={useCase.image}
                  alt={`${useCase.title} - Interior design inspiration`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading={index < 3 ? "eager" : "lazy"}
                  priority={index < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                  {useCase.title}
                </h2>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="mb-4 text-stone-500">
                  {useCase.description}
                </p>

                {/* Product Tags */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {useCase.products.map((product) => (
                    <span
                      key={product}
                      className="rounded-full bg-[#C5A059]/10 px-3 py-1 text-xs font-medium text-[#C5A059]"
                    >
                      {product}
                    </span>
                  ))}
                </div>

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 font-medium text-[#C5A059] transition-colors hover:text-stone-900"
                >
                  Shop This Look
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 rounded-xl bg-[#C5A059] p-8 text-center text-white sm:p-12">
          <h2 className="mb-4 font-serif text-3xl sm:text-4xl">
            Need Custom Pieces for Your Project?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
            Our artisans can create bespoke pieces tailored to your specific
            requirements. From size to finish, we bring your vision to life.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-white px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059] transition-all hover:bg-stone-900 hover:text-white hover:shadow-xl"
          >
            Request Custom Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
