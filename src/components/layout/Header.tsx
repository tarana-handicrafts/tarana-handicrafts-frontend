"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { navLinks, siteConfig } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

// Pages with dark hero sections (none currently - all pages use light backgrounds)
const darkHeroPages: string[] = [];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const pathname = usePathname();

  // Check if current page has dark hero
  const hasDarkHero = darkHeroPages.includes(pathname);

  // Memoized scroll handler
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMenuOpen) setIsMenuOpen(false);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Determine if we should use light text (for dark backgrounds)
  const useLightText = hasDarkHero && !isScrolled;

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-[100] px-6 transition-all duration-500 ${
        isScrolled
          ? "border-b border-stone-200/50 bg-white/80 py-3 backdrop-blur-md"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="group flex flex-col items-start outline-none">
          <span
            className={`font-serif text-xl font-black uppercase tracking-[0.25em] transition-colors group-hover:text-[#C5A059] md:text-2xl ${
              useLightText ? "text-white" : "text-stone-900"
            }`}
          >
            {siteConfig.name.split(" ")[0].toUpperCase()}
          </span>
          <span
            className={`text-[7px] font-bold uppercase tracking-[0.4em] transition-colors ${
              useLightText ? "text-stone-300" : "text-stone-500"
            }`}
          >
            Handicrafts
          </span>
        </Link>

        {/* CENTER NAVIGATION - Pill Style */}
        <div
          className={`hidden items-center gap-1 rounded-full border p-1 shadow-inner backdrop-blur-sm md:flex ${
            useLightText
              ? "border-white/20 bg-white/10"
              : "border-stone-200/50 bg-stone-100/50"
          }`}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                  isActive
                    ? "bg-stone-900 text-white shadow-lg"
                    : useLightText
                    ? "text-white/80 hover:bg-white/20 hover:text-white"
                    : "text-stone-600 hover:bg-stone-200/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-1 md:gap-3">
          {/* Wishlist Button */}
          <Link
            href="/wishlist"
            className={`relative hidden p-2.5 transition-colors md:block ${
              pathname === "/wishlist"
                ? "text-[#C5A059]"
                : useLightText
                ? "text-white hover:text-[#C5A059]"
                : "text-stone-700 hover:text-[#C5A059]"
            }`}
            aria-label="Wishlist"
          >
            <svg className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Get Quote CTA */}
          <Link
            href="/rfq"
            className={`hidden rounded-full border px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all md:inline-block ${
              pathname === "/rfq"
                ? "border-[#C5A059] bg-[#C5A059] text-white"
                : useLightText
                ? "border-white/40 text-white hover:border-[#C5A059] hover:bg-[#C5A059] hover:text-white"
                : "border-stone-300 text-stone-800 hover:border-[#C5A059] hover:bg-[#C5A059] hover:text-white"
            }`}
          >
            Get Quote
          </Link>

          {/* Cart Button */}
          <button
            onClick={openCart}
            aria-label="Shopping Cart"
            className="relative ml-2 rounded-full bg-stone-900 p-3 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#C5A059] active:scale-95"
          >
            <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span
              className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#C5A059] text-[9px] font-black text-black transition-transform duration-300 ${
                cartCount > 0 ? "scale-100" : "scale-0"
              }`}
            >
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            className={`ml-2 p-2.5 md:hidden ${useLightText ? "text-white" : "text-stone-900"}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {isMenuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 12h16M4 6h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <nav className="mt-4 flex flex-col rounded-2xl border border-stone-200/50 bg-white/90 p-4 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                  isActive ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-100 hover:text-[#C5A059]"
                }`}
                onClick={() => setIsMenuOpen(false)}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/blog"
            className={`rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
              pathname === "/blog" ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-100 hover:text-[#C5A059]"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/wishlist"
            className={`rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
              pathname === "/wishlist" ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-100 hover:text-[#C5A059]"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
          </Link>
          <Link
            href="/rfq"
            className="mt-2 rounded-lg bg-[#C5A059] px-4 py-3 text-center text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[#B8934E]"
            onClick={() => setIsMenuOpen(false)}
          >
            Get a Bulk Quote
          </Link>
          <a
            href="https://wa.me/919509669135"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-[#25D366] px-4 py-3 text-center text-sm font-bold uppercase tracking-wider text-[#25D366] transition-all hover:bg-[#25D366] hover:text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp Us
          </a>
        </nav>
      </div>
    </nav>
  );
}
