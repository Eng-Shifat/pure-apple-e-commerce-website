import HeroSlider from "@/components/shop/HeroSlider";
import MobileCategoryStrip from "@/components/shop/MobileCategoryStrip";
import PopularProducts from "@/components/shop/PopularProducts";
import PromoBanner from "@/components/shop/PromoBanner";
import ShopByBrand from "@/components/shop/ShopByBrand";
import BestDeals from "@/components/shop/BestDeals";
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

      {/* ── Best Deals Banner ── */}
      <section className="bg-gray-50 px-4 sm:px-6 lg:px-8 pb-2">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/products?deals=true"
            className="block relative rounded-2xl overflow-hidden"
            style={{ aspectRatio: "16/4" }}
          >
            <Image
              src="/images/Banner/deals-banner.webp"
              alt="Best Deals Banner"
              fill
              className="object-cover object-[center_center]"
              priority
            />
          </Link>
        </div>
      </section>

      <BestDeals />
    </main>
  );
}
