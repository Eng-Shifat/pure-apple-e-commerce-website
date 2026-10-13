"use client";

import Link from "next/link";
import ProductCard, { Product } from "./ProductCard";
import { useCartStore } from "@/store/cartStore";
import { phonesBySlugs, toCardProduct } from "@/lib/phoneCatalog";

const DEAL_SLUGS = ["iphone-15", "galaxy-s25", "google-pixel-8", "oneplus-11r"];

const dealProducts: Product[] = phonesBySlugs(DEAL_SLUGS).map((p) => {
  const card = toCardProduct(p);
  const pct = card.originalPrice
    ? Math.round(((card.originalPrice - card.price) / card.originalPrice) * 100)
    : 0;
  return { ...card, badge: pct ? `${pct}% OFF` : undefined, badgeColor: "#FB5724" };
});

export default function BestDeals() {
  const addItem = useCartStore((s) => s.addItem);

  function handleAddToCart(p: Product) {
    addItem({
      id: p.id, name: p.name, variant: p.variant, price: p.price,
      original_price: p.originalPrice, rating: p.rating, review_count: p.reviewCount,
      image: p.image, slug: p.slug, badge: p.badge, badge_color: p.badgeColor,
      spec_screen: p.specs?.screen, spec_ram: p.specs?.ram, spec_camera: p.specs?.camera,
    } as never);
  }

  return (
    <section className="bg-gray-50 pt-8 md:pt-12 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-gray-900 text-2xl font-bold">Best Deals</h2>
            <p className="text-gray-400 text-sm mt-1">Top offers. Limited time only.</p>
          </div>
          <Link
            href="/products?deals=true"
            className="text-brand-600 text-sm font-medium hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            View All →
          </Link>
        </div>

        {/* Mobile: single-row horizontal scroll */}
        <div
          className="flex gap-3 overflow-x-auto sm:hidden pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {dealProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[175px]">
              <ProductCard product={product} onAddToCart={handleAddToCart} />
            </div>
          ))}
        </div>

        {/* Desktop: 4-column grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
}
