import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, ShoppingCart, Eye, Star } from 'lucide-react';


const ProductsPage = ({ addToCart , products }) => {
  const [filter, setFilter] = useState('All');
  const [hoveredId, setHoveredId] = useState(null);

  const categories = ['All', 'Sculpture', 'Wall Art', 'Decor', 'Furniture'];
  const filteredProducts = filter === 'All' ? products : products.filter(p => p.category === filter);

  return (
    <div className="pt-32 pb-20 bg-[#FDFCFB]">
      {/* Header Section */}
      <div className="container mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-stone-200 pb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-serif text-stone-900 mb-4"
            >
              The <span className="italic text-stone-400">Archive</span>
            </motion.h1>
            <p className="text-stone-500 max-w-md font-light leading-relaxed">
              Explore our curated selection of handcrafted Jaipur woodcraft. 
              Each piece is authenticated and shipped globally.
            </p>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all
                  ${filter === cat ? 'bg-stone-900 text-white shadow-lg' : 'bg-white text-stone-500 border border-stone-100 hover:border-stone-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                  {product.tag && (
                    <span className="absolute top-4 left-4 z-20 bg-white px-3 py-1 text-[8px] uppercase font-black tracking-widest shadow-sm">
                      {product.tag}
                    </span>
                  )}
                  
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Hover Overlay Actions */}
                  <div className={`absolute inset-0 bg-stone-900/20 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center gap-4 ${hoveredId === product.id ? 'opacity-100' : 'opacity-0'}`}>
                    <button 
                      onClick={() => addToCart(product)}
                      className="p-4 bg-white rounded-full hover:bg-stone-900 hover:text-white transition-all transform hover:scale-110"
                    >
                      <ShoppingCart size={20} />
                    </button>
                    <button className="p-4 bg-white rounded-full hover:bg-stone-900 hover:text-white transition-all transform hover:scale-110">
                      <Eye size={20} />
                    </button>
                  </div>
                </div>

                {/* Info Section */}
                <div className="space-y-2 px-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-serif text-stone-900">{product.name}</h3>
                    <p className="font-bold text-stone-900 tracking-tighter">${product.price}</p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                    <span>{product.material}</span>
                    <div className="flex items-center gap-1">
                      <Star size={10} className="fill-[#C5A059] text-[#C5A059]" />
                      <span className="text-stone-600">4.9</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;