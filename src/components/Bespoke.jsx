import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hammer, Ruler, MessageSquare, ArrowRight, CheckCircle2, Star } from 'lucide-react';

const Bespoke = ({ setPage }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, you'd send this data to your backend or WhatsApp
  };

  const steps = [
    {
      icon: <MessageSquare size={24} />,
      title: "The Consultation",
      desc: "Discuss your vision with our head curator. From dimensions to wood selection."
    },
    {
      icon: <Ruler size={24} />,
      title: "The Blueprint",
      desc: "Receive a hand-drawn sketch and a 3D conceptualization of your masterpiece."
    },
    {
      icon: <Hammer size={24} />,
      title: "The Creation",
      desc: "Our master carvers spend 200+ hours hand-chiseling your specific vision."
    }
  ];

  return (
    <div className="pt-32 pb-20 bg-[#FDFCFB]">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center gap-3 mb-6"
          >
            <span className="w-12 h-px bg-[#C5A059]"></span>
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#C5A059] font-black">Private Commission</span>
            <span className="w-12 h-px bg-[#C5A059]"></span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-serif text-stone-900 mb-8"
          >
            Bespoke <span className="italic text-stone-400">Artistry</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-stone-500 text-lg font-light leading-relaxed"
          >
            Cannot find the exact piece for your space? Our master artisans in Jaipur 
            specialize in custom commissions. From grand entrance doors to intimate 
            family heirlooms, we bring your imagination to life in wood.
          </motion.p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-stone-900 text-[#C5A059] flex items-center justify-center mx-auto mb-6 rounded-full group-hover:bg-[#C5A059] group-hover:text-white transition-colors duration-500">
                {step.icon}
              </div>
              <h3 className="text-xl font-serif mb-3 italic">{step.title}</h3>
              <p className="text-stone-500 text-sm font-light leading-relaxed px-4">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Commission Form Section */}
        <div className="max-w-6xl mx-auto bg-white border border-stone-100 shadow-2xl flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left: Image & Info */}
          <div className="lg:w-1/2 bg-stone-900 text-white p-12 md:p-16 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <Star className="text-[#C5A059] mb-6" size={32} />
              <h2 className="text-4xl font-serif mb-6">Start Your <br/>Legacy Piece</h2>
              <p className="text-stone-400 font-light mb-8">
                Average bespoke projects take 8-12 weeks to complete, 
                including seasoning of the wood and international transit.
              </p>
              
              <ul className="space-y-4">
                {["Authentic Teak & Rosewood", "Global White-Glove Delivery", "Artisan Signature Certificate"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold">
                    <CheckCircle2 size={16} className="text-[#C5A059]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Artistic Background element */}
            <div className="absolute -bottom-10 -right-10 opacity-10">
                <Hammer size={300} />
            </div>
          </div>

          {/* Right: Actual Form */}
          <div className="lg:w-1/2 p-12 md:p-16">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-black text-stone-400 mb-2 block">Full Name</label>
                    <input type="text" required className="w-full border-b border-stone-200 py-3 outline-none focus:border-[#C5A059] transition-colors font-light" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-black text-stone-400 mb-2 block">Email Address</label>
                    <input type="email" required className="w-full border-b border-stone-200 py-3 outline-none focus:border-[#C5A059] transition-colors font-light" placeholder="john@example.com" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black text-stone-400 mb-2 block">Project Type</label>
                  <select className="w-full border-b border-stone-200 py-3 bg-transparent outline-none focus:border-[#C5A059] transition-colors font-light cursor-pointer">
                    <option>Custom Wall Panel</option>
                    <option>Religious Sculpture</option>
                    <option>Heritage Furniture</option>
                    <option>Architectural Fitting</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black text-stone-400 mb-2 block">Your Vision</label>
                  <textarea rows="4" className="w-full border-b border-stone-200 py-3 outline-none focus:border-[#C5A059] transition-colors font-light resize-none" placeholder="Describe the dimensions and motifs you desire..."></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-stone-900 text-white py-5 flex items-center justify-center gap-4 hover:bg-[#C5A059] transition-all group mt-8 shadow-xl"
                >
                  <span className="text-[10px] uppercase font-black tracking-[0.3em]">Request Private Consultation</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-20"
              >
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-serif mb-4 italic">Inquiry Received</h3>
                <p className="text-stone-500 font-light mb-8">
                  Our head curator will reach out to you within 24 hours to schedule 
                  your initial design session.
                </p>
                <button 
                  onClick={() => setPage('home')}
                  className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-900 border-b border-stone-900 pb-1"
                >
                  Back to Collection
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bespoke;