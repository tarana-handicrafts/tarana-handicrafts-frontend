"use client";

import { useMemo, useState } from "react";
import { productsData } from "@/lib/products";
import type { ProductSpecification } from "@/lib/products";

const CUSTOM_OPTION = "__custom__";
const categoryPresets = Array.from(new Set(productsData.map((p) => p.category))).sort();
const materialPresets = Array.from(new Set(productsData.map((p) => p.material))).sort();

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function parseFeatures(text: string): string[] {
  return text
    .split(/[\n,]+/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 30);
}

function parseSpecifications(text: string): ProductSpecification[] {
  // Accept lines like:
  // Material: Teak Wood
  // Weight = 1.5 kg
  return text
    .split(/\n+/g)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const sepIndex = line.indexOf(":");
      const sepIndexEq = line.indexOf("=");
      const useEq = sepIndexEq !== -1 && (sepIndex === -1 || sepIndexEq < sepIndex);
      const idx = useEq ? sepIndexEq : sepIndex;
      if (idx === -1) return null;
      const label = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (!label || !value) return null;
      return { label, value };
    })
    .filter((x): x is ProductSpecification => x !== null)
    .slice(0, 30);
}

export default function AdminProductForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [categoryChoice, setCategoryChoice] = useState<string>(categoryPresets[0] ?? CUSTOM_OPTION);
  const [customCategory, setCustomCategory] = useState("");
  const [materialChoice, setMaterialChoice] = useState<string>(materialPresets[0] ?? CUSTOM_OPTION);
  const [customMaterial, setCustomMaterial] = useState("");
  const [tag, setTag] = useState("");
  const [inStock, setInStock] = useState(true);
  const [stockCount, setStockCount] = useState<string>("");
  const [sku, setSku] = useState("");
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [rating, setRating] = useState<string>("");
  const [reviewCount, setReviewCount] = useState<string>("");
  const [featuresText, setFeaturesText] = useState("");
  const [specificationsText, setSpecificationsText] = useState("");
  const [imagesFiles, setImagesFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const finalCategory = categoryChoice === CUSTOM_OPTION ? customCategory : categoryChoice;
  const finalMaterial = materialChoice === CUSTOM_OPTION ? customMaterial : materialChoice;

  const imagePreviews = useMemo(
    () =>
      imagesFiles.slice(0, 8).map((f) => ({
        name: f.name,
        url: URL.createObjectURL(f),
      })),
    [imagesFiles]
  );

  const resetForm = () => {
    setName("");
    setPrice("");
    setOriginalPrice("");
    setCategoryChoice(categoryPresets[0] ?? CUSTOM_OPTION);
    setCustomCategory("");
    setMaterialChoice(materialPresets[0] ?? CUSTOM_OPTION);
    setCustomMaterial("");
    setTag("");
    setInStock(true);
    setStockCount("");
    setSku("");
    setWeight("");
    setDimensions("");
    setDescription("");
    setLongDescription("");
    setRating("");
    setReviewCount("");
    setFeaturesText("");
    setSpecificationsText("");
    setImagesFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(null);
    setIsSubmitting(true);

    try {
      if (!name.trim()) throw new Error("Product name is required");
      if (!finalCategory.trim()) throw new Error("Category is required");
      if (!finalMaterial.trim()) throw new Error("Material is required");
      const priceNum = Number(price);
      if (!Number.isFinite(priceNum) || priceNum < 0) throw new Error("Valid price is required");
      if (imagesFiles.length === 0) throw new Error("Please upload at least one image");

      const images = await Promise.all(imagesFiles.slice(0, 8).map(fileToDataUrl));

      const payload = {
        name,
        price: priceNum,
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        category: finalCategory,
        material: finalMaterial,
        description: description || undefined,
        longDescription: longDescription || undefined,
        tag: tag || undefined,
        inStock,
        stockCount: stockCount ? Number(stockCount) : undefined,
        sku: sku || undefined,
        weight: weight || undefined,
        dimensions: dimensions || undefined,
        rating: rating ? Number(rating) : undefined,
        reviewCount: reviewCount ? Number(reviewCount) : undefined,
        features: featuresText ? parseFeatures(featuresText) : undefined,
        specifications: specificationsText ? parseSpecifications(specificationsText) : undefined,
        images,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Failed to upload product");
      }

      setOk("Product uploaded successfully.");
      resetForm();

      // Send user back to products page to verify immediately.
      window.location.href = "/products";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      setIsLoggingOut(false);
      window.location.href = "/admin";
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] px-4 pt-32 pb-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-serif text-4xl text-stone-900">Admin - Upload Product</h1>
            <p className="mt-2 text-sm text-stone-500">
              Upload up to <span className="font-medium">8 images</span>, add details, and the new product will appear in{" "}
              <span className="font-medium">/products</span> immediately.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50 disabled:opacity-60"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {ok && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {ok}
            </div>
          )}

          <div className="rounded-xl border border-stone-100 bg-stone-50 p-4">
            <div className="mb-4">
              <h2 className="font-semibold text-stone-900">Product basics</h2>
              <p className="mt-1 text-xs text-stone-500">
                Core info used across product list + product detail.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-700">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-700">Tag (optional)</label>
              <input value={tag} onChange={(e) => setTag(e.target.value)} className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]" />
            </div>
          </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-700">Price</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-700">Original Price (optional)</label>
              <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-700">In stock</label>
              <select value={String(inStock)} onChange={(e) => setInStock(e.target.value === "true")} className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-700">Category</label>
              <select
                value={categoryChoice}
                onChange={(e) => setCategoryChoice(e.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]"
              >
                {categoryPresets.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value={CUSTOM_OPTION}>Custom</option>
              </select>
              {categoryChoice === CUSTOM_OPTION && (
                <input
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter category"
                  className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]"
                />
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-700">Material</label>
              <select
                value={materialChoice}
                onChange={(e) => setMaterialChoice(e.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]"
              >
                {materialPresets.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
                <option value={CUSTOM_OPTION}>Custom</option>
              </select>
              {materialChoice === CUSTOM_OPTION && (
                <input
                  value={customMaterial}
                  onChange={(e) => setCustomMaterial(e.target.value)}
                  placeholder="Enter material"
                  className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]"
                />
              )}
            </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-stone-700">Stock Count (optional)</label>
                <input
                  type="number"
                  value={stockCount}
                  onChange={(e) => setStockCount(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-stone-700">SKU (optional)</label>
                <input
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-stone-700">Rating (optional)</label>
                <input
                  type="number"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-700">Review Count (optional)</label>
              <input type="number" value={reviewCount} onChange={(e) => setReviewCount(e.target.value)} className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-700">Weight (optional)</label>
              <input value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-stone-700">Dimensions (optional)</label>
            <input value={dimensions} onChange={(e) => setDimensions(e.target.value)} className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Description (short)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Long Description (optional)</label>
            <textarea value={longDescription} onChange={(e) => setLongDescription(e.target.value)} rows={6} className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Features (optional)</label>
            <textarea
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              rows={4}
              placeholder="One per line or comma-separated"
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Specifications (optional)</label>
            <textarea
              value={specificationsText}
              onChange={(e) => setSpecificationsText(e.target.value)}
              rows={5}
              placeholder={`Example:\nMaterial: Teak Wood\nWeight = 1.5 kg`}
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-stone-700">Product Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []).slice(0, 8);
                setImagesFiles(files);
              }}
            />

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {imagePreviews.map((p) => (
                  <div key={p.name} className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50 p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={p.name} className="h-24 w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#C5A059] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#B8934E] disabled:opacity-60"
          >
            {isSubmitting ? "Uploading..." : "Upload Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

