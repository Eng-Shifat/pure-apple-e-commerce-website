import Link from "next/link";
import Image from "next/image";

export default function PromoBanner() {
  return (
    <section className="bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/products?deals=true"
          className="block relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group"
          style={{ aspectRatio: "16/5" }}
        >
          <Image
            src="/images/Banner/discount%20banner.webp"
            alt="Discount Banner"
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            priority
          />
          {/* subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5 rounded-2xl" />
        </Link>
      </div>
    </section>
  );
}
