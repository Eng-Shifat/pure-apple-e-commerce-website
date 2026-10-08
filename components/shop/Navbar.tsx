"use client";

import Link from "next/link";
import ShineLogo from "./ShineLogo";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, Heart, ShoppingCart, User, ChevronDown, ChevronRight, Menu, X,
  Home, ShoppingBag, LayoutGrid, BadgePercent, Info, LogOut,
  Apple, Smartphone,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

const CATEGORIES = [
  {
    group: "🍎 Apple",
    items: [
      { label: "All iPhones",    href: "/products?category=apple" },
      { label: "Brand New",      href: "/products?category=apple&condition=brand-new" },
      { label: "Pre-Owned",      href: "/products?category=apple&condition=pre-owned" },
    ],
  },
  {
    group: "🤖 Android",
    items: [
      { label: "Samsung",  href: "/products?category=samsung"  },
      { label: "OnePlus",  href: "/products?category=oneplus"  },
      { label: "Redmi",    href: "/products?category=redmi"    },
      { label: "Realme",   href: "/products?category=realme"   },
      { label: "Nothing",  href: "/products?category=nothing"  },
      { label: "Motorola", href: "/products?category=motorola" },
      { label: "Vivo",     href: "/products?category=vivo"     },
      { label: "Honor",    href: "/products?category=honor"    },
      { label: "iQOO",     href: "/products?category=iqoo"     },
    ],
  },
];

const SHOP_ITEMS = [
  { label: "🆕 Brand New",  href: "/products?condition=brand-new" },
  { label: "♻️ Pre-Owned",  href: "/products?condition=pre-owned" },
  { label: "🔥 Hot Deals",  href: "/products?deals=true"          },
  { label: "⭐ Featured",   href: "/products?featured=true"       },
];

const mobileLinks = [
  { label: "Home",       href: "/",                    icon: Home       },
  { label: "Shop",       href: "/products",            icon: ShoppingBag},
  { label: "Categories", href: "/products?view=categories", icon: LayoutGrid },
  { label: "Deals",      href: "/products?deals=true", icon: BadgePercent },
  { label: "About",      href: "/about",               icon: Info       },
];

export default function Navbar() {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [shopOpen,     setShopOpen]     = useState(false);
  const [catOpen,      setCatOpen]      = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const searchRef  = useRef<HTMLInputElement>(null);
  const shopRef    = useRef<HTMLDivElement>(null);
  const catRef     = useRef<HTMLDivElement>(null);
  const userRef    = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router   = useRouter();
  const close    = () => setMobileOpen(false);

  const cartCount = useCartStore((s) => s.count());
  const user   = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  // Close all dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) setShopOpen(false);
      if (catRef.current  && !catRef.current.contains(e.target as Node))  setCatOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setShopOpen(false); setCatOpen(false); setUserMenuOpen(false); setMobileOpen(false); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
    else setSearchQuery("");
  }, [searchOpen]);

  // Close everything on route change
  useEffect(() => {
    setSearchOpen(false); setMobileOpen(false);
    setShopOpen(false); setCatOpen(false); setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => mq.matches && setMobileOpen(false);
    document.body.style.overflow = "hidden";
    mq.addEventListener("change", onMq);
    return () => { document.body.style.overflow = ""; mq.removeEventListener("change", onMq); };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    !href.includes("?") && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" aria-label="Pure Apple – Home" className="group flex items-center gap-2.5 sm:gap-3.5 flex-shrink-0">
              <ShineLogo height={54} priority className="transition-transform duration-500 ease-out group-hover:scale-105" />
              <span aria-hidden className="hidden min-[360px]:block h-7 sm:h-8 w-[2px] rounded-full bg-gradient-to-b from-leaf-500 via-brand-500 to-sun-500" />
              <span className="hidden min-[360px]:flex flex-col leading-none">
                <span className="text-[8px] sm:text-[9px] font-semibold tracking-[0.22em] text-gray-600 uppercase">Mobile &amp;</span>
                <span className="mt-1 text-[10px] sm:text-[11px] font-bold tracking-[0.14em] text-gray-800 uppercase whitespace-nowrap">
                  Gadget <span className="text-brand-500">Shop</span>
                </span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-brand-600 border-b-2 border-brand-500 pb-0.5" : "text-gray-800 hover:text-brand-600"}`}>Home</Link>

              {/* Shop dropdown */}
              <div className="relative" ref={shopRef}>
                <button
                  onClick={() => { setShopOpen(o => !o); setCatOpen(false); }}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${shopOpen ? "text-brand-600" : "text-gray-800 hover:text-brand-600"}`}
                >
                  Shop
                  <ChevronDown size={14} className={`transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Shop dropdown panel */}
                <div className={`absolute top-full left-0 mt-3 w-52 transition-all duration-200 origin-top-left ${shopOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}`}>
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-gray-50">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shop By Type</p>
                    </div>
                    {SHOP_ITEMS.map(item => (
                      <Link key={item.label} href={item.href}
                        onClick={() => setShopOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 font-medium transition-colors">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Categories mega dropdown */}
              <div className="relative" ref={catRef}>
                <button
                  onClick={() => { setCatOpen(o => !o); setShopOpen(false); }}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${catOpen ? "text-brand-600" : "text-gray-800 hover:text-brand-600"}`}
                >
                  Categories
                  <ChevronDown size={14} className={`transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Mega dropdown panel */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[420px] transition-all duration-200 origin-top ${catOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}`}>
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Browse Categories</p>
                      <Link href="/products" onClick={() => setCatOpen(false)}
                        className="text-[11px] font-semibold text-brand-500 hover:text-brand-600">
                        View All →
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-0 divide-x divide-gray-50">
                      {CATEGORIES.map(group => (
                        <div key={group.group} className="py-3">
                          <p className="px-4 pb-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">{group.group}</p>
                          {group.items.map(item => (
                            <Link key={item.label} href={item.href}
                              onClick={() => setCatOpen(false)}
                              className="flex items-center gap-2 mx-2 px-2 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 rounded-lg transition-colors font-medium">
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                    {/* Footer */}
                    <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 flex gap-3">
                      <Link href="/products?deals=true" onClick={() => setCatOpen(false)}
                        className="flex-1 text-center text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 py-2 rounded-xl transition-colors">
                        🔥 Hot Deals
                      </Link>
                      <Link href="/products?featured=true" onClick={() => setCatOpen(false)}
                        className="flex-1 text-center text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 py-2 rounded-xl transition-colors">
                        ⭐ Featured
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/products?deals=true" className="text-gray-800 hover:text-brand-600 text-sm font-medium transition-colors">Deals</Link>
              <Link href="/about" className="text-gray-800 hover:text-brand-600 text-sm font-medium transition-colors">About</Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-2 md:gap-3">
              <button onClick={() => setSearchOpen(o => !o)} aria-label="Search"
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/60 text-gray-700 hover:text-brand-500 transition-colors">
                {searchOpen ? <X size={18} /> : <Search size={18} />}
              </button>

              <form onSubmit={handleSearch}
                className="hidden md:flex items-center gap-2 w-64 lg:w-80 border border-gray-200 rounded-full px-4 py-2 bg-white/80 hover:border-brand-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none" />
                <button type="submit" aria-label="Search" className="text-gray-400 hover:text-brand-500"><Search size={16} /></button>
              </form>

              <Link href="/wishlist" className="hidden md:flex p-2 rounded-lg text-gray-800 hover:text-brand-500 hover:bg-brand-50 transition-colors">
                <Heart size={18} />
              </Link>

              <Link href="/cart"
                className="relative flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:p-2 rounded-full md:rounded-lg bg-white/60 md:bg-transparent text-gray-700 md:text-gray-800 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* User menu */}
              <div className="hidden md:block relative" ref={userRef}>
                {user ? (
                  <>
                    <button onClick={() => setUserMenuOpen(o => !o)}
                      className="flex items-center gap-2 p-2 rounded-lg text-gray-800 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                      <div className="w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">
                        {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
                      </div>
                    </button>
                    <div className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 transition-all duration-200 origin-top-right ${userMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                      <div className="px-4 py-2.5 border-b border-gray-50">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.name ?? "User"}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      {user.role === "admin" && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600">
                          ⚙️ Admin Panel
                        </Link>
                      )}
                      <Link href="/orders" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50">
                        📦 My Orders
                      </Link>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <Link href="/login" className="p-2 rounded-lg text-gray-800 hover:text-brand-600 hover:bg-brand-50 transition-colors flex">
                    <User size={18} />
                  </Link>
                )}
              </div>

              <button onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/60 text-gray-800 active:scale-95 transition-transform">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile search overlay */}
      <div className={`md:hidden fixed left-0 right-0 z-40 transition-all duration-300 ${searchOpen ? "top-[64px] opacity-100 translate-y-0" : "top-[64px] opacity-0 -translate-y-2 pointer-events-none"}`}>
        <div className="mx-3 mt-1.5 rounded-2xl border border-white/60 bg-white/90 backdrop-blur-2xl shadow-lg overflow-hidden">
          <form onSubmit={handleSearch} className="flex items-center gap-2 px-4 py-3">
            <Search size={18} className="text-brand-500 shrink-0" />
            <input ref={searchRef} type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="iPhone, Samsung, Accessories…"
              className="flex-1 bg-transparent text-[15px] text-gray-800 placeholder-gray-400 outline-none" />
            <button type="submit" className="ml-1 px-4 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-full transition-colors">Go</button>
          </form>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div aria-hidden onClick={close}
          className={`fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-[2px] transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} />
        <nav className={`fixed left-3 right-3 top-[72px] z-50 origin-top rounded-3xl border border-white/60 bg-white/60 p-2 backdrop-blur-2xl shadow-[0_24px_60px_rgba(15,23,42,0.22)] transition-all duration-300 ${mobileOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-3 scale-95 pointer-events-none invisible"}`}>
          <ul className="space-y-1">
            {mobileLinks.map((l, i) => {
              const Icon = l.icon;
              const active = isActive(l.href);
              return (
                <li key={l.label} className={`transition-all duration-300 ${mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                  style={{ transitionDelay: mobileOpen ? `${70 + i * 45}ms` : "0ms" }}>
                  <Link href={l.href} onClick={close}
                    className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors ${active ? "bg-white/75 shadow-sm" : "hover:bg-white/50"}`}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${active ? "bg-gradient-to-b from-brand-400 to-brand-500 text-white shadow-md shadow-brand-500/30" : "bg-white/70 text-gray-700"}`}>
                      <Icon size={18} strokeWidth={2} />
                    </span>
                    <span className={`flex-1 text-[15px] font-semibold tracking-tight ${active ? "text-brand-600" : "text-gray-800"}`}>{l.label}</span>
                    <ChevronRight size={16} className={active ? "text-brand-500" : "text-gray-400"} />
                  </Link>
                </li>
              );
            })}
            {user ? (
              <li>
                <button onClick={() => { logout(); close(); }}
                  className="w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-white/50 transition-colors">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70 text-red-500"><LogOut size={18} /></span>
                  <span className="text-[15px] font-semibold text-red-500">Sign Out</span>
                </button>
              </li>
            ) : (
              <li>
                <Link href="/login" onClick={close}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-white/50 transition-colors">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70 text-gray-700"><User size={18} /></span>
                  <span className="text-[15px] font-semibold text-gray-800">Login / Register</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
}
