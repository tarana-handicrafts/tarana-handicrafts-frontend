import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, MessageCircle, ShoppingBag } from 'lucide-react';

const CartSidebar = ({ isOpen, onClose, cart, removeFromCart }) => {
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  const handleWhatsAppCheckout = () => {
    const phoneNumber = "919509669135"; 
    
    // 1. Create a clean list of items
    const itemList = cart.map((item, index) => 
      `${index + 1}. ${item.name} (${item.material}) - $${item.price}`
    ).join('\n'); // Use actual new lines here
    
    // 2. Build the full string with proper formatting
    const fullMessage = `*Tarana Jaipur Art House - Order Inquiry*\n\n` +
                        `I am interested in the following pieces:\n${itemList}\n\n` +
                        `*Total Estimate:* $${totalPrice}\n\n` +
                        `Please confirm availability and shipping timelines.`;
    
    // 3. SECURE ENCODING: This prevents the link from breaking with many items
    const encodedMessage = encodeURIComponent(fullMessage);
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[110]"
          />
          
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[120] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-white">
              <div>
                <h2 className="text-2xl font-serif italic text-stone-900">Your Selection</h2>
                <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">{cart.length} Masterpieces</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 hover:bg-stone-50 rounded-full transition-all text-stone-400 hover:text-stone-900"
              >
                <X size={20}/>
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              <AnimatePresence initial={false}>
                {cart.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag className="text-stone-200" size={24} />
                    </div>
                    <p className="text-stone-400 font-serif italic text-lg">The gallery is empty...</p>
                    <button 
                      onClick={onClose}
                      className="mt-6 text-[10px] uppercase tracking-widest font-bold text-[#C5A059] border-b border-[#C5A059] pb-1"
                    >
                      Browse Collection
                    </button>
                  </motion.div>
                ) : (
                  cart.map((item) => (
                    <motion.div 
                      layout 
                      key={item.cartId} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-6 items-center group"
                    >
                      <div className="relative w-20 h-24 overflow-hidden bg-stone-100 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-serif text-stone-900 truncate uppercase tracking-wide">{item.name}</h4>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1 italic">{item.material}</p>
                        <p className="text-sm font-bold mt-2 text-stone-900">${item.price}</p>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.cartId)}
                        className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-8 bg-stone-50 border-t border-stone-100"
              >
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-black">Subtotal</span>
                    <p className="text-[9px] text-stone-400 italic">Excluding global shipping</p>
                  </div>
                  <span className="text-4xl font-serif text-stone-900">${totalPrice}</span>
                </div>
                
                <button 
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-[#25D366] text-white py-6 rounded-sm flex items-center justify-center gap-4 hover:bg-[#1c9c4c] transition-all font-black tracking-[0.2em] text-[11px] uppercase shadow-xl shadow-green-100 group"
                >
                  <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
                  Request Bespoke Quote
                </button>
                
                <p className="text-[9px] text-center text-stone-400 mt-6 uppercase tracking-[0.1em] leading-relaxed">
                  Our master artisans will respond within 24 hours <br/> regarding availability & insurance.
                </p>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;