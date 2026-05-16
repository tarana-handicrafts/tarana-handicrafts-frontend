import React from 'react';
import { Instagram, Globe, ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#FDFCFB] pt-32 pb-12 px-6 md:px-12 border-t border-stone-200">
      <div className="max-w-7xl mx-auto">
        
        {/* --- TOP SECTION: NEWSLETTER & LINKS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 pb-24 border-b border-stone-200">
          
          {/* Newsletter Column */}
          <div className="lg:col-span-6 space-y-10">
            <h3 className="text-4xl md:text-5xl font-serif text-[#000000] leading-[1.1] tracking-tight">
              Join the Inner Circle of <br/> 
              <span className="italic text-stone-400 font-light">Global Collectors.</span>
            </h3>
            
            <div className="relative max-w-md group">
              <input 
                type="email" 
                placeholder="YOUR EMAIL ADDRESS" 
                className="w-full bg-transparent border-b border-[#000000] py-4 outline-none text-[10px] tracking-[0.3em] font-bold text-[#000000] focus:border-[#C5A059] transition-all placeholder:text-stone-400"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#000000] hover:text-[#C5A059] transition-all">
                Subscribe <ArrowUpRight size={14} className="group-hover:-mt-1 group-hover:ml-1 transition-all" />
              </button>
            </div>
            
            <p className="text-[9px] text-[#000000] uppercase tracking-widest leading-loose font-medium opacity-60">
              By subscribing, you agree to receive our curated updates <br /> and invitations to private exhibitions.
            </p>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059]">Maison</p>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]">
                <li className="hover:text-[#C5A059] transition-colors cursor-pointer">The Archive</li>
                <li className="hover:text-[#C5A059] transition-colors cursor-pointer">Artisans</li>
                <li className="hover:text-[#C5A059] transition-colors cursor-pointer">Exhibitions</li>
                <li className="hover:text-[#C5A059] transition-colors cursor-pointer">About Us</li>
              </ul>
            </div>

            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059]">Client Care</p>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]">
                <li className="hover:text-[#C5A059] transition-colors cursor-pointer">Global Export</li>
                <li className="hover:text-[#C5A059] transition-colors cursor-pointer">Bespoke Orders</li>
                <li className="hover:text-[#C5A059] transition-colors cursor-pointer">Care Guide</li>
                <li className="hover:text-[#C5A059] transition-colors cursor-pointer">Contact</li>
              </ul>
            </div>

            <div className="hidden md:block space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059]">Atelier</p>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]">
                <li className="flex items-center gap-2 leading-relaxed">
                  <MapPin size={10} className="text-[#C5A059]" /> Jaipur, India
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={10} className="text-[#C5A059]" /> studio@tarana.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={10} className="text-[#C5A059]" /> +91 900 000 0000
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: BRANDING & LEGAL --- */}
        <div className="pt-16 space-y-12">
          {/* Big Center Brand Display */}
          <div className="text-center overflow-hidden py-4">
             <h2 className="text-[12vw] font-serif text-stone-200/40 leading-none select-none tracking-tighter uppercase">
               Tarana Jaipur
             </h2>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-stone-200 pt-12">
            <div className="flex gap-10">
              <Instagram size={18} className="text-[#000000] hover:text-[#C5A059] cursor-pointer transition-all hover:scale-110" />
              <Globe size={18} className="text-[#000000] hover:text-[#C5A059] cursor-pointer transition-all hover:scale-110" />
              <div className="h-4 w-[1px] bg-stone-200" />
              <p className="text-[9px] text-[#000000] font-bold uppercase tracking-[0.3em] cursor-pointer hover:text-[#C5A059]">
                Privacy
              </p>
            </div>

            <p className="text-[9px] text-[#000000] font-bold uppercase tracking-[0.4em] text-center md:text-left">
              © 2026 Tarana Jaipur Art House. <span className="hidden md:inline">|</span> <span className="italic font-serif normal-case tracking-normal ml-2 text-stone-400">Legacy in Every Carving.</span>
            </p>

            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-3 cursor-pointer bg-transparent border-none"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#000000] group-hover:text-[#C5A059] transition-all">
                Back to top
              </p>
              <div className="h-8 w-8 rounded-full border border-[#000000] flex items-center justify-center group-hover:border-[#C5A059] group-hover:bg-[#C5A059] transition-all">
                 <ArrowUpRight size={14} className="-rotate-45 group-hover:text-white transition-all" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;