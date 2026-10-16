// SAVE PATH: components/shop/PromoBanner.tsx
import Link from "next/link";
import Image from "next/image";

export default function PromoBanner() {
  return (
    <section className="bg-gray-50 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <Link
          href="/todays-deal"
          className="block relative w-full overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group"
        >
          {/*
            Image is 2172×724 (ratio ~3:1).
            Mobile: show full image with object-contain so nothing is cropped.
              - aspect-[3/1] matches the image ratio exactly.
              - bg matches the image's dominant dark-green bottom colour.
            Desktop (sm+): object-cover fills the wider container nicely.
          */}

          {/* ── Mobile: full image, no crop ── */}
          <div className="relative w-full sm:hidden" style={{ aspectRatio: "2172/724" }}>
            <Image
              src="/images/Banner/discount%20banner.webp"
              alt="Today's Deal – Best Deals at Pure Apple Mobile & Gadget Shop"
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="100vw"
            />
          </div>

          {/* ── Desktop: cover, taller ── */}
          <div className="relative w-full hidden sm:block aspect-[16/4] min-h-[200px]">
            <Image
              src="/images/Banner/discount%20banner.webp"
              alt="Today's Deal – Best Deals at Pure Apple Mobile & Gadget Shop"
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(min-width: 1280px) 1200px, 95vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/10 rounded-2xl" />
          </div>
        </Link>
      </div>
    </section>
  );
}
