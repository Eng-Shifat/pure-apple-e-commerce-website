"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, Loader2, CheckCircle, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ProductFormProps {
  initialData?: {
    id?: string;
    name?: string;
    variant?: string;
    price?: number;
    original_price?: number;
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
  };
  mode?: "create" | "edit";
}

const BADGE_PRESETS = [
  { label: "Best Seller", color: "#4FAE53" },
  { label: "Hot Deal",    color: "#FB5724" },
  { label: "New",         color: "#7C3AED" },
  { label: "Limited",     color: "#EF4444" },
];

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/** Returns true only for valid absolute URLs (http/https) */
function isAbsoluteUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** Safe image src: absolute URL passes through, relative path passes through, empty → null */
function safeImageSrc(value: string): string | null {
  if (!value) return null;
  // Relative paths starting with / are valid for Next.js <Image>
  if (value.startsWith("/")) return value;
  // Absolute URLs
  if (isAbsoluteUrl(value)) return value;
  return null;
}

export default function ProductForm({ initialData = {}, mode = "create" }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name:           initialData.name          ?? "",
    variant:        initialData.variant        ?? "",
    price:          initialData.price          ?? "",
    original_price: initialData.original_price ?? "",
    rating:         initialData.rating         ?? "",
    review_count:   initialData.review_count   ?? "",
    image:          initialData.image          ?? "",
    slug:           initialData.slug           ?? "",
    badge:          initialData.badge          ?? "",
    badge_color:    initialData.badge_color    ?? "#FB5724",
    spec_screen:    initialData.spec_screen    ?? "",
    spec_ram:       initialData.spec_ram       ?? "",
    spec_camera:    initialData.spec_camera    ?? "",
    is_featured:    initialData.is_featured    ?? false,
  });

  function set(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(v: string) {
    set("name", v);
    if (!initialData.slug) set("slug", slugify(v));
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError("");

    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      set("image", publicUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(`Image upload failed: ${message}`);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url  = mode === "edit" ? `/api/products/${initialData.id}` : "/api/products";
    const meth = mode === "edit" ? "PUT" : "POST";

    const res = await fetch(url, {
      method: meth,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/admin/products"), 1200);
  }

  const previewSrc = safeImageSrc(form.image);

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {mode === "edit" ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {mode === "edit" ? "Update product details below." : "Fill in the details to add a new product."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-gray-600 underline"
        >
          ← Back
        </button>
      </div>

      {/* Error / Success */}
      {error   && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2"><CheckCircle size={15}/> Saved! Redirecting…</div>}

      {/* ── Section: Basic Info ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Basic Info</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. iPhone 16 Pro"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Variant</label>
            <input
              value={form.variant}
              onChange={(e) => set("variant", e.target.value)}
              placeholder="256GB – Desert Titanium"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Slug *</label>
            <input
              required
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="iphone-16-pro"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => set("is_featured", e.target.checked)}
              className="w-4 h-4 accent-brand-500 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Show in Popular Products (Featured)</span>
          </label>
        </div>
      </section>

      {/* ── Section: Image ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Product Image</h2>

        {/* Upload button */}
        <div className="flex items-center gap-3">
          <label className={`cursor-pointer flex items-center gap-2 border-2 border-dashed rounded-xl px-4 py-3 text-sm transition
            ${uploading ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-brand-300 text-brand-600 hover:bg-brand-50"}`}>
            {uploading ? (
              <><Loader2 size={15} className="animate-spin" /> Uploading…</>
            ) : (
              <><Upload size={15} /> Upload from device</>
            )}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />
          </label>
          <span className="text-xs text-gray-400">or paste URL below</span>
        </div>

        {/* URL input */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL *</label>
          <div className="flex gap-2 items-center">
            <input
              required
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://… or /images/products/iPhone16.webp"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
            {form.image && (
              <button type="button" onClick={() => set("image", "")} className="text-gray-400 hover:text-red-400">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Preview — only render if URL is valid */}
        {previewSrc && (
          <div className="relative w-28 h-28 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden mt-2">
            <Image
              src={previewSrc}
              alt="preview"
              fill
              className="object-contain p-2"
              unoptimized={isAbsoluteUrl(previewSrc)}
            />
          </div>
        )}
      </section>

      {/* ── Section: Pricing ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Pricing</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Sale Price (৳) *</label>
            <input
              required
              type="number"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="114499"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Original Price (৳)</label>
            <input
              type="number"
              value={form.original_price}
              onChange={(e) => set("original_price", e.target.value)}
              placeholder="124999 (for strikethrough)"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
        </div>
      </section>

      {/* ── Section: Rating ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Rating</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Rating (0–5)</label>
            <input
              type="number" min="0" max="5" step="0.1"
              value={form.rating}
              onChange={(e) => set("rating", e.target.value)}
              placeholder="4.8"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Review Count</label>
            <input
              type="number" min="0"
              value={form.review_count}
              onChange={(e) => set("review_count", e.target.value)}
              placeholder="2500"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
        </div>
      </section>

      {/* ── Section: Badge ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Badge (Optional)</h2>

        <div className="flex flex-wrap gap-2">
          {BADGE_PRESETS.map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() => { set("badge", b.label); set("badge_color", b.color); }}
              className="flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-full transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: b.color }}
            >
              {b.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => { set("badge", ""); }}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50"
          >
            No Badge
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Badge Text</label>
            <input
              value={form.badge}
              onChange={(e) => set("badge", e.target.value)}
              placeholder="Best Seller"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Badge Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.badge_color}
                onChange={(e) => set("badge_color", e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-1"
              />
              <input
                value={form.badge_color}
                onChange={(e) => set("badge_color", e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section: Specs ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Specs (shown as pills on card)</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">📱 Screen</label>
            <input
              value={form.spec_screen}
              onChange={(e) => set("spec_screen", e.target.value)}
              placeholder="6.3-inch"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">⚙️ RAM</label>
            <input
              value={form.spec_ram}
              onChange={(e) => set("spec_ram", e.target.value)}
              placeholder="8GB"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">📷 Camera</label>
            <input
              value={form.spec_camera}
              onChange={(e) => set("spec_camera", e.target.value)}
              placeholder="48 MP"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
        </div>
      </section>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || success || uploading}
          className="flex-1 flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 text-sm"
        >
          {saving && <Loader2 size={15} className="animate-spin" />}
          {mode === "edit" ? "Save Changes" : "Add Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
