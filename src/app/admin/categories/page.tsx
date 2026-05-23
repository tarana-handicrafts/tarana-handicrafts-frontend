"use client";

import { useState, useEffect } from "react";
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category,
  CategoryInput,
} from "@/lib/adminApi";
import ImageUploadField from "@/components/ui/ImageUploadField";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    parent: "",
    sortOrder: 0,
    isActive: true,
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchAllCategories();
      setCategories(data.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", description: "", image: "", parent: "", sortOrder: 0, isActive: true });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
      parent: category.parent?._id || "",
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
    setEditingId(category._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        parent: formData.parent || null,
        sortOrder: formData.sortOrder,
        isActive: formData.isActive,
      };
      if (editingId) {
        await updateCategory(editingId, payload);
        setSuccess("Category updated successfully");
      } else {
        await createCategory(payload);
        setSuccess("Category created successfully");
      }
      resetForm();
      loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    setError("");
    try {
      await deleteCategory(id);
      setSuccess("Category deleted successfully");
      loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category");
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500">Manage product categories with nested hierarchy</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Category
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
            {editingId ? "Edit Category" : "New Category"}
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Parent Category</label>
              <select
                value={formData.parent}
                onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="">None (Root Category)</option>
                {categories
                  .filter(c => c._id !== editingId)
                  .map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {"— ".repeat(cat.level)}{cat.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
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
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Sort Order</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
            </div>
            <div className="flex gap-2 sm:col-span-2">
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

      {/* Categories Table */}
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Parent</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No categories yet. Create your first category.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    {"— ".repeat(cat.level)}{cat.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {cat.parent?.name || "—"}
                  </td>
                  <td className="px-4 py-3">{cat.level}</td>
                  <td className="px-4 py-3">{cat.productCount || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${cat.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(cat._id, cat.name)} className="text-red-600 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

