"use client";

// app/(shop)/category/[slug]/CategoryPageClient.tsx
// ─────────────────────────────────────────────────────────────
// Client wrapper — handles Coming Soon popup + filters
// ─────────────────────────────────────────────────────────────

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ShoppingCart, Heart, Star, SlidersHorizontal } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";
import ComingSoonModal from "@/components/shop/ComingSoonModal";

// ─── Product data ──────────────────────────────────────────────
// iPhone & Android share the same PhoneModel pool from products/page.tsx
// Other categories have their own product arrays

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
}

// Re-use the same data from your existing products page
const ALL_PHONES: PhoneModel[] = [
  // Apple
  { brand: "Apple", name: "iPhone 18 Pro Max", slug: "iphone-18-pro-max", startingPrice: 179999, image: "/images/products/iPhone16.webp", badge: "New", badgeColor: "#7C3AED", rating: 4.9 },
  { brand: "Apple", name: "iPhone 18 Pro",     slug: "iphone-18-pro",     startingPrice: 159999, image: "/images/products/iPhone16.webp", badge: "New", badgeColor: "#7C3AED", rating: 4.9 },
  { brand: "Apple", name: "iPhone 17 Pro Max", slug: "iphone-17-pro-max", startingPrice: 154999, image: "/images/products/iPhone16.webp", badge: "Hot", badgeColor: "#FB5724", rating: 4.8, discount: 5 },
  { brand: "Apple", name: "iPhone 17 Pro",     slug: "iphone-17-pro",     startingPrice: 134999, image: "/images/products/iPhone16.webp", rating: 4.8, discount: 5 },
  { brand: "Apple", name: "iPhone 17",         slug: "iphone-17",         startingPrice: 109999, image: "/images/products/iPhone16.webp", rating: 4.7 },
  { brand: "Apple", name: "iPhone 17 Air",     slug: "iphone-17-air",     startingPrice: 119999, image: "/images/products/iPhone16.webp", badge: "Slim", badgeColor: "#0284C7", rating: 4.7 },
  { brand: "Apple", name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max", startingPrice: 139999, image: "/images/products/iPhone16.webp", rating: 4.8, discount: 8 },
  { brand: "Apple", name: "iPhone 16 Pro",     slug: "iphone-16-pro",     startingPrice: 119999, image: "/images/products/iPhone16.webp", badge: "Best Seller", badgeColor: "#4FAE53", rating: 4.8, discount: 8 },
  { brand: "Apple", name: "iPhone 16",         slug: "iphone-16",         startingPrice: 94999,  image: "/images/products/iPhone16.webp", rating: 4.6 },
  { brand: "Apple", name: "iPhone 16e",        slug: "iphone-16e",        startingPrice: 74999,  image: "/images/products/iPhone16.webp", rating: 4.5 },
  // Samsung
  { brand: "Samsung", name: "Galaxy S25 Ultra", slug: "galaxy-s25-ultra", startingPrice: 174999, image: "/images/products/Samsung Galaxy S24.webp", badge: "New", badgeColor: "#7C3AED", rating: 4.9 },
  { brand: "Samsung", name: "Galaxy S25+",      slug: "galaxy-s25-plus",  startingPrice: 139999, image: "/images/products/Samsung Galaxy S24.webp", badge: "New", badgeColor: "#7C3AED", rating: 4.8 },
  { brand: "Samsung", name: "Galaxy S25",       slug: "galaxy-s25",       startingPrice: 119999, image: "/images/products/Samsung Galaxy S24.webp", rating: 4.7 },
  { brand: "Samsung", name: "Galaxy S24 Ultra", slug: "galaxy-s24-ultra", startingPrice: 154999, image: "/images/products/Samsung Galaxy S24.webp", badge: "Hot", badgeColor: "#FB5724", rating: 4.8, discount: 10 },
  { brand: "Samsung", name: "Galaxy A55",       slug: "galaxy-a55",       startingPrice: 54999,  image: "/images/products/Samsung Galaxy S24.webp", rating: 4.4 },
  { brand: "Samsung", name: "Galaxy A35",       slug: "galaxy-a35",       startingPrice: 39999,  image: "/images/products/Samsung Galaxy S24.webp", rating: 4.3 },
  // OnePlus
  { brand: "OnePlus", name: "OnePlus 13",       slug: "oneplus-13",       startingPrice: 109999, image: "/images/products/OnePlus 12.webp", badge: "New", badgeColor: "#7C3AED", rating: 4.8 },
  { brand: "OnePlus", name: "OnePlus 12",       slug: "oneplus-12",       startingPrice: 89999,  image: "/images/products/OnePlus 12.webp", badge: "Hot", badgeColor: "#FB5724", rating: 4.7, discount: 8 },
  { brand: "OnePlus", name: "OnePlus 12R",      slug: "oneplus-12r",      startingPrice: 64999,  image: "/images/products/OnePlus 12.webp", rating: 4.5 },
  { brand: "OnePlus", name: "OnePlus Nord 4",   slug: "oneplus-nord-4",   startingPrice: 44999,  image: "/images/products/OnePlus 12.webp", rating: 4.4 },
  // Redmi
  { brand: "Redmi", name: "Redmi Note 14 Pro+", slug: "redmi-note-14-pro-plus", startingPrice: 44999, image: "/images/products/iPhone16.webp", badge: "New", badgeColor: "#7C3AED", rating: 4.5 },
  { brand: "Redmi", name: "Redmi Note 14 Pro",  slug: "redmi-note-14-pro",      startingPrice: 34999, image: "/images/products/iPhone16.webp", rating: 4.4 },
  { brand: "Redmi", name: "Redmi Note 14",      slug: "redmi-note-14",          startingPrice: 24999, image: "/images/products/iPhone16.webp", rating: 4.3 },
  // Realme
  { brand: "Realme", name: "Realme GT 7 Pro",  slug: "realme-gt-7-pro",   startingPrice: 69999, image: "/images/products/iPhone16.webp", badge: "New", badgeColor: "#7C3AED", rating: 4.6 },
  { brand: "Realme", name: "Realme 13 Pro+",   slug: "realme-13-pro-plus", startingPrice: 44999, image: "/images/products/iPhone16.webp", rating: 4.4 },
  // Nothing
  { brand: "Nothing", name: "Nothing Phone 3",  slug: "nothing-phone-3",  startingPrice: 89999, image: "/images/products/iPhone16.webp", badge: "New", badgeColor: "#111", rating: 4.7 },
  { brand: "Nothing", name: "Nothing Phone 2a", slug: "nothing-phone-2a", startingPrice: 34999, image: "/images/products/iPhone16.webp", rating: 4.4 },
];

// Products for non-phone categories
// (Replace with real DB fetch later)
const OTHER_PRODUCTS: Record<string, PhoneModel[]> = {
  charger: [
    { brand: "Anker",  name: "Anker 65W GaN Charger",  slug: "anker-65w-gan",  startingPrice: 3500,  image: "/images/products/iPhone16.webp", badge: "Hot",  badgeColor: "#FB5724", rating: 4.8 },
    { brand: "Baseus", name: "Baseus 100W PD Charger",  slug: "baseus-100w",    startingPrice: 4200,  image: "/images/products/iPhone16.webp", badge: "Sale", badgeColor: "#4FAE53", rating: 4.7 },
    { brand: "Apple",  name: "Apple 20W USB-C",         slug: "apple-20w-usbc", startingPrice: 2800,  image: "/images/products/iPhone16.webp", rating: 4.5 },
    { brand: "Xiaomi", name: "Xiaomi 120W HyperCharge", slug: "xiaomi-120w",    startingPrice: 3200,  image: "/images/products/iPhone16.webp", badge: "New",  badgeColor: "#7C3AED", rating: 4.6 },
  ],
  speaker: [
    { brand: "JBL",  name: "JBL Charge 5",      slug: "jbl-charge-5",    startingPrice: 18000, image: "/images/products/iPhone16.webp", badge: "Sale", badgeColor: "#4FAE53", rating: 4.7 },
    { brand: "Sony", name: "Sony SRS-XB43",      slug: "sony-srs-xb43",   startingPrice: 25000, image: "/images/products/iPhone16.webp", badge: "Hot",  badgeColor: "#FB5724", rating: 4.8 },
    { brand: "JBL",  name: "JBL Flip 6",         slug: "jbl-flip-6",      startingPrice: 12000, image: "/images/products/iPhone16.webp", rating: 4.6 },
    { brand: "Sony", name: "Sony SRS-XE200",      slug: "sony-srs-xe200",  startingPrice: 9500,  image: "/images/products/iPhone16.webp", rating: 4.4 },
  ],
  earbuds: [
    { brand: "Apple",   name: "AirPods Pro 2nd Gen",   slug: "airpods-pro-2",     startingPrice: 38000, image: "/images/products/iPhone16.webp", badge: "Hot",  badgeColor: "#FB5724", rating: 4.9 },
    { brand: "Samsung", name: "Galaxy Buds2 Pro",       slug: "galaxy-buds2-pro",  startingPrice: 18000, image: "/images/products/iPhone16.webp", rating: 4.6 },
    { brand: "OnePlus", name: "OnePlus Buds Pro 2",     slug: "oneplus-buds-pro-2", startingPrice: 14000, image: "/images/products/iPhone16.webp", badge: "Sale", badgeColor: "#4FAE53", rating: 4.5 },
    { brand: "JBL",     name: "JBL Tune Flex",          slug: "jbl-tune-flex",     startingPrice: 6500,  image: "/images/products/iPhone16.webp", rating: 4.3 },
  ],
  powerbank: [
    { brand: "Anker",   name: "Anker 20000mAh 65W",     slug: "anker-pb-20k",      startingPrice: 5500,  image: "/images/products/iPhone16.webp", badge: "Hot",  badgeColor: "#FB5724", rating: 4.8 },
    { brand: "Baseus",  name: "Baseus 30000mAh 65W",    slug: "baseus-pb-30k",     startingPrice: 6800,  image: "/images/products/iPhone16.webp", badge: "New",  badgeColor: "#7C3AED", rating: 4.7 },
    { brand: "Xiaomi",  name: "Xiaomi 10000mAh 22.5W",  slug: "xiaomi-pb-10k",     startingPrice: 2200,  image: "/images/products/iPhone16.webp", rating: 4.5 },
  ],
  cables: [
    { brand: "Anker",  name: "Anker USB-C to USB-C 2m", slug: "anker-usbc-2m",     startingPrice: 1200,  image: "/images/products/iPhone16.webp", badge: "Best Seller", badgeColor: "#4FAE53", rating: 4.7 },
    { brand: "Apple",  name: "Apple Lightning 2m",       slug: "apple-lightning-2m", startingPrice: 2500, image: "/images/products/iPhone16.webp", badge: "Original",    badgeColor: "#1d1d1f", rating: 4.6 },
    { brand: "Baseus", name: "Baseus 100W USB-C 3m",     slug: "baseus-usbc-100w",  startingPrice: 1800,  image: "/images/products/iPhone16.webp", rating: 4.5 },
  ],
  accessories: [
    { brand: "Spigen",  name: "Spigen iPhone 16 Case",    slug: "spigen-ip16-case",  startingPrice: 1800, image: "/images/products/iPhone16.webp", badge: "Hot", badgeColor: "#FB5724", rating: 4.7 },
    { brand: "ZAGG",    name: "ZAGG Glass Screen Guard",   slug: "zagg-glass",        startingPrice: 2200, image: "/images/products/iPhone16.webp", rating: 4.5 },
    { brand: "ESR",     name: "ESR Magsafe Case",          slug: "esr-magsafe",       startingPrice: 1500, image: "/images/products/iPhone16.webp", badge: "New", badgeColor: "#7C3AED", rating: 4.4 },
    { brand: "Anker",   name: "Anker MagSafe Charger",     slug: "anker-magsafe",     startingPrice: 3200, image: "/images/products/iPhone16.webp", rating: 4.6 },
  ],
};

// ── Brand filter options per category ─────────────────────────
function getBrands(slug: string, products: PhoneModel[]): string[] {
  const brands = [...new Set(products.map((p) => p.brand))];
  return ["All", ...brands];
}

// ── Price ranges ───────────────────────────────────────────────
const PRICE_RANGES = [
  { label: "সব দাম",           min: 0,      max: Infinity },
  { label: "৳10,000 এর নিচে", min: 0,      max: 9999     },
  { label: "৳10k – ৳50k",    min: 10000,  max: 50000    },
  { label: "৳50k – ৳1L",     min: 50001,  max: 100000   },
  { label: "৳1L এর উপরে",    min: 100001, max: Infinity  },
];

// ── Product Card ───────────────────────────────────────────────
function ProductCard({ model }: { model: PhoneModel }) {
  const [wished, setWished] = useState(false);
  const [added,  setAdded]  = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  function handleAdd() {
    const p: Product = {
      id: model.slug, name: model.name, variant: "", price: model.startingPrice,
      rating: model.rating ?? 0, review_count: 0, image: model.image, slug: model.slug,
      badge: model.badge, badge_color: model.badgeColor,
    };
    addItem(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative bg-[#F7F8FA] overflow-hidden" style={{ height: "160px" }}>
        {model.badge && (
          <span className="absolute top-2.5 left-2.5 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10"
            style={{ backgroundColor: model.badgeColor ?? "#FB5724" }}>
            {model.badge}
          </span>
        )}
        {model.discount && (
          <span className="absolute top-2.5 right-8 bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full z-10">
            -{model.discount}%
          </span>
        )}
        <button
          onClick={() => setWished((w) => !w)}
          className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full flex items-center justify-center shadow transition-all hover:scale-110
            ${wished ? "bg-red-500" : "bg-white border border-gray-200"}`}>
          <Heart size={13} className={wished ? "fill-white text-white" : "text-gray-400"} />
        </button>
        <Link href={`/products/${model.slug}`} className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative w-full h-full">
            <Image src={model.image} alt={model.name} fill sizes="200px"
              className="object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md" />
          </div>
        </Link>
      </div>

      {/* Info */}
      <div className="px-3 pt-2 pb-3 flex flex-col flex-1">
        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">{model.brand}</p>
        <Link href={`/products/${model.slug}`}>
          <h3 className="text-gray-900 font-bold text-[13px] leading-snug hover:text-orange-500 transition-colors line-clamp-2 mt-0.5">
            {model.name}
          </h3>
        </Link>
        {model.rating && (
          <div className="flex items-center gap-1 mt-1">
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-semibold text-gray-500">{model.rating}</span>
          </div>
        )}
        <div className="mt-auto pt-2">
          <p className="text-[10px] text-gray-400">Starting from</p>
          <p className="text-gray-900 font-extrabold text-[15px]">
            ৳{model.startingPrice.toLocaleString("en-BD")}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className={`w-full mt-2 h-9 flex items-center justify-center gap-1.5 text-[12px] font-semibold rounded-xl transition-all active:scale-95
            ${added ? "bg-green-500 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"}`}>
          <ShoppingCart size={13} />
          {added ? "Added! ✓" : "Cart-এ Add করুন"}
        </button>
      </div>
    </div>
  );
}

// ── Main Client Component ──────────────────────────────────────

interface Props {
  slug: string;
  label: string;
  icon: string;
  description: string;
  isEnabled: boolean;
}

export default function CategoryPageClient({ slug, label, icon, description, isEnabled }: Props) {
  const [showComingSoon, setShowComingSoon] = useState(!isEnabled);
  const [activeBrand,    setActiveBrand]    = useState("All");
  const [priceRange,     setPriceRange]     = useState(0);
  const [sortBy,         setSortBy]         = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [showFilters,    setShowFilters]     = useState(false);

  // Get products based on slug
  const allProducts = useMemo(() => {
    if (slug === "iphone") {
      return ALL_PHONES.filter((p) => p.brand === "Apple");
    }
    if (slug === "android") {
      return ALL_PHONES.filter((p) => p.brand !== "Apple");
    }
    return OTHER_PRODUCTS[slug] ?? [];
  }, [slug]);

  const brands = useMemo(() => getBrands(slug, allProducts), [slug, allProducts]);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (activeBrand !== "All") list = list.filter((p) => p.brand === activeBrand);
    const range = PRICE_RANGES[priceRange];
    list = list.filter((p) => p.startingPrice >= range.min && p.startingPrice <= range.max);
    if (sortBy === "price-asc")  list.sort((a, b) => a.startingPrice - b.startingPrice);
    if (sortBy === "price-desc") list.sort((a, b) => b.startingPrice - a.startingPrice);
    return list;
  }, [allProducts, activeBrand, priceRange, sortBy]);

  // If disabled → show Coming Soon overlay
  if (!isEnabled || showComingSoon) {
    return (
      <ComingSoonModal
        categoryLabel={label}
        categoryIcon={icon}
        onClose={() => {
          // If user closes it, go back
          if (typeof window !== "undefined") window.history.back();
        }}
      />
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="px-4 py-2.5 flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
        <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">{label}</span>
      </div>

      {/* Category Hero */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl shrink-0">
            {icon}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">{label}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{description}</p>
          </div>
          <div className="ml-auto bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full">
            {filtered.length} items
          </div>
        </div>
      </div>

      {/* Brand Filter Tabs */}
      {brands.length > 2 && (
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4 pb-3 min-w-max">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setActiveBrand(brand)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all
                  ${activeBrand === brand
                    ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                {brand}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="px-4 pb-3 flex items-center gap-2 justify-between">
        {/* Price filter */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide flex-1">
          {PRICE_RANGES.map((r, i) => (
            <button
              key={i}
              onClick={() => setPriceRange(i)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border
                ${priceRange === i
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}>
              {r.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="shrink-0 w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
          <SlidersHorizontal size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Sort Dropdown */}
      {showFilters && (
        <div className="mx-4 mb-3 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
          {[
            { key: "featured",   label: "Featured" },
            { key: "price-asc",  label: "দাম: কম থেকে বেশি" },
            { key: "price-desc", label: "দাম: বেশি থেকে কম" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => { setSortBy(s.key as typeof sortBy); setShowFilters(false); }}
              className={`w-full text-left px-4 py-3 text-sm border-b last:border-b-0 border-gray-100 transition-colors
                ${sortBy === s.key ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-400 px-4">
          <p className="text-3xl mb-3">🔍</p>
          <p className="font-semibold text-gray-600">কোনো product পাওয়া যায়নি</p>
          <p className="text-sm mt-1">Filter পরিবর্তন করে আবার চেষ্টা করুন</p>
          <button
            onClick={() => { setActiveBrand("All"); setPriceRange(0); }}
            className="mt-4 text-orange-500 text-sm font-semibold underline">
            সব filter সরান
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 pb-6 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((model) => (
            <ProductCard key={model.slug} model={model} />
          ))}
        </div>
      )}
    </div>
  );
}
