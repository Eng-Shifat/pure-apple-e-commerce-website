// SAVE PATH: components/shop/TodaysDeal.tsx
"use client";

/**
 * TodaysDeal — Today's Deal section (multi-product carousel)
 * Admin marks products as today's deals via Admin Products page.
 */

import { useEffect, useState, useRef, useCallback } from "react";
import { cachedJson } from "@/lib/cachedFetch";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Zap, Timer, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface DealProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  deal_price: number;
  original_price?: number;
  deal_ends_at: string | null;
  badge?: string;
  badge_color?: string;
  spec_screen?: string;
  spec_ram?: string;
  spec_camera?: string;
  rating?: number;
  review_count?: number;
  colors?: string; // JSON array of color names
}

// ── Countdown helper ──────────────────────────────────────────────────────────
function useCountdown(endsAt: string | null) {
  const calc = () => {
    if (!endsAt) return null;
    const diff = new Date(endsAt).getTime() - Date.now();
    if (diff <= 0) return { h: 0, m: 0, s: 0, expired: true };
    const totalSec = Math.floor(diff / 1000);
    return {
      h: Math.floor(totalSec / 3600),
      m: Math.floor((totalSec % 3600) / 60),
      s: totalSec % 60,
      expired: false,
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    if (!endsAt) return;
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endsAt]);
  return time;
}

function pad(n: number) { return String(n).padStart(2, "0"); }

function CountdownDisplay({ endsAt }: { endsAt: string }) {
  const time = useCountdown(endsAt);
  if (!time) return null;
  if (time.expired) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
        <Timer size={12} /> Deal Ended
      </span>
    );
  }
  return (
    <div className="flex items-center gap-1 shrink-0">
      <Timer size={12} className="text-orange-500 shrink-0" />
      <span className="text-[10px] font-semibold text-gray-500 whitespace-nowrap">Ends in</span>
      {[pad(time.h), pad(time.m), pad(time.s)].map((unit, i) => (
        <span key={i} className="flex items-center gap-0.5">
          <span className="inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-8 rounded-md sm:rounded-lg bg-gray-900 text-white font-mono text-xs sm:text-sm font-extrabold leading-none shadow-sm">
            {unit}
          </span>
          {i < 2 && <span className="text-gray-500 font-bold text-xs">:</span>}
        </span>
      ))}
    </div>
  );
}

// ── Color dot strip ───────────────────────────────────────────────────────────
// Simple palette for common color name → hex. Extend as needed.
const COLOR_MAP: Record<string, string> = {
  "black": "#1a1a1a", "midnight": "#1c1c2e", "space black": "#2a2a2a",
  "white": "#f5f5f5", "starlight": "#f5e6d3", "silver": "#c0c0c0",
  "gold": "#d4aa70", "rose gold": "#e8b4a0", "pink": "#f4a7b9",
  "red": "#e63946", "blue": "#2563eb", "sierra blue": "#7eb8d4",
  "pacific blue": "#1e6091", "alpine green": "#4a7c59",
  "midnight green": "#3d6b5e", "green": "#22c55e",
  "purple": "#9333ea", "deep purple": "#6d28d9", "titan": "#9ca3af",
  "natural titanium": "#b0a090", "black titanium": "#3a3a3a",
  "white titanium": "#e8e4e0", "desert titanium": "#c4a882",
  "yellow": "#facc15", "orange": "#f97316", "teal": "#14b8a6",
  "graphite": "#6b7280", "phantom black": "#1a1a1a",
  "phantom silver": "#e0e0e0", "lavender": "#c4b5fd",
};

function colorHex(name: string): string {
  const key = name.toLowerCase().trim();
  return COLOR_MAP[key] ?? "#9ca3af";
}

function parseColors(val: string | undefined): string[] {
  if (!val) return [];
  try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; }
}

// ── Single Deal Card ──────────────────────────────────────────────────────────
function DealCard({ deal }: { deal: DealProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const activePrice  = deal.deal_price && deal.deal_price < deal.price ? deal.deal_price : deal.price;
  const comparePrice = deal.original_price && deal.original_price > activePrice ? deal.original_price : deal.price;
  const discount     = comparePrice > activePrice
    ? Math.round(((comparePrice - activePrice) / comparePrice) * 100)
    : null;

  const colors = parseColors(deal.colors);

  function handleAddToCart() {
    addItem({
      id:             deal.id,
      name:           deal.name,
      variant:        "",
      price:          activePrice,
      original_price: comparePrice,
      rating:         deal.rating ?? 0,
      review_count:   deal.review_count ?? 0,
      image:          deal.image,
      slug:           deal.slug,
      badge:          deal.badge ?? "Today's Deal",
      badge_color:    deal.badge_color ?? "#FB5724",
      spec_screen:    deal.spec_screen,
      spec_ram:       deal.spec_ram,
      spec_camera:    deal.spec_camera,
    } as never);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="rounded-3xl border border-orange-100 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      style={{ background: "linear-gradient(135deg, #fff8f3 0%, #ffffff 50%, #fffdf5 100%)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

        {/* ── LEFT: Image + color strip ── */}
        <div className="relative flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-[200px] md:min-h-[340px] p-4 md:p-8 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 60% 50%, rgba(251,87,36,0.07) 0%, transparent 70%)" }}
          />

          {/* Discount pill — top-left */}
          {discount && (
            <span className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
              -{discount}%
            </span>
          )}

          {/* Color strip — top-right to bottom, vertical */}
          {colors.length > 0 && (
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              {colors.map((c) => (
                <span
                  key={c}
                  title={c}
                  className="w-5 h-5 rounded-full border-2 border-white shadow-md ring-1 ring-gray-200 cursor-default"
                  style={{ backgroundColor: colorHex(c) }}
                />
              ))}
            </div>
          )}

          {/* Product image */}
          <Link href="/todays-deal" className="group relative z-0">
            <Image
              src={deal.image}
              alt={deal.name}
              width={300}
              height={300}
              className="object-contain max-h-[190px] md:max-h-[260px] w-auto drop-shadow-xl group-hover:scale-[1.04] transition-transform duration-500"
            />
          </Link>
        </div>

        {/* ── RIGHT: Info ── */}
        <div className="flex flex-col justify-center gap-2.5 md:gap-4 p-4 md:p-10">

          {/* Flash label + Timer — ek row-te */}
          <div className="flex items-center justify-between gap-2 flex-nowrap">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-orange-500 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                <Zap size={11} className="fill-orange-400" /> Flash Deal
              </span>
              {deal.badge && (
                <span
                  className="hidden sm:inline-block text-white text-[11px] font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: deal.badge_color ?? "#FB5724" }}
                >
                  {deal.badge}
                </span>
              )}
            </div>
            {deal.deal_ends_at && <CountdownDisplay endsAt={deal.deal_ends_at} />}
          </div>

          {/* Name */}
          <Link
            href="/todays-deal"
            className="text-xl md:text-3xl font-extrabold text-gray-900 leading-tight hover:text-orange-600 transition-colors"
          >
            {deal.name}
          </Link>

          {/* Specs */}
          {(deal.spec_screen || deal.spec_ram || deal.spec_camera) && (
            <ul className="flex flex-wrap gap-2">
              {[deal.spec_screen, deal.spec_ram, deal.spec_camera].filter(Boolean).map((s) => (
                <li key={s} className="text-[11px] font-semibold text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1">
                  {s}
                </li>
              ))}
            </ul>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-2xl md:text-3xl font-extrabold text-orange-500">
              ৳{activePrice.toLocaleString("en-BD")}
            </span>
            {comparePrice > activePrice && (
              <span className="text-base md:text-lg text-gray-400 line-through font-medium">
                ৳{comparePrice.toLocaleString("en-BD")}
              </span>
            )}
            {discount && (
              <span className="inline-flex items-center gap-1 text-[12px] font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                <Tag size={11} /> Save {discount}%
              </span>
            )}
          </div>

          {/* Color names row */}
          {colors.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-gray-400">Colors:</span>
              {colors.map((c) => (
                <span key={c} className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 bg-white border border-gray-100 px-2.5 py-1 rounded-full shadow-sm">
                  <span className="w-3 h-3 rounded-full inline-block border border-gray-200" style={{ backgroundColor: colorHex(c) }} />
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-2 md:gap-3 pt-0.5">
            <button
              onClick={handleAddToCart}
              className={`inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full font-bold text-sm transition-all shadow-lg active:scale-95 ${
                added
                  ? "bg-green-500 text-white shadow-green-200"
                  : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200"
              }`}
            >
              <ShoppingCart size={16} />
              {added ? "Added ✓" : "Add to Cart"}
            </button>
            <Link
              href="/todays-deal"
              className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full font-semibold text-sm bg-white border border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-all"
            >
              View Details
            </Link>
          </div>

          {!deal.deal_ends_at && (
            <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
              <Zap size={11} className="text-orange-400" />
              Limited time offer — grab it before it&apos;s gone!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TodaysDeal() {
  const [deals, setDeals]           = useState<DealProduct[] | undefined>(undefined);
  const [current, setCurrent]       = useState(0);
  const [animating, setAnimating]   = useState(false);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    cachedJson<{ products?: DealProduct[] }>("/api/products?today_deal=true&limit=20", 20_000)
      .then((d) => setDeals(d.products ?? []))
      .catch(() => setDeals([]));
  }, []);

  const total = deals?.length ?? 0;

  const goTo = useCallback((idx: number) => {
    if (animating || total <= 1) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 450);
  }, [animating, total]);

  useEffect(() => {
    if (total <= 1) return;
    autoRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [total]);

  const resetAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    if (total <= 1) return;
    autoRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);
  };

  const prev = () => { goTo((current - 1 + total) % total); resetAuto(); };
  const next = () => { goTo((current + 1) % total); resetAuto(); };

  if (deals === undefined) return null;
  if (deals.length === 0) return null;

  const deal = deals[current];

  return (
    <section id="todays-deal" className="bg-white pt-5 md:pt-12 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-3 md:mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={18} className="text-orange-500 fill-orange-100" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-orange-500">Flash Offer</span>
            </div>
            <h2 className="text-gray-900 text-2xl font-bold">Today&apos;s Deal</h2>
            <p className="text-gray-400 text-sm mt-0.5">
              {total > 1 ? `${total} exclusive deals, limited time only.` : "One exclusive deal, limited time only."}
            </p>
          </div>
          <Link
            href="/todays-deal"
            className="text-brand-600 text-sm font-medium hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            View All Deals →
          </Link>
        </div>

        {/* ── Carousel ── */}
        <div className="relative">

          {total > 1 && (
            <>
              <button onClick={prev} aria-label="Previous deal"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden sm:flex w-10 h-10 rounded-full bg-white border border-orange-200 shadow-md text-orange-500 items-center justify-center hover:bg-orange-50 transition-all active:scale-95">
                <ChevronLeft size={18} />
              </button>
              <button onClick={next} aria-label="Next deal"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden sm:flex w-10 h-10 rounded-full bg-white border border-orange-200 shadow-md text-orange-500 items-center justify-center hover:bg-orange-50 transition-all active:scale-95">
                <ChevronRight size={18} />
              </button>
            </>
          )}

          <div
            key={deal.id}
            className={`transition-all duration-450 ${animating ? "opacity-0 translate-x-3" : "opacity-100 translate-x-0"}`}
          >
            <DealCard deal={deal} />
          </div>

          {total > 1 && (
            <div className="flex justify-center gap-2 mt-5">
              {deals.map((d, i) => (
                <button key={d.id} aria-label={`Go to deal ${i + 1}`}
                  onClick={() => { goTo(i); resetAuto(); }}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? "w-6 h-2.5 bg-orange-500" : "w-2.5 h-2.5 bg-gray-300 hover:bg-orange-300"
                  }`}
                />
              ))}
            </div>
          )}

          {total > 1 && (
            <div className="flex justify-between sm:hidden mt-4">
              <button onClick={prev}
                className="flex items-center gap-1.5 text-sm font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full active:scale-95 transition-all">
                <ChevronLeft size={15} /> Prev
              </button>
              <span className="text-xs text-gray-400 font-medium self-center">{current + 1} / {total}</span>
              <button onClick={next}
                className="flex items-center gap-1.5 text-sm font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full active:scale-95 transition-all">
                Next <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>

        <div className="mb-4 md:mb-8" />
      </div>
    </section>
  );
}
