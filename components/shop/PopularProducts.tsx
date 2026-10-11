"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard, { Product } from "./ProductCard";
import { useCartStore } from "@/store/cartStore";
import { phonesBySlugs, toCardProduct } from "@/lib/phoneCatalog";

const POPULAR_SLUGS = [
  "iphone-16-pro",
  "galaxy-s26-ultra",
  "google-pixel-9",
  "oneplus-12",
  "google-pixel-10-pro",
];

const FALLBACK: Product[] = phonesBySlugs(POPULAR_SLUGS).map(toCardProduct);

// Supabase row (snake_case) → ProductCard-এর shape
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromApi(r: any): Product {
  return {
    id: String(r.id),
    name: r.name ?? "",
    variant: r.variant ?? "",
    price: Number(r.price ?? 0),
    originalPrice: r.original_price ?? r.originalPrice ?? undefined,
    rating: Number(r.rating ?? 0),
    reviewCount: Number(r.review_count ?? r.reviewCount ?? 0),
    image: r.image ?? "",
    slug: r.slug ?? "",
    badge: r.badge ?? undefined,
    badgeColor: r.badge_color ?? r.badgeColor ?? undefined,
    specs: {
      screen: r.spec_screen ?? r.specs?.screen,
      ram: r.spec_ram ?? r.specs?.ram,
      camera: r.spec_camera ?? r.specs?.camera,
    },
  };
}

export default function PopularProducts() {
  const [products, setProducts] = useState<Product[]>(FALLBACK);
  const [loading,  setLoading]  = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch("/api/products?featured=true")
      .then(r => r.json())
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

  return (
    <section className="bg-white pt-3 pb-5 md:pt-[20px] md:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse" style={{ height: "340px" }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-3">
            {products.map(p => <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />)}
          </div>
        )}
      </div>
    </section>
  );
}
