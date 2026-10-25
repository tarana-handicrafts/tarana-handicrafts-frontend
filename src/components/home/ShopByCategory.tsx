import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/pricing";

export function ShopByCategory({ categories }: { categories: (Category & { count: number })[] }) {
  const shown = categories.filter((c) => c.count > 0);
  if (shown.length === 0) return null;
  return (
    <section className="bg-white px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">Explore</span>
          <h2 className="font-serif text-3xl sm:text-4xl">Shop by Collection</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100">
              {c.image && (
                <Image src={c.image} alt={c.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="font-serif text-2xl">{c.name}</h3>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">
                  {c.count} piece{c.count === 1 ? "" : "s"} →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
