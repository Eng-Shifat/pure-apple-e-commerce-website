import HeroSlider from "@/components/shop/HeroSlider";
import TrustBadges from "@/components/shop/TrustBadges";
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
      <HeroSlider />
      <TrustBadges />
      <PopularProducts />
      <PromoBanner />
      <ShopByBrand />
      <BestDeals />
      <Newsletter />
    </main>
  );
}
