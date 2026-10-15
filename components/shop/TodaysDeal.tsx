"use client";

/**
 * TodaysDeal — Today's Deal section
 *
 * Admin marks a product as today's deal via the Admin Products page.
 * Fields used from the products table:
 *   is_today_deal  boolean            — whether this product is the active deal
 *   deal_price     numeric            — discounted price (required when is_today_deal=true)
 *   deal_ends_at   timestamptz | null — optional expiry; null = runs until admin turns it off
 *
 * Behaviour:
 *   • Shows a countdown timer on the card if deal_ends_at is set.
 *   • When the timer hits 00:00:00 the deal price is visually replaced with the regular
 *     price and a "Deal Ended" tag appears (the DB row will already be expired; the API
 *     filters those out too via the deal_expired check).
 *   • If no product has is_today_deal=true (or the deal expired server-side) the whole
 *     section is hidden.
 */

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Zap, Timer, Tag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface DealProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;            // regular price
  deal_price: number;       // discounted deal price
  original_price?: number;  // MRP / original price (optional)
  deal_ends_at: string | null;
  badge?: string;
  badge_color?: string;
  spec_screen?: string;
  spec_ram?: string;
  spec_camera?: string;
  rating?: number;
  review_count?: number;
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

// ── CountdownDisplay ──────────────────────────────────────────────────────────
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
    <div className="flex items-center gap-1.5">
      <Timer size={13} className="text-orange-500 shrink-0" />
      <span className="text-[11px] font-semibold text-gray-500">Ends in</span>
      {[pad(time.h), pad(time.m), pad(time.s)].map((unit, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="inline-flex items-center justify-center w-9 h-8 rounded-lg bg-gray-900 text-white font-mono text-sm font-extrabold leading-none shadow-sm">
            {unit}
          </span>
          {i < 2 && <span className="text-gray-500 font-bold text-sm">:</span>}
        </span>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TodaysDeal() {
  const [deal, setDeal]     = useState<DealProduct | null | undefined>(undefined); // undefined = loading
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded]   = useState(false);

  // Also track expiry client-side so we hide the section when timer hits 0
  const countdown = useCountdown(deal?.deal_ends_at ?? null);
  const isExpired = countdown?.expired === true;

  useEffect(() => {
    fetch("/api/products?today_deal=true&limit=1")
      .then((r) => r.json())
      .then((d) => setDeal(d.products?.[0] ?? null))
      .catch(() => setDeal(null));
  }, []);

  if (deal === undefined) return null; // loading — show nothing
  if (!deal) return null;              // no active deal
  if (isExpired) return null;          // timer expired client-side

  const activePrice   = deal.deal_price ?? deal.price;
  const comparePrice  = deal.original_price ?? deal.price;
  const discount      = comparePrice > activePrice
    ? Math.round(((comparePrice - activePrice) / comparePrice) * 100)
    : null;

  function handleAddToCart() {
    addItem({
      id:             deal!.id,
      name:           deal!.name,
      variant:        "",
      price:          activePrice,
      original_price: comparePrice,
      rating:         deal!.rating ?? 0,
      review_count:   deal!.review_count ?? 0,
      image:          deal!.image,
      slug:           deal!.slug,
      badge:          deal!.badge ?? "Today's Deal",
      badge_color:    deal!.badge_color ?? "#FB5724",
      spec_screen:    deal!.spec_screen,
      spec_ram:       deal!.spec_ram,
      spec_camera:    deal!.spec_camera,
    } as never);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <section id="todays-deal" className="bg-white pt-8 md:pt-12 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={18} className="text-orange-500 fill-orange-100" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-orange-500">Flash Offer</span>
            </div>
            <h2 className="text-gray-900 text-2xl font-bold">Today&apos;s Deal</h2>
            <p className="text-gray-400 text-sm mt-0.5">One exclusive deal, limited time only.</p>
          </div>
          <Link
            href={`/products/${deal.slug}`}
            className="text-brand-600 text-sm font-medium hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            View Product →
          </Link>
        </div>

        {/* ── Deal card ── */}
        <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-yellow-50 shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

            {/* Left — image */}
            <Link
              href={`/products/${deal.slug}`}
              className="group relative flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 min-h-[260px] md:min-h-[320px] p-8"
            >
              {/* Badge */}
              {deal.badge && (
                <span
                  className="absolute top-4 left-4 z-10 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-lg tracking-wide"
                  style={{ backgroundColor: deal.badge_color ?? "#FB5724" }}
                >
                  {deal.badge}
                </span>
              )}
              {/* Discount pill */}
              {discount && (
                <span className="absolute top-4 right-4 z-10 bg-red-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                  -{discount}%
                </span>
              )}
              <Image
                src={deal.image}
                alt={deal.name}
                width={320}
                height={320}
                className="object-contain max-h-[260px] group-hover:scale-[1.04] transition-transform duration-500"
              />
            </Link>

            {/* Right — info */}
            <div className="flex flex-col justify-center gap-5 p-7 md:p-10">

              {/* Timer */}
              {deal.deal_ends_at && (
                <CountdownDisplay endsAt={deal.deal_ends_at} />
              )}

              {/* Name */}
              <div>
                <Link
                  href={`/products/${deal.slug}`}
                  className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight hover:text-orange-600 transition-colors"
                >
                  {deal.name}
                </Link>
              </div>

              {/* Specs */}
              {(deal.spec_screen || deal.spec_ram || deal.spec_camera) && (
                <ul className="flex flex-wrap gap-2">
                  {[deal.spec_screen, deal.spec_ram, deal.spec_camera].filter(Boolean).map((s) => (
                    <li
                      key={s}
                      className="text-[11px] font-semibold text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-extrabold text-orange-500">
                  ৳{activePrice.toLocaleString("en-BD")}
                </span>
                {comparePrice > activePrice && (
                  <span className="text-lg text-gray-400 line-through font-medium">
                    ৳{comparePrice.toLocaleString("en-BD")}
                  </span>
                )}
                {discount && (
                  <span className="inline-flex items-center gap-1 text-[12px] font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                    <Tag size={11} /> Save {discount}%
                  </span>
                )}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-lg active:scale-95 ${
                    added
                      ? "bg-green-500 text-white shadow-green-200"
                      : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200"
                  }`}
                >
                  <ShoppingCart size={16} />
                  {added ? "Added ✓" : "Add to Cart"}
                </button>
                <Link
                  href={`/products/${deal.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-white border border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-all"
                >
                  View Details
                </Link>
              </div>

              {/* Deal ends note */}
              {!deal.deal_ends_at && (
                <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
                  <Zap size={11} className="text-orange-400" />
                  Limited time offer — grab it before it&apos;s gone!
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
