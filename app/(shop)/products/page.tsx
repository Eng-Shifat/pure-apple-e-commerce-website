"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight, SlidersHorizontal, X, ShoppingCart,
  Heart, Zap, Star, BadgeCheck, RefreshCw, Search,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";
import { BrandLogo } from "@/components/shop/BrandIcons";

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
}

const ALL_MODELS: PhoneModel[] = [
  // ── Apple Brand New ──
  { brand:"Apple", name:"iPhone 18 Pro Max", slug:"iphone-18-pro-max",    startingPrice:179999, image:"/images/products/iPhone16.webp", badge:"New",         badgeColor:"#7C3AED", rating:4.9 },
  { brand:"Apple", name:"iPhone 18 Pro",     slug:"iphone-18-pro",        startingPrice:159999, image:"/images/products/iPhone16.webp", badge:"New",         badgeColor:"#7C3AED", rating:4.9 },
  { brand:"Apple", name:"iPhone 17 Pro Max", slug:"iphone-17-pro-max",    startingPrice:154999, image:"/images/products/iPhone16.webp", badge:"Hot",         badgeColor:"#FB5724", rating:4.8, discount:5 },
  { brand:"Apple", name:"iPhone 17 Pro",     slug:"iphone-17-pro",        startingPrice:134999, image:"/images/products/iPhone16.webp", rating:4.8, discount:5 },
  { brand:"Apple", name:"iPhone 17",         slug:"iphone-17",            startingPrice:109999, image:"/images/products/iPhone16.webp", rating:4.7 },
  { brand:"Apple", name:"iPhone 17 Air",     slug:"iphone-17-air",        startingPrice:119999, image:"/images/products/iPhone16.webp", badge:"Slim",        badgeColor:"#0284C7", rating:4.7 },
  { brand:"Apple", name:"iPhone 16 Pro Max", slug:"iphone-16-pro-max",    startingPrice:139999, image:"/images/products/iPhone16.webp", rating:4.8, discount:8 },
  { brand:"Apple", name:"iPhone 16 Pro",     slug:"iphone-16-pro",        startingPrice:119999, image:"/images/products/iPhone16.webp", badge:"Best Seller", badgeColor:"#4FAE53", rating:4.8, discount:8 },
  { brand:"Apple", name:"iPhone 16",         slug:"iphone-16",            startingPrice:94999,  image:"/images/products/iPhone16.webp", rating:4.6 },
  { brand:"Apple", name:"iPhone 16e",        slug:"iphone-16e",           startingPrice:74999,  image:"/images/products/iPhone16.webp", rating:4.5 },
  // ── Samsung Brand New ──
  { brand:"Samsung", name:"Galaxy S25 Ultra", slug:"galaxy-s25-ultra",   startingPrice:174999, image:"/images/products/Samsung Galaxy S24.webp", badge:"New", badgeColor:"#7C3AED", rating:4.9 },
  { brand:"Samsung", name:"Galaxy S25+",      slug:"galaxy-s25-plus",    startingPrice:139999, image:"/images/products/Samsung Galaxy S24.webp", badge:"New", badgeColor:"#7C3AED", rating:4.8 },
  { brand:"Samsung", name:"Galaxy S25",       slug:"galaxy-s25",         startingPrice:119999, image:"/images/products/Samsung Galaxy S24.webp", rating:4.7 },
  { brand:"Samsung", name:"Galaxy S24 Ultra", slug:"galaxy-s24-ultra",   startingPrice:154999, image:"/images/products/Samsung Galaxy S24.webp", badge:"Hot", badgeColor:"#FB5724", rating:4.8, discount:10 },
  { brand:"Samsung", name:"Galaxy S24+",      slug:"galaxy-s24-plus",    startingPrice:119999, image:"/images/products/Samsung Galaxy S24.webp", rating:4.7, discount:10 },
  { brand:"Samsung", name:"Galaxy S24",       slug:"galaxy-s24",         startingPrice:99999,  image:"/images/products/Samsung Galaxy S24.webp", badge:"Best Seller", badgeColor:"#4FAE53", rating:4.7, discount:9 },
  { brand:"Samsung", name:"Galaxy A55",       slug:"galaxy-a55",         startingPrice:54999,  image:"/images/products/Samsung Galaxy S24.webp", rating:4.4 },
  { brand:"Samsung", name:"Galaxy A35",       slug:"galaxy-a35",         startingPrice:39999,  image:"/images/products/Samsung Galaxy S24.webp", rating:4.3 },
  // ── OnePlus ──
  { brand:"OnePlus", name:"OnePlus 13",       slug:"oneplus-13",         startingPrice:109999, image:"/images/products/OnePlus 12.webp", badge:"New", badgeColor:"#7C3AED", rating:4.8 },
  { brand:"OnePlus", name:"OnePlus 12",       slug:"oneplus-12",         startingPrice:89999,  image:"/images/products/OnePlus 12.webp", badge:"Hot", badgeColor:"#FB5724", rating:4.7, discount:8 },
  { brand:"OnePlus", name:"OnePlus 12R",      slug:"oneplus-12r",        startingPrice:64999,  image:"/images/products/OnePlus 12.webp", rating:4.5 },
  { brand:"OnePlus", name:"OnePlus Nord 4",   slug:"oneplus-nord-4",     startingPrice:44999,  image:"/images/products/OnePlus 12.webp", rating:4.4 },
  { brand:"OnePlus", name:"OnePlus Nord CE4", slug:"oneplus-nord-ce4",   startingPrice:29999,  image:"/images/products/OnePlus 12.webp", rating:4.2 },
  // ── Redmi ──
  { brand:"Redmi", name:"Redmi Note 14 Pro+", slug:"redmi-note-14-pro-plus", startingPrice:44999, image:"/images/products/iPhone16.webp", badge:"New", badgeColor:"#7C3AED", rating:4.5 },
  { brand:"Redmi", name:"Redmi Note 14 Pro",  slug:"redmi-note-14-pro",      startingPrice:34999, image:"/images/products/iPhone16.webp", rating:4.4 },
  { brand:"Redmi", name:"Redmi Note 14",      slug:"redmi-note-14",          startingPrice:24999, image:"/images/products/iPhone16.webp", rating:4.3 },
  { brand:"Redmi", name:"Redmi 14C",          slug:"redmi-14c",              startingPrice:14999, image:"/images/products/iPhone16.webp", rating:4.1 },
  // ── Realme ──
  { brand:"Realme", name:"Realme GT 7 Pro",  slug:"realme-gt-7-pro",  startingPrice:69999, image:"/images/products/iPhone16.webp", badge:"New", badgeColor:"#7C3AED", rating:4.6 },
  { brand:"Realme", name:"Realme 13 Pro+",   slug:"realme-13-pro-plus", startingPrice:44999, image:"/images/products/iPhone16.webp", rating:4.4 },
  { brand:"Realme", name:"Realme 13 Pro",    slug:"realme-13-pro",    startingPrice:34999, image:"/images/products/iPhone16.webp", rating:4.3 },
  { brand:"Realme", name:"Realme C75",       slug:"realme-c75",       startingPrice:19999, image:"/images/products/iPhone16.webp", rating:4.1 },
  // ── Nothing ──
  { brand:"Nothing", name:"Nothing Phone 3",   slug:"nothing-phone-3",   startingPrice:89999, image:"/images/products/iPhone16.webp", badge:"New", badgeColor:"#111", rating:4.7 },
  { brand:"Nothing", name:"Nothing Phone 2a+", slug:"nothing-phone-2a-plus", startingPrice:44999, image:"/images/products/iPhone16.webp", rating:4.5 },
  { brand:"Nothing", name:"Nothing Phone 2a",  slug:"nothing-phone-2a",  startingPrice:34999, image:"/images/products/iPhone16.webp", rating:4.4 },
  // ── Motorola ──
  { brand:"Motorola", name:"Motorola Edge 50 Ultra", slug:"moto-edge-50-ultra", startingPrice:79999, image:"/images/products/iPhone16.webp", badge:"Hot", badgeColor:"#FB5724", rating:4.6 },
  { brand:"Motorola", name:"Motorola Edge 50 Pro",   slug:"moto-edge-50-pro",   startingPrice:54999, image:"/images/products/iPhone16.webp", rating:4.4 },
  { brand:"Motorola", name:"Moto G85",               slug:"moto-g85",           startingPrice:29999, image:"/images/products/iPhone16.webp", rating:4.2 },
  // ── Vivo ──
  { brand:"Vivo", name:"Vivo X200 Pro",  slug:"vivo-x200-pro",  startingPrice:109999, image:"/images/products/iPhone16.webp", badge:"New", badgeColor:"#7C3AED", rating:4.7 },
  { brand:"Vivo", name:"Vivo X200",      slug:"vivo-x200",      startingPrice:84999,  image:"/images/products/iPhone16.webp", rating:4.5 },
  { brand:"Vivo", name:"Vivo V40 Pro",   slug:"vivo-v40-pro",   startingPrice:54999,  image:"/images/products/iPhone16.webp", rating:4.4 },
  { brand:"Vivo", name:"Vivo V40",       slug:"vivo-v40",       startingPrice:39999,  image:"/images/products/iPhone16.webp", rating:4.2 },
  // ── Honor ──
  { brand:"Honor", name:"Honor Magic 7 Pro", slug:"honor-magic-7-pro", startingPrice:99999, image:"/images/products/iPhone16.webp", badge:"New", badgeColor:"#7C3AED", rating:4.7 },
  { brand:"Honor", name:"Honor 200 Pro",     slug:"honor-200-pro",     startingPrice:69999, image:"/images/products/iPhone16.webp", rating:4.5 },
  { brand:"Honor", name:"Honor 200",         slug:"honor-200",         startingPrice:49999, image:"/images/products/iPhone16.webp", rating:4.3 },
  // ── iQOO ──
  { brand:"iQOO", name:"iQOO 13",       slug:"iqoo-13",       startingPrice:89999, image:"/images/products/iPhone16.webp", badge:"New", badgeColor:"#7C3AED", rating:4.8 },
  { brand:"iQOO", name:"iQOO 12",       slug:"iqoo-12",       startingPrice:69999, image:"/images/products/iPhone16.webp", rating:4.6, discount:10 },
  { brand:"iQOO", name:"iQOO Neo 9 Pro",slug:"iqoo-neo-9-pro",startingPrice:49999, image:"/images/products/iPhone16.webp", rating:4.5 },
];

// Apple Pre-Owned
const APPLE_PREOWNED: PhoneModel[] = [
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

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
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
];

const PRICE_RANGES = [
  { label:"Under ৳30,000",    min:0,      max:29999  },
  { label:"৳30,000 – ৳60,000", min:30000,  max:60000  },
  { label:"৳60,000 – ৳1 Lakh", min:60001,  max:100000 },
  { label:"Above ৳1 Lakh",    min:100001, max:Infinity},
];

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

// ─── Model Card ───────────────────────────────────────────────────────────────

function ModelCard({ model, isPreOwned }: { model: PhoneModel; isPreOwned: boolean }) {
  const [wished, setWished] = useState(false);
  const [added,  setAdded]  = useState(false);
  const addItem = useCartStore(s => s.addItem);

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
      <div className="relative bg-[#F7F8FA] overflow-hidden" style={{ height: "180px" }}>
        {model.badge && (
          <span className="absolute top-2.5 left-2.5 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm"
            style={{ backgroundColor: model.badgeColor ?? "#FB5724" }}>
            {model.badge}
          </span>
        )}

        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1.5">
          {model.discount && (
            <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
              -{model.discount}%
            </span>
          )}
          <button onClick={() => setWished(w => !w)}
            className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95
              ${wished ? "bg-red-500" : "bg-white border border-gray-200 hover:border-red-300"}`}>
            <Heart size={13} className={wished ? "fill-white text-white" : "text-gray-400 group-hover:text-red-400 transition-colors"} />
          </button>
        </div>

        <Link href={`/products/${model.slug}`} className="absolute inset-0 flex items-center justify-center p-5">
          <div className="relative w-full h-full">
            <Image src={model.image} alt={model.name} fill sizes="200px"
              className="object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg" />
          </div>
        </Link>
      </div>

      {/* Info */}
      <div className="px-3 pt-2.5 pb-3 flex flex-col flex-1">
        <Link href={`/products/${model.slug}`}>
          <h3 className="text-gray-900 font-bold text-[13px] leading-snug hover:text-orange-500 transition-colors line-clamp-1">
            {model.name}
          </h3>
        </Link>

        {model.rating && (
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-semibold text-gray-600">{model.rating}</span>
          </div>
        )}

        {isPreOwned && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {["Like New","Excellent","Good"].map(g => (
              <span key={g} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-green-50 text-green-700">{g}</span>
            ))}
          </div>
        )}

        <div className="mt-2">
          <p className="text-[10px] text-gray-400">Starting from</p>
          <span className="text-gray-900 font-extrabold text-[15px] tracking-tight">
            ৳{model.startingPrice.toLocaleString("en-BD")}
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-1.5 mt-2.5">
          <button onClick={handleAdd}
            className={`h-8 flex items-center justify-center gap-1.5 text-[11px] font-semibold px-3 rounded-lg transition-all active:scale-95 shadow-sm
              ${added ? "bg-green-500 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"}`}>
            <ShoppingCart size={12} className="shrink-0" />
            {added ? "Added!" : "Select"}
          </button>
          <Link href={`/products/${model.slug}`}
            className="h-8 flex items-center justify-center gap-1 text-[11px] font-semibold px-3 rounded-lg border-2 border-orange-200 text-orange-500 hover:bg-orange-50 transition-all">
            <Zap size={11} className="shrink-0" />
            Buy
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [condition,       setCondition]       = useState<Condition>("brand-new");
  const searchParams = useSearchParams();

  // Map URL slug (e.g. "apple") → brand name (e.g. "Apple")
  const SLUG_TO_BRAND: Record<string, string> = {
    apple: "Apple", samsung: "Samsung", oneplus: "OnePlus",
    redmi: "Redmi", realme: "Realme", nothing: "Nothing",
    motorola: "Motorola", vivo: "Vivo", honor: "Honor", iqoo: "iQOO", google: "Google",
  };

  const [activeCategory,  setActiveCategory]  = useState("Apple");

  // Sync brand from URL param on mount and when URL changes
  useEffect(() => {
    const categoryParam = searchParams.get("category") ?? "";
    const brand = SLUG_TO_BRAND[categoryParam.toLowerCase()];
    if (brand) setActiveCategory(brand);
  }, [searchParams]);
  const [sidebarOpen,     setSidebarOpen]     = useState(false);
  const [search,          setSearch]          = useState("");
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

  // Source pool — brand-new uses ALL_MODELS, pre-owned only has Apple list (extend as needed)
  const pool = useMemo(() => {
    if (condition === "pre-owned") return APPLE_PREOWNED.filter(m => m.brand === activeCategory);
    return ALL_MODELS.filter(m => m.brand === activeCategory);
  }, [condition, activeCategory]);

  // Apply search + price filter + sort
  const filtered = useMemo(() => {
    let list = pool;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q));
    }

    // Price range
    if (activePriceRanges.length > 0) {
      list = list.filter(m =>
        activePriceRanges.some(r => m.startingPrice >= r.min && m.startingPrice <= r.max)
      );
    }

    // Sort
    return [...list].sort((a, b) => {
      if (sortKey === "price-asc")  return a.startingPrice - b.startingPrice;
      if (sortKey === "price-desc") return b.startingPrice - a.startingPrice;
      if (sortKey === "rating")     return (b.rating ?? 0) - (a.rating ?? 0);
      return 0; // featured — original order
    });
  }, [pool, search, activePriceRanges, sortKey]);

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
                {activeCategory} Smartphones
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
                        <BrandLogo brand={cat.key} className="w-4 h-4" />
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
                  ? <><BadgeCheck size={13} /> Brand New — {activeCategory}</>
                  : <><RefreshCw size={12} /> Pre-Owned — {activeCategory}</>}
              </div>
              <span className="text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filtered.map(model => (
                  <ModelCard key={model.slug} model={model} isPreOwned={condition === "pre-owned"} />
                ))}
              </div>
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
