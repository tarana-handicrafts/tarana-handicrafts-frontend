import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ArrowUpRight } from 'lucide-react';

const ProfessionalQA = () => {
  const [activeIndex, setActiveIndex] = useState(0); 

  const faqs = [
    {
      q: "How do you ensure the authenticity of the wood?",
      a: "Every Tarana masterpiece is accompanied by an Authenticity Certificate. We use legally sourced Kadam and Teak wood, seasoned for over 24 months to ensure it never cracks or loses its shape in different climates."
    },
    {
      q: "Can I track the carving process of my custom order?",
      a: "Yes. For bespoke commissions, we provide bi-weekly photo updates from the artisan's workshop in Jaipur, allowing you to witness your piece's journey from a raw block to a finished sculpture."
    },
    {
      q: "How is the delicate Jali work protected during shipping?",
      a: "We use 'Zero-Vibration' museum packaging. The sculpture is suspended in high-density foam within a reinforced export-grade crate, specifically designed to protect delicate lattice carvings during global transit."
    },
    {
      q: "Are these pieces suitable for outdoor display?",
      a: "While our wood is highly durable, we recommend indoor or semi-shaded placement to preserve the natural oils and intricate detailing. We provide a specialized wax-polish kit with every purchase for yearly maintenance."
    }
  ];

  return (
    <section id='ProfessionalQA' className="py-24 bg-[#0A0A09] text-white overflow-hidden border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          
          {/* LEFT SIDE: CRAFTSMANSHIP QUOTE */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-[30px] tracking-[0.4em] uppercase text-brand-gold font-bold mb-4 block">
                  Heritage Preservation
                </span>
                <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight mb-8">
                  Artisan <br /> 
                  <span className="italic text-stone-500 font-light">Ethics.</span>
                </h2>
                
                <div className="relative pl-6 border-l border-brand-gold/20">
                  <p className="mb-4 font-serif text-lg italic font-light leading-relaxed text-stone-400">
                    "We do not just carve wood; we subtract everything that isn't the elephant's soul."
                  </p>
                  <cite className="text-[10px] uppercase tracking-[0.2em] text-stone-600 not-italic flex items-center gap-2">
                    — Master Carver
                  </cite>
                </div>
              </motion.div>
            </div>
          </div>

          {/* RIGHT SIDE: ACCORDION */}
          <div className="lg:col-span-7">
            <div className="flex flex-col border-t border-white/5">
              {faqs.map((faq, index) => {
                const isOpen = activeIndex === index;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-b border-white/5 transition-all duration-500 ${isOpen ? 'bg-[#111110]' : 'hover:bg-[#0D0D0C]'}`}
                  >
                    <button
                      onClick={() => setActiveIndex(isOpen ? null : index)}
                      className="flex items-center justify-between w-full px-2 py-8 text-left group"
                    >
                      <div className="flex items-center gap-6">
                        <span className={`text-[10px] font-mono transition-colors duration-500 ${isOpen ? 'text-brand-gold' : 'text-stone-700'}`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className={`text-xl md:text-2xl font-serif tracking-tight transition-all duration-500 ${isOpen ? 'text-white' : 'text-stone-400 group-hover:text-stone-200'}`}>
                          {faq.q}
                        </h3>
                      </div>
                      
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-500 ${isOpen ? 'bg-white border-white' : 'border-stone-800'}`}>
                        {isOpen ? (
                          <Minus size={14} className="text-black" />
                        ) : (
                          <Plus size={14} className="text-stone-500" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="px-10 pb-10 md:px-14">
                            <p className="max-w-xl text-base font-light leading-relaxed text-stone-400 italic">
                              {faq.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
            
            {/* CTA Link */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="mt-12 px-2"
            >
              <div className="flex items-center gap-3 group cursor-pointer inline-flex">
                <p className="text-[10px] text-stone-600 uppercase tracking-widest font-bold">
                  Need a custom consultation?
                </p>
                <div className="flex items-center gap-1 text-brand-gold">
                  <span className="text-[10px] font-bold uppercase tracking-widest border-b border-brand-gold/0 group-hover:border-brand-gold transition-all">Inquire</span>
                  <ArrowUpRight size={12} />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProfessionalQA;