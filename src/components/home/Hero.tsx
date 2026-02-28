"use client";

import Link from "next/link";
import Image from "next/image";

export function Hero() {

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#F9F8F6]">
      <div className="pointer-events-none absolute right-10 top-40 hidden select-none xl:block">
        <span className="font-serif text-[12vw] font-black uppercase leading-none tracking-tighter text-stone-200/40">
          Shop
        </span>
      </div>

      <div className="container mx-auto mt-10 px-6 py-12 md:py-24 lg:mt-0 lg:px-20">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* LEFT: MARKET CONTENT (7 Columns) */}
          <div
            className="animate-fade-in-left relative z-20 order-2 lg:order-1 lg:col-span-7"
          >
            {/* Trending Badge */}
            <div
              className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-stone-100 bg-white px-4 py-2 shadow-sm"
              style={{ animationDelay: "200ms" }}
            >
              <svg
                className="h-3 w-3 text-[#C5A059]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A059]">
                New Arrivals • 2026 Edition
              </span>
            </div>

            <h1 className="font-serif text-5xl leading-[0.95] tracking-tight text-stone-900 md:text-7xl lg:text-[100px]">
              Curated <br />
              <span className="font-light italic text-stone-400">
                Masterpieces
              </span>
            </h1>

            <p className="mt-8 max-w-md text-base leading-relaxed text-stone-500 md:text-lg">
              Experience the Jaipur Marketplace. From heritage sculptures to
              bespoke home decor, discover hand-carved luxury direct from master
              artisans.
            </p>

            {/* Marketplace Action Buttons */}
            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Link
                href="/products"
                className="group relative overflow-hidden bg-stone-900 px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-xl transition-transform active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Shop All Works
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 -translate-x-full transform bg-[#C5A059] transition-transform duration-500 group-hover:translate-x-0" />
              </Link>

              <Link
                href="/contact"
                className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-stone-900"
              >
                Bespoke Orders
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 shadow-sm transition-all group-hover:bg-white">
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
                </div>
              </Link>
            </div>

            {/* Quick Trust Stats */}
            <div className="mt-16 grid max-w-md grid-cols-3 gap-8 border-t border-stone-200 pt-8">
              <div>
                <p className="font-serif text-xl">12k+</p>
                <p className="text-[9px] uppercase tracking-widest text-stone-400">
                  Collectors
                </p>
              </div>
              <div>
                <p className="font-serif text-xl">Jaipur</p>
                <p className="text-[9px] uppercase tracking-widest text-stone-400">
                  Origin
                </p>
              </div>
              <div>
                <p className="font-serif text-xl">Global</p>
                <p className="text-[9px] uppercase tracking-widest text-stone-400">
                  Shipping
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: FEATURED PRODUCT (5 Columns) */}
          <div
            className="animate-fade-in-scale relative order-1 lg:order-2 lg:col-span-5"
            style={{ animationDelay: "300ms" }}
          >
            {/* Main Product Frame */}
            <div className="group relative">
              {/* Decorative Border */}
              <div className="absolute -inset-4 -z-10 translate-x-2 translate-y-2 border border-[#C5A059]/30 transition-transform duration-700 group-hover:translate-x-0 group-hover:translate-y-0" />

              <div className="relative aspect-[4/5] overflow-hidden bg-white shadow-2xl">
                <Image
                  src="/2.jpg"
                  alt="Featured Heritage Elephant - Royal Ambabari Hand-carved Sculpture"
                  fill
                  className="object-cover object-bottom transition-transform duration-1000 group-hover:scale-110"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                  fetchPriority="high"
                  loading="eager"
                  quality={85}
                />

                {/* Product Quick-Label */}
                <div className="absolute bottom-6 left-6 right-6 translate-y-2 border-l-2 border-[#C5A059] bg-white/95 p-4 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#C5A059]">
                    Best Seller
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-serif text-lg italic">The Jungle Carving</p>
                    <p className="font-bold tracking-tighter text-stone-900">
                      ₹950
                    </p>
                  </div>
                </div>
              </div>

              {/* Artisan Badge */}
              <div className="absolute -right-6 -top-6 hidden rotate-12 bg-[#C5A059] p-4 text-white shadow-xl md:block">
                <p className="text-[9px] font-black uppercase tracking-widest">
                  Certified
                </p>
                <p className="font-serif italic">Jaipur Art</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
