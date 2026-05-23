"use client";

import { useEffect, useState } from "react";
import { fetchDashboardStats, type DashboardStats } from "@/lib/adminApi";
import { formatPrice } from "@/lib/utils";
import { Package, TrendingUp, AlertTriangle, Archive, BarChart3, Star, DollarSign, Layers } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#8B4513", "#C5A059", "#A0522D", "#D4A574", "#654321", "#B8860B", "#CD853F", "#DEB887"];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-300 border-t-[#8B4513]" />
      </div>
    );
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  }

  if (!stats) return null;

  const { overview, categoryStats, recentProducts, recentActivity, lowStockProducts, topRatedProducts } = stats;

  const statCards = [
    { label: "Total Products", value: overview.totalProducts, icon: Package, color: "bg-blue-50 text-blue-700" },
    { label: "Active", value: overview.activeProducts, icon: TrendingUp, color: "bg-green-50 text-green-700" },
    { label: "Draft", value: overview.draftProducts, icon: Archive, color: "bg-amber-50 text-amber-700" },
    { label: "Out of Stock", value: overview.outOfStockCount, icon: AlertTriangle, color: "bg-red-50 text-red-700" },
    { label: "Inventory Value", value: formatPrice(overview.totalInventoryValue), icon: DollarSign, color: "bg-emerald-50 text-emerald-700" },
    { label: "Est. Revenue", value: formatPrice(overview.totalRevenue), icon: BarChart3, color: "bg-purple-50 text-purple-700" },
    { label: "Est. Profit", value: formatPrice(overview.estimatedProfit), icon: TrendingUp, color: "bg-teal-50 text-teal-700" },
    { label: "Total Stock", value: overview.totalStock, icon: Layers, color: "bg-indigo-50 text-indigo-700" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-stone-800">Dashboard</h1>
        <p className="text-sm text-stone-500">Overview of your store analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs text-stone-500">{card.label}</p>
                  <p className="text-lg font-bold text-stone-800">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Distribution Bar Chart */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-stone-800">Products by Category</h3>
          {categoryStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryStats.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="_id" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="count" fill="#8B4513" radius={[4, 4, 0, 0]} name="Products" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-10 text-center text-sm text-stone-400">No category data</p>
          )}
        </div>

        {/* Category Pie Chart */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-stone-800">Category Value Distribution</h3>
          {categoryStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryStats.slice(0, 8)} dataKey="totalValue" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }: { name?: string; percent?: number }) => `${name || ""} ${((percent || 0) * 100).toFixed(0)}%`} labelLine={false}>
                  {categoryStats.slice(0, 8).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatPrice(Number(v))} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-10 text-center text-sm text-stone-400">No data</p>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Products */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-stone-800">Recent Products</h3>
          <div className="space-y-3">
            {recentProducts.map((p) => (
              <div key={p._id} className="flex items-center gap-3">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
                  {p.image ? <img src={p.image} alt={p.name} className="h-full w-full object-cover" /> : <Package className="m-2 h-6 w-6 text-stone-400" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-stone-700">{p.name}</p>
                  <p className="text-xs text-stone-400">{p.category} &middot; {formatPrice(p.price)}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${p.status === "active" ? "bg-green-100 text-green-700" : p.status === "draft" ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-600"}`}>
                  {p.status}
                </span>
              </div>
            ))}
            {recentProducts.length === 0 && <p className="text-sm text-stone-400">No products yet</p>}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-800">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Low Stock Alerts
          </h3>
          <div className="space-y-3">
            {lowStockProducts.map((p) => (
              <div key={p._id} className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-stone-700">{p.name}</p>
                  <p className="text-xs text-stone-400">{p.sku || "No SKU"}</p>
                </div>
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">{p.stockCount} left</span>
              </div>
            ))}
            {lowStockProducts.length === 0 && <p className="text-sm text-stone-400">All stock levels healthy</p>}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-stone-800">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.slice(0, 6).map((a) => (
              <div key={a._id} className="flex items-start gap-3">
                <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${a.action === "CREATE" ? "bg-green-500" : a.action === "DELETE" ? "bg-red-500" : a.action === "UPDATE" ? "bg-blue-500" : "bg-amber-500"}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-stone-700">{a.details}</p>
                  <p className="text-xs text-stone-400">{a.userName} &middot; {new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && <p className="text-sm text-stone-400">No activity yet</p>}
          </div>
        </div>
      </div>

      {/* Top Rated Products */}
      {topRatedProducts.length > 0 && (
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-800">
            <Star className="h-4 w-4 text-[#C5A059]" /> Top Rated Products
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {topRatedProducts.map((p) => (
              <div key={p._id} className="flex items-center gap-3 rounded-lg border border-stone-100 p-3">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
                  {p.image ? <img src={p.image} alt={p.name} className="h-full w-full object-cover" /> : <Package className="m-2 h-6 w-6 text-stone-400" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-stone-700">{p.name}</p>
                  <p className="text-xs text-stone-400">{p.rating?.toFixed(1)} stars &middot; {p.reviewCount} reviews</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
