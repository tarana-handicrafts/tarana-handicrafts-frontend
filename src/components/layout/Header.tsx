"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { navLinks, siteConfig } from "@/lib/constants";
import { useCart } from "@/context/CartContext";

// Pages with dark hero sections (none currently - all pages use light backgrounds)
const darkHeroPages: string[] = [];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, openCart } = useCart();
  const pathname = usePathname();

  // Check if current page has dark hero
  const hasDarkHero = darkHeroPages.includes(pathname);

  // Memoized scroll handler
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
          {/* Search Button */}
          <button
            aria-label="Search"
            className={`hidden p-2.5 transition-colors hover:text-[#C5A059] sm:block ${
              useLightText ? "text-white" : "text-stone-700"
            }`}
          >
            <svg
              className="h-[19px] w-[19px]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>

          {/* User/Account Button */}
          <Link
            href="/account"
            className={`hidden p-2.5 transition-colors md:block ${
              pathname === "/account"
                ? "text-[#C5A059]"
                : useLightText
                ? "text-white hover:text-[#C5A059]"
                : "text-stone-700 hover:text-[#C5A059]"
            }`}
            aria-label="Account"
          >
            <svg
              className="h-[19px] w-[19px]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          {/* Cart Button */}
          <button
            onClick={openCart}
            aria-label="Shopping Cart"
            className="relative ml-2 rounded-full bg-stone-900 p-3 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#C5A059] active:scale-95"
          >
            <svg
              className="h-[18px] w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {/* Cart Count Badge */}
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
            className={`ml-2 p-2.5 md:hidden ${
              useLightText ? "text-white" : "text-stone-900"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="h-[22px] w-[22px]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 12h16M4 6h16M4 18h16" />
              )}
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
                  isActive
                    ? "bg-stone-900 text-white"
                    : "text-stone-700 hover:bg-stone-100 hover:text-[#C5A059]"
                }`}
                onClick={() => setIsMenuOpen(false)}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </nav>
  );
}
