import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  { name: "Apple", emoji: "🍎", href: "/products?category=apple" },
  { name: "Samsung", emoji: "💎", href: "/products?category=samsung" },
  { name: "OnePlus", emoji: "🔴", href: "/products?category=oneplus" },
  { name: "Redmi", emoji: "⚡", href: "/products?category=redmi" },
  { name: "Realme", emoji: "🌟", href: "/products?category=realme" },
  { name: "Nothing", emoji: "⚪", href: "/products?category=nothing" },
  { name: "Motorola", emoji: "〽️", href: "/products?category=motorola" },
  { name: "Vivo", emoji: "📸", href: "/products?category=vivo" },
  { name: "Honor", emoji: "🏅", href: "/products?category=honor" },
  { name: "iQOO", emoji: "🎮", href: "/products?category=iqoo" },
];

export default function MobileCategories() {
  return (
    <section className="md:hidden bg-gray-50 px-4 pt-6 pb-3">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[19px] font-extrabold tracking-tight text-gray-900">
          Shop by Brand
        </h2>
        <Link
          href="/products"
          className="flex items-center gap-1 text-[13px] font-semibold text-brand-600"
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {categories.map((c) => (
          <Link
            key={c.name}
            href={c.href}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-brand-100/70 bg-white px-1 py-3.5 shadow-sm transition-all duration-300 active:scale-95"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-2xl">
              {c.emoji}
            </span>
            <span className="text-[11px] font-semibold leading-tight text-gray-800 text-center">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}