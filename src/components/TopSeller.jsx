import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Star } from 'lucide-react';

const TopSeller = ({ products, setPage }) => {
  // We take the first 3 best-selling items
  const topProducts = products.filter(p => p.tag === "Best Seller" || p.price > 1000).slice(0, 3);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-20">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#C5A059]"></span>
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] font-black">
                Most Coveted
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif text-stone-900 leading-tight">
              Our <span className="italic text-stone-400">Top Sellers</span>
            </h2>
          </div>
          
          <button 
            onClick={() => setPage('products')}
            className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-stone-900 hover:text-[#C5A059] transition-colors"
          >
            View Entire Gallery <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Top Sellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {topProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              {/* Rank Indicator */}
              <div className="absolute -top-6 -left-4 z-10">
                <span className="text-8xl font-serif text-stone-100 font-black leading-none select-none group-hover:text-[#C5A059]/10 transition-colors">
                  0{index + 1}
                </span>
              </div>

              {/* Product Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-50 mb-8">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-all duration-500" />
                
                {/* Quick Action Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-stone-900/80 to-transparent">
                  <button className="w-full bg-white text-stone-900 py-4 text-[10px] uppercase tracking-widest font-black hover:bg-[#C5A059] hover:text-white transition-colors">
                    Quick Purchase
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="relative z-20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-[#C5A059]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                    (48 Reviews)
                  </span>
                </div>
                
                <h3 className="text-2xl font-serif text-stone-900 mb-2 group-hover:text-[#C5A059] transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex justify-between items-center">
                  <p className="text-stone-500 text-sm font-light italic">{product.material}</p>
                  <p className="text-xl font-serif text-stone-900">${product.price}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSeller;