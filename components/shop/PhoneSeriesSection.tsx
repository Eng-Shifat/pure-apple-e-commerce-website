"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BRAND_SERIES, phonesByBrand, type CatalogPhone } from "@/lib/phoneCatalog";
import SharedProductCard, { type SharedProduct } from "./SharedProductCard";

/* ─────────────────────────────────────────────
   DATA
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

/* CatalogPhone → SharedProduct */
function toShared(p: CatalogPhone): SharedProduct {
  return {
    id: p.id,
    name: p.name,
    variant: p.storage ? `${p.storage} – ${p.colors[0]?.name ?? ""}` : undefined,
    storage: p.storage,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.colors[0]?.image ?? "",
    slug: p.slug,
    badge: p.badge,
    badgeColor: p.badgeColor,
    colors: p.colors,
    specs: p.specs,
  };
}

/* ─────────────────────────────────────────────
   ANIMATED TITLE — slides in from left on scroll into view
───────────────────────────────────────────── */
function AnimatedSeriesTitle({
  seriesName,
  accentColor,
}: {
  seriesName: string;
  accentColor: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const words = seriesName.split(" ");
  const first = words[0];
  const rest  = words.slice(1).join(" ");

  return (
    <div ref={ref} className="flex items-center gap-2.5 overflow-hidden">
      {/* Colored bar — grows in */}
      <span
        className="h-5 rounded-full flex-shrink-0 transition-all duration-500"
        style={{
          backgroundColor: accentColor,
          width: visible ? "4px" : "0px",
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Title slides in */}
      <div
        className="transition-all duration-500 ease-out"
        style={{
          transform: visible ? "translateX(0)" : "translateX(-18px)",
          opacity: visible ? 1 : 0,
        }}
      >
        <h3 className="font-extrabold text-[15px] sm:text-base text-gray-900 leading-tight">
          <span style={{ color: accentColor }}>{first}</span>
          {rest && <span> {rest}</span>}
        </h3>
        <p className="text-[11px] text-gray-400 mt-0.5 hidden sm:block">
          {/* product count rendered by SeriesBlock */}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SINGLE SERIES BLOCK
───────────────────────────────────────────── */
const DESKTOP_VISIBLE = 10;

function SeriesBlock({ series }: { series: PhoneSeries }) {
  const visibleProducts = series.products.slice(0, DESKTOP_VISIBLE);

  return (
    <div
      className="rounded-2xl overflow-visible"
      style={{ border: `1.5px solid ${series.borderColor}` }}
    >
      {/* Header stripe */}
      <div
        className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 rounded-t-2xl"
        style={{ backgroundColor: series.accentBg }}
      >
        {/* Animated title */}
        <div className="flex items-center gap-0">
          <AnimatedSeriesTitle
            seriesName={series.seriesName}
            accentColor={series.accentColor}
          />
          {/* models count right of title */}
          <span className="text-[11px] text-gray-400 ml-2 hidden sm:inline">
            · {series.products.length} model{series.products.length !== 1 ? "s" : ""}
          </span>
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

      {/* Products */}
      <div className="bg-white px-3 py-4 sm:px-4 rounded-b-2xl overflow-visible">

        {/* Mobile: horizontal scroll */}
        <div
          className="flex gap-3 overflow-x-auto sm:hidden pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {visibleProducts.map((p) => (
            <div key={p.id} className="flex-shrink-0 w-[175px]">
              <SharedProductCard product={toShared(p)} />
            </div>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {visibleProducts.map((p) => (
            <SharedProductCard key={p.id} product={toShared(p)} />
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
