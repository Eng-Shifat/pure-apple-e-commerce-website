"use client";

import { useState, useEffect, useRef, Suspense, lazy } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Truck, RotateCcw, ShieldCheck } from "lucide-react";

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

  return (
    <section
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative overflow-hidden mx-4 mt-3 rounded-3xl shadow-sm md:mx-0 md:mt-0 md:rounded-none md:shadow-none"
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
        <div className="relative flex flex-col items-center lg:flex-row lg:items-center lg:min-h-[440px] pt-6 pb-12 lg:pt-6 lg:pb-4">

          {/* ── LEFT: Text ─────────────────────── */}
          <div className="contents lg:block lg:flex-1 lg:z-10 lg:max-w-sm lg:pointer-events-none lg:[&>*]:pointer-events-auto">
            <div className="order-1 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-[11px] font-medium px-3 py-1 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
              {slide.eyebrow}
            </div>

            <h1 className="text-gray-900 text-[30px] sm:text-4xl lg:text-[40px] font-bold leading-[1.15] mb-3 lg:mb-4 whitespace-pre-line tracking-tight">
              {slide.title}
            </h1>

            <p className="text-gray-500 text-[13px] leading-relaxed mb-2 lg:mb-8 max-w-[300px] lg:max-w-[250px]">
              {slide.description}
            </p>
            </div>

            <div className="order-3 grid grid-cols-2 gap-3 w-full max-w-sm mt-1 lg:mt-0 lg:flex lg:items-center lg:w-auto lg:max-w-none">
              <Link href="/products"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs px-4 lg:px-5 py-3 rounded-full transition-all shadow-lg shadow-blue-200">
                SHOP NOW →
              </Link>
              <Link href="/products?deals=true"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs px-4 lg:px-5 py-3 rounded-full border border-gray-200 transition-all shadow-sm">
                EXPLORE DEALS
              </Link>
            </div>

            {/* Trust badges */}
            <div className="trust-row order-4 grid grid-cols-3 gap-2 w-full max-w-sm mt-5 sm:flex sm:justify-center sm:gap-2.5 sm:max-w-none lg:justify-start lg:w-[440px]">
              {[
                { icon: Truck, title: "Free Shipping", sub: "On orders over $50" },
                { icon: RotateCcw, title: "Easy Returns", sub: "30-day policy" },
                { icon: ShieldCheck, title: "Secure Payment", sub: "100% secure" },
              ].map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="trust-chip" style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
                    <span className="trust-icon">
                      <Icon size={12} strokeWidth={1.8} />
                    </span>
                    <span className="flex flex-col items-center sm:items-start leading-tight text-center sm:text-left">
                      <span className="text-gray-800 text-[10px] font-medium whitespace-nowrap">{b.title}</span>
                      <span className="hidden sm:block text-gray-400 text-[9px] whitespace-nowrap">{b.sub}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── CENTER: 3D Phone ────────────────── */}
          <div className="order-2 relative w-full flex items-center justify-center -my-2 lg:my-0 lg:w-auto lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:z-20">
            {/* Center glow */}
            <div className="absolute pointer-events-none w-64 h-64 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />

            <Suspense
              fallback={
                <div className="w-full h-[270px] sm:h-[360px] lg:w-[420px] lg:h-[500px] flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              }
            >
              <PhoneModel />
            </Suspense>
          </div>

          {/* ── RIGHT: Product Card ─────────────── */}
          <div className="hidden lg:flex flex-1 justify-end z-10 pointer-events-none">
            <div className="pointer-events-auto rounded-2xl p-5 w-44 lg:w-52 bg-white/25 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(37,99,235,0.15),inset_0_1px_0_rgba(255,255,255,0.7)]">
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
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-gray-500 hover:text-blue-600 justify-center transition-colors z-20 border border-white">
        <ChevronLeft size={16} />
      </button>
      <button onClick={() => goTo((current + 1) % slides.length)}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-gray-500 hover:text-blue-600 justify-center transition-colors z-20 border border-white">
        <ChevronRight size={16} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`rounded-full transition-all ${i === current ? "w-6 h-2 bg-blue-600" : "w-2 h-2 bg-blue-300"}`} />
        ))}
      </div>

      <style jsx>{`
        @keyframes chipIn {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chipShine {
          0%, 60% { transform: translateX(-130%) skewX(-20deg); }
          100%    { transform: translateX(260%) skewX(-20deg); }
        }
        @keyframes iconPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.35); }
          50%      { box-shadow: 0 0 0 5px rgba(37, 99, 235, 0); }
        }
        .trust-chip {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px 5px 5px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 4px 14px -6px rgba(37, 99, 235, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.8);
          cursor: default;
          opacity: 0;
          animation: chipIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s ease, background 0.35s ease;
        }
        .trust-chip::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.85), transparent);
          transform: translateX(-130%) skewX(-20deg);
          animation: chipShine 5s ease-in-out infinite;
          pointer-events: none;
        }
        .trust-chip:nth-child(2)::after { animation-delay: 0.4s; }
        .trust-chip:nth-child(3)::after { animation-delay: 0.8s; }
        .trust-chip:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 12px 24px -8px rgba(37, 99, 235, 0.4), inset 0 1px 0 #fff;
        }
        .trust-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          color: #fff;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          animation: iconPulse 2.8s ease-in-out infinite;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .trust-chip:hover .trust-icon { transform: rotate(-12deg) scale(1.12); }
        @media (max-width: 639px) {
          .trust-chip {
            flex-direction: column;
            justify-content: center;
            gap: 6px;
            padding: 10px 4px;
            border-radius: 18px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .trust-chip, .trust-chip::after, .trust-icon { animation: none; opacity: 1; }
        }
      `}</style>
    </section>
  );
}
