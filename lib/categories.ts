// lib/categories.ts
// ─────────────────────────────────────────────────────────────
// Category config + Supabase fetch helpers
// ─────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

// ── Types ──────────────────────────────────────────────────────

export interface CategorySetting {
  id: number;
  slug: string;
  label: string;
  icon: string;
  description: string;
  is_enabled: boolean;
  sort_order: number;
}

// ── Static fallback (used when DB call fails) ──────────────────

export const DEFAULT_CATEGORIES: CategorySetting[] = [
  { id: 1, slug: "iphone",      label: "iPhone",      icon: "📱", description: "Apple iPhone — সকল মডেল",        is_enabled: true, sort_order: 1 },
  { id: 2, slug: "android",     label: "Android",     icon: "🤖", description: "Android Phones — iPhone ছাড়া",  is_enabled: true, sort_order: 2 },
  { id: 3, slug: "charger",     label: "Charger",     icon: "🔌", description: "Fast Chargers & Adapters",        is_enabled: true, sort_order: 3 },
  { id: 4, slug: "speaker",     label: "Speaker",     icon: "🔊", description: "Bluetooth & Wired Speakers",      is_enabled: true, sort_order: 4 },
  { id: 5, slug: "earbuds",     label: "Ear Buds",    icon: "🎧", description: "TWS & Wired Earphones",           is_enabled: true, sort_order: 5 },
  { id: 6, slug: "powerbank",   label: "Power Bank",  icon: "🔋", description: "Portable Power Banks",            is_enabled: true, sort_order: 6 },
  { id: 7, slug: "cables",      label: "Cables",      icon: "🔗", description: "USB-C, Lightning & More",         is_enabled: true, sort_order: 7 },
  { id: 8, slug: "accessories", label: "Accessories", icon: "🎒", description: "Cases, Screen Guards & More",     is_enabled: true, sort_order: 8 },
];

// ── Server-side fetch (Server Components & API routes) ─────────

export async function getCategorySettings(): Promise<CategorySetting[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data, error } = await supabase
      .from("category_settings")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return DEFAULT_CATEGORIES;
    return data as CategorySetting[];
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

// Single category by slug
export async function getCategoryBySlug(slug: string): Promise<CategorySetting | null> {
  const all = await getCategorySettings();
  return all.find((c) => c.slug === slug) ?? null;
}

// Update enabled state (admin only — uses service role)
export async function updateCategoryEnabled(
  slug: string,
  is_enabled: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { error } = await supabase
      .from("category_settings")
      .update({ is_enabled })
      .eq("slug", slug);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
