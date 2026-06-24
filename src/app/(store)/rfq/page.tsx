"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { submitRFQ, type RFQItem, type RFQPayload } from "@/lib/storeApi";

const whatsappNumber = "919509669135";

type CustomerType = NonNullable<RFQPayload["customerType"]>;
type Incoterm = NonNullable<RFQPayload["incoterm"]>;

const customerTypes: { value: CustomerType; label: string }[] = [
  { value: "wholesale", label: "Wholesaler / Reseller" },
  { value: "retail", label: "Retail Buyer" },
  { value: "exporter", label: "Importer / Exporter" },
  { value: "interior", label: "Interior Designer / Decor" },
  { value: "other", label: "Other" },
];

const incoterms: Incoterm[] = ["EXW", "FOB", "CIF", "DDP"];

// Sanitize input to prevent XSS (matches contact page convention)
const sanitize = (input: string, maxLength = 500): string =>
  input.replace(/[<>]/g, "").trim().slice(0, maxLength);

function RFQForm() {
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    customerType: "wholesale" as CustomerType,
    targetPrice: "",
    incoterm: "FOB" as Incoterm,
    destinationPort: "",
    requiredBy: "",
    message: "",
  });

  const [items, setItems] = useState<RFQItem[]>(() => {
    const productId = searchParams.get("product") || undefined;
    const productName = searchParams.get("name");
    if (productName) {
      return [{ productId, productName: sanitize(productName, 200), quantity: 50 }];
    }
    return [{ productName: "", quantity: 50 }];
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteRef, setQuoteRef] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleItemChange = (
    index: number,
    field: keyof RFQItem,
    value: string
  ) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === "quantity" ? Math.max(1, parseInt(value) || 0) : value,
            }
          : item
      )
    );
  };

  const addItem = () =>
    setItems((prev) => [...prev, { productName: "", quantity: 50 }]);

  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      next.name = "Please enter your name";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) next.email = "Enter a valid email address";
    if (!form.phone.trim() || form.phone.trim().length < 6)
      next.phone = "Enter a valid phone / WhatsApp number";
    const hasItem = items.some((it) => it.productName.trim() && it.quantity > 0);
    if (!hasItem)
      next.items = "Add at least one product with a quantity";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setIsSubmitting(true);

    const payload: RFQPayload = {
      name: sanitize(form.name, 100),
      email: sanitize(form.email, 254),
      phone: sanitize(form.phone, 20),
      company: sanitize(form.company, 150) || undefined,
      country: sanitize(form.country, 100) || undefined,
      customerType: form.customerType,
      items: items
        .filter((it) => it.productName.trim() && it.quantity > 0)
        .map((it) => ({
          productId: it.productId,
          productName: sanitize(it.productName, 200),
          quantity: it.quantity,
        })),
      message: sanitize(form.message, 1000) || undefined,
      targetPrice: sanitize(form.targetPrice, 100) || undefined,
      incoterm: form.incoterm,
      destinationPort: sanitize(form.destinationPort, 120) || undefined,
      requiredBy: form.requiredBy || undefined,
    };

    const res = await submitRFQ(payload);
    setIsSubmitting(false);

    if (res.success) {
      setQuoteRef(res.quoteRef || "Received");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setServerError(res.error || "Something went wrong. Please try again.");
    }
  };

  // ─── Success state ───
  if (quoteRef) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mb-3 font-serif text-3xl">Quote Request Received</h2>
        <p className="mb-2 text-stone-600">
          Thank you. Our export team will get back to you within{" "}
          <span className="font-semibold text-stone-900">24 business hours</span>{" "}
          with pricing and lead times.
        </p>
        <p className="mb-8 text-sm text-stone-500">
          Your reference number:{" "}
          <span className="font-mono font-semibold text-[#C5A059]">{quoteRef}</span>
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              `Hi, I just submitted quote request ${quoteRef} on your website.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:shadow-lg"
          >
            Chat on WhatsApp
          </a>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-lg border border-stone-300 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-700 transition-all hover:border-[#C5A059] hover:text-[#C5A059]"
          >
            Continue Browsing
          </Link>
        </div>
      </div>
    );
  }

  const inputBase =
    "w-full border bg-transparent px-4 py-3 text-stone-900 transition-all focus:border-[#C5A059] focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Contact details */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-stone-500">
            Your Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            maxLength={100}
            autoComplete="name"
            className={`${inputBase} ${errors.name ? "border-red-500" : "border-stone-200"}`}
            placeholder="John Doe"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="company" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-stone-500">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            value={form.company}
            onChange={handleChange}
            maxLength={150}
            autoComplete="organization"
            className={`${inputBase} border-stone-200`}
            placeholder="Your business name"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-stone-500">
            Email Address *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            maxLength={254}
            autoComplete="email"
            className={`${inputBase} ${errors.email ? "border-red-500" : "border-stone-200"}`}
            placeholder="john@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-stone-500">
            Phone / WhatsApp *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            maxLength={20}
            autoComplete="tel"
            className={`${inputBase} ${errors.phone ? "border-red-500" : "border-stone-200"}`}
            placeholder="+91 9876543210"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="country" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-stone-500">
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            value={form.country}
            onChange={handleChange}
            maxLength={100}
            autoComplete="country-name"
            className={`${inputBase} border-stone-200`}
            placeholder="United States"
          />
        </div>
        <div>
          <label htmlFor="customerType" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-stone-500">
            I am a
          </label>
          <select
            id="customerType"
            name="customerType"
            value={form.customerType}
            onChange={handleChange}
            className={`${inputBase} border-stone-200`}
          >
            {customerTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products / quantities */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500">
            Products & Quantities *
          </label>
          <button
            type="button"
            onClick={addItem}
            className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] hover:underline"
          >
            + Add Product
          </button>
        </div>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={item.productName}
                onChange={(e) => handleItemChange(index, "productName", e.target.value)}
                maxLength={200}
                className={`${inputBase} border-stone-200 flex-1`}
                placeholder="Product name or description"
              />
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                className={`${inputBase} border-stone-200 w-28`}
                placeholder="Qty"
                aria-label="Quantity"
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="px-3 text-stone-400 transition-colors hover:text-red-500"
                  aria-label="Remove product"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.items && <p className="mt-1 text-xs text-red-500">{errors.items}</p>}
      </div>

      {/* Export terms */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="targetPrice" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-stone-500">
            Target Price (optional)
          </label>
          <input
            id="targetPrice"
            name="targetPrice"
            type="text"
            value={form.targetPrice}
            onChange={handleChange}
            maxLength={100}
            className={`${inputBase} border-stone-200`}
            placeholder="e.g. $12 / unit"
          />
        </div>
        <div>
          <label htmlFor="incoterm" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-stone-500">
            Preferred Incoterm
          </label>
          <select
            id="incoterm"
            name="incoterm"
            value={form.incoterm}
            onChange={handleChange}
            className={`${inputBase} border-stone-200`}
          >
            {incoterms.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="destinationPort" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-stone-500">
            Destination Port / City
          </label>
          <input
            id="destinationPort"
            name="destinationPort"
            type="text"
            value={form.destinationPort}
            onChange={handleChange}
            maxLength={120}
            className={`${inputBase} border-stone-200`}
            placeholder="e.g. Los Angeles"
          />
        </div>
        <div>
          <label htmlFor="requiredBy" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-stone-500">
            Required By
          </label>
          <input
            id="requiredBy"
            name="requiredBy"
            type="date"
            value={form.requiredBy}
            onChange={handleChange}
            className={`${inputBase} border-stone-200`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-stone-500">
          Additional Details
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          maxLength={1000}
          className={`${inputBase} border-stone-200 resize-none`}
          placeholder="Customization, branding, packaging, certifications, or any other requirements..."
        />
        <p className="mt-1 text-right text-xs text-stone-500">{form.message.length}/1000</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-3 rounded-lg bg-stone-900 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-[#C5A059] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Submitting...
          </>
        ) : (
          "Request Quote"
        )}
      </button>
      <p className="text-center text-xs text-stone-400">
        No spam. We only use your details to prepare and send your quote.
      </p>
    </form>
  );
}

export default function RFQPage() {
  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <section className="px-4 pb-12 pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
            Wholesale & Export
          </span>
          <h1 className="mb-4 font-serif text-4xl md:text-5xl">
            Request a <span className="font-light italic text-stone-500">Bulk Quote</span>
          </h1>
          <p className="mx-auto max-w-2xl text-stone-500">
            Direct-from-manufacturer pricing for wholesalers, importers, retailers, and
            interior designers. Tell us what you need and our export team will send a
            tailored quotation within 24 business hours.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-10">
          <Suspense fallback={<div className="py-10 text-center text-stone-400">Loading form…</div>}>
            <RFQForm />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
