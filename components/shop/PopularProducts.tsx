// SAVE PATH: components/shop/PopularProducts.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProductCard, { Product } from "./ProductCard";
import { useCartStore } from "@/store/cartStore";
import { cachedJson } from "@/lib/cachedFetch";
import { phonesBySlugs, toCardProduct, PHONES } from "@/lib/phoneCatalog";
import { publicPrices } from "@/lib/offers";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    cachedJson<{ products?: unknown[] }>("/api/products?featured=true")
      .then((d) => {
        if (Array.isArray(d.products) && d.products.length > 0)
          setProducts(d.products.map(fromApi));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function checkScroll() {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [products]);

  function slide(dir: "left" | "right") {
    const el = sliderRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("div")?.offsetWidth ?? 220;
    el.scrollBy({ left: dir === "left" ? -(cardWidth + 16) * 2 : (cardWidth + 16) * 2, behavior: "smooth" });
  }

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

        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-6 sm:mb-8">
          <div className="min-w-0">
            <p className="text-brand-500 text-xs font-semibold uppercase tracking-widest mb-1">Top Picks</p>
            <h2 className="text-gray-900 text-xl sm:text-3xl font-extrabold tracking-tight leading-tight whitespace-nowrap">
              Popular Smartphones
            </h2>
            <p className="hidden sm:block text-gray-400 text-sm mt-1">Discover the most loved devices by our customers.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop nav arrows */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => slide("left")}
                disabled={!canScrollLeft}
                className="p-1.5 rounded-full border border-gray-200 text-gray-400 hover:text-brand-500 hover:border-brand-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => slide("right")}
                disabled={!canScrollRight}
                className="p-1.5 rounded-full border border-gray-200 text-gray-400 hover:text-brand-500 hover:border-brand-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <Link
              href="/products"
              className="text-brand-500 text-[13px] sm:text-sm font-semibold border border-brand-200 hover:border-brand-400 hover:bg-brand-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all whitespace-nowrap"
            >
              View All →
            </Link>
          </div>
        </div>

        {loading ? (
          /* Skeleton — single-row scroll on all sizes */
          <div className="flex gap-4 overflow-x-hidden pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-gray-100 animate-pulse shrink-0"
                style={{ width: "200px", height: "320px" }}
              />
            ))}
          </div>
        ) : (
          /* ── Single-row slider on ALL screen sizes ── */
          <div className="relative">
            <div
              ref={sliderRef}
              className="flex gap-4 overflow-x-auto pb-3 pt-4 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {products.map((p) => (
                <div
                  key={p.id}
                  className="shrink-0 w-[175px] sm:w-[200px] lg:w-[215px]"
                >
                  <ProductCard product={p} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
