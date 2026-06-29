"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/storeApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface SampleItem {
  productId: string;
  productName: string;
  quantity: number;
}

export default function SampleOrderClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<SampleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", country: "", city: "", address: "", message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch products for selection
  useEffect(() => {
    fetch(`${API_URL}/api/products/public?limit=100&sortBy=name&sortOrder=asc`)
      .then(res => res.json())
      .then(data => setProducts(data.products || []))
      .catch(() => {});
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addItem = (product: Product) => {
    if (selectedItems.find(i => i.productId === product._id)) return;
    setSelectedItems(prev => [...prev, {
      productId: product._id,
      productName: product.name,
      quantity: 1
    }]);
  };

  const removeItem = (productId: string) => {
    setSelectedItems(prev => prev.filter(i => i.productId !== productId));
  };

  const updateQuantity = (productId: string, qty: number) => {
    setSelectedItems(prev => prev.map(i =>
      i.productId === productId ? { ...i, quantity: Math.min(10, Math.max(1, qty)) } : i
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      setMessage({ type: "error", text: "Please select at least one product." });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/sample-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items: selectedItems }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setMessage({ type: "success", text: data.message || "Sample order submitted!" });
      setSelectedItems([]);
      setForm({ name: "", email: "", phone: "", company: "", country: "", city: "", address: "", message: "" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to submit" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] px-4 pb-16 pt-32">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
            Try Before You Buy
          </span>
          <h1 className="mb-4 font-serif text-4xl md:text-5xl">Sample Order</h1>
          <p className="mx-auto max-w-2xl text-stone-500">
            Order 1-3 samples of any product. Sample cost is credited against your first bulk purchase.
            Perfect for importers and retailers evaluating our quality.
          </p>
        </header>

        {/* Benefits */}
        <div className="mb-12 grid gap-6 sm:grid-cols-3">
          {[
            { title: "1-3 Pieces", desc: "Order small quantities to evaluate quality" },
            { title: "Cost Credited", desc: "Sample cost applied to your first bulk PO" },
            { title: "Fast Ship", desc: "Samples dispatched within 48 hours" },
          ].map(item => (
            <div key={item.title} className="rounded-2xl border border-stone-200 bg-white p-6 text-center">
              <h3 className="mb-1 font-semibold text-stone-800">{item.title}</h3>
              <p className="text-sm text-stone-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Selection */}
          <div>
            <h2 className="mb-4 font-serif text-xl text-stone-800">Select Products</h2>
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 pl-10 focus:border-[#C5A059] focus:outline-none"
              />
              <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Selected Items */}
            {selectedItems.length > 0 && (
              <div className="mb-4 space-y-2">
                {selectedItems.map(item => (
                  <div key={item.productId} className="flex items-center gap-3 rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/5 p-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-stone-800">{item.productName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="h-7 w-7 rounded border border-stone-200 text-stone-600 hover:bg-stone-50">-</button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="h-7 w-7 rounded border border-stone-200 text-stone-600 hover:bg-stone-50">+</button>
                    </div>
                    <button onClick={() => removeItem(item.productId)} className="text-red-500 hover:text-red-700">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Product Grid */}
            <div className="max-h-[400px] overflow-y-auto rounded-xl border border-stone-200 bg-white">
              {filteredProducts.slice(0, 20).map(product => {
                const isSelected = selectedItems.some(i => i.productId === product._id);
                return (
                  <button
                    key={product._id}
                    onClick={() => !isSelected && addItem(product)}
                    disabled={isSelected}
                    className={`flex w-full items-center gap-3 border-b border-stone-100 p-3 text-left transition-colors ${
                      isSelected ? "bg-stone-50 opacity-50" : "hover:bg-stone-50"
                    }`}
                  >
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image src={product.image} alt={product.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">{product.name}</p>
                      <p className="text-xs text-stone-500">{product.category}</p>
                    </div>
                    {isSelected && <span className="text-xs text-[#C5A059] font-medium">Added</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Order Form */}
          <div>
            <h2 className="mb-4 font-serif text-xl text-stone-800">Your Details</h2>
            {message && (
              <div className={`mb-4 rounded-xl p-4 text-sm ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {message.text}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">Name *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-2 focus:border-[#C5A059] focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">Email *</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-2 focus:border-[#C5A059] focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">Phone *</label>
                  <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-2 focus:border-[#C5A059] focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">Company</label>
                  <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-2 focus:border-[#C5A059] focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">Country *</label>
                  <input required value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-2 focus:border-[#C5A059] focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">City</label>
                  <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-2 focus:border-[#C5A059] focus:bg-white focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Shipping Address</label>
                <textarea rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-2 focus:border-[#C5A059] focus:bg-white focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Message</label>
                <textarea rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Any specific requirements..."
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-2 focus:border-[#C5A059] focus:bg-white focus:outline-none" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-stone-500">{selectedItems.length} item(s) selected</p>
                <button
                  type="submit"
                  disabled={submitting || selectedItems.length === 0}
                  className="rounded-xl bg-[#C5A059] px-8 py-3 font-semibold text-white transition-all hover:bg-[#B8934E] disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Sample Order"}
                </button>
              </div>
            </form>

            <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
              <p className="text-sm text-stone-500">
                <strong>How it works:</strong> Submit your sample request → We confirm availability & shipping cost →
                Pay sample fee → Samples shipped within 48h → Sample cost credited against your first bulk order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
