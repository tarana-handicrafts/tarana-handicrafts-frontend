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
    title: "Executive Desk Branding",
    description:
        "Transform a standard workspace into a position of power. Our utility elephants keep essential tools organized while serving as a constant reminder of your brand's strength.",
    image: "https://your-image-link.com/executive-desk.jpg", // Suggested: The 'Pen Holder' or 'Acoustic Trumpet' in a high-end office
    products: ["Pen Holder Elephants", "Acoustic Phone Amplifiers", "Business Card Stands"],
  },
  {
    id: 2,
    title: "Corporate Milestone Gifts",
    description:
        "Celebrate promotions, retirements, or years of service with symbolic art. Use our 'Baby inside Mother' Jali work to represent protection and long-term legacy.",
    image: "https://your-image-link.com/milestone-gift.jpg", // Suggested: The 'Jali' elephant on a dark walnut base with a brass nameplate
    products: ["Hand-carved Jali Elephants", "Custom Engraved Bases", "Royal Butler Trays"],
  },
  {
    id: 3,
    title: "Productivity & Focus",
    description:
        "A clutter-free desk leads to a clutter-free mind. Our functional sculptures manage sticky notes and paperclips, blending traditional craft with modern efficiency.",
    image: "https://your-image-link.com/productivity.jpg", // Suggested: The 'Cargo' Sticky Note Holder or 'Magnetic' Paperclip holder
    products: ["Sticky Note Dispensers", "Magnetic Paperclip Holders", "Perpetual Calendars"],
  },
  {
    id: 4,
    title: "Tech-Forward Traditions",
    description:
        "Modern utility meets ancient craft. Bridge the gap between nature and technology with handcrafted docking stations and smart acoustic amplifiers.",
    image: "https://your-image-link.com/tech-utility.jpg", // Suggested: The 'Guardian' Wireless Charger or Cable Weight
    products: ["Wireless Charging Docks", "Cable Management Weights", "Phone Amplifiers"],
  },
  {
    id: 5,
    title: "Hospitality & Reception",
    description:
        "Make a lasting first impression in your lobby or concierge desk. Our large-scale figurines and catch-all trays welcome guests with elegance and warmth.",
    image: "https://your-image-link.com/hospitality.jpg", // Suggested: Large elephant figurines or the 'Royal Butler' Tray on a reception counter
    products: ["Statement Figurines", "Royal Butler Trays", "Spectacle Holders"],
  },
  {
    id: 6,
    title: "Wellness & Eco-Workspaces",
    description:
        "Bring life to the office. Our planter series integrates greenery into the workspace, promoting mental well-being and a commitment to sustainable artisan craft.",
    image: "https://your-image-link.com/wellness.jpg", // Suggested: The 'Green Growth' Succulent Planter near a window
    products: ["Succulent Planters", "Aura Lanterns", "Eco-friendly Packaging"],
  },
];

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
