import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Use Cases - Interior Inspiration",
  description:
    "Discover how our handcrafted pieces can transform your living spaces. Get inspiration for your home decor.",
};

const useCases = [
  {
    id: 1,
    title: "Living Room Elegance",
    description:
      "Transform your living space with our stunning wall art and sculptural pieces. Create a focal point that sparks conversation.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
    products: ["Wall Art", "Sculptures", "Decorative Panels"],
  },
  {
    id: 2,
    title: "Bedroom Sanctuary",
    description:
      "Create a peaceful retreat with our carefully crafted wooden decor. Each piece adds warmth and character to your personal space.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    products: ["Carved Mirrors", "Bedside Lamps", "Wall Hangings"],
  },
  {
    id: 3,
    title: "Office & Study",
    description:
      "Inspire creativity and focus with artisan pieces that bring nature's beauty indoors. Perfect for home offices and study areas.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    products: ["Desk Accessories", "Book Ends", "Decorative Sculptures"],
  },
  {
    id: 4,
    title: "Entryway & Hallway",
    description:
      "Make a lasting first impression with statement pieces that welcome guests into your home with style and grace.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    products: ["Console Tables", "Wall Mirrors", "Decorative Figurines"],
  },
  {
    id: 5,
    title: "Outdoor & Patio",
    description:
      "Extend your living space outdoors with weather-resistant handcrafted pieces that blend seamlessly with nature.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    products: ["Garden Sculptures", "Outdoor Wall Art", "Planters"],
  },
  {
    id: 6,
    title: "Corporate & Hospitality",
    description:
      "Elevate commercial spaces with custom handcrafted pieces that reflect your brand's commitment to quality and craftsmanship.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
    products: ["Custom Installations", "Lobby Art", "Conference Room Decor"],
  },
];

export default function UseCasesPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-16 text-center">
          <span className="mb-2 inline-block text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
            Inspiration Gallery
          </span>
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
            Transform Your Space
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[var(--color-muted)]">
            Discover how our handcrafted pieces can elevate any space. From
            cozy homes to grand lobbies, our artisan creations bring warmth and
            character to every corner.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <article
              key={useCase.id}
              className="group overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--background)] transition-all hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={useCase.image}
                  alt={useCase.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                  {useCase.title}
                </h2>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="mb-4 text-[var(--color-muted)]">
                  {useCase.description}
                </p>

                {/* Product Tags */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {useCase.products.map((product) => (
                    <span
                      key={product}
                      className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-medium text-[var(--color-primary)]"
                    >
                      {product}
                    </span>
                  ))}
                </div>

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-dark)]"
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
        <div className="mt-20 rounded-2xl bg-[var(--color-primary)] p-8 text-center text-white sm:p-12">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Need Custom Pieces for Your Project?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
            Our artisans can create bespoke pieces tailored to your specific
            requirements. From size to finish, we bring your vision to life.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-white px-8 py-4 text-lg font-medium text-[var(--color-primary)] transition-all hover:bg-opacity-90 hover:shadow-lg"
          >
            Request Custom Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
