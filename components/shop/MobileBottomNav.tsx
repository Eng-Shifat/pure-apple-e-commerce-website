"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, ShoppingCart, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const NAV_ITEMS = [
  { label: "Home",       href: "/",                         icon: Home,         match: (p: string) => p === "/" },
  { label: "Categories", href: "/products?view=categories",  icon: LayoutGrid,   match: (p: string) => p.startsWith("/products") },
  { label: "Search",     href: "/products",                  icon: Search,       match: () => false },
  { label: "Cart",       href: "/cart",                      icon: ShoppingCart, match: (p: string) => p.startsWith("/cart") || p.startsWith("/checkout") },
];

export default function MobileBottomNav() {
  const pathname = usePathname() || "/";
  const user = useAuthStore((s) => s.user);

  // Account tab: go to orders if logged in, else login
  const accountHref = user ? "/orders" : "/login";
  const accountActive =
    pathname.startsWith("/orders") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  const allItems = [
    ...NAV_ITEMS,
    { label: "Account", href: accountHref, icon: User, match: () => accountActive },
  ];

  return (
    <nav
      className="md:hidden fixed inset-x-0 bottom-0 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-white/85 backdrop-blur-2xl border-t border-gray-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.09)]" />

      <ul className="relative mx-auto flex max-w-md items-center justify-around px-1 h-16">
        {allItems.map((it) => {
          const Icon = it.icon;
          const active = it.match(pathname);

          return (
            <li key={it.label} className="flex-1">
              <Link
                href={it.href}
                className="relative flex flex-col items-center justify-center gap-0.5 py-2 w-full active:scale-90 transition-transform duration-150"
              >
                {/* Pill background on active */}
                {active && (
                  <span className="absolute inset-x-1 inset-y-0.5 rounded-2xl bg-brand-500/10" />
                )}

                {/* Icon */}
                <span className="relative">
                  <Icon
                    size={21}
                    strokeWidth={active ? 2.3 : 1.7}
                    className={`transition-all duration-300 ${
                      active ? "text-brand-500 -translate-y-px" : "text-gray-400"
                    }`}
                  />
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500" />
                  )}
                </span>

                {/* Label */}
                <span
                  className={`relative text-[10px] font-medium tracking-wide transition-colors duration-300 ${
                    active ? "text-brand-500 font-semibold" : "text-gray-400"
                  }`}
                >
                  {it.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
