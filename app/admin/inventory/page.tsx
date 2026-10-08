"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye, EyeOff, Package, AlertTriangle,
  CheckCircle2, Pencil, ChevronDown, ChevronRight,
  Flame, Star, Plus, Search, RefreshCw, X,
  BarChart3, Layers, Wifi,
} from "lucide-react";
import { useRealtimeProducts, type Product } from "@/hooks/useRealtimeProducts";

const SECTIONS = [
  {
    key: "iphone",
    label: "iPhone",
    emoji: "🍎",
    gradient: "from-slate-900 via-slate-800 to-gray-700",
    accentColor: "text-blue-300",
    subsections: [
      { key: "brand-new", label: "Brand New", emoji: "✨", color: "bg-blue-50 border-blue-100", badge: "bg-blue-100 text-blue-700", dot: "bg-blue-400" },
      { key: "pre-owned", label: "Pre-Owned", emoji: "♻️", color: "bg-amber-50 border-amber-100", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
    ],
    filter: (p: Product, subKey: string) => p.category === "apple" && p.condition === subKey,
  },
  {
    key: "android",
    label: "Android",
    emoji: "🤖",
    gradient: "from-emerald-900 via-green-800 to-teal-700",
    accentColor: "text-green-300",
    subsections: [
      { key: "samsung",  label: "Samsung",  emoji: "📱", color: "bg-blue-50 border-blue-100",     badge: "bg-blue-100 text-blue-700",     dot: "bg-blue-400"    },
      { key: "oneplus",  label: "OnePlus",  emoji: "📱", color: "bg-red-50 border-red-100",       badge: "bg-red-100 text-red-700",       dot: "bg-red-400"     },
      { key: "redmi",    label: "Redmi",    emoji: "📱", color: "bg-orange-50 border-orange-100", badge: "bg-orange-100 text-orange-700", dot: "bg-orange-400"  },
      { key: "realme",   label: "Realme",   emoji: "📱", color: "bg-yellow-50 border-yellow-100", badge: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-400"  },
      { key: "nothing",  label: "Nothing",  emoji: "📱", color: "bg-gray-50 border-gray-200",     badge: "bg-gray-200 text-gray-700",     dot: "bg-gray-400"    },
      { key: "motorola", label: "Motorola", emoji: "📱", color: "bg-sky-50 border-sky-100",       badge: "bg-sky-100 text-sky-700",       dot: "bg-sky-400"     },
      { key: "vivo",     label: "Vivo",     emoji: "📱", color: "bg-indigo-50 border-indigo-100", badge: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-400"  },
      { key: "honor",    label: "Honor",    emoji: "📱", color: "bg-emerald-50 border-emerald-100", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
      { key: "iqoo",     label: "iQOO",     emoji: "📱", color: "bg-rose-50 border-rose-100",     badge: "bg-rose-100 text-rose-700",     dot: "bg-rose-400"    },
    ],
    filter: (p: Product, subKey: string) => p.category === subKey,
  },
  {
    key: "others",
    label: "Others",
    emoji: "🔧",
    gradient: "from-violet-900 via-purple-800 to-fuchsia-700",
    accentColor: "text-purple-300",
    subsections: [
      { key: "accessories", label: "Accessories", emoji: "🎧", color: "bg-purple-50 border-purple-100", badge: "bg-purple-100 text-purple-700", dot: "bg-purple-400" },
      { key: "tablets",     label: "Tablets",     emoji: "📟", color: "bg-teal-50 border-teal-100",     badge: "bg-teal-100 text-teal-700",     dot: "bg-teal-400"   },
      { key: "laptops",     label: "Laptops",     emoji: "💻", color: "bg-cyan-50 border-cyan-100",     badge: "bg-cyan-100 text-cyan-700",     dot: "bg-cyan-400"   },
    ],
    filter: (p: Product, subKey: string) => p.category === subKey,
  },
];

export default function InventoryPage() {
  const { products, loading, syncing, refresh } = useRealtimeProducts();

  const [toggling,        setToggling]        = useState<string | null>(null);
  const [editStock,       setEditStock]       = useState<string | null>(null);
  const [stockInput,      setStockInput]      = useState("");
  const [search,          setSearch]          = useState("");
  const [filterAvailable, setFilterAvailable] = useState<"all" | "live" | "hidden">("all");
  const [openSections,    setOpenSections]    = useState<Record<string, boolean>>({ iphone: true, android: true, others: false });
  const [openSubsections, setOpenSubsections] = useState<Record<string, boolean>>({ "brand-new": true, samsung: true });

  async function toggleAvailable(p: Product) {
    setToggling(p.id);
    await fetch(`/api/products/${p.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_available: !p.is_available }),
    });
    // Realtime will update automatically — no manual refresh needed.
    // But if realtime is slow, refresh() as fallback:
    setToggling(null);
  }

  async function toggleHotDeal(p: Product) {
    setToggling(p.id);
    const isHot = p.badge === "Hot Deal";
    await fetch(`/api/products/${p.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ badge: isHot ? "" : "Hot Deal", badge_color: isHot ? "" : "#FB5724" }),
    });
    setToggling(null);
  }

  async function saveStock(id: string) {
    await fetch(`/api/products/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: Number(stockInput) }),
    });
    setEditStock(null);
  }

  const available   = products.filter(p => p.is_available !== false).length;
  const unavailable = products.length - available;
  const hotDeals    = products.filter(p => p.badge === "Hot Deal").length;
  const lowStock    = products.filter(p => p.stock != null && p.stock <= 3).length;

  function filterProducts(list: Product[]) {
    let result = list;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.variant?.toLowerCase().includes(q));
    }
    if (filterAvailable === "live")   result = result.filter(p => p.is_available !== false);
    if (filterAvailable === "hidden") result = result.filter(p => p.is_available === false);
    return result;
  }

  // ── Product Card ──────────────────────────────────────────────────────────
  function ProductCard({ p }: { p: Product }) {
    const isAvailable = p.is_available !== false;
    const isHot       = p.badge === "Hot Deal";
    const isLow       = p.stock != null && p.stock <= 3;
    const disc        = p.original_price && p.original_price > p.price
      ? Math.round((1 - p.price / p.original_price) * 100) : 0;

    return (
      <div className={`
        relative bg-white rounded-2xl border overflow-hidden flex flex-col
        transition-all duration-200
        ${!isAvailable
          ? "opacity-50 grayscale border-gray-100"
          : "border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
        }
      `}>
        {/* Top badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {p.badge && (
            <span className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full shadow-sm"
              style={{ backgroundColor: p.badge_color ?? "#FB5724" }}>{p.badge}</span>
          )}
          {disc > 0 && (
            <span className="text-[9px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full">-{disc}%</span>
          )}
        </div>

        {/* Featured star */}
        {p.is_featured && (
          <div className="absolute top-2 right-2 z-10">
            <Star size={12} className="fill-yellow-400 text-yellow-400 drop-shadow" />
          </div>
        )}

        {/* Availability dot */}
        <div className={`absolute top-2 right-2 z-10 ${p.is_featured ? "top-7" : ""}`}>
          <div className={`w-2 h-2 rounded-full ${isAvailable ? "bg-green-400" : "bg-red-400"} ring-2 ring-white`} />
        </div>

        {/* Image */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-28 sm:h-32 flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={p.name}
            className="h-full w-full object-contain p-3 transition-transform duration-300 hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }} />
        </div>

        {/* Body */}
        <div className="p-3 flex flex-col gap-2 flex-1">
          <div>
            <p className="font-bold text-gray-900 text-xs sm:text-sm leading-tight line-clamp-2">{p.name}</p>
            {p.variant && <p className="text-[10px] text-gray-400 mt-0.5 truncate">{p.variant}</p>}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-extrabold text-gray-900">৳{p.price.toLocaleString("en-BD")}</span>
            {p.original_price && p.original_price > p.price && (
              <span className="text-[10px] text-gray-400 line-through">৳{p.original_price.toLocaleString("en-BD")}</span>
            )}
          </div>

          {/* Rating */}
          {p.rating && p.rating > 0 ? (
            <div className="flex items-center gap-1">
              <Star size={9} className="fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] font-semibold text-gray-500">{p.rating}</span>
            </div>
          ) : null}

          {/* Stock */}
          <div>
            {editStock === p.id ? (
              <div className="flex items-center gap-1">
                <input type="number" min="0" value={stockInput}
                  onChange={e => setStockInput(e.target.value)}
                  className="w-14 border border-brand-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-brand-300"
                  autoFocus onKeyDown={e => { if (e.key === "Enter") saveStock(p.id); if (e.key === "Escape") setEditStock(null); }} />
                <button onClick={() => saveStock(p.id)}
                  className="text-[10px] font-bold text-white bg-green-500 hover:bg-green-600 px-2 py-1 rounded-lg">✓</button>
                <button onClick={() => setEditStock(null)}
                  className="text-[10px] text-gray-400 hover:text-red-400"><X size={10} /></button>
              </div>
            ) : (
              <button onClick={() => { setEditStock(p.id); setStockInput(String(p.stock ?? 0)); }}
                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border transition-colors ${
                  isLow
                    ? "border-red-200 text-red-600 bg-red-50 hover:bg-red-100"
                    : p.stock != null
                      ? "border-green-200 text-green-700 bg-green-50 hover:bg-green-100"
                      : "border-gray-200 text-gray-500 bg-gray-50 hover:bg-gray-100"
                }`}>
                {isLow && <AlertTriangle size={8} />}
                <Package size={8} />
                {p.stock != null ? `${p.stock} pcs` : "Set stock"}
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-gray-50 pt-2 flex flex-col gap-1.5 mt-auto">
            <div className="flex gap-1.5">
              <button onClick={() => toggleAvailable(p)} disabled={toggling === p.id}
                className={`flex-1 flex items-center justify-center gap-1 text-[10px] font-bold py-1.5 rounded-xl transition-all disabled:opacity-40 ${
                  isAvailable
                    ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600"
                    : "bg-red-100 text-red-600 hover:bg-green-100 hover:text-green-700"
                }`}>
                {isAvailable ? <><Eye size={9} /> Live</> : <><EyeOff size={9} /> Hidden</>}
              </button>
              <button onClick={() => toggleHotDeal(p)} disabled={toggling === p.id}
                className={`flex-1 flex items-center justify-center gap-1 text-[10px] font-bold py-1.5 rounded-xl transition-all disabled:opacity-40 ${
                  isHot
                    ? "bg-orange-100 text-orange-700 hover:bg-gray-100 hover:text-gray-500"
                    : "bg-gray-100 text-gray-400 hover:bg-orange-100 hover:text-orange-600"
                }`}>
                <Flame size={9} /> {isHot ? "Hot 🔥" : "Hot Deal"}
              </button>
            </div>
            <Link href={`/admin/products/${p.id}/edit`}
              className="flex items-center justify-center gap-1 text-[10px] font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 py-1.5 rounded-xl transition-colors">
              <Pencil size={9} /> Edit Product
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ── Page Header ── */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-sm">
              <BarChart3 size={15} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-gray-900 leading-tight">Inventory</h1>
              <p className="text-[10px] text-gray-400 hidden sm:block">Stock & availability management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Realtime indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-green-50 border border-green-100 rounded-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-bold text-green-600">Live</span>
            </div>
            <button onClick={refresh} disabled={syncing}
              className={`w-8 h-8 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all ${syncing ? "animate-spin text-brand-500" : ""}`}>
              <RefreshCw size={14} />
            </button>
            <Link href="/admin/products/new"
              className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition-all active:scale-95">
              <Plus size={13} />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4">

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total Products", value: products.length, icon: Layers,       from: "from-slate-500",  to: "to-slate-600",   bg: "bg-slate-50",   text: "text-slate-700",  sub: "text-slate-400"  },
            { label: "Live",           value: available,       icon: CheckCircle2, from: "from-green-500",  to: "to-emerald-600", bg: "bg-green-50",   text: "text-green-700",  sub: "text-green-400"  },
            { label: "Hidden",         value: unavailable,     icon: EyeOff,       from: "from-red-400",    to: "to-red-600",     bg: "bg-red-50",     text: "text-red-700",    sub: "text-red-400"    },
            { label: "Hot Deals",      value: hotDeals,        icon: Flame,        from: "from-orange-400", to: "to-brand-500",   bg: "bg-orange-50",  text: "text-orange-700", sub: "text-orange-400" },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`${s.bg} rounded-2xl p-3 sm:p-4 flex items-center gap-3 border border-white shadow-sm`}>
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${s.from} ${s.to} flex items-center justify-center shadow-sm shrink-0`}>
                  <Icon size={16} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className={`text-xl sm:text-2xl font-extrabold ${s.text} leading-tight`}>{s.value}</p>
                  <p className={`text-[10px] font-semibold ${s.sub} truncate`}>{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Low Stock Warning ── */}
        {lowStock > 0 && (
          <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-sm">
            <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={14} className="text-amber-600" />
            </div>
            <span><strong>{lowStock}</strong> product{lowStock > 1 ? "s" : ""} are low in stock (≤3 units). Tap a card's stock badge to update.</span>
          </div>
        )}

        {/* ── Search & Filter Bar ── */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={13} />
              </button>
            )}
          </div>
          <div className="flex gap-1.5">
            {(["all", "live", "hidden"] as const).map(f => (
              <button key={f} onClick={() => setFilterAvailable(f)}
                className={`flex-1 sm:flex-none px-3 py-2.5 rounded-xl text-xs font-bold capitalize border transition-all ${
                  filterAvailable === f
                    ? "bg-brand-500 text-white border-brand-500 shadow-sm"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                }`}>
                {f === "all" ? "All" : f === "live" ? "🟢 Live" : "🔴 Hidden"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-gray-400">
            <div className="w-8 h-8 border-[3px] border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Loading inventory…</p>
          </div>
        ) : (
          <div className="space-y-4">
            {SECTIONS.map(section => {
              const sectionOpen = openSections[section.key] !== false;
              const sectionProducts = filterProducts(
                section.subsections.flatMap(sub => products.filter(p => section.filter(p, sub.key)))
              );
              const sectionTotal = sectionProducts.length;

              return (
                <div key={section.key} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">

                  {/* Section header */}
                  <button
                    onClick={() => setOpenSections(s => ({ ...s, [section.key]: !sectionOpen }))}
                    className={`w-full flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 bg-gradient-to-r ${section.gradient} hover:opacity-95 transition-opacity`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl sm:text-2xl">{section.emoji}</span>
                      <div className="text-left">
                        <p className="font-bold text-base sm:text-lg text-white leading-tight">{section.label}</p>
                        <p className={`text-xs ${section.accentColor} hidden sm:block`}>{sectionTotal} products</p>
                      </div>
                      <span className="ml-1 text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full sm:hidden">{sectionTotal}</span>
                    </div>
                    <div className={`w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-white/70 transition-transform duration-200 ${sectionOpen ? "rotate-0" : "-rotate-90"}`}>
                      <ChevronDown size={16} />
                    </div>
                  </button>

                  {/* Subsections */}
                  {sectionOpen && (
                    <div className="divide-y divide-gray-50">
                      {section.subsections.map(sub => {
                        const rawProducts = products.filter(p => section.filter(p, sub.key));
                        const subProducts = filterProducts(rawProducts);
                        const subOpen     = openSubsections[sub.key] !== false;
                        if (rawProducts.length === 0) return null;

                        return (
                          <div key={sub.key}>
                            {/* Subsection header */}
                            <button
                              onClick={() => setOpenSubsections(s => ({ ...s, [sub.key]: !subOpen }))}
                              className="w-full flex items-center justify-between px-4 sm:px-5 py-2.5 bg-gray-50/70 hover:bg-gray-100/70 transition-colors">
                              <div className="flex items-center gap-2 flex-wrap">
                                <div className={`w-2 h-2 rounded-full ${sub.dot}`} />
                                <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">{sub.label}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sub.badge}`}>
                                  {subProducts.length}{rawProducts.length !== subProducts.length ? `/${rawProducts.length}` : ""}
                                </span>
                                <span className="text-[10px] text-gray-400 hidden sm:inline">
                                  · {subProducts.filter(p => p.is_available !== false).length} live
                                  · {subProducts.filter(p => p.badge === "Hot Deal").length} hot
                                </span>
                              </div>
                              <ChevronRight size={13} className={`text-gray-400 transition-transform duration-200 ${subOpen ? "rotate-90" : ""}`} />
                            </button>

                            {/* Product grid */}
                            {subOpen && (
                              <div className="p-3 sm:p-4">
                                {subProducts.length === 0 ? (
                                  <div className="py-8 text-center text-xs text-gray-400">
                                    No products match your filters
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                                    {subProducts.map(p => <ProductCard key={p.id} p={p} />)}
                                  </div>
                                )}
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

            {/* Empty state */}
            {search && SECTIONS.every(section =>
              section.subsections.every(sub => filterProducts(products.filter(p => section.filter(p, sub.key))).length === 0)
            ) && (
              <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
                <Search size={32} className="text-gray-300" />
                <p className="font-semibold text-sm">No products found for "{search}"</p>
                <button onClick={() => setSearch("")} className="text-xs text-brand-500 hover:underline">Clear search</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
