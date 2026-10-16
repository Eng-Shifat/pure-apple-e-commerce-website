// FILE: app/(shop)/todays-deal/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Today's Deal — Dedicated page (linked from banner click & TodaysDeal section)
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Zap, Timer, Tag, ShoppingCart,
  ChevronLeft, ArrowRight, Sparkles,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { displayPricing } from "@/lib/offers";

// ── Types ─────────────────────────────────────────────────────────────────────
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
  colors?: string;
}

// ── Countdown ─────────────────────────────────────────────────────────────────
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

function CountdownBlock({ endsAt }: { endsAt: string }) {
  const time = useCountdown(endsAt);
  if (!time) return null;

  const units = [
    { label: "Hours",   val: time.expired ? 0 : time.h },
    { label: "Minutes", val: time.expired ? 0 : time.m },
    { label: "Seconds", val: time.expired ? 0 : time.s },
  ];

  if (time.expired) {
    return (
      <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
        <Timer size={16} /> Deal has ended
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 text-xs font-semibold text-gray-400">
        <Timer size={13} className="text-orange-500" /> Ends in
      </div>
      <div className="flex items-center gap-1.5">
        {units.map((u, i) => (
          <span key={u.label} className="flex items-center gap-1.5">
            <span className="flex flex-col items-center">
              <span className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-900 text-white font-mono font-extrabold text-xl shadow-lg">
                {pad(u.val)}
              </span>
              <span className="text-[9px] text-gray-400 mt-0.5 font-semibold uppercase tracking-wider">
                {u.label}
              </span>
            </span>
            {i < 2 && <span className="text-gray-400 font-bold text-lg -mt-4">:</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Color helpers ─────────────────────────────────────────────────────────────
const COLOR_MAP: Record<string, string> = {
  "black": "#1a1a1a", "midnight": "#1c1c2e", "space black": "#2a2a2a",
  "white": "#f5f5f5", "starlight": "#f5e6d3", "silver": "#c0c0c0",
  "gold": "#d4aa70", "rose gold": "#e8b4a0", "pink": "#f4a7b9",
  "red": "#e63946", "blue": "#2563eb", "sierra blue": "#7eb8d4",
  "pacific blue": "#1e6091", "alpine green": "#4a7c59",
  "midnight green": "#3d6b5e", "green": "#22c55e",
  "purple": "#9333ea", "deep purple": "#6d28d9",
  "natural titanium": "#b0a090", "black titanium": "#3a3a3a",
  "white titanium": "#e8e4e0", "desert titanium": "#c4a882",
  "yellow": "#facc15", "orange": "#f97316", "graphite": "#6b7280",
};
function colorHex(name: string) {
  return COLOR_MAP[name.toLowerCase().trim()] ?? "#9ca3af";
}
function parseColors(val: string | undefined): string[] {
  if (!val) return [];
  try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; }
}

// ── Deal Card (big featured card) ─────────────────────────────────────────────
function FeaturedDealCard({ deal }: { deal: DealProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const { final: activePrice, compare } = displayPricing(deal.price, deal.original_price, deal.deal_price);
  const comparePrice = compare ?? activePrice;
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
    <div className="group relative rounded-3xl overflow-hidden border border-orange-100 shadow-xl hover:shadow-2xl transition-shadow duration-500"
      style={{ background: "linear-gradient(135deg, #fff8f3 0%, #ffffff 60%, #fffdf5 100%)" }}
    >
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 70% 40%, rgba(251,87,36,0.08) 0%, transparent 65%)" }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* ── Image side ── */}
        <div className="relative flex items-center justify-center min-h-[320px] lg:min-h-[480px] bg-gradient-to-br from-gray-50 via-white to-gray-100 p-10 overflow-hidden">
          {/* Large discount badge */}
          {discount && (
            <span className="absolute top-5 left-5 z-10 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-red-500 text-white shadow-lg shadow-red-200">
              <span className="text-[10px] font-semibold leading-none">SAVE</span>
              <span className="text-xl font-black leading-tight">{discount}%</span>
            </span>
          )}

          {/* Color dots */}
          {colors.length > 0 && (
            <div className="absolute top-5 right-5 z-10 flex flex-col gap-2.5">
              {colors.map((c) => (
                <span key={c} title={c}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-md ring-1 ring-gray-200"
                  style={{ backgroundColor: colorHex(c) }}
                />
              ))}
            </div>
          )}

          <Link href={`/products/${deal.slug}`} className="relative z-0">
            <Image
              src={deal.image}
              alt={deal.name}
              width={380}
              height={380}
              className="object-contain max-h-[340px] drop-shadow-2xl group-hover:scale-[1.05] transition-transform duration-700"
              priority
            />
          </Link>

          {/* Flash badge ribbon */}
          <div className="absolute bottom-5 left-5 flex items-center gap-1.5 bg-orange-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-orange-200">
            <Zap size={11} className="fill-white" /> FLASH DEAL
          </div>
        </div>

        {/* ── Info side ── */}
        <div className="flex flex-col justify-center gap-5 p-8 lg:p-12">
          {/* Labels */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-orange-500 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
              <Sparkles size={11} /> Today&apos;s Deal
            </span>
            {deal.badge && (
              <span className="inline-block text-white text-[11px] font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: deal.badge_color ?? "#FB5724" }}>
                {deal.badge}
              </span>
            )}
          </div>

          {/* Countdown */}
          {deal.deal_ends_at && <CountdownBlock endsAt={deal.deal_ends_at} />}

          {/* Name */}
          <Link href={`/products/${deal.slug}`}
            className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight hover:text-orange-600 transition-colors">
            {deal.name}
          </Link>

          {/* Specs */}
          {(deal.spec_screen || deal.spec_ram || deal.spec_camera) && (
            <ul className="flex flex-wrap gap-2">
              {[deal.spec_screen, deal.spec_ram, deal.spec_camera].filter(Boolean).map((s) => (
                <li key={s} className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
                  {s}
                </li>
              ))}
            </ul>
          )}

          {/* Price block */}
          <div className="flex flex-wrap items-end gap-3">
            <span className="text-4xl lg:text-5xl font-black text-orange-500 tracking-tight">
              ৳{activePrice.toLocaleString("en-BD")}
            </span>
            {comparePrice > activePrice && (
              <span className="text-xl text-gray-400 line-through font-medium mb-1">
                ৳{comparePrice.toLocaleString("en-BD")}
              </span>
            )}
            {discount && (
              <span className="inline-flex items-center gap-1 text-sm font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full mb-1">
                <Tag size={13} /> Save ৳{(comparePrice - activePrice).toLocaleString("en-BD")}
              </span>
            )}
          </div>

          {/* Colors row */}
          {colors.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-400">Colors:</span>
              {colors.map((c) => (
                <span key={c}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-100 px-2.5 py-1 rounded-full shadow-sm">
                  <span className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: colorHex(c) }} />
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button onClick={handleAddToCart}
              className={`inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-lg active:scale-95 ${
                added
                  ? "bg-green-500 text-white shadow-green-200"
                  : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5"
              }`}
            >
              <ShoppingCart size={18} />
              {added ? "Added to Cart ✓" : "Add to Cart"}
            </button>
            <Link href={`/products/${deal.slug}`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base bg-white border border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-all hover:-translate-y-0.5">
              View Details <ArrowRight size={16} />
            </Link>
          </div>

          {!deal.deal_ends_at && (
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <Zap size={11} className="text-orange-400" />
              Limited time offer — grab it before it&apos;s gone!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Small deal tile (for secondary deals) ─────────────────────────────────────
function SmallDealTile({ deal }: { deal: DealProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const { final: activePrice, compare } = displayPricing(deal.price, deal.original_price, deal.deal_price);
  const comparePrice = compare ?? activePrice;
  const discount     = comparePrice > activePrice
    ? Math.round(((comparePrice - activePrice) / comparePrice) * 100)
    : null;

  return (
    <div className="group relative rounded-2xl border border-orange-100 overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-6 min-h-[200px]">
        {discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        <Link href={`/products/${deal.slug}`}>
          <Image
            src={deal.image}
            alt={deal.name}
            width={160}
            height={160}
            className="object-contain max-h-[150px] drop-shadow-lg group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        {deal.deal_ends_at && (
          <SmallCountdown endsAt={deal.deal_ends_at} />
        )}
        <Link href={`/products/${deal.slug}`}
          className="font-bold text-sm text-gray-900 hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
          {deal.name}
        </Link>
        <div className="flex items-baseline gap-2 flex-wrap mt-auto">
          <span className="text-lg font-extrabold text-orange-500">
            ৳{activePrice.toLocaleString("en-BD")}
          </span>
          {comparePrice > activePrice && (
            <span className="text-xs text-gray-400 line-through">
              ৳{comparePrice.toLocaleString("en-BD")}
            </span>
          )}
        </div>
        <button
          onClick={() => {
            addItem({
              id: deal.id, name: deal.name, variant: "", price: activePrice,
              original_price: comparePrice, rating: deal.rating ?? 0,
              review_count: deal.review_count ?? 0, image: deal.image,
              slug: deal.slug, badge: "Today's Deal", badge_color: "#FB5724",
            } as never);
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
          className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
            added
              ? "bg-green-500 text-white"
              : "bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-500 hover:text-white hover:border-orange-500"
          }`}
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

function SmallCountdown({ endsAt }: { endsAt: string }) {
  const time = useCountdown(endsAt);
  if (!time || time.expired) return null;
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500">
      <Timer size={10} className="text-orange-400" />
      {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="rounded-3xl bg-gray-100 h-[480px] mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-gray-100 h-64" />
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TodaysDealPage() {
  const [deals, setDeals] = useState<DealProduct[] | undefined>(undefined);

  useEffect(() => {
    fetch("/api/products?today_deal=true&limit=20")
      .then((r) => r.json())
      .then((d) => setDeals(d.products ?? []))
      .catch(() => setDeals([]));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-white">
      {/* ── Hero Header ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #FB5724, transparent)" }} />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #FB5724, transparent)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          {/* Back link */}
          <Link href="/"
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium mb-6 transition-colors">
            <ChevronLeft size={16} /> Back to Home
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-orange-400 bg-orange-400/10 border border-orange-400/30 px-3 py-1 rounded-full">
                  <Zap size={11} className="fill-orange-400" /> Flash Offer
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                Today&apos;s <span className="text-orange-400">Deals</span>
              </h1>
              <p className="text-white/50 mt-2 text-sm">
                Exclusive limited-time offers — grab them before they&apos;re gone.
              </p>
            </div>
            <div className="flex items-center gap-2 text-white/40 text-sm font-medium">
              <Sparkles size={14} className="text-orange-400" />
              {deals === undefined ? "Loading..." : `${deals.length} deal${deals.length !== 1 ? "s" : ""} available`}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {deals === undefined && <Skeleton />}

        {deals !== undefined && deals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center">
              <Zap size={36} className="text-orange-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-700">No active deals right now</h2>
            <p className="text-gray-400 text-sm max-w-xs">
              Check back soon — our admin is always adding new flash deals!
            </p>
            <Link href="/"
              className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-all">
              Browse All Products <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {deals !== undefined && deals.length > 0 && (
          <div className="flex flex-col gap-10">
            {/* Featured deal (first one, big card) */}
            <FeaturedDealCard deal={deals[0]} />

            {/* Rest as grid */}
            {deals.length > 1 && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Zap size={16} className="text-orange-500 fill-orange-100" />
                  More Flash Deals
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {deals.slice(1).map((deal) => (
                    <SmallDealTile key={deal.id} deal={deal} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
