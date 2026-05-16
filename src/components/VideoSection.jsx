import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const VideoSection = () => {
  return (
    <section className="py-24 bg-[#F9F8F6] px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative group cursor-pointer overflow-hidden rounded-sm aspect-video"
          >
            <img 
              src="https://images.unsplash.com/photo-1544207240-8b1025eb7aeb?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-1000"
              alt="Artisan at work"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-20 h-20 border border-white/50 rounded-full flex items-center justify-center backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all">
                <Play fill="currentColor" size={24} className="ml-1" />
              </div>
            </div>
          </motion.div>

          <div className="space-y-8">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] font-bold">The Process</span>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight text-stone-900">
              Hand-Carved With <br />
              <span className="italic text-stone-400">Sacred Patience</span>
            </h2>
            <p className="text-stone-600 text-lg font-light leading-relaxed">
              Every Tarana sculpture is a masterpiece of subtraction. Starting from a single block of premium Kadam wood, our Jaipur artisans spend weeks revealing the spirit within.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-stone-200">
              <div>
                <p className="text-2xl font-serif">100%</p>
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Authentic Wood</p>
              </div>
              <div>
                <p className="text-2xl font-serif">24+ Mo.</p>
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Natural Seasoning</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;