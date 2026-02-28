"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface FAQ {
  q: string;
  a: string;
}

const faqs: FAQ[] = [
  {
    q: "How do you ensure the authenticity of the wood?",
    a: "Every Tarana masterpiece is accompanied by an Authenticity Certificate. We use legally sourced Kadam and Teak wood, seasoned for over 24 months to ensure it never cracks or loses its shape in different climates.",
  },
  {
    q: "Can I track the carving process of my custom order?",
    a: "Yes. For bespoke commissions, we provide bi-weekly photo updates from the artisan's workshop in Jaipur, allowing you to witness your piece's journey from a raw block to a finished sculpture.",
  },
  {
    q: "How is the delicate Jali work protected during shipping?",
    a: "We use 'Zero-Vibration' museum packaging. The sculpture is suspended in high-density foam within a reinforced export-grade crate, specifically designed to protect delicate lattice carvings during global transit.",
  },
  {
    q: "Are these pieces suitable for outdoor display?",
    a: "While our wood is highly durable, we recommend indoor or semi-shaded placement to preserve the natural oils and intricate detailing. We provide a specialized wax-polish kit with every purchase for yearly maintenance.",
  },
];

export function ProfessionalQA() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
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

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      id="ProfessionalQA"
      className="overflow-hidden border-t border-white/5 bg-[#0A0A09] py-24 text-white"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          {/* LEFT SIDE: CRAFTSMANSHIP QUOTE */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <div
                className={`transition-all duration-700 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0"
                }`}
              >
                <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
                  Heritage Preservation
                </span>
                <h2 className="mb-8 font-serif text-4xl leading-tight tracking-tight !text-white md:text-5xl">
                  Artisan <br />
                  <span className="font-light italic text-stone-500">
                    Ethics.
                  </span>
                </h2>

                <div className="relative border-l border-[#C5A059]/20 pl-6">
                  <p className="mb-4 font-serif text-lg font-light italic leading-relaxed text-stone-400">
                    &ldquo;We do not just carve wood; we subtract everything
                    that isn&apos;t the elephant&apos;s soul.&rdquo;
                  </p>
                  <cite className="flex items-center gap-2 text-[10px] uppercase not-italic tracking-[0.2em] text-stone-600">
                    — Master Carver
                  </cite>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: ACCORDION */}
          <div className="lg:col-span-7">
            <div className="flex flex-col border-t border-white/5">
              {faqs.map((faq, index) => {
                const isOpen = activeIndex === index;
                return (
                  <div
                    key={index}
                    className={`border-b border-white/5 transition-all duration-500 ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    } ${isOpen ? "bg-[#111110]" : "hover:bg-[#0D0D0C]"}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="group flex w-full items-center justify-between px-2 py-8 text-left"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-6">
                        <span
                          className={`font-mono text-[10px] transition-colors duration-500 ${
                            isOpen ? "text-[#C5A059]" : "text-stone-700"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3
                          className={`font-serif text-xl tracking-tight transition-all duration-500 md:text-2xl ${
                            isOpen
                              ? "!text-white"
                              : "!text-stone-400 group-hover:text-stone-200"
                          }`}
                        >
                          {faq.q}
                        </h3>
                      </div>

                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                          isOpen
                            ? "border-white bg-white"
                            : "border-stone-800 bg-transparent"
                        }`}
                      >
                        {isOpen ? (
                          <svg
                            className="h-3.5 w-3.5 text-black"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-3.5 w-3.5 text-stone-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        )}
                      </div>
                    </button>

                    {/* Answer with CSS animation */}
                    <div
                      className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-10 pb-10 md:px-14">
                          <p className="max-w-xl text-base font-light italic leading-relaxed text-stone-400">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Link */}
            <div
              className={`mt-12 px-2 transition-all delay-500 duration-700 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <Link
                href="/contact"
                className="group inline-flex cursor-pointer items-center gap-3"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-600">
                  Need a custom consultation?
                </p>
                <div className="flex items-center gap-1 text-[#C5A059]">
                  <span className="border-b border-transparent text-[10px] font-bold uppercase tracking-widest transition-all group-hover:border-[#C5A059]">
                    Inquire
                  </span>
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17L17 7M17 7H7M17 7v10"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
