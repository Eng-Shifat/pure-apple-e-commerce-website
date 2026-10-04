"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard, { Product } from "./ProductCard";

// ── Fallback static products (shown while fetching or if API fails) ────────────
const FALLBACK: Product[] = [
  {
    id: "1",
    name: "iPhone 16 Pro",
    variant: "256GB – Desert Titanium",
    price: 114499,
    originalPrice: 124999,
    rating: 4.8,
    reviewCount: 2500,
    image: "/images/products/iPhone16.webp",
    slug: "iphone-16-pro",
    badge: "Best Seller",
    badgeColor: "#4FAE53",
    specs: { screen: "6.3-inch", ram: "8GB", camera: "48 MP" },
  },
  {
    id: "2",
    name: "Samsung Galaxy S24",
    variant: "256GB – Phantom Black",
    price: 99999,
    originalPrice: 109999,
    rating: 4.6,
    reviewCount: 1980,
    image: "/images/products/Samsung Galaxy S24.webp",
    slug: "samsung-galaxy-s24",
    badge: "Hot Deal",
    badgeColor: "#FB5724",
    specs: { screen: "6.2-inch", ram: "8GB", camera: "50 MP" },
  },
  {
    id: "3",
    name: "Google Pixel 9",
    variant: "128GB – Obsidian",
    price: 79999,
    rating: 4.4,
    reviewCount: 530,
    image: "/images/products/Google Pixel 9.webp",
    slug: "google-pixel-9",
    specs: { screen: "6.3-inch", ram: "12GB", camera: "50 MP" },
  },
  {
    id: "4",
    name: "OnePlus 12",
    variant: "256GB – Flowy Emerald",
    price: 89999,
    rating: 4.5,
    reviewCount: 880,
    image: "/images/products/OnePlus 12.webp",
    slug: "oneplus-12",
    specs: { screen: "6.7-inch", ram: "12GB", camera: "50 MP" },
  },
  {
    id: "5",
    name: "Google Pixel 10 Pro",
    variant: "256GB – Hazel",
    price: 109999,
    originalPrice: 119999,
    rating: 4.7,
    reviewCount: 310,
    image: "/images/products/Google Pixel 10 Pro.webp",
    slug: "google-pixel-10-pro",
    badge: "New",
    badgeColor: "#7C3AED",
    specs: { screen: "6.3-inch", ram: "16GB", camera: "50 MP" },
  },
];

export default function PopularProducts() {
  const [products, setProducts] = useState<Product[]>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from API — if it returns products, use them; otherwise keep fallback
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {/* keep fallback */})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between gap-3 mb-8">
          <div>
            <p className="text-brand-500 text-xs font-semibold uppercase tracking-widest mb-1">
              Top Picks
            </p>
            <h2 className="text-gray-900 text-2xl sm:text-3xl font-extrabold tracking-tight">
              Popular Smartphones
            </h2>
            <p className="hidden sm:block text-gray-400 text-sm mt-1">
              Discover the most loved devices by our customers.
            </p>
          </div>
          <Link
            href="/products"
            className="shrink-0 text-brand-500 text-sm font-semibold border border-brand-200 hover:border-brand-400 hover:bg-brand-50 px-4 py-2 rounded-full transition-all"
          >
            View All →
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          // Skeleton
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse" style={{ height: "380px" }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
