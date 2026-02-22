import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Our Heritage & Craftsmanship",
  description:
    "Discover Tarana Handicrafts - A Jaipur-based wooden handicrafts brand preserving Rajasthan's cultural heritage.",
};

const stats = [
  { value: "25+", label: "Years of Heritage" },
  { value: "12k+", label: "Happy Collectors" },
  { value: "10+", label: "Countries Served" },
  { value: "100%", label: "Handcrafted" },
];

const values = [
  {
    icon: "heritage",
    title: "Cultural Heritage",
    description: "Every piece reflects the rich artistic traditions of Rajasthan.",
  },
  {
    icon: "craft",
    title: "Master Craftsmanship",
    description: "Our skilled artisans spend weeks on each piece for authenticity.",
  },
  {
    icon: "quality",
    title: "Premium Quality",
    description: "We use only the finest seasoned wood that never cracks.",
  },
  {
    icon: "global",
    title: "Global Delivery",
    description: "Museum-grade packaging for perfect condition anywhere.",
  },
];

const categories = [
  { name: "Carving Elephants", description: "Intricate traditional patterns" },
  { name: "Jali Elephants", description: "Delicate lattice artwork" },
  { name: "Painting Elephants", description: "Vibrant Rajasthani colors" },
  { name: "Jewellery Elephants", description: "Royal luxury designs" },
  { name: "Khudai Elephants", description: "Deep-cut premium carving" },
  { name: "Shikar Elephants", description: "Traditional storytelling art" },
];

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
    <div className="min-h-screen bg-[#FDFCFB]">
      
      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-24">
            <div className="w-full lg:w-3/5">
              <div className="flex items-center gap-4 mb-8">
                <span className="h-[1px] w-12 bg-[#C5A059]"></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#C5A059]">
                  Heritage Atelier
                </span>
              </div>
              <h1 className="font-serif text-[clamp(2.5rem,8vw,5.5rem)] leading-[1.1] text-[#000000] mb-8">
                Preserving <br />
                Rajasthan&apos;s <br />
                <span className="italic text-stone-400 font-light">Wooden Artistry</span>
              </h1>
            </div>
            <div className="w-full lg:w-2/5 relative">
              <div className="bg-white border-l-4 border-[#C5A059] p-8 md:p-12 shadow-[20px_20px_60px_rgba(0,0,0,0.05)]">
                <p className="text-[#000000] text-lg md:text-xl font-light leading-relaxed mb-6">
                  Tarana Handicrafts is a Jaipur-based atelier specializing in museum-grade wooden elephant art.
                </p>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Rooted in the royal traditions of Rajasthan, we curate timeless pieces that blend cultural legacy with modern elegance.
                </p>
              </div>
              <div className="absolute -bottom-16 -right-10 text-[10rem] font-serif italic text-stone-200/40 -z-10 hidden lg:block select-none">
                1999
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="rounded-xl border border-stone-200 bg-white p-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-serif text-4xl text-[#C5A059] md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#000000]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="relative">
              <div className="absolute -inset-4 -z-10 translate-x-3 translate-y-3 border border-[#C5A059]/30" />
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-200 shadow-2xl">
                <Image src="/1.png" alt="Master artisan" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#C5A059] p-6 text-white shadow-xl">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/80">Made in</p>
                <p className="font-serif text-2xl italic">Jaipur</p>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">Our Mission</span>
                <h2 className="mb-4 font-serif text-3xl md:text-4xl text-[#000000]">
                  Crafting Cultural <span className="font-light italic text-stone-400">Legacies</span>
                </h2>
                <p className="text-lg font-light leading-relaxed text-[#000000]">
                  To preserve and promote the wooden handicraft culture of Rajasthan by manufacturing authentic handcrafted art pieces.
                </p>
              </div>
              <div className="border-t border-stone-200 pt-8 text-[#000000]">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">Our Vision</span>
                <p className="text-lg font-light leading-relaxed">
                  To make Tarana Handicrafts a globally recognized brand representing Jaipur&apos;s traditional craftsmanship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="px-4 py-24 bg-stone-50 border-y border-stone-200">
        <div className="mx-auto max-w-7xl text-[#000000]">
          <div className="mb-16 text-center">
            <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">The Archive</span>
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Product Categories</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <div key={index} className="group flex flex-col justify-between bg-white aspect-square p-10 border border-stone-200 hover:border-[#000000] transition-all duration-500">
                <span className="font-serif italic text-4xl text-stone-100 group-hover:text-[#C5A059]/20">0{index+1}</span>
                <div>
                  <h3 className="font-serif text-2xl mb-2">{category.name}</h3>
                  <p className="text-sm text-stone-500 font-light">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

 
    </div>
  );
}