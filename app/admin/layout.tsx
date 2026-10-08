"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard, Package, ShoppingBag, BarChart3,
  LogOut, ChevronRight, ExternalLink,
} from "lucide-react";

const NAV = [
  { label: "Dashboard",  href: "/admin",            icon: LayoutDashboard },
  { label: "Products",   href: "/admin/products",   icon: Package         },
  { label: "Orders",     href: "/admin/orders",     icon: ShoppingBag     },
  { label: "Inventory",  href: "/admin/inventory",  icon: BarChart3       },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const user     = useAuthStore(s => s.user);
  const logout   = useAuthStore(s => s.logout);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "admin") { router.push("/"); }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-60 shrink-0 min-h-screen bg-white border-r border-gray-100 flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-orange-500">Pure Apple</span>
          </Link>
          <p className="text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-wider">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link key={href} href={href}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                <span className="flex items-center gap-3">
                  <Icon size={16} className={active ? "text-orange-500" : "text-gray-400"} />
                  {label}
                </span>
                {active && <ChevronRight size={14} className="text-orange-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-1">
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
            <ExternalLink size={15} className="text-gray-400" />
            View Store
          </Link>
          <div className="px-3 py-2 rounded-xl bg-gray-50">
            <p className="text-xs font-semibold text-gray-800 truncate">{user.name}</p>
            <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
          </div>
          <button onClick={() => { logout(); router.push("/login"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
