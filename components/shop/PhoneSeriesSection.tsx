"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Zap, Heart, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { BRAND_SERIES, phonesByBrand, type CatalogPhone } from "@/lib/phoneCatalog";
import ColorSwatches from "./ColorSwatches";

/* ─────────────────────────────────────────────
   DATA — সব product এখন lib/phoneCatalog.ts থেকে আসে।
   নতুন model / color যোগ করতে ওই file edit করো।
───────────────────────────────────────────── */
interface PhoneSeries {
  id: string;
  seriesName: string;
  seriesSlug: string;
  accentColor: string;
  accentBg: string;
  borderColor: string;
  products: CatalogPhone[];
}

const ALL_SERIES: PhoneSeries[] = BRAND_SERIES.map((b) => ({
  id: b.key,
  seriesName: b.seriesName,
  seriesSlug: b.key,
  accentColor: b.accentColor,
  accentBg: b.accentBg,
  borderColor: b.borderColor,
  products: phonesByBrand(b.key),
})).filter((s) => s.products.length > 0);

/* ─────────────────────────────────────────────
   MINI PRODUCT CARD (inline, no extra imports)
───────────────────────────────────────────── */
function MiniCard({ p }: { p: CatalogPhone; accentColor?: string }) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const [colorIdx, setColorIdx] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  const color = p.colors[colorIdx] ?? p.colors[0];
  const variant = `${p.storage} – ${color.name}`;

  const discount = p.originalPrice
    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    : null;

  function handleCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      id: `${p.id}:${color.name}`, name: p.name, variant, price: p.price,
      original_price: p.originalPrice, rating: p.rating, review_count: p.reviewCount,
      image: color.image, slug: p.slug,
      badge: p.badge, badge_color: p.badgeColor,
      spec_screen: p.specs?.screen, spec_ram: p.specs?.ram, spec_camera: p.specs?.camera,
    } as never);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group relative flex flex-col" style={{ marginTop: p.badge ? "14px" : "0" }}>

      {/* Badge — card এর উপরে half-outside */}
      {p.badge && (
        <span
          className="absolute left-3 -top-3 text-white text-[10px] font-bold px-2.5 py-[3px] rounded-full z-20 shadow-sm whitespace-nowrap"
          style={{ backgroundColor: p.badgeColor ?? "#FB5724" }}
        >
          {p.badge}
        </span>
      )}

      {/* Card body */}
      <div className="bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300 flex flex-col flex-1">

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
              src={color.image}
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
        <p className="text-gray-400 text-[10px] mt-0.5 truncate">{variant}</p>
        <ColorSwatches colors={p.colors} active={colorIdx} onSelect={setColorIdx} size={12} max={4} />

        {p.specs && (
          <div className="flex flex-nowrap items-center gap-1 mt-1.5 w-full min-w-0">
            {p.specs.screen && (
              <span className="text-[9px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5 whitespace-nowrap shrink-0 leading-none">📱 {p.specs.screen}</span>
            )}
            {p.specs.ram && (
              <span className="text-[9px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5 whitespace-nowrap shrink-0 leading-none">💾 {p.specs.ram}</span>
            )}
            {p.specs.camera && (
              <span className="text-[9px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5 whitespace-nowrap shrink-0 leading-none">📷 {p.specs.camera}</span>
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
            Buy Now
          </Link>
        </div>
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
              {series.products.length} {series.products.length === 1 ? "model" : "models"} available
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
    <section className="bg-gray-50 pb-8 md:pb-12">
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
