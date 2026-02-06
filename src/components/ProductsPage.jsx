import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Eye, Star, Check, X, ShieldCheck, Truck, Globe } from 'lucide-react';

const ProductsPage = ({ addToCart, products = [], cart = [] }) => {
  const [filter, setFilter] = useState('All');
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = ['All', 'Sculpture', 'Wall Art', 'Decor', 'Furniture'];
  
  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  const isSelected = (productId) => cart.some(item => item.id === productId);

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
            {filteredProducts.map((product) => {
              const selected = isSelected(product.id);
              
              return (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group cursor-pointer relative"
                >
                  <div className={`relative aspect-[3/4] overflow-hidden mb-6 transition-all duration-500 shadow-sm 
                    ${selected ? 'ring-2 ring-[#C5A059] ring-offset-4 shadow-xl' : 'bg-stone-100 group-hover:shadow-2xl'}`}>
                    
                    <AnimatePresence>
                      {selected && (
                        <motion.div 
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="absolute top-4 right-4 z-30 bg-[#C5A059] text-white p-2 rounded-full shadow-lg"
                        >
                          <Check size={14} strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {product.tag && (
                      <span className="absolute top-4 left-4 z-20 bg-white px-3 py-1 text-[8px] uppercase font-black tracking-widest shadow-sm">
                        {product.tag}
                      </span>
                    )}
                    
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${selected ? 'scale-105' : ''}`}
                    />

                    <div className={`absolute inset-0 bg-stone-900/20 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center gap-4 ${hoveredId === product.id ? 'opacity-100' : 'opacity-0'}`}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        className={`p-4 rounded-full transition-all transform hover:scale-110 flex items-center gap-2
                          ${selected ? 'bg-[#C5A059] text-white' : 'bg-white text-stone-900 hover:bg-stone-900 hover:text-white'}`}
                      >
                        {selected ? <Check size={20} /> : <ShoppingCart size={20} />}
                      </button>
                      
                      {/* EYE ICON: Opens Modal */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                        className="p-4 bg-white rounded-full hover:bg-stone-900 hover:text-white transition-all transform hover:scale-110"
                      >
                        <Eye size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 px-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-lg font-serif transition-colors ${selected ? 'text-[#C5A059]' : 'text-stone-900'}`}>
                        {product.name}
                      </h3>
                      <p className="font-bold text-stone-900 tracking-tighter">${product.price}</p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                      <span>{product.material}</span>
                      {selected && <span className="text-[#C5A059] animate-pulse">Selected</span>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-stone-900/90 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[70vh]"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 z-50 p-2 bg-stone-100 rounded-full hover:bg-[#C5A059] hover:text-white transition-all"
              >
                <X size={20} />
              </button>

              {/* Modal Image */}
              <div className="w-full md:w-1/2 bg-stone-100 relative">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6">
                   <span className="bg-white px-4 py-2 text-[10px] uppercase font-black tracking-widest shadow-xl">
                      Masterpiece ID: #00{selectedProduct.id}
                   </span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-8">
                  <div className="flex items-center gap-2 text-[#C5A059] mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    <span className="text-stone-400 text-xs font-bold uppercase tracking-widest ml-2">Legacy Grade</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-2">{selectedProduct.name}</h2>
                  <p className="text-2xl font-light text-[#C5A059]">${selectedProduct.price}</p>
                </div>

                <div className="space-y-6 mb-10">
                  <p className="text-stone-500 leading-relaxed font-light">
                    Hand-carved in the heart of Jaipur, this {selectedProduct.material} piece represents centuries of Rajasthani heritage. Each curve is meticulously detailed by master artisans, ensuring that no two pieces are identical.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-stone-100">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="text-stone-400" size={20} />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-stone-600">Authentic Wood</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="text-stone-400" size={20} />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-stone-600">Global Shipping</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full bg-stone-900 text-white py-5 flex items-center justify-center gap-4 hover:bg-[#C5A059] transition-all group"
                >
                  <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] uppercase font-black tracking-[0.2em]">
                    {isSelected(selectedProduct.id) ? "Add Another to Collection" : "Inquire & Purchase"}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;