import HeroSlider from "@/components/shop/HeroSlider";
import MobileCategoryStrip from "@/components/shop/MobileCategoryStrip";
import PopularProducts from "@/components/shop/PopularProducts";
import PromoBanner from "@/components/shop/PromoBanner";
import ShopByBrand from "@/components/shop/ShopByBrand";
import BestDeals from "@/components/shop/BestDeals";
import Newsletter from "@/components/shop/Newsletter";

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
      <BestDeals />
      <Newsletter />
    </main>
  );
}
