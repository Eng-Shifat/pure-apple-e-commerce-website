// SAVE PATH: app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import { expireTodaysDeals } from "@/lib/todaysDeal";
import { cacheGet, cacheSet, clearCache } from "@/lib/serverCache";
import path from "path";

let imageIndex: Map<string, string> | null = null;
function getImageIndex() {
  if (imageIndex) return imageIndex;
  const map = new Map<string, string>();
  const root = path.join(process.cwd(), "public");
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else map.set(e.name.toLowerCase(), "/" + path.relative(root, full).split(path.sep).join("/"));
    }
  };
  try { walk(path.join(root, "images")); } catch {}
  return (imageIndex = map);
}
function fixLocalImage(image: unknown) {
  if (typeof image !== "string" || !/^(file:|[a-zA-Z]:[\\/])/.test(image)) return image;
  let decoded = image;
  try { decoded = decodeURIComponent(image); } catch {}
  const name = decoded.split(/[\\\/]/).pop()!.toLowerCase();
  return getImageIndex().get(name) ?? image;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET /api/products
export async function GET(req: NextRequest) {
  // 20 sec memory cache — same query বারবার Supabase-এ যাবে না
  const cacheKey = "products:" + req.nextUrl.search;
  const cached = cacheGet<{ products: unknown[] }>(cacheKey);
  if (cached) return NextResponse.json(cached);

  const supabase = getSupabase();
  const { searchParams } = new URL(req.url);

  const featured    = searchParams.get("featured");
  const category    = searchParams.get("category");
  const condition   = searchParams.get("condition");
  const deals       = searchParams.get("deals");
  const badge       = searchParams.get("badge");
  const q           = searchParams.get("q");
  const available   = searchParams.get("available");
  const slug        = searchParams.get("slug");
  const limit       = searchParams.get("limit");
  const today_deal  = searchParams.get("today_deal"); // NEW: today's deal filter

  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (featured === "true")  query = query.eq("is_featured", true);
  if (category)             query = query.eq("category", category);
  if (condition)            query = query.eq("condition", condition);
  if (deals === "true")     query = query.not("badge", "is", null).neq("badge", "");
  if (badge)                query = query.eq("badge", badge);
  if (available === "true") query = query.eq("is_available", true);
  if (q)                    query = query.ilike("name", `%${q}%`);
  if (slug)                 query = query.eq("slug", slug);
  if (limit)                query = query.limit(Number(limit));

  // today_deal=true → is_today_deal active AND (deal_ends_at is null OR deal_ends_at > now)
  if (today_deal === "true") {
    await expireTodaysDeals(supabase); // timer শেষ হলে DB-তেই deal OFF
    query = query
      .eq("is_today_deal", true)
      .or("deal_ends_at.is.null,deal_ends_at.gt." + new Date().toISOString());
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const payload = { products: (data ?? []).map((p) => ({ ...p, image: fixLocalImage(p.image) })) };
  cacheSet(cacheKey, payload, 20_000);
  return NextResponse.json(payload);
}

// POST /api/products
export async function POST(req: NextRequest) {
  { const denied = await requireAdmin(req); if (denied) return denied; }
  const supabase = getSupabase();
  const body = await req.json();

  const {
    name, variant, price, original_price,
    rating, review_count, image, slug,
    badge, badge_color,
    spec_screen, spec_ram, spec_camera,
    is_featured, category, condition, stock,
    product_code, colors, storage_variants,
    storage_prices, region_prices, regions,
    emi_available, whatsapp_number, battery_health,
    // Today's deal fields
    is_today_deal, deal_price, deal_ends_at,
  } = body;

  if (!name || !price || !slug || !image) {
    return NextResponse.json({ error: "name, price, slug and image are required" }, { status: 400 });
  }

  const { data, error } = await supabase.from("products").insert([{
    name, variant,
    price: Number(price),
    original_price: original_price ? Number(original_price) : null,
    rating: Number(rating ?? 0),
    review_count: Number(review_count ?? 0),
    image, slug, badge, badge_color,
    spec_screen, spec_ram, spec_camera,
    is_featured: is_featured ?? false,
    category: category ?? "",
    condition: condition ?? "brand-new",
    is_available: true,
    stock: stock ? Number(stock) : null,
    product_code: product_code ?? null,
    colors: colors ?? null,
    storage_variants: storage_variants ?? null,
    storage_prices:   storage_prices   ?? null,
    region_prices:    region_prices    ?? null,
    regions:          regions          ?? null,
    emi_available: emi_available ?? false,
    whatsapp_number: whatsapp_number ?? null,
    ...(battery_health !== undefined && battery_health !== null && battery_health !== ""
      ? { battery_health: Math.min(100, Math.max(0, Number(battery_health))) }
      : {}),
    // Today's deal
    is_today_deal: is_today_deal ?? false,
    deal_price:    deal_price ? Number(deal_price) : null,
    deal_ends_at:  deal_ends_at ?? null,
    created_at: new Date().toISOString(),
  }]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  clearCache("products:");
  return NextResponse.json({ product: data }, { status: 201 });
}
