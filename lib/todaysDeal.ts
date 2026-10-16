// SAVE PATH: lib/todaysDeal.ts
// Today's Deal helpers (server only)
// - expireTodaysDeals: timer শেষ হওয়া deal DB-তে নিজে থেকেই OFF করে দেয়
// - todaysDealOffer:   active Today's Deal গুলোকে একটা "Today's Deal" offer হিসেবে সাজায়

import type { SupabaseClient } from "@supabase/supabase-js";
import { validDealPrice, type Offer } from "@/lib/offers";

export const TODAYS_DEAL_SLUG = "todays-deal";
const OPEN_ENDED = "2099-12-31T00:00:00.000Z";

let lastExpireRun = 0;

export async function expireTodaysDeals(supabase: SupabaseClient) {
  // প্রতি request-এ DB write না করে ৩০ সেকেন্ডে একবার
  if (Date.now() - lastExpireRun < 30_000) return;
  lastExpireRun = Date.now();
  try {
    await supabase
      .from("products")
      .update({ is_today_deal: false, deal_price: null, deal_ends_at: null })
      .eq("is_today_deal", true)
      .not("deal_ends_at", "is", null)
      .lte("deal_ends_at", new Date().toISOString());
  } catch { /* best-effort */ }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function todaysDealOffer(supabase: SupabaseClient): Promise<Offer | null> {
  await expireTodaysDeals(supabase);

  const now = new Date().toISOString();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_today_deal", true)
    .or(`deal_ends_at.is.null,deal_ends_at.gt.${now}`)
    .order("created_at", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: any[] = data ?? [];
  if (rows.length === 0) return null;

  const timed = rows.filter((r) => r.deal_ends_at);
  const noTimer = timed.length < rows.length;
  const endsAt = noTimer
    ? OPEN_ENDED
    : new Date(Math.max(...timed.map((r) => new Date(r.deal_ends_at).getTime()))).toISOString();

  return {
    id: "todays-deal",
    title: "Today's Deal",
    slug: TODAYS_DEAL_SLUG,
    subtitle: "আজকের বিশেষ অফার — সময় শেষ হলেই শেষ!",
    emoji: "⚡",
    color: "#F97316",
    starts_at: new Date(Date.now() - 1000).toISOString(),
    ends_at: endsAt,
    no_timer: noTimer,
    discount_percent: null,
    is_active: true,
    sort_order: -1, // সবার আগে
    status: "live",
    product_count: rows.length,
    products: rows.map((p) => ({
      id: p.id, name: p.name, slug: p.slug, image: p.image, variant: p.variant,
      price: Number(p.price), original_price: p.original_price,
      offer_price: validDealPrice(Number(p.price), p.deal_price),
      rating: p.rating, review_count: p.review_count,
      badge: p.badge, badge_color: p.badge_color,
      spec_screen: p.spec_screen, spec_ram: p.spec_ram, spec_camera: p.spec_camera,
    })),
  };
}
