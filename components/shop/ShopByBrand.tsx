import Link from "next/link";
import Image from "next/image";

// All brands use real logo files from /public/images/brands/
const brands = [
  {
    name: "Apple",
    logo: "/images/brands/apple-logo.png",
    slug: "apple",
    logoW: "w-10 h-10",
    card: "from-[#f5f5f7] to-[#e8e8ed]",
    border: "border-[#d1d1d6] hover:border-[#86868b]",
    shadow: "hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]",
    labelHover: "group-hover:text-[#1d1d1f]",
  },
  {
    name: "Samsung",
    logo: "/images/brands/samsung-logo.png",
    slug: "samsung",
    logoW: "w-20 h-8",
    card: "from-[#f2faf2] to-[#ddf2de]",
    border: "border-[#bde5bf] hover:border-[#1428A0]",
    shadow: "hover:shadow-[0_12px_32px_rgba(20,40,160,0.15)]",
    labelHover: "group-hover:text-[#1428A0]",
  },
  {
    name: "OnePlus",
    logo: "/images/brands/oneplus-logo.png",
    slug: "oneplus",
    logoW: "w-11 h-11",
    card: "from-[#fff1f1] to-[#ffe4e4]",
    border: "border-[#fecaca] hover:border-[#ef4444]",
    shadow: "hover:shadow-[0_12px_32px_rgba(239,68,68,0.18)]",
    labelHover: "group-hover:text-[#dc2626]",
  },
  {
    name: "Redmi",
    logo: "/images/brands/Xiaomi-logo.png",
    slug: "redmi",
    logoW: "w-11 h-11",
    card: "from-[#fff7ed] to-[#ffedd5]",
    border: "border-[#fed7aa] hover:border-[#FB5724]",
    shadow: "hover:shadow-[0_12px_32px_rgba(234,88,12,0.13)]",
    labelHover: "group-hover:text-[#E8470F]",
  },
  {
    name: "Realme",
    logo: "/images/brands/realme-logo.png",
    slug: "realme",
    logoW: "w-20 h-8",
    card: "from-[#fffbeb] to-[#fef08a]",
    border: "border-[#fde68a] hover:border-[#FCC10B]",
    shadow: "hover:shadow-[0_12px_32px_rgba(217,119,6,0.15)]",
    labelHover: "group-hover:text-[#A87A05]",
  },
  {
    name: "Nothing",
    logo: "/images/brands/nothing.png",
    slug: "nothing",
    logoW: "w-20 h-8",
    card: "from-[#f9fafb] to-[#f3f4f6]",
    border: "border-[#e5e7eb] hover:border-[#374151]",
    shadow: "hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)]",
    labelHover: "group-hover:text-[#111827]",
  },
  {
    name: "Motorola",
    logo: "/images/brands/Motorolla.jpeg",
    slug: "motorola",
    logoW: "w-10 h-10",
    card: "from-[#f0f9ff] to-[#e0f2fe]",
    border: "border-[#bae6fd] hover:border-[#0099E6]",
    shadow: "hover:shadow-[0_12px_32px_rgba(0,153,230,0.2)]",
    labelHover: "group-hover:text-[#0099E6]",
  },
  {
    name: "Vivo",
    logo: "/images/brands/vivo.png",
    slug: "vivo",
    logoW: "w-20 h-8",
    card: "from-[#eef1ff] to-[#dde3ff]",
    border: "border-[#c7d0ff] hover:border-[#415FFF]",
    shadow: "hover:shadow-[0_12px_32px_rgba(65,95,255,0.18)]",
    labelHover: "group-hover:text-[#415FFF]",
  },
  {
    name: "Honor",
    logo: "/images/brands/honor.svg",
    slug: "honor",
    logoW: "w-20 h-8",
    card: "from-[#ecfdf5] to-[#d1fae5]",
    border: "border-[#a7f3d0] hover:border-[#CC0000]",
    shadow: "hover:shadow-[0_12px_32px_rgba(204,0,0,0.15)]",
    labelHover: "group-hover:text-[#CC0000]",
  },
  {
    name: "iQOO",
    logo: "/images/brands/iqoo.png",
    slug: "iqoo",
    logoW: "w-20 h-8",
    card: "from-[#fafafa] to-[#f0f0f0]",
    border: "border-[#e0e0e0] hover:border-[#0B0B0B]",
    shadow: "hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)]",
    labelHover: "group-hover:text-[#0B0B0B]",
  },
];

export default function ShopByBrand() {
  return (
    <section className="relative bg-white pt-5 pb-6 md:py-10 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)",
          backgroundSize: "24px 24px",
          opacity: 0.06,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-5 sm:mb-7">
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] text-brand-600 uppercase mb-1">
              Official Partners
            </p>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Shop by Brand
            </h2>
          </div>
          <Link
            href="/products"
            className="group flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            View All
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3">
          {brands.map((brand) => {
            return (
              <Link
                key={brand.name}
                href={`/products?category=${brand.slug}`}
                className={`
                  group relative flex flex-col items-center justify-center gap-3
                  py-5 px-3 rounded-2xl border bg-gradient-to-b
                  ${brand.card} ${brand.border} ${brand.shadow}
                  transition-all duration-300 hover:-translate-y-1 overflow-hidden
                `}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.7) 0%, transparent 50%)" }}
                />

                <div className={`relative ${brand.logoW} transition-transform duration-300 group-hover:scale-110`}>
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain"
                    sizes="80px"
                  />
                </div>

                <span className={`text-[11px] font-semibold tracking-wide text-gray-400 transition-colors duration-200 ${brand.labelHover}`}>
                  {brand.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
