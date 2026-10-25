"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/pricing";

export default function ProductGallery({ images }: { images: ProductImage[] }) {
  const [selected, setSelected] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const current = images[selected] ?? images[0];

  return (
    <div className="space-y-4">
      <button
        type="button"
        className={`group relative block aspect-square w-full overflow-hidden rounded-2xl border border-stone-200 bg-white ${
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        }`}
        onClick={() => setIsZoomed(!isZoomed)}
        aria-label={isZoomed ? "Zoom out" : "Zoom in"}
      >
        <Image
          src={current.src}
          alt={current.alt}
          fill
          className={`object-cover transition-transform duration-500 ${isZoomed ? "scale-150" : "group-hover:scale-105"}`}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </button>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={img.src}
              onClick={() => {
                setSelected(index);
                setIsZoomed(false);
              }}
              aria-label={`Show image ${index + 1}`}
              aria-current={selected === index}
              className={`relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                selected === index ? "border-[#C5A059] ring-2 ring-[#C5A059]/30" : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
