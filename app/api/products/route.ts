import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET /api/products
export async function GET(req: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(req.url);

  const featured   = searchParams.get("featured");
  const category   = searchParams.get("category");
  const condition  = searchParams.get("condition");
  const deals      = searchParams.get("deals");
  const q          = searchParams.get("q");
  const available  = searchParams.get("available");

  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (featured === "true")        query = query.eq("is_featured", true);
  if (category)                   query = query.eq("category", category);
  if (condition)                  query = query.eq("condition", condition);
  if (deals === "true")           query = query.eq("badge", "Hot Deal");
  if (available === "true")       query = query.eq("is_available", true);
  if (q)                          query = query.ilike("name", `%${q}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data ?? [] });
}

// POST /api/products
export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const body = await req.json();

  const {
    name, variant, price, original_price,
    rating, review_count, image, slug,
    badge, badge_color,
    spec_screen, spec_ram, spec_camera,
    is_featured, category, condition, stock,
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
    created_at: new Date().toISOString(),
  }]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data }, { status: 201 });
}
