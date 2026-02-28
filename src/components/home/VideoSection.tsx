"use client";

import { useState } from "react";
import Image from "next/image";

export function VideoSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="bg-[#F9F8F6] py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Video Thumbnail */}
          <div
            className="group relative aspect-video cursor-pointer overflow-hidden rounded-sm"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src="https://images.unsplash.com/photo-1544207240-8b1025eb7aeb?auto=format&fit=crop&q=80&w=1200"
              alt="Artisan at work - Traditional wood carving craftsmanship"
              fill
              className={`object-cover transition-all duration-1000 ${
                isHovered ? "grayscale-0 scale-105" : "grayscale"
              }`}
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              {/* Play Button */}
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full border border-white/50 backdrop-blur-md transition-all duration-300 ${
                  isHovered ? "bg-white text-black" : "text-white"
                }`}
              >
                <svg
                  className="ml-1 h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
              The Process
            </span>
            <h2 className="font-serif text-4xl leading-tight text-stone-900 md:text-5xl">
              Hand-Carved With <br />
              <span className="italic text-stone-500">Sacred Patience</span>
            </h2>
            <p className="text-lg font-light leading-relaxed text-stone-600">
              Every Tarana sculpture is a masterpiece of subtraction. Starting
              from a single block of premium Kadam wood, our Jaipur artisans
              spend weeks revealing the spirit within.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 border-t border-stone-200 pt-6">
              <div>
                <p className="font-serif text-2xl">100%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                  Authentic Wood
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl">24+ Mo.</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                  Natural Seasoning
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
