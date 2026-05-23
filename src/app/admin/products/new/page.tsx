"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProduct, fetchCategories, uploadProductImages, fetchAllCategories, Category } from "@/lib/adminApi";
import { ArrowLeft, Upload, X, Save } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", longDescription: "", category: "", categoryId: "", material: "",
    sku: "", price: "", originalPrice: "", stockCount: "0", inStock: true,
    image: "", dimensions: "", weight: "", rating: "0", reviewCount: "0",
    tags: "", tag: "", status: "active" as const,
    isFeatured: false, isTopSeller: false,
    seo: { metaTitle: "", metaDescription: "", keywords: "" },
  });
  const [images, setImages] = useState<{ url: string; alt: string }[]>([]);

  useEffect(() => {
    fetchCategories().then((d) => { setCategories(d.categories); setMaterials(d.materials); }).catch(() => {});
    fetchAllCategories().then((d) => setAllCategories(d.categories)).catch(() => {});
  }, []);

  const set = (field: string, value: string | boolean) => setForm((f) => ({ ...f, [field]: value }));
  const setSeo = (field: string, value: string) => setForm((f) => ({ ...f, seo: { ...f.seo, [field]: value } }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploadingImages(true);
    try {
      const result = await uploadProductImages(e.target.files);
      setImages((prev) => [...prev, ...result.images]);
      if (!form.image && result.images.length > 0) set("image", result.images[0].url);
    } catch {
      setError("Image upload failed");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (idx: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      if (form.image === prev[idx]?.url && updated.length > 0) set("image", updated[0].url);
      else if (updated.length === 0) set("image", "");
      return updated;
    });
  };

  const discount = form.originalPrice && form.price && Number(form.originalPrice) > Number(form.price)
    ? Math.round(((Number(form.originalPrice) - Number(form.price)) / Number(form.originalPrice)) * 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        name: form.name, description: form.description, longDescription: form.longDescription,
        category: form.category, categoryId: form.categoryId || undefined, material: form.material, sku: form.sku || undefined,
        price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stockCount: Number(form.stockCount), inStock: form.inStock,
        image: form.image, images, dimensions: form.dimensions, weight: form.weight,
        rating: Number(form.rating), reviewCount: Number(form.reviewCount),
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        tag: form.tag, status: form.status as "active" | "draft" | "archived",
        isFeatured: form.isFeatured, isTopSeller: form.isTopSeller,
        seo: {
          metaTitle: form.seo.metaTitle, metaDescription: form.seo.metaDescription,
          keywords: form.seo.keywords ? form.seo.keywords.split(",").map((k) => k.trim()).filter(Boolean) : [],
        },
      };
      await createProduct(payload);
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="rounded-lg p-2 text-stone-500 hover:bg-stone-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-stone-800">Add New Product</h1>
          <p className="text-sm text-stone-500">Fill in the product details</p>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-stone-800">Basic Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-stone-700">Name *</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} required maxLength={200} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-stone-700">Description</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} maxLength={1000} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-stone-700">Long Description</label>
              <textarea value={form.longDescription} onChange={(e) => set("longDescription", e.target.value)} rows={5} maxLength={5000} placeholder="Detailed product description for the product page..." className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
              <p className="mt-0.5 text-xs text-stone-400">{form.longDescription.length}/5000</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Category *</label>
              <input list="categories" value={form.category} onChange={(e) => set("category", e.target.value)} required className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
              <datalist id="categories">{categories.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Category (Hierarchy)</label>
              <select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none">
                <option value="">Select from tree...</option>
                {allCategories.map((c) => <option key={c._id} value={c._id}>{"— ".repeat(c.level)}{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Material</label>
              <input list="materials" value={form.material} onChange={(e) => set("material", e.target.value)} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
              <datalist id="materials">{materials.map((m) => <option key={m} value={m} />)}</datalist>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">SKU</label>
              <input value={form.sku} onChange={(e) => set("sku", e.target.value)} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm uppercase focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isTopSeller} onChange={(e) => set("isTopSeller", e.target.checked)} className="h-4 w-4 rounded border-stone-300" />
                <span className="text-sm font-medium text-stone-700">⭐ Top Seller</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} className="h-4 w-4 rounded border-stone-300" />
                <span className="text-sm font-medium text-stone-700">✨ Featured</span>
              </label>
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-stone-800">Pricing & Inventory</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Price (INR) *</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} required className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Original Price</label>
              <input type="number" min="0" step="0.01" value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Discount</label>
              <div className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-600">{discount}%</div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Stock Count</label>
              <input type="number" min="0" value={form.stockCount} onChange={(e) => set("stockCount", e.target.value)} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Dimensions</label>
              <input value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} placeholder="e.g. 12 x 8 x 4 inches" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Weight</label>
              <input value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="e.g. 1.5 kg" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input type="checkbox" id="inStock" checked={form.inStock} onChange={(e) => set("inStock", e.target.checked)} className="rounded border-stone-300" />
            <label htmlFor="inStock" className="text-sm text-stone-600">In Stock</label>
          </div>
        </div>

        {/* Images */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-stone-800">Images</h3>
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-stone-200">
                <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <X className="h-3 w-3" />
                </button>
                {form.image === img.url && <div className="absolute inset-x-0 bottom-0 bg-[#8B4513] py-0.5 text-center text-[8px] font-bold text-white">MAIN</div>}
              </div>
            ))}
            <label className={`flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-300 text-stone-400 hover:border-[#8B4513] hover:text-[#8B4513] ${uploadingImages ? "opacity-50" : ""}`}>
              <Upload className="h-5 w-5" />
              <span className="text-[9px]">Upload</span>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploadingImages} className="hidden" />
            </label>
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-sm font-medium text-stone-700">Or enter image URL</label>
            <input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..." className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
          </div>
        </div>

        {/* Tags & SEO */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-stone-800">Tags & SEO</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Tags (comma separated)</label>
              <input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="handicraft, wooden, elephant" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Badge Tag</label>
              <input value={form.tag} onChange={(e) => set("tag", e.target.value)} placeholder="e.g. Best Seller" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">SEO Title</label>
              <input value={form.seo.metaTitle} onChange={(e) => setSeo("metaTitle", e.target.value)} maxLength={70} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
              <p className="mt-0.5 text-xs text-stone-400">{form.seo.metaTitle.length}/70</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">SEO Description</label>
              <input value={form.seo.metaDescription} onChange={(e) => setSeo("metaDescription", e.target.value)} maxLength={160} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
              <p className="mt-0.5 text-xs text-stone-400">{form.seo.metaDescription.length}/160</p>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-stone-700">SEO Keywords (comma separated)</label>
              <input value={form.seo.keywords} onChange={(e) => setSeo("keywords", e.target.value)} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/products" className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50">Cancel</Link>
          <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#8B4513] disabled:opacity-50">
            <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
