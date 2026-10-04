"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PhoneModel = lazy(() => import("./PhoneModel"));

const slides = [
  {
    id: 1,
    eyebrow: "Latest Tech. Best Prices.",
    title: "Upgrade Your\nWorld",
    description: "Discover the latest smartphones and accessories from top brands at unbeatable prices.",
    cardBadge: "New Arrival",
    cardName: "iPhone 17 Pro",
    cardVariant: "Titanium. So strong.\nSo light. So Pro.",
    cardPriceLabel: "From",
    cardPrice: "$1199",
    cardHref: "/products/iphone-17-pro",
  },
  {
    id: 2,
    eyebrow: "Latest Tech. Best Prices.",
    title: "Power Meets\nElegance",
    description: "Experience the next generation of smartphones with cutting-edge technology.",
    cardBadge: "Best Seller",
    cardName: "Samsung Galaxy S24",
    cardVariant: "Phantom Black. Brilliant\nDisplay. All Day.",
    cardPriceLabel: "From",
    cardPrice: "$999",
    cardHref: "/products/samsung-galaxy-s24",
  },
  {
    id: 3,
    eyebrow: "Latest Tech. Best Prices.",
    title: "Smarter\nEvery Day",
    description: "Google's most powerful phone yet with AI-powered camera and pure Android.",
    cardBadge: "New Arrival",
    cardName: "Google Pixel 9",
    cardVariant: "Obsidian. AI Camera.\nPure Android.",
    cardPriceLabel: "From",
    cardPrice: "$799",
    cardHref: "/products/google-pixel-9",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = (index: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => setAnimating(false), 600);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 40%, #dbeafe 70%, #ede9fe 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-20 right-1/3 w-[500px] h-[500px] rounded-full opacity-40 pointer-events-none"
        style={{ background: "radial-gradient(circle, #bfdbfe 0%, transparent 70%)" }} />
      <div className="absolute -bottom-20 left-1/4 w-80 h-80 rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #c7d2fe 0%, transparent 70%)" }} />
      <div className="absolute top-10 right-10 w-40 h-40 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #a5b4fc 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center min-h-[560px] py-6">

          {/* ── LEFT: Text ─────────────────────── */}
          <div className="flex-1 z-10 max-w-xs lg:max-w-sm">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
              {slide.eyebrow}
            </div>

            <h1 className="text-gray-900 text-4xl lg:text-[52px] font-black leading-[1.1] mb-4 whitespace-pre-line tracking-tight">
              {slide.title}
            </h1>

            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-[250px]">
              {slide.description}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <Link href="/products"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm px-6 py-3.5 rounded-full transition-all shadow-lg shadow-blue-200">
                SHOP NOW →
              </Link>
              <Link href="/products?deals=true"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm px-6 py-3.5 rounded-full border border-gray-200 transition-all shadow-sm">
                EXPLORE DEALS
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 pt-6 border-t border-blue-100">
              {[
                { title: "Free Shipping", sub: "On orders over $50" },
                { title: "Easy Returns", sub: "30-day policy" },
                { title: "Secure Payment", sub: "100% secure" },
              ].map((b) => (
                <div key={b.title}>
                  <p className="text-gray-800 text-xs font-semibold">{b.title}</p>
                  <p className="text-gray-400 text-[11px]">{b.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── CENTER: 3D Phone ────────────────── */}
          <div className="absolute left-1/2 -translate-x-1/2 z-0 flex items-center justify-center">
            {/* Rotating rings */}
            <div className="absolute w-[380px] h-[380px] rounded-full border border-dashed border-blue-300/50"
              style={{ animation: "spinRing 18s linear infinite" }} />
            <div className="absolute w-[280px] h-[280px] rounded-full border border-indigo-200/40"
              style={{ animation: "spinRing 11s linear infinite reverse" }} />
            {/* Center glow */}
            <div className="absolute w-64 h-64 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />

            <Suspense
              fallback={
                <div className="w-72 h-[480px] flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              }
            >
              <PhoneModel />
            </Suspense>
          </div>

          {/* ── RIGHT: Product Card ─────────────── */}
          <div className="flex-1 flex justify-end z-10">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl shadow-blue-100 p-5 w-44 lg:w-52 border border-white">
              <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-full mb-3">
                {slide.cardBadge}
              </span>
              <h3 className="text-gray-900 font-bold text-base leading-snug mb-1">{slide.cardName}</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-4 whitespace-pre-line">{slide.cardVariant}</p>
              <p className="text-gray-400 text-[10px] mb-0.5">{slide.cardPriceLabel}</p>
              <p className="text-gray-900 font-black text-2xl mb-4">{slide.cardPrice}</p>
              <Link href={slide.cardHref}
                className="block w-full text-center bg-gray-900 hover:bg-blue-600 text-white font-semibold text-xs py-3 rounded-xl transition-colors">
                BUY NOW →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      <button onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-gray-500 hover:text-blue-600 flex items-center justify-center transition-colors z-20 border border-white">
        <ChevronLeft size={16} />
      </button>
      <button onClick={() => goTo((current + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-gray-500 hover:text-blue-600 flex items-center justify-center transition-colors z-20 border border-white">
        <ChevronRight size={16} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`rounded-full transition-all ${i === current ? "w-6 h-2 bg-blue-600" : "w-2 h-2 bg-blue-300"}`} />
        ))}
      </div>

      <style jsx>{`
        @keyframes spinRing {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
