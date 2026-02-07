"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-bold text-[var(--color-primary)]">
          Oops!
        </h1>
        <h2 className="mb-4 text-2xl font-semibold">Something went wrong</h2>
        <p className="mb-6 text-[var(--color-muted)]">
          We apologize for the inconvenience. Please try again.
        </p>
      </div>
      <button
        onClick={reset}
        className="rounded-lg bg-[var(--color-primary)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)]"
      >
        Try Again
      </button>
    </div>
  );
}
