"use client";

// app/(shop)/category/[slug]/CategoryPageClient.tsx

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import ComingSoonModal from "@/components/shop/ComingSoonModal";
import SharedProductCard, { type SharedProduct } from "@/components/shop/SharedProductCard";
import { PHONES, type ColorVariant, type BrandKey } from "@/lib/phoneCatalog";

// ── Icon image map (same images as MobileCategories) ──────────
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

// CSS filter → brand orange (#FB5724)
const BRAND_FILTER =
  "brightness(0) saturate(100%) invert(42%) sepia(97%) saturate(631%) hue-rotate(342deg) brightness(98%) contrast(97%)";

// ─── Product data ──────────────────────────────────────────────
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

const ALL_PHONES: PhoneModel[] = PHONES.map((p) => ({
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

const OTHER_PRODUCTS: Record<string, PhoneModel[]> = {
  charger: [
    { brand: "Anker",  name: "Anker 65W GaN Charger",   slug: "anker-65w-gan",   startingPrice: 3500,  image: "/images/products/iPhone16.webp", badge: "Hot",  badgeColor: "#FB5724", rating: 4.8 },
    { brand: "Baseus", name: "Baseus 100W PD Charger",   slug: "baseus-100w",     startingPrice: 4200,  image: "/images/products/iPhone16.webp", badge: "Sale", badgeColor: "#4FAE53", rating: 4.7 },
    { brand: "Apple",  name: "Apple 20W USB-C",          slug: "apple-20w-usbc",  startingPrice: 2800,  image: "/images/products/iPhone16.webp", rating: 4.5 },
    { brand: "Xiaomi", name: "Xiaomi 120W HyperCharge",  slug: "xiaomi-120w",     startingPrice: 3200,  image: "/images/products/iPhone16.webp", badge: "New",  badgeColor: "#7C3AED", rating: 4.6 },
  ],
  speaker: [
    { brand: "JBL",  name: "JBL Charge 5",   slug: "jbl-charge-5",  startingPrice: 18000, image: "/images/products/iPhone16.webp", badge: "Sale", badgeColor: "#4FAE53", rating: 4.7 },
    { brand: "Sony", name: "Sony SRS-XB43",  slug: "sony-srs-xb43", startingPrice: 25000, image: "/images/products/iPhone16.webp", badge: "Hot",  badgeColor: "#FB5724", rating: 4.8 },
    { brand: "JBL",  name: "JBL Flip 6",     slug: "jbl-flip-6",    startingPrice: 12000, image: "/images/products/iPhone16.webp", rating: 4.6 },
    { brand: "Sony", name: "Sony SRS-XE200", slug: "sony-srs-xe200",startingPrice: 9500,  image: "/images/products/iPhone16.webp", rating: 4.4 },
  ],
  earbuds: [
    { brand: "Apple",   name: "AirPods Pro 2nd Gen", slug: "airpods-pro-2",     startingPrice: 38000, image: "/images/products/iPhone16.webp", badge: "Hot",  badgeColor: "#FB5724", rating: 4.9 },
    { brand: "Samsung", name: "Galaxy Buds2 Pro",    slug: "galaxy-buds2-pro",  startingPrice: 18000, image: "/images/products/iPhone16.webp", rating: 4.6 },
    { brand: "OnePlus", name: "OnePlus Buds Pro 2",  slug: "oneplus-buds-pro-2",startingPrice: 14000, image: "/images/products/iPhone16.webp", badge: "Sale", badgeColor: "#4FAE53", rating: 4.5 },
    { brand: "JBL",     name: "JBL Tune Flex",       slug: "jbl-tune-flex",     startingPrice: 6500,  image: "/images/products/iPhone16.webp", rating: 4.3 },
  ],
  powerbank: [
    { brand: "Anker",  name: "Anker 20000mAh 65W",    slug: "anker-pb-20k",  startingPrice: 5500,  image: "/images/products/iPhone16.webp", badge: "Hot",  badgeColor: "#FB5724", rating: 4.8 },
    { brand: "Baseus", name: "Baseus 30000mAh 65W",   slug: "baseus-pb-30k", startingPrice: 6800,  image: "/images/products/iPhone16.webp", badge: "New",  badgeColor: "#7C3AED", rating: 4.7 },
    { brand: "Xiaomi", name: "Xiaomi 10000mAh 22.5W", slug: "xiaomi-pb-10k", startingPrice: 2200,  image: "/images/products/iPhone16.webp", rating: 4.5 },
  ],
  cables: [
    { brand: "Anker",  name: "Anker USB-C to USB-C 2m", slug: "anker-usbc-2m",     startingPrice: 1200, image: "/images/products/iPhone16.webp", badge: "Best Seller", badgeColor: "#4FAE53", rating: 4.7 },
    { brand: "Apple",  name: "Apple Lightning 2m",       slug: "apple-lightning-2m",startingPrice: 2500, image: "/images/products/iPhone16.webp", badge: "Original",    badgeColor: "#1d1d1f", rating: 4.6 },
    { brand: "Baseus", name: "Baseus 100W USB-C 3m",     slug: "baseus-usbc-100w",  startingPrice: 1800, image: "/images/products/iPhone16.webp", rating: 4.5 },
  ],
  accessories: [
    { brand: "Spigen", name: "Spigen iPhone 16 Case",  slug: "spigen-ip16-case", startingPrice: 1800, image: "/images/products/iPhone16.webp", badge: "Hot",  badgeColor: "#FB5724", rating: 4.7 },
    { brand: "ZAGG",   name: "ZAGG Glass Screen Guard", slug: "zagg-glass",       startingPrice: 2200, image: "/images/products/iPhone16.webp", rating: 4.5 },
    { brand: "ESR",    name: "ESR Magsafe Case",        slug: "esr-magsafe",      startingPrice: 1500, image: "/images/products/iPhone16.webp", badge: "New",  badgeColor: "#7C3AED", rating: 4.4 },
    { brand: "Anker",  name: "Anker MagSafe Charger",   slug: "anker-magsafe",    startingPrice: 3200, image: "/images/products/iPhone16.webp", rating: 4.6 },
  ],
};

// ── Price ranges ───────────────────────────────────────────────
const PRICE_RANGES = [
  { label: "সব দাম",           min: 0,      max: Infinity },
  { label: "৳10,000 এর নিচে", min: 0,      max: 9999     },
  { label: "৳10k – ৳50k",    min: 10000,  max: 50000    },
  { label: "৳50k – ৳1L",     min: 50001,  max: 100000   },
  { label: "৳1L এর উপরে",    min: 100001, max: Infinity  },
];

// ── modelToShared ──────────────────────────────────────────────
function modelToShared(model: PhoneModel): SharedProduct {
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
    badge: model.badge,
    badgeColor: model.badgeColor ?? "#FB5724",
    showStartingFrom: true,
  };
}

// ── Props ──────────────────────────────────────────────────────
interface Props {
  slug: string;
  label: string;
  icon: string;
  description: string;
  isEnabled: boolean;
}

// ── BrandDropdown ──────────────────────────────────────────────
function BrandDropdown({
  brands,
  activeBrand,
  onChange,
}: {
  brands: string[];
  activeBrand: string;
  onChange: (b: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-sm hover:border-orange-300 transition-colors"
      >
        {activeBrand === "All" ? "সব Brand" : activeBrand}
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl z-40 min-w-[140px] overflow-hidden">
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => { onChange(b); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-xs font-medium border-b last:border-b-0 border-gray-50 transition-colors
                ${activeBrand === b
                  ? "bg-orange-50 text-orange-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              {b === "All" ? "সব Brand" : b}
            </button>
          ))}
        </div>
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
        <SlidersHorizontal size={13} className="text-orange-500" />
        {current}
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

// ── Main Component ─────────────────────────────────────────────
export default function CategoryPageClient({ slug, label, icon, description, isEnabled }: Props) {
  const [showComingSoon, setShowComingSoon] = useState(!isEnabled);
  const [activeBrand,    setActiveBrand]    = useState("All");
  const [priceRange,     setPriceRange]     = useState(0);
  const [sortBy,         setSortBy]         = useState<"featured" | "price-asc" | "price-desc">("featured");
  const addItem = useCartStore((s) => s.addItem);

  const iconSrc = ICON_MAP[slug];

  const allProducts = useMemo(() => {
    if (slug === "iphone")  return ALL_PHONES.filter((p) => p.brand === "Apple");
    if (slug === "android") return ALL_PHONES.filter((p) => p.brand !== "Apple");
    return OTHER_PRODUCTS[slug] ?? [];
  }, [slug]);

  // Distinct brands for the dropdown
  const brands = useMemo(() => {
    const b = [...new Set(allProducts.map((p) => p.brand))];
    return ["All", ...b];
  }, [allProducts]);

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (activeBrand !== "All") list = list.filter((p) => p.brand === activeBrand);
    const range = PRICE_RANGES[priceRange];
    list = list.filter((p) => p.startingPrice >= range.min && p.startingPrice <= range.max);
    if (sortBy === "price-asc")  list.sort((a, b) => a.startingPrice - b.startingPrice);
    if (sortBy === "price-desc") list.sort((a, b) => b.startingPrice - a.startingPrice);
    return list;
  }, [allProducts, activeBrand, priceRange, sortBy]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="px-4 py-2.5 flex items-center gap-1.5 text-xs text-gray-400 bg-white border-b border-gray-100">
        <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">{label}</span>
      </div>

      {/* Category Hero */}
      <div className="bg-white px-4 pt-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Icon — image if available, fallback emoji */}
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
            {iconSrc ? (
              <Image
                src={iconSrc}
                alt={label}
                width={36}
                height={36}
                className="object-contain"
                style={{ filter: BRAND_FILTER }}
              />
            ) : (
              <span className="text-2xl">{icon}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-extrabold text-gray-900">{label}</h1>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{description}</p>
          </div>
          <div className="shrink-0 bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full">
            {filtered.length} items
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white sticky top-0 z-30 border-b border-gray-100 px-4 py-2.5">
        {/* Row 1: Price range chips */}
        <div
          className="flex gap-1.5 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {PRICE_RANGES.map((r, i) => (
            <button
              key={i}
              onClick={() => setPriceRange(i)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border flex-shrink-0
                ${priceRange === i
                  ? "border-orange-500 bg-orange-500 text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Row 2: Brand dropdown + Sort dropdown */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          {brands.length > 2 ? (
            <BrandDropdown
              brands={brands}
              activeBrand={activeBrand}
              onChange={setActiveBrand}
            />
          ) : (
            <div />
          )}
          <SortDropdown sortBy={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-400 px-4">
          <p className="text-3xl mb-3">🔍</p>
          <p className="font-semibold text-gray-600">কোনো product পাওয়া যায়নি</p>
          <p className="text-sm mt-1">Filter পরিবর্তন করে আবার চেষ্টা করুন</p>
          <button
            onClick={() => { setActiveBrand("All"); setPriceRange(0); }}
            className="mt-4 text-orange-500 text-sm font-semibold underline"
          >
            সব filter সরান
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 pt-4 pb-6 sm:grid-cols-3 lg:grid-cols-4 isolate">
          {filtered.map((model) => (
            <SharedProductCard
              key={model.slug}
              product={modelToShared(model)}
              onAddToCart={(p) => {
                addItem({
                  id: p.id, name: p.name, variant: p.variant ?? "",
                  price: p.price, original_price: p.originalPrice,
                  rating: p.rating ?? 0, review_count: 0,
                  image: p.image, slug: p.slug,
                  badge: p.badge, badge_color: p.badgeColor,
                } as never);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
