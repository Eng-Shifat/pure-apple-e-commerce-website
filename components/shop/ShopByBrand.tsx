import Link from "next/link";
import Image from "next/image";

// Add your brand logos to /public/images/brands/
const brands = [
  { name: "Apple", logo: "/images/brands/apple.png", slug: "apple" },
  { name: "Samsung", logo: "/images/brands/samsung.png", slug: "samsung" },
  { name: "Google", logo: "/images/brands/google.png", slug: "google" },
  { name: "OnePlus", logo: "/images/brands/oneplus.png", slug: "oneplus" },
  { name: "Xiaomi", logo: "/images/brands/xiaomi.png", slug: "xiaomi" },
  { name: "realme", logo: "/images/brands/realme.png", slug: "realme" },
];

export default function ShopByBrand() {
  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="text-gray-900 text-2xl font-bold">Shop by Brand</h2>
          </div>
          <Link
            href="/products"
            className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
          >
            View All →
          </Link>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={`/products?category=${brand.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group"
            >
              <div className="relative w-10 h-10">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain group-hover:scale-110 transition-transform"
                />
              </div>
              <span className="text-gray-600 text-xs font-medium group-hover:text-blue-600 transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
