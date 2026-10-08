"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus, Pencil, Trash2, Search, Star, Package,
  Eye, EyeOff, TrendingUp, Loader2,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  variant: string;
  price: number;
  original_price?: number;
  rating: number;
  review_count: number;
  image: string;
  slug: string;
  badge?: string;
  badge_color?: string;
  is_featured?: boolean;
  is_available?: boolean;
  category?: string;
  condition?: string;
  stock?: number;
}

const CATEGORIES = [
  "all", "apple", "samsung", "oneplus", "redmi",
  "realme", "nothing", "motorola", "vivo", "honor", "iqoo",
];

const CAT_LABELS: Record<string, string> = {
  all: "All", apple: "Apple", samsung: "Samsung", oneplus: "OnePlus",
  redmi: "Redmi", realme: "Realme", nothing: "Nothing",
  motorola: "Motorola", vivo: "Vivo", honor: "Honor", iqoo: "iQOO",
};

export default function AdminProductsPage() {
  const [products,    setProducts]    = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [catFilter,   setCatFilter]   = useState("all");
  const [deleting,    setDeleting]    = useState<string | null>(null);
  const [toggling,    setToggling]    = useState<string | null>(null);


  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/products");
    const d = await r.json();
    setProducts(d.products ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    setDeleting(id);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await load();
    setDeleting(null);
  }

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
      body: JSON.stringify({
        badge:       isHot ? "" : "Hot Deal",
        badge_color: isHot ? "" : "#FB5724",
      }),
    });
    await load();
    setToggling(null);
  }

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.variant ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const available   = products.filter(p => p.is_available !== false).length;
  const unavailable = products.length - available;
  const hotDeals    = products.filter(p => p.badge === "Hot Deal").length;

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Products</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {products.length} total · {available} available · {unavailable} unavailable · {hotDeals} hot deals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <Plus size={15} /> Add Product
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total",       value: products.length, color: "bg-gray-50   text-gray-700"   },
          { label: "Available",   value: available,       color: "bg-green-50  text-green-700"  },
          { label: "Unavailable", value: unavailable,     color: "bg-red-50    text-red-700"    },
          { label: "Hot Deals",   value: hotDeals,        color: "bg-orange-50 text-orange-700" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 ${s.color} border border-white/60`}>
            <p className="text-2xl font-extrabold">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5 opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                catFilter === c
                  ? "bg-brand-500 text-white border-brand-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
              }`}
            >
              {CAT_LABELS[c]}
            </button>
          ))}
        </div>
      </div>



      {/* Product Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-gray-400 text-sm">
          <Loader2 size={18} className="animate-spin" /> Loading products…
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <Package size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm">No products found.</p>
          <Link href="/admin/products/new" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-brand-500 hover:underline">
            <Plus size={14} /> Add your first product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((p) => {
            const isAvailable = p.is_available !== false;
            const isHot       = p.badge === "Hot Deal";
            const discount    = p.original_price && p.original_price > p.price
              ? Math.round((1 - p.price / p.original_price) * 100)
              : 0;
            const isActioning = toggling === p.id || deleting === p.id;

            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md ${!isAvailable ? "opacity-60" : ""}`}
              >
                {/* Image */}
                <div className="relative bg-gray-50 h-40 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-contain p-3"
                    onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
                  />

                  {/* Badge */}
                  {p.badge && (
                    <span
                      className="absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: p.badge_color ?? "#FB5724" }}
                    >
                      {p.badge}
                    </span>
                  )}

                  {/* Discount */}
                  {discount > 0 && (
                    <span className="absolute top-2 right-2 text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full">
                      -{discount}%
                    </span>
                  )}

                  {/* Featured star */}
                  {p.is_featured && (
                    <span className="absolute bottom-2 right-2 text-yellow-400 text-sm">⭐</span>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col flex-1 gap-1">
                  <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{p.name}</p>
                  {p.variant && <p className="text-[11px] text-gray-400 line-clamp-1">{p.variant}</p>}

                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs font-semibold capitalize bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                      {p.category || "—"}
                    </span>
                    <span className={`text-[10px] font-semibold ${p.condition === "pre-owned" ? "text-amber-500" : "text-green-600"}`}>
                      {p.condition === "pre-owned" ? "♻️ Pre-Owned" : "🆕 New"}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-1">
                    <span className="text-base font-extrabold text-gray-900">
                      ৳{p.price.toLocaleString("en-BD")}
                    </span>
                    {p.original_price && p.original_price > p.price && (
                      <span className="ml-1.5 text-[11px] text-gray-400 line-through">
                        ৳{p.original_price.toLocaleString("en-BD")}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  {p.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star size={11} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-[11px] font-medium text-gray-600">{p.rating}</span>
                      <span className="text-[10px] text-gray-400">({p.review_count?.toLocaleString()})</span>
                    </div>
                  )}

                  {/* Toggle buttons */}
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    <button
                      onClick={() => toggleAvailable(p)}
                      disabled={isActioning}
                      title={isAvailable ? "Hide from store" : "Show in store"}
                      className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full transition-all disabled:opacity-40 ${
                        isAvailable
                          ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600"
                          : "bg-red-100 text-red-600 hover:bg-green-100 hover:text-green-700"
                      }`}
                    >
                      {isAvailable ? <Eye size={10} /> : <EyeOff size={10} />}
                      {isAvailable ? "Live" : "Hidden"}
                    </button>

                    <button
                      onClick={() => toggleHotDeal(p)}
                      disabled={isActioning}
                      title={isHot ? "Remove Hot Deal" : "Mark as Hot Deal"}
                      className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full transition-all disabled:opacity-40 ${
                        isHot
                          ? "bg-orange-100 text-orange-700 hover:bg-gray-100 hover:text-gray-500"
                          : "bg-gray-100 text-gray-400 hover:bg-orange-100 hover:text-orange-600"
                      }`}
                    >
                      <TrendingUp size={10} />
                      {isHot ? "Hot 🔥" : "Hot Deal"}
                    </button>
                  </div>

                  {/* Edit / Delete */}
                  <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 py-1.5 rounded-lg transition-colors"
                    >
                      <Pencil size={11} /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      disabled={deleting === p.id}
                      className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-red-500 bg-red-50 hover:bg-red-100 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                    >
                      {deleting === p.id
                        ? <Loader2 size={11} className="animate-spin" />
                        : <Trash2 size={11} />
                      }
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
