"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, verifyAdminOnServer, recentlyVerifiedAdmin } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard, Package, ShoppingBag, BarChart3,
  LogOut, ChevronRight, ExternalLink, FolderOpen, Flame,
} from "lucide-react";

const NAV = [
  { label: "Dashboard",  href: "/admin",            icon: LayoutDashboard },
  { label: "Products",   href: "/admin/products",   icon: Package         },
  { label: "Orders",     href: "/admin/orders",     icon: ShoppingBag     },
  { label: "Offers",     href: "/admin/offers",     icon: Flame           },
  { label: "Categories", href: "/admin/categories", icon: FolderOpen      },
  { label: "Inventory",  href: "/admin/inventory",  icon: BarChart3       },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router      = useRouter();
  const pathname    = usePathname();
  const user        = useAuthStore(s => s.user);
  const hasHydrated = useAuthStore(s => s._hasHydrated);
  const logout      = useAuthStore(s => s.logout);

  // server-verified admin: null = যাচাই চলছে, true/false = ফলাফল, "error" = network সমস্যা
  const [verified, setVerified] = useState<boolean | "error" | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user) { router.replace("/login"); return; }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) { if (!cancelled) { setVerified(false); router.replace("/login"); } return; }

        // এইমাত্র login-এ server যাচাই হয়ে থাকলে আবার অপেক্ষা করার দরকার নেই
        if (user.role === "admin" && recentlyVerifiedAdmin()) { if (!cancelled) setVerified(true); return; }

        const ok = await verifyAdminOnServer(token, 10000);
        if (cancelled) return;
        setVerified(ok);
        if (!ok) router.replace("/");
      } catch {
        if (!cancelled) setVerified("error"); // slow/offline — redirect না করে Retry দেখাও
      }
    })();
    return () => { cancelled = true; };
  }, [user, hasHydrated, router, attempt]);

  if (verified === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-sm text-gray-600">Couldn&apos;t verify your admin session (slow connection).</p>
        <button onClick={() => { setVerified(null); setAttempt((n) => n + 1); }}
          className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold">
          Retry
        </button>
      </div>
    );
  }

  if (!hasHydrated || !user || verified !== true) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <aside className="w-60 shrink-0 h-screen sticky top-0 bg-white border-r border-gray-100 flex flex-col overflow-y-auto">
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-orange-500">Pure Apple</span>
          </Link>
          <p className="text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-wider">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link key={href} href={href}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                <span className="flex items-center gap-3">
                  <Icon size={16} className={active ? "text-orange-500" : "text-gray-400"} />
                  {label}
                </span>
                {active && <ChevronRight size={14} className="text-orange-400" />}
              </Link>
            );
          })}
        </nav>
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
          <button onClick={async () => { await logout(); router.push("/login"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-y-auto h-screen">{children}</main>
    </div>
  );
}
