"use client";

// SAVE PATH: app/(shop)/products/page.tsx
// ─── সম্পূর্ণ DB-driven — কোনো static catalog নেই ───────────

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight, SlidersHorizontal, X,
  BadgeCheck, RefreshCw, Search, Loader2,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { BrandLogo } from "@/components/shop/BrandIcons";
import SharedProductCard, { type SharedProduct } from "@/components/shop/SharedProductCard";

// ─── Types ────────────────────────────────────────────────────

type Condition = "brand-new" | "pre-owned";

interface DbProduct {
  id: string;
  name: string;
  slug: string;
  category: string;          // brand slug — e.g. "apple", "samsung"
  condition: Condition;
  price: number;
  original_price?: number;
  rating?: number;
  review_count?: number;
  image: string;
  badge?: string;
  badge_color?: string;
  storage_variants?: string; // JSON array  e.g. ["128GB","256GB"]
  storage_prices?:   string; // JSON object e.g. {"256GB":174999}
  region_prices?:    string; // JSON object e.g. {"HK":0,"JP":-2000}
  regions?:          string; // comma-separated e.g. "HK,JP"
  colors?:           string; // JSON array
  is_available?:     boolean;
}

// ─── Brand constants ──────────────────────────────────────────

const BRAND_LABEL: Record<string, string> = {
  apple: "Apple", samsung: "Samsung", oneplus: "OnePlus", redmi: "Redmi",
  realme: "Realme", nothing: "Nothing", motorola: "Motorola", vivo: "Vivo",
  honor: "Honor", iqoo: "iQOO", google: "Google",
};

const CATEGORIES = [
  { label: "All",      key: "all",      bgFill: "#FB5724", logoColor: "text-orange-500" },
  { label: "Apple",    key: "apple",    bgFill: "#1d1d1f", logoColor: "text-gray-800"   },
  { label: "Samsung",  key: "samsung",  bgFill: "#1428A0", logoColor: "text-blue-700"   },
  { label: "OnePlus",  key: "oneplus",  bgFill: "#EF1B25", logoColor: "text-red-600"    },
  { label: "Redmi",    key: "redmi",    bgFill: "#FB5724", logoColor: "text-orange-600" },
  { label: "Realme",   key: "realme",   bgFill: "#FCC10B", logoColor: "text-yellow-600" },
  { label: "Nothing",  key: "nothing",  bgFill: "#111827", logoColor: "text-gray-800"   },
  { label: "Motorola", key: "motorola", bgFill: "#0099E6", logoColor: "text-blue-500"   },
  { label: "Vivo",     key: "vivo",     bgFill: "#415FFF", logoColor: "text-indigo-600" },
  { label: "Honor",    key: "honor",    bgFill: "#CC0000", logoColor: "text-red-700"    },
  { label: "iQOO",     key: "iqoo",     bgFill: "#0B0B0B", logoColor: "text-gray-900"   },
  { label: "Google",   key: "google",   bgFill: "#4285F4", logoColor: "text-blue-600"   },
];

const PRICE_RANGES = [
  { label: "Under ৳30,000",     min: 0,      max: 29999   },
  { label: "৳30,000 – ৳60,000", min: 30000,  max: 60000   },
  { label: "৳60,000 – ৳1 Lakh", min: 60001,  max: 100000  },
  { label: "Above ৳1 Lakh",     min: 100001, max: Infinity },
];

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

const SLUG_TO_BRAND: Record<string, string> = {
  apple: "Apple", samsung: "Samsung", oneplus: "OnePlus", redmi: "Redmi",
  realme: "Realme", nothing: "Nothing", motorola: "Motorola", vivo: "Vivo",
  honor: "Honor", iqoo: "iQOO", google: "Google",
};

// ─── DB product → SharedProduct ───────────────────────────────

function dbToShared(p: DbProduct, overrideImage?: string): SharedProduct {
  let storageVariants: string[] | undefined;
  let storagePrices:   Record<string, number> | undefined;
  let regionPrices:    Record<string, number> | undefined;
  let regionList:      string[] | undefined;
  let colorList:       string[] | undefined;

  try { if (p.storage_variants) storageVariants = JSON.parse(p.storage_variants); } catch {}
  try { if (p.storage_prices)   storagePrices   = JSON.parse(p.storage_prices);   } catch {}
  try { if (p.region_prices)    regionPrices    = JSON.parse(p.region_prices);     } catch {}
  if (p.regions) regionList = p.regions.split(",").map(r => r.trim()).filter(Boolean);
  try { if (p.colors) colorList = JSON.parse(p.colors); } catch {}

  return {
    id:              p.id,
    name:            p.name,
    brand:           BRAND_LABEL[p.category] ?? p.category,
    price:           p.price,
    originalPrice:   p.original_price,
    rating:          p.rating,
    image:           overrideImage ?? p.image,
    slug:            p.slug,
    badge:           p.badge,
    badgeColor:      p.badge_color ?? "#FB5724",
    showStartingFrom: !!(storageVariants && storageVariants.length > 1),
    // Extended for variant pricing
    storage:         storageVariants?.join(" / "),
    storageVariants,
    storagePrices,
    regionList,
    regionPrices,
    colors:          colorList?.map(c => ({ name: c, hex: "", image: p.image })),
  };
}

// ─── Main Page ────────────────────────────────────────────────

function ProductsPageInner() {
  const searchParams = useSearchParams();
  const addItem = useCartStore(s => s.addItem);

  const [condition,      setCondition]      = useState<Condition>("brand-new");
  const [activeCategory, setActiveCategory] = useState("All");
  const [allProducts,    setAllProducts]    = useState<DbProduct[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [search,         setSearch]         = useState(searchParams.get("q") ?? "");
  const [sortKey,        setSortKey]        = useState<SortKey>("featured");
  const [priceFilters,   setPriceFilters]   = useState<boolean[]>([false, false, false, false]);
  const [brandsVisible,  setBrandsVisible]  = useState(false);
  const brandsRef = useRef<HTMLUListElement>(null);

  // ── Fetch ALL products once ──
  useEffect(() => {
    setLoading(true);
    fetch("/api/products?available=true")
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.products)) setAllProducts(d.products as DbProduct[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Sync URL params ──
  useEffect(() => {
    const categoryParam = searchParams.get("category") ?? "";
    const brand = SLUG_TO_BRAND[categoryParam.toLowerCase()];
    setActiveCategory(brand ?? "All");
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  // ── Brand logo animation ──
  useEffect(() => {
    const t = setTimeout(() => setBrandsVisible(true), 80);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (sidebarOpen) {
      setBrandsVisible(false);
      const t = setTimeout(() => setBrandsVisible(true), 60);
      return () => clearTimeout(t);
    }
  }, [sidebarOpen]);

  function togglePrice(i: number) {
    setPriceFilters(prev => prev.map((v, idx) => idx === i ? !v : v));
  }

  const activePriceRanges = PRICE_RANGES.filter((_, i) => priceFilters[i]);

  // ── Filtered pool — condition + category + search + price ──
  const pool = useMemo(() => {
    let list = allProducts.filter(p => p.condition === condition);
    if (activeCategory !== "All") {
      list = list.filter(p => (BRAND_LABEL[p.category] ?? p.category) === activeCategory);
    }
    return list;
  }, [allProducts, condition, activeCategory]);

  const filtered = useMemo(() => {
    let list = pool;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    if (activePriceRanges.length > 0) {
      list = list.filter(p =>
        activePriceRanges.some(r => p.price >= r.min && p.price <= r.max)
      );
    }
    return [...list].sort((a, b) => {
      if (sortKey === "price-asc")  return a.price - b.price;
      if (sortKey === "price-desc") return b.price - a.price;
      if (sortKey === "rating")     return (b.rating ?? 0) - (a.rating ?? 0);
      return 0; // featured = DB order (created_at desc)
    });
  }, [pool, search, activePriceRanges, sortKey]);

  // ── Search mode: show both conditions at once ──
  const isSearchMode = search.trim().length > 0;
  const searchBrandNew = useMemo(() => {
    if (!isSearchMode) return [];
    const q = search.toLowerCase();
    let list = allProducts.filter(p => p.condition === "brand-new" && p.name.toLowerCase().includes(q));
    if (activeCategory !== "All") list = list.filter(p => (BRAND_LABEL[p.category] ?? p.category) === activeCategory);
    return list;
  }, [isSearchMode, search, allProducts, activeCategory]);

  const searchPreOwned = useMemo(() => {
    if (!isSearchMode) return [];
    const q = search.toLowerCase();
    let list = allProducts.filter(p => p.condition === "pre-owned" && p.name.toLowerCase().includes(q));
    if (activeCategory !== "All") list = list.filter(p => (BRAND_LABEL[p.category] ?? p.category) === activeCategory);
    return list;
  }, [isSearchMode, search, allProducts, activeCategory]);

  function handleBrandClick(brand: string) {
    setActiveCategory(brand);
    setPriceFilters([false, false, false, false]);
    setSearch("");
    setSidebarOpen(false);
  }

  function handleConditionSwitch(c: Condition) {
    setCondition(c);
    setPriceFilters([false, false, false, false]);
    setSearch("");
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
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
              <p className="text-gray-400 text-sm mt-0.5">
                {loading ? "Loading…" : `${isSearchMode ? searchBrandNew.length + searchPreOwned.length : filtered.length} models available`}
              </p>
            </div>

            {/* Condition toggle with counts */}
            {(() => {
              const bnCount = allProducts.filter(p =>
                p.condition === "brand-new" &&
                (activeCategory === "All" || (BRAND_LABEL[p.category] ?? p.category) === activeCategory)
              ).length;
              const poCount = allProducts.filter(p =>
                p.condition === "pre-owned" &&
                (activeCategory === "All" || (BRAND_LABEL[p.category] ?? p.category) === activeCategory)
              ).length;
              return (
                <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
                  <button onClick={() => handleConditionSwitch("brand-new")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
                      ${condition === "brand-new" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    <BadgeCheck size={15} className={condition === "brand-new" ? "text-orange-500" : "text-gray-400"} />
                    Brand New
                    {bnCount > 0 && (
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${condition === "brand-new" ? "bg-orange-100 text-orange-600" : "bg-gray-200 text-gray-500"}`}>
                        {bnCount}
                      </span>
                    )}
                  </button>
                  <button onClick={() => handleConditionSwitch("pre-owned")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
                      ${condition === "pre-owned" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    <RefreshCw size={14} className={condition === "pre-owned" ? "text-green-500" : "text-gray-400"} />
                    Pre-Owned
                    {poCount > 0 && (
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${condition === "pre-owned" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                        {poCount}
                      </span>
                    )}
                  </button>
                </div>
              );
            })()}
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

          {/* Sidebar backdrop (mobile) */}
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
                      <span aria-hidden
                        className={`absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-r-lg ${
                          activeCategory === cat.label
                            ? "translate-x-0"
                            : "translate-x-[-101%] group-hover/sb:translate-x-0"
                        }`}
                        style={{ backgroundColor: cat.bgFill }}
                      />
                      <span className={`
                        relative z-10 flex items-center justify-center w-5 h-5 shrink-0 mr-2.5
                        transition-all duration-300 ease-in-out
                        ${activeCategory === cat.label
                          ? "translate-x-10 opacity-0 scale-50"
                          : "group-hover/sb:translate-x-10 group-hover/sb:opacity-0 group-hover/sb:scale-50"
                        }
                        ${cat.logoColor}
                      `}>
                        {cat.key === "all"
                          ? <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>
                          : <BrandLogo brand={cat.key} className="w-4 h-4" />
                        }
                      </span>
                      <span className={`
                        relative z-10 flex-1 text-left transition-all duration-300 ease-in-out
                        ${activeCategory === cat.label
                          ? "-translate-x-7 text-white"
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



            {/* Price range */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Price Range</h3>
                {priceFilters.some(Boolean) && (
                  <button onClick={() => setPriceFilters([false, false, false, false])}
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

              <div className="flex items-center gap-2 flex-1 min-w-0 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:border-orange-400 transition-colors">
                <Search size={14} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={`Search ${activeCategory === "All" ? "phones" : activeCategory} models…`}
                  className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent min-w-0"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                )}
              </div>

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
                    <button onClick={() => togglePrice(i)} className="hover:text-orange-800"><X size={11} /></button>
                  </span>
                ))}
                {search && (
                  <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
                    &ldquo;{search}&rdquo;
                    <button onClick={() => setSearch("")} className="hover:text-orange-800"><X size={11} /></button>
                  </span>
                )}
                <button onClick={() => { setPriceFilters([false, false, false, false]); setSearch(""); }}
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
              {!loading && (
                <span className="text-xs text-gray-400">
                  {isSearchMode
                    ? `${searchBrandNew.length + searchPreOwned.length} result${(searchBrandNew.length + searchPreOwned.length) !== 1 ? "s" : ""}`
                    : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
                </span>
              )}
            </div>

            {/* Loading state */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
                <Loader2 size={28} className="animate-spin text-orange-400" />
                <p className="text-sm font-medium">Loading products…</p>
              </div>

            /* ── Search Mode — both conditions ── */
            ) : isSearchMode ? (
              searchBrandNew.length === 0 && searchPreOwned.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="text-gray-500 font-semibold">No models found for &ldquo;{search}&rdquo;</p>
                  <p className="text-gray-400 text-sm mt-1">Try a different search term.</p>
                  <button onClick={() => setSearch("")} className="mt-4 text-sm text-orange-500 font-semibold hover:underline">
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="space-y-8 pt-2">
                  {searchBrandNew.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1.5 rounded-full text-xs font-bold">
                          <BadgeCheck size={13} /> Brand New
                        </div>
                        <span className="text-xs text-gray-400">{searchBrandNew.length} result{searchBrandNew.length !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pt-3">
                        {searchBrandNew.map(p => (
                          <SharedProductCard key={p.id} product={dbToShared(p)}
                            onAddToCart={(sp) => addItem({ id: sp.id, name: sp.name, variant: sp.variant ?? "", price: sp.price, original_price: sp.originalPrice, rating: sp.rating ?? 0, review_count: 0, image: sp.image, slug: sp.slug, badge: sp.badge, badge_color: sp.badgeColor } as never)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {searchBrandNew.length > 0 && searchPreOwned.length > 0 && (
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400 font-medium px-2">Pre-Owned Options</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                  )}

                  {searchPreOwned.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full text-xs font-bold">
                          <RefreshCw size={12} /> Pre-Owned
                        </div>
                        <span className="text-xs text-gray-400">{searchPreOwned.length} result{searchPreOwned.length !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pt-3">
                        {searchPreOwned.map(p => {
                          // Use brand-new image if available for same product name
                          const brandNewMatch = allProducts.find(
                            bp => bp.condition === "brand-new" && bp.name.toLowerCase() === p.name.toLowerCase()
                          );
                          const sharedP = dbToShared(p, brandNewMatch?.image);
                          // Attach pre-owned badge
                          const withBadge = { ...sharedP, badge: sharedP.badge ?? "Pre-Owned", badgeColor: sharedP.badgeColor ?? "#16a34a" };
                          return (
                            <SharedProductCard key={p.id} product={withBadge}
                              onAddToCart={(sp) => addItem({ id: sp.id, name: sp.name, variant: sp.variant ?? "", price: sp.price, original_price: sp.originalPrice, rating: sp.rating ?? 0, review_count: 0, image: sp.image, slug: sp.slug, badge: sp.badge, badge_color: sp.badgeColor } as never)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )

            /* ── Normal Mode ── */
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-gray-500 font-semibold">No {condition === "brand-new" ? "Brand New" : "Pre-Owned"} models found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or add products from the admin panel.</p>
                <button onClick={() => { setPriceFilters([false, false, false, false]); setSearch(""); }}
                  className="mt-4 text-sm text-orange-500 font-semibold hover:underline">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pt-3">
                {filtered.map(p => {
                  let sharedP = dbToShared(p);
                  if (p.condition === "pre-owned") {
                    const brandNewMatch = allProducts.find(
                      bp => bp.condition === "brand-new" && bp.name.toLowerCase() === p.name.toLowerCase()
                    );
                    sharedP = dbToShared(p, brandNewMatch?.image);
                    sharedP = { ...sharedP, badge: sharedP.badge ?? "Pre-Owned", badgeColor: sharedP.badgeColor ?? "#16a34a" };
                  }
                  return (
                    <SharedProductCard key={p.id} product={sharedP}
                      onAddToCart={(sp) => addItem({ id: sp.id, name: sp.name, variant: sp.variant ?? "", price: sp.price, original_price: sp.originalPrice, rating: sp.rating ?? 0, review_count: 0, image: sp.image, slug: sp.slug, badge: sp.badge, badge_color: sp.badgeColor } as never)}
                    />
                  );
                })}
              </div>
            )}

            {/* Pre-owned trust section */}
            {!loading && condition === "pre-owned" && filtered.length > 0 && (
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
                      {["Verified Genuine", "6-Month Warranty", "7-Day Return", "Expert Inspected"].map(tag => (
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
