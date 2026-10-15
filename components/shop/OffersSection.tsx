"use client";

/**
 * OffersSection — homepage "Special Offers"
 * - Admin যত offer বানাবে (Best Deal, Today's Offer, Black Friday, Black Sunday …) সব tab হিসেবে আসবে
 * - Live offer আগে, upcoming offer "Starts in" countdown সহ
 * - Time frame শেষ হলে tab নিজে থেকেই সরে যায়, পরের offer সামনে আসে
 * - Tab click → ওই offer-এর product গুলো দেখায়; "View all" → /offers/[slug]
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Flame, ChevronRight } from "lucide-react";
import SharedProductCard, { type SharedProduct } from "./SharedProductCard";
import OfferCountdown from "./OfferCountdown";
import { useCartStore } from "@/store/cartStore";
import { offerStatus, type Offer, type OfferProduct } from "@/lib/offers";

export function toCard(p: OfferProduct): SharedProduct {
  const compare = p.price > p.offer_price ? p.price : (p.original_price ?? undefined) || undefined;
  return {
    id: p.id, name: p.name, variant: p.variant, slug: p.slug, image: p.image,
    price: p.offer_price,
    originalPrice: compare && compare > p.offer_price ? compare : undefined,
    rating: p.rating, reviewCount: p.review_count,
    badge: p.badge ?? undefined, badgeColor: p.badge_color ?? undefined,
    specs: { screen: p.spec_screen, ram: p.spec_ram, camera: p.spec_camera },
  };
}

export default function OffersSection() {
  const [offers, setOffers] = useState<Offer[] | undefined>(undefined);
  const [activeId, setActiveId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  const load = useCallback(() => {
    fetch("/api/offers?limit=12", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setOffers(d.offers ?? []))
      .catch(() => setOffers([]));
  }, []);

  useEffect(() => { load(); }, [load]);

  // নিজে থেকে status refresh (live ↔ upcoming ↔ ended) — প্রতি ৩০ সেকেন্ডে
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const visible = useMemo(() => {
    const now = Date.now();
    return (offers ?? [])
      .map((o) => ({ ...o, status: offerStatus(o, now) }))
      .filter((o) => o.status !== "ended" && (o.products?.length ?? 0) > 0)
      .sort((a, b) => (a.status === b.status ? 0 : a.status === "live" ? -1 : 1));
  }, [offers, tick]); // eslint-disable-line react-hooks/exhaustive-deps

  if (offers === undefined || visible.length === 0) return null;

  const active = visible.find((o) => o.id === activeId) ?? visible[0];
  const isLive = active.status === "live";

  function handleAddToCart(p: SharedProduct) {
    addItem({
      id: p.id, name: p.name, variant: p.variant ?? "", price: p.price,
      original_price: p.originalPrice, rating: p.rating ?? 0, review_count: p.reviewCount ?? 0,
      image: p.image, slug: p.slug, badge: p.badge ?? active.title, badge_color: p.badgeColor ?? active.color,
      spec_screen: p.specs?.screen, spec_ram: p.specs?.ram, spec_camera: p.specs?.camera,
    } as never);
  }

  return (
    <section id="offers" className="bg-white pt-6 pb-4 md:pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between gap-2 mb-4">
          <div className="min-w-0">
            <p className="text-brand-500 text-xs font-semibold uppercase tracking-widest mb-1 flex items-center gap-1">
              <Flame size={13} className="fill-brand-200" /> Limited Time
            </p>
            <h2 className="text-gray-900 text-xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Special Offers
            </h2>
          </div>
          <Link href="/offers"
            className="shrink-0 text-brand-500 text-[13px] sm:text-sm font-semibold border border-brand-200 hover:border-brand-400 hover:bg-brand-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all whitespace-nowrap">
            All Offers →
          </Link>
        </div>

        {/* Offer tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0" style={{ scrollbarWidth: "none" }}>
          {visible.map((o) => {
            const on = o.id === active.id;
            return (
              <button key={o.id} onClick={() => setActiveId(o.id)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold border transition-all active:scale-95 ${
                  on ? "text-white border-transparent shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
                style={on ? { backgroundColor: o.color, boxShadow: `0 6px 16px ${o.color}44` } : undefined}>
                <span>{o.emoji}</span>
                <span className="whitespace-nowrap">{o.title}</span>
                {o.status === "upcoming" && (
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${on ? "bg-white/25" : "bg-gray-100 text-gray-500"}`}>Soon</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active offer banner */}
        <div key={active.id} className="mt-3 rounded-2xl p-4 sm:p-5 text-white relative overflow-hidden"
          style={{ background: `linear-gradient(120deg, ${active.color} 0%, ${active.color}CC 55%, #0E2318 140%)` }}>
          <div aria-hidden className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg sm:text-2xl font-extrabold leading-tight">{active.emoji} {active.title}</h3>
              <p className="text-white/80 text-xs sm:text-sm mt-0.5">
                {active.subtitle || `${active.product_count ?? active.products?.length} products${active.discount_percent ? ` · up to ${active.discount_percent}% off` : ""}`}
              </p>
            </div>
            {!active.no_timer && (
              <OfferCountdown
                key={active.id + active.status}
                target={isLive ? active.ends_at : active.starts_at}
                label={isLive ? "Ends in" : "Starts in"}
                dark
                onDone={load}
              />
            )}
          </div>
        </div>

        {/* Products of the active offer */}
        {isLive ? (
          <>
            <div className="flex gap-3 overflow-x-auto pb-2 pt-4 sm:hidden" style={{ scrollbarWidth: "none" }}>
              {active.products!.map((p) => (
                <div key={p.id} className="w-[175px] shrink-0">
                  <SharedProductCard product={toCard(p)} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>
            <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-3">
              {active.products!.slice(0, 5).map((p) => (
                <SharedProductCard key={p.id} product={toCard(p)} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-8 text-center">
            <p className="text-sm font-semibold text-gray-700">{active.product_count} products are coming in this offer</p>
            <p className="text-xs text-gray-400 mt-1">Offer শুরু হলে এখানেই দেখতে পাবেন</p>
          </div>
        )}

        <div className="mt-3 flex justify-center">
          <Link href={`/offers/${active.slug}`}
            className="inline-flex items-center gap-1 text-sm font-bold px-5 py-2.5 rounded-full text-white active:scale-95 transition-transform"
            style={{ backgroundColor: active.color }}>
            View all {active.product_count} products <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
