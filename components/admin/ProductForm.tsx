"use client";

import { adminFetch } from "@/lib/adminFetch";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, Loader2, CheckCircle, X, Plus, Trash2 } from "lucide-react";

interface ProductFormProps {
  initialData?: {
    id?: string;
    name?: string;
    variant?: string;
    price?: number;
    original_price?: number;
    battery_health?: number | null;
    rating?: number;
    review_count?: number;
    image?: string;
    slug?: string;
    badge?: string;
    badge_color?: string;
    spec_screen?: string;
    spec_ram?: string;
    spec_camera?: string;
    is_featured?: boolean;
    category?: string;
    condition?: string;
    stock?: number;
    product_code?: string;
    colors?: string;
    storage_variants?: string;
    storage_prices?: string;
    region_prices?: string;
    regions?: string;
    emi_available?: boolean;
    whatsapp_number?: string;
  };
  mode?: "create" | "edit";
}

const BADGE_PRESETS = [
  { label: "Best Seller", color: "#4FAE53" },
  { label: "Hot Deal",    color: "#FB5724" },
  { label: "New",         color: "#7C3AED" },
  { label: "Limited",     color: "#EF4444" },
];

const CATEGORIES = [
  { label: "Apple",    value: "apple"    },
  { label: "Samsung",  value: "samsung"  },
  { label: "OnePlus",  value: "oneplus"  },
  { label: "Redmi",    value: "redmi"    },
  { label: "Realme",   value: "realme"   },
  { label: "Nothing",  value: "nothing"  },
  { label: "Motorola", value: "motorola" },
  { label: "Vivo",     value: "vivo"     },
  { label: "Honor",    value: "honor"    },
  { label: "iQOO",     value: "iqoo"     },
];

const COLOR_PRESETS = ["Black","White","Silver","Gold","Burgundy","Glacier","Desert Titanium","Natural Titanium","Blue Titanium","Purple","Pink","Green","Yellow","Red","Midnight","Starlight"];
const STORAGE_PRESETS = ["64GB","128GB","256GB","512GB","1TB","2TB"];

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}
function isAbsoluteUrl(value: string): boolean {
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; }
}
function safeImageSrc(value: string): string | null {
  if (!value) return null;
  if (value.startsWith("/")) return value;
  if (isAbsoluteUrl(value)) return value;
  return null;
}

// Parse JSON array string safely
function parseArr(val: string | undefined): string[] {
  if (!val) return [];
  try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; }
}

export default function ProductForm({ initialData = {}, mode = "create" }: ProductFormProps) {
  const router = useRouter();
  const [saving,    setSaving]    = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageSize, setImageSize] = useState<number | null>(null);
  const [imageSizeError, setImageSizeError] = useState("");
  const [localPreview, setLocalPreview] = useState<string>("");

  // Color & Storage as arrays (UI state)
  const [colors,           setColors]           = useState<string[]>(parseArr(initialData.colors));
  const [storageVariants,  setStorageVariants]  = useState<string[]>(parseArr(initialData.storage_variants));
  const [colorInput,       setColorInput]       = useState("");
  const [storageInput,     setStorageInput]     = useState("");

  // Storage Prices: { "256GB": 174999, "512GB": 194999 }
  const [storagePrices, setStoragePrices] = useState<Record<string, string>>(() => {
    if (!initialData.storage_prices) return {};
    try { const p = JSON.parse(initialData.storage_prices); return Object.fromEntries(Object.entries(p).map(([k, v]) => [k, String(v)])); }
    catch { return {}; }
  });

  // Region list + prices: { "HK": 0, "JP": -2000 }
  const [regionList,   setRegionList]   = useState<string[]>(
    initialData.regions ? initialData.regions.split(",").map((r) => r.trim()).filter(Boolean) : []
  );
  const [regionPrices, setRegionPrices] = useState<Record<string, string>>(() => {
    if (!initialData.region_prices) return {};
    try { const p = JSON.parse(initialData.region_prices); return Object.fromEntries(Object.entries(p).map(([k, v]) => [k, String(v)])); }
    catch { return {}; }
  });
  const [regionInput, setRegionInput] = useState("");

  const REGION_PRESETS = ["HK", "JP", "US", "UK", "SG", "AU", "AE"];

  function addRegion(r: string) {
    const val = r.trim().toUpperCase();
    if (!val || regionList.includes(val)) return;
    setRegionList((prev) => [...prev, val]);
    setRegionInput("");
  }
  function removeRegion(r: string) {
    setRegionList((prev) => prev.filter((x) => x !== r));
    setRegionPrices((prev) => { const n = { ...prev }; delete n[r]; return n; });
  }

  const [form, setForm] = useState({
    name:            initialData.name            ?? "",
    variant:         initialData.variant          ?? "",
    price:           initialData.price            ?? "",
    original_price:  initialData.original_price   ?? "",
    image:           initialData.image             ?? "",
    slug:            initialData.slug              ?? "",
    badge:           initialData.badge             ?? "",
    badge_color:     initialData.badge_color       ?? "#FB5724",
    spec_screen:     initialData.spec_screen       ?? "",
    spec_ram:        initialData.spec_ram          ?? "",
    spec_camera:     initialData.spec_camera       ?? "",
    is_featured:     initialData.is_featured       ?? false,
    category:        initialData.category          ?? "",
    condition:       initialData.condition         ?? "brand-new",
    stock:           initialData.stock             ?? "",
    product_code:    initialData.product_code      ?? "",
    emi_available:   initialData.emi_available     ?? false,
    battery_health:  initialData.battery_health    ?? "",
    whatsapp_number: initialData.whatsapp_number   ?? "",
  });

  function set(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }
  function handleNameChange(v: string) {
    set("name", v);
    if (!initialData.slug) set("slug", slugify(v));
  }

  // ── Color helpers ──
  function addColor(c: string) {
    const val = c.trim();
    if (!val || colors.includes(val)) return;
    setColors((prev) => [...prev, val]);
    setColorInput("");
  }
  function removeColor(c: string) { setColors((prev) => prev.filter((x) => x !== c)); }

  // ── Storage helpers ──
  function addStorage(s: string) {
    const val = s.trim();
    if (!val || storageVariants.includes(val)) return;
    setStorageVariants((prev) => [...prev, val]);
    setStorageInput("");
  }
  function removeStorage(s: string) { setStorageVariants((prev) => prev.filter((x) => x !== s)); }

  async function handleImageUpload(file: File) {
    setImageSizeError("");
    setImageSize(file.size);
    if (file.size > 100 * 1024) {
      setImageSizeError(`File is ${(file.size / 1024).toFixed(1)} KB — max 100 KB.`);
      setLocalPreview("");
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    setLocalPreview(blobUrl);
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const up = await adminFetch("/api/admin/upload", { method: "POST", body: fd });
      const upData = await up.json();
      if (!up.ok) throw new Error(upData.error ?? "Upload failed");
      const publicUrl = upData.url as string;
      set("image", publicUrl);
    } catch (err: unknown) {
      setError(`Image upload failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!safeImageSrc(form.image)) {
      setError("Invalid image URL. Use Upload button, https:// link, or /images/... path.");
      return;
    }
    const priceNum = Number(form.price);
    const origNum  = form.original_price === "" ? 0 : Number(form.original_price);
    if (!(priceNum > 0)) { setError("Sale Price সঠিকভাবে দিন (0-এর বেশি)।"); return; }
    if (origNum && origNum <= priceNum) {
      setError("Original Price অবশ্যই Sale Price-এর চেয়ে বেশি হতে হবে (না দিলে খালি রাখুন)।");
      return;
    }
    const batteryStr = String(form.battery_health ?? "").trim();
    if (batteryStr !== "" && !(Number(batteryStr) >= 0 && Number(batteryStr) <= 100)) {
      setError("Battery Health 0 থেকে 100-এর মধ্যে হতে হবে।");
      return;
    }
    // প্রথম storage = base price → সবসময় Sale Price-এর সাথে মিলবে।
    // বাকি storage-এর price নিজে দিতে হবে; storage list-এ নেই এমন পুরনো price বাদ।
    const finalStoragePrices: Record<string, number> = {};
    storageVariants.forEach((s, i) => {
      if (i === 0) { finalStoragePrices[s] = priceNum; return; }
      const v = storagePrices[s];
      if (v !== undefined && v !== "" && Number(v) > 0) finalStoragePrices[s] = Number(v);
    });
    const finalRegionPrices: Record<string, number> = {};
    regionList.forEach((r) => { finalRegionPrices[r] = Number(regionPrices[r] ?? 0) || 0; });

    setSaving(true);
    setError("");
    const url  = mode === "edit" ? `/api/products/${initialData.id}` : "/api/products";
    const meth = mode === "edit" ? "PUT" : "POST";
    const res = await adminFetch(url, {
      method: meth,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price:            priceNum,
        original_price:   origNum || null,
        // battery_health: মান দিলে বা আগে থেকে থাকলে (মুছতে চাইলে null) পাঠায়; নইলে একদম পাঠায় না
        ...(batteryStr !== "" || initialData.battery_health != null
          ? { battery_health: batteryStr === "" ? null : Number(batteryStr) }
          : { battery_health: undefined }),
        stock:            form.stock === "" ? null : Number(form.stock),
        colors:           colors.length > 0 ? JSON.stringify(colors) : null,
        storage_variants: storageVariants.length > 0 ? JSON.stringify(storageVariants) : null,
        storage_prices:   Object.keys(finalStoragePrices).length > 1
          ? JSON.stringify(finalStoragePrices)
          : null,
        region_prices:    Object.keys(finalRegionPrices).length > 0
          ? JSON.stringify(finalRegionPrices)
          : null,
        regions:          regionList.length > 0 ? regionList.join(",") : null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Something went wrong"); return; }
    setSuccess(true);
    setTimeout(() => router.push("/admin/products"), 1200);
  }

  const previewSrc = safeImageSrc(form.image);

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {mode === "edit" ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {mode === "edit" ? "Update product details below." : "Fill in the details to add a new product."}
          </p>
        </div>
        <button type="button" onClick={() => router.back()} className="text-sm text-gray-400 hover:text-gray-600 underline">← Back</button>
      </div>

      {error   && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2"><CheckCircle size={15}/> Saved! Redirecting…</div>}

      {/* ── Basic Info ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Basic Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name *</label>
            <input required value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. iPhone 16 Pro" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Variant</label>
            <input value={form.variant} onChange={(e) => set("variant", e.target.value)} placeholder="256GB – Desert Titanium" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Slug *</label>
            <input required value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="iphone-16-pro" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-300"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Product Code</label>
            <input value={form.product_code} onChange={(e) => set("product_code", e.target.value)} placeholder="AGL146988" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-300"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Stock Qty</label>
            <input type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} placeholder="50" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"/>
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} className="w-4 h-4 accent-brand-500 rounded"/>
          <span className="text-sm font-medium text-gray-700">Show in Popular Products (Featured)</span>
        </label>
      </section>

      {/* ── Category & Condition ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Category & Condition</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Brand / Category *</label>
            <select required value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white">
              <option value="">-- Select Brand --</option>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Condition *</label>
            <select required value={form.condition} onChange={(e) => set("condition", e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white">
              <option value="brand-new">🆕 Brand New</option>
              <option value="pre-owned">♻️ Pre-Owned</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── Colors ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">🎨 Available Colors</h2>
        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((c) => (
            <button key={c} type="button"
              onClick={() => addColor(c)}
              disabled={colors.includes(c)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${colors.includes(c) ? "bg-brand-500 text-white border-brand-500" : "border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600"}`}
            >{c}</button>
          ))}
        </div>
        {/* Custom input */}
        <div className="flex gap-2">
          <input value={colorInput} onChange={(e) => setColorInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addColor(colorInput); }}} placeholder="Custom color name…" className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"/>
          <button type="button" onClick={() => addColor(colorInput)} className="px-4 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-bold hover:bg-brand-600 flex items-center gap-1"><Plus size={14}/> Add</button>
        </div>
        {/* Selected tags */}
        {colors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                {c}
                <button type="button" onClick={() => removeColor(c)} className="hover:text-red-500"><X size={11}/></button>
              </span>
            ))}
          </div>
        )}
        {colors.length === 0 && <p className="text-xs text-gray-400">No colors added — color selector won't show on product page.</p>}
      </section>

      {/* ── Storage + Pricing ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">💾 Storage Variants & Pricing</h2>
        <p className="text-xs text-gray-400">প্রথম storage-এর price = উপরের Sale Price (নিজে থেকে মিলে যাবে)। বাকি storage-এর আলাদা price দিন। Storage select করলে product page এ price automatically update হবে।</p>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {STORAGE_PRESETS.map((s) => (
            <button key={s} type="button"
              onClick={() => addStorage(s)}
              disabled={storageVariants.includes(s)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${storageVariants.includes(s) ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
            >{s}</button>
          ))}
        </div>

        {/* Custom input */}
        <div className="flex gap-2">
          <input value={storageInput} onChange={(e) => setStorageInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addStorage(storageInput); }}} placeholder="Custom storage e.g. 3TB…" className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"/>
          <button type="button" onClick={() => addStorage(storageInput)} className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 flex items-center gap-1"><Plus size={14}/> Add</button>
        </div>

        {/* Storage + Price table */}
        {storageVariants.length > 0 && (
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr_auto] bg-gray-50 border-b border-gray-100 px-4 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
              <span>Storage</span>
              <span>Cash Price (৳)</span>
              <span></span>
            </div>
            {storageVariants.map((s) => (
              <div key={s} className="grid grid-cols-[1fr_1fr_auto] items-center px-4 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <span className="text-sm font-bold text-gray-800">{s}</span>
                {s === storageVariants[0] ? (
                  <div className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-1.5 text-sm text-gray-500 mr-3">
                    {form.price !== "" ? `৳${Number(form.price).toLocaleString("en-BD")}` : "—"}
                    <span className="ml-2 text-[10px] text-gray-400">= Sale Price (Base)</span>
                  </div>
                ) : (
                <input
                  type="number"
                  value={storagePrices[s] ?? ""}
                  onChange={(e) => setStoragePrices((prev) => ({ ...prev, [s]: e.target.value }))}
                  placeholder="e.g. 174999"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 mr-3"
                />
                )}
                <button type="button" onClick={() => removeStorage(s)} className="text-gray-300 hover:text-red-400 transition-colors ml-2">
                  <Trash2 size={14}/>
                </button>
              </div>
            ))}
          </div>
        )}
        {storageVariants.length === 0 && <p className="text-xs text-gray-400">No storage variants — storage selector won't show on product page.</p>}
      </section>

      {/* ── Region + Pricing ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">🌍 Region & Price Adjustment</h2>
        <p className="text-xs text-gray-400">Region select করলে base storage price এর সাথে এই amount যোগ/বিয়োগ হবে। HK সবচেয়ে সস্তা হলে HK = 0, JP একটু কম হলে JP = -2000।</p>

        {/* Region presets */}
        <div className="flex flex-wrap gap-2">
          {REGION_PRESETS.map((r) => (
            <button key={r} type="button"
              onClick={() => addRegion(r)}
              disabled={regionList.includes(r)}
              className={`text-xs px-3 py-1.5 rounded-full border font-bold transition-all ${regionList.includes(r) ? "bg-gray-800 text-white border-gray-800" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
            >{r}</button>
          ))}
        </div>

        {/* Custom region input */}
        <div className="flex gap-2">
          <input value={regionInput} onChange={(e) => setRegionInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addRegion(regionInput); }}} placeholder="Custom region e.g. EU…" className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"/>
          <button type="button" onClick={() => addRegion(regionInput)} className="px-4 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-bold hover:bg-gray-700 flex items-center gap-1"><Plus size={14}/> Add</button>
        </div>

        {/* Region + Price delta table */}
        {regionList.length > 0 && (
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="grid grid-cols-[80px_1fr_auto] bg-gray-50 border-b border-gray-100 px-4 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
              <span>Region</span>
              <span>Price Adjustment (৳) — 0 = base price, -2000 = ২০০০ কম, +5000 = ৫০০০ বেশি</span>
              <span></span>
            </div>
            {regionList.map((r) => (
              <div key={r} className="grid grid-cols-[80px_1fr_auto] items-center px-4 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <span className="text-sm font-extrabold text-gray-800">{r}</span>
                <input
                  type="number"
                  value={regionPrices[r] ?? "0"}
                  onChange={(e) => setRegionPrices((prev) => ({ ...prev, [r]: e.target.value }))}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 mr-3"
                />
                <button type="button" onClick={() => removeRegion(r)} className="text-gray-300 hover:text-red-400 transition-colors ml-2">
                  <Trash2 size={14}/>
                </button>
              </div>
            ))}
          </div>
        )}
        {regionList.length === 0 && <p className="text-xs text-gray-400">No regions added — region selector won't show on product page.</p>}
      </section>

      {/* ── Product Image ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Product Image</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <label className={`cursor-pointer flex items-center gap-2 border-2 border-dashed rounded-xl px-4 py-3 text-sm transition ${uploading ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-brand-300 text-brand-600 hover:bg-brand-50"}`}>
                {uploading ? <><Loader2 size={15} className="animate-spin"/> Uploading…</> : <><Upload size={15}/> Upload from device</>}
                <input type="file" accept="image/*" disabled={uploading} className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file); }}/>
              </label>
              <span className="text-xs text-gray-400">or paste URL below</span>
              <span className="text-[11px] font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-2 py-1 rounded-lg">Max 100 KB</span>
            </div>
            {imageSizeError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-xl">
                <X size={13} className="shrink-0"/>{imageSizeError}
              </div>
            )}
            {imageSize !== null && imageSize <= 100 * 1024 && !imageSizeError && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-2 rounded-xl">
                <CheckCircle size={13} className="shrink-0"/> Image size: {(imageSize / 1024).toFixed(1)} KB ✓
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL *</label>
              <div className="flex gap-2 items-center">
                <input required value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://… or /images/products/iPhone16.webp" className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-300"/>
                {form.image && <button type="button" onClick={() => { set("image", ""); setImageSize(null); setImageSizeError(""); setLocalPreview(""); }} className="text-gray-400 hover:text-red-400"><X size={16}/></button>}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 shrink-0">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Preview</p>
            <div className="relative w-36 h-36 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
              {(localPreview || previewSrc) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={localPreview || previewSrc!} alt="preview" className="w-full h-full object-contain p-2"/>
              ) : (
                <span className="text-3xl text-gray-200">🖼</span>
              )}
            </div>
            {imageSize !== null && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${imageSize > 100 * 1024 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                {(imageSize / 1024).toFixed(1)} KB {imageSize > 100 * 1024 ? "✗" : "✓"}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Pricing</h2>
        <p className="text-xs text-gray-400">
          <strong>Sale Price</strong> = কাস্টমার যে দামে কিনবে (যেমন ৫৪,০০০)। <strong>Original Price</strong> = কাটা দাম / MRP (যেমন ৬৪,০০০), অবশ্যই Sale Price-এর চেয়ে বেশি। Offer / Today&apos;s Deal-এর দাম এর চেয়েও কম হবে।
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Sale Price (৳) *</label>
            <input required type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="114499" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Original Price (৳)</label>
            <input type="number" value={form.original_price} onChange={(e) => set("original_price", e.target.value)} placeholder="124999" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"/>
          </div>
        </div>
      </section>

      {/* ── Battery Health ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Battery Health (Optional)</h2>
        <div className="max-w-xs">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Battery Health (%)</label>
          <div className="relative">
            <input
              type="number" min="0" max="100" step="1"
              value={form.battery_health}
              onChange={(e) => set("battery_health", e.target.value)}
              placeholder="e.g. 89"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          দিলে product page-এর Product Details-এ &quot;Battery Health&quot; দেখাবে এবং পরে বাড়ালে/কমালে সাথে সাথে আপডেট হবে। খালি রাখলে দেখাবে না।
        </p>
      </section>

      {/* ── Badge ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Badge (Optional)</h2>
        <div className="flex flex-wrap gap-2">
          {BADGE_PRESETS.map((b) => (
            <button key={b.label} type="button" onClick={() => { set("badge", b.label); set("badge_color", b.color); }} className="flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-full transition-all hover:opacity-90 active:scale-95" style={{ backgroundColor: b.color }}>{b.label}</button>
          ))}
          <button type="button" onClick={() => set("badge", "")} className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50">No Badge</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Badge Text</label>
            <input value={form.badge} onChange={(e) => set("badge", e.target.value)} placeholder="Best Seller" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Badge Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={form.badge_color} onChange={(e) => set("badge_color", e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-1"/>
              <input value={form.badge_color} onChange={(e) => set("badge_color", e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-300"/>
            </div>
          </div>
        </div>
      </section>

      {/* ── Specs ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Specs</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">📱 Screen</label>
            <input value={form.spec_screen} onChange={(e) => set("spec_screen", e.target.value)} placeholder='6.3"' className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">⚙️ RAM</label>
            <input value={form.spec_ram} onChange={(e) => set("spec_ram", e.target.value)} placeholder="8GB" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">📷 Camera</label>
            <input value={form.spec_camera} onChange={(e) => set("spec_camera", e.target.value)} placeholder="48 MP" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"/>
          </div>
        </div>
      </section>

      {/* ── EMI & WhatsApp ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">EMI & WhatsApp</h2>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={form.emi_available} onChange={(e) => set("emi_available", e.target.checked)} className="w-4 h-4 accent-green-500 rounded"/>
          <span className="text-sm font-medium text-gray-700">EMI Available for this product</span>
        </label>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">WhatsApp Number (with country code)</label>
          <input value={form.whatsapp_number} onChange={(e) => set("whatsapp_number", e.target.value)} placeholder="+8801XXXXXXXXX" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"/>
          <p className="text-[11px] text-gray-400 mt-1">Leave blank to hide the WhatsApp button on the product page.</p>
        </div>
      </section>

      <div className="flex gap-3">
        <button type="submit" disabled={saving || success || uploading} className="flex-1 flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 text-sm">
          {saving && <Loader2 size={15} className="animate-spin"/>}
          {mode === "edit" ? "Save Changes" : "Add Product"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
      </div>
    </form>
  );
}
