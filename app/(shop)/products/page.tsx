"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  X,
  ShoppingCart,
  Heart,
  Zap,
  Star,
  BadgeCheck,
  RefreshCw,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
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
}

// ── Brand New Models ─────────────────────────────────────────────────────────
const BRAND_NEW: PhoneModel[] = [
  { name: "iPhone 18 Pro Max", slug: "iphone-18-pro-max", startingPrice: 179999, image: "/images/products/iPhone16.webp", badge: "New", badgeColor: "#7C3AED", rating: 4.9 },
  { name: "iPhone 18 Pro",     slug: "iphone-18-pro",     startingPrice: 159999, image: "/images/products/iPhone16.webp", badge: "New", badgeColor: "#7C3AED", rating: 4.9 },
  { name: "iPhone 17 Pro Max", slug: "iphone-17-pro-max", startingPrice: 154999, image: "/images/products/iPhone16.webp", badge: "Hot", badgeColor: "#FB5724", rating: 4.8, discount: 5 },
  { name: "iPhone 17 Pro",     slug: "iphone-17-pro",     startingPrice: 134999, image: "/images/products/iPhone16.webp", rating: 4.8, discount: 5 },
  { name: "iPhone 17",         slug: "iphone-17",         startingPrice: 109999, image: "/images/products/iPhone16.webp", rating: 4.7 },
  { name: "iPhone 17 Air",     slug: "iphone-17-air",     startingPrice: 119999, image: "/images/products/iPhone16.webp", badge: "Slim", badgeColor: "#0284C7", rating: 4.7 },
  { name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max", startingPrice: 139999, image: "/images/products/iPhone16.webp", rating: 4.8, discount: 8 },
  { name: "iPhone 16 Pro",     slug: "iphone-16-pro",     startingPrice: 119999, image: "/images/products/iPhone16.webp", badge: "Best Seller", badgeColor: "#4FAE53", rating: 4.8, discount: 8 },
  { name: "iPhone 16",         slug: "iphone-16",         startingPrice: 94999,  image: "/images/products/iPhone16.webp", rating: 4.6 },
  { name: "iPhone 16e",        slug: "iphone-16e",        startingPrice: 74999,  image: "/images/products/iPhone16.webp", rating: 4.5 },
];

// ── Pre-Owned Models ─────────────────────────────────────────────────────────
const PRE_OWNED: PhoneModel[] = [
  { name: "iPhone 18 Pro Max", slug: "po-iphone-18-pro-max", startingPrice: 149999, image: "/images/products/iPhone16.webp", badge: "Like New", badgeColor: "#4FAE53", rating: 4.9 },
  { name: "iPhone 18 Pro",     slug: "po-iphone-18-pro",     startingPrice: 129999, image: "/images/products/iPhone16.webp", badge: "Like New", badgeColor: "#4FAE53", rating: 4.9 },
  { name: "iPhone 17 Pro Max", slug: "po-iphone-17-pro-max", startingPrice: 114999, image: "/images/products/iPhone16.webp", rating: 4.8 },
  { name: "iPhone 17 Pro",     slug: "po-iphone-17-pro",     startingPrice: 99999,  image: "/images/products/iPhone16.webp", rating: 4.7 },
  { name: "iPhone 17",         slug: "po-iphone-17",         startingPrice: 84999,  image: "/images/products/iPhone16.webp", rating: 4.6 },
  { name: "iPhone 17 Air",     slug: "po-iphone-17-air",     startingPrice: 89999,  image: "/images/products/iPhone16.webp", rating: 4.6 },
  { name: "iPhone 16 Pro Max", slug: "po-iphone-16-pro-max", startingPrice: 104999, image: "/images/products/iPhone16.webp", badge: "Popular", badgeColor: "#FB5724", rating: 4.8 },
  { name: "iPhone 16 Pro",     slug: "po-iphone-16-pro",     startingPrice: 89999,  image: "/images/products/iPhone16.webp", rating: 4.7 },
  { name: "iPhone 16",         slug: "po-iphone-16",         startingPrice: 72999,  image: "/images/products/iPhone16.webp", rating: 4.6 },
  { name: "iPhone 16e",        slug: "po-iphone-16e",        startingPrice: 54999,  image: "/images/products/iPhone16.webp", rating: 4.5 },
  { name: "iPhone 15 Pro Max", slug: "po-iphone-15-pro-max", startingPrice: 89999,  image: "/images/products/iPhone16.webp", rating: 4.7 },
  { name: "iPhone 15 Pro",     slug: "po-iphone-15-pro",     startingPrice: 74999,  image: "/images/products/iPhone16.webp", rating: 4.7 },
  { name: "iPhone 15",         slug: "po-iphone-15",         startingPrice: 59999,  image: "/images/products/iPhone16.webp", rating: 4.5 },
  { name: "iPhone 15 Plus",    slug: "po-iphone-15-plus",    startingPrice: 64999,  image: "/images/products/iPhone16.webp", rating: 4.5 },
  { name: "iPhone 14 Pro Max", slug: "po-iphone-14-pro-max", startingPrice: 74999,  image: "/images/products/iPhone16.webp", rating: 4.6 },
  { name: "iPhone 14 Pro",     slug: "po-iphone-14-pro",     startingPrice: 62999,  image: "/images/products/iPhone16.webp", rating: 4.5 },
  { name: "iPhone 14",         slug: "po-iphone-14",         startingPrice: 49999,  image: "/images/products/iPhone16.webp", rating: 4.4 },
  { name: "iPhone 14 Plus",    slug: "po-iphone-14-plus",    startingPrice: 54999,  image: "/images/products/iPhone16.webp", rating: 4.4 },
  { name: "iPhone 13 Pro Max", slug: "po-iphone-13-pro-max", startingPrice: 59999,  image: "/images/products/iPhone16.webp", rating: 4.5 },
  { name: "iPhone 13 Pro",     slug: "po-iphone-13-pro",     startingPrice: 49999,  image: "/images/products/iPhone16.webp", rating: 4.4 },
  { name: "iPhone 13",         slug: "po-iphone-13",         startingPrice: 39999,  image: "/images/products/iPhone16.webp", rating: 4.3 },
  { name: "iPhone 12 Pro Max", slug: "po-iphone-12-pro-max", startingPrice: 44999,  image: "/images/products/iPhone16.webp", rating: 4.3 },
  { name: "iPhone 12 Pro",     slug: "po-iphone-12-pro",     startingPrice: 36999,  image: "/images/products/iPhone16.webp", rating: 4.2 },
  { name: "iPhone 12",         slug: "po-iphone-12",         startingPrice: 29999,  image: "/images/products/iPhone16.webp", rating: 4.1 },
  { name: "iPhone 11 Pro Max", slug: "po-iphone-11-pro-max", startingPrice: 34999,  image: "/images/products/iPhone16.webp", rating: 4.2 },
  { name: "iPhone 11 Pro",     slug: "po-iphone-11-pro",     startingPrice: 27999,  image: "/images/products/iPhone16.webp", rating: 4.1 },
  { name: "iPhone 11",         slug: "po-iphone-11",         startingPrice: 22999,  image: "/images/products/iPhone16.webp", rating: 4.0 },
  { name: "iPhone XS Max",     slug: "po-iphone-xs-max",     startingPrice: 19999,  image: "/images/products/iPhone16.webp", rating: 3.9 },
  { name: "iPhone XS",         slug: "po-iphone-xs",         startingPrice: 16999,  image: "/images/products/iPhone16.webp", rating: 3.9 },
  { name: "iPhone XR",         slug: "po-iphone-xr",         startingPrice: 14999,  image: "/images/products/iPhone16.webp", rating: 3.8 },
  { name: "iPhone SE",         slug: "po-iphone-se",         startingPrice: 11999,  image: "/images/products/iPhone16.webp", rating: 3.7 },
  { name: "iPhone 8",          slug: "po-iphone-8",          startingPrice: 8999,   image: "/images/products/iPhone16.webp", rating: 3.5 },
];

// ── Categories (sidebar) ─────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "Apple",    icon: "🍎", active: true },
  { label: "Samsung",  icon: "🔵" },
  { label: "OnePlus",  icon: "🔴" },
  { label: "Redmi",    icon: "🟠" },
  { label: "Realme",   icon: "🟡" },
  { label: "Nothing",  icon: "⚫" },
  { label: "Motorola", icon: "🔷" },
  { label: "Vivo",     icon: "🟣" },
  { label: "Honor",    icon: "🟤" },
  { label: "iQOO",     icon: "⚡" },
];

// ── Pre-owned condition grades ────────────────────────────────────────────────
const GRADES = [
  { key: "like-new",   label: "Like New",   color: "bg-green-100 text-green-700",  desc: "99% perfect condition" },
  { key: "excellent",  label: "Excellent",  color: "bg-blue-100 text-blue-700",    desc: "Minor signs of use" },
  { key: "good",       label: "Good",       color: "bg-yellow-100 text-yellow-700",desc: "Visible wear, fully functional" },
];

// ── Mini ProductCard ──────────────────────────────────────────────────────────
function ModelCard({ model, isPreOwned }: { model: PhoneModel; isPreOwned: boolean }) {
  const [wished, setWished] = useState(false);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-brand-300 hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative bg-[#F7F8FA] overflow-hidden" style={{ height: "180px" }}>
        {model.badge && (
          <span
            className="absolute top-2.5 left-2.5 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm"
            style={{ backgroundColor: model.badgeColor ?? "#FB5724" }}
          >
            {model.badge}
          </span>
        )}
        {model.discount && (
          <span className="absolute top-2.5 right-10 bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full z-10">
            -{model.discount}%
          </span>
        )}
        <button
          onClick={() => setWished(w => !w)}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center shadow-md z-10 transition-all duration-200 hover:scale-110 active:scale-95
            ${wished ? "bg-red-500" : "bg-white border border-gray-200 hover:border-red-300"}`}
        >
          <Heart size={13} className={wished ? "fill-white text-white" : "text-gray-400 group-hover:text-red-400 transition-colors"} />
        </button>
        <Link href={`/products/${model.slug}`} className="absolute inset-0 flex items-center justify-center p-5">
          <div className="relative w-full h-full">
            <Image src={model.image} alt={model.name} fill sizes="200px" className="object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg" />
          </div>
        </Link>
      </div>

      {/* Info */}
      <div className="px-3 pt-2.5 pb-3 flex flex-col flex-1">
        <Link href={`/products/${model.slug}`}>
          <h3 className="text-gray-900 font-bold text-[13px] leading-snug hover:text-brand-500 transition-colors line-clamp-1">{model.name}</h3>
        </Link>

        {/* Stars */}
        {model.rating && (
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={10} className="fill-sun-500 text-sun-500" />
            <span className="text-[10px] font-semibold text-gray-600">{model.rating}</span>
          </div>
        )}

        {/* Pre-owned grade pills */}
        {isPreOwned && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {GRADES.map(g => (
              <span key={g.key} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${g.color}`}>{g.label}</span>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="mt-2">
          <p className="text-[10px] text-gray-400">{isPreOwned ? "Starting from" : "Starting from"}</p>
          <span className="text-gray-900 font-extrabold text-[15px] tracking-tight">
            ৳{model.startingPrice.toLocaleString("en-BD")}
          </span>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-[1fr_auto] gap-1.5 mt-2.5">
          <Link
            href={`/products/${model.slug}`}
            className="h-8 flex items-center justify-center gap-1.5 text-[11px] font-semibold px-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white transition-all active:scale-95 shadow-sm"
          >
            <ShoppingCart size={12} className="shrink-0" />
            Select
          </Link>
          <Link
            href={`/products/${model.slug}`}
            className="h-8 flex items-center justify-center gap-1 text-[11px] font-semibold px-3 rounded-lg border-2 border-brand-200 text-brand-500 hover:bg-brand-50 transition-all"
          >
            <Zap size={11} className="shrink-0" />
            Buy
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [condition, setCondition] = useState<Condition>("brand-new");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Apple");

  const models = condition === "brand-new" ? BRAND_NEW : PRE_OWNED;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-brand-500 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-700 font-medium">Smartphones</span>
            {activeCategory && (
              <>
                <ChevronRight size={12} />
                <span className="text-brand-500 font-medium">{activeCategory}</span>
              </>
            )}
          </div>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {activeCategory} Smartphones
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">{models.length} models available</p>
            </div>

            {/* Condition Toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => setCondition("brand-new")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                  ${condition === "brand-new"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                <BadgeCheck size={15} className={condition === "brand-new" ? "text-brand-500" : "text-gray-400"} />
                Brand New
              </button>
              <button
                onClick={() => setCondition("pre-owned")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                  ${condition === "pre-owned"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                <RefreshCw size={14} className={condition === "pre-owned" ? "text-leaf-500" : "text-gray-400"} />
                Pre-Owned
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pre-Owned Trust Bar ── */}
      {condition === "pre-owned" && (
        <div className="bg-leaf-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-1 text-xs font-medium">
              <span className="flex items-center gap-1.5">✅ 100% Genuine Devices</span>
              <span className="hidden sm:block text-leaf-200">|</span>
              <span className="flex items-center gap-1.5">🔍 30-Point Quality Check</span>
              <span className="hidden sm:block text-leaf-200">|</span>
              <span className="flex items-center gap-1.5">🛡️ 6-Month Warranty</span>
              <span className="hidden sm:block text-leaf-200">|</span>
              <span className="flex items-center gap-1.5">🔄 7-Day Return</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Body: Sidebar + Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">

          {/* ── Sidebar ── */}
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}

          <aside className={`
            fixed lg:static top-0 left-0 h-full lg:h-auto z-50 lg:z-auto
            w-64 lg:w-56 xl:w-60 shrink-0
            bg-white lg:bg-transparent
            transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            overflow-y-auto lg:overflow-visible
            p-4 lg:p-0
          `}>
            {/* Mobile close */}
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <span className="font-bold text-gray-900">Filter</span>
              <button onClick={() => setSidebarOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100">
                <X size={16} />
              </button>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Brands</h3>
              </div>
              <ul>
                {CATEGORIES.map((cat) => (
                  <li key={cat.label}>
                    <button
                      onClick={() => { setActiveCategory(cat.label); setSidebarOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors
                        ${activeCategory === cat.label
                          ? "bg-brand-50 text-brand-600 border-r-2 border-brand-500"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span>{cat.icon}</span>
                        {cat.label}
                      </span>
                      {activeCategory === cat.label && <ChevronRight size={14} className="text-brand-400" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pre-owned grade filter */}
            {condition === "pre-owned" && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mt-3">
                <div className="px-4 py-3 border-b border-gray-50">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Condition Grade</h3>
                </div>
                <div className="p-3 space-y-1.5">
                  {GRADES.map(g => (
                    <label key={g.key} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                      <input type="checkbox" defaultChecked className="mt-0.5 accent-brand-500 w-3.5 h-3.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{g.label}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{g.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price range */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mt-3">
              <div className="px-4 py-3 border-b border-gray-50">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Price Range</h3>
              </div>
              <div className="p-4 space-y-3">
                {["Under ৳30,000", "৳30k – ৳60k", "৳60k – ৳1 Lakh", "Above ৳1 Lakh"].map(range => (
                  <label key={range} className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" className="accent-brand-500 w-3.5 h-3.5" />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{range}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:border-brand-300 transition-all"
              >
                <SlidersHorizontal size={15} />
                Filters
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-gray-400 hidden sm:block">{models.length} results</span>
                <select className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-400">
                  <option>Sort: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                  <option>Top Rated</option>
                </select>
              </div>
            </div>

            {/* Section label */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                condition === "brand-new"
                  ? "bg-brand-50 text-brand-600 border border-brand-200"
                  : "bg-leaf-50 text-leaf-700 border border-leaf-200"
              }`}>
                {condition === "brand-new"
                  ? <><BadgeCheck size={13} /> Brand New — {activeCategory}</>
                  : <><RefreshCw size={12} /> Pre-Owned — {activeCategory}</>
                }
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
              {models.map((model) => (
                <ModelCard key={model.slug} model={model} isPreOwned={condition === "pre-owned"} />
              ))}
            </div>

            {/* Pre-Owned bottom info */}
            {condition === "pre-owned" && (
              <div className="mt-10 bg-gradient-to-br from-leaf-50 to-white border border-leaf-200 rounded-2xl p-6">
                <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                  <div className="w-10 h-10 bg-leaf-100 rounded-xl flex items-center justify-center shrink-0">
                    <BadgeCheck size={22} className="text-leaf-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Why Buy Pre-Owned from Pure Apple?</h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      Every pre-owned device goes through a rigorous 30-point inspection before listing.
                      We grade each phone honestly — what you see is exactly what you get.
                      Backed by a 6-month warranty and 7-day hassle-free returns.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {["Verified Genuine", "6-Month Warranty", "7-Day Return", "Expert Inspected"].map(tag => (
                        <span key={tag} className="text-[11px] font-semibold text-leaf-700 bg-leaf-100 px-2.5 py-1 rounded-full">{tag}</span>
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
