"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig, footerLinks } from "@/lib/constants";
import { Instagram, Facebook, ArrowUpRight, MessageCircle } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  // Hide the main site footer on admin pages.
  if (pathname.startsWith("/admin")) return null;

  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) return;

    const message = `*Newsletter Subscription*\n\nEmail: ${email}\n\nI would like to join the Tarana Handicrafts newsletter for updates on new collections and exclusive offers.`;
    const whatsappUrl = `https://wa.me/919509669135?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail("");
    }, 3000);
  };

  return (
    <footer className="bg-[#FDFCFB] pt-32 pb-12 px-6 md:px-12 border-t border-stone-200">
      <div className="mx-auto max-w-7xl">
        {/* Top Section */}
        <div className="grid grid-cols-1 items-end gap-24 border-b border-stone-100 pb-24 lg:grid-cols-2">
          {/* Newsletter Section */}
          <div>
            <h3 className="mb-6 font-serif text-4xl leading-tight">
              Join the Inner Circle of <br />
              <span className="font-light italic text-stone-500">
                Collectors.
              </span>
            </h3>
            
            <form onSubmit={handleSubscribe} className="relative max-w-md group">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR EMAIL ADDRESS" 
                required
                className="w-full bg-transparent border-b border-[#000000] py-4 outline-none text-[10px] font-bold tracking-[0.3em] text-[#000000] focus:border-[#C5A059] transition-all placeholder:text-stone-400"
              />
              <button 
                type="submit"
                disabled={isSubscribed}
                className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#000000] hover:text-[#C5A059] transition-all disabled:text-green-600"
              >
                {isSubscribed ? "Joined" : "Subscribe"} 
                <ArrowUpRight size={14} className={isSubscribed ? "hidden" : "group-hover:-mt-1 group-hover:ml-1 transition-all"} />
              </button>
            </form>
            
            <p className="text-[9px] text-[#000000] uppercase tracking-widest leading-loose font-medium opacity-60">
              Updates delivered via WhatsApp and Email. <br /> Private collection previews and artisan stories.
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-12 text-[10px] font-bold uppercase tracking-[0.3em]">
            <ul className="space-y-4">
              <li className="text-stone-300">Explore</li>
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-stone-900 transition-colors hover:text-[#C5A059]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-4">
              <li className="text-stone-300">Company</li>
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-stone-900 transition-colors hover:text-[#C5A059]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-8 pt-12 md:flex-row">
          {/* Copyright */}
          <p className="text-[10px] uppercase tracking-widest text-stone-500">
            © {currentYear} {siteConfig.name}.
          </p>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-stone-100 pt-12">
            <div className="flex items-center gap-8">
              <a href={siteConfig.links.instagram} target="_blank" rel="noreferrer" className="text-[#000000] hover:text-[#C5A059] transition-all">
                <Instagram size={18} />
              </a>
              <a href={siteConfig.links.facebook} target="_blank" rel="noreferrer" className="text-[#000000] hover:text-[#C5A059] transition-all">
                <Facebook size={18} />
              </a>
              <a href="https://wa.me/919509669135" target="_blank" rel="noreferrer" className="text-[#000000] hover:text-[#25D366] transition-all">
                <MessageCircle size={18} />
              </a>
            </div>

            <p className="text-[9px] text-[#000000] font-bold uppercase tracking-[0.4em] text-center md:text-left">
              © {currentYear} {siteConfig.name}. <span className="mx-2 opacity-20">|</span> 
              <span className="italic font-serif normal-case tracking-normal text-stone-400 ml-1">
                Elegance in subtraction.
              </span>
            </p>

            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-3 cursor-pointer bg-transparent border-none outline-none"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#000000] group-hover:text-[#C5A059] transition-all">
                Back to top
              </p>
              <div className="h-8 w-8 rounded-full border border-[#000000] flex items-center justify-center group-hover:border-[#C5A059] group-hover:bg-[#C5A059] transition-all">
                 <ArrowUpRight size={14} className="-rotate-45 group-hover:text-white transition-all" />
              </div>
            </button>
          </div>

          {/* Tagline */}
          <p className="text-[10px] font-black uppercase italic tracking-[0.4em] text-stone-500">
            Elegance in subtraction.
          </p>
        </div>
      </div>
    </footer>
  );
}