"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  TrendingUp, Eye, EyeOff, Package, AlertTriangle,
  CheckCircle2, Pencil, ChevronDown, ChevronRight,
  Flame, Star, Tag,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  variant?: string;
  price: number;
  original_price?: number;
  image: string;
  category?: string;
  condition?: string;
  badge?: string;
  badge_color?: string;
  is_featured?: boolean;
  is_available?: boolean;
  stock?: number;
  rating?: number;
}

const SECTIONS = [
  {
    key: "iphone",
    label: "iPhone",
    emoji: "🍎",
    gradient: "from-gray-900 to-gray-700",
    subsections: [
      { key: "brand-new", label: "Brand New", emoji: "🆕", color: "bg-blue-50 border-blue-100", badge: "bg-blue-100 text-blue-700" },
      { key: "pre-owned", label: "Pre-Owned",  emoji: "♻️", color: "bg-amber-50 border-amber-100", badge: "bg-amber-100 text-amber-700" },
    ],
    filter: (p: Product, subKey: string) => p.category === "apple" && p.condition === subKey,
  },
  {
    key: "android",
    label: "Android",
    emoji: "🤖",
    gradient: "from-green-800 to-green-600",
    subsections: [
      { key: "samsung",   label: "Samsung",   emoji: "📱", color: "bg-blue-50 border-blue-100",   badge: "bg-blue-100 text-blue-700"   },
      { key: "oneplus",   label: "OnePlus",   emoji: "📱", color: "bg-red-50 border-red-100",     badge: "bg-red-100 text-red-700"     },
      { key: "redmi",     label: "Redmi",     emoji: "📱", color: "bg-orange-50 border-orange-100", badge: "bg-orange-100 text-orange-700" },
      { key: "realme",    label: "Realme",    emoji: "📱", color: "bg-yellow-50 border-yellow-100", badge: "bg-yellow-100 text-yellow-700" },
      { key: "nothing",   label: "Nothing",   emoji: "📱", color: "bg-gray-50 border-gray-200",   badge: "bg-gray-200 text-gray-700"   },
      { key: "motorola",  label: "Motorola",  emoji: "📱", color: "bg-sky-50 border-sky-100",     badge: "bg-sky-100 text-sky-700"     },
      { key: "vivo",      label: "Vivo",      emoji: "📱", color: "bg-indigo-50 border-indigo-100", badge: "bg-indigo-100 text-indigo-700" },
      { key: "honor",     label: "Honor",     emoji: "📱", color: "bg-emerald-50 border-emerald-100", badge: "bg-emerald-100 text-emerald-700" },
      { key: "iqoo",      label: "iQOO",      emoji: "📱", color: "bg-rose-50 border-rose-100",   badge: "bg-rose-100 text-rose-700"   },
    ],
    filter: (p: Product, subKey: string) => p.category === subKey,
  },
  {
    key: "others",
    label: "Others",
    emoji: "🔧",
    gradient: "from-purple-800 to-purple-600",
    subsections: [
      { key: "accessories", label: "Accessories", emoji: "🎧", color: "bg-purple-50 border-purple-100", badge: "bg-purple-100 text-purple-700" },
      { key: "tablets",     label: "Tablets",     emoji: "📟", color: "bg-teal-50 border-teal-100",     badge: "bg-teal-100 text-teal-700"     },
      { key: "laptops",     label: "Laptops",     emoji: "💻", color: "bg-cyan-50 border-cyan-100",     badge: "bg-cyan-100 text-cyan-700"     },
    ],
    filter: (p: Product, subKey: string) => p.category === subKey,
  },
];

export default function InventoryPage() {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [toggling,   setToggling]   = useState<string | null>(null);
  const [editStock,  setEditStock]  = useState<string | null>(null);
  const [stockInput, setStockInput] = useState("");
  const [openSections,    setOpenSections]    = useState<Record<string, boolean>>({ iphone: true, android: true, others: false });
  const [openSubsections, setOpenSubsections] = useState<Record<string, boolean>>({ "brand-new": true, samsung: true });

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/products");
    const d = await r.json();
    setProducts(d.products ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleAvailable(p: Product) {
    setToggling(p.id);
    await fetch(`/api/products/${p.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_available: !p.is_available }),
    });
    await load(); setToggling(null);
  }

  async function toggleHotDeal(p: Product) {
    setToggling(p.id);
    const isHot = p.badge === "Hot Deal";
    await fetch(`/api/products/${p.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ badge: isHot ? "" : "Hot Deal", badge_color: isHot ? "" : "#FB5724" }),
    });
    await load(); setToggling(null);
  }

  async function saveStock(id: string) {
    await fetch(`/api/products/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: Number(stockInput) }),
    });
    setEditStock(null); await load();
  }

  const available   = products.filter(p => p.is_available !== false).length;
  const unavailable = products.length - available;
  const hotDeals    = products.filter(p => p.badge === "Hot Deal").length;
  const lowStock    = products.filter(p => p.stock != null && p.stock <= 3).length;

  // ── Product Card ──────────────────────────────────────────
  function ProductCard({ p }: { p: Product }) {
    const isAvailable = p.is_available !== false;
    const isHot       = p.badge === "Hot Deal";
    const isLow       = p.stock != null && p.stock <= 3;
    const disc        = p.original_price && p.original_price > p.price
      ? Math.round((1 - p.price / p.original_price) * 100) : 0;

    return (
      <div className={`relative bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md ${!isAvailable ? "opacity-55 grayscale" : "border-gray-100"}`}>

        {/* Badges top-left */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {p.badge && (
            <span className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full shadow"
              style={{ backgroundColor: p.badge_color ?? "#FB5724" }}>{p.badge}</span>
          )}
          {disc > 0 && (
            <span className="text-[9px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full">-{disc}%</span>
          )}
        </div>

        {/* Featured star */}
        {p.is_featured && (
          <div className="absolute top-2 right-2 z-10">
            <Star size={13} className="fill-yellow-400 text-yellow-400 drop-shadow" />
          </div>
        )}

        {/* Image */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-32 flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={p.name}
            className="h-full w-full object-contain p-3 transition-transform duration-300 hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = ""; }} />
        </div>

        {/* Body */}
        <div className="p-3 flex flex-col gap-2 flex-1">
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{p.name}</p>
            {p.variant && <p className="text-[11px] text-gray-400 mt-0.5 truncate">{p.variant}</p>}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-gray-900">৳{p.price.toLocaleString("en-BD")}</span>
            {p.original_price && p.original_price > p.price && (
              <span className="text-[11px] text-gray-400 line-through">৳{p.original_price.toLocaleString("en-BD")}</span>
            )}
          </div>

          {/* Rating */}
          {p.rating && p.rating > 0 ? (
            <div className="flex items-center gap-1">
              <Star size={10} className="fill-yellow-400 text-yellow-400" />
              <span className="text-[11px] font-semibold text-gray-600">{p.rating}</span>
            </div>
          ) : null}

          {/* Stock */}
          <div>
            {editStock === p.id ? (
              <div className="flex items-center gap-1">
                <input type="number" min="0" value={stockInput}
                  onChange={e => setStockInput(e.target.value)}
                  className="w-16 border border-brand-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-brand-300"
                  autoFocus />
                <button onClick={() => saveStock(p.id)}
                  className="text-[10px] font-bold text-white bg-green-500 hover:bg-green-600 px-2 py-1 rounded-lg">✓</button>
                <button onClick={() => setEditStock(null)}
                  className="text-[10px] text-gray-400 hover:text-red-400 px-1">✕</button>
              </div>
            ) : (
              <button onClick={() => { setEditStock(p.id); setStockInput(String(p.stock ?? 0)); }}
                className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                  isLow
                    ? "border-red-300 text-red-600 bg-red-50 hover:bg-red-100"
                    : "border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100"
                }`}>
                {isLow && <AlertTriangle size={9} />}
                {p.stock != null ? `📦 ${p.stock} pcs` : "Set stock"}
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 pt-2 flex flex-col gap-1.5 mt-auto">
            {/* Row 1: Live + Hot Deal */}
            <div className="flex gap-1.5">
              <button onClick={() => toggleAvailable(p)} disabled={toggling === p.id}
                className={`flex-1 flex items-center justify-center gap-1 text-[10px] font-bold py-1.5 rounded-lg transition-all disabled:opacity-40 ${
                  isAvailable
                    ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600"
                    : "bg-red-100 text-red-600 hover:bg-green-100 hover:text-green-700"
                }`}>
                {isAvailable ? <><Eye size={10} /> Live</> : <><EyeOff size={10} /> Hidden</>}
              </button>
              <button onClick={() => toggleHotDeal(p)} disabled={toggling === p.id}
                className={`flex-1 flex items-center justify-center gap-1 text-[10px] font-bold py-1.5 rounded-lg transition-all disabled:opacity-40 ${
                  isHot
                    ? "bg-orange-100 text-orange-700 hover:bg-gray-100 hover:text-gray-500"
                    : "bg-gray-100 text-gray-400 hover:bg-orange-100 hover:text-orange-600"
                }`}>
                <Flame size={10} /> {isHot ? "🔥 Hot" : "Hot Deal"}
              </button>
            </div>
            {/* Row 2: Edit */}
            <Link href={`/admin/products/${p.id}/edit`}
              className="flex items-center justify-center gap-1 text-[11px] font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 py-1.5 rounded-lg transition-colors">
              <Pencil size={11} /> Edit Product
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Inventory</h1>
        <p className="text-gray-400 text-sm mt-0.5">Stock & availability management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total",     value: products.length, icon: Package,      bg: "bg-gray-50",   text: "text-gray-700",   iconColor: "text-gray-400"   },
          { label: "Available", value: available,       icon: CheckCircle2, bg: "bg-green-50",  text: "text-green-700",  iconColor: "text-green-400"  },
          { label: "Hidden",    value: unavailable,     icon: EyeOff,       bg: "bg-red-50",    text: "text-red-700",    iconColor: "text-red-400"    },
          { label: "Hot Deals", value: hotDeals,        icon: Flame,        bg: "bg-orange-50", text: "text-orange-700", iconColor: "text-orange-400" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 flex items-center gap-3 border border-white/60`}>
              <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm`}>
                <Icon size={18} className={s.iconColor} />
              </div>
              <div>
                <p className={`text-2xl font-extrabold ${s.text}`}>{s.value}</p>
                <p className="text-[11px] font-semibold text-gray-400">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Low stock warning */}
      {lowStock > 0 && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl mb-5">
          <AlertTriangle size={15} />
          <strong>{lowStock}</strong>&nbsp;product(s) have low stock (≤3 units). Click "Set stock" on the card to update.
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center text-gray-400 text-sm">Loading inventory…</div>
      ) : (
        <div className="space-y-5">
          {SECTIONS.map(section => {
            const sectionOpen = openSections[section.key] !== false;
            const sectionTotal = section.subsections.reduce(
              (acc, sub) => acc + products.filter(p => section.filter(p, sub.key)).length, 0
            );

            return (
              <div key={section.key} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">

                {/* Section header */}
                <button
                  onClick={() => setOpenSections(s => ({ ...s, [section.key]: !sectionOpen }))}
                  className={`w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r ${section.gradient} text-white hover:opacity-95 transition-opacity`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{section.emoji}</span>
                    <div className="text-left">
                      <p className="font-bold text-lg leading-tight">{section.label}</p>
                      <p className="text-white/60 text-xs">{sectionTotal} products</p>
                    </div>
                  </div>
                  {sectionOpen
                    ? <ChevronDown size={20} className="opacity-70" />
                    : <ChevronRight size={20} className="opacity-70" />}
                </button>

                {/* Subsections */}
                {sectionOpen && (
                  <div className="bg-white">
                    {section.subsections.map(sub => {
                      const subProducts = products.filter(p => section.filter(p, sub.key));
                      const subOpen = openSubsections[sub.key] !== false;
                      if (subProducts.length === 0) return null;

                      return (
                        <div key={sub.key} className={`border-b border-gray-50 last:border-0`}>
                          {/* Subsection header */}
                          <button
                            onClick={() => setOpenSubsections(s => ({ ...s, [sub.key]: !subOpen }))}
                            className="w-full flex items-center justify-between px-5 py-3 bg-gray-50/80 hover:bg-gray-100/80 transition-colors">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{sub.emoji}</span>
                              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{sub.label}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sub.badge}`}>
                                {subProducts.length}
                              </span>
                              {/* stats */}
                              <span className="text-[10px] text-gray-400 hidden sm:inline">
                                · {subProducts.filter(p => p.is_available !== false).length} live
                                · {subProducts.filter(p => p.badge === "Hot Deal").length} hot deals
                              </span>
                            </div>
                            {subOpen
                              ? <ChevronDown size={14} className="text-gray-400" />
                              : <ChevronRight size={14} className="text-gray-400" />}
                          </button>

                          {/* Product cards grid */}
                          {subOpen && (
                            <div className="p-4">
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                {subProducts.map(p => <ProductCard key={p.id} p={p} />)}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
