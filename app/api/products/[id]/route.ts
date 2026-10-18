// SAVE PATH: app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { clearCache } from "@/lib/serverCache";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET /api/products/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ product: data });
}

// PUT /api/products/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  { const denied = await requireAdmin(req); if (denied) return denied; }
  const { id } = await params;
  const supabase = getSupabase();
  const body = await req.json();

  const allowed = [
    "name", "variant", "price", "original_price", "rating", "review_count",
    "image", "slug", "badge", "badge_color",
    "spec_screen", "spec_ram", "spec_camera",
    "is_featured", "is_hot_deal", "is_published",
    "category", "condition", "is_available", "stock",
    "product_code", "colors", "storage_variants",
    "storage_prices", "region_prices", "regions",
    "emi_available", "whatsapp_number", "battery_health",
    // Legacy today's deal
    "is_today_deal", "deal_price", "deal_ends_at",
    // New: condition-specific prices
    "brand_new_price", "pre_owned_price",
    // New: offer system
    "offer_price_brand_new", "offer_price_pre_owned",
    "offer_ends_at", "offer_type",
  ];

  const payload: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) payload[key] = body[key];
  }

  const numOrNull = (v: unknown) =>
    v === "" || v === null || v === undefined || Number.isNaN(Number(v)) ? null : Number(v);

  for (const k of [
    "original_price", "stock", "deal_price", "battery_health",
    "brand_new_price", "pre_owned_price",
    "offer_price_brand_new", "offer_price_pre_owned",
  ]) {
    if (k in payload) payload[k] = numOrNull(payload[k]);
  }
  for (const k of ["price", "rating", "review_count"]) {
    if (k in payload) {
      const n = numOrNull(payload[k]);
      if (n === null) delete payload[k]; else payload[k] = n;
    }
  }

  // brand_new_price → price sync (backward compat)
  if (payload.brand_new_price != null) {
    payload.price = payload.brand_new_price;
  }

  if (payload.battery_health != null && (Number(payload.battery_health) < 0 || Number(payload.battery_health) > 100)) {
    return NextResponse.json({ error: "Battery health must be between 0 and 100" }, { status: 400 });
  }

  // offer_ends_at = "" or explicit null → clear offer
  if (body.offer_ends_at === "" || body.offer_ends_at === null) {
    payload.offer_ends_at = null;
  }
  // Clearing offer: if both offer prices removed, also clear offer_type
  if (payload.offer_price_brand_new === null && payload.offer_price_pre_owned === null) {
    payload.offer_type = null;
    payload.offer_ends_at = null;
  }

  payload.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("products").update(payload).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  clearCache("products:");
  return NextResponse.json({ product: data });
}
