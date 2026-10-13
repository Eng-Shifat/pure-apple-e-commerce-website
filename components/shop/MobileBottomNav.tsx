"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutGrid, Search, ShoppingCart, User, X, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const SUGGESTIONS = [
  "iPhone 16 Pro", "Samsung Galaxy S25", "OnePlus 13",
  "Charger", "Earbuds", "Power Bank", "Accessories",
];

export default function MobileBottomNav() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const accountHref = user ? "/orders" : "/login";
  const accountActive =
    pathname.startsWith("/orders") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  // Focus input when search overlay opens
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 80);
  }, [searchOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeSearch(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      closeSearch();
    }
  }

  const filtered = query.trim()
    ? SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : SUGGESTIONS;

  // Left 2, Search center, Right 2
  const LEFT_ITEMS = [
    { label: "Home",       href: "/",                        icon: Home,       match: (p: string) => p === "/" },
    { label: "Categories", href: "/products?view=categories", icon: LayoutGrid, match: (p: string) => p.startsWith("/products") && !p.includes("/products/") },
  ];
  const RIGHT_ITEMS = [
    { label: "Cart",    href: "/cart",      icon: ShoppingCart, match: (p: string) => p.startsWith("/cart") || p.startsWith("/checkout") },
    { label: "Account", href: accountHref,  icon: User,         match: () => accountActive },
  ];

  return (
    <>
      {/* ── Search Overlay ── */}
      {searchOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col">
          {/* Dim backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeSearch}
          />

          {/* Search panel slides up from bottom */}
          <div className="relative mt-auto bg-white rounded-t-3xl shadow-2xl px-4 pt-4 pb-8"
               style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}>

            {/* Handle */}
            <div className="mx-auto w-10 h-1 rounded-full bg-gray-200 mb-4" />

            {/* Input row */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-3">
                <Search size={16} className="text-brand-500 shrink-0" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="iPhone, Samsung, Accessories..."
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                />
                {query && (
                  <button type="button" onClick={() => setQuery("")}>
                    <X size={14} className="text-gray-400" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-brand-500 text-white rounded-2xl px-4 py-3 font-semibold text-sm active:scale-95 transition-transform"
              >
                Go
              </button>
            </form>

            {/* Suggestions */}
            <div className="mt-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                {query.trim() ? "Suggestions" : "Popular Searches"}
              </p>
              <ul className="space-y-0.5">
                {filtered.length > 0 ? filtered.map(s => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => { router.push(`/products?q=${encodeURIComponent(s)}`); closeSearch(); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-brand-50 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Search size={13} className="text-gray-300" />
                        <span className="text-sm text-gray-700 group-hover:text-brand-600">{s}</span>
                      </div>
                      <ArrowRight size={13} className="text-gray-300 group-hover:text-brand-400" />
                    </button>
                  </li>
                )) : (
                  <p className="text-sm text-gray-400 text-center py-4">No results for &ldquo;{query}&rdquo;</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Nav Bar ── */}
      <nav
        className="md:hidden fixed inset-x-0 bottom-0 z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="absolute inset-0 bg-white/85 backdrop-blur-2xl border-t border-gray-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.09)]" />

        <ul className="relative mx-auto flex max-w-md items-center justify-around px-1 h-16">

          {/* Left items */}
          {LEFT_ITEMS.map((it) => {
            const Icon = it.icon;
            const active = it.match(pathname);
            return (
              <li key={it.label} className="flex-1">
                <Link href={it.href}
                  className="relative flex flex-col items-center justify-center gap-0.5 py-2 w-full active:scale-90 transition-transform duration-150">
                  {active && <span className="absolute inset-x-1 inset-y-0.5 rounded-2xl bg-brand-500/10" />}
                  <span className="relative">
                    <Icon size={21} strokeWidth={active ? 2.3 : 1.7}
                      className={`transition-all duration-300 ${active ? "text-brand-500 -translate-y-px" : "text-gray-400"}`} />
                    {active && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500" />}
                  </span>
                  <span className={`relative text-[10px] font-medium tracking-wide transition-colors duration-300 ${active ? "text-brand-500 font-semibold" : "text-gray-400"}`}>
                    {it.label}
                  </span>
                </Link>
              </li>
            );
          })}

          {/* ── Center Search Button (prominent, like apps) ── */}
          <li className="flex-none px-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="relative flex flex-col items-center justify-center active:scale-90 transition-transform duration-150"
            >
              {/* Elevated circle */}
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-500 shadow-lg shadow-brand-500/40 -mt-5">
                <Search size={22} strokeWidth={2} className="text-white" />
              </span>
              <span className="text-[10px] font-medium tracking-wide text-gray-400 mt-0.5">Search</span>
            </button>
          </li>

          {/* Right items */}
          {RIGHT_ITEMS.map((it) => {
            const Icon = it.icon;
            const active = it.match(pathname);
            return (
              <li key={it.label} className="flex-1">
                <Link href={it.href}
                  className="relative flex flex-col items-center justify-center gap-0.5 py-2 w-full active:scale-90 transition-transform duration-150">
                  {active && <span className="absolute inset-x-1 inset-y-0.5 rounded-2xl bg-brand-500/10" />}
                  <span className="relative">
                    <Icon size={21} strokeWidth={active ? 2.3 : 1.7}
                      className={`transition-all duration-300 ${active ? "text-brand-500 -translate-y-px" : "text-gray-400"}`} />
                    {active && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500" />}
                  </span>
                  <span className={`relative text-[10px] font-medium tracking-wide transition-colors duration-300 ${active ? "text-brand-500 font-semibold" : "text-gray-400"}`}>
                    {it.label}
                  </span>
                </Link>
              </li>
            );
          })}

        </ul>
      </nav>
    </>
  );
}
