// app/api/offers/route.ts
// GET  /api/offers                → live + upcoming offers (products সহ) — homepage
// GET  /api/offers?slug=black-friday → একটা offer, সব product সহ
// GET  /api/offers?all=true       → admin: সব offer (ended সহ)
// POST /api/offers                → admin: নতুন offer + product_ids

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { createClient } from "@supabase/supabase-js";
import { offerStatus, resolveOfferPrice, type Offer } from "@/lib/offers";
import { todaysDealOffer, TODAYS_DEAL_SLUG } from "@/lib/todaysDeal";

export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shapeOffer(row: any, withProducts: boolean, productLimit?: number): Offer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const links: any[] = (row.offer_products ?? [])
    .filter((l: any) => l.products)
    .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const { offer_products: _omit, ...rest } = row;
  void _omit;

  const offer: Offer = {
    ...rest,
    status: offerStatus(row),
    product_count: links.length,
  };

  if (withProducts) {
    const list = productLimit ? links.slice(0, productLimit) : links;
    offer.products = list.map((l) => {
      const p = l.products;
      return {
        id: p.id, name: p.name, slug: p.slug, image: p.image, variant: p.variant,
        price: Number(p.price), original_price: p.original_price,
        offer_price: resolveOfferPrice(Number(p.price), l.offer_price, row.discount_percent),
        rating: p.rating, review_count: p.review_count,
        badge: p.badge, badge_color: p.badge_color,
        spec_screen: p.spec_screen, spec_ram: p.spec_ram, spec_camera: p.spec_camera,
      };
    });
  }
  return offer;
}

const SELECT = "*, offer_products(offer_price, sort_order, products(*))";

export async function GET(req: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(req.url);
  const slug  = searchParams.get("slug");
  const all   = searchParams.get("all");
  const limit = searchParams.get("limit"); // product limit per offer
  let todays: Offer | null = null;

  // Today's Deal (product-based) — timer শেষ হলে নিজে থেকেই off + এই list থেকে বাদ
  if (all !== "true" && (!slug || slug === TODAYS_DEAL_SLUG)) {
    const deal = await todaysDealOffer(supabase);
    if (slug === TODAYS_DEAL_SLUG) {
      if (!deal) return NextResponse.json({ error: "Offer not found" }, { status: 404 });
      return NextResponse.json({ offer: deal });
    }
    todays = deal;
  }

  let q = supabase.from("offers").select(SELECT).order("sort_order").order("starts_at");

  if (slug) q = q.eq("slug", slug);
  else if (all !== "true") {
    // ended offer নিজে থেকেই বাদ — admin কিছু করতে হবে না
    q = q.eq("is_active", true).gt("ends_at", new Date().toISOString());
  }

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const withProducts = all !== "true";
  const offers = (data ?? []).map((r) => shapeOffer(r, withProducts, limit ? Number(limit) : undefined));

  // live আগে, তারপর upcoming (যেটা আগে শুরু হবে সেটা আগে)
  if (!slug && all !== "true") {
    offers.sort((a, b) => {
      if (a.status !== b.status) return a.status === "live" ? -1 : 1;
      return a.status === "live"
        ? a.sort_order - b.sort_order
        : new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime();
    });
  }

  if (todays) {
    const lim = limit ? Number(limit) : undefined;
    offers.unshift(lim ? { ...todays, products: todays.products?.slice(0, lim) } : todays);
  }

  if (slug) {
    if (!offers[0]) return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    return NextResponse.json({ offer: offers[0] });
  }
  return NextResponse.json({ offers });
}

export async function POST(req: NextRequest) {
  { const denied = await requireAdmin(req); if (denied) return denied; }
  const supabase = getSupabase();
  const body = await req.json();
  const { title, slug, subtitle, emoji, color, starts_at, ends_at, discount_percent, is_active, sort_order, products } = body as {
    title?: string; slug?: string; subtitle?: string; emoji?: string; color?: string;
    starts_at?: string; ends_at?: string; discount_percent?: number | null;
    is_active?: boolean; sort_order?: number;
    products?: { product_id: string; offer_price?: number | null }[];
  };

  if (!title || !slug || !ends_at) {
    return NextResponse.json({ error: "title, slug and ends_at are required" }, { status: 400 });
  }
  if (starts_at && new Date(ends_at) <= new Date(starts_at)) {
    return NextResponse.json({ error: "ends_at must be after starts_at" }, { status: 400 });
  }

  const { data: offer, error } = await supabase.from("offers").insert([{
    title, slug, subtitle: subtitle ?? null, emoji: emoji ?? "🔥", color: color ?? "#FB5724",
    starts_at: starts_at ?? new Date().toISOString(), ends_at,
    discount_percent: discount_percent ?? null,
    is_active: is_active ?? true, sort_order: sort_order ?? 0,
  }]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (products?.length) {
    const { error: e2 } = await supabase.from("offer_products").insert(
      products.map((p, i) => ({ offer_id: offer.id, product_id: p.product_id, offer_price: p.offer_price ?? null, sort_order: i }))
    );
    if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });
  }
  return NextResponse.json({ offer }, { status: 201 });
}
