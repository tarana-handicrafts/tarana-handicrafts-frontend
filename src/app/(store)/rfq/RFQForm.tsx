"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { whatsappLink } from "@/lib/constants";

/** Catalog entry offered in the product picker. */
export interface RFQProduct {
  slug: string;
  name: string;
  category: string;
}

interface RFQItem {
  slug?: string;
  productName: string;
  size?: string;
  quantity: number;
}

type CustomerType = (typeof customerTypes)[number]["value"];
type Incoterm = (typeof incoterms)[number];

const customerTypes = [
  { value: "wholesaler", label: "Wholesaler / Reseller" },
  { value: "retailer", label: "Retail Buyer" },
  { value: "importer", label: "Importer / Exporter" },
  { value: "distributor", label: "Distributor" },
  { value: "interior_designer", label: "Interior Designer / Decor" },
  { value: "hotel", label: "Hotel / Hospitality" },
  { value: "corporate_gifting", label: "Corporate Gifting" },
  { value: "other", label: "Other" },
] as const;

const incoterms = ["EXW", "FOB", "CIF", "DDP"] as const;

// Sanitize input to prevent XSS (matches contact page convention)
const sanitize = (input: string, maxLength = 500): string =>
  input.replace(/[<>]/g, "").trim().slice(0, maxLength);

// ─── Searchable catalog product picker (hybrid: pick a product or type a custom item) ───
function ProductCombobox({
  products,
  value,
  linked,
  inputClassName,
  onType,
  onPick,
}: {
  products: RFQProduct[];
  value: string;
  linked: boolean;
  inputClassName: string;
  onType: (value: string) => void;
  onPick: (product: RFQProduct) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const matches = useMemo(() => {
    if (!products.length) return [];
    const q = value.trim().toLowerCase();
    const base = q
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        )
      : products;
    return base.slice(0, 8);
  }, [products, value]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onType(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        maxLength={200}
        className={inputClassName}
        placeholder="Search a product or type a custom item"
        autoComplete="off"
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-autocomplete="list"
      />
      {linked && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#C5A059]">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
      {open && matches.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-stone-200 bg-white py-1 shadow-lg"
        >
          {matches.map((p) => (
            <li key={p.slug} role="option" aria-selected={value === p.name}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onPick(p);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-stone-50"
              >
                <span className="truncate text-stone-800">{p.name}</span>
                {p.category && (
                  <span className="shrink-0 text-[10px] uppercase tracking-widest text-stone-400">
                    {p.category}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function RFQForm({ products }: { products: RFQProduct[] }) {
  const searchParams = useSearchParams();
  const { cart } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    customerType: "wholesaler" as CustomerType,
    website: "", // honeypot
    targetPrice: "",
    incoterm: "FOB" as Incoterm,
    destinationPort: "",
    requiredBy: "",
    message: "",
  });

  const [items, setItems] = useState<RFQItem[]>(() => {
    const product = products.find((p) => p.slug === searchParams.get("product"));
    if (product) return [{ slug: product.slug, productName: product.name, quantity: 50 }];
    return [{ productName: "", quantity: 50 }];
  });

  // "Need a formal quote?" from the cart: start from the cart lines (cart loads from storage after mount).
  const prefilledFromCart = useRef(false);
  useEffect(() => {
    if (prefilledFromCart.current || searchParams.get("from") !== "cart" || cart.length === 0) return;
    prefilledFromCart.current = true;
    setItems(cart.map((l) => ({ slug: l.slug, productName: l.name, size: l.size, quantity: l.qty })));
  }, [cart, searchParams]);

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

  // Free-text typing: keep the name, drop any linked catalog product
  const handleItemNameChange = (index: number, value: string) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, productName: value, slug: undefined, size: undefined } : item
      )
    );
    if (errors.items) setErrors((prev) => ({ ...prev, items: "" }));
  };

  // Selecting a catalog product links both slug and name
  const handleItemSelect = (index: number, product: RFQProduct) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, slug: product.slug, productName: product.name }
          : item
      )
    );
    if (errors.items) setErrors((prev) => ({ ...prev, items: "" }));
  };

  const handleItemQuantityChange = (index: number, value: string) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, parseInt(value) || 0) }
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

    const payload = {
      type: "quote",
      website: form.website,
      name: sanitize(form.name, 100),
      email: sanitize(form.email, 254),
      phone: sanitize(form.phone, 30),
      company: sanitize(form.company, 120),
      country: sanitize(form.country, 60),
      message: sanitize(form.message, 1000),
      items: items
        .filter((it) => it.productName.trim() && it.quantity > 0)
        .map((it) => ({ slug: it.slug, name: sanitize(it.productName, 200), size: it.size, quantity: it.quantity })),
      details: {
        "Customer type": customerTypes.find((t) => t.value === form.customerType)?.label ?? form.customerType,
        "Target price": sanitize(form.targetPrice, 100),
        Incoterm: form.incoterm,
        Destination: sanitize(form.destinationPort, 120),
        "Required by": form.requiredBy,
      },
    };

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setQuoteRef(data.ref || "Received");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
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
            href={whatsappLink(`Hi, I just submitted quote request ${quoteRef} on your website.`)}
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

      {/* Spam trap: hidden from people, bots fill it in */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={handleChange}
        className="hidden"
        aria-hidden="true"
      />

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
            <div key={index} className="flex items-start gap-3">
              <ProductCombobox
                products={products}
                value={item.productName}
                linked={Boolean(item.slug)}
                inputClassName={`${inputBase} border-stone-200`}
                onType={(value) => handleItemNameChange(index, value)}
                onPick={(product) => handleItemSelect(index, product)}
              />
              {item.size && <span className="shrink-0 self-center text-xs text-stone-500">{item.size}</span>}
              <div className="w-24 shrink-0">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => handleItemQuantityChange(index, e.target.value)}
                  className={`${inputBase} border-stone-200`}
                  placeholder="Qty"
                  aria-label="Quantity"
                />
              </div>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="shrink-0 px-2 py-3 text-stone-400 transition-colors hover:text-red-500"
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
        <p className="mt-2 text-xs text-stone-400">
          Start typing to search our catalog, or enter a custom product / description.
        </p>
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
