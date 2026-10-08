"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp, Eye, EyeOff,
  Package, AlertTriangle, CheckCircle2, Pencil,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  variant: string;
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

export default function InventoryPage() {
  const [products,    setProducts]    = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [toggling,    setToggling]    = useState<string | null>(null);
  const [editStock,   setEditStock]   = useState<string | null>(null);
  const [stockInput,  setStockInput]  = useState("");


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

  async function saveStock(id: string) {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: Number(stockInput) }),
    });
    setEditStock(null);
    await load();
  }

  const available   = products.filter(p => p.is_available !== false).length;
  const unavailable = products.length - available;
  const hotDeals    = products.filter(p => p.badge === "Hot Deal").length;
  const lowStock    = products.filter(p => p.stock !== undefined && p.stock !== null && p.stock <= 3).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Inventory</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Realtime stock & availability management
          </p>
        </div>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Products", value: products.length, icon: Package,        color: "bg-gray-50    text-gray-700"   },
          { label: "Available",      value: available,       icon: CheckCircle2,   color: "bg-green-50   text-green-700"  },
          { label: "Hidden",         value: unavailable,     icon: EyeOff,         color: "bg-red-50     text-red-700"    },
          { label: "Hot Deals",      value: hotDeals,        icon: TrendingUp,     color: "bg-orange-50  text-orange-700" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`rounded-2xl p-4 ${s.color} border border-white/60 flex items-center gap-3`}>
              <Icon size={22} className="opacity-70" />
              <div>
                <p className="text-2xl font-extrabold">{s.value}</p>
                <p className="text-xs font-semibold mt-0.5 opacity-70">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {lowStock > 0 && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl mb-5">
          <AlertTriangle size={15} />
          <span><strong>{lowStock}</strong> product(s) have low stock (≤3 units). Update stock below.</span>
        </div>
      )}



      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Loading…</div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center">
            <Package size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm">No products yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Available</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Hot Deal</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => {
                const isAvailable = p.is_available !== false;
                const isHot       = p.badge === "Hot Deal";
                const isLowStock  = p.stock !== undefined && p.stock !== null && p.stock <= 3;
                return (
                  <tr key={p.id} className={`hover:bg-gray-50/60 transition-colors ${!isAvailable ? "opacity-50" : ""}`}>

                    {/* Product */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                          <Image src={p.image} alt={p.name} fill className="object-contain p-1" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-gray-400">{p.variant}</p>
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

                    {/* Stock */}
                    <td className="px-4 py-3">
                      {editStock === p.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            value={stockInput}
                            onChange={e => setStockInput(e.target.value)}
                            className="w-16 border border-brand-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                            autoFocus
                          />
                          <button onClick={() => saveStock(p.id)} className="text-green-600 text-xs font-bold px-2 py-1 bg-green-50 rounded-lg hover:bg-green-100">Save</button>
                          <button onClick={() => setEditStock(null)} className="text-gray-400 text-xs px-1">✕</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditStock(p.id); setStockInput(String(p.stock ?? 0)); }}
                          className={`flex items-center gap-1 text-sm font-bold transition-colors ${
                            isLowStock ? "text-red-600" : "text-gray-700"
                          } hover:text-brand-500`}
                        >
                          {isLowStock && <AlertTriangle size={12} className="text-red-500" />}
                          {p.stock !== undefined && p.stock !== null ? `${p.stock} pcs` : "Set stock"}
                        </button>
                      )}
                    </td>

                    {/* Available */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleAvailable(p)}
                        disabled={toggling === p.id}
                        className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full transition-all disabled:opacity-50 ${
                          isAvailable
                            ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600"
                            : "bg-red-100 text-red-600 hover:bg-green-100 hover:text-green-700"
                        }`}
                      >
                        {isAvailable ? <Eye size={11} /> : <EyeOff size={11} />}
                        {isAvailable ? "Visible" : "Hidden"}
                      </button>
                    </td>

                    {/* Hot Deal */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <button
                        onClick={() => toggleHotDeal(p)}
                        disabled={toggling === p.id}
                        className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full transition-all disabled:opacity-50 ${
                          isHot
                            ? "bg-orange-100 text-orange-700 hover:bg-gray-100 hover:text-gray-500"
                            : "bg-gray-100 text-gray-400 hover:bg-orange-100 hover:text-orange-600"
                        }`}
                      >
                        <TrendingUp size={11} />
                        {isHot ? "🔥 Hot" : "Add"}
                      </button>
                    </td>

                    {/* Edit */}
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="p-2 rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand-500 transition-colors inline-flex"
                      >
                        <Pencil size={14} />
                      </Link>
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
