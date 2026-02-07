import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1920&q=80"
          alt="Handcrafted Art Background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl">
        <span className="mb-4 inline-block rounded-full bg-[var(--color-primary)]/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
          ✨ Handcrafted with Love
        </span>

        <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Discover the Art of{" "}
          <span className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent">
            Traditional Craftsmanship
          </span>
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90 sm:text-xl">
          Each piece tells a story of tradition, passion, and timeless beauty.
          Explore our curated collection of exquisite handmade art and home
          decor crafted by skilled artisans.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/products"
            className="group relative overflow-hidden rounded-lg bg-[var(--color-primary)] px-8 py-4 text-lg font-medium text-white transition-all hover:shadow-xl"
          >
            <span className="relative z-10">Explore Collection</span>
            <div className="absolute inset-0 -z-0 bg-[var(--color-primary-dark)] opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
          <Link
            href="/about"
            className="rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-medium text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/20"
          >
            Our Story
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="h-8 w-8 text-white/70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
