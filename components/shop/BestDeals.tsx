import Link from "next/link";
import ProductCard, { Product } from "./ProductCard";

// ─── Replace image paths with your actual product images ──────────────────────
const dealProducts: Product[] = [
  {
    id: "5",
    name: "iPhone 15",
    variant: "128GB – Blue",
    price: 849.0,
    originalPrice: 999.0,
    rating: 4.7,
    reviewCount: 3200,
    image: "/images/products/iphone15.png",
    slug: "iphone-15",
    badge: "15%",
    badgeColor: "#FB5724",
  },
  {
    id: "6",
    name: "Samsung Galaxy S23",
    variant: "120GB – Lavender",
    price: 719.0,
    originalPrice: 899.0,
    rating: 4.5,
    reviewCount: 1135,
    image: "/images/products/galaxy-s23.png",
    slug: "samsung-galaxy-s23",
    badge: "20%",
    badgeColor: "#FB5724",
  },
  {
    id: "7",
    name: "Google Pixel 8",
    variant: "128GB – Hazel",
    price: 719.0,
    originalPrice: 799.0,
    rating: 4.4,
    reviewCount: 680,
    image: "/images/products/pixel8.png",
    slug: "google-pixel-8",
    badge: "10%",
    badgeColor: "#FB5724",
  },
  {
    id: "8",
    name: "OnePlus Nord 3",
    variant: "256GB – Black",
    price: 599.0,
    originalPrice: 679.0,
    rating: 4.3,
    reviewCount: 580,
    image: "/images/products/oneplus-nord3.png",
    slug: "oneplus-nord-3",
    badge: "12%",
    badgeColor: "#FB5724",
  },
];

export default function BestDeals() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="text-gray-900 text-2xl font-bold">Best Deals</h2>
            <p className="text-gray-400 text-sm mt-1">
              Top offers. Limited time only.
            </p>
          </div>
          <Link
            href="/products?deals=true"
            className="text-brand-600 text-sm font-medium hover:underline flex items-center gap-1"
          >
            View All →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
