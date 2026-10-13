"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight, SlidersHorizontal, X,
  BadgeCheck, RefreshCw, Search,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";
import { BrandLogo } from "@/components/shop/BrandIcons";
import SharedProductCard, { type SharedProduct } from "@/components/shop/SharedProductCard";
import { PHONES, type ColorVariant, type BrandKey } from "@/lib/phoneCatalog";

// ─── Data ────────────────────────────────────────────────────────────────────

type Condition = "brand-new" | "pre-owned";

interface PhoneModel {
  name: string;
  slug: string;
  startingPrice: number;
  image: string;
  badge?: string;
  badgeColor?: string;
  rating?: number;
  discount?: number;
  brand: string;
  colors?: ColorVariant[];
  storage?: string;
}

const BRAND_LABEL: Record<BrandKey, string> = {
  apple: "Apple", samsung: "Samsung", oneplus: "OnePlus", redmi: "Redmi", realme: "Realme",
  google: "Google", vivo: "Vivo", iqoo: "iQOO", honor: "Honor", motorola: "Motorola", nothing: "Nothing",
};

// সব brand-new model এখন lib/phoneCatalog.ts থেকে আসে (color অনুযায়ী ছবি সহ)
const ALL_MODELS: PhoneModel[] = PHONES.map((p) => ({
  brand: BRAND_LABEL[p.brand],
  name: p.name,
  slug: p.slug,
  startingPrice: p.price,
  image: p.colors[0].image,
  badge: p.badge,
  badgeColor: p.badgeColor,
  rating: p.rating,
  discount: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : undefined,
  colors: p.colors,
  storage: p.storage,
}));

// Apple Pre-Owned
const APPLE_PREOWNED_RAW: PhoneModel[] = [
  { brand:"Apple", name:"iPhone 18 Pro Max", slug:"po-18-pro-max", startingPrice:149999, image:"/images/products/iPhone16.webp", badge:"Like New", badgeColor:"#4FAE53", rating:4.9 },
  { brand:"Apple", name:"iPhone 18 Pro",     slug:"po-18-pro",     startingPrice:129999, image:"/images/products/iPhone16.webp", badge:"Like New", badgeColor:"#4FAE53", rating:4.9 },
  { brand:"Apple", name:"iPhone 17 Pro Max", slug:"po-17-pro-max", startingPrice:114999, image:"/images/products/iPhone16.webp", rating:4.8 },
  { brand:"Apple", name:"iPhone 17 Pro",     slug:"po-17-pro",     startingPrice:99999,  image:"/images/products/iPhone16.webp", rating:4.7 },
  { brand:"Apple", name:"iPhone 17",         slug:"po-17",         startingPrice:84999,  image:"/images/products/iPhone16.webp", rating:4.6 },
  { brand:"Apple", name:"iPhone 17 Air",     slug:"po-17-air",     startingPrice:89999,  image:"/images/products/iPhone16.webp", rating:4.6 },
  { brand:"Apple", name:"iPhone 16 Pro Max", slug:"po-16-pro-max", startingPrice:104999, image:"/images/products/iPhone16.webp", badge:"Popular", badgeColor:"#FB5724", rating:4.8 },
  { brand:"Apple", name:"iPhone 16 Pro",     slug:"po-16-pro",     startingPrice:89999,  image:"/images/products/iPhone16.webp", rating:4.7 },
  { brand:"Apple", name:"iPhone 16",         slug:"po-16",         startingPrice:72999,  image:"/images/products/iPhone16.webp", rating:4.6 },
  { brand:"Apple", name:"iPhone 16e",        slug:"po-16e",        startingPrice:54999,  image:"/images/products/iPhone16.webp", rating:4.5 },
  { brand:"Apple", name:"iPhone 15 Pro Max", slug:"po-15-pro-max", startingPrice:89999,  image:"/images/products/iPhone16.webp", rating:4.7 },
  { brand:"Apple", name:"iPhone 15 Pro",     slug:"po-15-pro",     startingPrice:74999,  image:"/images/products/iPhone16.webp", rating:4.7 },
  { brand:"Apple", name:"iPhone 15",         slug:"po-15",         startingPrice:59999,  image:"/images/products/iPhone16.webp", rating:4.5 },
  { brand:"Apple", name:"iPhone 15 Plus",    slug:"po-15-plus",    startingPrice:64999,  image:"/images/products/iPhone16.webp", rating:4.5 },
  { brand:"Apple", name:"iPhone 14 Pro Max", slug:"po-14-pro-max", startingPrice:74999,  image:"/images/products/iPhone16.webp", rating:4.6 },
  { brand:"Apple", name:"iPhone 14 Pro",     slug:"po-14-pro",     startingPrice:62999,  image:"/images/products/iPhone16.webp", rating:4.5 },
  { brand:"Apple", name:"iPhone 14",         slug:"po-14",         startingPrice:49999,  image:"/images/products/iPhone16.webp", rating:4.4 },
  { brand:"Apple", name:"iPhone 14 Plus",    slug:"po-14-plus",    startingPrice:54999,  image:"/images/products/iPhone16.webp", rating:4.4 },
  { brand:"Apple", name:"iPhone 13 Pro Max", slug:"po-13-pro-max", startingPrice:59999,  image:"/images/products/iPhone16.webp", rating:4.5 },
  { brand:"Apple", name:"iPhone 13 Pro",     slug:"po-13-pro",     startingPrice:49999,  image:"/images/products/iPhone16.webp", rating:4.4 },
  { brand:"Apple", name:"iPhone 13",         slug:"po-13",         startingPrice:39999,  image:"/images/products/iPhone16.webp", rating:4.3 },
  { brand:"Apple", name:"iPhone 12 Pro Max", slug:"po-12-pro-max", startingPrice:44999,  image:"/images/products/iPhone16.webp", rating:4.3 },
  { brand:"Apple", name:"iPhone 12 Pro",     slug:"po-12-pro",     startingPrice:36999,  image:"/images/products/iPhone16.webp", rating:4.2 },
  { brand:"Apple", name:"iPhone 12",         slug:"po-12",         startingPrice:29999,  image:"/images/products/iPhone16.webp", rating:4.1 },
  { brand:"Apple", name:"iPhone 11 Pro Max", slug:"po-11-pro-max", startingPrice:34999,  image:"/images/products/iPhone16.webp", rating:4.2 },
  { brand:"Apple", name:"iPhone 11 Pro",     slug:"po-11-pro",     startingPrice:27999,  image:"/images/products/iPhone16.webp", rating:4.1 },
  { brand:"Apple", name:"iPhone 11",         slug:"po-11",         startingPrice:22999,  image:"/images/products/iPhone16.webp", rating:4.0 },
  { brand:"Apple", name:"iPhone XS Max",     slug:"po-xs-max",     startingPrice:19999,  image:"/images/products/iPhone16.webp", rating:3.9 },
  { brand:"Apple", name:"iPhone XS",         slug:"po-xs",         startingPrice:16999,  image:"/images/products/iPhone16.webp", rating:3.9 },
  { brand:"Apple", name:"iPhone XR",         slug:"po-xr",         startingPrice:14999,  image:"/images/products/iPhone16.webp", rating:3.8 },
  { brand:"Apple", name:"iPhone SE",         slug:"po-se",         startingPrice:11999,  image:"/images/products/iPhone16.webp", rating:3.7 },
  { brand:"Apple", name:"iPhone 8",          slug:"po-8",          startingPrice:8999,   image:"/images/products/iPhone16.webp", rating:3.5 },
];

// ছবি আছে এমন model-ই দেখানো হয়; ছবি/color catalog থেকে নেওয়া
const APPLE_PREOWNED: PhoneModel[] = APPLE_PREOWNED_RAW.flatMap((m) => {
  const match = PHONES.find((p) => p.brand === "apple" && p.name === m.name);
  return match ? [{ ...m, image: match.colors[0].image, colors: match.colors, storage: match.storage }] : [];
});

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label:"All",      key:"all",      bgFill:"#FB5724", logoColor:"text-orange-500" },
  { label:"Apple",    key:"apple",    bgFill:"#1d1d1f", logoColor:"text-gray-800"   },
  { label:"Samsung",  key:"samsung",  bgFill:"#1428A0", logoColor:"text-blue-700"   },
  { label:"OnePlus",  key:"oneplus",  bgFill:"#EF1B25", logoColor:"text-red-600"    },
  { label:"Redmi",    key:"redmi",    bgFill:"#FB5724", logoColor:"text-orange-600" },
  { label:"Realme",   key:"realme",   bgFill:"#FCC10B", logoColor:"text-yellow-600" },
  { label:"Nothing",  key:"nothing",  bgFill:"#111827", logoColor:"text-gray-800"   },
  { label:"Motorola", key:"motorola", bgFill:"#0099E6", logoColor:"text-blue-500"   },
  { label:"Vivo",     key:"vivo",     bgFill:"#415FFF", logoColor:"text-indigo-600" },
  { label:"Honor",    key:"honor",    bgFill:"#CC0000", logoColor:"text-red-700"    },
  { label:"iQOO",     key:"iqoo",     bgFill:"#0B0B0B", logoColor:"text-gray-900"   },
  { label:"Google",   key:"google",   bgFill:"#4285F4", logoColor:"text-blue-600"   },
];

const PRICE_RANGES = [
  { label:"Under ৳30,000",    min:0,      max:29999  },
  { label:"৳30,000 – ৳60,000", min:30000,  max:60000  },
  { label:"৳60,000 – ৳1 Lakh", min:60001,  max:100000 },
  { label:"Above ৳1 Lakh",    min:100001, max:Infinity},
];

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

// ─── Model Card helper (uses SharedProductCard) ──────────────────────────────

function modelToShared(model: PhoneModel, isPreOwned: boolean): SharedProduct {
  const originalPrice = model.discount
    ? Math.round(model.startingPrice / (1 - model.discount / 100))
    : undefined;
  return {
    id: model.slug,
    name: model.name,
    brand: model.brand,
    price: model.startingPrice,
    originalPrice,
    rating: model.rating,
    image: model.image,
    slug: model.slug,
    storage: model.storage,
    colors: model.colors,
    badge: isPreOwned ? "Pre-Owned" : model.badge,
    badgeColor: isPreOwned ? "#4FAE53" : (model.badgeColor ?? "#FB5724"),
    showStartingFrom: true,
  };
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function ProductsPageInner() {
  const [condition,       setCondition]       = useState<Condition>("brand-new");
  const searchParams = useSearchParams();
  const addItem = useCartStore(s => s.addItem);

  // Map URL slug (e.g. "apple") → brand name (e.g. "Apple")
  const SLUG_TO_BRAND: Record<string, string> = {
    all: "All", apple: "Apple", samsung: "Samsung", oneplus: "OnePlus",
    redmi: "Redmi", realme: "Realme", nothing: "Nothing",
    motorola: "Motorola", vivo: "Vivo", honor: "Honor", iqoo: "iQOO", google: "Google",
  };

  const [activeCategory,  setActiveCategory]  = useState("Apple");

  // Sync brand from URL param on mount and when URL changes
  useEffect(() => {
    const categoryParam = searchParams.get("category") ?? "";
    const brand = SLUG_TO_BRAND[categoryParam.toLowerCase()];
    // If no param or unrecognized → default to "All"
    setActiveCategory(brand ?? "All");
    // Sync ?q= search query from URL (set by MobileBottomNav / MobileSearchBar)
    const qParam = searchParams.get("q") ?? "";
    setSearch(qParam);
  }, [searchParams]);
  const [sidebarOpen,     setSidebarOpen]     = useState(false);
  const [search,          setSearch]          = useState(searchParams.get("q") ?? "");
  const [sortKey,         setSortKey]         = useState<SortKey>("featured");
  const [priceFilters,    setPriceFilters]    = useState<boolean[]>([false,false,false,false]);
  const [brandsVisible,   setBrandsVisible]   = useState(false);
  const brandsRef = useRef<HTMLUListElement>(null);

  // Trigger brand logo animation on mount (and when sidebar opens on mobile)
  useEffect(() => {
    const timer = setTimeout(() => setBrandsVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // Re-animate when mobile sidebar opens
  useEffect(() => {
    if (sidebarOpen) {
      setBrandsVisible(false);
      const timer = setTimeout(() => setBrandsVisible(true), 60);
      return () => clearTimeout(timer);
    }
  }, [sidebarOpen]);

  // Toggle a price range checkbox
  function togglePrice(i: number) {
    setPriceFilters(prev => prev.map((v, idx) => idx === i ? !v : v));
  }

  // Derive the active price ranges
  const activePriceRanges = PRICE_RANGES.filter((_, i) => priceFilters[i]);

  // Source pool — "All" shows everything, otherwise filter by brand
  const pool = useMemo(() => {
    if (condition === "pre-owned") {
      return activeCategory === "All"
        ? APPLE_PREOWNED
        : APPLE_PREOWNED.filter(m => m.brand === activeCategory);
    }
    return activeCategory === "All"
      ? ALL_MODELS
      : ALL_MODELS.filter(m => m.brand === activeCategory);
  }, [condition, activeCategory]);

  // Apply search + price filter + sort
  const filtered = useMemo(() => {
    let list = pool;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q));
    }
    if (activePriceRanges.length > 0) {
      list = list.filter(m =>
        activePriceRanges.some(r => m.startingPrice >= r.min && m.startingPrice <= r.max)
      );
    }
    return [...list].sort((a, b) => {
      if (sortKey === "price-asc")  return a.startingPrice - b.startingPrice;
      if (sortKey === "price-desc") return b.startingPrice - a.startingPrice;
      if (sortKey === "rating")     return (b.rating ?? 0) - (a.rating ?? 0);
      return 0;
    });
  }, [pool, search, activePriceRanges, sortKey]);

  // Search comparison mode — যখন search active, brand-new এবং pre-owned দুটোই দেখানো হয়
  const isSearchMode = search.trim().length > 0;

  const applyFiltersAndSort = (list: PhoneModel[]) => {
    let result = [...list];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(m => m.name.toLowerCase().includes(q));
    }
    if (activePriceRanges.length > 0) {
      result = result.filter(m =>
        activePriceRanges.some(r => m.startingPrice >= r.min && m.startingPrice <= r.max)
      );
    }
    return result.sort((a, b) => {
      if (sortKey === "price-asc")  return a.startingPrice - b.startingPrice;
      if (sortKey === "price-desc") return b.startingPrice - a.startingPrice;
      if (sortKey === "rating")     return (b.rating ?? 0) - (a.rating ?? 0);
      return 0;
    });
  };

  const brandNewPool = useMemo(() =>
    activeCategory === "All" ? ALL_MODELS : ALL_MODELS.filter(m => m.brand === activeCategory),
    [activeCategory]
  );
  const preOwnedPool = useMemo(() =>
    activeCategory === "All" ? APPLE_PREOWNED : APPLE_PREOWNED.filter(m => m.brand === activeCategory),
    [activeCategory]
  );

  const searchBrandNew  = useMemo(() => isSearchMode ? applyFiltersAndSort(brandNewPool)  : [], [isSearchMode, brandNewPool, search, activePriceRanges, sortKey]);
  const searchPreOwned  = useMemo(() => isSearchMode ? applyFiltersAndSort(preOwnedPool)  : [], [isSearchMode, preOwnedPool,  search, activePriceRanges, sortKey]);

  // When switching brand, reset filters
  function handleBrandClick(brand: string) {
    setActiveCategory(brand);
    setPriceFilters([false,false,false,false]);
    setSearch("");
    setSidebarOpen(false);
  }

  // When switching condition, reset filters
  function handleConditionSwitch(c: Condition) {
    setCondition(c);
    setActiveCategory("Apple");
    setPriceFilters([false,false,false,false]);
    setSearch("");
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-700 font-medium">Smartphones</span>
            <ChevronRight size={12} />
            <span className="text-orange-500 font-medium">{activeCategory}</span>
          </div>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {activeCategory === "All" ? "All Smartphones" : `${activeCategory} Smartphones`}
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">{filtered.length} models available</p>
            </div>

            {/* Condition toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
              <button onClick={() => handleConditionSwitch("brand-new")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
                  ${condition === "brand-new" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                <BadgeCheck size={15} className={condition === "brand-new" ? "text-orange-500" : "text-gray-400"} />
                Brand New
              </button>
              <button onClick={() => handleConditionSwitch("pre-owned")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
                  ${condition === "pre-owned" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                <RefreshCw size={14} className={condition === "pre-owned" ? "text-green-500" : "text-gray-400"} />
                Pre-Owned
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-owned trust bar */}
      {condition === "pre-owned" && (
        <div className="bg-green-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-2.5">
            <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-1 text-xs font-medium">
              <span>✅ 100% Genuine Devices</span>
              <span className="hidden sm:block opacity-40">|</span>
              <span>🔍 30-Point Quality Check</span>
              <span className="hidden sm:block opacity-40">|</span>
              <span>🛡️ 6-Month Warranty</span>
              <span className="hidden sm:block opacity-40">|</span>
              <span>🔄 7-Day Return</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">

          {/* ── Sidebar ── */}
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}

          <aside className={`
            fixed lg:static top-0 left-0 h-full lg:h-auto z-50 lg:z-auto
            w-64 lg:w-56 xl:w-60 shrink-0
            bg-white lg:bg-transparent
            transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
            overflow-y-auto lg:overflow-visible p-4 lg:p-0
          `}>
            {/* Mobile close */}
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <span className="font-bold text-gray-900">Filters</span>
              <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200">
                <X size={16} />
              </button>
            </div>

            {/* Brand list */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-3">
              <div className="px-4 py-3 border-b border-gray-50">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Brands</h3>
              </div>
              <ul ref={brandsRef} className="overflow-hidden">
                {CATEGORIES.map((cat, i) => (
                  <li key={cat.label}
                    style={{
                      opacity: brandsVisible ? 1 : 0,
                      transform: brandsVisible ? "translateX(0)" : "translateX(-32px)",
                      transition: brandsVisible
                        ? `opacity 0.32s ease ${i * 42}ms, transform 0.35s cubic-bezier(0.22,1,0.36,1) ${i * 42}ms`
                        : "none",
                    }}
                  >
                    <button onClick={() => handleBrandClick(cat.label)}
                      className="group/sb relative w-full flex items-center px-4 py-2.5 text-sm font-semibold overflow-hidden">

                      {/* ── BG: hover sweep OR active solid fill ── */}
                      <span
                        aria-hidden
                        className={`absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-r-lg ${
                          activeCategory === cat.label
                            ? "translate-x-0"                                         // active → always filled
                            : "translate-x-[-101%] group-hover/sb:translate-x-0"     // idle → sweep in on hover
                        }`}
                        style={{ backgroundColor: cat.bgFill }}
                      />

                      {/* ── Logo: visible when idle, sweeps out when hovered/active ── */}
                      <span className={`
                        relative z-10 flex items-center justify-center w-5 h-5 shrink-0 mr-2.5
                        transition-all duration-300 ease-in-out
                        ${activeCategory === cat.label
                          ? "translate-x-10 opacity-0 scale-50"                       // active → already gone
                          : "group-hover/sb:translate-x-10 group-hover/sb:opacity-0 group-hover/sb:scale-50"
                        }
                        ${cat.logoColor}
                      `}>
                        {cat.key === "all"
                          ? <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>
                          : <BrandLogo brand={cat.key} className="w-4 h-4" />
                        }
                      </span>

                      {/* ── Label: shifts left, turns white on hover/active ── */}
                      <span className={`
                        relative z-10 flex-1 text-left transition-all duration-300 ease-in-out
                        ${activeCategory === cat.label
                          ? "-translate-x-7 text-white"                               // active → already shifted + white
                          : "text-gray-600 group-hover/sb:-translate-x-7 group-hover/sb:text-white"
                        }
                      `}>
                        {cat.label}
                      </span>

                      {activeCategory === cat.label && (
                        <ChevronRight size={14} className="relative z-10 text-white/70 shrink-0" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Condition grade (pre-owned only) */}
            {condition === "pre-owned" && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-3">
                <div className="px-4 py-3 border-b border-gray-50">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Condition Grade</h3>
                </div>
                <div className="p-3 space-y-1.5">
                  {[
                    { label:"Like New",  desc:"99% perfect condition",    color:"bg-green-100 text-green-700" },
                    { label:"Excellent", desc:"Minor signs of use",       color:"bg-blue-100 text-blue-700"  },
                    { label:"Good",      desc:"Visible wear, functional", color:"bg-yellow-100 text-yellow-700" },
                  ].map(g => (
                    <label key={g.label} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" defaultChecked className="mt-0.5 w-3.5 h-3.5 accent-orange-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{g.label}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{g.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price range — FUNCTIONAL */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Price Range</h3>
                {priceFilters.some(Boolean) && (
                  <button onClick={() => setPriceFilters([false,false,false,false])}
                    className="text-[10px] text-orange-500 font-semibold hover:underline">
                    Clear
                  </button>
                )}
              </div>
              <div className="p-4 space-y-2.5">
                {PRICE_RANGES.map((range, i) => (
                  <label key={range.label} className="flex items-center gap-2.5 cursor-pointer group select-none">
                    <input
                      type="checkbox"
                      checked={priceFilters[i]}
                      onChange={() => togglePrice(i)}
                      className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                    />
                    <span className={`text-sm transition-colors ${priceFilters[i] ? "text-orange-600 font-semibold" : "text-gray-600 group-hover:text-gray-900"}`}>
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Live count indicator */}
              {priceFilters.some(Boolean) && (
                <div className="px-4 pb-3">
                  <p className="text-xs text-orange-500 font-medium">
                    {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              {/* Mobile filter button */}
              <button onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:border-orange-300 transition-all">
                <SlidersHorizontal size={15} />
                Filters
                {priceFilters.some(Boolean) && (
                  <span className="w-4 h-4 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {priceFilters.filter(Boolean).length}
                  </span>
                )}
              </button>

              {/* Search */}
              <div className="flex items-center gap-2 flex-1 min-w-0 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:border-orange-400 transition-colors">
                <Search size={14} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={`Search ${activeCategory} models…`}
                  className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent min-w-0"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort */}
              <select
                value={sortKey}
                onChange={e => setSortKey(e.target.value as SortKey)}
                className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-400 cursor-pointer shrink-0"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Active filter chips */}
            {(priceFilters.some(Boolean) || search) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {priceFilters.map((on, i) => on && (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {PRICE_RANGES[i].label}
                    <button onClick={() => togglePrice(i)} className="hover:text-orange-800">
                      <X size={11} />
                    </button>
                  </span>
                ))}
                {search && (
                  <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
                    &ldquo;{search}&rdquo;
                    <button onClick={() => setSearch("")} className="hover:text-orange-800">
                      <X size={11} />
                    </button>
                  </span>
                )}
                <button onClick={() => { setPriceFilters([false,false,false,false]); setSearch(""); }}
                  className="text-xs text-gray-400 hover:text-gray-600 underline">
                  Clear all
                </button>
              </div>
            )}

            {/* Section label */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold
                ${condition === "brand-new"
                  ? "bg-orange-50 text-orange-600 border border-orange-200"
                  : "bg-green-50 text-green-700 border border-green-200"}`}>
                {condition === "brand-new"
                  ? <><BadgeCheck size={13} /> Brand New{activeCategory !== "All" ? ` — ${activeCategory}` : ""}</>
                  : <><RefreshCw size={12} /> Pre-Owned{activeCategory !== "All" ? ` — ${activeCategory}` : ""}</>}
              </div>
              <span className="text-xs text-gray-400">
                {isSearchMode
                  ? `${searchBrandNew.length + searchPreOwned.length} result${(searchBrandNew.length + searchPreOwned.length) !== 1 ? "s" : ""}`
                  : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
              </span>
            </div>

            {/* ── Search Comparison Mode ── */}
            {isSearchMode ? (
              searchBrandNew.length === 0 && searchPreOwned.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="text-gray-500 font-semibold">No models found for &ldquo;{search}&rdquo;</p>
                  <p className="text-gray-400 text-sm mt-1">Try a different search term.</p>
                  <button onClick={() => setSearch("")}
                    className="mt-4 text-sm text-orange-500 font-semibold hover:underline">
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="space-y-8 pt-2">
                  {/* Brand New results */}
                  {searchBrandNew.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1.5 rounded-full text-xs font-bold">
                          <BadgeCheck size={13} /> Brand New
                        </div>
                        <span className="text-xs text-gray-400">{searchBrandNew.length} result{searchBrandNew.length !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pt-3">
                        {searchBrandNew.map(model => (
                          <SharedProductCard
                            key={model.slug}
                            product={modelToShared(model, false)}
                            onAddToCart={(p) => {
                              addItem({ id: p.id, name: p.name, variant: p.variant ?? "", price: p.price, original_price: p.originalPrice, rating: p.rating ?? 0, review_count: 0, image: p.image, slug: p.slug, badge: p.badge, badge_color: p.badgeColor } as never);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Divider */}
                  {searchBrandNew.length > 0 && searchPreOwned.length > 0 && (
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400 font-medium px-2">Pre-Owned Options</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                  )}

                  {/* Pre-Owned results */}
                  {searchPreOwned.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full text-xs font-bold">
                          <RefreshCw size={12} /> Pre-Owned
                        </div>
                        <span className="text-xs text-gray-400">{searchPreOwned.length} result{searchPreOwned.length !== 1 ? "s" : ""}</span>
                        <span className="text-[11px] text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full font-medium">
                          Save up to {Math.round((1 - searchPreOwned[0].startingPrice / (searchBrandNew.find(m => m.name === searchPreOwned[0].name)?.startingPrice ?? searchPreOwned[0].startingPrice)) * 100)}% vs Brand New
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pt-3">
                        {searchPreOwned.map(model => (
                          <SharedProductCard
                            key={model.slug}
                            product={modelToShared(model, true)}
                            onAddToCart={(p) => {
                              addItem({ id: p.id, name: p.name, variant: p.variant ?? "", price: p.price, original_price: p.originalPrice, rating: p.rating ?? 0, review_count: 0, image: p.image, slug: p.slug, badge: p.badge, badge_color: p.badgeColor } as never);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : (
              /* ── Normal Mode (no search) ── */
              filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="text-gray-500 font-semibold">No models found</p>
                  <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search term.</p>
                  <button onClick={() => { setPriceFilters([false,false,false,false]); setSearch(""); }}
                    className="mt-4 text-sm text-orange-500 font-semibold hover:underline">
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pt-3">
                  {filtered.map(model => (
                    <SharedProductCard
                      key={model.slug}
                      product={modelToShared(model, condition === "pre-owned")}
                      onAddToCart={(p) => {
                        addItem({ id: p.id, name: p.name, variant: p.variant ?? "", price: p.price, original_price: p.originalPrice, rating: p.rating ?? 0, review_count: 0, image: p.image, slug: p.slug, badge: p.badge, badge_color: p.badgeColor } as never);
                      }}
                    />
                  ))}
                </div>
              )
            )}

            {/* Pre-owned trust section */}
            {condition === "pre-owned" && filtered.length > 0 && (
              <div className="mt-10 bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <BadgeCheck size={22} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Why Buy Pre-Owned from Pure Apple?</h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      Every pre-owned device goes through a rigorous 30-point inspection. Graded honestly — what you see is what you get. Backed by 6-month warranty and 7-day hassle-free returns.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {["Verified Genuine","6-Month Warranty","7-Day Return","Expert Inspected"].map(tag => (
                        <span key={tag} className="text-[11px] font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ProductsPageInner />
    </Suspense>
  );
}
