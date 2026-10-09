"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import ComingSoonModal from "./ComingSoonModal";
import type { CategorySetting } from "@/lib/categories";
import { DEFAULT_CATEGORIES } from "@/lib/categories";

function Svg({ children, ...props }: React.SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden {...props}>
      {children}
    </svg>
  );
}

function AndroidIcon() {
  return (
    <Svg>
      <rect x="5" y="8" width="14" height="11" rx="2" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
      <line x1="9" y1="11" x2="9" y2="14" />
      <line x1="15" y1="11" x2="15" y2="14" />
      <path d="M2 11h2M20 11h2" />
    </Svg>
  );
}

function IPhoneIcon() {
  return (
    <Svg>
      <rect x="7" y="2" width="10" height="20" rx="3" />
      <path d="M10 5h4" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17.5" r="1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

function ChargerIcon() {
  return (
    <Svg>
      <path d="M6.5 6h11" />
      <path d="M6.5 10h11" />
      <path d="M9 6V4" />
      <path d="M15 6V4" />
      <path d="M9 10v2" />
      <path d="M15 10v2" />
      <path d="M9 12h6l-1 5H10l-1-5z" />
      <path d="M12 17v3" />
    </Svg>
  );
}

function SpeakerIcon() {
  return (
    <Svg>
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <circle cx="12" cy="15" r="3" />
      <circle cx="12" cy="7" r="1.2" fill="currentColor" stroke="none" />
      <line x1="12" y1="9" x2="12" y2="12" strokeWidth="1.2" />
    </Svg>
  );
}

function EarBudsIcon() {
  return (
    <Svg>
      <circle cx="7.5" cy="9" r="3" />
      <path d="M10.5 9v7a1.5 1.5 0 0 1-3 0" />
      <circle cx="16.5" cy="9" r="3" />
      <path d="M13.5 9v7a1.5 1.5 0 0 0 3 0" />
    </Svg>
  );
}

function PowerBankIcon() {
  return (
    <Svg>
      <rect x="3" y="7" width="16" height="11" rx="2" />
      <path d="M19 10.5h2v4h-2" />
      <path d="M10 10l-2 2.5h4l-2 2.5" />
      <path d="M9 4h6v3H9z" />
    </Svg>
  );
}

function CablesIcon() {
  return (
    <Svg>
      <path d="M8 3v3" />
      <path d="M16 3v3" />
      <path d="M6 6h4v2L8 10v4" />
      <path d="M18 6h-4v2l2 2v4" />
      <path d="M8 18a2 2 0 0 0 4 0v-1" />
      <path d="M16 18a2 2 0 0 1-4 0v-1" />
    </Svg>
  );
}

function AccessoriesIcon() {
  return (
    <Svg>
      <path d="M3 18v-5a9 9 0 0 1 18 0v5" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </Svg>
  );
}

const categories: { slug: string; name: string; icon: ReactNode }[] = [
  { slug: "android",     name: "Android",     icon: <AndroidIcon />     },
  { slug: "iphone",      name: "iPhone",      icon: <IPhoneIcon />      },
  { slug: "charger",     name: "Charger",     icon: <ChargerIcon />     },
  { slug: "speaker",     name: "Speaker",     icon: <SpeakerIcon />     },
  { slug: "earbuds",     name: "Ear Buds",    icon: <EarBudsIcon />     },
  { slug: "powerbank",   name: "Power Bank",  icon: <PowerBankIcon />   },
  { slug: "cables",      name: "Cables",      icon: <CablesIcon />      },
  { slug: "accessories", name: "Accessories", icon: <AccessoriesIcon /> },
];

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
                  <span className="flex h-8 w-8 items-center justify-center text-brand-500 transition-transform duration-300 group-hover:scale-110">
                    {c.icon}
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
