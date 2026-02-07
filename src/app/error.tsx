"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    // In production, send to error tracking service like Sentry
    console.error("Application error:", error.digest || "Unknown error");
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#F9F8F6] px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-10 w-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="mb-2 font-serif text-4xl text-stone-900">
          Oops!
        </h1>
        <h2 className="mb-4 text-xl font-semibold text-stone-700">
          Something went wrong
        </h2>
        <p className="mb-6 max-w-md text-stone-500">
          We apologize for the inconvenience. Please try again or return to the homepage.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={reset}
          className="bg-stone-900 px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-[#C5A059] hover:shadow-xl"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border border-stone-300 px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900 transition-all hover:border-[#C5A059] hover:text-[#C5A059]"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
