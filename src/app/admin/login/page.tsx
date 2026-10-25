import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminAuth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 font-serif text-2xl">Tarana Admin</h1>
        <p className="mb-6 text-sm text-stone-500">Enquiries, orders &amp; reviews</p>
        <LoginForm />
      </div>
    </div>
  );
}
