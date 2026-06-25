"use client";

import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Upload,
  Activity,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  FolderTree,
  Lightbulb,
  Inbox,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/use-cases", label: "Use Cases", icon: Lightbulb },
  { href: "/admin/rfq", label: "Quote Requests", icon: Inbox },
  { href: "/admin/upload", label: "Bulk Upload", icon: Upload },
  { href: "/admin/activity", label: "Activity Logs", icon: Activity },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Login page doesn't need sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FDFBF7]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-stone-300 border-t-[#8B4513]" />
          <p className="text-sm text-stone-500">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (typeof window !== "undefined") {
      router.push("/admin/login");
    }
    return null;
  }

  return (
    <div className="flex h-screen bg-stone-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-stone-900 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-stone-700 px-5">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <Shield className="h-6 w-6 text-[#C5A059]" />
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.15em] text-white">
                Tarana
              </span>
              <span className="ml-1 text-[9px] font-medium uppercase tracking-wider text-stone-400">
                Admin
              </span>
            </div>
          </Link>
          <button
            className="rounded-lg p-1 text-stone-400 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#8B4513] text-white shadow-md"
                    : "text-stone-300 hover:bg-stone-800 hover:text-white"
                }`}
              >
                <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                {link.label}
                {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="border-t border-stone-700 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C5A059] text-sm font-bold text-stone-900">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user?.name}</p>
              <p className="truncate text-xs text-stone-400">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/admin/login");
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-400 transition-colors hover:bg-stone-800 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 shadow-sm lg:px-6">
          <button
            className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-sm font-semibold text-stone-700">
              {sidebarLinks.find(
                (l) => pathname === l.href || pathname.startsWith(l.href + "/")
              )?.label || "Admin Panel"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-medium text-stone-500 transition-colors hover:text-[#8B4513]"
            >
              View Store →
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main id="main-content" className="flex-1 overflow-y-auto bg-stone-50 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}
