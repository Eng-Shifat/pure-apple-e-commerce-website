"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Lazy load 3D model — only loads on client
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
    <section className="relative bg-gradient-to-br from-[#f0f4ff] via-[#e8edff] to-[#dde5ff] overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center min-h-[500px] py-8">

          {/* ── LEFT: Text ─────────────────────── */}
          <div className="flex-1 z-10 max-w-xs lg:max-w-sm">
            <p className="text-blue-600 text-sm font-semibold mb-3">{slide.eyebrow}</p>
            <h1 className="text-gray-900 text-4xl lg:text-5xl font-black leading-tight mb-4 whitespace-pre-line">
              {slide.title}
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-[260px]">
              {slide.description}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Link href="/products" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-3 rounded-full transition-colors">
                SHOP NOW →
              </Link>
              <Link href="/products?deals=true" className="inline-flex items-center gap-2 border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold text-sm px-5 py-3 rounded-full transition-colors">
                EXPLORE DEALS
              </Link>
            </div>
            <div className="flex items-center gap-5 mt-8 flex-wrap">
              <div>
                <p className="text-gray-900 text-xs font-semibold">Free Shipping</p>
                <p className="text-gray-400 text-[11px]">On orders over $50</p>
              </div>
              <div>
                <p className="text-gray-900 text-xs font-semibold">Easy Returns</p>
                <p className="text-gray-400 text-[11px]">30-day return policy</p>
              </div>
              <div>
                <p className="text-gray-900 text-xs font-semibold">Secure Payment</p>
                <p className="text-gray-400 text-[11px]">100% secure checkout</p>
              </div>
            </div>
          </div>

          {/* ── CENTER: 3D Phone Model ──────────── */}
          <div className="absolute left-1/2 -translate-x-1/2 z-0 flex items-center justify-center">
            {/* Outer decorative rings */}
            <div className="absolute w-80 h-80 lg:w-96 lg:h-96 rounded-full border border-dashed border-blue-300/40"
              style={{ animation: "spinRing 16s linear infinite" }} />
            <div className="absolute w-60 h-60 lg:w-72 lg:h-72 rounded-full border border-blue-200/25"
              style={{ animation: "spinRing 10s linear infinite reverse" }} />
            {/* Glow */}
            <div className="absolute w-64 h-64 rounded-full bg-blue-400/10 blur-3xl" />

            {/* 3D Model — lazy loaded */}
            <Suspense
              fallback={
                <div className="w-56 h-96 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              }
            >
              <PhoneModel />
            </Suspense>
          </div>

          {/* ── RIGHT: Product Card ─────────────── */}
          <div className="flex-1 flex justify-end z-10">
            <div className="bg-white rounded-2xl shadow-xl p-5 w-44 lg:w-52">
              <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-full mb-3">
                {slide.cardBadge}
              </span>
              <h3 className="text-gray-900 font-bold text-base leading-snug mb-1">{slide.cardName}</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-4 whitespace-pre-line">{slide.cardVariant}</p>
              <p className="text-gray-400 text-[10px] mb-0.5">{slide.cardPriceLabel}</p>
              <p className="text-gray-900 font-black text-xl mb-4">{slide.cardPrice}</p>
              <Link href={slide.cardHref} className="block w-full text-center bg-gray-900 hover:bg-blue-600 text-white font-semibold text-xs py-2.5 rounded-xl transition-colors">
                BUY NOW →
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Prev / Next */}
      <button onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md text-gray-500 hover:text-blue-600 flex items-center justify-center transition-colors z-20">
        <ChevronLeft size={16} />
      </button>
      <button onClick={() => goTo((current + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md text-gray-500 hover:text-blue-600 flex items-center justify-center transition-colors z-20">
        <ChevronRight size={16} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`rounded-full transition-all ${i === current ? "w-5 h-2 bg-blue-600" : "w-2 h-2 bg-blue-300"}`} />
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
