import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ setPage, activePage, openCart, cartCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Define your navigation map here
  const navItems = [
    { label: 'Home', target: 'home' },
    { label: 'Collections', target: 'products' },
    { label: 'Bespoke', target: 'bespoke' },
  ];

  return (
    <nav 
      className={`fixed w-full top-0 z-[100] transition-all duration-500 px-6 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md border-b border-stone-200/50 py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <button 
          onClick={() => setPage('home')} 
          className="group flex flex-col items-start outline-none"
        >
          <span className="text-xl md:text-2xl font-serif tracking-[0.25em] font-black uppercase group-hover:text-[#C5A059] transition-colors">
            TARANA
          </span>
          <span className="text-[7px] tracking-[0.4em] uppercase text-stone-500 font-bold">
            Jaipur Art House
          </span>
        </button>

        {/* CENTER NAVIGATION */}
        <div className="hidden md:flex items-center gap-1 bg-stone-100/50 backdrop-blur-sm border border-stone-200/50 p-1 rounded-full shadow-inner">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setPage(item.target)}
              className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300
                ${activePage === item.target 
                  ? 'bg-stone-900 text-white shadow-lg' 
                  : 'hover:bg-stone-200/50 text-stone-600'}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-1 md:gap-3">
          <button className="p-2.5 text-stone-700 hover:text-[#C5A059] transition-colors hidden sm:block">
            <Search size={19} strokeWidth={2} />
          </button>

          <button 
            onClick={() => setPage('account')}
            className={`p-2.5 transition-colors hidden md:block ${activePage === 'account' ? 'text-[#C5A059]' : 'text-stone-700 hover:text-[#C5A059]'}`}
          >
            <User size={19} strokeWidth={2} />
          </button>

          <button 
            onClick={openCart}
            className="relative ml-2 p-3 bg-stone-900 text-white rounded-full shadow-xl hover:bg-[#C5A059] hover:scale-105 transition-all duration-300 active:scale-95"
          >
            <ShoppingBag size={18} strokeWidth={2} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-[#C5A059] text-black text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button className="p-2.5 text-stone-900 md:hidden ml-2">
            <Menu size={22} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;