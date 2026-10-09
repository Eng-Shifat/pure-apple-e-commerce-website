"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Zap, Heart, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

/* ─────────────────────────────────────────────
   TYPE
───────────────────────────────────────────── */
interface SeriesProduct {
  id: string;
  name: string;
  variant: string;
  price: number;
  originalPrice?: number;
  image: string;
  slug: string;
  badge?: string;
  badgeColor?: string;
  specs?: { screen?: string; ram?: string; camera?: string };
}

interface PhoneSeries {
  id: string;
  seriesName: string;           // e.g. "iPhone 16 Series"
  seriesSlug: string;           // e.g. "apple"
  accentColor: string;          // Tailwind color token OR hex
  accentBg: string;             // light bg for the header stripe
  borderColor: string;
  products: SeriesProduct[];
}

/* ─────────────────────────────────────────────
   DATA — 2 rows = 10 products shown, rest hidden
   Products are real/example slugs — swap with
   your actual slugs/images.
───────────────────────────────────────────── */
const ALL_SERIES: PhoneSeries[] = [
  /* ── Apple ── */
  {
    id: "apple",
    seriesName: "Apple iPhone Series",
    seriesSlug: "apple",
    accentColor: "#1d1d1f",
    accentBg: "#f5f5f7",
    borderColor: "#d1d1d6",
    products: [
      { id: "a1", name: "iPhone 18 Pro", variant: "256GB – Titanium", price: 164999, originalPrice: 174999, image: "/images/products/iPhone16.webp", slug: "iphone-18-pro", badge: "New", badgeColor: "#7C3AED", specs: { screen: "6.3″", ram: "8GB", camera: "48 MP" } },
      { id: "a2", name: "iPhone 17 Pro Max", variant: "256GB – Black Titanium", price: 154999, originalPrice: 164999, image: "/images/products/iPhone16.webp", slug: "iphone-17-pro-max", badge: "Hot", badgeColor: "#FB5724", specs: { screen: "6.9″", ram: "8GB", camera: "48 MP" } },
      { id: "a3", name: "iPhone 16 Pro", variant: "256GB – Desert Titanium", price: 114499, originalPrice: 124999, image: "/images/products/iPhone16.webp", slug: "iphone-16-pro", badge: "Best Seller", badgeColor: "#4FAE53", specs: { screen: "6.3″", ram: "8GB", camera: "48 MP" } },
      { id: "a4", name: "iPhone 16", variant: "128GB – Black", price: 94999, image: "/images/products/iPhone16.webp", slug: "iphone-16", specs: { screen: "6.1″", ram: "8GB", camera: "48 MP" } },
      { id: "a5", name: "iPhone 15 Pro", variant: "128GB – Natural Titanium", price: 104999, originalPrice: 114999, image: "/images/products/iPhone16.webp", slug: "iphone-15-pro", specs: { screen: "6.1″", ram: "8GB", camera: "48 MP" } },
      { id: "a6", name: "iPhone 15", variant: "128GB – Pink", price: 79999, originalPrice: 89999, image: "/images/products/iPhone16.webp", slug: "iphone-15", specs: { screen: "6.1″", ram: "6GB", camera: "48 MP" } },
    ],
  },
  /* ── Samsung ── */
  {
    id: "samsung",
    seriesName: "Samsung Galaxy Series",
    seriesSlug: "samsung",
    accentColor: "#1428A0",
    accentBg: "#f0f4ff",
    borderColor: "#bde5bf",
    products: [
      { id: "s1", name: "Galaxy S25 Ultra", variant: "256GB – Titanium Black", price: 164999, originalPrice: 179999, image: "/images/products/Samsung Galaxy S24.webp", slug: "galaxy-s25-ultra", badge: "New", badgeColor: "#7C3AED", specs: { screen: "6.9″", ram: "12GB", camera: "200 MP" } },
      { id: "s2", name: "Galaxy S25+", variant: "256GB – Cobalt Violet", price: 134999, image: "/images/products/Samsung Galaxy S24.webp", slug: "galaxy-s25-plus", badge: "Hot", badgeColor: "#FB5724", specs: { screen: "6.7″", ram: "12GB", camera: "50 MP" } },
      { id: "s3", name: "Galaxy S25", variant: "128GB – Mint", price: 109999, originalPrice: 119999, image: "/images/products/Samsung Galaxy S24.webp", slug: "galaxy-s25", specs: { screen: "6.2″", ram: "12GB", camera: "50 MP" } },
      { id: "s4", name: "Galaxy S24 Ultra", variant: "256GB – Titanium Gray", price: 144999, originalPrice: 159999, image: "/images/products/Samsung Galaxy S24.webp", slug: "samsung-galaxy-s24-ultra", badge: "Best Seller", badgeColor: "#4FAE53", specs: { screen: "6.8″", ram: "12GB", camera: "200 MP" } },
      { id: "s5", name: "Galaxy S24+", variant: "256GB – Cobalt Violet", price: 114999, image: "/images/products/Samsung Galaxy S24.webp", slug: "galaxy-s24-plus", specs: { screen: "6.7″", ram: "12GB", camera: "50 MP" } },
      { id: "s6", name: "Galaxy S24", variant: "128GB – Marble Gray", price: 99999, originalPrice: 109999, image: "/images/products/Samsung Galaxy S24.webp", slug: "samsung-galaxy-s24", specs: { screen: "6.2″", ram: "8GB", camera: "50 MP" } },
    ],
  },
  /* ── OnePlus ── */
  {
    id: "oneplus",
    seriesName: "OnePlus Series",
    seriesSlug: "oneplus",
    accentColor: "#dc2626",
    accentBg: "#fff1f1",
    borderColor: "#fecaca",
    products: [
      { id: "o1", name: "OnePlus 13", variant: "256GB – Midnight Ocean", price: 99999, originalPrice: 109999, image: "/images/products/OnePlus 12.webp", slug: "oneplus-13", badge: "New", badgeColor: "#7C3AED", specs: { screen: "6.82″", ram: "12GB", camera: "50 MP" } },
      { id: "o2", name: "OnePlus 12", variant: "256GB – Flowy Emerald", price: 89999, image: "/images/products/OnePlus 12.webp", slug: "oneplus-12", badge: "Best Seller", badgeColor: "#4FAE53", specs: { screen: "6.7″", ram: "12GB", camera: "50 MP" } },
      { id: "o3", name: "OnePlus 12R", variant: "128GB – Iron Gray", price: 59999, originalPrice: 64999, image: "/images/products/OnePlus 12.webp", slug: "oneplus-12r", specs: { screen: "6.78″", ram: "8GB", camera: "50 MP" } },
      { id: "o4", name: "OnePlus Nord 4", variant: "256GB – Mercurial Silver", price: 49999, image: "/images/products/OnePlus 12.webp", slug: "oneplus-nord-4", specs: { screen: "6.74″", ram: "8GB", camera: "50 MP" } },
    ],
  },
  /* ── Redmi / Xiaomi ── */
  {
    id: "redmi",
    seriesName: "Redmi Series",
    seriesSlug: "redmi",
    accentColor: "#E8470F",
    accentBg: "#fff7ed",
    borderColor: "#fed7aa",
    products: [
      { id: "r1", name: "Xiaomi 15 Ultra", variant: "512GB – Black", price: 139999, originalPrice: 154999, image: "/images/products/Samsung Galaxy S24.webp", slug: "xiaomi-15-ultra", badge: "New", badgeColor: "#7C3AED", specs: { screen: "6.73″", ram: "16GB", camera: "200 MP" } },
      { id: "r2", name: "Redmi Note 14 Pro+", variant: "256GB – Midnight Black", price: 54999, image: "/images/products/Samsung Galaxy S24.webp", slug: "redmi-note-14-pro-plus", badge: "Hot", badgeColor: "#FB5724", specs: { screen: "6.67″", ram: "12GB", camera: "200 MP" } },
      { id: "r3", name: "Redmi Note 14 Pro", variant: "128GB – Glacier Blue", price: 44999, originalPrice: 49999, image: "/images/products/Samsung Galaxy S24.webp", slug: "redmi-note-14-pro", specs: { screen: "6.67″", ram: "8GB", camera: "200 MP" } },
      { id: "r4", name: "Redmi 14C", variant: "128GB – Dreamy Purple", price: 19999, image: "/images/products/Samsung Galaxy S24.webp", slug: "redmi-14c", specs: { screen: "6.88″", ram: "6GB", camera: "50 MP" } },
    ],
  },
  /* ── Realme ── */
  {
    id: "realme",
    seriesName: "Realme Series",
    seriesSlug: "realme",
    accentColor: "#A87A05",
    accentBg: "#fffbeb",
    borderColor: "#fde68a",
    products: [
      { id: "re1", name: "Realme GT 7 Pro", variant: "256GB – Mars Red", price: 74999, originalPrice: 84999, image: "/images/products/OnePlus 12.webp", slug: "realme-gt-7-pro", badge: "New", badgeColor: "#7C3AED", specs: { screen: "6.78″", ram: "12GB", camera: "50 MP" } },
      { id: "re2", name: "Realme 13 Pro+", variant: "256GB – Emerald Green", price: 54999, image: "/images/products/OnePlus 12.webp", slug: "realme-13-pro-plus", badge: "Hot", badgeColor: "#FB5724", specs: { screen: "6.7″", ram: "12GB", camera: "50 MP" } },
      { id: "re3", name: "Realme 13 Pro", variant: "128GB – Monet Purple", price: 44999, originalPrice: 49999, image: "/images/products/OnePlus 12.webp", slug: "realme-13-pro", specs: { screen: "6.7″", ram: "8GB", camera: "50 MP" } },
      { id: "re4", name: "Realme C67", variant: "128GB – Sunny Oasis", price: 19999, image: "/images/products/OnePlus 12.webp", slug: "realme-c67", specs: { screen: "6.72″", ram: "6GB", camera: "108 MP" } },
    ],
  },
  /* ── Google ── */
  {
    id: "google",
    seriesName: "Google Pixel Series",
    seriesSlug: "google",
    accentColor: "#4285F4",
    accentBg: "#eff6ff",
    borderColor: "#bfdbfe",
    products: [
      { id: "g1", name: "Pixel 10 Pro XL", variant: "256GB – Obsidian", price: 119999, originalPrice: 129999, image: "/images/products/Google Pixel 10 Pro.webp", slug: "pixel-10-pro-xl", badge: "New", badgeColor: "#7C3AED", specs: { screen: "6.8″", ram: "16GB", camera: "50 MP" } },
      { id: "g2", name: "Pixel 10 Pro", variant: "256GB – Hazel", price: 109999, originalPrice: 119999, image: "/images/products/Google Pixel 10 Pro.webp", slug: "google-pixel-10-pro", badge: "Hot", badgeColor: "#FB5724", specs: { screen: "6.3″", ram: "16GB", camera: "50 MP" } },
      { id: "g3", name: "Pixel 9 Pro", variant: "128GB – Porcelain", price: 99999, image: "/images/products/Google Pixel 9.webp", slug: "google-pixel-9-pro", specs: { screen: "6.3″", ram: "16GB", camera: "50 MP" } },
      { id: "g4", name: "Pixel 9", variant: "128GB – Obsidian", price: 79999, image: "/images/products/Google Pixel 9.webp", slug: "google-pixel-9", specs: { screen: "6.3″", ram: "12GB", camera: "50 MP" } },
    ],
  },
];

/* ─────────────────────────────────────────────
   MINI PRODUCT CARD (inline, no extra imports)
───────────────────────────────────────────── */
function MiniCard({ p, accentColor }: { p: SeriesProduct; accentColor: string }) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const discount = p.originalPrice
    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    : null;

  function handleCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      id: p.id, name: p.name, variant: p.variant, price: p.price,
      original_price: p.originalPrice, image: p.image, slug: p.slug,
      badge: p.badge, badge_color: p.badgeColor,
      spec_screen: p.specs?.screen, spec_ram: p.specs?.ram, spec_camera: p.specs?.camera,
    } as never);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    /* pt-3 = space for badge that overflows top */
    <div className="group relative bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300 flex flex-col pt-3">

      {/* Badge */}
      {p.badge && (
        <span
          className="absolute left-3 top-0 -translate-y-1/2 text-white text-[10px] font-bold px-2.5 py-[3px] rounded-full z-20 shadow-sm whitespace-nowrap"
          style={{ backgroundColor: p.badgeColor ?? "#FB5724" }}
        >
          {p.badge}
        </span>
      )}

      {/* Image zone */}
      <div className="relative bg-[#F7F8FA] rounded-t-xl overflow-hidden mx-0" style={{ height: "148px" }}>
        {/* Discount + wishlist */}
        <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1.5">
          {discount && (
            <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm leading-none">
              -{discount}%
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); setWished((w) => !w); }}
            aria-label="Wishlist"
            className={`w-6 h-6 rounded-full flex items-center justify-center shadow transition-all hover:scale-110 active:scale-95
              ${wished ? "bg-red-500" : "bg-white border border-gray-200 hover:border-red-300"}`}
          >
            <Heart size={11} className={wished ? "fill-white text-white" : "text-gray-400 group-hover:text-red-400"} />
          </button>
        </div>

        <Link href={`/products/${p.slug}`} className="absolute inset-0 flex items-center justify-center p-3">
          <div className="relative w-full h-full">
            <Image
              src={p.image}
              alt={p.name}
              fill
              sizes="(max-width: 640px) 45vw, 200px"
              className="object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
            />
          </div>
        </Link>
      </div>

      {/* Info zone */}
      <div className="px-2.5 pt-2 pb-2.5 flex flex-col flex-1">
        <Link href={`/products/${p.slug}`}>
          <h3 className="text-gray-900 font-bold text-[13px] leading-snug hover:text-brand-500 transition-colors truncate">
            {p.name}
          </h3>
        </Link>
        <p className="text-gray-400 text-[10px] mt-0.5 truncate">{p.variant}</p>

        {p.specs && (
          <div className="flex flex-wrap gap-1 mt-1">
            {p.specs.screen && (
              <span className="text-[9px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5 whitespace-nowrap">📱{p.specs.screen}</span>
            )}
            {p.specs.ram && (
              <span className="text-[9px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5 whitespace-nowrap">⚙️{p.specs.ram}</span>
            )}
            {p.specs.camera && (
              <span className="text-[9px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5 whitespace-nowrap">📷{p.specs.camera}</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          <span className="text-gray-900 font-extrabold text-[15px] tracking-tight">
            ৳{p.price.toLocaleString("en-BD")}
          </span>
          {p.originalPrice && (
            <span className="text-[10px] line-through text-gray-400">
              ৳{p.originalPrice.toLocaleString("en-BD")}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-1.5 mt-2">
          <button
            onClick={handleCart}
            className={`flex-1 h-8 flex items-center justify-center gap-1 text-[10px] font-bold rounded-lg transition-all duration-200 active:scale-95 shadow-sm
              ${added ? "bg-green-500 text-white" : "bg-brand-500 hover:bg-brand-600 text-white"}`}
          >
            <ShoppingCart size={10} className="shrink-0" />
            <span>{added ? "Added ✓" : "Add to Cart"}</span>
          </button>
          <Link
            href={`/products/${p.slug}`}
            className="h-8 flex items-center justify-center gap-1 px-2.5 text-[10px] font-bold rounded-lg border-2 border-brand-400 text-brand-500 hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all duration-200 active:scale-95 whitespace-nowrap"
          >
            <Zap size={10} />
            Buy
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SINGLE SERIES BLOCK
   Desktop: 5 per row × 2 rows = 10 shown
   Mobile: horizontal scroll
───────────────────────────────────────────── */
const DESKTOP_VISIBLE = 10; // 2 rows × 5 cols

function SeriesBlock({ series }: { series: PhoneSeries }) {
  const visibleProducts = series.products.slice(0, DESKTOP_VISIBLE);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: `1.5px solid ${series.borderColor}` }}
    >
      {/* Header stripe */}
      <div
        className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5"
        style={{ backgroundColor: series.accentBg }}
      >
        <div className="flex items-center gap-2.5">
          {/* Accent bar */}
          <span
            className="w-1 h-5 rounded-full flex-shrink-0"
            style={{ backgroundColor: series.accentColor }}
          />
          <div>
            <h3 className="font-extrabold text-[15px] sm:text-base text-gray-900 leading-tight">
              <span style={{ color: series.accentColor }}>{series.seriesName.split(" ")[0]}</span>{" "}
              <span>{series.seriesName.split(" ").slice(1).join(" ")}</span>
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5 hidden sm:block">
              {series.products.length} models available
            </p>
          </div>
        </div>

        <Link
          href={`/products?category=${series.seriesSlug}`}
          className="flex items-center gap-1 text-[12px] font-semibold transition-colors whitespace-nowrap"
          style={{ color: series.accentColor }}
        >
          View More
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Products — mobile: horizontal scroll | desktop: grid */}
      <div className="bg-white px-3 py-4 sm:px-4">
        {/* Mobile horizontal scroll */}
        <div
          className="flex gap-3 overflow-x-auto sm:hidden pb-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {visibleProducts.map((p) => (
            <div key={p.id} className="flex-shrink-0 w-[150px]">
              <MiniCard p={p} accentColor={series.accentColor} />
            </div>
          ))}
        </div>

        {/* Desktop: 5-col grid, max 2 rows = 10 items */}
        <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {visibleProducts.map((p) => (
            <MiniCard key={p.id} p={p} accentColor={series.accentColor} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function PhoneSeriesSection() {
  return (
    <section className="bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
        {/* Section header */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-brand-500 text-xs font-semibold uppercase tracking-widest mb-1">
              Browse by Series
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              All Phone Series
            </h2>
            <p className="text-gray-400 text-sm mt-1 hidden sm:block">
              Explore the latest lineups from every brand.
            </p>
          </div>
          <Link
            href="/products"
            className="shrink-0 text-brand-500 text-[13px] sm:text-sm font-semibold border border-brand-200 hover:border-brand-400 hover:bg-brand-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all whitespace-nowrap"
          >
            All Products →
          </Link>
        </div>

        {/* Each brand series */}
        {ALL_SERIES.map((s) => (
          <SeriesBlock key={s.id} series={s} />
        ))}
      </div>
    </section>
  );
}
