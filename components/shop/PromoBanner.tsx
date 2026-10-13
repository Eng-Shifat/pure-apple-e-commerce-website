import Link from "next/link";
import Image from "next/image";

export default function PromoBanner() {
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/products?deals=true" className="block relative rounded-2xl overflow-hidden" style={{ aspectRatio: "16/5" }}>
          <Image
            src="/images/hero/discount%20banner.webp"
            alt="Deals on smartphones"
            fill
            className="object-cover object-center"
            priority
          />
        </Link>
      </div>
    </section>
  );
}
