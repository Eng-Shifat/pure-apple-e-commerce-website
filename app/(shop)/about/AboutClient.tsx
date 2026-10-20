"use client";
// SAVE PATH: app/(shop)/about/AboutClient.tsx

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Facebook, Instagram, Youtube, MessageCircle,
} from "lucide-react";

function TikTokIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.16 8.16 0 004.77 1.52V7.02a4.85 4.85 0 01-1-.33z" />
    </svg>
  );
}

// ─── Happy Client photo paths ─────────────────────────────────────────
const clientPhotos = [
  "/images/Happy Client/1.webp",
  "/images/Happy Client/2.webp",
  "/images/Happy Client/3.webp",
  "/images/Happy Client/4.webp",
  "/images/Happy Client/5.webp",
  "/images/Happy Client/6.webp",
  "/images/Happy Client/7.webp",
  "/images/Happy Client/8.webp",
  "/images/Happy Client/9.webp",
  "/images/Happy Client/12.webp",
  "/images/Happy Client/15.webp",
  "/images/Happy Client/16.webp",
  "/images/Happy Client/17.webp",
  "/images/Happy Client/18.webp",
  "/images/Happy Client/19.webp",
  "/images/Happy Client/20.webp",
  "/images/Happy Client/22.webp",
  "/images/Happy Client/23.webp",
  "/images/Happy Client/24.webp",
  "/images/Happy Client/25.webp",
];

// ─── Infinite Marquee ─────────────────────────────────────────────────
function ClientMarquee() {
  // Duplicate array for seamless loop
  const doubled = [...clientPhotos, ...clientPhotos];

  return (
    <div className="relative overflow-hidden">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div
        className="flex gap-3 sm:gap-4 w-max marquee-track"
        style={{
          animation: "marquee 60s linear infinite",
        }}
      >
        {doubled.map((src, i) => (
          <div
            key={i}
            className="relative shrink-0 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm hover:border-brand-200 hover:shadow-md transition-all duration-300"
            style={{ width: 200, height: 260 }}
          >
            {/* Fallback bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-gray-100" />
            <Image
              src={src}
              alt={`Happy client ${i + 1}`}
              fill
              sizes="130px"
              className="object-cover object-top"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

const socialLinks = [
  { icon: <Facebook size={14} />,   href: "https://www.facebook.com/share/1DvXTZtFFW/", bg: "hover:bg-[#1877F2]",  label: "Facebook" },
  { icon: <Instagram size={14} />,  href: "https://www.instagram.com/pureapplebd",       bg: "hover:bg-[#E1306C]",  label: "Instagram" },
  { icon: <Youtube size={14} />,    href: "https://youtube.com/@pure_iphone",             bg: "hover:bg-[#FF0000]",  label: "YouTube" },
  { icon: <TikTokIcon size={14} />, href: "https://tiktok.com/@pureapplebd",             bg: "hover:bg-[#010101]",  label: "TikTok" },
  { icon: <MessageCircle size={14} />, href: "https://wa.me/8801804660238",              bg: "hover:bg-[#25D366]",  label: "WhatsApp" },
];

export default function AboutClient() {
  return (
    <main className="bg-white">

      {/* ══════════════════════════════════════════════════
          SECTION 1 — HERO  (mobile: stacked, desktop: side by side)
          ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-hero via-[#0d2a1a] to-dark-hero">
        {/* Decorative blobs */}
        <div aria-hidden className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div aria-hidden className="absolute -bottom-16 -left-10 w-52 h-52 rounded-full bg-leaf-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 sm:pt-8 sm:pb-10 lg:pt-10 lg:pb-12">

          {/* ── MOBILE layout: Founder photo full-width hero card on top ── */}
          <div className="lg:hidden mb-8">
            {/* Founder card — mobile: horizontal compact */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/5">
              <div className="flex items-stretch gap-0">
                {/* Photo left */}
                <div className="relative w-36 sm:w-44 shrink-0" style={{ minHeight: 200 }}>
                  <Image
                    src="/images/About/IMG_4992-1.webp"
                    alt="Sheikh Shanto – Founder & CEO"
                    fill
                    sizes="176px"
                    className="object-cover object-top"
                    priority
                  />
                  {/* right fade */}
                  <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-r from-transparent to-[#0d2a1a]/80" />
                </div>

                {/* Text right */}
                <div className="flex-1 flex flex-col justify-center px-4 py-5 min-w-0">
                  <span className="inline-block self-start bg-brand-500/20 border border-brand-500/25 text-brand-400 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest mb-2">
                    Founder &amp; C.E.O
                  </span>
                  <h2 className="text-white font-black text-lg sm:text-xl leading-tight tracking-tight">
                    Sheikh Shanto
                  </h2>
                  <p className="text-gray-400 text-[11px] mt-0.5 mb-3 leading-snug">
                    Pure Apple<br />Mobile &amp; Gadget Shop
                  </p>
                  {/* Social icons */}
                  <div className="flex gap-1.5 flex-wrap">
                    {socialLinks.map((s) => (
                      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                        className={`w-7 h-7 rounded-lg bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all active:scale-95 ${s.bg}`}>
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Badge ── */}
          <div className="flex justify-center lg:justify-start mb-5">
            <span className="inline-flex items-center gap-1.5 bg-brand-500/15 border border-brand-500/20 text-brand-400 text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              About Pure Apple
            </span>
          </div>

          {/* ── Desktop: side-by-side | Mobile: just text below founder card ── */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

            {/* LEFT — Text */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight mb-5 text-center lg:text-left">
                Better Tech,{" "}
                <span className="text-brand-400">Brighter</span> Tomorrow
              </h1>

              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>
                  <span className="text-white font-semibold">Pure Apple</span> is more than just a mobile phone shop —
                  it&apos;s a <span className="text-brand-400 font-semibold">trusted destination</span> for authentic smartphones,
                  premium gadgets, and genuine tech accessories in Bangladesh.
                </p>
                <p>
                  We believe buying technology should be <span className="text-white font-medium">simple, transparent,
                  and trustworthy</span>. Our mission is to make genuine devices accessible to every customer while
                  delivering a shopping experience built on authenticity, competitive pricing, and confidence.
                </p>
                <p className="hidden sm:block">
                  Founded with a vision to create a more reliable mobile shopping experience, Pure Apple has grown
                  through the trust of customers from Dhaka and across Bangladesh — offering the latest iPhones,
                  flagship smartphones, smart gadgets and accessories, all carefully selected for quality and value.
                </p>

                {/* Quote */}
                <div className="border-l-[3px] border-brand-500 pl-4 py-1">
                  <p className="text-white font-bold text-sm sm:text-base italic">
                    &ldquo;Your Trust is Our Greatest Achievement.&rdquo;
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Committed to earning that trust with every purchase, every delivery, and every interaction.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6 justify-center lg:justify-start">
                <Link href="/products"
                  className="flex-1 sm:flex-none text-center bg-brand-500 hover:bg-brand-600 text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors active:scale-95">
                  Shop Now
                </Link>
                <a href="https://wa.me/8801804660238" target="_blank" rel="noopener noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#25D366]/15 border border-[#25D366]/25 hover:bg-[#25D366]/25 text-[#25D366] font-bold px-5 py-3 rounded-xl text-sm transition-colors active:scale-95">
                  <MessageCircle size={15} /> WhatsApp
                </a>
              </div>
            </div>

            {/* RIGHT — Founder Card (desktop only) */}
            <div className="hidden lg:block w-72 xl:w-80 shrink-0">
              <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
                  <Image
                    src="/images/About/IMG_4992-1.webp"
                    alt="Sheikh Shanto – Founder & CEO"
                    fill
                    sizes="320px"
                    className="object-cover object-top"
                    priority
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-hero/95 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="inline-block bg-brand-500/20 border border-brand-500/30 text-brand-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest mb-2">
                      Founder &amp; C.E.O
                    </span>
                    <h2 className="text-white font-black text-xl tracking-tight">Sheikh Shanto</h2>
                    <p className="text-gray-400 text-xs mt-0.5">Pure Apple – Mobile &amp; Gadget Shop</p>
                  </div>
                </div>
                <div className="flex gap-2 px-4 py-3 border-t border-white/8">
                  {socialLinks.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      className={`w-8 h-8 rounded-xl bg-white/8 text-gray-400 hover:text-white flex items-center justify-center transition-all hover:scale-110 ${s.bg}`}>
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 2 — HAPPY CLIENTS MARQUEE
          ══════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-10 bg-white overflow-hidden">
        <div className="text-center mb-7 px-4">
          <span className="text-brand-500 font-bold text-xs uppercase tracking-widest">Our Customers</span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mt-1">Happy Clients 😊</h2>
          <p className="text-gray-400 text-sm mt-1.5">হাজারো সন্তুষ্ট কাস্টমার আমাদের সেরা পরিচয়</p>
        </div>
        <ClientMarquee />
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 3 — STORE + CONTACT
          ══════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-8 sm:py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-7">
            <span className="text-brand-500 font-bold text-xs uppercase tracking-widest">আমাদের দোকান</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mt-1">Visit Our Store</h2>
          </div>

          {/* Store photo */}
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white mb-5 relative" style={{ minHeight: 160 }}>
            <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-gray-50 to-leaf-50 flex flex-col items-center justify-center gap-2">
              <Image src="/logo/pure-apple-logo.svg" alt="Pure Apple" width={40} height={40} className="opacity-20" />
              <p className="text-gray-300 text-xs">public/images/store/store-main.webp</p>
            </div>
            <Image
              src="/images/store/store-main.webp"
              alt="Pure Apple Store"
              width={1200}
              height={380}
              className="w-full object-cover relative z-10"
              style={{ maxHeight: 300, objectPosition: "center" }}
            />
          </div>

        </div>
      </section>

    </main>
  );
}
