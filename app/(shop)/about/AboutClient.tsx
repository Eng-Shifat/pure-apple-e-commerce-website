"use client";
// SAVE PATH: app/(shop)/about/AboutClient.tsx

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  ShieldCheck,
  Truck,
  BadgeCheck,
  Headphones,
} from "lucide-react";

// ─── Happy Clients Data ────────────────────────────────────────────────
const happyClients = [
  {
    name: "Rafiqul Islam",
    review:
      "Pure Apple থেকে iPhone 17 Pro কিনেছি, একদম অরিজিনাল প্রোডাক্ট। সার্ভিস অসাধারণ ছিল। ১০০% বিশ্বাসযোগ্য দোকান!",
    rating: 5,
    photo: "/images/clients/client-1.webp",
    product: "iPhone 17 Pro",
  },
  {
    name: "Nusrat Jahan",
    review:
      "Samsung Galaxy S25 নিয়েছি এখান থেকে। দাম অনেক সরাসরি এবং পণ্যের মান চমৎকার। ভাইয়ারাও অনেক হেল্পফুল।",
    rating: 5,
    photo: "/images/clients/client-2.webp",
    product: "Samsung S25",
  },
  {
    name: "Tanvir Ahmed",
    review:
      "Delivery খুবই দ্রুত ছিল। প্যাকেজিং পারফেক্ট, ফোন একদম নতুন। Pure Apple-কে সবসময় রেকমেন্ড করব।",
    rating: 5,
    photo: "/images/clients/client-3.webp",
    product: "OnePlus 13s 5G",
  },
  {
    name: "Mst. Fatema",
    review:
      "প্রথমবার অনলাইনে ফোন কিনলাম এখান থেকে, ভয় ছিল কিন্তু সব ঠিকঠাক হয়েছে। অনেক ধন্যবাদ Pure Apple!",
    rating: 5,
    photo: "/images/clients/client-4.webp",
    product: "Realme 15 Pro",
  },
  {
    name: "Sabbir Hossain",
    review:
      "iPhone 16 Pro-র দাম ঢাকার বাকি সব দোকানের চেয়ে কম এখানে। আর সত্যিকারের অরিজিনাল পণ্য পাওয়া যায়।",
    rating: 5,
    photo: "/images/clients/client-5.webp",
    product: "iPhone 16 Pro",
  },
  {
    name: "Ripa Akter",
    review:
      "Staff অনেক ভদ্র এবং বিস্তারিত বুঝিয়ে দিয়েছে কোন ফোন আমার জন্য ভালো হবে। এক্সেলেন্ট experience!",
    rating: 5,
    photo: "/images/clients/client-6.webp",
    product: "Vivo V50",
  },
];

// ─── Why Choose Us ─────────────────────────────────────────────────────
const whyUs = [
  {
    icon: <BadgeCheck size={22} />,
    title: "১০০% অরিজিনাল পণ্য",
    desc: "সকল পণ্য অফিসিয়াল চ্যানেল থেকে সংগ্রহ করা। কোনো রিফার্বিশড বা নকল পণ্য নেই।",
  },
  {
    icon: <Truck size={22} />,
    title: "দ্রুত ডেলিভারি",
    desc: "ঢাকার ভেতরে ২৪ ঘণ্টা এবং সারাদেশে ৪৮–৭২ ঘণ্টার মধ্যে ডেলিভারি।",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "ওয়ারেন্টি গ্যারান্টি",
    desc: "সকল পণ্যে ব্র্যান্ডের অফিসিয়াল ওয়ারেন্টি এবং আমাদের নিজস্ব সার্ভিস সাপোর্ট।",
  },
  {
    icon: <Headphones size={22} />,
    title: "২৪/৭ কাস্টমার সাপোর্ট",
    desc: "যেকোনো সমস্যায় আমাদের টিম সবসময় আপনার পাশে আছে।",
  },
];

// ─── TikTok Icon ──────────────────────────────────────────────────────
function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.16 8.16 0 004.77 1.52V7.02a4.85 4.85 0 01-1-.33z" />
    </svg>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < count ? "fill-sun-500 text-sun-500" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

// ─── Happy Clients Slider ─────────────────────────────────────────────
function HappyClientsSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const autoRef = useRef<NodeJS.Timeout | null>(null);

  const total = happyClients.length;

  const goTo = (idx: number, dir: "left" | "right") => {
    if (isAnimating) return;
    setDirection(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setIsAnimating(false);
    }, 350);
  };

  const prev = () => goTo((current - 1 + total) % total, "left");
  const next = () => goTo((current + 1) % total, "right");

  // Auto-slide
  useEffect(() => {
    autoRef.current = setInterval(() => {
      setDirection("right");
      setIsAnimating(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % total);
        setIsAnimating(false);
      }, 350);
    }, 4000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [total]);

  const resetAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setDirection("right");
      setIsAnimating(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % total);
        setIsAnimating(false);
      }, 350);
    }, 4000);
  };

  const getVisibleIndices = () => {
    const prev1 = (current - 1 + total) % total;
    const next1 = (current + 1) % total;
    return [prev1, current, next1];
  };

  const visible = getVisibleIndices();

  return (
    <div className="relative overflow-hidden">
      {/* Desktop: 3 cards */}
      <div className="hidden md:flex items-center justify-center gap-5">
        {visible.map((idx, pos) => {
          const client = happyClients[idx];
          const isCenter = pos === 1;
          return (
            <div
              key={idx}
              className={`transition-all duration-500 ${
                isCenter
                  ? "scale-100 opacity-100 z-10"
                  : "scale-95 opacity-60"
              } ${
                isAnimating
                  ? direction === "right"
                    ? "translate-x-[-8px]"
                    : "translate-x-[8px]"
                  : "translate-x-0"
              }`}
              style={{ width: isCenter ? "340px" : "280px" }}
            >
              <ClientCard client={client} featured={isCenter} />
            </div>
          );
        })}
      </div>

      {/* Mobile: single card */}
      <div className="md:hidden flex justify-center px-4">
        <div
          className={`w-full max-w-sm transition-all duration-350 ${
            isAnimating
              ? direction === "right"
                ? "opacity-0 translate-x-[-20px]"
                : "opacity-0 translate-x-[20px]"
              : "opacity-100 translate-x-0"
          }`}
        >
          <ClientCard client={happyClients[current]} featured />
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => { prev(); resetAuto(); }}
        className="absolute left-0 md:left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:text-brand-500 hover:border-brand-200 transition-all z-20"
        aria-label="Previous"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => { next(); resetAuto(); }}
        className="absolute right-0 md:right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:text-brand-500 hover:border-brand-200 transition-all z-20"
        aria-label="Next"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {happyClients.map((_, i) => (
          <button
            key={i}
            onClick={() => { goTo(i, i > current ? "right" : "left"); resetAuto(); }}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 h-2.5 bg-brand-500"
                : "w-2.5 h-2.5 bg-gray-300 hover:bg-brand-300"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Client Card ──────────────────────────────────────────────────────
function ClientCard({
  client,
  featured,
}: {
  client: (typeof happyClients)[0];
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 flex flex-col gap-3 transition-all duration-300 ${
        featured
          ? "border-brand-200 shadow-[0_8px_30px_rgba(251,87,36,0.12)]"
          : "border-gray-100 shadow-sm"
      }`}
    >
      {/* Quote mark */}
      <div className="text-4xl font-serif leading-none text-brand-500/30 -mb-1">"</div>

      {/* Review text */}
      <p className="text-gray-700 text-sm leading-relaxed flex-1">{client.review}</p>

      {/* Stars */}
      <Stars count={client.rating} />

      {/* Profile */}
      <div className="flex items-center gap-3 pt-1 border-t border-gray-50">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-brand-50 border-2 border-brand-100 shrink-0">
          {/* Fallback avatar if image not found */}
          <div className="absolute inset-0 flex items-center justify-center text-brand-500 font-bold text-sm bg-gradient-to-br from-brand-50 to-brand-100">
            {client.name[0]}
          </div>
          <Image
            src={client.photo}
            alt={client.name}
            fill
            className="object-cover"
            onError={() => {}}
          />
        </div>
        <div>
          <p className="text-gray-900 font-semibold text-sm">{client.name}</p>
          <p className="text-brand-500 text-xs font-medium">{client.product}</p>
        </div>
        <BadgeCheck size={16} className="ml-auto text-leaf-500 shrink-0" />
      </div>
    </div>
  );
}

// ─── Store Photo Card ─────────────────────────────────────────────────
function StoreSection() {
  // Replace src with your actual store photo path
  const storeImages = [
    {
      src: "/images/store/store-main.webp",
      label: "আমাদের মেইন শোরুম",
      sublabel: "Jamuna Future Park, Level-4",
    },
    {
      src: "/images/store/store-inside.webp",
      label: "ভেতরের ডিসপ্লে",
      sublabel: "সর্বশেষ স্মার্টফোন সংগ্রহ",
    },
    {
      src: "/images/store/store-products.webp",
      label: "প্রোডাক্ট ডিসপ্লে",
      sublabel: "iPhone, Samsung, OnePlus & more",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {storeImages.map((img, i) => (
        <div
          key={i}
          className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-100 shadow-sm hover:shadow-card-hover transition-all duration-300"
          style={{ aspectRatio: "4/3" }}
        >
          {/* Placeholder gradient when no photo */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-gray-50 to-leaf-50 flex flex-col items-center justify-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm">
              <Image
                src="/logo/pure-apple-logo.svg"
                alt="Pure Apple"
                width={40}
                height={40}
              />
            </div>
            <p className="text-gray-400 text-xs">Store Photo</p>
          </div>

          {/* Actual image */}
          <Image
            src={img.src}
            alt={img.label}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Label overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-hero/80 to-transparent p-3">
            <p className="text-white font-semibold text-sm">{img.label}</p>
            <p className="text-gray-300 text-xs">{img.sublabel}</p>
          </div>

          {/* Corner badge */}
          <div className="absolute top-3 right-3 bg-brand-500 text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
            Pure Apple
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────
export default function AboutClient() {
  return (
    <main className="min-h-screen bg-white">
      {/* ══════════════════════════════════════════════════════
          HERO / ABOUT US SECTION
          ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-hero via-[#0d2a1a] to-[#0E2318]">
        {/* Decorative blobs */}
        <div aria-hidden className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl" />
        <div aria-hidden className="absolute bottom-0 -left-10 w-60 h-60 rounded-full bg-leaf-500/10 blur-3xl" />
        <div aria-hidden className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-leaf-900/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

          {/* ── Top badge ── */}
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-1.5 bg-brand-500/15 border border-brand-500/25 text-brand-400 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              About Pure Apple
            </span>
          </div>

          {/* ── Headline ── */}
          <h1 className="text-3xl md:text-5xl font-black text-white text-center leading-[1.1] tracking-tight mb-6">
            Better Tech,{" "}
            <span className="text-brand-400">Brighter</span>{" "}
            Tomorrow
          </h1>

          {/* ── About text block ── */}
          <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-3xl px-6 py-8 md:px-10 md:py-10 backdrop-blur-sm mb-10 space-y-4">
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              <span className="text-white font-bold">Pure Apple</span> is more than just a mobile phone shop — it&apos;s a{" "}
              <span className="text-brand-400 font-semibold">Trusted Destination</span> for Authentic Smartphones,
              Premium Gadgets, and Genuine Tech Accessories in Bangladesh.
            </p>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              At Pure Apple, we believe buying technology should be{" "}
              <span className="text-white font-semibold">simple, transparent, and trustworthy</span>.
              Our mission is to make genuine devices and quality tech products accessible to customers
              while providing a shopping experience built on authenticity, competitive pricing, and confidence.
            </p>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Founded with a vision to create a more reliable and customer-focused mobile shopping experience,
              Pure Apple has grown through the trust and support of customers from Dhaka and across Bangladesh.
              From the latest iPhones and flagship smartphones to smart gadgets and essential accessories,
              we carefully select products that meet our standards for quality, authenticity, and value.
            </p>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Whether you&apos;re looking for the latest iPhone, a premium smartphone, useful gadgets, or trusted
              accessories, Pure Apple brings a carefully selected range of products under one roof — backed by{" "}
              <span className="text-brand-400 font-semibold">genuine products, honest service, competitive prices,
              and nationwide delivery</span>.
            </p>
            {/* Quote */}
            <div className="border-l-4 border-brand-500 pl-4 mt-2">
              <p className="text-white font-bold text-base md:text-lg italic leading-snug">
                &ldquo;Your Trust is Our Greatest Achievement.&rdquo;
              </p>
              <p className="text-gray-400 text-xs mt-1">
                At Pure Apple, we&apos;re committed to earning that trust with every purchase, every delivery,
                and every customer interaction.
              </p>
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-10">
            {[
              { value: "5000+", label: "Happy Clients" },
              { value: "500+",  label: "Products" },
              { value: "4+",    label: "Years Experience" },
              { value: "4.9★",  label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-brand-400">{stat.value}</div>
                <div className="text-gray-400 text-xs font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* ── Founder Card ── */}
          <div className="max-w-2xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl">
              {/* bg decoration */}
              <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-leaf-500/5 pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row items-center gap-0 sm:gap-0">
                {/* Photo */}
                <div className="w-full sm:w-56 md:w-64 shrink-0 relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                  <Image
                    src="/images/About/IMG_4992-1.webp"
                    alt="Sheikh Shanto – Founder & CEO, Pure Apple"
                    fill
                    sizes="(max-width: 640px) 100vw, 256px"
                    className="object-cover object-top"
                    priority
                  />
                  {/* gradient fade into content on desktop */}
                  <div className="hidden sm:block absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent to-white/5" />
                </div>

                {/* Text */}
                <div className="flex-1 p-6 md:p-8 text-center sm:text-left">
                  {/* Quote icon */}
                  <div className="text-5xl font-serif text-brand-500/20 leading-none mb-1 hidden sm:block">&ldquo;</div>

                  <span className="inline-block bg-brand-500/15 border border-brand-500/25 text-brand-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest mb-3">
                    Founder &amp; C.E.O
                  </span>

                  <h2 className="text-2xl md:text-3xl font-black text-white mb-1 tracking-tight">
                    Sheikh Shanto
                  </h2>

                  <p className="text-leaf-400 text-xs font-semibold uppercase tracking-widest mb-4">
                    Pure Apple – Mobile &amp; Gadget Shop
                  </p>

                  <p className="text-gray-300 text-sm leading-relaxed mb-5">
                    Visionary entrepreneur behind Pure Apple — building Bangladesh&apos;s most trusted
                    destination for authentic smartphones and premium tech.
                  </p>

                  {/* Social links */}
                  <div className="flex gap-2 justify-center sm:justify-start">
                    <a href="https://www.facebook.com/share/1DvXTZtFFW/" target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 rounded-xl bg-white/10 text-gray-400 hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all hover:scale-110">
                      <Facebook size={14} />
                    </a>
                    <a href="https://www.instagram.com/pureapplebd" target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 rounded-xl bg-white/10 text-gray-400 hover:bg-gradient-to-tr hover:from-[#f09433] hover:to-[#bc1888] hover:text-white flex items-center justify-center transition-all hover:scale-110">
                      <Instagram size={14} />
                    </a>
                    <a href="https://wa.me/8801804660238" target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 rounded-xl bg-white/10 text-gray-400 hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all hover:scale-110">
                      <MessageCircle size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── CTA buttons ── */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Shop Now
            </Link>
            <a
              href="https://wa.me/8801804660238"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366]/15 border border-[#25D366]/30 hover:bg-[#25D366]/25 text-[#25D366] font-bold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              <MessageCircle size={16} />
              WhatsApp করুন
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHY CHOOSE US
          ══════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <div className="text-center mb-10">
            <span className="text-brand-500 font-bold text-xs uppercase tracking-widest">
              কেন আমরা বেছে নেবেন
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">
              Pure Apple-র বিশেষত্ব
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyUs.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-card-hover hover:border-brand-100 transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-brand-500 mb-3 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1.5">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HAPPY CLIENTS SLIDER
          ══════════════════════════════════════════════════════ */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <div className="text-center mb-10">
            <span className="text-brand-500 font-bold text-xs uppercase tracking-widest">
              আমাদের কাস্টমার
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">
              Happy Clients 😊
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              হাজার হাজার সন্তুষ্ট কাস্টমার আমাদের সেরা পরিচয়
            </p>
          </div>

          <HappyClientsSlider />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STORE PHOTOS + CONTACT
          ══════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <div className="text-center mb-10">
            <span className="text-brand-500 font-bold text-xs uppercase tracking-widest">
              আমাদের দোকান
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">
              Visit Our Store
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              সরাসরি আমাদের শোরুমে এসে পছন্দের ফোন হাতে নিয়ে দেখুন
            </p>
          </div>

          <StoreSection />

          {/* Contact Details */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Contact Info Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-brand-500 inline-block" />
                যোগাযোগ করুন
              </h3>
              <div className="space-y-3">
                <a
                  href="tel:+8801804660238"
                  className="flex items-center gap-3 text-gray-600 hover:text-brand-500 transition-colors group"
                >
                  <span className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center text-brand-500 shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                    <Phone size={16} />
                  </span>
                  <div>
                    <p className="text-xs text-gray-400 leading-none mb-0.5">Phone</p>
                    <p className="font-semibold text-sm">+880 1804-660238</p>
                  </div>
                </a>

                <a
                  href="mailto:pureapplebd@gmail.com"
                  className="flex items-center gap-3 text-gray-600 hover:text-brand-500 transition-colors group"
                >
                  <span className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center text-brand-500 shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                    <Mail size={16} />
                  </span>
                  <div>
                    <p className="text-xs text-gray-400 leading-none mb-0.5">Email</p>
                    <p className="font-semibold text-sm">pureapplebd@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-start gap-3 text-gray-600">
                  <span className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center text-brand-500 shrink-0 mt-0.5">
                    <MapPin size={16} />
                  </span>
                  <div>
                    <p className="text-xs text-gray-400 leading-none mb-0.5">Address</p>
                    <p className="font-semibold text-sm leading-snug">
                      Jamuna Future Park, Level-4,<br />
                      Block-B, Shop No: 4B-012B2,<br />
                      Dhaka, Bangladesh
                    </p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-2 pt-1">
                  {[
                    {
                      icon: <Facebook size={14} />,
                      href: "https://www.facebook.com/share/1DvXTZtFFW/",
                      label: "Facebook",
                      color: "hover:bg-[#1877F2]",
                    },
                    {
                      icon: <Instagram size={14} />,
                      href: "https://www.instagram.com/pureapplebd",
                      label: "Instagram",
                      color: "hover:bg-gradient-to-tr hover:from-[#f09433] hover:to-[#bc1888]",
                    },
                    {
                      icon: <Youtube size={14} />,
                      href: "https://youtube.com/@pure_iphone",
                      label: "YouTube",
                      color: "hover:bg-[#FF0000]",
                    },
                    {
                      icon: <TikTokIcon size={14} />,
                      href: "https://tiktok.com/@pureapplebd",
                      label: "TikTok",
                      color: "hover:bg-[#010101]",
                    },
                    {
                      icon: <MessageCircle size={14} />,
                      href: "https://wa.me/8801804660238",
                      label: "WhatsApp",
                      color: "hover:bg-[#25D366]",
                    },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className={`w-8 h-8 rounded-xl bg-gray-100 text-gray-500 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 ${s.color}`}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Store Hours Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-brand-500 inline-block" />
                Store Hours
              </h3>
              <div className="space-y-2.5">
                {[
                  { day: "শনিবার – মঙ্গলবার", time: "10:00 – 21:00", open: true },
                  { day: "বুধবার", time: "বন্ধ", open: false },
                  { day: "বৃহস্পতিবার", time: "10:00 – 21:00", open: true },
                  { day: "শুক্রবার", time: "14:00 – 21:00", open: true },
                ].map((row) => (
                  <div
                    key={row.day}
                    className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <Clock size={13} className={row.open ? "text-leaf-500" : "text-red-400"} />
                      <span className="text-gray-700 text-sm font-medium">
                        {row.day}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        row.open ? "text-leaf-600" : "text-red-500"
                      }`}
                    >
                      {row.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Map CTA */}
              <a
                href="https://maps.google.com/?q=Jamuna+Future+Park+Dhaka"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-50 hover:bg-brand-100 text-brand-600 font-semibold text-sm py-2.5 rounded-xl border border-brand-100 transition-colors"
              >
                <MapPin size={15} />
                Google Maps-এ দেখুন
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA BANNER
          ══════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-brand-500 to-brand-600 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            আজই আপনার পছন্দের ফোন অর্ডার করুন 📱
          </h2>
          <p className="text-white/80 text-sm mb-6">
            বাংলাদেশের সেরা দামে অরিজিনাল স্মার্টফোন – হোম ডেলিভারি সহ
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/products"
              className="bg-white text-brand-600 font-bold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              সকল প্রোডাক্ট দেখুন
            </Link>
            <a
              href="https://wa.me/8801804660238"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/15 border border-white/30 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-white/25 transition-colors text-sm flex items-center gap-2"
            >
              <MessageCircle size={15} />
              WhatsApp Order
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
