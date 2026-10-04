"use client";

import Link from "next/link";
import ShineLogo from "./ShineLogo";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Search, Heart, ShoppingCart, User, ChevronDown, ChevronRight, Menu, X,
  Home, ShoppingBag, LayoutGrid, BadgePercent, Info,
} from "lucide-react";

const mobileLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/products", icon: ShoppingBag },
  { label: "Categories", href: "/products?view=categories", icon: LayoutGrid },
  { label: "Deals", href: "/products?deals=true", icon: BadgePercent },
  { label: "About", href: "/about", icon: Info },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setMobileOpen(false);

  // only links without a query string can be matched by path alone
  const isActive = (href: string) =>
    !href.includes("?") && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // close when the page changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // while the menu is open: Esc closes it, page behind doesn't scroll, resizing to desktop closes it
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => mq.matches && setMobileOpen(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [mobileOpen]);

  return (
    <>
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo (apple + leaf only, no circle) ── */}
          <Link href="/" aria-label="Pure Apple – Home" className="group flex items-center gap-2.5 sm:gap-3.5 flex-shrink-0 min-w-0">
            <ShineLogo
              height={54}
              priority
              className="transition-transform duration-500 ease-out group-hover:scale-105"
            />
            {/* 3-colour divider (green · orange · yellow) */}
            <span aria-hidden="true" className="hidden min-[360px]:block h-7 sm:h-8 w-[2px] rounded-full bg-gradient-to-b from-leaf-500 via-brand-500 to-sun-500" />
            <span className="hidden min-[360px]:flex flex-col leading-none">
              <span className="text-[8px] sm:text-[9px] font-semibold tracking-[0.22em] sm:tracking-[0.28em] text-gray-600 uppercase">Mobile &amp;</span>
              <span className="mt-1 sm:mt-1.5 text-[10px] sm:text-[11px] font-bold tracking-[0.14em] sm:tracking-[0.2em] text-gray-800 uppercase whitespace-nowrap">
                Gadget <span className="text-brand-500">Shop</span>
              </span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-brand-600 font-medium text-sm border-b-2 border-brand-500 pb-0.5">Home</Link>

            <div className="relative">
              <button
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
                className="flex items-center gap-1 text-gray-800 hover:text-brand-600 text-sm font-medium transition-colors"
              >
                Shop <ChevronDown size={14} />
              </button>
              {shopOpen && (
                <div
                  onMouseEnter={() => setShopOpen(true)}
                  onMouseLeave={() => setShopOpen(false)}
                  className="absolute top-full left-0 mt-1 w-44 bg-white/70 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 py-2 z-50"
                >
                  <Link href="/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600">All Products</Link>
                  <Link href="/products?category=apple" className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600">Apple</Link>
                  <Link href="/products?category=samsung" className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600">Samsung</Link>
                  <Link href="/products?category=accessories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600">Accessories</Link>
                </div>
              )}
            </div>

            <Link href="/products?view=categories" className="text-gray-800 hover:text-brand-600 text-sm font-medium transition-colors">Categories</Link>
            <Link href="/products?deals=true" className="text-gray-800 hover:text-brand-600 text-sm font-medium transition-colors">Deals</Link>
            <Link href="/about" className="text-gray-800 hover:text-brand-600 text-sm font-medium transition-colors">About</Link>
          </nav>

          {/* ── Right Icons ── */}
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/products" aria-label="Search" className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:p-2 rounded-full md:rounded-lg bg-white/60 md:bg-transparent text-gray-700 md:text-gray-800 hover:text-brand-500 hover:bg-brand-50 transition-colors">
              <Search size={18} />
            </Link>
            <button className="hidden md:block p-2 rounded-lg text-gray-800 hover:text-brand-500 hover:bg-brand-50 transition-colors">
              <Heart size={18} />
            </button>
            <Link href="/cart" className="relative flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:p-2 rounded-full md:rounded-lg bg-white/60 md:bg-transparent text-gray-700 md:text-gray-800 hover:text-brand-600 hover:bg-brand-50 transition-colors">
              <ShoppingCart size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">0</span>
            </Link>
            <Link href="/login" className="hidden md:block p-2 rounded-lg text-gray-800 hover:text-brand-600 hover:bg-brand-50 transition-colors">
              <User size={18} />
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/60 text-gray-800 active:scale-95 transition-transform"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

    </header>

    {/* ── Mobile menu: glass panel (sits outside <header> so its blur sees the page behind it) ── */}
    <div className="md:hidden">
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-[2px] transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <nav
        id="mobile-menu"
        aria-label="Mobile"
        className={`fixed left-3 right-3 top-[72px] z-50 origin-top rounded-3xl border border-white/60 bg-white/60 p-2 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_24px_60px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.7)] transition-all duration-300 ease-out ${
          mobileOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-3 scale-95 pointer-events-none invisible"
        }`}
      >
        <ul className="space-y-1">
          {mobileLinks.map((l, i) => {
            const Icon = l.icon;
            const active = isActive(l.href);
            return (
              <li
                key={l.label}
                className={`transition-all duration-300 ${mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                style={{ transitionDelay: mobileOpen ? `${70 + i * 45}ms` : "0ms" }}
              >
                <Link
                  href={l.href}
                  onClick={close}
                  className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors ${
                    active ? "bg-white/75 shadow-sm" : "hover:bg-white/50 active:bg-white/60"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      active
                        ? "bg-gradient-to-b from-brand-400 to-brand-500 text-white shadow-md shadow-brand-500/30"
                        : "bg-white/70 text-gray-700"
                    }`}
                  >
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <span className={`flex-1 text-[15px] font-semibold tracking-tight ${active ? "text-brand-600" : "text-gray-800"}`}>
                    {l.label}
                  </span>
                  <ChevronRight size={16} className={active ? "text-brand-500" : "text-gray-400"} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
    </>
  );
}
