import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, Inbox, Star, LogOut, ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/adminAuth";
import { logout } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
];

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-stone-100 md:flex">
      <aside className="border-b border-stone-200 bg-white md:min-h-screen md:w-56 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-4 md:block">
          <p className="font-serif text-lg text-[#8B4513]">Tarana Admin</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-stone-700 hover:bg-stone-100">
              <Icon className="h-4 w-4 text-[#8B4513]" />
              {label}
            </Link>
          ))}
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-stone-700 hover:bg-stone-100">
            <ExternalLink className="h-4 w-4 text-[#8B4513]" />
            View site
          </Link>
          <form action={logout}>
            <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-stone-700 hover:bg-stone-100">
              <LogOut className="h-4 w-4 text-[#8B4513]" />
              Log out
            </button>
          </form>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
