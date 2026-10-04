import Link from "next/link";
import {
  Smartphone,
  TabletSmartphone,
  Plug,
  Speaker,
  Headphones,
  BatteryCharging,
  Cable,
  Watch,
  ArrowRight,
} from "lucide-react";

const categories = [
  { name: "Android", icon: Smartphone, href: "/products?category=android" },
  { name: "iPhone", icon: TabletSmartphone, href: "/products?category=apple" },
  { name: "Charger", icon: Plug, href: "/products?category=charger" },
  { name: "Speaker", icon: Speaker, href: "/products?category=speaker" },
  { name: "Ear Buds", icon: Headphones, href: "/products?category=earbuds" },
  { name: "Power Bank", icon: BatteryCharging, href: "/products?category=powerbank" },
  { name: "Cables", icon: Cable, href: "/products?category=cables" },
  { name: "Accessories", icon: Watch, href: "/products?category=accessories" },
];

/** Icon grid "Shop by Category" – mobile only. */
export default function MobileCategories() {
  return (
    <section className="md:hidden bg-gray-50 px-4 pt-6 pb-3">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[19px] font-extrabold tracking-tight text-gray-900">
          Shop by Category
        </h2>
        <Link
          href="/products"
          className="flex items-center gap-1 text-[13px] font-semibold text-brand-600"
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.name}
              href={c.href}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-brand-100/70 bg-white px-1 py-3.5 shadow-sm transition-all duration-300 active:scale-95"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-active:bg-brand-500 group-active:text-white">
                <Icon size={22} strokeWidth={1.8} />
              </span>
              <span className="text-[11px] font-semibold leading-tight text-gray-800">
                {c.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
