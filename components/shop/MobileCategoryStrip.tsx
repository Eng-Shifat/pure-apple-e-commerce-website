"use client";

import Link from "next/link";
import { useRef } from "react";

const tabs = [
  { label: "Hottest in the Market", href: "/products?deals=true" },
  { label: "iPhone", href: "/products?category=apple" },
  { label: "Android", href: "/products?category=android" },
  { label: "Charger", href: "/products?category=charger" },
  { label: "Accessories", href: "/products?category=accessories" },
];

/** Dark pill tab strip shown under the header on mobile only. */
export default function MobileCategoryStrip({ active = 0 }: { active?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="md:hidden px-4 pt-3">
      <div
        ref={ref}
        className="flex items-center gap-0.5 overflow-x-auto rounded-full bg-gradient-to-r from-[#0E2318] to-[#163D27] p-1 ring-1 ring-white/5 shadow-lg shadow-slate-900/15 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((t, i) => (
          <Link
            key={t.label}
            href={t.href}
            className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-[6px] text-[11.5px] font-semibold tracking-wide transition-all duration-300 active:scale-95 ${
              i === active
                ? "bg-gradient-to-b from-brand-400 to-brand-500 text-white shadow-md shadow-brand-900/30"
                : "text-white/70 hover:text-white"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
