import React from 'react';
import { Instagram, Globe, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white pt-32 pb-12 px-6 md:px-12 border-t border-stone-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-end pb-24 border-b border-stone-100">
          <div>
            <h3 className="text-4xl font-serif mb-6 leading-tight">
              Join the Inner Circle of <br/> 
              <span className="italic text-stone-400 font-light">Collectors.</span>
            </h3>
            <div className="flex border-b border-black pb-4 group mt-12 max-w-md">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent flex-1 outline-none text-[10px] tracking-widest"
              />
              <button className="text-[10px] font-bold uppercase tracking-widest hover:text-[#C5A059] transition-colors flex items-center gap-2">
                Join <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-12 text-[10px] font-bold uppercase tracking-[0.3em]">
            <ul className="space-y-4">
              <li className="text-stone-300">Explore</li>
              <li className="hover:text-[#C5A059] cursor-pointer">The Archive</li>
              <li className="hover:text-[#C5A059] cursor-pointer">Master Artisans</li>
            </ul>
            <ul className="space-y-4">
              <li className="text-stone-300">Client Service</li>
              <li className="hover:text-[#C5A059] cursor-pointer">Global Export</li>
              <li className="hover:text-[#C5A059] cursor-pointer">Care Guide</li>
            </ul>
          </div>
        </div>

        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest">
            © 2026 Tarana Jaipur Art House.
          </p>
          <div className="flex gap-8">
            <Instagram size={18} className="text-stone-300 hover:text-black cursor-pointer transition-all" />
            <Globe size={18} className="text-stone-300 hover:text-black cursor-pointer transition-all" />
          </div>
          <p className="text-[10px] text-stone-400 uppercase tracking-[0.4em] font-black italic">
            Elegance in subtraction.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;