"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle, ArrowUpRight, Clock, Navigation } from "lucide-react";

// Contact Information
const contactInfo = {
  name: "Amit Kumawat",
  businessName: "Tarana Handicrafts",
  address: "B81, North Avenue, Harmara Ghati, Sikar Road, Jaipur, Rajasthan, India",
  phone: ["+91 9509669135", "+91 8952819888"],
  email: "taranahandicrafts@gmail.com",
  whatsapp: "919509669135",
};

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const message = `*Website Inquiry*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Subject:* ${formData.subject}\n*Message:* ${formData.message}`;
    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#000000] selection:bg-[#C5A059] selection:text-white pb-24">
      
      {/* --- MINIMAL HEADER --- */}
      <header className="pt-32 pb-16 px-6 md:px-12 text-center max-w-4xl mx-auto">
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#C5A059] mb-6 block">
          Get in Touch
        </span>
        <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] mb-6">
          Let's Discuss <br /> 
          <span className="italic text-stone-400 font-light">Your Vision</span>
        </h1>
        <p className="text-stone-500 font-serif text-lg md:text-xl italic">
          Whether you seek a bespoke masterpiece or a wholesale partnership, our atelier is at your service.
        </p>
      </header>

      {/* --- BENTO BOX GRID LAYOUT --- */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-min">
          
          {/* BLOCK 1: THE DIRECTORY (Top Left) */}
          <div className="lg:col-span-5 bg-stone-100 rounded-[2rem] p-10 md:p-14 flex flex-col justify-between group hover:bg-stone-200/50 transition-colors duration-500">
            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="h-2 w-2 bg-[#C5A059] rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">Directory</span>
              </div>
              
              <div className="space-y-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-stone-400">Proprietor</p>
                  <p className="font-serif text-2xl">{contactInfo.name}</p>
                  <p className="text-sm text-stone-500">{contactInfo.businessName}</p>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-stone-400">Direct Lines</p>
                  {contactInfo.phone.map(p => (
                    <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="block font-serif text-xl hover:text-[#C5A059] transition-colors">
                      {p}
                    </a>
                  ))}
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-stone-400">Electronic Mail</p>
                  <a href={`mailto:${contactInfo.email}`} className="font-serif text-xl break-all hover:text-[#C5A059] transition-colors border-b border-transparent hover:border-[#C5A059]">
                    {contactInfo.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* BLOCK 2: THE MAP TILE (Top Right) */}
          <div className="lg:col-span-7 h-[400px] lg:h-auto rounded-[2rem] overflow-hidden relative group border border-stone-200">
            <iframe
              src="http://googleusercontent.com/maps.google.com/4"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              className="absolute inset-0 grayscale-[0.8] contrast-[1.1] group-hover:grayscale-0 transition-all duration-1000 object-cover"
            />
            {/* Map Glassmorphism Overlay */}
            <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl transition-transform duration-500 group-hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-[#000000] text-white p-2 rounded-full">
                  <MapPin size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Atelier Location</span>
              </div>
              <p className="text-sm font-serif leading-relaxed text-stone-800 mb-4">
                {contactInfo.address}
              </p>
              <a 
                href="http://googleusercontent.com/maps.google.com/5" 
                target="_blank" rel="noopener noreferrer"
                className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] flex items-center gap-2 hover:text-black transition-colors"
              >
                Get Directions <Navigation size={12} />
              </a>
            </div>
          </div>

          {/* BLOCK 3: THE INQUIRY FORM (Bottom Left) */}
          <div className="lg:col-span-8 bg-white border border-stone-200 rounded-[2rem] p-10 md:p-14 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden">
            
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
               <Mail size={200} />
            </div>

            <div className="mb-10 relative z-10">
              <h2 className="font-serif text-4xl mb-2">Send an Inquiry</h2>
              <p className="text-stone-400 text-xs tracking-widest uppercase font-bold">Priority Response Queue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative group">
                  <input 
                    type="text" required placeholder=" " 
                    className="peer w-full bg-stone-50 border border-stone-100 rounded-xl px-4 pt-6 pb-2 text-sm outline-none focus:border-[#C5A059] focus:bg-white transition-all"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <label className="absolute left-4 top-4 text-stone-400 text-[9px] font-black uppercase tracking-widest transition-all peer-focus:top-2 peer-focus:text-[#C5A059] peer-[:not(:placeholder-shown)]:top-2">
                    Full Name *
                  </label>
                </div>
                <div className="relative group">
                  <input 
                    type="email" required placeholder=" " 
                    className="peer w-full bg-stone-50 border border-stone-100 rounded-xl px-4 pt-6 pb-2 text-sm outline-none focus:border-[#C5A059] focus:bg-white transition-all"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <label className="absolute left-4 top-4 text-stone-400 text-[9px] font-black uppercase tracking-widest transition-all peer-focus:top-2 peer-focus:text-[#C5A059] peer-[:not(:placeholder-shown)]:top-2">
                    Email Address *
                  </label>
                </div>
              </div>

              <div className="relative group">
                <select 
                  required
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-4 text-sm outline-none focus:border-[#C5A059] focus:bg-white transition-all appearance-none text-stone-600 font-medium"
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                >
                  <option value="" disabled selected>Select Inquiry Subject *</option>
                  <option value="Product Inquiry">Product Inquiry</option>
                  <option value="Custom Carving">Custom Carving Commission</option>
                  <option value="International Export">International Export</option>
                  <option value="Wholesale">Wholesale / B2B</option>
                </select>
              </div>

              <div className="relative group">
                <textarea 
                  rows={4} required placeholder=" " 
                  className="peer w-full bg-stone-50 border border-stone-100 rounded-xl px-4 pt-6 pb-2 text-sm outline-none focus:border-[#C5A059] focus:bg-white transition-all resize-none"
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
                <label className="absolute left-4 top-4 text-stone-400 text-[9px] font-black uppercase tracking-widest transition-all peer-focus:top-2 peer-focus:text-[#C5A059] peer-[:not(:placeholder-shown)]:top-2">
                  Message Details *
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={`w-full py-5 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 ${
                  isSubmitted ? "bg-[#25D366] text-white" : "bg-[#000000] text-white hover:bg-[#C5A059] shadow-lg hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                {isSubmitting ? "Processing..." : isSubmitted ? "Inquiry Sent via WhatsApp" : "Submit Inquiry"}
                {!isSubmitting && !isSubmitted && <ArrowUpRight size={16} />}
              </button>
            </form>
          </div>

          {/* BLOCK 4: WHATSAPP & HOURS (Bottom Right - Stacked) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* WhatsApp Quick Connect Tile */}
            <a 
              href={`https://wa.me/${contactInfo.whatsapp}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] text-white rounded-[2rem] p-10 flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-500 shadow-lg"
            >
              <div className="flex justify-between items-start">
                <MessageCircle size={40} className="opacity-80 group-hover:opacity-100 transition-opacity" />
                <ArrowUpRight size={24} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">Instant Connect</p>
                <h3 className="font-serif text-3xl">Chat on <br/>WhatsApp</h3>
              </div>
            </a>

            {/* Business Hours Tile */}
            <div className="bg-[#000000] text-white rounded-[2rem] p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6 text-[#C5A059]">
                <Clock size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Operating Hours</span>
              </div>
              <ul className="space-y-4">
                <li className="flex justify-between items-end border-b border-white/10 pb-2">
                  <span className="text-sm text-stone-400">Mon - Sat</span>
                  <span className="font-serif">09:00 AM — 08:00 PM</span>
                </li>
                <li className="flex justify-between items-end pb-2">
                  <span className="text-sm text-stone-400">Sunday</span>
                  <span className="font-serif italic text-stone-500">Closed</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}