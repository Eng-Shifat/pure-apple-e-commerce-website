"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus, Pencil, Trash2, Search, Star, Package,
  Eye, EyeOff, TrendingUp, RefreshCw,
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
  const [products,  setProducts]  = useState<Product[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [toggling,  setToggling]  = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/products");
    const d = await r.json();
    setProducts(d.products ?? []);
    setLastRefresh(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    // Realtime polling every 10 seconds
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
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
          <button
            onClick={load}
            title="Refresh"
            className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-brand-500 hover:bg-brand-50 transition-colors"
          >
            <RefreshCw size={15} />
          </button>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <Plus size={15} /> Add Product
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total",       value: products.length,  color: "bg-gray-50  text-gray-700"  },
          { label: "Available",   value: available,        color: "bg-green-50 text-green-700" },
          { label: "Unavailable", value: unavailable,      color: "bg-red-50   text-red-700"   },
          { label: "Hot Deals",   value: hotDeals,         color: "bg-orange-50 text-orange-700"},
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 ${s.color} border border-white/60`}>
            <p className="text-2xl font-extrabold">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5 opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Category filter */}
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

      {/* Last refresh */}
      <p className="text-[11px] text-gray-400 mb-3">
        Last updated: {lastRefresh.toLocaleTimeString("en-BD")} · Auto-refreshes every 10s
      </p>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Package size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm">No products found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Rating</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden xl:table-cell">Hot Deal</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => {
                const isAvailable = p.is_available !== false;
                const isHot = p.badge === "Hot Deal";
                return (
                  <tr key={p.id} className={`hover:bg-gray-50/60 transition-colors ${!isAvailable ? "opacity-50" : ""}`}>

                    {/* Product */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                          <Image src={p.image} alt={p.name} fill className="object-contain p-1" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 leading-tight line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-gray-400">{p.variant}</p>
                          {p.badge && (
                            <span
                              className="inline-block text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full mt-0.5"
                              style={{ backgroundColor: p.badge_color ?? "#FB5724" }}
                            >
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs font-semibold capitalize bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {p.category || "—"}
                      </span>
                      <span className={`block text-[10px] mt-0.5 ${p.condition === "pre-owned" ? "text-amber-600" : "text-green-600"}`}>
                        {p.condition === "pre-owned" ? "♻️ Pre-Owned" : "🆕 Brand New"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <span className="font-bold text-gray-900">৳{p.price.toLocaleString("en-BD")}</span>
                      {p.original_price && (
                        <span className="block text-[11px] text-gray-400 line-through">৳{p.original_price.toLocaleString("en-BD")}</span>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-700 font-medium">{p.rating}</span>
                        <span className="text-gray-400 text-[11px]">({p.review_count?.toLocaleString()})</span>
                      </div>
                    </td>

                    {/* Available toggle */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <button
                        onClick={() => toggleAvailable(p)}
                        disabled={toggling === p.id}
                        title={isAvailable ? "Click to hide" : "Click to show"}
                        className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full transition-all disabled:opacity-50 ${
                          isAvailable
                            ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600"
                            : "bg-red-100 text-red-600 hover:bg-green-100 hover:text-green-700"
                        }`}
                      >
                        {isAvailable ? <Eye size={11} /> : <EyeOff size={11} />}
                        {isAvailable ? "Available" : "Hidden"}
                      </button>
                    </td>

                    {/* Hot Deal toggle */}
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <button
                        onClick={() => toggleHotDeal(p)}
                        disabled={toggling === p.id}
                        title={isHot ? "Remove from Hot Deals" : "Add to Hot Deals"}
                        className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full transition-all disabled:opacity-50 ${
                          isHot
                            ? "bg-orange-100 text-orange-700 hover:bg-gray-100 hover:text-gray-500"
                            : "bg-gray-100 text-gray-400 hover:bg-orange-100 hover:text-orange-600"
                        }`}
                      >
                        <TrendingUp size={11} />
                        {isHot ? "Hot 🔥" : "Add"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-2 rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand-500 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deleting === p.id}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
