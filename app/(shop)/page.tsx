// SAVE PATH: app/(shop)/page.tsx
import HeroSlider from "@/components/shop/HeroSlider";
import MobileCategoryStrip from "@/components/shop/MobileCategoryStrip";
import PopularProducts from "@/components/shop/PopularProducts";
import PromoBanner from "@/components/shop/PromoBanner";
import ShopByBrand from "@/components/shop/ShopByBrand";
import BestDeals from "@/components/shop/BestDeals";
import TodaysDeal from "@/components/shop/TodaysDeal";
import PhoneSeriesSection from "@/components/shop/PhoneSeriesSection";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Pure Apple – Better Tech, Brighter Tomorrow",
  description:
    "Shop the latest smartphones from Apple, Samsung, Google, OnePlus and more at the best prices.",
};

export default function HomePage() {
  return (
    <main>
      <div className="bg-gray-50 pb-1 md:bg-transparent md:pb-0">
        <MobileCategoryStrip />
        <HeroSlider />
      </div>
      <ShopByBrand />
      <PopularProducts />
      <PromoBanner />
      <PhoneSeriesSection />

      {/* ── Today's Deal ── (shows only when admin has set an active deal) */}
      <TodaysDeal />

      {/* ── Best Deals Banner ── */}
      <section className="bg-gray-50 px-4 sm:px-6 lg:px-8 pb-2">
        <div className="max-w-7xl mx-auto">
          {/* ── Mobile: taller, designed card (phones image + crisp text) ── */}
          <Link
            href="/products?deals=true"
            className="md:hidden relative block h-[150px] rounded-2xl overflow-hidden shadow-md bg-gradient-to-br from-[#0B1F14] via-[#12331F] to-[#1B4B2A]"
          >
            <Image
              src="/images/Banner/deals-banner.webp"
              alt="Best Deals – iPhone 17 Pro"
              fill
              sizes="100vw"
              quality={75}
              className="object-cover object-right"
              style={{
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 42%)",
                maskImage: "linear-gradient(to right, transparent 0%, #000 42%)",
              }}
            />
            <div aria-hidden className="absolute -left-10 -top-10 w-32 h-32 rounded-full bg-brand-500/25 blur-2xl" />
            <div className="relative z-10 h-full flex flex-col justify-center gap-1.5 pl-4 pr-[46%]">
              <span className="self-start text-[9px] font-extrabold uppercase tracking-widest bg-brand-500 text-white px-2.5 py-1 rounded-full leading-none">
                🔥 Best Deal
              </span>
              <p className="text-white text-[22px] font-black leading-[1.05] tracking-tight">iPhone 17 Pro</p>
              <p className="text-white/70 text-[11px] leading-snug">Premium performance.<br />Unbeatable value.</p>
              <span className="self-start mt-0.5 text-[11px] font-bold bg-white text-gray-900 px-3.5 py-1.5 rounded-full leading-none">
                Shop Now →
              </span>
            </div>
          </Link>

          <Link
            href="/products?deals=true"
            className="hidden md:block rounded-2xl overflow-hidden"
          >
            {/* Image-er asol ratio (2170×362) — crop hobe na, puro banner dekhabe */}
            <Image
              src="/images/Banner/deals-banner.webp"
              alt="Best Deals Banner"
              width={2170}
              height={362}
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="w-full h-auto"
            />
          </Link>
        </div>
      </section>

      <BestDeals />
    </main>
  );
}
