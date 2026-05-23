"use client";

import { useState, useEffect } from "react";
import {
  fetchAllUseCases,
  createUseCase,
  updateUseCase,
  deleteUseCase,
  fetchProducts,
  UseCaseAdmin,
  Product,
} from "@/lib/adminApi";
import ImageUploadField from "@/components/ui/ImageUploadField";

export default function UseCasesPage() {
  const [useCases, setUseCases] = useState<UseCaseAdmin[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    products: [] as string[],
    sortOrder: 0,
    isActive: true,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [ucData, prodData] = await Promise.all([
        fetchAllUseCases(),
        fetchProducts({ limit: 100, status: "active" }),
      ]);
      setUseCases(ucData.useCases);
      setAllProducts(prodData.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({ title: "", description: "", image: "", products: [], sortOrder: 0, isActive: true });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (uc: UseCaseAdmin) => {
    setFormData({
      title: uc.title,
      description: uc.description || "",
      image: uc.image || "",
      products: uc.products.map(p => p._id),
      sortOrder: uc.sortOrder,
      isActive: uc.isActive,
    });
    setEditingId(uc._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await updateUseCase(editingId, formData);
        setSuccess("Use case updated successfully");
      } else {
        await createUseCase(formData);
        setSuccess("Use case created successfully");
      }
      resetForm();
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setError("");
    try {
      await deleteUseCase(id);
      setSuccess("Use case deleted successfully");
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete use case");
    }
  };

  const toggleProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(productId)
        ? prev.products.filter(id => id !== productId)
        : [...prev.products, productId]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Use Cases</h1>
          <p className="text-gray-500">Manage inspiration galleries with linked products</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Use Case
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
          <button onClick={() => setError("")} className="ml-2 font-bold">&times;</button>
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-green-700">
          {success}
          <button onClick={() => setSuccess("")} className="ml-2 font-bold">&times;</button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            {editingId ? "Edit Use Case" : "New Use Case"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <ImageUploadField
                  label="Image"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            {/* Product multi-select */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Linked Products ({formData.products.length} selected)
              </label>
              <div className="max-h-48 overflow-y-auto rounded-lg border p-2">
                {allProducts.map((p) => (
                  <label key={p._id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.products.includes(p._id)}
                      onChange={() => toggleProduct(p._id)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{p.name}</span>
                    <span className="ml-auto text-xs text-gray-400">{p.category}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Sort Order</label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="ucActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                <label htmlFor="ucActive" className="text-sm font-medium text-gray-700">Active</label>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                {editingId ? "Update" : "Create"}
              </button>
              <button type="button" onClick={resetForm} className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Use Cases List */}
      <div className="grid gap-4">
        {useCases.length === 0 ? (
          <div className="rounded-lg border bg-white py-12 text-center text-gray-500">
            No use cases yet. Create your first use case.
          </div>
        ) : (
          useCases.map((uc) => (
            <div key={uc._id} className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
              <div>
                <h3 className="font-semibold text-gray-900">{uc.title}</h3>
                <p className="text-sm text-gray-500">{uc.description?.slice(0, 100)}{uc.description && uc.description.length > 100 ? '...' : ''}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                  <span>{uc.products.length} products linked</span>
                  <span>•</span>
                  <span className={uc.isActive ? "text-green-600" : "text-gray-500"}>
                    {uc.isActive ? "Active" : "Inactive"}
                  </span>
                  <span>•</span>
                  <span>Order: {uc.sortOrder}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(uc)} className="rounded-lg border px-3 py-1 text-sm text-blue-600 hover:bg-blue-50">Edit</button>
                <button onClick={() => handleDelete(uc._id, uc.title)} className="rounded-lg border px-3 py-1 text-sm text-red-600 hover:bg-red-50">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

