import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#F9F8F6] px-4">
      <div className="text-center">
        <h1 className="mb-2 font-serif text-8xl font-bold text-[#C5A059]">
          404
        </h1>
        <h2 className="mb-4 text-2xl font-semibold text-stone-900">
          Page Not Found
        </h2>
        <p className="mb-6 max-w-md text-stone-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="bg-stone-900 px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-[#C5A059] hover:shadow-xl"
        >
          Go Home
        </Link>
        <Link
          href="/products"
          className="border border-stone-300 px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900 transition-all hover:border-[#C5A059] hover:text-[#C5A059]"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
