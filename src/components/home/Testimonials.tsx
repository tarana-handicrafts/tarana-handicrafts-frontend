"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Promise {
  quote: string;
  author: string;
  role: string;
  icon: "sparkles" | "heart" | "shield";
}

// Honest, verifiable brand promises — NOT fabricated customer reviews.
const promises: Promise[] = [
  {
    quote:
      "Every elephant is hand-chiseled from a single block of seasoned Kadam wood — no two pieces are ever identical.",
    author: "Single-Block Carving",
    role: "Authentic Craft",
    icon: "sparkles",
  },
  {
    quote:
      "Museum-grade, multi-layer packaging protects delicate Jali work in transit, with worldwide export shipping.",
    author: "Safe Global Delivery",
    role: "Export Ready",
    icon: "heart",
  },
  {
    quote:
      "You buy direct from the workshop in Jaipur — fair pricing for buyers and fair wages for the artisans who carve.",
    author: "Manufacturer Direct",
    role: "No Middlemen",
    icon: "shield",
  },
];

// Icon components
const IconSparkles = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const IconHeart = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const IconShield = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconQuote = () => (
  <svg className="h-12 w-12 text-amber-200/60" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

const getIcon = (type: Promise["icon"]) => {
  switch (type) {
    case "sparkles":
      return <IconSparkles />;
    case "heart":
      return <IconHeart />;
    case "shield":
      return <IconShield />;
  }
};

export function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-[#FCFBF8] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* LEFT: IMAGE COMPOSITION */}
          <div className="relative">
            {/* Organic Background Blob */}
            <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-amber-100/40 blur-3xl" />

            {/* Main Image Container with Animated Blob Shape */}
            <div
              className={`relative z-10 aspect-square overflow-hidden border-8 border-white bg-stone-200 shadow-2xl transition-all duration-1000 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{
                borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                animation: "morphBlob 8s ease-in-out infinite",
              }}
            >
              <Image
                src="/1.png"
                alt="Hand-carved wooden elephant by Tarana Handicrafts artisans in Jaipur"
                fill
                className="scale-110 object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-stone-900/5 mix-blend-multiply" />
            </div>

            {/* Floating Trust Badge */}
            <div
              className={`absolute -right-4 bottom-10 z-20 flex items-center gap-4 rounded-2xl border border-stone-50 bg-white p-5 shadow-2xl transition-all delay-500 duration-700 ${
                isVisible ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900">100% Handmade</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                  Carved in Jaipur
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="flex flex-col space-y-8">
            <IconQuote />

            <h2
              className={`font-serif text-4xl font-light italic leading-tight text-stone-900 transition-all duration-700 md:text-5xl ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
            >
              &ldquo;A piece of Jaipur{" "}
              <span className="text-stone-500">heritage.</span>&rdquo;
            </h2>

            <p
              className={`text-lg font-light leading-relaxed text-stone-600 transition-all delay-100 duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
            >
              At Tarana, we don&apos;t just sell wood carvings; we share a
              centuries-old story of Rajasthan&apos;s finest craftsmanship. Each
              piece is hand-chiseled from a single block of wood, ensuring that
              no two masterpieces are ever the same. Experience the weight of
              history in your hands.
            </p>

            <div className="border-t border-stone-100 pt-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-stone-900">
                Amit Kumawat
              </h4>
              <p className="text-xs uppercase tracking-wide text-stone-500">
                Founder, Tarana Handicrafts
              </p>
            </div>

            <div>
              <Link
                href="/products"
                className="inline-block bg-stone-900 px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-50 transition-all hover:bg-amber-800 hover:shadow-xl active:scale-95"
              >
                Explore the Archive
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM PROMISES GRID */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          {promises.map((promise, index) => (
            <div
              key={index}
              className={`group flex flex-col justify-between border border-stone-100 bg-white p-10 transition-all duration-700 hover:border-amber-200/50 hover:shadow-xl ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              <div>
                <div className="mb-8 flex items-start">
                  {/* Icon */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700 transition-colors group-hover:bg-amber-100">
                    {getIcon(promise.icon)}
                  </div>
                </div>

                <p className="mb-8 font-serif text-lg font-light italic leading-relaxed text-stone-600">
                  &ldquo;{promise.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-stone-50 pt-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-900">
                    {promise.author}
                  </p>
                  <p className="text-[10px] uppercase tracking-wide text-stone-500">
                    {promise.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animation for Blob Morph */}
      <style jsx>{`
        @keyframes morphBlob {
          0%,
          100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          50% {
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 70%;
          }
        }
      `}</style>
    </section>
  );
}
