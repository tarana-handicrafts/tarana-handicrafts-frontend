"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Review {
  quote: string;
  author: string;
  role: string;
  icon: "sparkles" | "heart" | "shield";
}

const reviews: Review[] = [
  {
    quote:
      "The Ambabari elephant isn't just a statue; it's the soul of my living room. The detail in the Kadam wood is simply breathtaking.",
    author: "Arjun Mehta",
    role: "Art Collector",
    icon: "sparkles",
  },
  {
    quote:
      "Shipping to London was seamless. The museum-grade packaging ensured the delicate Jali work arrived in pristine condition.",
    author: "Elena Wright",
    role: "Interior Designer",
    icon: "heart",
  },
  {
    quote:
      "You can feel the artisan's touch in every curve. Tarana is preserving a lineage of craft that is becoming rare in the modern world.",
    author: "Rajiv Sharma",
    role: "Heritage Advocate",
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

const IconStar = ({ filled = true }: { filled?: boolean }) => (
  <svg className="h-2.5 w-2.5" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const getIcon = (type: Review["icon"]) => {
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
                src="https://images.unsplash.com/photo-1581850518616-bcb8186bc443?q=80&w=2000&auto=format&fit=crop"
                alt="Artisan Craftsmanship - Hand carving traditional wood sculpture"
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
              <div className="flex -space-x-3">
                {[13, 14, 15].map((i) => (
                  <div
                    key={i}
                    className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-stone-200"
                  >
                    <Image
                      src={`https://i.pravatar.cc/100?img=${i}`}
                      alt="Satisfied client"
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                ))}
              </div>
              <div>
                <div className="mb-1 flex gap-0.5 text-amber-600">
                  {[...Array(5)].map((_, i) => (
                    <IconStar key={i} />
                  ))}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  Trusted Globally
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
              <span className="text-stone-400">heritage.</span>&rdquo;
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
                Sarah Jenkins
              </h4>
              <p className="text-xs uppercase tracking-wide text-stone-400">
                Heritage Art Collector
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

        {/* BOTTOM REVIEWS GRID */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          {reviews.map((review, index) => (
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
                <div className="mb-8 flex items-start justify-between">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-stone-50 transition-colors group-hover:border-amber-100">
                      <Image
                        src={`https://i.pravatar.cc/150?u=${review.author}`}
                        alt={review.author}
                        fill
                        className="object-cover"
                        sizes="56px"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1 text-amber-700 shadow-sm">
                      {getIcon(review.icon)}
                    </div>
                  </div>

                  <div className="flex gap-0.5 text-amber-500/40">
                    {[...Array(5)].map((_, star) => (
                      <IconStar key={star} />
                    ))}
                  </div>
                </div>

                <p className="mb-8 font-serif text-lg font-light italic leading-relaxed text-stone-600">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-stone-50 pt-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-900">
                    {review.author}
                  </p>
                  <p className="text-[10px] uppercase tracking-wide text-stone-400">
                    {review.role}
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
