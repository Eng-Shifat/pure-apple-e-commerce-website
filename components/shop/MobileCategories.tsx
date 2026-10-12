"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import ComingSoonModal from "./ComingSoonModal";
import type { CategorySetting } from "@/lib/categories";
import { DEFAULT_CATEGORIES } from "@/lib/categories";

const categories: { slug: string; name: string; icon: string }[] = [
  { slug: "android",     name: "Android",     icon: "/icon/android.png"    },
  { slug: "iphone",      name: "iPhone",      icon: "/icon/iPhone.png"     },
  { slug: "charger",     name: "Charger",     icon: "/icon/Charger.png"    },
  { slug: "speaker",     name: "Speaker",     icon: "/icon/speaker.png"    },
  { slug: "earbuds",     name: "Ear Buds",    icon: "/icon/ear buds.png"   },
  { slug: "powerbank",   name: "Power Bank",  icon: "/icon/power-bank.png" },
  { slug: "cables",      name: "Cables",      icon: "/icon/cable.png"      },
  { slug: "accessories", name: "Accessories", icon: "/icon/accessories.png"},
];

// CSS filter that converts any opaque image to the brand orange (#FB5724)
// Generated via: https://codepen.io/sosuke/pen/Pjoqqp
const BRAND_FILTER =
  "brightness(0) saturate(100%) invert(42%) sepia(97%) saturate(631%) hue-rotate(342deg) brightness(98%) contrast(97%)";

export default function MobileCategories() {
  const [settings, setSettings]     = useState<CategorySetting[]>(DEFAULT_CATEGORIES);
  const [comingSoon, setComingSoon] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d: { categories: CategorySetting[] }) => {
        if (d.categories?.length) setSettings(d.categories);
      })
      .catch(() => {});
  }, []);

  function isEnabled(slug: string): boolean {
    const found = settings.find((c) => c.slug === slug);
    return found ? found.is_enabled : true;
  }

  function handleClick(e: React.MouseEvent, slug: string, name: string) {
    if (!isEnabled(slug)) {
      e.preventDefault();
      setComingSoon(name);
    }
  }

  return (
    <>
      <section className="bg-white pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-500">
                Browse
              </p>
              <h2 className="text-[20px] font-extrabold tracking-tight text-gray-900">
                Shop by Category
              </h2>
            </div>
            <Link
              href="/products"
              className="flex shrink-0 items-center gap-1 rounded-full border border-brand-200 px-3 py-1.5 text-[13px] font-semibold text-brand-500 transition-all hover:border-brand-400 hover:bg-brand-50"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
            {categories.map((c) => {
              const enabled = isEnabled(c.slug);
              return (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  onClick={(e) => handleClick(e, c.slug, c.name)}
                  className={`relative group flex flex-col items-center justify-center gap-3 rounded-2xl border border-brand-100 bg-gradient-to-b from-white to-brand-50 px-1 py-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card-hover active:scale-95
                    ${!enabled ? "opacity-60" : ""}`}
                >
                  <span className="flex h-8 w-8 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={c.icon}
                      alt={c.name}
                      width={32}
                      height={32}
                      className="object-contain"
                      style={{ filter: BRAND_FILTER }}
                    />
                  </span>
                  <span className="text-center text-[11px] font-bold leading-tight text-gray-800 transition-colors group-hover:text-brand-600">
                    {c.name}
                  </span>

                  {!enabled && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-[8px] font-black">!</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {comingSoon && (
        <ComingSoonModal
          categoryLabel={comingSoon}
          categoryIcon=""
          onClose={() => setComingSoon(null)}
        />
      )}
    </>
  );
}
