"use client";

// SAVE PATH: app/(shop)/category/[slug]/CategoryPageClient.tsx
// ─── সম্পূর্ণ DB-driven — কোনো static/demo catalog নেই ──────────

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal, ChevronDown, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import ComingSoonModal from "@/components/shop/ComingSoonModal";
import SharedProductCard, { type SharedProduct } from "@/components/shop/SharedProductCard";

// ── Icon image map ─────────────────────────────────────────────
const ICON_MAP: Record<string, string> = {
  android:     "/icon/android.png",
  iphone:      "/icon/iPhone.png",
  charger:     "/icon/Charger.png",
  speaker:     "/icon/speaker.png",
  earbuds:     "/icon/ear buds.png",
  powerbank:   "/icon/power-bank.png",
  cables:      "/icon/cable.png",
  accessories: "/icon/accessories.png",
};

const BRAND_FILTER =
  "brightness(0) saturate(100%) invert(42%) sepia(97%) saturate(631%) hue-rotate(342deg) brightness(98%) contrast(97%)";

// ─── DB product interface ──────────────────────────────────────
interface DbProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  condition: "brand-new" | "pre-owned";
  price: number;
  original_price?: number;
  rating?: number;
  review_count?: number;
  image: string;
  badge?: string;
  badge_color?: string;
  storage_variants?: string;
  storage_prices?:   string;
  region_prices?:    string;
  regions?:          string;
  colors?:           string;
}

const BRAND_LABEL: Record<string, string> = {
  apple: "Apple", samsung: "Samsung", oneplus: "OnePlus", redmi: "Redmi",
  realme: "Realme", nothing: "Nothing", motorola: "Motorola", vivo: "Vivo",
  honor: "Honor", iqoo: "iQOO", google: "Google",
};

// ─── DB product → SharedProduct ───────────────────────────────
function dbToShared(p: DbProduct): SharedProduct {
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
    image:           p.image,
    slug:            p.slug,
    badge:           p.badge,
    badgeColor:      p.badge_color ?? "#FB5724",
    showStartingFrom: !!(storageVariants && storageVariants.length > 1),
    storage:         storageVariants?.join(" / "),
    storageVariants,
    storagePrices,
    regionList,
    regionPrices,
    colors:          colorList?.map(c => ({ name: c, hex: "", image: p.image })),
  };
}

// ── Price ranges ───────────────────────────────────────────────
const PHONE_PRICE_RANGES = [
  { label: "সব দাম",           min: 0,      max: Infinity },
  { label: "৳10,000 এর নিচে", min: 0,      max: 9999     },
  { label: "৳10k – ৳50k",    min: 10000,  max: 50000    },
  { label: "৳50k – ৳1L",     min: 50001,  max: 100000   },
  { label: "৳1L এর উপরে",    min: 100001, max: Infinity  },
];

const ACCESSORY_PRICE_RANGES = [
  { label: "সব দাম",          min: 0,     max: Infinity },
  { label: "৳500 এর নিচে",   min: 0,     max: 499      },
  { label: "৳500 – ৳1,500",  min: 500,   max: 1500     },
  { label: "৳1,500 – ৳5,000",min: 1501,  max: 5000     },
  { label: "৳5,000 এর উপরে", min: 5001,  max: Infinity  },
];

const ACCESSORY_SLUGS = ["charger","speaker","earbuds","powerbank","cables","accessories"];

function getPriceRanges(slug: string) {
  return ACCESSORY_SLUGS.includes(slug) ? ACCESSORY_PRICE_RANGES : PHONE_PRICE_RANGES;
}

// ── FiltersDropdown ────────────────────────────────────────────
function FiltersDropdown({
  brands,
  activeBrand,
  onBrandChange,
  priceRange,
  onPriceChange,
}: {
  brands: string[];
  activeBrand: string;
  onBrandChange: (b: string) => void;
  priceRange: number;
  onPriceChange: (i: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const hasFilter = activeBrand !== "All" || priceRange !== 0;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-semibold shadow-sm transition-colors
          ${hasFilter
            ? "bg-orange-500 border-orange-500 text-white"
            : "bg-white border-gray-200 text-gray-700 hover:border-orange-300"
          }`}
      >
        <SlidersHorizontal size={13} className={hasFilter ? "text-white" : "text-orange-500"} />
        Filters
        {hasFilter && (
          <span className="ml-0.5 bg-white/30 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
            {(activeBrand !== "All" ? 1 : 0) + (priceRange !== 0 ? 1 : 0)}
          </span>
        )}
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl z-40 w-56 overflow-hidden">
            <div className="px-3 pt-3 pb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">দাম অনুযায়ী</p>
              <div className="flex flex-col gap-0.5">
                {PRICE_RANGES.map((r, i) => (
                  <button key={i} onClick={() => onPriceChange(i)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors
                      ${priceRange === i
                        ? "bg-orange-50 text-orange-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {brands.length > 2 && (
              <>
                <div className="h-px bg-gray-100 mx-3" />
                <div className="px-3 pt-2 pb-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Brand অনুযায়ী</p>
                  <div className="flex flex-col gap-0.5">
                    {brands.map((b) => (
                      <button key={b} onClick={() => onBrandChange(b)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors
                          ${activeBrand === b
                            ? "bg-orange-50 text-orange-600 font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {b === "All" ? "সব Brand" : b}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {hasFilter && (
              <>
                <div className="h-px bg-gray-100" />
                <button
                  onClick={() => { onBrandChange("All"); onPriceChange(0); setOpen(false); }}
                  className="w-full px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors text-center"
                >
                  সব filter সরান
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── SortDropdown ───────────────────────────────────────────────
function SortDropdown({
  sortBy,
  onChange,
}: {
  sortBy: string;
  onChange: (v: "featured" | "price-asc" | "price-desc") => void;
}) {
  const [open, setOpen] = useState(false);
  const OPTIONS = [
    { key: "featured",   label: "Featured" },
    { key: "price-asc",  label: "দাম: কম → বেশি" },
    { key: "price-desc", label: "দাম: বেশি → কম" },
  ];
  const current = OPTIONS.find((o) => o.key === sortBy)?.label ?? "Featured";
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-sm hover:border-orange-300 transition-colors"
      >
        Sort: {current}
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl z-40 min-w-[160px] overflow-hidden">
          {OPTIONS.map((o) => (
            <button
              key={o.key}
              onClick={() => { onChange(o.key as "featured" | "price-asc" | "price-desc"); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-xs font-medium border-b last:border-b-0 border-gray-50 transition-colors
                ${sortBy === o.key
                  ? "bg-orange-50 text-orange-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Props ──────────────────────────────────────────────────────
interface Props {
  slug: string;
  label: string;
  icon: string;
  description: string;
  isEnabled: boolean;
}

// ── Main Component ─────────────────────────────────────────────
export default function CategoryPageClient({ slug, label, icon, description, isEnabled }: Props) {
  const [showComingSoon, setShowComingSoon] = useState(!isEnabled);
  const [activeBrand,    setActiveBrand]    = useState("All");
  const [priceRange,     setPriceRange]     = useState(0);
  const [sortBy,         setSortBy]         = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [dbProducts,     setDbProducts]     = useState<DbProduct[]>([]);
  const [loading,        setLoading]        = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  const iconSrc = ICON_MAP[slug];
  const PRICE_RANGES = getPriceRanges(slug);

  // ── DB থেকে এই category-র products fetch ──
  useEffect(() => {
    if (!isEnabled) { setLoading(false); return; }

    setLoading(true);
    // iphone slug → apple category, android slug → সব non-apple brands
    const categoryParam =
      slug === "iphone"  ? "apple" :
      slug === "android" ? "" :       // android: সব brand fetch করে client-side filter
      slug;

    const url = slug === "android"
      ? "/api/products?available=true"
      : `/api/products?category=${encodeURIComponent(categoryParam)}&available=true`;

    fetch(url)
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.products)) {
          let products = d.products as DbProduct[];
          // android = apple বাদে সব
          if (slug === "android") {
            products = products.filter(p => p.category !== "apple");
          }
          setDbProducts(products);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, isEnabled]);

  // ── Distinct brands for filter dropdown ──
  const brands = useMemo(() => {
    const b = [...new Set(dbProducts.map((p) => BRAND_LABEL[p.category] ?? p.category))];
    return ["All", ...b];
  }, [dbProducts]);

  const filtered = useMemo(() => {
    let list = [...dbProducts];
    if (activeBrand !== "All") {
      list = list.filter((p) => (BRAND_LABEL[p.category] ?? p.category) === activeBrand);
    }
    const range = PRICE_RANGES[priceRange];
    list = list.filter((p) => p.price >= range.min && p.price <= range.max);
    if (sortBy === "price-asc")  list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [dbProducts, activeBrand, priceRange, sortBy]);

  if (!isEnabled || showComingSoon) {
    return (
      <ComingSoonModal
        categoryLabel={label}
        categoryIcon={icon}
        onClose={() => { if (typeof window !== "undefined") window.history.back(); }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center gap-1.5 text-xs text-gray-400">
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-gray-700 font-medium">{label}</span>
        </div>
      </div>

      {/* Category Hero — single clean row */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            {iconSrc ? (
              <Image src={iconSrc} alt={label} width={28} height={28} className="object-contain" style={{ filter: BRAND_FILTER }} />
            ) : (
              <span className="text-xl">{icon}</span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h1 className="text-base font-extrabold text-gray-900 shrink-0">{label}</h1>
            <span className="text-gray-300">·</span>
            <p className="text-xs text-gray-400 truncate">{description}</p>
          </div>
          <span className="shrink-0 text-xs font-bold text-orange-600">
            {loading ? "…" : `${filtered.length} items`}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white sticky top-0 z-30 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center justify-end gap-2">
            <FiltersDropdown
              brands={brands}
              activeBrand={activeBrand}
              onBrandChange={setActiveBrand}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
            />
            <SortDropdown sortBy={sortBy} onChange={setSortBy} />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <Loader2 size={28} className="animate-spin text-orange-400" />
            <p className="text-sm font-medium">Loading products…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-3xl mb-3">🔍</p>
            <p className="font-semibold text-gray-600">কোনো product পাওয়া যায়নি</p>
            <p className="text-sm mt-1">Admin panel থেকে product যোগ করুন অথবা filter পরিবর্তন করুন</p>
            <button
              onClick={() => { setActiveBrand("All"); setPriceRange(0); }}
              className="mt-4 text-orange-500 text-sm font-semibold underline"
            >
              সব filter সরান
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 isolate">
            {filtered.map((p) => (
              <SharedProductCard
                key={p.id}
                product={dbToShared(p)}
                onAddToCart={(sp) => {
                  addItem({
                    id: sp.id, name: sp.name, variant: sp.variant ?? "",
                    price: sp.price, original_price: sp.originalPrice,
                    rating: sp.rating ?? 0, review_count: 0,
                    image: sp.image, slug: sp.slug,
                    badge: sp.badge, badge_color: sp.badgeColor,
                  } as never);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
