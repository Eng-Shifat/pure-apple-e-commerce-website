"use client";

import { adminFetch } from "@/lib/adminFetch";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search, RefreshCw, Package, ChevronDown,
  Flame, Star, Eye, EyeOff, AlertCircle, CheckCircle,
  Loader2, X, SlidersHorizontal, ArrowUpDown, ArrowUp, ArrowDown,
  Zap, Timer, Tag,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  condition: "brand-new" | "pre-owned";
  price: number;
  original_price?: number;
  badge?: string;
  badge_color?: string;
  stock?: number;
  rating: number;
  review_count: number;
  image: string;
  is_featured: boolean;
  is_hot_deal: boolean;
  is_published: boolean;
  is_today_deal: boolean;
  deal_price?: number;
  deal_ends_at?: string | null;
}

type ToggleKey = "is_featured" | "is_hot_deal" | "is_published" | "is_today_deal";
type SortKey   = "name" | "price" | "stock" | "category";

const BADGE_PRESETS = [
  { label: "Best Seller", color: "#4FAE53" },
  { label: "Hot",         color: "#FB5724" },
  { label: "New",         color: "#7C3AED" },
  { label: "Hot Deal",    color: "#FB5724" },
  { label: "Limited",     color: "#EF4444" },
  { label: "Popular",     color: "#0284C7" },
];

const CATEGORIES = [
  "All","apple","samsung","google","oneplus",
  "redmi","realme","vivo","iqoo","honor","motorola","nothing",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeImg(src: string) {
  if (!src || src.startsWith("file:")) return "/images/Phone/iphone/iPhone 16/iPhone_16.webp";
  return src;
}

function capFirst(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, loading }: { checked: boolean; onChange: () => void; loading?: boolean }) {
  return (
    <button
      onClick={onChange}
      disabled={loading}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 ${
        checked
          ? "bg-gradient-to-r from-orange-500 to-orange-400 focus:ring-orange-400"
          : "bg-gray-200 focus:ring-gray-300"
      }`}
    >
      <span className={`inline-flex h-4 w-4 items-center justify-center transform rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? "translate-x-6" : "translate-x-1"}`}>
        {loading && <Loader2 size={9} className="animate-spin text-orange-400" />}
      </span>
    </button>
  );
}

// ─── Badge Pill ───────────────────────────────────────────────────────────────

function BadgeCell({ badge, badgeColor, onSave }: { badge?: string; badgeColor?: string; onSave: (b: string, c: string) => Promise<void> }) {
  const [open,   setOpen]   = useState(false);
  const [saving, setSaving] = useState(false);

  async function pick(label: string, color: string) {
    setSaving(true);
    await onSave(label, color);
    setSaving(false);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 group"
      >
        {badge ? (
          <span className="inline-flex items-center gap-1 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm" style={{ backgroundColor: badgeColor ?? "#FB5724" }}>
            {badge}
            <ChevronDown size={9} className="opacity-70" />
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-400 border border-dashed border-gray-300 px-2.5 py-1 rounded-full hover:border-orange-300 hover:text-orange-400 transition-colors">
            + Badge
            <ChevronDown size={9} />
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-8 z-30 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 min-w-[170px]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">Select Badge</p>
            {saving ? (
              <div className="py-3 flex justify-center">
                <Loader2 size={16} className="animate-spin text-orange-400" />
              </div>
            ) : (
              <>
                {BADGE_PRESETS.map(p => (
                  <button key={p.label} onClick={() => pick(p.label, p.color)}
                    className="flex items-center gap-2.5 w-full px-2 py-1.5 hover:bg-gray-50 rounded-xl transition-colors">
                    <span className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: p.color }}>{p.label}</span>
                  </button>
                ))}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button onClick={() => pick("", "")}
                    className="w-full text-left text-[11px] text-gray-400 hover:text-red-400 px-2 py-1.5 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-1.5">
                    <X size={11} /> Remove badge
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Inline Edit ──────────────────────────────────────────────────────────────

function InlineEdit({ value, type = "text", onSave, prefix }: {
  value: string | number;
  type?: "text" | "number";
  onSave: (v: string) => Promise<void>;
  prefix?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [val,     setVal]     = useState(String(value));
  const [saving,  setSaving]  = useState(false);

  async function save() {
    if (val === String(value)) { setEditing(false); return; }
    setSaving(true);
    await onSave(val);
    setSaving(false);
    setEditing(false);
  }

  if (!editing) {
    return (
      <button onClick={() => { setVal(String(value)); setEditing(true); }}
        className="group flex items-center gap-1 text-left hover:text-orange-600 transition-colors">
        <span className="font-semibold text-gray-800 text-sm">
          {prefix}{type === "number" && prefix === "৳" ? Number(value).toLocaleString("en-BD") : value}
        </span>
        <span className="opacity-0 group-hover:opacity-100 text-orange-400 transition-opacity">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input autoFocus type={type} value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
        className="w-24 border-2 border-orange-400 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-orange-200 font-semibold"
      />
      {saving
        ? <Loader2 size={13} className="animate-spin text-orange-500 shrink-0" />
        : <>
            <button onClick={save} className="w-6 h-6 rounded-lg bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors shrink-0">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            <button onClick={() => setEditing(false)} className="w-6 h-6 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0">
              <X size={10} />
            </button>
          </>
      }
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const [products,  setProducts]  = useState<Product[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [category,  setCategory]  = useState("All");
  const [toast,     setToast]     = useState<{ msg: string; ok: boolean } | null>(null);
  const [sortKey,   setSortKey]   = useState<SortKey>("category");
  const [sortAsc,   setSortAsc]   = useState(true);
  const [toggling,  setToggling]  = useState<Record<string, boolean>>({});

  // ── Today's Deal state ──
  const [dealModal,    setDealModal]    = useState(false);
  const [dealSearch,   setDealSearch]   = useState("");
  const [dealProduct,  setDealProduct]  = useState<Product | null>(null);
  const [dealPrice,    setDealPrice]    = useState("");
  const [dealEndsAt,   setDealEndsAt]   = useState("");
  const [dealSaving,   setDealSaving]   = useState(false);

  const activeDeal = products.find(p => p.is_today_deal);
  const dealFiltered = products.filter(p =>
    !dealSearch || p.name.toLowerCase().includes(dealSearch.toLowerCase())
  ).slice(0, 8);

  async function saveDeal() {
    if (!dealProduct) return;
    if (!(Number(dealPrice) > 0) || Number(dealPrice) >= dealProduct.price) {
      showToast(`Deal Price অবশ্যই Sale Price (৳${dealProduct.price.toLocaleString("en-BD")})-এর চেয়ে কম হতে হবে`, false);
      return;
    }
    setDealSaving(true);
    try {
      // First clear any existing today's deal
      if (activeDeal && activeDeal.id !== dealProduct.id) {
        await adminFetch(`/api/products/${activeDeal.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_today_deal: false, deal_price: null, deal_ends_at: null }),
        });
      }
      // Set the new deal
      const res = await adminFetch(`/api/products/${dealProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_today_deal: true,
          deal_price:    dealPrice ? Number(dealPrice) : dealProduct.price,
          deal_ends_at:  dealEndsAt || null,
        }),
      });
      if (!res.ok) throw new Error();
      await fetchProducts();
      showToast("Today's Deal saved ✓", true);
      setDealModal(false);
      setDealProduct(null);
      setDealPrice("");
      setDealEndsAt("");
    } catch {
      showToast("Failed to save deal ✗", false);
    } finally {
      setDealSaving(false);
    }
  }

  async function clearDeal(id: string) {
    try {
      await adminFetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_today_deal: false, deal_price: null, deal_ends_at: null }),
      });
      await fetchProducts();
      showToast("Deal cleared ✓", true);
    } catch {
      showToast("Failed to clear deal ✗", false);
    }
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/products");
      const d   = await res.json();
      setProducts(d.products ?? []);
    } catch {
      showToast("Failed to load products", false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2200);
  }

  async function patch(id: string, payload: Record<string, unknown>) {
    try {
      const res = await adminFetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const d = await res.json();
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...d.product } : p));
      showToast("Saved ✓", true);
    } catch {
      showToast("Save failed ✗", false);
    }
  }

  async function toggle(id: string, key: ToggleKey, current: boolean) {
    setToggling(t => ({ ...t, [`${id}-${key}`]: true }));
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [key]: !current } : p));
    await patch(id, { [key]: !current });
    setToggling(t => ({ ...t, [`${id}-${key}`]: false }));
  }

  // ── Filter + Sort ──
  const displayed = products
    .filter(p => {
      const q = search.toLowerCase();
      return (
        (!q || p.name.toLowerCase().includes(q) || p.slug.includes(q)) &&
        (category === "All" || p.category === category)
      );
    })
    .sort((a, b) => {
      let diff = 0;
      if (sortKey === "name")     diff = a.name.localeCompare(b.name);
      if (sortKey === "price")    diff = a.price - b.price;
      if (sortKey === "stock")    diff = (a.stock ?? 0) - (b.stock ?? 0);
      if (sortKey === "category") diff = a.category.localeCompare(b.category);
      return sortAsc ? diff : -diff;
    });

  function handleSort(col: SortKey) {
    if (sortKey === col) setSortAsc(a => !a);
    else { setSortKey(col); setSortAsc(true); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown size={11} className="text-gray-300" />;
    return sortAsc ? <ArrowUp size={11} className="text-orange-500" /> : <ArrowDown size={11} className="text-orange-500" />;
  }

  const stats = {
    total:       products.length,
    published:   products.filter(p => p.is_published).length,
    unpublished: products.filter(p => !p.is_published).length,
    popular:     products.filter(p => p.is_featured).length,
    hotDeals:    products.filter(p => p.is_hot_deal).length,
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold border animate-in fade-in slide-in-from-top-2 duration-300 ${
          toast.ok ? "bg-white border-green-200 text-green-700" : "bg-white border-red-200 text-red-600"
        }`}>
          {toast.ok ? <CheckCircle size={16} className="text-green-500" /> : <AlertCircle size={16} className="text-red-400" />}
          {toast.msg}
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          STICKY HEADER ZONE (never scrolls)
      ══════════════════════════════════════════════════ */}
      <div className="flex-shrink-0 bg-gray-50 px-4 sm:px-6 lg:px-8 pt-6 pb-0">

        {/* Page title + actions */}
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Products</h1>
            <p className="text-sm text-gray-400 mt-0.5">Real-time Supabase data — click to edit inline</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchProducts}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-orange-300 hover:text-orange-500 transition-all shadow-sm">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link href="/admin/products/new"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-bold transition-all shadow-md shadow-orange-200">
              <span className="text-lg leading-none">+</span>
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
          {[
            { label: "Total Products", val: stats.total,       color: "text-gray-900",  bg: "bg-white",         border: "border-gray-100",  icon: "📦" },
            { label: "Published",      val: stats.published,   color: "text-green-600", bg: "bg-green-50",      border: "border-green-100", icon: "✅" },
            { label: "Unpublished",    val: stats.unpublished, color: "text-red-500",   bg: "bg-red-50",        border: "border-red-100",   icon: "🚫" },
            { label: "Popular",        val: stats.popular,     color: "text-orange-500",bg: "bg-orange-50",     border: "border-orange-100",icon: "⭐" },
            { label: "Hot Deals",      val: stats.hotDeals,    color: "text-red-500",   bg: "bg-red-50",        border: "border-red-100",   icon: "🔥" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl border ${s.border} px-4 py-3.5 flex items-center gap-3`}>
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className="text-[11px] text-gray-400 font-medium leading-none mb-1">{s.label}</p>
                <p className={`text-2xl font-extrabold leading-none ${s.color}`}>{s.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Today's Deal panel ── */}
        <div className="mb-5 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <Zap size={16} className="text-orange-500 fill-orange-100" />
            <span className="font-extrabold text-gray-800 text-sm">Today&apos;s Deal</span>
          </div>

          {activeDeal ? (
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={safeImg(activeDeal.image)} alt={activeDeal.name}
                className="w-10 h-10 rounded-xl object-contain bg-white border border-orange-200 p-1" />
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{activeDeal.name}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-[11px] font-bold text-orange-600">
                    Deal: ৳{(activeDeal.deal_price ?? activeDeal.price).toLocaleString("en-BD")}
                  </span>
                  {activeDeal.deal_ends_at && (
                    <span className="flex items-center gap-1 text-[10px] text-gray-500 font-semibold bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                      <Timer size={9} />
                      {new Date(activeDeal.deal_ends_at) > new Date()
                        ? `Ends ${new Date(activeDeal.deal_ends_at).toLocaleString("en-BD", { dateStyle: "short", timeStyle: "short" })}`
                        : "Expired"}
                    </span>
                  )}
                  {!activeDeal.deal_ends_at && (
                    <span className="text-[10px] text-gray-400 font-medium">No expiry set</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto shrink-0">
                <button
                  onClick={() => {
                    setDealProduct(activeDeal);
                    setDealPrice(activeDeal.deal_price && activeDeal.deal_price < activeDeal.price ? String(activeDeal.deal_price) : "");
                    setDealEndsAt(activeDeal.deal_ends_at ? activeDeal.deal_ends_at.slice(0, 16) : "");
                    setDealModal(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-orange-300 text-orange-600 text-xs font-bold hover:bg-orange-50 transition-colors shadow-sm"
                >
                  Change Deal
                </button>
                <button
                  onClick={() => clearDeal(activeDeal.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 transition-colors shadow-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 flex-1">
              <span className="text-sm text-gray-500">No active deal right now.</span>
              <button
                onClick={() => setDealModal(true)}
                className="ml-auto px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors shadow-md shadow-orange-200 active:scale-95 flex items-center gap-1.5"
              >
                <Zap size={13} /> Set Today&apos;s Deal
              </button>
            </div>
          )}
        </div>

        {/* Today's Deal Modal */}
        {dealModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-orange-500" />
                  <h3 className="font-extrabold text-gray-900 text-lg">Set Today&apos;s Deal</h3>
                </div>
                <button onClick={() => { setDealModal(false); setDealProduct(null); setDealPrice(""); setDealEndsAt(""); }}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                  <X size={14} />
                </button>
              </div>

              {/* Step 1 – pick product */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  1. Select Product
                </label>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 mb-2 focus-within:border-orange-400 transition-colors">
                  <Search size={13} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={dealSearch}
                    onChange={e => setDealSearch(e.target.value)}
                    placeholder="Search products…"
                    className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto rounded-xl border border-gray-100 divide-y divide-gray-50">
                  {dealFiltered.map(p => (
                    <button key={p.id}
                      onClick={() => { setDealProduct(p); setDealPrice(p.deal_price && p.deal_price < p.price ? String(p.deal_price) : ""); }}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-orange-50 transition-colors ${dealProduct?.id === p.id ? "bg-orange-50 border-l-2 border-orange-400" : ""}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={safeImg(p.image)} alt={p.name}
                        className="w-9 h-9 rounded-lg object-contain bg-gray-100 p-1 border border-gray-200 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-gray-900 truncate">{p.name}</p>
                        <p className="text-[11px] text-gray-400">৳{p.price.toLocaleString("en-BD")}</p>
                      </div>
                      {dealProduct?.id === p.id && (
                        <CheckCircle size={15} className="text-orange-500 shrink-0" />
                      )}
                    </button>
                  ))}
                  {dealFiltered.length === 0 && (
                    <p className="text-center text-sm text-gray-400 py-4">No products found</p>
                  )}
                </div>
              </div>

              {/* Step 2 – deal price */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  2. Deal Price (৳)
                </label>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-orange-400 transition-colors">
                  <Tag size={13} className="text-gray-400 shrink-0" />
                  <input
                    type="number"
                    value={dealPrice}
                    onChange={e => setDealPrice(e.target.value)}
                    placeholder={dealProduct ? String(dealProduct.price) : "Enter deal price"}
                    className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400 font-semibold"
                  />
                </div>
                {dealProduct && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    Sale Price: ৳{dealProduct.price.toLocaleString("en-BD")} — Deal Price এর চেয়ে কম দিন
                  </p>
                )}
                {dealProduct && dealPrice && Number(dealPrice) >= dealProduct.price && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1">
                    Deal Price Sale Price-এর চেয়ে কম হতে হবে
                  </p>
                )}
                {dealProduct && dealPrice && Number(dealPrice) < dealProduct.price && (
                  <p className="text-[11px] text-green-600 font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle size={10} />
                    {Math.round(((dealProduct.price - Number(dealPrice)) / dealProduct.price) * 100)}% discount off regular price
                  </p>
                )}
              </div>

              {/* Step 3 – expiry (optional) */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  3. Offer Ends At <span className="text-gray-400 font-normal normal-case">(optional — leave blank for no expiry)</span>
                </label>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-orange-400 transition-colors">
                  <Timer size={13} className="text-gray-400 shrink-0" />
                  <input
                    type="datetime-local"
                    value={dealEndsAt}
                    onChange={e => setDealEndsAt(e.target.value)}
                    className="flex-1 text-sm bg-transparent outline-none text-gray-800"
                  />
                  {dealEndsAt && (
                    <button onClick={() => setDealEndsAt("")} className="text-gray-300 hover:text-gray-500 transition-colors">
                      <X size={13} />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  When the timer expires, the deal price is removed and the product returns to its regular price.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => { setDealModal(false); setDealProduct(null); setDealPrice(""); setDealEndsAt(""); }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveDeal}
                  disabled={!dealProduct || !dealPrice || !(dealProduct && Number(dealPrice) < dealProduct.price) || dealSaving}
                  className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors shadow-md shadow-orange-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  {dealSaving ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                  {dealSaving ? "Saving…" : "Activate Deal"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all shadow-sm">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent" />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500 transition-colors">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 shadow-sm">
            <SlidersHorizontal size={13} className="text-gray-400" />
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="text-sm text-gray-700 bg-transparent outline-none cursor-pointer capitalize">
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c === "All" ? "All Categories" : capFirst(c)}</option>
              ))}
            </select>
          </div>

          <span className="text-xs text-gray-400 font-medium ml-auto">
            {displayed.length} / {products.length} products
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mb-0 pb-3 border-b border-gray-200">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Star size={12} className="text-orange-500 fill-orange-500" /> Popular = Homepage popular section
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Flame size={12} className="text-red-500 fill-red-100" /> Hot Deal = Homepage deals section
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Eye size={12} className="text-green-600" /> Published = visible in shop
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 italic">
            ✏️ Click price / stock / badge to edit inline
          </div>
        </div>

        {/* ── Sticky Table Header Row ── */}
        <div className="bg-white border-x border-t border-gray-200 rounded-t-2xl mt-4">
          <div className="grid items-center text-[11px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3 border-b-2 border-gray-100"
            style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 90px 90px 90px 70px" }}>
            <button onClick={() => handleSort("name")} className="flex items-center gap-1.5 hover:text-gray-700 transition-colors text-left">
              <span>Product</span> <SortIcon col="name" />
            </button>
            <span>Badge</span>
            <button onClick={() => handleSort("price")} className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
              <span>Price</span> <SortIcon col="price" />
            </button>
            <button onClick={() => handleSort("stock")} className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
              <span>Stock</span> <SortIcon col="stock" />
            </button>
            <div className="flex flex-col items-center gap-0.5">
              <Star size={11} className="text-orange-400 fill-orange-400" />
              <span>Popular</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Flame size={11} className="text-red-400" />
              <span>Hot Deal</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Eye size={11} className="text-green-500" />
              <span>Published</span>
            </div>
            <span className="text-center">Actions</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SCROLLABLE TABLE BODY
      ══════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white border-x border-b border-gray-200 rounded-b-2xl overflow-hidden">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
              <Loader2 size={28} className="animate-spin text-orange-400" />
              <p className="text-sm font-medium">Loading from Supabase…</p>
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Package size={36} className="mb-3 text-gray-200" />
              <p className="text-sm font-semibold">No products found</p>
              <p className="text-xs mt-1 text-gray-300">Try adjusting the search or filter</p>
            </div>
          ) : (
            displayed.map((p, idx) => {
              const isOdd = idx % 2 !== 0;
              return (
                <div key={p.id}
                  className={`grid items-center px-4 py-3 border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 ${
                    isOdd ? "bg-gray-50/40" : "bg-white"
                  } ${!p.is_published ? "opacity-50" : ""}`}
                  style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 90px 90px 90px 70px" }}>

                  {/* Product */}
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-11 h-11 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={safeImg(p.image)}
                        alt={p.name}
                        className="w-full h-full object-contain p-1"
                        onError={e => { (e.target as HTMLImageElement).src = "/images/Phone/iphone/iPhone 16/iPhone_16.webp"; }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate leading-tight" title={p.name}>{p.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[10px] font-semibold text-gray-400 capitalize">{p.category}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className={`text-[10px] font-semibold ${p.condition === "brand-new" ? "text-blue-500" : "text-green-600"}`}>
                          {p.condition === "brand-new" ? "Brand New" : "Pre-Owned"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  <div>
                    <BadgeCell
                      badge={p.badge}
                      badgeColor={p.badge_color}
                      onSave={(badge, badge_color) => patch(p.id, { badge: badge || null, badge_color: badge_color || null })}
                    />
                  </div>

                  {/* Price — read-only; change via Edit page */}
                  <div>
                    <span className="font-semibold text-gray-800 text-sm">
                      ৳{p.price.toLocaleString("en-BD")}
                    </span>
                    {p.original_price ? (
                      <p className="text-[10px] text-gray-400 line-through mt-0.5">৳{p.original_price.toLocaleString("en-BD")}</p>
                    ) : null}
                  </div>

                  {/* Stock */}
                  <div>
                    <InlineEdit
                      value={p.stock ?? 0}
                      type="number"
                      onSave={v => patch(p.id, { stock: Number(v) })}
                    />
                    {(p.stock ?? 0) === 0 ? (
                      <span className="inline-block mt-0.5 text-[9px] font-bold text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-full">
                        Out of stock
                      </span>
                    ) : (
                      <span className="inline-block mt-0.5 text-[9px] font-semibold text-green-600 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-full">
                        In stock
                      </span>
                    )}
                  </div>

                  {/* Popular */}
                  <div className="flex justify-center">
                    <Toggle
                      checked={p.is_featured}
                      loading={toggling[`${p.id}-is_featured`]}
                      onChange={() => toggle(p.id, "is_featured", p.is_featured)}
                    />
                  </div>

                  {/* Hot Deal */}
                  <div className="flex justify-center">
                    <Toggle
                      checked={p.is_hot_deal}
                      loading={toggling[`${p.id}-is_hot_deal`]}
                      onChange={() => toggle(p.id, "is_hot_deal", p.is_hot_deal)}
                    />
                  </div>

                  {/* Published */}
                  <div className="flex flex-col items-center gap-1">
                    <Toggle
                      checked={p.is_published}
                      loading={toggling[`${p.id}-is_published`]}
                      onChange={() => toggle(p.id, "is_published", p.is_published)}
                    />
                    {!p.is_published && (
                      <span className="flex items-center gap-0.5 text-[9px] text-gray-400">
                        <EyeOff size={9} /> Hidden
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center">
                    <Link href={`/admin/products/${p.id}/edit`}
                      className="text-xs font-bold text-orange-500 hover:text-orange-700 hover:underline underline-offset-2 transition-colors whitespace-nowrap">
                      Edit →
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
