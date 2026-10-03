"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    eyebrow: "Latest Tech. Best Prices.",
    title: "Upgrade Your\nWorld",
    description:
      "Discover the latest smartphones and accessories from top brands at unbeatable prices.",
    phoneImage: "/images/hero/iphone-hero.png",
    cardBadge: "New Arrival",
    cardName: "iPhone 16 Pro",
    cardVariant: "Titanium. So strong.\nSo light. So Pro.",
    cardPriceLabel: "From",
    cardPrice: "$1199",
    cardHref: "/products/iphone-16-pro",
  },
  {
    id: 2,
    eyebrow: "Latest Tech. Best Prices.",
    title: "Power Meets\nElegance",
    description:
      "Experience the next generation of smartphones with cutting-edge technology.",
    phoneImage: "/images/hero/samsung-hero.png",
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
    description:
      "Google's most powerful phone yet with AI-powered camera and pure Android.",
    phoneImage: "/images/hero/pixel-hero.png",
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
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative bg-gradient-to-br from-[#f0f4ff] via-[#e8edff] to-[#dde5ff] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center min-h-[480px] py-6">

          {/* LEFT: Text */}
          <div className="flex-1 z-10 max-w-xs lg:max-w-sm">
            <p className="text-blue-600 text-sm font-semibold mb-3">
              {slide.eyebrow}
            </p>
            <h1 className="text-gray-900 text-4xl lg:text-5xl font-black leading-tight mb-4 whitespace-pre-line">
              {slide.title}
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-[260px]">
              {slide.description}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-3 rounded-full transition-colors"
              >
                SHOP NOW →
              </Link>
              <Link
                href="/products?deals=true"
                className="inline-flex items-center gap-2 border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold text-sm px-5 py-3 rounded-full transition-colors"
              >
                EXPLORE DEALS
              </Link>
            </div>

            {/* Trust badges */}
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

          {/* CENTER: Spinning / Floating Phone */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-0">
            {/* Glow */}
            <div className="absolute w-72 h-72 lg:w-96 lg:h-96 rounded-full bg-blue-400/20 blur-3xl" />
            {/* Dashed rotating ring */}
            <div className="absolute w-64 h-64 lg:w-80 lg:h-80 rounded-full border-2 border-dashed border-blue-300/40 animate-spin-slow" />
            {/* Phone — floats up and down */}
            <div
              className="relative w-48 h-72 lg:w-56 lg:h-96 animate-phone-float"
              style={{ filter: "drop-shadow(0 30px 60px rgba(37,99,235,0.20))" }}
            >
              <Image
                src={slide.phoneImage}
                alt={slide.cardName}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* RIGHT: Product Card */}
          <div className="flex-1 flex justify-end z-10">
            <div className="bg-white rounded-2xl shadow-xl p-5 w-44 lg:w-52">
              <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-full mb-3">
                {slide.cardBadge}
              </span>
              <h3 className="text-gray-900 font-bold text-base leading-snug mb-1">
                {slide.cardName}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-4 whitespace-pre-line">
                {slide.cardVariant}
              </p>
              <p className="text-gray-400 text-[10px] mb-0.5">{slide.cardPriceLabel}</p>
              <p className="text-gray-900 font-black text-xl mb-4">{slide.cardPrice}</p>
              <Link
                href={slide.cardHref}
                className="block w-full text-center bg-gray-900 hover:bg-blue-600 text-white font-semibold text-xs py-2.5 rounded-xl transition-colors"
              >
                BUY NOW →
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Prev / Next */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md text-gray-500 hover:text-blue-600 flex items-center justify-center transition-colors z-20"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md text-gray-500 hover:text-blue-600 flex items-center justify-center transition-colors z-20"
      >
        <ChevronRight size={16} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all ${
              i === current ? "w-5 h-2 bg-blue-600" : "w-2 h-2 bg-blue-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
