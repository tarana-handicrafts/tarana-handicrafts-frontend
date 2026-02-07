"use client";

import { useState } from "react";
import Link from "next/link";

// Contact Information
const contactInfo = {
  name: "Amit Kumawat",
  businessName: "Tarana Handicrafts",
  address: "B81, North Avenue, Harmara Ghati, Sikar Road, Jaipur, Rajasthan, India",
  phone: ["+91 9509669135", "+91 8952819888"],
  email: "taranahandicrafts@gmail.com",
  whatsapp: "919509669135",
};

// Nearby Landmarks
const landmarks = [
  {
    icon: "train",
    name: "Jaipur Junction",
    distance: "12 km",
    type: "Nearest Railway Station",
  },
  {
    icon: "bus",
    name: "Sindhi Camp",
    distance: "12 km",
    type: "Nearest Bus Stand",
  },
  {
    icon: "busStop",
    name: "Harmara Ghati Bus Stop",
    distance: "100 meters",
    type: "Nearest Bus Stop",
  },
  {
    icon: "plane",
    name: "Jaipur International Airport",
    distance: "13 km",
    type: "Nearest Airport",
  },
];

// Icon components
const icons = {
  train: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
    </svg>
  ),
  bus: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h8m-8 4h8m-4-8v16m-4 0h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  busStop: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  plane: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  phone: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  email: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  location: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  whatsapp: (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sanitize input to prevent XSS
  const sanitizeInput = (input: string, maxLength: number = 500): string => {
    if (typeof input !== "string") return "";
    return input
      .replace(/[<>]/g, "") // Remove HTML brackets
      .trim()
      .slice(0, maxLength);
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = "Please enter a valid name";
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject) {
      newErrors.subject = "Please select a subject";
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      newErrors.message = "Please enter a message (at least 10 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Sanitize all inputs before creating message
    const sanitizedData = {
      name: sanitizeInput(formData.name, 100),
      email: sanitizeInput(formData.email, 254),
      phone: sanitizeInput(formData.phone, 20),
      subject: sanitizeInput(formData.subject, 100),
      message: sanitizeInput(formData.message, 1000),
    };

    // Generate WhatsApp message
    const message = `*New Inquiry from Website*

*Name:* ${sanitizedData.name}
*Email:* ${sanitizedData.email}
*Phone:* ${sanitizedData.phone || "Not provided"}
*Subject:* ${sanitizedData.subject}

*Message:*
${sanitizedData.message}`;

    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(message)}`;

    // Use noopener and noreferrer for security
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setErrors({});
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-[#0A0A09] px-6 py-24 text-white">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
            Get in Touch
          </span>
          <h1 className="mb-6 font-serif text-4xl leading-tight md:text-6xl lg:text-7xl">
            Let&apos;s Create{" "}
            <span className="font-light italic text-stone-400">Together</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-stone-400">
            Whether you&apos;re looking for a masterpiece for your home, a
            custom order for your business, or bulk export — we&apos;re here to
            help.
          </p>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="bg-[#F9F8F6] py-16 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Phone Card */}
            <a
              href={`tel:${contactInfo.phone[0].replace(/\s/g, "")}`}
              className="group flex flex-col items-center border border-stone-200 bg-white p-8 text-center transition-all hover:border-[#C5A059]/50 hover:shadow-xl"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#C5A059]/10 text-[#C5A059] transition-all group-hover:bg-[#C5A059] group-hover:text-white">
                {icons.phone}
              </div>
              <h3 className="mb-2 font-serif text-lg">Call Us</h3>
              <p className="text-sm text-stone-600">{contactInfo.phone[0]}</p>
              <p className="text-sm text-stone-600">{contactInfo.phone[1]}</p>
            </a>

            {/* WhatsApp Card */}
            <a
              href={`https://wa.me/${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center border border-stone-200 bg-white p-8 text-center transition-all hover:border-[#25D366]/50 hover:shadow-xl"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] transition-all group-hover:bg-[#25D366] group-hover:text-white">
                {icons.whatsapp}
              </div>
              <h3 className="mb-2 font-serif text-lg">WhatsApp</h3>
              <p className="text-sm text-stone-600">Quick Response</p>
              <p className="text-sm text-stone-600">Chat with us</p>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${contactInfo.email}`}
              className="group flex flex-col items-center border border-stone-200 bg-white p-8 text-center transition-all hover:border-[#C5A059]/50 hover:shadow-xl"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#C5A059]/10 text-[#C5A059] transition-all group-hover:bg-[#C5A059] group-hover:text-white">
                {icons.email}
              </div>
              <h3 className="mb-2 font-serif text-lg">Email Us</h3>
              <p className="text-sm text-stone-600 break-all">{contactInfo.email}</p>
            </a>

            {/* Location Card */}
            <div className="group flex flex-col items-center border border-stone-200 bg-white p-8 text-center transition-all hover:border-[#C5A059]/50 hover:shadow-xl">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#C5A059]/10 text-[#C5A059] transition-all group-hover:bg-[#C5A059] group-hover:text-white">
                {icons.location}
              </div>
              <h3 className="mb-2 font-serif text-lg">Visit Us</h3>
              <p className="text-sm text-stone-600">Jaipur, Rajasthan</p>
              <p className="text-sm text-stone-600">India 🇮🇳</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
                Send a Message
              </span>
              <h2 className="mb-8 font-serif text-3xl md:text-4xl">
                Inquiry Form
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-stone-500"
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      autoComplete="name"
                      className={`w-full border bg-transparent px-4 py-3 text-stone-900 transition-all focus:border-[#C5A059] focus:outline-none ${
                        errors.name ? "border-red-500" : "border-stone-200"
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-stone-500"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      maxLength={254}
                      autoComplete="email"
                      className={`w-full border bg-transparent px-4 py-3 text-stone-900 transition-all focus:border-[#C5A059] focus:outline-none ${
                        errors.email ? "border-red-500" : "border-stone-200"
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-stone-500"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={20}
                      autoComplete="tel"
                      className="w-full border border-stone-200 bg-transparent px-4 py-3 text-stone-900 transition-all focus:border-[#C5A059] focus:outline-none"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-stone-500"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={`w-full border bg-transparent px-4 py-3 text-stone-900 transition-all focus:border-[#C5A059] focus:outline-none ${
                        errors.subject ? "border-red-500" : "border-stone-200"
                      }`}
                    >
                      <option value="">Select a subject</option>
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Custom Order">Custom Order</option>
                      <option value="Bulk/Export Order">Bulk/Export Order</option>
                      <option value="Collaboration">Collaboration</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.subject && (
                      <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
                    )}
                  </div>
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
                  <p className="mt-1 text-right text-xs text-stone-400">
                    {formData.message.length}/1000
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className={`flex w-full items-center justify-center gap-3 py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${
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
                        <p className="text-[10px] text-stone-400">{landmark.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative">
        {/* Map Header */}
        <div className="bg-[#0A0A09] py-12 px-6 text-center text-white">
          <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
            Our Location
          </span>
          <h2 className="font-serif text-3xl md:text-4xl">
            Visit Our Workshop
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-stone-400">
            {contactInfo.address}
          </p>
        </div>

        {/* Google Maps Embed */}
        <div className="relative h-[500px] w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3556.8!2d75.7847!3d26.9510!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4a3a0f8d7f0d%3A0x8b9b6c3d2e1f4a5b!2sHarmara%20Ghati%2C%20Sikar%20Road%2C%20Jaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1707307200000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Tarana Handicrafts Location - Jaipur, Rajasthan"
            className="grayscale transition-all duration-500 hover:grayscale-0"
          />

          {/* Map Overlay Card */}
          <div className="absolute bottom-8 left-8 z-10 hidden max-w-sm border border-stone-200 bg-white p-6 shadow-2xl md:block">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C5A059] text-white">
                {icons.location}
              </div>
              <div>
                <h4 className="font-serif text-lg">{contactInfo.businessName}</h4>
                <p className="text-xs text-stone-500">Jaipur, Rajasthan</p>
              </div>
            </div>
            <p className="mb-4 text-sm text-stone-600">{contactInfo.address}</p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=26.9510,75.7847`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-stone-900 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-[#C5A059]"
            >
              Get Directions
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#C5A059] py-16 px-6 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 font-serif text-3xl md:text-4xl">
            Ready to Start Your Order?
          </h2>
          <p className="mb-8 text-lg font-light opacity-90">
            Browse our collection or chat with us for custom requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="bg-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059] transition-all hover:bg-stone-900 hover:text-white hover:shadow-xl"
            >
              Browse Products
            </Link>
            <a
              href={`https://wa.me/${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border-2 border-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-white hover:text-[#C5A059]"
            >
              {icons.whatsapp}
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
