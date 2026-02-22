import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  ShoppingCart, 
  Eye, 
  Star, 
  Check, 
  X, 
  ShieldCheck, 
  Globe, 
  ArrowRight,
  Info
} from 'lucide-react';

const ProductsPage = ({ addToCart, products = [], cart = [] }) => {
  const [filter, setFilter] = useState('All');
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = ['All', 'Sculpture', 'Wall Art', 'Decor', 'Furniture'];
  
  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  const isSelected = (productId) => cart.some(item => item.id === productId);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedProduct]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-sans selection:bg-[#C5A059] selection:text-white">
      
      {/* --- HERO / HEADER SECTION --- */}
      <section className="pt-32 pb-16 md:pt-48 md:pb-24 border-b border-stone-200/60">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="max-w-3xl">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold mb-4 block"
              >
                Rajasthan's Finest Woodcraft
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl lg:text-9xl font-serif leading-[0.9] text-stone-900 mb-8"
              >
                The <span className="italic text-stone-400">Archive</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-stone-500 text-lg md:text-xl font-light leading-relaxed max-w-xl"
              >
                A curated collection of hand-carved masterpieces from Jaipur, where 
                centuries of tradition meet contemporary elegance.
              </motion.p>
            </div>

            {/* Category Filter */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 md:gap-3"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all duration-300
                    ${filter === cat 
                      ? 'bg-stone-900 text-white shadow-xl translate-y-[-2px]' 
                      : 'bg-transparent text-stone-400 border border-stone-200 hover:border-stone-900 hover:text-stone-900'}`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- PRODUCTS GRID --- */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <LayoutGroup>
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20"
            >
              <AnimatePresence mode='popLayout'>
                {filteredProducts.map((product) => {
                  const selected = isSelected(product.id);
                  
                  return (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onMouseEnter={() => setHoveredId(product.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className="group"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 mb-6">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className={`w-full h-full object-cover transition-transform duration-[1.5s] ease-out 
                            ${hoveredId === product.id ? 'scale-110' : 'scale-100'}`}
                        />
                        
                        {/* Status Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                          {product.tag && (
                            <span className="bg-white/90 backdrop-blur-md px-3 py-1 text-[8px] uppercase font-black tracking-widest text-stone-900">
                              {product.tag}
                            </span>
                          )}
                          {selected && (
                            <span className="bg-[#C5A059] px-3 py-1 text-[8px] uppercase font-black tracking-widest text-white flex items-center gap-1">
                              <Check size={10} strokeWidth={4} /> In Gallery
                            </span>
                          )}
                        </div>

                        {/* Hover Overlay */}
                        <div className={`absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] transition-all duration-500 flex flex-col items-center justify-center gap-4
                          ${hoveredId === product.id ? 'opacity-100' : 'opacity-0'}`}>
                          
                          <button 
                            onClick={() => addToCart(product)}
                            className="w-40 py-3 bg-white text-stone-900 text-[10px] uppercase font-bold tracking-widest hover:bg-[#C5A059] hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
                          >
                            {selected ? <Check size={14} /> : <ShoppingCart size={14} />}
                            {selected ? 'Added' : 'Add to Cart'}
                          </button>

                          <button 
                            onClick={() => setSelectedProduct(product)}
                            className="w-40 py-3 bg-transparent border border-white text-white text-[10px] uppercase font-bold tracking-widest hover:bg-white hover:text-stone-900 transition-colors duration-300 flex items-center justify-center gap-2"
                          >
                            <Eye size={14} /> Quick View
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold mb-1">{product.category}</p>
                            <h3 className="text-xl font-serif text-stone-900 group-hover:text-[#C5A059] transition-colors duration-300">
                              {product.name}
                            </h3>
                          </div>
                          <p className="text-lg font-light text-stone-900">${product.price}</p>
                        </div>
                        <div className="h-[1px] w-full bg-stone-100 group-hover:bg-stone-200 transition-colors" />
                        <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                          <span>{product.material}</span>
                          <span className="group-hover:text-stone-900 transition-colors flex items-center gap-1">
                            Details <ArrowRight size={10} />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </div>
      </section>

      {/* --- QUICK VIEW MODAL --- */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="relative w-full max-w-6xl bg-white shadow-2xl overflow-hidden flex flex-col lg:flex-row h-full max-h-[90vh] lg:max-h-[700px]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 z-50 p-3 bg-white/90 backdrop-blur hover:bg-stone-900 hover:text-white transition-all rounded-full border border-stone-100"
              >
                <X size={20} />
              </button>

              {/* Modal Left: Image */}
              <div className="w-full lg:w-1/2 bg-stone-100 relative overflow-hidden h-64 lg:h-auto">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-8 left-8">
                   <div className="bg-white/90 backdrop-blur-md px-5 py-3 shadow-2xl border-l-4 border-[#C5A059]">
                      <p className="text-[9px] uppercase font-black tracking-[0.2em] text-stone-400 mb-1">Authenticity Guaranteed</p>
                      <p className="text-xs font-serif italic text-stone-900">Certificate No: JP-{selectedProduct.id}2026</p>
                   </div>
                </div>
              </div>

              {/* Modal Right: Details */}
              <div className="w-full lg:w-1/2 p-8 md:p-14 flex flex-col overflow-y-auto">
                <div className="mb-auto">
                  <div className="flex items-center gap-1 text-[#C5A059] mb-6">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                    <span className="text-stone-400 text-[9px] uppercase font-black tracking-widest ml-3">Curator's Choice</span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4 leading-tight">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-3xl font-light text-[#C5A059] mb-8">${selectedProduct.price}</p>

                  <div className="space-y-6 text-stone-500 font-light leading-relaxed text-base">
                    <p>
                      Sourced from sustainable forests and hand-carved in the heart of Jaipur, 
                      this {selectedProduct.material} piece represents centuries of Rajasthani heritage. 
                      The intricate grain patterns ensure that your acquisition is truly one-of-a-kind.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-8 py-8 border-y border-stone-100">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="text-[#C5A059] shrink-0" size={18} />
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-stone-900 mb-1">Museum Grade</p>
                          <p className="text-[10px] leading-tight text-stone-400">Treated for longevity and climate resistance.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="text-[#C5A059] shrink-0" size={18} />
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-stone-900 mb-1">Global Shipping</p>
                          <p className="text-[10px] leading-tight text-stone-400">Insured white-glove delivery worldwide.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-[2] bg-stone-900 text-white py-5 flex items-center justify-center gap-4 hover:bg-[#C5A059] transition-all group"
                  >
                    <ShoppingCart size={18} />
                    <span className="text-[10px] uppercase font-black tracking-[0.2em]">
                      {isSelected(selectedProduct.id) ? "Add Another to Collection" : "Inquire & Purchase"}
                    </span>
                  </button>
                  <button className="flex-1 bg-stone-100 text-stone-900 py-5 flex items-center justify-center hover:bg-stone-200 transition-all">
                    <Info size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;