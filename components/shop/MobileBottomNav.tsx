"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, ShoppingCart, User } from "lucide-react";

const items = [
  { label: "Home", href: "/", icon: Home, match: (p: string) => p === "/" },
  { label: "Categories", href: "/products?view=categories", icon: LayoutGrid, match: (p: string) => p.startsWith("/products") },
  { label: "Search", href: "/products", icon: Search, match: () => false },
  { label: "Cart", href: "/cart", icon: ShoppingCart, match: (p: string) => p.startsWith("/cart") || p.startsWith("/checkout") },
  { label: "Account", href: "/login", icon: User, match: (p: string) => p.startsWith("/login") || p.startsWith("/register") || p.startsWith("/orders") },
];

/** App-style fixed bottom tab bar – mobile only. */
export default function MobileBottomNav() {
  const pathname = usePathname() || "/";

  return (
    <nav
      className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-gray-100 bg-white/90 backdrop-blur-xl shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.18)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {items.map((it) => {
          const Icon = it.icon;
          const active = it.match(pathname);
          return (
            <li key={it.label} className="flex-1">
              <Link
                href={it.href}
                className={`relative flex flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-medium transition-colors duration-300 active:scale-95 ${
                  active ? "text-blue-600" : "text-gray-500"
                }`}
              >
                <span
                  className={`absolute top-0 h-[3px] rounded-b-full bg-blue-600 transition-all duration-300 ${
                    active ? "w-8 opacity-100" : "w-0 opacity-0"
                  }`}
                />
                <Icon
                  size={22}
                  strokeWidth={active ? 2.2 : 1.8}
                  className={`transition-transform duration-300 ${active ? "-translate-y-0.5" : ""}`}
                />
                <span className={active ? "font-semibold" : ""}>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
