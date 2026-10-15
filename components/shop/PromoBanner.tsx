import Link from "next/link";
import Image from "next/image";

export default function PromoBanner() {
  return (
    <section className="bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <Link
          href="/products?deals=true"
          className="block relative w-full overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group"
        >
          {/*
            Mobile  (< sm): aspect-[16/9]  — taller so the banner content is readable
            Tablet+ (sm+) : aspect-[16/5]  — original wide ratio
          */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[16/5]">
            <Image
              src="/images/Banner/discount%20banner.webp"
              alt="Discount Banner – Best Deals at Pure Apple Mobile & Gadget Shop"
              fill
              className="object-cover object-left-top transition-transform duration-500 group-hover:scale-[1.02]"
              priority
              sizes="(min-width: 1280px) 1200px, (min-width: 640px) 95vw, 100vw"
            />
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/10 rounded-2xl" />
          </div>
        </Link>
      </div>
    </section>
  );
}
