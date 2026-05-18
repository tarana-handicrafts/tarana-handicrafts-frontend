"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchProducts, deleteProduct, bulkDeleteProducts, fetchCategories, getExportUrl, type Product, type ProductFilters } from "@/lib/adminApi";
import { formatPrice } from "@/lib/utils";
import { Plus, Search, Trash2, Edit, Download, ChevronLeft, ChevronRight, Filter, Package } from "lucide-react";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, limit: 15, sortBy: "createdAt", sortOrder: "desc" });
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProducts(filters);
      setProducts(data.products);
      setPagination(data.pagination);
      setSelected(new Set());
    } catch {
      // error handled silently
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => { fetchCategories().then((d) => setCategories(d.categories)).catch(() => {}); }, []);

  const handleSearch = () => {
    setFilters((f) => ({ ...f, search: searchInput, page: 1 }));
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      setSuccessMsg(`"${name}" deleted successfully`);
      setTimeout(() => setSuccessMsg(""), 3000);
      loadProducts();
    } catch {
      alert("Delete failed");
    }
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} products?`)) return;
    try {
      const result = await bulkDeleteProducts(Array.from(selected));
      setSuccessMsg(`${result.deletedCount} products deleted successfully`);
      setTimeout(() => setSuccessMsg(""), 3000);
      loadProducts();
    } catch {
      alert("Bulk delete failed");
    }
  };

  const handleExport = () => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      const link = document.createElement("a");
      link.href = getExportUrl();
      fetch(getExportUrl(), { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          link.href = url;
          link.download = `products-${Date.now()}.xlsx`;
          link.click();
          URL.revokeObjectURL(url);
        });
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === products.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(products.map((p) => p._id)));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Products</h1>
          <p className="text-sm text-stone-500">{pagination.total} total products</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <Link href="/admin/products/new" className="flex items-center gap-1.5 rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-[#8B4513]">
            <Plus className="h-3.5 w-3.5" /> Add Product
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}

      {/* Success Toast */}
      {successMsg && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">
          ✓ {successMsg}
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="Search products..." className="w-full rounded-lg border border-stone-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50">
          <Filter className="h-3.5 w-3.5" /> Filters
        </button>
        <button onClick={handleSearch} className="rounded-lg bg-[#8B4513] px-4 py-2 text-xs font-semibold text-white hover:bg-[#654321]">Search</button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="grid gap-3 rounded-lg border border-stone-200 bg-white p-4 sm:grid-cols-4">
          <select value={filters.category || ""} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value, page: 1 }))} className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filters.status || ""} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))} className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <select value={filters.inStock || ""} onChange={(e) => setFilters((f) => ({ ...f, inStock: e.target.value, page: 1 }))} className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none">
            <option value="">All Stock</option>
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>
          <select value={filters.sortBy || "createdAt"} onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value }))} className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none">
            <option value="createdAt">Newest First</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
            <option value="stockCount">Stock</option>
          </select>
        </div>
      )}

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2">
          <span className="text-sm font-medium text-amber-800">{selected.size} selected</span>
          <button onClick={handleBulkDelete} className="flex items-center gap-1 rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700">
            <Trash2 className="h-3 w-3" /> Delete
          </button>
          <button onClick={() => setSelected(new Set())} className="text-xs text-amber-600 hover:underline">Clear</button>
        </div>
      )}

      {/* Product Table */}
      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50">
            <tr>
              <th className="px-4 py-3"><input type="checkbox" checked={selected.size === products.length && products.length > 0} onChange={toggleAll} className="rounded border-stone-300" /></th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Product</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">SKU</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Price</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Stock</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Status</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr><td colSpan={7} className="py-10 text-center text-sm text-stone-400">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7} className="py-10 text-center text-sm text-stone-400">No products found</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="hover:bg-stone-50">
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.has(p._id)} onChange={() => toggleSelect(p._id)} className="rounded border-stone-300" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
                        {p.image ? <img src={p.image} alt={p.name} className="h-full w-full object-cover" /> : <Package className="m-2 h-6 w-6 text-stone-400" />}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-stone-800">{p.name}</p>
                        <p className="truncate text-xs text-stone-400">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-600">{p.sku || "-"}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-stone-800">{formatPrice(p.price)}</span>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <span className="ml-1.5 text-xs text-stone-400 line-through">{formatPrice(p.originalPrice)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${p.stockCount <= 5 && p.stockCount > 0 ? "text-amber-600" : p.stockCount <= 0 ? "text-red-600" : "text-stone-700"}`}>{p.stockCount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${p.status === "active" ? "bg-green-100 text-green-700" : p.status === "draft" ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-600"}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => router.push(`/admin/products/${p._id}/edit`)} className="rounded p-1.5 text-stone-500 hover:bg-stone-100 hover:text-[#8B4513]"><Edit className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleDelete(p._id, p.name)} className="rounded p-1.5 text-stone-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-stone-500">
            Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </p>
          <div className="flex gap-1">
            <button disabled={pagination.page <= 1} onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))} className="rounded-lg border border-stone-300 p-2 text-stone-600 hover:bg-stone-50 disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="flex items-center px-3 text-sm font-medium text-stone-700">{pagination.page} / {pagination.pages}</span>
            <button disabled={pagination.page >= pagination.pages} onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))} className="rounded-lg border border-stone-300 p-2 text-stone-600 hover:bg-stone-50 disabled:opacity-40">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
