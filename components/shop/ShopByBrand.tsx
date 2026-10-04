import Link from "next/link";
import Image from "next/image";

const brands = [
  {
    name: "Apple",
    logo: "/images/brands/apple-logo.png",
    slug: "apple",
    // Square logo — normal box
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
    // Wide wordmark — tall box with full width
    logoW: "w-20 h-8",
    card: "from-[#f2faf2] to-[#ddf2de]",
    border: "border-[#bde5bf] hover:border-[#4FAE53]",
    shadow: "hover:shadow-[0_12px_32px_rgba(79,174,83,0.18)]",
    labelHover: "group-hover:text-[#327536]",
  },
  {
    name: "Google",
    logo: "/images/brands/google-logo.png",
    slug: "google",
    logoW: "w-11 h-11",
    card: "from-[#fff8f0] to-[#fef3c7]",
    border: "border-[#fed7aa] hover:border-[#FB5724]",
    shadow: "hover:shadow-[0_12px_32px_rgba(234,88,12,0.12)]",
    labelHover: "group-hover:text-[#FB5724]",
  },
  {
    name: "OnePlus",
    logo: "/images/brands/oneplus-logo.png",
    slug: "oneplus",
    logoW: "w-11 h-11",
    card: "from-[#f6fbf0] to-[#e4f3d4]",
    border: "border-[#cfe8b8] hover:border-[#6BBF6F]",
    shadow: "hover:shadow-[0_12px_32px_rgba(79,174,83,0.16)]",
    labelHover: "group-hover:text-[#3E9142]",
  },
  {
    name: "Xiaomi",
    logo: "/images/brands/Xiaomi-logo.png",
    slug: "xiaomi",
    logoW: "w-11 h-11",
    card: "from-[#fff7ed] to-[#ffedd5]",
    border: "border-[#fed7aa] hover:border-[#FB5724]",
    shadow: "hover:shadow-[0_12px_32px_rgba(234,88,12,0.13)]",
    labelHover: "group-hover:text-[#E8470F]",
  },
  {
    name: "realme",
    logo: "/images/brands/realme-logo.png",
    slug: "realme",
    // Wide badge logo
    logoW: "w-20 h-8",
    card: "from-[#fffbeb] to-[#fef08a]",
    border: "border-[#fde68a] hover:border-[#FCC10B]",
    shadow: "hover:shadow-[0_12px_32px_rgba(217,119,6,0.15)]",
    labelHover: "group-hover:text-[#A87A05]",
  },
];

export default function ShopByBrand() {
  return (
    <section className="relative bg-white py-10 overflow-hidden">

      {/* Dot pattern */}
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

        {/* Header */}
        <div className="flex items-end justify-between mb-7">
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

        {/* Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {brands.map((brand) => (
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
              {/* Shine */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.7) 0%, transparent 50%)" }}
              />

              {/* Logo */}
              <div className={`relative ${brand.logoW} transition-transform duration-300 group-hover:scale-110`}>
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </div>

              {/* Label */}
              <span className={`text-[11px] font-semibold tracking-wide text-gray-400 transition-colors duration-200 ${brand.labelHover}`}>
                {brand.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
