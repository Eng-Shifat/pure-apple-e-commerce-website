"use client";

import Link from "next/link";
import ShineLogo from "./ShineLogo";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, Heart, ShoppingCart, User, ChevronDown, ChevronRight,
  Menu, X, Home, ShoppingBag, LayoutGrid, BadgePercent, Info, LogOut, Star,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { BrandLogo } from "./BrandIcons";

interface Product {
  id: string; name: string; price: number; original_price?: number;
  image: string; slug: string; badge?: string; badge_color?: string;
  rating?: number; category?: string; condition?: string; href?: string;
}

const BRAND_GROUPS = [
  { key: "apple",    label: "Apple",    color: "text-gray-800",   bgFill: "#1d1d1f",  textOnFill: "text-white" },
  { key: "samsung",  label: "Samsung",  color: "text-blue-700",   bgFill: "#1428A0",  textOnFill: "text-white" },
  { key: "oneplus",  label: "OnePlus",  color: "text-red-600",    bgFill: "#EF1B25",  textOnFill: "text-white" },
  { key: "redmi",    label: "Redmi",    color: "text-orange-600", bgFill: "#FB5724",  textOnFill: "text-white" },
  { key: "realme",   label: "Realme",   color: "text-yellow-600", bgFill: "#FCC10B",  textOnFill: "text-gray-900" },
  { key: "nothing",  label: "Nothing",  color: "text-gray-800",   bgFill: "#111827",  textOnFill: "text-white" },
  { key: "motorola", label: "Motorola", color: "text-blue-500",   bgFill: "#0099E6",  textOnFill: "text-white" },
  { key: "vivo",     label: "Vivo",     color: "text-indigo-600", bgFill: "#415FFF",  textOnFill: "text-white" },
  { key: "honor",    label: "Honor",    color: "text-red-700",    bgFill: "#CC0000",  textOnFill: "text-white" },
  { key: "iqoo",     label: "iQOO",     color: "text-gray-900",   bgFill: "#0B0B0B",  textOnFill: "text-white" },
];

// Dropdown preview products (images from /public/images/Phone). Brands not listed here (e.g. Redmi) load from the API.
const BRAND_PREVIEW: Record<string, Product[]> = {
  apple: [
    { id: "apple-0", name: "iPhone 18 Pro Max", price: 0, image: "/images/Phone/iphone/Apple_iPhone_18_Pro_Max.webp", slug: "", href: "/products?category=apple" },
    { id: "apple-1", name: "iPhone 17 Pro Max", price: 0, image: "/images/Phone/iphone/iPhone_17_Pro_Max-removebg-preview.webp", slug: "", href: "/products?category=apple" },
    { id: "apple-2", name: "iPhone 16", price: 0, image: "/images/Phone/iphone/iPhone_16.webp", slug: "", href: "/products?category=apple" },
    { id: "apple-3", name: "iPhone 15 Pro", price: 0, image: "/images/Phone/iphone/iPhone_15_Pro.webp", slug: "", href: "/products?category=apple" },
  ],
  samsung: [
    { id: "samsung-0", name: "Galaxy S26 Ultra", price: 0, image: "/images/Phone/Samsung/Samsung_Galaxy_s26_ultra.webp", slug: "", href: "/products?category=samsung" },
    { id: "samsung-1", name: "Galaxy S25 Ultra", price: 0, image: "/images/Phone/Samsung/Samsung_s25_ultra.webp", slug: "", href: "/products?category=samsung" },
    { id: "samsung-2", name: "Galaxy S25", price: 0, image: "/images/Phone/Samsung/Samsung_Galaxy_S25.webp", slug: "", href: "/products?category=samsung" },
    { id: "samsung-3", name: "Galaxy S24", price: 0, image: "/images/Phone/Samsung/Samsung Galaxy S24.webp", slug: "", href: "/products?category=samsung" },
  ],
  oneplus: [
    { id: "oneplus-0", name: "OnePlus 13s 5G", price: 0, image: "/images/Phone/OnePlus/OnePlus-13s-5G-7246.webp", slug: "", href: "/products?category=oneplus" },
    { id: "oneplus-1", name: "OnePlus 12", price: 0, image: "/images/Phone/OnePlus/OnePlus 12.webp", slug: "", href: "/products?category=oneplus" },
    { id: "oneplus-2", name: "OnePlus Nord 6 5G", price: 0, image: "/images/Phone/OnePlus/OnePlus Nord 6 5G.webp", slug: "", href: "/products?category=oneplus" },
    { id: "oneplus-3", name: "OnePlus Nord CE6", price: 0, image: "/images/Phone/OnePlus/OnePlus Nord CE6.webp", slug: "", href: "/products?category=oneplus" },
  ],
  realme: [
    { id: "realme-0", name: "Realme 15 Pro 5G", price: 0, image: "/images/Phone/Realme/Realme 15 Pro 5G - Official.webp", slug: "", href: "/products?category=realme" },
    { id: "realme-1", name: "Realme 15 5G", price: 0, image: "/images/Phone/Realme/Realme 15 5G - Official.webp", slug: "", href: "/products?category=realme" },
    { id: "realme-2", name: "Realme Note 70", price: 0, image: "/images/Phone/Realme/realme Note 70 - Official.webp", slug: "", href: "/products?category=realme" },
    { id: "realme-3", name: "Realme C85 Pro", price: 0, image: "/images/Phone/Realme/realme C85 Pro - Official.webp", slug: "", href: "/products?category=realme" },
  ],
  nothing: [
    { id: "nothing-0", name: "Nothing Phone (4a) Pro", price: 0, image: "/images/Phone/Nothing/Nothing Phone (4a) Pro.webp", slug: "", href: "/products?category=nothing" },
    { id: "nothing-1", name: "Nothing Phone (4a)", price: 0, image: "/images/Phone/Nothing/Nothing Phone (4a).webp", slug: "", href: "/products?category=nothing" },
    { id: "nothing-2", name: "Nothing Phone (4b)", price: 0, image: "/images/Phone/Nothing/Nothing Phone (4b).webp", slug: "", href: "/products?category=nothing" },
  ],
  motorola: [
    { id: "motorola-0", name: "Moto Edge 70 Pro 5G", price: 0, image: "/images/Phone/Motorola/Motorola Edge 70 Pro 5G.webp", slug: "", href: "/products?category=motorola" },
    { id: "motorola-1", name: "Moto G96 5G", price: 0, image: "/images/Phone/Motorola/Motorola Moto G96 5G.webp", slug: "", href: "/products?category=motorola" },
    { id: "motorola-2", name: "Moto Signature 5G", price: 0, image: "/images/Phone/Motorola/Motorola Signature 5G.webp", slug: "", href: "/products?category=motorola" },
    { id: "motorola-3", name: "Moto G67 Power", price: 0, image: "/images/Phone/Motorola/Motorola Moto G67 Power.webp", slug: "", href: "/products?category=motorola" },
  ],
  vivo: [
    { id: "vivo-0", name: "Vivo X300 Ultra", price: 0, image: "/images/Phone/Vivo/VIVO X300 Ultra.webp", slug: "", href: "/products?category=vivo" },
    { id: "vivo-1", name: "Vivo T5x 5G", price: 0, image: "/images/Phone/Vivo/vivo T5x 5G.webp", slug: "", href: "/products?category=vivo" },
  ],
  honor: [
    { id: "honor-0", name: "Honor Magic V6", price: 0, image: "/images/Phone/Honor/Honor Magic V6.webp", slug: "", href: "/products?category=honor" },
    { id: "honor-1", name: "Honor Magic V5", price: 0, image: "/images/Phone/Honor/Honor Magic V5.webp", slug: "", href: "/products?category=honor" },
    { id: "honor-2", name: "Honor 200 Pro", price: 0, image: "/images/Phone/Honor/Honor 200 Pro.webp", slug: "", href: "/products?category=honor" },
    { id: "honor-3", name: "Honor 600 Smart", price: 0, image: "/images/Phone/Honor/Honor 600 Smart.webp", slug: "", href: "/products?category=honor" },
  ],
  iqoo: [
    { id: "iqoo-0", name: "iQOO 15T", price: 0, image: "/images/Phone/IQOO/iQOO 15T.webp", slug: "", href: "/products?category=iqoo" },
    { id: "iqoo-1", name: "iQOO 12 Pro 5G", price: 0, image: "/images/Phone/IQOO/iQOO 12 Pro 5G.webp", slug: "", href: "/products?category=iqoo" },
    { id: "iqoo-2", name: "iQOO Neo 11 5G", price: 0, image: "/images/Phone/IQOO/iQOO Neo 11 5G - CN.webp", slug: "", href: "/products?category=iqoo" },
    { id: "iqoo-3", name: "iQOO Neo 10 5G", price: 0, image: "/images/Phone/IQOO/iQOO Neo 10 5G.webp", slug: "", href: "/products?category=iqoo" },
  ],
};

const mobileLinks = [
  { label: "Home",       href: "/",                        icon: Home        },
  { label: "Shop",       href: "/products",                icon: ShoppingBag },
  { label: "Categories", href: "/products?view=categories",icon: LayoutGrid  },
  { label: "Deals",      href: "/products?deals=true",     icon: BadgePercent},
  { label: "About",      href: "/about",                   icon: Info        },
];

// Mini product card shown in dropdown
function MiniCard({ p }: { p: Product }) {
  const disc = p.original_price && p.original_price > p.price
    ? Math.round((1 - p.price / p.original_price) * 100) : 0;
  return (
    <Link href={p.href ?? `/products/${p.slug}`}
      className="group flex flex-col gap-1.5 p-2 rounded-xl hover:bg-gray-50 transition-colors min-w-0">
      <div className="relative w-full aspect-square rounded-lg bg-gray-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={encodeURI(p.image)} alt={p.name} className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300" />
        {disc > 0 && (
          <span className="absolute top-1 right-1 text-[9px] font-bold text-white bg-red-500 px-1 py-0.5 rounded-full">-{disc}%</span>
        )}
        {p.badge && (
          <span className="absolute top-1 left-1 text-[9px] font-bold text-white px-1 py-0.5 rounded-full" style={{ backgroundColor: p.badge_color ?? "#FB5724" }}>{p.badge}</span>
        )}
      </div>
      <p className="text-[11px] font-semibold text-gray-800 leading-tight line-clamp-2">{p.name}</p>
      {p.price > 0 && <div className="flex items-center gap-1">
        <span className="text-[12px] font-bold text-brand-600">৳{p.price.toLocaleString("en-BD")}</span>
        {p.original_price && p.original_price > p.price && (
          <span className="text-[9px] text-gray-400 line-through">৳{p.original_price.toLocaleString("en-BD")}</span>
        )}
      </div>}
      {p.rating && p.rating > 0 && (
        <div className="flex items-center gap-0.5">
          <Star size={9} className="fill-yellow-400 text-yellow-400" />
          <span className="text-[9px] text-gray-500 font-medium">{p.rating}</span>
        </div>
      )}
    </Link>
  );
}

export default function Navbar() {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [shopOpen,     setShopOpen]     = useState(false);
  const [catOpen,      setCatOpen]      = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Hover state
  const [shopHover,    setShopHover]    = useState(false);
  const [catHover,     setCatHover]     = useState(false);
  const [catVisible,   setCatVisible]   = useState(false); // controls brand logo animation
  const [activeBrand,  setActiveBrand]  = useState("apple");

  // Products cache
  const [shopProducts,  setShopProducts]  = useState<Product[]>([]);
  const [brandProducts, setBrandProducts] = useState<Record<string, Product[]>>({});
  const [loadingProds,  setLoadingProds]  = useState(false);

  const shopHoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const catHoverTimer  = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const shopRef    = useRef<HTMLDivElement>(null);
  const catRef     = useRef<HTMLDivElement>(null);
  const userRef    = useRef<HTMLDivElement>(null);
  const searchRef  = useRef<HTMLInputElement>(null);
  const pathname   = usePathname();
  const router     = useRouter();
  const close      = () => setMobileOpen(false);
  const cartCount  = useCartStore(s => s.count());
  const user       = useAuthStore(s => s.user);
  const logout     = useAuthStore(s => s.logout);

  // Fetch featured products for shop dropdown
  const fetchShopProducts = useCallback(async () => {
    if (shopProducts.length > 0) return;
    setLoadingProds(true);
    try {
      const r = await fetch("/api/products?featured=true&available=true");
      const d = await r.json();
      setShopProducts((d.products ?? []).slice(0, 4));
    } catch { /* ignore */ }
    setLoadingProds(false);
  }, [shopProducts.length]);

  // Fetch products for a brand
  const fetchBrandProducts = useCallback(async (brand: string) => {
    if (brandProducts[brand]) return;
    if (BRAND_PREVIEW[brand]) {
      setBrandProducts(prev => ({ ...prev, [brand]: BRAND_PREVIEW[brand] }));
      return;
    }
    try {
      const r = await fetch(`/api/products?category=${brand}&available=true`);
      const d = await r.json();
      setBrandProducts(prev => ({ ...prev, [brand]: (d.products ?? []).slice(0, 4) }));
    } catch { /* ignore */ }
  }, [brandProducts]);

  // Hover handlers with delay (prevents flicker)
  function handleShopEnter() {
    clearTimeout(shopHoverTimer.current);
    setShopHover(true);
    setCatHover(false);
    fetchShopProducts();
  }
  function handleShopLeave() {
    shopHoverTimer.current = setTimeout(() => setShopHover(false), 150);
  }
  function handleCatEnter() {
    clearTimeout(catHoverTimer.current);
    setCatHover(true);
    setShopHover(false);
    fetchBrandProducts(activeBrand);
    // slight delay so dropdown is mounted before animation fires
    setTimeout(() => setCatVisible(true), 20);
  }
  function handleCatLeave() {
    setCatVisible(false); // trigger exit animation first
    catHoverTimer.current = setTimeout(() => setCatHover(false), 350);
  }
  function handleBrandHover(brand: string) {
    setActiveBrand(brand);
    fetchBrandProducts(brand);
  }

  // Click outside to close click-based menus (user menu)
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setShopHover(false); setCatHover(false); setCatVisible(false); setUserMenuOpen(false); setMobileOpen(false); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
    else setSearchQuery("");
  }, [searchOpen]);

  useEffect(() => {
    setSearchOpen(false); setMobileOpen(false);
    setShopHover(false); setCatHover(false); setCatVisible(false); setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => mq.matches && setMobileOpen(false);
    document.body.style.overflow = "hidden";
    mq.addEventListener("change", onMq);
    return () => { document.body.style.overflow = ""; mq.removeEventListener("change", onMq); };
  }, [mobileOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
  }

  const isActive = (href: string) =>
    !href.includes("?") && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const currentBrandProducts = brandProducts[activeBrand] ?? [];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Logo */}
            <Link href="/" aria-label="Pure Apple – Home" className="group flex items-center gap-2 sm:gap-3.5 flex-shrink-0 min-w-0">
              <ShineLogo height={46} priority className="transition-transform duration-500 ease-out group-hover:scale-105 shrink-0 sm:h-[54px]" />
              <span aria-hidden className="block h-6 sm:h-8 w-[2px] rounded-full bg-gradient-to-b from-leaf-500 via-brand-500 to-sun-500 shrink-0" />
              <span className="flex flex-col leading-none min-w-0">
                <span className="text-[8px] sm:text-[9px] font-semibold tracking-[0.20em] text-gray-600 uppercase">Mobile &amp;</span>
                <span className="mt-0.5 text-[9px] sm:text-[11px] font-bold tracking-[0.12em] text-gray-800 uppercase whitespace-nowrap">
                  Gadget <span className="text-brand-500">Shop</span>
                </span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-brand-600 border-b-2 border-brand-500 pb-0.5" : "text-gray-800 hover:text-brand-600"}`}>Home</Link>

              {/* ── Shop hover dropdown ── */}
              <div className="relative" ref={shopRef}
                onMouseEnter={handleShopEnter}
                onMouseLeave={handleShopLeave}>
                <button className={`flex items-center gap-1 text-sm font-medium transition-colors ${shopHover ? "text-brand-600" : "text-gray-800 hover:text-brand-600"}`}>
                  Shop <ChevronDown size={14} className={`transition-transform duration-200 ${shopHover ? "rotate-180" : ""}`} />
                </button>

                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] transition-all duration-200 origin-top ${shopHover ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}`}>
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50 bg-gray-50/50">
                      <div className="flex gap-3">
                        <Link href="/products?condition=brand-new"
                          className="text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 px-3 py-1.5 rounded-full transition-colors">
                          🆕 Brand New
                        </Link>
                        <Link href="/products?condition=pre-owned"
                          className="text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors">
                          ♻️ Pre-Owned
                        </Link>
                        <Link href="/products?deals=true"
                          className="text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full transition-colors">
                          🔥 Hot Deals
                        </Link>
                      </div>
                      <Link href="/products" className="text-xs font-semibold text-brand-500 hover:text-brand-600">View All →</Link>
                    </div>

                    {/* Featured products */}
                    <div className="p-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">✨ Featured Products</p>
                      {loadingProds ? (
                        <div className="grid grid-cols-4 gap-2">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                              <div className="aspect-square bg-gray-100 rounded-lg mb-2" />
                              <div className="h-2 bg-gray-100 rounded mb-1" />
                              <div className="h-2 bg-gray-100 rounded w-2/3" />
                            </div>
                          ))}
                        </div>
                      ) : shopProducts.length > 0 ? (
                        <div className="grid grid-cols-4 gap-2">
                          {shopProducts.map(p => <MiniCard key={p.id} p={p} />)}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 text-center py-4">No featured products yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Categories hover mega dropdown ── */}
              <div className="relative" ref={catRef}
                onMouseEnter={handleCatEnter}
                onMouseLeave={handleCatLeave}>
                <button className={`flex items-center gap-1 text-sm font-medium transition-colors ${catHover ? "text-brand-600" : "text-gray-800 hover:text-brand-600"}`}>
                  Categories <ChevronDown size={14} className={`transition-transform duration-200 ${catHover ? "rotate-180" : ""}`} />
                </button>

                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[600px] transition-all duration-200 origin-top ${catHover ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}`}>
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex">

                    {/* Left: brand list */}
                    <div className="w-40 bg-gray-50 border-r border-gray-100 py-3 shrink-0 overflow-hidden">
                      <p
                        className="px-4 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                        style={{
                          opacity: catVisible ? 1 : 0,
                          transform: catVisible ? "translateX(0)" : "translateX(-18px)",
                          transition: "opacity 0.28s ease, transform 0.28s ease",
                        }}
                      >
                        Brands
                      </p>
                      {BRAND_GROUPS.map((b, i) => (
                        <button key={b.key}
                          onMouseEnter={() => handleBrandHover(b.key)}
                          onClick={() => { router.push(`/products?category=${b.key}`); setCatOpen(false); setCatHover(false); }}
                          style={{
                            opacity: catVisible ? 1 : 0,
                            transform: catVisible ? "translateX(0)" : "translateX(-28px)",
                            transition: catVisible
                              ? `opacity 0.30s ease ${i * 38}ms, transform 0.32s cubic-bezier(0.22,1,0.36,1) ${i * 38}ms`
                              : `opacity 0.18s ease ${(BRAND_GROUPS.length - 1 - i) * 22}ms, transform 0.18s ease ${(BRAND_GROUPS.length - 1 - i) * 22}ms`,
                          }}
                          className="group/brand relative w-full flex items-center px-4 py-2 text-sm font-semibold text-left overflow-hidden">

                          {/* ── BG: hover sweep OR active solid fill ── */}
                          <span
                            aria-hidden
                            className={`absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-r-lg ${
                              activeBrand === b.key
                                ? "translate-x-0"
                                : "translate-x-[-101%] group-hover/brand:translate-x-0"
                            }`}
                            style={{ backgroundColor: b.bgFill }}
                          />

                          {/* ── Logo: visible idle, gone on hover/active ── */}
                          <span className={`
                            relative z-10 flex items-center justify-center w-6 h-6 shrink-0 mr-2.5
                            transition-all duration-300 ease-in-out
                            ${activeBrand === b.key
                              ? "translate-x-10 opacity-0 scale-50"
                              : "group-hover/brand:translate-x-10 group-hover/brand:opacity-0 group-hover/brand:scale-50"
                            }
                            ${b.color}
                          `}>
                            <BrandLogo brand={b.key} className="w-5 h-5" />
                          </span>

                          {/* ── Label: shifts left, white on hover/active ── */}
                          <span className={`
                            relative z-10 transition-all duration-300 ease-in-out
                            ${activeBrand === b.key
                              ? "-translate-x-8 text-white"
                              : "text-gray-700 group-hover/brand:-translate-x-8 group-hover/brand:text-white"
                            }
                          `}>
                            {b.label}
                          </span>

                          {activeBrand === b.key && (
                            <ChevronRight size={12} className="relative z-10 ml-auto text-white/70 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Right: products for active brand */}
                    <div className="flex-1 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {BRAND_GROUPS.find(b => b.key === activeBrand)?.label} Products
                        </p>
                        <Link href={`/products?category=${activeBrand}`}
                          className="text-[11px] font-semibold text-brand-500 hover:text-brand-600">
                          See all →
                        </Link>
                      </div>
                      {!brandProducts[activeBrand] ? (
                        <div className="grid grid-cols-4 gap-2">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                              <div className="aspect-square bg-gray-100 rounded-lg mb-2" />
                              <div className="h-2 bg-gray-100 rounded mb-1" />
                              <div className="h-2 bg-gray-100 rounded w-2/3" />
                            </div>
                          ))}
                        </div>
                      ) : currentBrandProducts.length > 0 ? (
                        <div className="grid grid-cols-4 gap-2">
                          {currentBrandProducts.map(p => <MiniCard key={p.id} p={p} />)}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-300">
                          <ShoppingBag size={28} />
                          <p className="text-xs mt-2">No products found</p>
                        </div>
                      )}

                      {/* Quick links */}
                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                        <Link href={`/products?category=${activeBrand}&condition=brand-new`}
                          className="flex-1 text-center text-[11px] font-semibold text-green-700 bg-green-50 hover:bg-green-100 py-1.5 rounded-lg transition-colors">
                          🆕 Brand New
                        </Link>
                        <Link href={`/products?category=${activeBrand}&condition=pre-owned`}
                          className="flex-1 text-center text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 py-1.5 rounded-lg transition-colors">
                          ♻️ Pre-Owned
                        </Link>
                        <Link href={`/products?category=${activeBrand}&deals=true`}
                          className="flex-1 text-center text-[11px] font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 py-1.5 rounded-lg transition-colors">
                          🔥 Deals
                        </Link>
                      </div>
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
                      <button onClick={() => { logout(); setUserMenuOpen(false); }}
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

      {/* Mobile search */}
      <div className={`md:hidden fixed left-0 right-0 z-40 transition-all duration-300 ${searchOpen ? "top-[56px] sm:top-[64px] opacity-100 translate-y-0" : "top-[56px] sm:top-[64px] opacity-0 -translate-y-2 pointer-events-none"}`}>
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
        <nav className={`fixed left-3 right-3 top-[64px] sm:top-[72px] z-50 origin-top rounded-3xl border border-white/60 bg-white/60 p-2 backdrop-blur-2xl shadow-[0_24px_60px_rgba(15,23,42,0.22)] transition-all duration-300 ${mobileOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-3 scale-95 pointer-events-none invisible"}`}>
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
