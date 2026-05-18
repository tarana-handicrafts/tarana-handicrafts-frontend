"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Shield, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAdminAuth();
  const router = useRouter();

  if (isAuthenticated) {
    router.push("/admin/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-100 via-[#FDFBF7] to-stone-100 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-900 shadow-xl">
            <Shield className="h-8 w-8 text-[#C5A059]" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-wide text-stone-900">TARANA</h1>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.3em] text-stone-500">Admin Panel</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-lg">
          <h2 className="mb-1 text-lg font-semibold text-stone-800">Welcome back</h2>
          <p className="mb-6 text-sm text-stone-500">Sign in to manage your store</p>
          {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="admin@taranahandicrafts.com" className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" placeholder="Enter password" className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 pr-10 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/50 disabled:opacity-50">
              {isLoading ? <span className="flex items-center justify-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Signing in...</span> : "Sign In"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-stone-400">Tarana Handicrafts &middot; Secure Access Only</p>
      </div>
    </div>
  );
}
