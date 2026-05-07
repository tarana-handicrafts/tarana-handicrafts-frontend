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
    <div className="min-h-screen bg-[#F9F8F6]">
      {/* Hero Section - Consistent with Products Page */}
      <section className="px-4 pb-16 pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
              Get in Touch
            </span>
            <h1 className="mb-4 font-serif text-4xl md:text-5xl">
              Let&apos;s Create{" "}
              <span className="font-light italic text-stone-500">Together</span>
            </h1>
            <p className="mx-auto max-w-2xl text-stone-500">
              Whether you&apos;re looking for a masterpiece for your home, a
              custom order for your business, or bulk export — we&apos;re here to
              help.
            </p>
          </div>
        </div>
      </section>

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
                  <label
                    htmlFor="message"
                    className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-stone-500"
                  >
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    maxLength={1000}
                    className={`w-full resize-none border bg-transparent px-4 py-3 text-stone-900 transition-all focus:border-[#C5A059] focus:outline-none ${
                      errors.message ? "border-red-500" : "border-stone-200"
                    }`}
                    placeholder="Tell us about your requirements..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                  )}
                  <p className="mt-1 text-right text-xs text-stone-500">
                    {formData.message.length}/1000
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className={`flex w-full items-center justify-center gap-3 rounded-lg py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${
                    isSubmitted
                      ? "bg-green-600 text-white"
                      : "bg-stone-900 text-white hover:bg-[#C5A059] hover:shadow-xl"
                  } disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </>
                  ) : isSubmitted ? (
                    <>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Message Sent!
                    </>
                  ) : (
                    <>
                      Send via WhatsApp
                      {icons.whatsapp}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Details */}
            <div>
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
                Contact Details
              </span>
              <h2 className="mb-8 font-serif text-3xl md:text-4xl">
                Find Us Here
              </h2>

              {/* Business Info */}
              <div className="mb-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C5A059]/10 text-[#C5A059]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900">{contactInfo.businessName}</h4>
                    <p className="text-sm text-stone-500">Proprietor: {contactInfo.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C5A059]/10 text-[#C5A059]">
                    {icons.location}
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900">Address</h4>
                    <p className="text-sm text-stone-500">{contactInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C5A059]/10 text-[#C5A059]">
                    {icons.phone}
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900">Phone</h4>
                    <p className="text-sm text-stone-500">{contactInfo.phone.join(" / ")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C5A059]/10 text-[#C5A059]">
                    {icons.email}
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900">Email</h4>
                    <p className="text-sm text-stone-500">{contactInfo.email}</p>
                  </div>
                </div>
              </div>

              {/* Nearby Landmarks */}
              <div className="border-t border-stone-200 pt-8">
                <h3 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                  Nearby Landmarks
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {landmarks.map((landmark, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg border border-stone-100 bg-stone-50 p-4"
                    >
                      <div className="text-[#C5A059]">
                        {icons[landmark.icon as keyof typeof icons]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-stone-900">
                          {landmark.name}
                        </p>
                        <p className="text-xs text-[#C5A059]">{landmark.distance}</p>
                        <p className="text-[10px] text-stone-500">{landmark.type}</p>
                      </div>
                    </div>
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

      {/* CTA Section */}
      <section className="mx-4 mb-8 rounded-xl bg-[#C5A059] py-16 px-6 text-center text-white md:mx-auto md:max-w-7xl">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 font-serif !text-white text-3xl md:text-4xl">
            Ready to Start Your Order?
          </h2>
          <p className="mb-8 text-lg font-light opacity-90">
            Browse our collection or chat with us for custom requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="rounded-lg bg-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059] transition-all hover:bg-stone-900 hover:text-white hover:shadow-xl"
            >
              Browse Products
            </Link>
            <a
              href={`https://wa.me/${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border-2 border-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-white hover:text-[#C5A059]"
            >
              {icons.whatsapp}
              Chat on WhatsApp
            </a>
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