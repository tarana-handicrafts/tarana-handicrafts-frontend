import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon",
  description: "This page is under development. Check back soon for updates!",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#F9F8F6] px-4 pt-20">
      <div className="text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#C5A059]/10">
          <svg
            className="h-12 w-12 text-[#C5A059]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        </div>

        <span className="mb-4 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
          Under Development
        </span>

        <h1 className="mb-4 font-serif text-4xl md:text-5xl">
          Coming{" "}
          <span className="font-light italic text-stone-400">Soon</span>
        </h1>

        <p className="mx-auto mb-8 max-w-md text-lg text-stone-500">
          We&apos;re working hard to bring you something amazing.
          This page will be available soon!
        </p>

        {/* Progress indicator */}
        <div className="mx-auto mb-8 max-w-xs">
          <div className="h-2 overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#C5A059] to-[#D4B66A]"
              style={{ animation: "pulse 2s infinite" }}
            />
          </div>
          <p className="mt-2 text-xs text-stone-400">Development in progress...</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="rounded-lg bg-stone-900 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-[#C5A059] hover:shadow-xl"
        >
          Go to Homepage
        </Link>
        <Link
          href="/products"
          className="rounded-lg border border-stone-300 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900 transition-all hover:border-[#C5A059] hover:text-[#C5A059]"
        >
          Browse Products
        </Link>
      </div>

      {/* Contact suggestion */}
      <div className="mt-8 text-center">
        <p className="text-sm text-stone-500">
          Have questions?{" "}
          <Link href="/contact" className="font-medium text-[#C5A059] hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}

