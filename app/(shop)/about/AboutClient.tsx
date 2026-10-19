"use client";
// SAVE PATH: app/(shop)/about/AboutClient.tsx

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Phone, Mail, MapPin, Clock, Star,
  ChevronLeft, ChevronRight,
  Facebook, Instagram, Youtube, MessageCircle,
  BadgeCheck, ShieldCheck, Truck, Headphones,
} from "lucide-react";

// ─── TikTok Icon ──────────────────────────────────────────────────────
function TikTokIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.16 8.16 0 004.77 1.52V7.02a4.85 4.85 0 01-1-.33z" />
    </svg>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < count ? "fill-sun-500 text-sun-500" : "text-gray-200"} />
      ))}
    </div>
  );
}

// ─── Happy Clients Data ───────────────────────────────────────────────
const clients = [
  { name: "Rafiqul Islam",   product: "iPhone 17 Pro",   rating: 5, photo: "/images/clients/client-1.webp", review: "Pure Apple থেকে iPhone 17 Pro কিনেছি, একদম অরিজিনাল। সার্ভিস অসাধারণ ছিল। ১০০% বিশ্বাসযোগ্য দোকান!" },
  { name: "Nusrat Jahan",    product: "Samsung S25",      rating: 5, photo: "/images/clients/client-2.webp", review: "Samsung Galaxy S25 নিয়েছি এখান থেকে। দাম সরাসরি এবং পণ্যের মান চমৎকার। ভাইয়ারাও অনেক হেল্পফুল।" },
  { name: "Tanvir Ahmed",    product: "OnePlus 13s 5G",  rating: 5, photo: "/images/clients/client-3.webp", review: "Delivery খুবই দ্রুত ছিল। প্যাকেজিং পারফেক্ট, ফোন একদম নতুন। Pure Apple-কে সবসময় রেকমেন্ড করব।" },
  { name: "Mst. Fatema",     product: "Realme 15 Pro",   rating: 5, photo: "/images/clients/client-4.webp", review: "প্রথমবার অনলাইনে ফোন কিনলাম এখান থেকে, ভয় ছিল কিন্তু সব ঠিকঠাক। অনেক ধন্যবাদ Pure Apple!" },
  { name: "Sabbir Hossain",  product: "iPhone 16 Pro",   rating: 5, photo: "/images/clients/client-5.webp", review: "iPhone 16 Pro-র দাম ঢাকার অন্য সব দোকানের চেয়ে কম এখানে। সত্যিকারের অরিজিনাল পণ্য পাওয়া যায়।" },
  { name: "Ripa Akter",      product: "Vivo V50",         rating: 5, photo: "/images/clients/client-6.webp", review: "Staff অনেক ভদ্র এবং বিস্তারিত বুঝিয়ে দিয়েছে কোন ফোন ভালো হবে। এক্সেলেন্ট experience!" },
];

// ─── Client Card ──────────────────────────────────────────────────────
function ClientCard({ client, active }: { client: typeof clients[0]; active?: boolean }) {
  return (
    <div className={`rounded-2xl border bg-white p-5 flex flex-col gap-3 h-full transition-all duration-300 ${active ? "border-brand-200 shadow-[0_6px_24px_rgba(251,87,36,0.13)]" : "border-gray-100 shadow-sm"}`}>
      <div className="text-3xl font-serif text-brand-500/20 leading-none">&ldquo;</div>
      <p className="text-gray-600 text-sm leading-relaxed flex-1">{client.review}</p>
      <Stars count={client.rating} />
      <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-brand-50 border-2 border-brand-100 shrink-0 flex items-center justify-center">
          <span className="text-brand-500 font-bold text-sm absolute">{client.name[0]}</span>
          <Image src={client.photo} alt={client.name} fill className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-gray-900 font-semibold text-sm truncate">{client.name}</p>
          <p className="text-brand-500 text-xs">{client.product}</p>
        </div>
        <BadgeCheck size={15} className="ml-auto text-leaf-500 shrink-0" />
      </div>
    </div>
  );
}

// ─── Clients Slider ───────────────────────────────────────────────────
function ClientsSlider() {
  const [cur, setCur] = useState(0);
  const [anim, setAnim] = useState(false);
  const [dir, setDir] = useState<"l" | "r">("r");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const total = clients.length;

  const go = (idx: number, d: "l" | "r") => {
    if (anim) return;
    setDir(d);
    setAnim(true);
    setTimeout(() => { setCur(idx); setAnim(false); }, 300);
  };

  const restart = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => go((cur + 1) % total, "r"), 4000);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDir("r"); setAnim(true);
      setTimeout(() => { setCur(c => (c + 1) % total); setAnim(false); }, 300);
    }, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prev = (cur - 1 + total) % total;
  const next = (cur + 1) % total;

  return (
    <div className="relative">
      {/* Desktop — 3 cards */}
      <div className="hidden md:grid grid-cols-3 gap-4">
        {[prev, cur, next].map((idx, pos) => (
          <div key={idx} className={`transition-all duration-300 ${pos === 1 ? "scale-100 opacity-100" : "scale-[0.97] opacity-50"} ${anim ? (dir === "r" ? "-translate-x-2" : "translate-x-2") : "translate-x-0"}`}>
            <ClientCard client={clients[idx]} active={pos === 1} />
          </div>
        ))}
      </div>

      {/* Mobile — 1 card */}
      <div className="md:hidden">
        <div className={`transition-all duration-300 ${anim ? (dir === "r" ? "opacity-0 -translate-x-4" : "opacity-0 translate-x-4") : "opacity-100 translate-x-0"}`}>
          <ClientCard client={clients[cur]} active />
        </div>
      </div>

      {/* Arrows */}
      <button onClick={() => { go((cur - 1 + total) % total, "l"); restart(); }}
        className="absolute -left-4 md:-left-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-brand-500 hover:border-brand-200 transition-all z-10">
        <ChevronLeft size={16} />
      </button>
      <button onClick={() => { go((cur + 1) % total, "r"); restart(); }}
        className="absolute -right-4 md:-right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-brand-500 hover:border-brand-200 transition-all z-10">
        <ChevronRight size={16} />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-5">
        {clients.map((_, i) => (
          <button key={i} onClick={() => { go(i, i > cur ? "r" : "l"); restart(); }}
            className={`rounded-full transition-all duration-300 ${i === cur ? "w-5 h-2 bg-brand-500" : "w-2 h-2 bg-gray-200 hover:bg-brand-300"}`} />
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────
export default function AboutClient() {
  return (
    <main className="bg-white">

      {/* ══════════════════════════════════════════
          SECTION 1 — ABOUT + FOUNDER (side by side)
          ══════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-dark-hero via-[#0d2a1a] to-dark-hero overflow-hidden relative">
        <div aria-hidden className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-500/8 blur-3xl pointer-events-none" />
        <div aria-hidden className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-leaf-500/8 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">

          {/* Top label */}
          <div className="flex justify-center md:justify-start mb-6">
            <span className="inline-flex items-center gap-1.5 bg-brand-500/15 border border-brand-500/20 text-brand-400 text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              About Pure Apple
            </span>
          </div>

          {/* Two column layout */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

            {/* LEFT — About text */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight mb-5">
                Better Tech,{" "}
                <span className="text-brand-400">Brighter</span> Tomorrow
              </h1>

              <div className="space-y-3.5 text-gray-300 text-sm leading-relaxed">
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
                <p>
                  Founded with a vision to create a more reliable mobile shopping experience, Pure Apple has grown
                  through the trust of customers from Dhaka and across Bangladesh — offering everything from the
                  latest iPhones and flagship smartphones to smart gadgets and accessories, all carefully selected
                  for quality and value.
                </p>

                {/* Quote */}
                <div className="border-l-[3px] border-brand-500 pl-4 py-1 mt-1">
                  <p className="text-white font-bold text-base italic">
                    &ldquo;Your Trust is Our Greatest Achievement.&rdquo;
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Committed to earning that trust with every purchase, every delivery, and every interaction.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3 mt-7">
                {[
                  { v: "5000+", l: "Happy Clients" },
                  { v: "500+",  l: "Products" },
                  { v: "4+",    l: "Years" },
                  { v: "4.9★",  l: "Rating" },
                ].map(s => (
                  <div key={s.l} className="text-center bg-white/5 rounded-xl py-3 border border-white/8">
                    <div className="text-lg font-black text-brand-400">{s.v}</div>
                    <div className="text-gray-400 text-[10px] font-medium mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 mt-7">
                <Link href="/products"
                  className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                  Shop Now
                </Link>
                <a href="https://wa.me/8801804660238" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366]/15 border border-[#25D366]/25 hover:bg-[#25D366]/25 text-[#25D366] font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                  <MessageCircle size={15} /> WhatsApp
                </a>
              </div>
            </div>

            {/* RIGHT — Founder Card */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0">
              <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl">
                {/* Photo */}
                <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
                  <Image
                    src="/images/About/IMG_4992-1.webp"
                    alt="Sheikh Shanto – Founder & CEO"
                    fill
                    sizes="(max-width: 1024px) 100vw, 320px"
                    className="object-cover object-top"
                    priority
                  />
                  {/* Bottom gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-dark-hero/95 to-transparent" />
                  {/* Name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="inline-block bg-brand-500/20 border border-brand-500/30 text-brand-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest mb-2">
                      Founder &amp; C.E.O
                    </span>
                    <h2 className="text-white font-black text-xl tracking-tight">Sheikh Shanto</h2>
                    <p className="text-gray-400 text-xs mt-0.5">Pure Apple – Mobile &amp; Gadget Shop</p>
                  </div>
                </div>

                {/* Social */}
                <div className="flex gap-2 px-4 py-3 border-t border-white/8">
                  {[
                    { icon: <Facebook size={14} />, href: "https://www.facebook.com/share/1DvXTZtFFW/", color: "hover:bg-[#1877F2]" },
                    { icon: <Instagram size={14} />, href: "https://www.instagram.com/pureapplebd", color: "hover:bg-[#E1306C]" },
                    { icon: <Youtube size={14} />, href: "https://youtube.com/@pure_iphone", color: "hover:bg-[#FF0000]" },
                    { icon: <TikTokIcon size={14} />, href: "https://tiktok.com/@pureapplebd", color: "hover:bg-[#010101]" },
                    { icon: <MessageCircle size={14} />, href: "https://wa.me/8801804660238", color: "hover:bg-[#25D366]" },
                  ].map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                      className={`w-8 h-8 rounded-xl bg-white/8 text-gray-400 hover:text-white flex items-center justify-center transition-all hover:scale-110 ${s.color}`}>
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — HAPPY CLIENTS
          ══════════════════════════════════════════ */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-8">
            <span className="text-brand-500 font-bold text-xs uppercase tracking-widest">Customer Reviews</span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">Happy Clients 😊</h2>
            <p className="text-gray-400 text-sm mt-1.5">হাজারো সন্তুষ্ট কাস্টমার আমাদের সেরা পরিচয়</p>
          </div>
          <ClientsSlider />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — STORE CARD + CONTACT
          ══════════════════════════════════════════ */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-brand-500 font-bold text-xs uppercase tracking-widest">আমাদের দোকান</span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">Visit Our Store</h2>
          </div>

          {/* Store photo card */}
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white mb-6 relative" style={{ minHeight: 200 }}>
            {/* Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-gray-50 to-leaf-50 flex items-center justify-center gap-3">
              <Image src="/logo/pure-apple-logo.svg" alt="Pure Apple" width={48} height={48} className="opacity-30" />
              <p className="text-gray-300 text-sm font-medium">Add store photo: public/images/store/store-main.webp</p>
            </div>
            <Image
              src="/images/store/store-main.webp"
              alt="Pure Apple Store"
              width={1200}
              height={400}
              className="w-full object-cover relative z-10"
              style={{ maxHeight: 340, objectPosition: "center" }}
            />
          </div>

          {/* Contact + Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Contact */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-brand-500" />
                যোগাযোগ করুন
              </h3>
              <div className="space-y-3">
                {[
                  { icon: <Phone size={15} />, label: "Phone", value: "+880 1804-660238", href: "tel:+8801804660238" },
                  { icon: <Mail size={15} />,  label: "Email", value: "pureapplebd@gmail.com", href: "mailto:pureapplebd@gmail.com" },
                ].map(item => (
                  <a key={item.label} href={item.href}
                    className="flex items-center gap-3 group hover:text-brand-500 transition-colors">
                    <span className="w-8 h-8 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-[10px] text-gray-400 leading-none mb-0.5">{item.label}</p>
                      <p className="text-gray-800 font-semibold text-sm">{item.value}</p>
                    </div>
                  </a>
                ))}
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={15} />
                  </span>
                  <div>
                    <p className="text-[10px] text-gray-400 leading-none mb-0.5">Address</p>
                    <p className="text-gray-800 font-semibold text-sm leading-snug">
                      Jamuna Future Park, Level-4,<br />Block-B, Shop No: 4B-012B2,<br />Dhaka, Bangladesh
                    </p>
                  </div>
                </div>

                {/* Social */}
                <div className="flex gap-2 pt-1">
                  {[
                    { icon: <Facebook size={13} />, href: "https://www.facebook.com/share/1DvXTZtFFW/", bg: "hover:bg-[#1877F2]" },
                    { icon: <Instagram size={13} />, href: "https://www.instagram.com/pureapplebd", bg: "hover:bg-[#E1306C]" },
                    { icon: <Youtube size={13} />, href: "https://youtube.com/@pure_iphone", bg: "hover:bg-[#FF0000]" },
                    { icon: <TikTokIcon size={13} />, href: "https://tiktok.com/@pureapplebd", bg: "hover:bg-[#010101]" },
                    { icon: <MessageCircle size={13} />, href: "https://wa.me/8801804660238", bg: "hover:bg-[#25D366]" },
                  ].map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                      className={`w-7 h-7 rounded-lg bg-gray-100 text-gray-500 hover:text-white flex items-center justify-center transition-all hover:scale-110 ${s.bg}`}>
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Store Hours */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-brand-500" />
                Store Hours
              </h3>
              <div className="space-y-2">
                {[
                  { day: "শনিবার – মঙ্গলবার", time: "10:00 – 21:00", open: true },
                  { day: "বুধবার",              time: "বন্ধ",          open: false },
                  { day: "বৃহস্পতিবার",         time: "10:00 – 21:00", open: true },
                  { day: "শুক্রবার",             time: "14:00 – 21:00", open: true },
                ].map(r => (
                  <div key={r.day} className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className={r.open ? "text-leaf-500" : "text-red-400"} />
                      <span className="text-gray-700 text-sm">{r.day}</span>
                    </div>
                    <span className={`text-sm font-bold ${r.open ? "text-leaf-600" : "text-red-500"}`}>
                      {r.time}
                    </span>
                  </div>
                ))}
              </div>
              <a href="https://maps.google.com/?q=Jamuna+Future+Park+Dhaka" target="_blank" rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-50 hover:bg-brand-100 text-brand-600 font-semibold text-sm py-2.5 rounded-xl border border-brand-100 transition-colors">
                <MapPin size={14} /> Google Maps-এ দেখুন
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
