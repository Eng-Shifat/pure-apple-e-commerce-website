import Link from "next/link";
import ProductCard, { Product } from "./ProductCard";

// ─── Replace image paths with your actual product images ──────────────────────
const popularProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 16 Pro",
    variant: "256GB – Premium",
    price: 1199.0,
    rating: 4.8,
    reviewCount: 2500,
    image: "/images/products/iphone16pro.png",
    slug: "iphone-16-pro",
    badge: "Best Seller",
    badgeColor: "#4FAE53",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24",
    variant: "256GB – Phantom Black",
    price: 999.0,
    rating: 4.6,
    reviewCount: 1980,
    image: "/images/products/galaxy-s24.png",
    slug: "samsung-galaxy-s24",
  },
  {
    id: "3",
    name: "Google Pixel 9",
    variant: "128GB – Obsidian",
    price: 799.0,
    rating: 4.4,
    reviewCount: 530,
    image: "/images/products/pixel9.png",
    slug: "google-pixel-9",
  },
  {
    id: "4",
    name: "OnePlus 12",
    variant: "256GB – Flowy Emerald",
    price: 899.0,
    rating: 4.5,
    reviewCount: 880,
    image: "/images/products/oneplus12.png",
    slug: "oneplus-12",
  },
];

export default function PopularProducts() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center sm:items-end justify-between gap-3 mb-7">
          <div>
            <h2 className="text-gray-900 text-[19px] sm:text-2xl font-extrabold sm:font-bold tracking-tight">
              Popular Smartphones
            </h2>
            <p className="hidden sm:block text-gray-400 text-sm mt-1">
              Discover the most loved devices by our customers.
            </p>
          </div>
          <Link
            href="/products"
            className="text-brand-600 text-sm font-medium hover:underline flex items-center gap-1 shrink-0"
          >
            View All →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
