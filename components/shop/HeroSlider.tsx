"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import PhoneModelLazy from "./PhoneModelLazy";

// ── Models ──────────────────────────────────────────────────────
const MODEL_A = "/models/apple-iphone-duo.glb";
const MODEL_B = "/models/iphone.glb";

// ── Main Slides ─────────────────────────────────────────────────
const slides = [
  {
    id: 1,
    banner: "/images/hero/iphone17pro.webp",
    model: MODEL_A,
    cardBadge: "New Arrival",
    cardName: "iPhone 17 Pro",
    cardPriceLabel: "From",
    cardPrice: "$1199",
    cardHref: "/products/iphone-17-pro",
  },
  {
    id: 2,
    banner: "/images/hero/iphone16pro.webp",
    model: MODEL_B,
    cardBadge: "Best Seller",
    cardName: "iPhone 16 Pro",
    cardPriceLabel: "From",
    cardPrice: "$1199",
    cardHref: "/products/iphone-16-pro",
  },
];

// ── Side Banners (cycle in the single bottom-right slot) ────────
// Add more banners here — they change in sync with the main slider (one per slide).
// Each banner needs: src (public/images/hero/), href, alt.
const SIDE_BANNERS = [
  {
    src: "/images/hero/side-banner.webp",
    href: "/products?deals=true",
    alt: "Special offers – Pure Apple Mobile & Gadget Shop",
  },
  {
    src: "/images/hero/side-banner-2.webp",
    href: "/#todays-deal",
    alt: "Hot Deal – Pure Apple Mobile & Gadget Shop",
  },
];

const AUTO_MS   = 6000;
const RESUME_MS = 2000;

export default function HeroSlider() {
  const [current,   setCurrent]   = useState(0);
  const [animating, setAnimating] = useState(false);

  // Side banner index is always derived from the main slide index,
  // so both change at exactly the same moment.
  const bannerIdx = current % SIDE_BANNERS.length;

  const nextAt = useRef(Date.now() + AUTO_MS);
  const holds  = useRef({ pointers: new Set<number>(), hover: false, last: 0 });

  const goTo = (index: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(index);
    nextAt.current = Date.now() + AUTO_MS;
    setTimeout(() => setAnimating(false), 600);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const h = holds.current;
      if (h.pointers.size && Date.now() - h.last > 10000) h.pointers.clear();
      if (h.pointers.size > 0 || h.hover) return;
      if (Date.now() >= nextAt.current) {
        setCurrent((prev) => (prev + 1) % slides.length);
        nextAt.current = Date.now() + AUTO_MS;
      }
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const released = () => {
    const h = holds.current;
    if (h.pointers.size === 0 && !h.hover) nextAt.current = Date.now() + RESUME_MS;
  };
  const hold3d = {
    onPointerDown:  (e: React.PointerEvent) => { holds.current.pointers.add(e.pointerId); holds.current.last = Date.now(); },
    onPointerMove:  ()                       => { holds.current.last = Date.now(); },
    onPointerUp:    (e: React.PointerEvent) => { holds.current.pointers.delete(e.pointerId); released(); },
    onPointerCancel:(e: React.PointerEvent) => { holds.current.pointers.delete(e.pointerId); released(); },
    onPointerEnter: (e: React.PointerEvent) => { if (e.pointerType === "mouse") holds.current.hover = true; },
    onPointerLeave: (e: React.PointerEvent) => { if (e.pointerType === "mouse") { holds.current.hover = false; released(); } },
  };

  const slide = slides[current];

  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = (e.target as HTMLElement).closest("[data-no-swipe]") ? null : e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(dx) < 50) return;
    goTo(dx < 0 ? (current + 1) % slides.length : (current - 1 + slides.length) % slides.length);
  };

  const cta = (extra: string) => (
    <div className={`gap-3 ${extra}`}>
      <Link
        href="/products"
        className="inline-flex flex-1 lg:flex-none items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-semibold text-xs px-5 py-3 rounded-full transition-all shadow-lg shadow-brand-500/30"
      >
        SHOP NOW →
      </Link>
      <Link
        href="/products?deals=true"
        className="inline-flex flex-1 lg:flex-none items-center justify-center gap-2 bg-white/85 hover:bg-white backdrop-blur-md text-gray-800 font-medium text-xs px-5 py-3 rounded-full border border-gray-300/80 transition-all"
      >
        EXPLORE DEALS
      </Link>
    </div>
  );

  const activeBanner = SIDE_BANNERS[bannerIdx % SIDE_BANNERS.length];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 md:pt-4 pb-1">
      {/* Exact same grid as before: banner 70% left + right column 30% with 2 rows */}
      <div className="grid gap-2 lg:grid-cols-[7fr_3fr] lg:gap-3">

        {/* ═════════ LEFT (70%): main banner ═════════ */}
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative overflow-hidden rounded-3xl bg-white shadow-sm min-w-0"
        >
          <h1 className="sr-only">{slide.cardName} – Pure Apple Mobile &amp; Gadget Shop</h1>

          <div className="relative w-full aspect-[1808/870] lg:min-h-[420px]">
            {slides.map((s, i) => (
              <Image
                key={s.id}
                src={s.banner}
                alt={`${s.cardName} – Pure Apple`}
                fill
                priority={i === 0}
                quality={90}
                sizes="(min-width: 1280px) 860px, (min-width: 1024px) 70vw, 100vw"
                aria-hidden={i !== current}
                className={`object-cover object-[20%_center] transition-opacity duration-700 ease-in-out ${
                  i === current ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {cta("hidden lg:flex absolute z-10 left-[6.5%] bottom-[27%]")}

            <button
              aria-label="Previous slide"
              onClick={() => goTo((current - 1 + slides.length) % slides.length)}
              className="hidden xl:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-md text-gray-700 justify-center items-center transition-colors z-20 border border-black/5"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              aria-label="Next slide"
              onClick={() => goTo((current + 1) % slides.length)}
              className="hidden xl:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-md text-gray-700 justify-center items-center transition-colors z-20 border border-black/5"
            >
              <ChevronRight size={16} />
            </button>

            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {slides.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all ${i === current ? "w-6 h-2 bg-brand-500" : "w-2 h-2 bg-gray-400/60"}`}
                />
              ))}
            </div>
          </div>

          {cta("hidden sm:flex lg:hidden p-3 pt-2")}
        </div>
        {/* ═════════ end LEFT ═════════ */}

        {/* ═════════ RIGHT (30%): 2 rows — 3D phone (top) + side banner (bottom) ═════════ */}
        {/* LAYOUT UNCHANGED from original — only the bottom banner now cycles */}
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-3 lg:grid-rows-2 min-w-0 lg:h-full">

          {/* Row 1 – 3D phone (unchanged) */}
          <div
            className="relative overflow-hidden rounded-2xl shadow-sm min-w-0 aspect-[3/2] lg:aspect-auto"
            style={{
              background: "linear-gradient(145deg, #0d1f06 0%, #0a1503 40%, #1f0e02 100%)",
            }}
          >
            <div
              className="absolute pointer-events-none"
              style={{
                inset: 0,
                background: "radial-gradient(ellipse at 85% 90%, rgba(249,115,22,0.55) 0%, rgba(234,88,12,0.25) 35%, transparent 65%)",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                inset: 0,
                background: "radial-gradient(ellipse at 15% 10%, rgba(34,197,94,0.45) 0%, rgba(22,163,74,0.20) 35%, transparent 60%)",
              }}
            />
            <div className="absolute inset-0" {...hold3d}>
              <PhoneModelLazy fill model={slide.model} />
            </div>
          </div>

          {/* Row 2 – side banner: changes in sync with main slider */}
          <Link
            href={activeBanner.href}
            className="group relative block overflow-hidden rounded-2xl shadow-sm min-w-0 aspect-[3/2] lg:aspect-auto"
            style={{ background: "#f8f4ef" }}
          >
            {SIDE_BANNERS.map((b, i) => (
              <Image
                key={b.src}
                src={b.src}
                alt={b.alt}
                fill
                quality={90}
                sizes="(min-width: 1280px) 360px, (min-width: 1024px) 30vw, 50vw"
                className={`object-cover transition-all duration-700 ease-in-out group-hover:scale-[1.03] ${
                  i === bannerIdx % SIDE_BANNERS.length ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </Link>

        </div>
        {/* ═════════ end RIGHT ═════════ */}

      </div>
    </section>
  );
}
