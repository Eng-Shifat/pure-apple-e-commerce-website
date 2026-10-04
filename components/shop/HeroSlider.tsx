"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import PhoneModelLazy from "./PhoneModelLazy";

// ── Models (put the .glb files in public/models/) ──────────────
const MODEL_A = "/models/apple-iphone-duo.glb";
const MODEL_B = "/models/iphone.glb";

// ── Slides ─────────────────────────────────────────────────────
// Each slide = one banner (left, 70%) + one 3D model + one product card (right, 30%).
// Banners live in public/images/hero/ (size 1808 × 870 px works best).
// To add a slide: copy one block, change the banner / model / card text.
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

const AUTO_MS = 6000; // normal time between slides
const RESUME_MS = 2000; // after the 3D phone is released / un-hovered: wait this long, then change slide

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Auto-slide is paused while the 3D phone is touched (finger down) or hovered (mouse).
  // When it is let go, the slide changes after RESUME_MS of no interaction.
  const nextAt = useRef(Date.now() + AUTO_MS);
  const holds = useRef({ pointers: new Set<number>(), hover: false, last: 0 });

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
      // safety: a finger that never reported "up" must not freeze the slider forever
      if (h.pointers.size && Date.now() - h.last > 10000) h.pointers.clear();
      if (h.pointers.size > 0 || h.hover) return; // being touched / hovered → stay on this slide
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
    onPointerDown: (e: React.PointerEvent) => {
      holds.current.pointers.add(e.pointerId);
      holds.current.last = Date.now();
    },
    onPointerMove: () => {
      holds.current.last = Date.now();
    },
    onPointerUp: (e: React.PointerEvent) => {
      holds.current.pointers.delete(e.pointerId);
      released();
    },
    onPointerCancel: (e: React.PointerEvent) => {
      holds.current.pointers.delete(e.pointerId);
      released();
    },
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") holds.current.hover = true;
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") {
        holds.current.hover = false;
        released();
      }
    },
  };

  const slide = slides[current];

  // Touch swipe to change slides (ignored on the 3D phone, which has its own drag)
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = (e.target as HTMLElement).closest("[data-no-swipe]")
      ? null
      : e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(dx) < 50) return;
    goTo(dx < 0 ? (current + 1) % slides.length : (current - 1 + slides.length) % slides.length);
  };

  // The two call-to-action buttons (used on the banner for desktop, under it on mobile)
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

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 md:pt-4 pb-1">
      {/* Hero = 2 columns on desktop: banner 70% (left) + 3D phone 30% (right).
          Mobile/tablet: banner on top, 3D phone below. */}
      <div className="grid gap-3 lg:grid-cols-[7fr_3fr] lg:gap-4">

        {/* ═════════ LEFT (70%): banner card ═════════ */}
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative overflow-hidden rounded-3xl bg-white shadow-sm min-w-0"
        >
          <h1 className="sr-only">{slide.cardName} – Pure Apple Mobile &amp; Gadget Shop</h1>

          {/* The banner keeps its own shape (no cropping); on small laptops it may trim a little from the sides */}
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

            {/* Buttons on top of the banner (desktop) */}
            {cta("hidden lg:flex absolute z-10 left-[6.5%] bottom-[27%]")}

            {/* Prev / Next */}
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

            {/* Dots */}
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

          {/* Buttons under the banner (tablet only; hidden on phones) */}
          {cta("hidden sm:flex lg:hidden p-3 pt-2")}
        </div>
        {/* ═════════ end LEFT ═════════ */}

        {/* ═════════ RIGHT (30%): 3D phone + product card ═════════ */}
        <div
          className="relative overflow-hidden rounded-3xl shadow-sm h-[350px] sm:h-[480px] lg:h-auto min-w-0"
          style={{ background: "linear-gradient(160deg, #0b1230 0%, #050814 60%, #1a0d08 100%)" }}
        >
          <div
            className="absolute pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(251,87,36,0.22) 0%, rgba(59,110,255,0.10) 45%, transparent 70%)" }}
          />

          {/* 3D phone sits above the product card (changes together with the banner) */}
          <div className="absolute inset-x-0 top-0 bottom-[84px] sm:bottom-28" {...hold3d}>
            <PhoneModelLazy fill model={slide.model} />
          </div>

          {/* ── Product card (changes with every slide) ── */}
          <div className="absolute inset-x-3 bottom-3 sm:bottom-4 z-20">
            <div className="relative grid grid-cols-[1fr_auto] items-center gap-3 rounded-[22px] sm:rounded-2xl py-3 pl-4 pr-3.5 sm:pr-2.5 sm:py-2.5 bg-gradient-to-br from-white/[0.16] to-white/[0.05] sm:bg-none sm:bg-white/10 backdrop-blur-2xl border border-white/[0.14] sm:border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.22)]">
              <div className="min-w-0 flex flex-col items-start gap-1.5 sm:gap-0 sm:block">
                <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-brand-300 sm:inline-block sm:bg-brand-500/20 sm:border sm:border-brand-400/30 sm:px-2 sm:py-0.5 sm:rounded-full sm:mb-1 sm:normal-case sm:tracking-normal">
                  <span aria-hidden="true" className="sm:hidden w-1 h-1 rounded-full bg-brand-400 shadow-[0_0_6px_2px_rgba(251,87,36,0.6)]" />
                  {slide.cardBadge}
                </span>
                <h3 className="text-white font-bold text-base sm:text-sm tracking-tight leading-tight line-clamp-2">{slide.cardName}</h3>
                <p className="flex items-baseline gap-1.5 sm:block text-white/50 text-[11px] leading-none sm:leading-tight sm:mt-0.5">
                  {slide.cardPriceLabel} <span className="text-white font-extrabold text-xl sm:text-base tracking-tight">{slide.cardPrice}</span>
                </p>
              </div>
              <Link
                href={slide.cardHref}
                className="inline-flex items-center justify-center gap-1.5 shrink-0 h-11 px-5 rounded-full bg-gradient-to-b from-brand-400 to-brand-500 text-white text-[13px] font-semibold tracking-wide shadow-[0_6px_18px_rgba(251,87,36,0.45),inset_0_1px_0_rgba(255,255,255,0.35)] transition active:scale-95 hover:brightness-110 sm:h-auto sm:px-4 sm:py-3 sm:rounded-xl sm:bg-none sm:bg-brand-500 sm:hover:bg-brand-400 sm:hover:brightness-100 sm:text-xs sm:tracking-normal sm:shadow-lg sm:shadow-brand-500/30"
              >
                BUY NOW
                <ArrowRight size={15} strokeWidth={2.5} className="sm:hidden" />
                <span className="hidden sm:inline">→</span>
              </Link>
            </div>
          </div>
        </div>
        {/* ═════════ end RIGHT ═════════ */}
      </div>
    </section>
  );
}
