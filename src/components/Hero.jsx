import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Tag } from "lucide-react";

const Hero = ({ setPage }) => {
  return (
    <section className="relative min-h-screen bg-[#F9F8F6] flex items-center overflow-hidden">
      
      {/* 1. NAVBAR BUFFER AREA */}
      <div className="absolute top-0 w-full h-50 md:h-60" />

      {/* BACKGROUND DECOR - MARKETPLACE WATERMARK */}
      <div className="absolute top-40 right-10 pointer-events-none select-none hidden xl:block">
        <span className="text-[12vw] font-serif font-black text-stone-200/40 leading-none uppercase tracking-tighter">
          Shop
        </span>
      </div>

      <div className="container mx-auto px-6 lg:px-20 py-12 md:py-24 mt-10 lg:mt-0">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* LEFT: MARKET CONTENT (7 Columns) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="lg:col-span-7 relative z-20 order-2 lg:order-1"
          >
            {/* Trending Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-stone-100 mb-8"
            >
              <Tag size={12} className="text-[#C5A059]" />
              <span className="text-[#C5A059] text-[10px] uppercase tracking-[0.2em] font-black">
                New Arrivals • 2026 Edition
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-[100px] font-serif text-stone-900 leading-[0.95] tracking-tight">
              Curated <br />
              <span className="italic font-light text-stone-400">Masterpieces</span>
            </h1>

            <p className="mt-8 text-stone-500 text-base md:text-lg max-w-md leading-relaxed">
              Experience the Jaipur Marketplace. From heritage sculptures to bespoke home decor, discover hand-carved luxury direct from master artisans.
            </p>

            {/* Marketplace Action Buttons */}
            <div className="mt-12 flex flex-wrap gap-6 items-center">
              <button
                onClick={() => setPage("products")}
                className="group relative bg-stone-900 text-white px-10 py-5 text-[10px] uppercase tracking-[0.3em] font-bold overflow-hidden shadow-xl transition-transform active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Shop All Works <ShoppingCart size={14} />
                </span>
                <div className="absolute inset-0 bg-[#C5A059] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </button>

              <button className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-black text-stone-900 group">
                Bespoke Orders
                <div className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center group-hover:bg-white transition-all shadow-sm">
                   <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {/* Quick Trust Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-stone-200 max-w-md">
              <div>
                <p className="text-xl font-serif">12k+</p>
                <p className="text-[9px] uppercase tracking-widest text-stone-400">Collectors</p>
              </div>
              <div>
                <p className="text-xl font-serif">Jaipur</p>
                <p className="text-[9px] uppercase tracking-widest text-stone-400">Origin</p>
              </div>
              <div>
                <p className="text-xl font-serif">Global</p>
                <p className="text-[9px] uppercase tracking-widest text-stone-400">Shipping</p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: FEATURED PRODUCT (5 Columns) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="lg:col-span-5 relative order-1 lg:order-2"
          >
            {/* Main Product Frame */}
            <div className="relative group">
              <div className="absolute -inset-4 border border-[#C5A059]/30 translate-x-2 translate-y-2 -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
              
              <div className="aspect-[4/5] bg-white overflow-hidden shadow-2xl relative">
                <img
                  src="https://media.istockphoto.com/id/484419274/photo/carved-thai-elephant.jpg?s=612x612&w=0&k=20&c=ZMkKBd4fMAkDtnXs-m82McQatg5eU7yIyWbaKWubvo8="
                  alt="Featured Heritage Elephant"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Product Quick-Label */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 backdrop-blur-sm border-l-2 border-[#C5A059] translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-[9px] uppercase font-black tracking-widest text-[#C5A059]">Best Seller</p>
                  <div className="flex justify-between items-center">
                    <p className="font-serif text-lg italic">The Royal Ambabari</p>
                    <p className="text-stone-900 font-bold tracking-tighter">$1,250</p>
                  </div>
                </div>
              </div>

              {/* Artisan Badge */}
              <div className="absolute -top-6 -right-6 bg-[#C5A059] text-white p-4 shadow-xl hidden md:block rotate-12">
                <p className="text-[9px] uppercase font-black tracking-widest">Certified</p>
                <p className="font-serif italic">Jaipur Art</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;