"use client";

import { useState } from "react";

export default function AdminLoginForm() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Login failed");
        return;
      }

      // Cookie is set server-side; reload to let /admin server gate render the form.
      window.location.reload();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] px-4 py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-[#C5A059]/15 ring-1 ring-[#C5A059]/20 flex items-center justify-center">
            <span className="font-serif text-[#C5A059] text-2xl font-bold">T</span>
          </div>
          <h1 className="mt-4 font-serif text-4xl text-stone-900">Admin</h1>
          <p className="mt-2 text-sm text-stone-500">
            Sign in to upload new products.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-center font-semibold text-stone-900">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-700">Username</label>
              <input
                className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-700">Password</label>
              <input
                type="password"
                className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C5A059]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[#C5A059] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#B8934E] disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-stone-500">
            Demo credentials are hardcoded for development.
          </p>
        </div>
      </div>
    </div>
  );
}

