import Link from "next/link";
import Image from "next/image";

export default function PromoBanner() {
  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0E2318 0%, #1E5A33 60%, #14402A 100%)",
          }}
        >
          <div className="flex items-center justify-between min-h-[200px] px-8 py-8 lg:px-16">
            {/* Left: Text */}
            <div className="z-10">
              <p className="text-sun-400 text-sm font-semibold mb-2">
                Limited Time Offer
              </p>
              <h2 className="text-white text-4xl lg:text-5xl font-black leading-none mb-2">
                Up to 30% Off
              </h2>
              <p className="text-leaf-100/80 text-sm mb-6">
                On Selected Smartphones
              </p>
              <Link
                href="/products?deals=true"
                className="inline-flex items-center gap-2 bg-brand-500 text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-brand-400 shadow-lg shadow-brand-500/30 transition-colors"
              >
                Shop Deals →
              </Link>
            </div>

            {/* Right: Image placeholder — replace with your promo image */}
            <div className="hidden lg:block absolute right-0 bottom-0 h-full w-96">
              <Image
                src="/images/promo/promo-phones.png"
                alt="Deals on smartphones"
                fill
                className="object-contain object-right-bottom"
              />
            </div>

            {/* Decorative text */}
            <div className="hidden lg:block absolute right-64 top-8 text-right z-10">
              <p className="text-white/30 text-2xl font-bold italic leading-tight">
                Better
              </p>
              <p className="text-white/30 text-2xl font-bold italic leading-tight">
                Faster
              </p>
              <p className="text-white/30 text-2xl font-bold italic leading-tight">
                Smarter
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
