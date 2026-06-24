import Link from "next/link";
import type { ReactNode } from "react";

interface LegalLayoutProps {
  title: string;
  subtitle?: string;
  updated?: string;
  children: ReactNode;
}

export function LegalLayout({ title, subtitle, updated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <section className="px-4 pb-10 pt-32">
        <div className="mx-auto max-w-3xl text-center">
          {subtitle && (
            <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
              {subtitle}
            </span>
          )}
          <h1 className="font-serif text-4xl md:text-5xl">{title}</h1>
          {updated && (
            <p className="mt-4 text-sm text-stone-500">Last updated: {updated}</p>
          )}
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-10">
          <div className="legal-content space-y-6 text-stone-600 leading-relaxed">
            {children}
          </div>

          <div className="mt-10 border-t border-stone-200 pt-6 text-sm text-stone-500">
            Questions? Reach us at{" "}
            <a href="mailto:taranahandicrafts@gmail.com" className="font-medium text-[#C5A059] hover:underline">
              taranahandicrafts@gmail.com
            </a>{" "}
            or{" "}
            <Link href="/contact" className="font-medium text-[#C5A059] hover:underline">
              contact us
            </Link>
            .
          </div>
        </div>
      </section>
    </div>
  );
}
