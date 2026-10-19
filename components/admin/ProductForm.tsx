"use client";
// SAVE PATH: components/admin/ProductForm.tsx

import { adminFetch } from "@/lib/adminFetch";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Upload, Loader2, CheckCircle, X, Plus, Trash2, Tag, Timer, AlertCircle, ImageOff } from "lucide-react";

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
    color_images?: string;   // NEW: JSON {"Black":"https://...","White":"..."}
    storage_variants?: string;
    storage_prices?: string; // NEW format: {"128GB":83999,"UK|128GB":87000,...}
    region_prices?: string;
    regions?: string;
    emi_available?: boolean;
    whatsapp_number?: string;
    brand_new_price?: number | null;
    pre_owned_price?: number | null;
    offer_price_brand_new?: number | null;
    offer_price_pre_owned?: number | null;
    offer_ends_at?: string | null;
    offer_type?: string | null;
    is_today_deal?: boolean;
    deal_price?: number | null;
    deal_ends_at?: string | null;
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
  { label: "── Phone Brands ──", value: "", disabled: true },
  { label: "Apple",    value: "apple"    },
  { label: "Samsung",  value: "samsung"  },
  { label: "Google",   value: "google"   },
  { label: "OnePlus",  value: "oneplus"  },
  { label: "Redmi",    value: "redmi"    },
  { label: "Realme",   value: "realme"   },
  { label: "Nothing",  value: "nothing"  },
  { label: "Motorola", value: "motorola" },
  { label: "Vivo",     value: "vivo"     },
  { label: "Honor",    value: "honor"    },
  { label: "iQOO",     value: "iqoo"     },
  { label: "── Accessories ──",  value: "", disabled: true },
  { label: "Charger",     value: "charger"     },
  { label: "Speaker",     value: "speaker"     },
  { label: "Ear Buds",    value: "earbuds"     },
  { label: "Power Bank",  value: "powerbank"   },
  { label: "Cables",      value: "cables"      },
  { label: "Accessories", value: "accessories" },
];

const OFFER_TYPES = ["Offer", "Today's Deal", "Flash Sale", "Weekend Deal", "Clearance"];
const COLOR_PRESETS = ["Black","White","Silver","Gold","Burgundy","Glacier","Desert Titanium","Natural Titanium","Blue Titanium","Purple","Pink","Green","Yellow","Red","Midnight","Starlight"];
const STORAGE_PRESETS = ["64GB","128GB","256GB","512GB","1TB","2TB"];
const REGION_PRESETS = ["China","HK","JP","US","UK","SG","AU","AE"];

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
function parseArr(val: string | undefined): string[] {
  if (!val) return [];
  try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; }
}
function toISO(val: string): string | null {
  if (!val) return null;
  try { return new Date(val).toISOString(); } catch { return null; }
}
function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch { return ""; }
}

// ── Parse new storage_prices format ─────────────────────────────────────────
// Format: {"128GB": 83999, "UK|128GB": 87000, "UK|256GB": 98000}
// Returns: { base: {"128GB": "83999"}, variants: {"UK": {"128GB":"87000","256GB":"98000"}} }
function parseStoragePricesNew(raw: string | undefined, storages: string[], regions: string[]) {
  const base: Record<string, string> = {};
  const matrix: Record<string, Record<string, string>> = {};
  if (!raw) return { base, matrix };
  try {
    const p: Record<string, number> = JSON.parse(raw);
    for (const [key, val] of Object.entries(p)) {
      if (key.includes("|")) {
        const [region, storage] = key.split("|");
        if (!matrix[region]) matrix[region] = {};
        matrix[region][storage] = String(val);
      } else {
        base[key] = String(val);
      }
    }
  } catch {}
  return { base, matrix };
}

export default function ProductForm({ initialData = {}, mode = "create" }: ProductFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCategory  = mode === "create" ? (searchParams.get("category")  ?? "") : "";
  const urlCondition = mode === "create" ? (searchParams.get("condition")  ?? "") : "";

  const [saving,    setSaving]    = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageSize, setImageSize] = useState<number | null>(null);
  const [imageSizeError, setImageSizeError] = useState("");
  const [localPreview, setLocalPreview] = useState<string>("");

  const [colors,          setColors]          = useState<string[]>(parseArr(initialData.colors));
  const [storageVariants, setStorageVariants] = useState<string[]>(parseArr(initialData.storage_variants));
  const [colorInput,      setColorInput]      = useState("");
  const [storageInput,    setStorageInput]    = useState("");

  // Region list
  const [regionList, setRegionList] = useState<string[]>(
    initialData.regions ? initialData.regions.split(",").map((r) => r.trim()).filter(Boolean) : []
  );
  const [regionInput, setRegionInput] = useState("");

  // ── NEW: Matrix pricing ──────────────────────────────────────────────────
  // baseStoragePrices: {"128GB": "83999"} — price when NO region selected
  // regionStorageMatrix: {"UK": {"128GB": "87000", "256GB": "98000"}}
  const initParsed = parseStoragePricesNew(initialData.storage_prices, parseArr(initialData.storage_variants), initialData.regions ? initialData.regions.split(",").map(r=>r.trim()).filter(Boolean) : []);
  const [baseStoragePrices,   setBaseStoragePrices]   = useState<Record<string, string>>(initParsed.base);
  const [regionStorageMatrix, setRegionStorageMatrix] = useState<Record<string, Record<string, string>>>(initParsed.matrix);

  // ── NEW: Color images ────────────────────────────────────────────────────
  // colorImages: {"Black": "https://...", "White": "https://..."}
  const [colorImages,       setColorImages]       = useState<Record<string, string>>(() => {
    if (!initialData.color_images) return {};
    try { return JSON.parse(initialData.color_images) as Record<string,string>; } catch { return {}; }
  });
  const [colorImageUploading, setColorImageUploading] = useState<Record<string, boolean>>({});
  const [colorImageErrors,    setColorImageErrors]    = useState<Record<string, string>>({});

  const initCondition = (initialData.condition ?? urlCondition) || "brand-new";

  const [form, setForm] = useState({
    name:            initialData.name            ?? "",
    variant:         initialData.variant          ?? "",
    brand_new_price: String(initialData.brand_new_price ?? initialData.price ?? ""),
    pre_owned_price: String(initialData.pre_owned_price ?? ""),
    original_price:  String(initialData.original_price  ?? ""),
    image:           initialData.image             ?? "",
    slug:            initialData.slug              ?? "",
    badge:           initialData.badge             ?? "",
    badge_color:     initialData.badge_color       ?? "#FB5724",
    spec_screen:     initialData.spec_screen       ?? "",
    spec_ram:        initialData.spec_ram          ?? "",
    spec_camera:     initialData.spec_camera       ?? "",
    is_featured:     initialData.is_featured       ?? false,
    category:        initialData.category          ?? urlCategory,
    condition:       initCondition,
    stock:           String(initialData.stock      ?? ""),
    product_code:    initialData.product_code      ?? "",
    emi_available:   initialData.emi_available     ?? false,
    battery_health:  String(initialData.battery_health ?? ""),
    whatsapp_number: initialData.whatsapp_number   ?? "",
    offer_price_brand_new: String(initialData.offer_price_brand_new ?? ""),
    offer_price_pre_owned: String(initialData.offer_price_pre_owned ?? ""),
    offer_ends_at:   toDatetimeLocal(initialData.offer_ends_at),
    offer_type:      initialData.offer_type ?? "Offer",
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
  function removeColor(c: string) {
    setColors((prev) => prev.filter((x) => x !== c));
    setColorImages((prev) => { const n = { ...prev }; delete n[c]; return n; });
  }

  // ── Storage helpers ──
  function addStorage(s: string) {
    const val = s.trim();
    if (!val || storageVariants.includes(val)) return;
    setStorageVariants((prev) => [...prev, val]);
    setStorageInput("");
  }
  function removeStorage(s: string) {
    setStorageVariants((prev) => prev.filter((x) => x !== s));
    setBaseStoragePrices((prev) => { const n = { ...prev }; delete n[s]; return n; });
    setRegionStorageMatrix((prev) => {
      const n = { ...prev };
      for (const r of Object.keys(n)) { delete n[r][s]; }
      return n;
    });
  }

  // ── Region helpers ──
  function addRegion(r: string) {
    const val = r.trim();
    if (!val || regionList.includes(val)) return;
    setRegionList((prev) => [...prev, val]);
    setRegionInput("");
  }
  function removeRegion(r: string) {
    setRegionList((prev) => prev.filter((x) => x !== r));
    setRegionStorageMatrix((prev) => { const n = { ...prev }; delete n[r]; return n; });
  }

  // ── Matrix price helpers ──
  function setBasePrice(storage: string, price: string) {
    setBaseStoragePrices((prev) => ({ ...prev, [storage]: price }));
  }
  function setMatrixPrice(region: string, storage: string, price: string) {
    setRegionStorageMatrix((prev) => ({
      ...prev,
      [region]: { ...(prev[region] ?? {}), [storage]: price },
    }));
  }

  // ── Color image upload ──
  async function handleColorImageUpload(color: string, file: File) {
    setColorImageErrors((prev) => ({ ...prev, [color]: "" }));
    if (file.size > 20 * 1024) {
      setColorImageErrors((prev) => ({ ...prev, [color]: `${(file.size/1024).toFixed(0)} KB — max 20 KB` }));
      return;
    }
    setColorImageUploading((prev) => ({ ...prev, [color]: true }));
    try {
      const fd = new FormData();
      fd.append("file", file);
      const up = await adminFetch("/api/admin/upload", { method: "POST", body: fd });
      const upData = await up.json();
      if (!up.ok) throw new Error(upData.error ?? "Upload failed");
      setColorImages((prev) => ({ ...prev, [color]: upData.url as string }));
    } catch (err: unknown) {
      setColorImageErrors((prev) => ({ ...prev, [color]: err instanceof Error ? err.message : "Upload failed" }));
    } finally {
      setColorImageUploading((prev) => ({ ...prev, [color]: false }));
    }
  }

  // ── Main image upload ──
  async function handleImageUpload(file: File) {
    setImageSizeError("");
    setImageSize(file.size);
    if (file.size > 20 * 1024) {
      setImageSizeError(`File is ${(file.size / 1024).toFixed(0)} KB — max 20 KB.`);
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
      set("image", upData.url as string);
    } catch (err: unknown) {
      setError(`Image upload failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setUploading(false);
    }
  }

  // ── Offer helpers ──
  const hasActiveOffer = (() => {
    return Number(form.offer_price_brand_new) > 0 || Number(form.offer_price_pre_owned) > 0;
  })();
  const offerExpired = (() => {
    if (!form.offer_ends_at) return false;
    return new Date(form.offer_ends_at).getTime() < Date.now();
  })();

  // ── Submit ──────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const bnPrice = Number(form.brand_new_price);
    if (!(bnPrice > 0)) {
      setError("Brand New Price সঠিকভাবে দিন (0-এর বেশি)।");
      return;
    }
    const poPrice = form.pre_owned_price !== "" ? Number(form.pre_owned_price) : null;
    if (form.condition === "pre-owned" && !poPrice) {
      setError("Pre-Owned condition এর জন্য Pre-Owned Price দিন।");
      return;
    }

    const batteryStr = String(form.battery_health ?? "").trim();
    if (batteryStr !== "" && !(Number(batteryStr) >= 0 && Number(batteryStr) <= 100)) {
      setError("Battery Health 0 থেকে 100-এর মধ্যে হতে হবে।");
      return;
    }

    const bnOffer = form.offer_price_brand_new !== "" ? Number(form.offer_price_brand_new) : null;
    const poOffer = form.offer_price_pre_owned !== "" ? Number(form.offer_price_pre_owned) : null;
    if (bnOffer !== null && bnOffer >= bnPrice) {
      setError("Brand New Offer Price অবশ্যই Brand New Price এর চেয়ে কম হতে হবে।");
      return;
    }
    if (poOffer !== null && poPrice && poOffer >= poPrice) {
      setError("Pre-Owned Offer Price অবশ্যই Pre-Owned Price এর চেয়ে কম হতে হবে।");
      return;
    }

    // ── Build new storage_prices JSON ─────────────────────────────────────
    // Format: {"128GB": 83999, "UK|128GB": 87000, ...}
    const finalStoragePrices: Record<string, number> = {};

    // First storage = brand_new_price (base), rest from baseStoragePrices
    storageVariants.forEach((s, i) => {
      const price = i === 0 ? bnPrice : (baseStoragePrices[s] ? Number(baseStoragePrices[s]) : 0);
      if (price > 0) finalStoragePrices[s] = price;
    });

    // Region×Storage matrix
    for (const region of regionList) {
      for (const storage of storageVariants) {
        const key = `${region}|${storage}`;
        const val = regionStorageMatrix[region]?.[storage];
        if (val !== undefined && val !== "" && Number(val) > 0) {
          finalStoragePrices[key] = Number(val);
        }
      }
    }

    // ── Color images JSON ─────────────────────────────────────────────────
    const finalColorImages = Object.keys(colorImages).length > 0
      ? JSON.stringify(colorImages)
      : null;

    setSaving(true);
    setError("");

    const url  = mode === "edit" ? `/api/products/${initialData.id}` : "/api/products";
    const meth = mode === "edit" ? "PUT" : "POST";

    // Image can be empty — allow saving without photo
    const imageValue = form.image.trim() || null;

    const origNum = form.original_price !== "" ? Number(form.original_price) : null;
    const offerEndsAt = form.offer_ends_at ? toISO(form.offer_ends_at) : null;

    const res = await adminFetch(url, {
      method: meth,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        image: imageValue,
        brand_new_price: bnPrice,
        pre_owned_price: poPrice,
        price: bnPrice,
        original_price: origNum,
        offer_price_brand_new: bnOffer,
        offer_price_pre_owned: poOffer,
        offer_ends_at: offerEndsAt,
        offer_type: (bnOffer || poOffer) ? (form.offer_type || "Offer") : null,
        ...(batteryStr !== "" || initialData.battery_health != null
          ? { battery_health: batteryStr === "" ? null : Number(batteryStr) }
          : { battery_health: undefined }),
        stock:            form.stock === "" ? null : Number(form.stock),
        colors:           colors.length > 0 ? JSON.stringify(colors) : null,
        color_images:     finalColorImages,
        storage_variants: storageVariants.length > 0 ? JSON.stringify(storageVariants) : null,
        storage_prices:   Object.keys(finalStoragePrices).length > 0
          ? JSON.stringify(finalStoragePrices) : null,
        // region_prices ও regions এখন matrix থেকে derived — backward compat এর জন্য রাখছি
        region_prices:    null,
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
  const isBrandNew = form.condition === "brand-new";
  const isPreOwned = form.condition === "pre-owned";
  const hasImage   = !!previewSrc || !!localPreview;

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
              {CATEGORIES.map((c, i) => (
                <option key={`${c.value}-${i}`} value={c.value} disabled={(c as { disabled?: boolean }).disabled}>
                  {c.label}
                </option>
              ))}
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

      {/* ── PRICING ── */}
      <section className="bg-white rounded-2xl border-2 border-brand-200 p-5 space-y-5">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Pricing</h2>
          <span className="text-[10px] bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full uppercase">Brand New ও Pre-Owned আলাদা</span>
        </div>
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-start gap-2">
          <AlertCircle size={14} className="shrink-0 mt-0.5"/>
          Brand New ও Pre-Owned এর price কখনো mix হবে না। Condition অনুযায়ী সঠিক price automatically দেখাবে।
        </p>

        <div className={`rounded-xl border-2 p-4 space-y-3 transition-all ${isBrandNew ? "border-green-400 bg-green-50" : "border-gray-100 bg-gray-50 opacity-70"}`}>
          <div className="flex items-center gap-2">
            <span className="text-base">🆕</span>
            <span className="text-sm font-bold text-green-700">Brand New Price</span>
            {isBrandNew && <span className="text-[10px] bg-green-500 text-white font-bold px-2 py-0.5 rounded-full">Active Condition</span>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Brand New Sale Price (৳) *</label>
              <input required type="number" value={form.brand_new_price} onChange={(e) => set("brand_new_price", e.target.value)} placeholder="e.g. 114499" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"/>
              <p className="text-[10px] text-gray-400 mt-1">কাস্টমার brand new কিনলে এই দামে পাবে</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Original / MRP Price (৳)</label>
              <input type="number" value={form.original_price} onChange={(e) => set("original_price", e.target.value)} placeholder="e.g. 124999 (কাটা দাম)" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"/>
            </div>
          </div>
        </div>

        <div className={`rounded-xl border-2 p-4 space-y-3 transition-all ${isPreOwned ? "border-blue-400 bg-blue-50" : "border-gray-100 bg-gray-50 opacity-70"}`}>
          <div className="flex items-center gap-2">
            <span className="text-base">♻️</span>
            <span className="text-sm font-bold text-blue-700">Pre-Owned Price</span>
            {isPreOwned && <span className="text-[10px] bg-blue-500 text-white font-bold px-2 py-0.5 rounded-full">Active Condition</span>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Pre-Owned Sale Price (৳) {isPreOwned && "*"}</label>
            <input type="number" required={isPreOwned} value={form.pre_owned_price} onChange={(e) => set("pre_owned_price", e.target.value)} placeholder="e.g. 89999" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"/>
          </div>
        </div>

        {(form.brand_new_price || form.pre_owned_price) && (
          <div className="bg-gray-50 rounded-xl px-4 py-3 flex flex-wrap gap-4 text-sm">
            <span className="text-gray-500">Price Preview:</span>
            {form.brand_new_price && <span className="font-bold text-green-700">🆕 Brand New: ৳{Number(form.brand_new_price).toLocaleString("en-BD")}</span>}
            {form.pre_owned_price && <span className="font-bold text-blue-700">♻️ Pre-Owned: ৳{Number(form.pre_owned_price).toLocaleString("en-BD")}</span>}
          </div>
        )}
      </section>

      {/* ── OFFER ── */}
      <section className="bg-white rounded-2xl border-2 border-orange-200 p-5 space-y-5">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-orange-500"/>
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Offer / Today&apos;s Deal</h2>
          {hasActiveOffer && !offerExpired && <span className="text-[10px] bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">ACTIVE</span>}
          {offerExpired && <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">EXPIRED</span>}
        </div>
        <p className="text-xs text-gray-500 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 flex items-start gap-2">
          <Timer size={13} className="text-orange-400 shrink-0 mt-0.5"/>
          Offer price দিলে product page এ auto badge লাগবে। Time শেষ হলে automatically সরে যাবে।
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-green-200 bg-green-50 p-3 space-y-2">
            <label className="block text-xs font-bold text-green-700">🆕 Brand New Offer Price (৳)</label>
            <input type="number" value={form.offer_price_brand_new} onChange={(e) => set("offer_price_brand_new", e.target.value)} placeholder={form.brand_new_price ? `< ৳${Number(form.brand_new_price).toLocaleString("en-BD")}` : "Brand New offer price"} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"/>
            {form.offer_price_brand_new && form.brand_new_price && Number(form.offer_price_brand_new) > 0 && (
              <p className="text-[11px] text-green-700 font-semibold">৳{(Number(form.brand_new_price) - Number(form.offer_price_brand_new)).toLocaleString("en-BD")} discount ({Math.round(((Number(form.brand_new_price) - Number(form.offer_price_brand_new)) / Number(form.brand_new_price)) * 100)}% off)</p>
            )}
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 space-y-2">
            <label className="block text-xs font-bold text-blue-700">♻️ Pre-Owned Offer Price (৳)</label>
            <input type="number" value={form.offer_price_pre_owned} onChange={(e) => set("offer_price_pre_owned", e.target.value)} placeholder={form.pre_owned_price ? `< ৳${Number(form.pre_owned_price).toLocaleString("en-BD")}` : "Pre-Owned offer price"} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"/>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Offer Type / Badge Label</label>
            <select value={form.offer_type} onChange={(e) => set("offer_type", e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white">
              {OFFER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Offer End Date & Time</label>
            <input type="datetime-local" value={form.offer_ends_at} onChange={(e) => set("offer_ends_at", e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"/>
          </div>
        </div>
        {hasActiveOffer && (
          <button type="button" onClick={() => { set("offer_price_brand_new", ""); set("offer_price_pre_owned", ""); set("offer_ends_at", ""); }} className="text-xs font-semibold text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all">
            <X size={13}/> Offer সরিয়ে দাও
          </button>
        )}
      </section>

      {/* ── 🎨 Colors + Images ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <div>
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">🎨 Available Colors & Images</h2>
          <p className="text-xs text-gray-400 mt-1">Color select করলে সেই color-এর জন্য আলাদা image দিতে পারবেন। Image না দিলেও চলবে।</p>
        </div>

        {/* Color presets */}
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((c) => (
            <button key={c} type="button" onClick={() => addColor(c)} disabled={colors.includes(c)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${colors.includes(c) ? "bg-brand-500 text-white border-brand-500" : "border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600"}`}
            >{c}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={colorInput} onChange={(e) => setColorInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addColor(colorInput); }}}
            placeholder="Custom color name…" className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"/>
          <button type="button" onClick={() => addColor(colorInput)} className="px-4 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-bold hover:bg-brand-600 flex items-center gap-1"><Plus size={14}/> Add</button>
        </div>

        {/* Color cards with image upload */}
        {colors.length > 0 && (
          <div className="space-y-3">
            {colors.map((c) => {
              const img = colorImages[c];
              const isUp = colorImageUploading[c];
              const err = colorImageErrors[c];
              return (
                <div key={c} className="border border-gray-100 rounded-xl p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border border-gray-300 inline-block" style={{backgroundColor: c.toLowerCase() === "black" ? "#111" : c.toLowerCase() === "white" ? "#fff" : c.toLowerCase() === "gold" ? "#d4af37" : c.toLowerCase() === "silver" ? "#c0c0c0" : c.toLowerCase() === "red" ? "#ef4444" : c.toLowerCase() === "purple" ? "#7c3aed" : c.toLowerCase() === "pink" ? "#ec4899" : c.toLowerCase() === "green" ? "#22c55e" : c.toLowerCase() === "yellow" ? "#eab308" : c.toLowerCase() === "blue" ? "#3b82f6" : "#9ca3af"}}/>
                      {c}
                    </span>
                    <button type="button" onClick={() => removeColor(c)} className="text-gray-300 hover:text-red-400"><X size={14}/></button>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Image preview */}
                    <div className="w-14 h-14 rounded-lg bg-white border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={c} className="w-full h-full object-contain p-1"/>
                      ) : (
                        <ImageOff size={18} className="text-gray-300"/>
                      )}
                    </div>

                    {/* Upload + URL */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <label className={`cursor-pointer text-xs flex items-center gap-1.5 border rounded-lg px-3 py-1.5 font-medium transition ${isUp ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-brand-300 text-brand-600 hover:bg-brand-50"}`}>
                          {isUp ? <><Loader2 size={12} className="animate-spin"/> Uploading…</> : <><Upload size={12}/> Upload</>}
                          <input type="file" accept="image/*" disabled={isUp} className="hidden"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleColorImageUpload(c, f); }}/>
                        </label>
                        <span className="text-[10px] text-gray-400">or paste URL</span>
                        {img && (
                          <button type="button" onClick={() => setColorImages((prev) => { const n = {...prev}; delete n[c]; return n; })}
                            className="text-[10px] text-red-400 hover:text-red-600 border border-red-200 px-2 py-1 rounded-lg">Remove</button>
                        )}
                      </div>
                      <input
                        value={img ?? ""}
                        onChange={(e) => setColorImages((prev) => ({ ...prev, [c]: e.target.value }))}
                        placeholder="https://… (optional)"
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
                      />
                      {err && <p className="text-[11px] text-red-500">{err}</p>}
                      {!img && <p className="text-[10px] text-amber-500 flex items-center gap-1"><AlertCircle size={11}/> Photo নেই — color শুধু নাম হিসেবে দেখাবে</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {colors.length === 0 && <p className="text-xs text-gray-400">No colors added — color selector won&apos;t show on product page.</p>}
      </section>

      {/* ── 💾 Storage + Region Matrix Pricing ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5">
        <div>
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">💾 Storage & Region Pricing</h2>
          <p className="text-xs text-gray-400 mt-1">
            প্রতিটি Region-এর জন্য আলাদা storage price দিতে পারবেন। Region না দিলে base price ব্যবহার হবে।
          </p>
        </div>

        {/* ── Step 1: Storage variants ── */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Step 1 — Storage Variants</p>
          <div className="flex flex-wrap gap-2">
            {STORAGE_PRESETS.map((s) => (
              <button key={s} type="button" onClick={() => addStorage(s)} disabled={storageVariants.includes(s)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${storageVariants.includes(s) ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
              >{s}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={storageInput} onChange={(e) => setStorageInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addStorage(storageInput); }}}
              placeholder="Custom e.g. 3TB…" className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"/>
            <button type="button" onClick={() => addStorage(storageInput)} className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 flex items-center gap-1"><Plus size={14}/> Add</button>
          </div>
        </div>

        {/* ── Step 2: Regions ── */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Step 2 — Regions (Optional)</p>
          <div className="flex flex-wrap gap-2">
            {REGION_PRESETS.map((r) => (
              <button key={r} type="button" onClick={() => addRegion(r)} disabled={regionList.includes(r)}
                className={`text-xs px-3 py-1.5 rounded-full border font-bold transition-all ${regionList.includes(r) ? "bg-gray-800 text-white border-gray-800" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
              >{r}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={regionInput} onChange={(e) => setRegionInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addRegion(regionInput); }}}
              placeholder="Custom region e.g. EU…" className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"/>
            <button type="button" onClick={() => addRegion(regionInput)} className="px-4 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-bold hover:bg-gray-700 flex items-center gap-1"><Plus size={14}/> Add</button>
          </div>
        </div>

        {/* ── Step 3: Price Matrix ── */}
        {storageVariants.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Step 3 — Price Matrix</p>

            <div className="border border-gray-200 rounded-xl overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-wide w-28">Region</th>
                    {storageVariants.map((s) => (
                      <th key={s} className="text-left px-3 py-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                        <div className="flex items-center gap-1">
                          {s}
                          <button type="button" onClick={() => removeStorage(s)} className="text-gray-300 hover:text-red-400 ml-1"><Trash2 size={11}/></button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Base row — no region */}
                  <tr className="border-b border-gray-50 bg-green-50/30">
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Base</span>
                      <p className="text-[10px] text-gray-400 mt-0.5">Region ছাড়া</p>
                    </td>
                    {storageVariants.map((s, i) => (
                      <td key={s} className="px-3 py-2.5">
                        {i === 0 ? (
                          <div className="border border-gray-100 bg-gray-50 rounded-lg px-3 py-1.5 text-sm text-gray-500">
                            {form.brand_new_price ? `৳${Number(form.brand_new_price).toLocaleString("en-BD")}` : "—"}
                            <span className="block text-[10px] text-gray-400">= Brand New Price</span>
                          </div>
                        ) : (
                          <input
                            type="number"
                            value={baseStoragePrices[s] ?? ""}
                            onChange={(e) => setBasePrice(s, e.target.value)}
                            placeholder="e.g. 94000"
                            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                          />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Region rows */}
                  {regionList.map((r) => (
                    <tr key={r} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-gray-800">{r}</span>
                          <button type="button" onClick={() => removeRegion(r)} className="text-gray-300 hover:text-red-400"><Trash2 size={12}/></button>
                        </div>
                      </td>
                      {storageVariants.map((s) => (
                        <td key={s} className="px-3 py-2.5">
                          <input
                            type="number"
                            value={regionStorageMatrix[r]?.[s] ?? ""}
                            onChange={(e) => setMatrixPrice(r, s, e.target.value)}
                            placeholder={baseStoragePrices[s] ? `Base: ৳${Number(baseStoragePrices[s] || form.brand_new_price).toLocaleString("en-BD")}` : "e.g. 87000"}
                            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Live preview */}
            {storageVariants.length > 0 && (form.brand_new_price || Object.keys(baseStoragePrices).length > 0) && (
              <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1.5">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Preview — Client যা দেখবে</p>
                {regionList.length === 0 && storageVariants.map((s, i) => {
                  const price = i === 0 ? Number(form.brand_new_price) : Number(baseStoragePrices[s] || 0);
                  return price > 0 ? (
                    <div key={s} className="flex items-center gap-3 text-sm">
                      <span className="font-bold w-16 text-gray-700">{s}</span>
                      <span className="text-green-700 font-semibold">৳{price.toLocaleString("en-BD")}</span>
                    </div>
                  ) : null;
                })}
                {regionList.length > 0 && regionList.map((r) => (
                  <div key={r} className="space-y-0.5">
                    <p className="text-[11px] font-bold text-gray-600">{r}:</p>
                    <div className="pl-4 space-y-0.5">
                      {storageVariants.map((s, i) => {
                        const regionPrice = regionStorageMatrix[r]?.[s];
                        const basePrice = i === 0 ? Number(form.brand_new_price) : Number(baseStoragePrices[s] || 0);
                        const finalPrice = regionPrice ? Number(regionPrice) : basePrice;
                        return finalPrice > 0 ? (
                          <div key={s} className="flex items-center gap-3 text-sm">
                            <span className="font-medium w-16 text-gray-600">{s}</span>
                            <span className={`font-semibold ${regionPrice ? "text-blue-700" : "text-gray-500"}`}>
                              ৳{finalPrice.toLocaleString("en-BD")}
                              {!regionPrice && <span className="text-[10px] text-gray-400 ml-1">(base)</span>}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {storageVariants.length === 0 && <p className="text-xs text-gray-400">Storage variant না দিলে region pricing দেখাবে না।</p>}
      </section>

      {/* ── Product Image (Main) ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Product Image (Main)</h2>
          {!hasImage && (
            <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <AlertCircle size={12}/> Photo নেই — publish হবে না
            </span>
          )}
        </div>

        {/* No-photo warning */}
        {!hasImage && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <ImageOff size={18} className="text-amber-500 shrink-0 mt-0.5"/>
            <div>
              <p className="text-sm font-bold text-amber-800">Photo নেই</p>
              <p className="text-xs text-amber-600 mt-0.5">Photo ছাড়া product save করা যাবে, কিন্তু publish করা যাবে না। Color-এর image দিলে সেটাই দেখাবে।</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <label className={`cursor-pointer flex items-center gap-2 border-2 border-dashed rounded-xl px-4 py-3 text-sm transition ${uploading ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-brand-300 text-brand-600 hover:bg-brand-50"}`}>
                {uploading ? <><Loader2 size={15} className="animate-spin"/> Uploading…</> : <><Upload size={15}/> Upload from device</>}
                <input type="file" accept="image/*" disabled={uploading} className="hidden"
                  onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file); }}/>
              </label>
              <span className="text-xs text-gray-400">or paste URL below</span>
              <span className="text-[11px] font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-2 py-1 rounded-lg">Max 20 KB</span>
            </div>
            {imageSizeError && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-xl"><X size={13}/>{imageSizeError}</div>}
            {imageSize !== null && imageSize <= 20 * 1024 && !imageSizeError && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-2 rounded-xl"><CheckCircle size={13}/> Image size: {(imageSize / 1024).toFixed(1)} KB ✓</div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
              <div className="flex gap-2 items-center">
                <input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://… or /images/products/iPhone16.webp" className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-300"/>
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
                <div className="flex flex-col items-center gap-2">
                  <ImageOff size={28} className="text-gray-200"/>
                  <span className="text-[10px] text-gray-300">No photo</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Battery Health ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Battery Health (Optional)</h2>
        <div className="max-w-xs">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Battery Health (%)</label>
          <div className="relative">
            <input type="number" min="0" max="100" step="1" value={form.battery_health} onChange={(e) => set("battery_health", e.target.value)} placeholder="e.g. 89" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"/>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
          </div>
        </div>
      </section>

      {/* ── Badge ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Badge (Optional)</h2>
        <div className="flex flex-wrap gap-2">
          {BADGE_PRESETS.map((b) => (
            <button key={b.label} type="button" onClick={() => { set("badge", b.label); set("badge_color", b.color); }} className="flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-full hover:opacity-90" style={{ backgroundColor: b.color }}>{b.label}</button>
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
          <label className="block text-xs font-semibold text-gray-600 mb-1">WhatsApp Number</label>
          <input value={form.whatsapp_number} onChange={(e) => set("whatsapp_number", e.target.value)} placeholder="+8801XXXXXXXXX" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"/>
        </div>
      </section>

      <div className="flex gap-3">
        <button type="submit" disabled={saving || success || uploading} className="flex-1 flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-sm text-sm">
          {saving && <Loader2 size={15} className="animate-spin"/>}
          {mode === "edit" ? "Save Changes" : "Add Product"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
      </div>
    </form>
  );
}
