// SAVE PATH: components/shop/PopularProducts.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard, { Product } from "./ProductCard";
import { useCartStore } from "@/store/cartStore";
import { cachedJson } from "@/lib/cachedFetch";
import { phonesBySlugs, toCardProduct, PHONES } from "@/lib/phoneCatalog";
import { publicPrices } from "@/lib/offers";

const POPULAR_SLUGS = [
  "iphone-16-pro",
  "iphone-17-pro-max",
  "galaxy-s25-ultra",
  "google-pixel-10-pro",
  "oneplus-12",
];

const FALLBACK: Product[] = phonesBySlugs(POPULAR_SLUGS).map(toCardProduct);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromApi(r: any): Product {
  const catalogPhone = PHONES.find((p) => p.slug === r.slug);
  return {
    id: String(r.id),
    name: r.name ?? "",
    variant: r.variant ?? "",
    ...publicPrices(r),
    rating: Number(r.rating ?? 0),
    reviewCount: Number(r.review_count ?? r.reviewCount ?? 0),
    image: r.image ?? "",
    slug: r.slug ?? "",
    badge: r.badge ?? undefined,
    badgeColor: r.badge_color ?? r.badgeColor ?? undefined,
    storage: catalogPhone?.storage,
    colors: catalogPhone?.colors ?? undefined,
    specs: {
      screen: r.spec_screen ?? catalogPhone?.specs?.screen,
      ram: r.spec_ram ?? catalogPhone?.specs?.ram,
      camera: r.spec_camera ?? catalogPhone?.specs?.camera,
    },
  };
}

export default function PopularProducts() {
  const [products, setProducts] = useState<Product[]>(FALLBACK);
  const [loading,  setLoading]  = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    cachedJson<{ products?: unknown[] }>("/api/products?featured=true")
      .then(d => { if (Array.isArray(d.products) && d.products.length > 0) setProducts(d.products.map(fromApi)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleAddToCart(p: Product) {
    addItem({
      id: p.id, name: p.name, variant: p.variant, price: p.price,
      original_price: p.originalPrice, rating: p.rating, review_count: p.reviewCount,
      image: p.image, slug: p.slug, badge: p.badge, badge_color: p.badgeColor,
      spec_screen: p.specs?.screen, spec_ram: p.specs?.ram, spec_camera: p.specs?.camera,
    } as never);
  }

  const cardClass = "w-[175px] sm:w-auto shrink-0 sm:shrink";

  return (
    <section className="bg-white pt-3 pb-5 md:pt-[20px] md:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-6 sm:mb-8">
          <div className="min-w-0">
            <p className="text-brand-500 text-xs font-semibold uppercase tracking-widest mb-1">Top Picks</p>
            <h2 className="text-gray-900 text-xl sm:text-3xl font-extrabold tracking-tight leading-tight whitespace-nowrap">
              Popular Smartphones
            </h2>
            <p className="hidden sm:block text-gray-400 text-sm mt-1">Discover the most loved devices by our customers.</p>
          </div>
          <Link
            href="/products"
            className="shrink-0 text-brand-500 text-[13px] sm:text-sm font-semibold border border-brand-200 hover:border-brand-400 hover:bg-brand-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all whitespace-nowrap"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <>
            {/* Mobile skeleton — horizontal scroll */}
            <div className="flex gap-3 overflow-x-auto sm:hidden pb-2" style={{ scrollbarWidth: "none" }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[175px] shrink-0 rounded-2xl bg-gray-100 animate-pulse" style={{ height: "320px" }} />
              ))}
            </div>
            {/* Desktop skeleton — grid */}
            <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-100 animate-pulse" style={{ height: "360px" }} />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* ── Mobile: horizontal scroll ── */}
            <div
              className="flex gap-3 overflow-x-auto sm:hidden pb-2 pt-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {products.map(p => (
                <div key={p.id} className={cardClass}>
                  <ProductCard product={p} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>

            {/* ── Desktop: grid ── */}
            <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-3">
              {products.map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
