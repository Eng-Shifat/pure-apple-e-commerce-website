"use client";

// app/admin/categories/page.tsx
// ─────────────────────────────────────────────────────────────
// Admin panel — Category Visibility Control
// Toggle on/off করলে shop-এ সাথে সাথে effect হয়
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import {
  ToggleLeft, ToggleRight, RefreshCw,
  Eye, EyeOff, AlertCircle, CheckCircle2,
} from "lucide-react";
import type { CategorySetting } from "@/lib/categories";
import { DEFAULT_CATEGORIES } from "@/lib/categories";

type ToastType = "success" | "error";

interface Toast {
  message: string;
  type: ToastType;
  id: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategorySetting[]>(DEFAULT_CATEGORIES);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState<string | null>(null); // slug being saved
  const [toasts,     setToasts]     = useState<Toast[]>([]);
  const [toastId,    setToastId]    = useState(0);

  // ── Fetch from API ──────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json() as { categories: CategorySetting[] };
      if (data.categories) setCategories(data.categories);
    } catch {
      showToast("Categories load করতে সমস্যা হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // ── Toast helper ────────────────────────────────────────────
  function showToast(message: string, type: ToastType) {
    const id = toastId + 1;
    setToastId(id);
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }

  // ── Toggle handler ──────────────────────────────────────────
  async function handleToggle(cat: CategorySetting) {
    const newVal = !cat.is_enabled;

    // Optimistic update
    setCategories((prev) =>
      prev.map((c) => c.slug === cat.slug ? { ...c, is_enabled: newVal } : c)
    );
    setSaving(cat.slug);

    try {
      const res = await fetch("/api/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: cat.slug, is_enabled: newVal }),
      });

      if (!res.ok) {
        // Revert on failure
        setCategories((prev) =>
          prev.map((c) => c.slug === cat.slug ? { ...c, is_enabled: !newVal } : c)
        );
        showToast(`${cat.label} update করা যায়নি`, "error");
      } else {
        showToast(
          `${cat.icon} ${cat.label} ${newVal ? "চালু" : "বন্ধ"} করা হয়েছে`,
          "success"
        );
      }
    } catch {
      setCategories((prev) =>
        prev.map((c) => c.slug === cat.slug ? { ...c, is_enabled: !newVal } : c)
      );
      showToast("Network error — আবার চেষ্টা করুন", "error");
    } finally {
      setSaving(null);
    }
  }

  const activeCount   = categories.filter((c) => c.is_enabled).length;
  const inactiveCount = categories.filter((c) => !c.is_enabled).length;

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Category Control</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Toggle করুন — OFF করলে shop-এ &ldquo;Coming Soon&rdquo; popup দেখাবে
          </p>
        </div>
        <button
          onClick={fetchCategories}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition-colors">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-2xl font-extrabold text-gray-900">{categories.length}</p>
          <p className="text-xs text-gray-400 font-medium mt-0.5">Total Categories</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-2xl font-extrabold text-green-600">{activeCount}</p>
          <p className="text-xs text-gray-400 font-medium mt-0.5">Live on Shop</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-2xl font-extrabold text-orange-500">{inactiveCount}</p>
          <p className="text-xs text-gray-400 font-medium mt-0.5">Coming Soon</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 mb-5 text-sm text-orange-700">
        <AlertCircle size={16} className="shrink-0 mt-0.5 text-orange-500" />
        <p>
          <strong>কীভাবে কাজ করে:</strong> কোনো category OFF করলে — সেটায় user click করলে
          একটা সুন্দর &ldquo;Coming Soon&rdquo; popup দেখাবে। আবার ON করলে সাথে সাথে live হয়ে যাবে।
        </p>
      </div>

      {/* Category List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-sm">All Categories</h2>
          <span className="text-xs text-gray-400">Toggle = shop visibility</span>
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <div
                key={cat.slug}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors">

                {/* Icon */}
                <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center text-xl shrink-0">
                  {cat.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm">{cat.label}</p>
                    {cat.is_enabled ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                        <Eye size={9} /> Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                        <EyeOff size={9} /> Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{cat.description}</p>
                </div>

                {/* Toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  {saving === cat.slug && (
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  <button
                    onClick={() => handleToggle(cat)}
                    disabled={saving === cat.slug}
                    className="transition-all disabled:opacity-50"
                    aria-label={`Toggle ${cat.label}`}>
                    {cat.is_enabled
                      ? <ToggleRight size={32} className="text-orange-500 hover:text-orange-600 transition-colors" />
                      : <ToggleLeft  size={32} className="text-gray-300 hover:text-gray-400 transition-colors" />
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview link */}
      <p className="text-xs text-gray-400 text-center mt-4">
        Changes are live immediately.{" "}
        <a href="/" target="_blank" className="text-orange-500 font-semibold hover:underline">
          Shop Preview ↗
        </a>
      </p>

      {/* Toasts */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white animate-in slide-in-from-bottom-2 duration-200 whitespace-nowrap
              ${t.type === "success" ? "bg-gray-900" : "bg-red-600"}`}>
            {t.type === "success"
              ? <CheckCircle2 size={15} className="text-green-400" />
              : <AlertCircle  size={15} className="text-red-200" />
            }
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
