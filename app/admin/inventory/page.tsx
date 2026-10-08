"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  TrendingUp, Eye, EyeOff, Package, AlertTriangle,
  CheckCircle2, Pencil, ChevronDown, ChevronRight,
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
}

// ── Section structure ─────────────────────────────────────────
const SECTIONS = [
  {
    key: "iphone",
    label: "iPhone",
    emoji: "🍎",
    color: "bg-gray-900 text-white",
    accent: "border-gray-800",
    categories: ["apple"],
    subsections: [
      { key: "brand-new",  label: "Brand New",  emoji: "🆕" },
      { key: "pre-owned",  label: "Pre-Owned",  emoji: "♻️" },
    ],
  },
  {
    key: "android",
    label: "Android",
    emoji: "🤖",
    color: "bg-green-700 text-white",
    accent: "border-green-600",
    categories: ["samsung", "oneplus", "redmi", "realme", "nothing", "motorola", "vivo", "honor", "iqoo"],
    subsections: [
      { key: "samsung",   label: "Samsung",   emoji: "📱" },
      { key: "oneplus",   label: "OnePlus",   emoji: "📱" },
      { key: "redmi",     label: "Redmi",     emoji: "📱" },
      { key: "realme",    label: "Realme",    emoji: "📱" },
      { key: "nothing",   label: "Nothing",   emoji: "📱" },
      { key: "motorola",  label: "Motorola",  emoji: "📱" },
      { key: "vivo",      label: "Vivo",      emoji: "📱" },
      { key: "honor",     label: "Honor",     emoji: "📱" },
      { key: "iqoo",      label: "iQOO",      emoji: "📱" },
    ],
  },
  {
    key: "others",
    label: "Others",
    emoji: "🔧",
    color: "bg-purple-700 text-white",
    accent: "border-purple-600",
    categories: ["accessories", "tablets", "laptops", "others"],
    subsections: [
      { key: "accessories", label: "Accessories", emoji: "🎧" },
      { key: "tablets",     label: "Tablets",     emoji: "📟" },
      { key: "laptops",     label: "Laptops",     emoji: "💻" },
      { key: "others",      label: "Others",      emoji: "📦" },
    ],
  },
];

export default function InventoryPage() {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [toggling,   setToggling]   = useState<string | null>(null);
  const [editStock,  setEditStock]  = useState<string | null>(null);
  const [stockInput, setStockInput] = useState("");

  // open/close state: section & subsection
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
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_available: !p.is_available }),
    });
    await load();
    setToggling(null);
  }

  async function toggleHotDeal(p: Product) {
    setToggling(p.id);
    const isHot = p.badge === "Hot Deal";
    await fetch(`/api/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ badge: isHot ? "" : "Hot Deal", badge_color: isHot ? "" : "#FB5724" }),
    });
    await load();
    setToggling(null);
  }

  async function saveStock(id: string) {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: Number(stockInput) }),
    });
    setEditStock(null);
    await load();
  }

  const toggleSection    = (k: string) => setOpenSections(s    => ({ ...s, [k]: !s[k] }));
  const toggleSubsection = (k: string) => setOpenSubsections(s => ({ ...s, [k]: !s[k] }));

  const available   = products.filter(p => p.is_available !== false).length;
  const unavailable = products.length - available;
  const hotDeals    = products.filter(p => p.badge === "Hot Deal").length;
  const lowStock    = products.filter(p => p.stock != null && p.stock <= 3).length;

  // Get products for a given subsection key + section
  function getProducts(section: typeof SECTIONS[0], subKey: string) {
    if (section.key === "iphone") {
      return products.filter(p =>
        section.categories.includes(p.category ?? "") &&
        p.condition === subKey
      );
    }
    // android: subKey IS the category
    if (section.key === "android") {
      return products.filter(p => p.category === subKey);
    }
    // others
    return products.filter(p => p.category === subKey);
  }

  function ProductRow({ p }: { p: Product }) {
    const isAvailable = p.is_available !== false;
    const isHot       = p.badge === "Hot Deal";
    const isLowStock  = p.stock != null && p.stock <= 3;
    const discount    = p.original_price && p.original_price > p.price
      ? Math.round((1 - p.price / p.original_price) * 100) : 0;

    return (
      <div className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors ${!isAvailable ? "opacity-50" : ""}`}>

        {/* Image + Name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={p.name} className="w-10 h-10 object-contain rounded-lg bg-gray-100 p-1 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{p.name}</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-gray-500">৳{p.price.toLocaleString("en-BD")}</span>
              {discount > 0 && <span className="text-[10px] font-bold text-red-500">-{discount}%</span>}
              {p.is_featured && <span className="text-[10px]">⭐</span>}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">

          {/* Stock */}
          {editStock === p.id ? (
            <div className="flex items-center gap-1">
              <input
                type="number" min="0" value={stockInput}
                onChange={e => setStockInput(e.target.value)}
                className="w-16 border border-brand-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                autoFocus
              />
              <button onClick={() => saveStock(p.id)} className="text-green-600 text-xs font-bold px-2 py-1 bg-green-50 rounded-lg hover:bg-green-100">✓</button>
              <button onClick={() => setEditStock(null)} className="text-gray-400 text-xs px-1 hover:text-red-400">✕</button>
            </div>
          ) : (
            <button
              onClick={() => { setEditStock(p.id); setStockInput(String(p.stock ?? 0)); }}
              className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1 ${
                isLowStock
                  ? "border-red-300 text-red-600 bg-red-50 hover:bg-red-100"
                  : "border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              {isLowStock && <AlertTriangle size={10} />}
              {p.stock != null ? `${p.stock} pcs` : "Set stock"}
            </button>
          )}

          {/* Available toggle */}
          <button
            onClick={() => toggleAvailable(p)}
            disabled={toggling === p.id}
            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition-all disabled:opacity-50 ${
              isAvailable
                ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600"
                : "bg-red-100 text-red-600 hover:bg-green-100 hover:text-green-700"
            }`}
          >
            {isAvailable ? <Eye size={10} /> : <EyeOff size={10} />}
            {isAvailable ? "Live" : "Hidden"}
          </button>

          {/* Hot Deal toggle */}
          <button
            onClick={() => toggleHotDeal(p)}
            disabled={toggling === p.id}
            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition-all disabled:opacity-50 ${
              isHot
                ? "bg-orange-100 text-orange-700 hover:bg-gray-100 hover:text-gray-500"
                : "bg-gray-100 text-gray-400 hover:bg-orange-100 hover:text-orange-600"
            }`}
          >
            <TrendingUp size={10} />
            {isHot ? "🔥 Hot" : "Hot Deal"}
          </button>

          {/* Edit */}
          <Link
            href={`/admin/products/${p.id}/edit`}
            className="p-1.5 rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand-500 transition-colors"
          >
            <Pencil size={13} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-gray-900">Inventory</h1>
        <p className="text-gray-400 text-sm mt-0.5">Stock & availability management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total",     value: products.length, icon: Package,      color: "bg-gray-50   text-gray-700"   },
          { label: "Available", value: available,       icon: CheckCircle2, color: "bg-green-50  text-green-700"  },
          { label: "Hidden",    value: unavailable,     icon: EyeOff,       color: "bg-red-50    text-red-700"    },
          { label: "Hot Deals", value: hotDeals,        icon: TrendingUp,   color: "bg-orange-50 text-orange-700" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`rounded-2xl p-3 sm:p-4 ${s.color} border border-white/60 flex items-center gap-2 sm:gap-3`}>
              <Icon size={20} className="opacity-60 shrink-0" />
              <div>
                <p className="text-xl sm:text-2xl font-extrabold">{s.value}</p>
                <p className="text-[11px] sm:text-xs font-semibold opacity-70">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Low stock warning */}
      {lowStock > 0 && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl mb-5">
          <AlertTriangle size={14} />
          <span><strong>{lowStock}</strong> product(s) have low stock (≤3 units).</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">Loading…</div>
      ) : (
        <div className="space-y-4">
          {SECTIONS.map(section => {
            const sectionOpen = openSections[section.key];
            // total products in this section
            const sectionTotal = section.subsections.reduce((acc, sub) => acc + getProducts(section, sub.key).length, 0);

            return (
              <div key={section.key} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">

                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.key)}
                  className={`w-full flex items-center justify-between px-4 sm:px-5 py-4 ${section.color} transition-opacity hover:opacity-90`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{section.emoji}</span>
                    <span className="font-bold text-base sm:text-lg">{section.label}</span>
                    <span className="text-xs opacity-70 font-semibold bg-white/20 px-2 py-0.5 rounded-full">{sectionTotal} products</span>
                  </div>
                  {sectionOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>

                {/* Subsections */}
                {sectionOpen && (
                  <div className="bg-white divide-y divide-gray-50">
                    {section.subsections.map(sub => {
                      const subProducts = getProducts(section, sub.key);
                      const subOpen     = openSubsections[sub.key] !== false;
                      if (subProducts.length === 0) return null;

                      return (
                        <div key={sub.key}>
                          {/* Subsection Header */}
                          <button
                            onClick={() => toggleSubsection(sub.key)}
                            className="w-full flex items-center justify-between px-4 sm:px-5 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{sub.emoji}</span>
                              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{sub.label}</span>
                              <span className="text-[10px] font-semibold text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-full">{subProducts.length}</span>
                            </div>
                            {subOpen ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                          </button>

                          {/* Product rows */}
                          {subOpen && (
                            <div className="divide-y divide-gray-50">
                              {subProducts.map(p => <ProductRow key={p.id} p={p} />)}
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
