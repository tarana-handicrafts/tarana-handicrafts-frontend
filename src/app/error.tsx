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
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      console.error("Application error:", error.digest);
    } else {
      console.error("Application error:", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4" role="alert" aria-live="assertive">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 text-6xl" aria-hidden="true">⚠️</div>
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Something went wrong</h1>
        <p className="mb-6 text-gray-600">
          We apologize for the inconvenience. An unexpected error has occurred.
          Please try again or contact support if the problem persists.
        </p>
        {error.digest && (
          <p className="mb-4 text-xs text-gray-400">
            Error ID: {error.digest}
          </p>
        )}
        <div className="space-x-4">
          <button
            onClick={reset}
            className="rounded-lg bg-amber-600 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            aria-label="Try again"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-block rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
