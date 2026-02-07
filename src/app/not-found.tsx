import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <h1 className="mb-2 text-8xl font-bold text-[var(--color-primary)]">
          404
        </h1>
        <h2 className="mb-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mb-6 max-w-md text-[var(--color-muted)]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="rounded-lg bg-[var(--color-primary)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)]"
        >
          Go Home
        </Link>
        <Link
          href="/products"
          className="rounded-lg border border-[var(--color-border)] px-6 py-3 font-medium transition-colors hover:bg-[var(--color-border)]"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
