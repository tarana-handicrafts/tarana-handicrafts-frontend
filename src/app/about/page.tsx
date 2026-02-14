import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Our Heritage & Craftsmanship",
  description:
    "Discover Tarana Handicrafts - A Jaipur-based wooden handicrafts brand preserving Rajasthan's cultural heritage through premium handcrafted wooden sculptures and elephants.",
  openGraph: {
    title: "About Tarana Handicrafts - Jaipur Art Heritage",
    description:
      "Preserving and sharing the cultural wooden art heritage of Rajasthan through premium handcrafted wooden sculptures.",
  },
};

// Stats data
const stats = [
  { value: "25+", label: "Years of Heritage" },
  { value: "12k+", label: "Happy Collectors" },
  { value: "10+", label: "Countries Served" },
  { value: "100%", label: "Handcrafted" },
];

// Values data
const values = [
  {
    icon: "heritage",
    title: "Cultural Heritage",
    description:
      "Every piece reflects the rich artistic traditions of Rajasthan, preserving techniques passed down through generations.",
  },
  {
    icon: "craft",
    title: "Master Craftsmanship",
    description:
      "Our skilled artisans spend weeks on each piece, ensuring authenticity, durability, and uniqueness in every product.",
  },
  {
    icon: "quality",
    title: "Premium Quality",
    description:
      "We use only the finest seasoned wood, ensuring our pieces never crack or lose shape in any climate.",
  },
  {
    icon: "global",
    title: "Global Delivery",
    description:
      "Museum-grade packaging ensures your treasures arrive in perfect condition, anywhere in the world.",
  },
];

// Product categories
// const categories = [
//   { name: "Elephants", description: "Intricate traditional patterns" },
//   { name: "Ganesh Statue", description: "Delicate lattice artwork" },
//   { name: "Buddha Statue", description: "Vibrant Rajasthani colors" },
//   { name: "Cow", description: "Royal luxury designs" },
//   { name: "Peacock", description: "Deep-cut premium carving" },
//   { name: "Lion", description: "Traditional storytelling art" },
// ];
const categories = [
  { name: "Carving Elephants", description: "Intricate traditional patterns" },
  { name: "Jali Elephants", description: "Delicate lattice artwork" },
  { name: "Painting Elephants", description: "Vibrant Rajasthani colors" },
  { name: "Jewellery Elephants", description: "Royal luxury designs" },
  { name: "Khudai Elephants", description: "Deep-cut premium carving" },
  { name: "Shikar Elephants", description: "Traditional storytelling art" },
];

// Icon components
const icons = {
  heritage: (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  craft: (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  quality: (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  global: (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#0A0A09] px-6 py-24 text-white">
        {/* Background Pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
            Our Story
          </span>
          <h1 className="mb-6 font-serif text-4xl leading-tight md:text-6xl lg:text-7xl">
            Preserving Rajasthan&apos;s{" "}
            <span className="font-light italic text-stone-400">
              Wooden Art Heritage
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-stone-400">
            Tarana Handicrafts is a Jaipur-based wooden handicrafts brand
            specializing in handcrafted wooden elephant art. Rooted in the rich
            artistic traditions of Rajasthan, we create timeless wooden décor
            pieces that reflect cultural heritage, craftsmanship, and elegance.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="h-6 w-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-stone-200 bg-white py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-serif text-4xl text-[#C5A059] md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-[#F9F8F6] py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Image */}
            <div className="relative">
              <div className="absolute -inset-4 -z-10 translate-x-3 translate-y-3 border border-[#C5A059]/30" />
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-200">
                <Image
                    src="/1.png"
                    alt="Master artisan crafting wooden elephant"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Badge */}
              <div className="absolute -bottom-6 -right-6 bg-[#C5A059] p-6 text-white shadow-xl">
                <p className="text-[9px] font-black uppercase tracking-widest">
                  Made in
                </p>
                <p className="font-serif text-2xl italic">Jaipur</p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
                  Our Mission
                </span>
                <h2 className="mb-4 font-serif text-3xl leading-tight md:text-4xl">
                  Crafting Cultural{" "}
                  <span className="font-light italic text-stone-400">
                    Legacies
                  </span>
                </h2>
                <p className="text-lg font-light leading-relaxed text-stone-600">
                  To preserve and promote the wooden handicraft culture of
                  Rajasthan by manufacturing authentic handcrafted art pieces
                  and delivering them globally with trust, quality, and pride.
                </p>
              </div>

              <div className="border-t border-stone-200 pt-8">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
                  Our Vision
                </span>
                <p className="text-lg font-light leading-relaxed text-stone-600">
                  To make Tarana Handicrafts a globally recognized brand
                  representing Jaipur&apos;s traditional craftsmanship, becoming
                  a trusted name in premium wooden décor and cultural gifting.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/products"
                  className="bg-stone-900 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-[#C5A059] hover:shadow-xl"
                >
                  Explore Collection
                </Link>
                <Link
                  href="/contact"
                  className="border border-stone-300 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900 transition-all hover:border-[#C5A059] hover:text-[#C5A059]"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Wooden Elephants Section */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
              Symbolic Meaning
            </span>
            <h2 className="mb-4 font-serif text-3xl md:text-5xl">
              Why Wooden Elephants?
            </h2>
            <p className="mx-auto max-w-2xl text-lg font-light text-stone-600">
              Our wooden elephants are not just décor pieces — they are cultural
              symbols that bring positive energy and happiness into homes.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {["Strength", "Wisdom", "Prosperity", "Positivity", "Good Luck"].map(
              (meaning, index) => (
                <div
                  key={index}
                  className="group border border-stone-100 p-8 text-center transition-all hover:border-[#C5A059]/30 hover:shadow-xl"
                >
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#C5A059]/10 text-3xl transition-all group-hover:bg-[#C5A059] group-hover:text-white">
                    {["💪", "🧠", "✨", "☀️", "🍀"][index]}
                  </div>
                  <h3 className="font-serif text-xl">{meaning}</h3>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-[#0A0A09] py-24 px-6 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
              What Sets Us Apart
            </span>
            <h2 className="font-serif text-3xl md:text-5xl">Our Values</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="group border border-white/10 p-8 transition-all hover:border-[#C5A059]/30 hover:bg-white/5"
              >
                <div className="mb-6 text-[#C5A059]">
                  {icons[value.icon as keyof typeof icons]}
                </div>
                <h3 className="mb-3 font-serif text-xl">{value.title}</h3>
                <p className="text-sm font-light leading-relaxed text-stone-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="bg-[#F9F8F6] py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
              Our Craft
            </span>
            <h2 className="mb-4 font-serif text-3xl md:text-5xl">
              Product Categories
            </h2>
            <p className="mx-auto max-w-2xl text-lg font-light text-stone-600">
              We manufacture a wide range of wooden elephant handicrafts,
              including multiple design styles and categories.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group flex items-center gap-4 border border-stone-200 bg-white p-6 transition-all hover:border-[#C5A059]/50 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C5A059]/10 font-mono text-sm font-bold text-[#C5A059] transition-all group-hover:bg-[#C5A059] group-hover:text-white">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="font-serif text-lg">{category.name}</h3>
                  <p className="text-sm text-stone-500">{category.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900 transition-colors hover:text-[#C5A059]"
            >
              View All Products
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Customization & Export Section */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Customization */}
            <div className="border border-stone-200 p-10">
              <span className="mb-4 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
                Bespoke Service
              </span>
              <h3 className="mb-4 font-serif text-2xl md:text-3xl">
                Custom Orders
              </h3>
              <p className="mb-6 font-light leading-relaxed text-stone-600">
                We support customization to bring your vision to life. Whether
                it&apos;s a unique design, specific dimensions, or branded
                packaging for corporate gifting — we deliver.
              </p>
              <ul className="space-y-3">
                {[
                  "Design patterns & styles",
                  "Sizes and dimensions",
                  "Painting & finishing options",
                  "Custom packaging for gifting",
                  "Bulk order branding",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-stone-700">
                    <svg className="h-5 w-5 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Export */}
            <div className="border border-stone-200 p-10">
              <span className="mb-4 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
                Worldwide
              </span>
              <h3 className="mb-4 font-serif text-2xl md:text-3xl">
                Global Export
              </h3>
              <p className="mb-6 font-light leading-relaxed text-stone-600">
                We export wooden handicraft items across the world, bringing the
                cultural art of Rajasthan to global homes, offices, and décor
                spaces.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C5A059]/10">
                    <svg className="h-5 w-5 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Museum-Grade Packaging</h4>
                    <p className="text-sm text-stone-500">
                      Zero-vibration crates with high-density foam suspension
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C5A059]/10">
                    <svg className="h-5 w-5 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Secure Delivery</h4>
                    <p className="text-sm text-stone-500">
                      Insured shipping with real-time tracking worldwide
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#C5A059] py-20 px-6 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 font-serif text-3xl md:text-5xl">
            Ready to Own a Piece of Jaipur?
          </h2>
          <p className="mb-8 text-lg font-light opacity-90">
            Explore our curated collection of handcrafted masterpieces or
            connect with us for bespoke orders.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="bg-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059] transition-all hover:bg-stone-900 hover:text-white hover:shadow-xl"
            >
              Shop Collection
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-white hover:text-[#C5A059]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
