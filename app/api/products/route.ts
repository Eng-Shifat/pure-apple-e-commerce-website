import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

// GET /api/products — fetch all products (optionally filter by featured)
export async function GET(req: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get("featured");

  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (featured === "true") {
    query = query.eq("is_featured", true);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data ?? [] });
}

// POST /api/products — create a new product (admin only)
export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const body = await req.json();

  const {
    name, variant, price, original_price,
    rating, review_count, image, slug,
    badge, badge_color,
    spec_screen, spec_ram, spec_camera,
    is_featured,
  } = body;

  if (!name || !price || !slug || !image) {
    return NextResponse.json({ error: "name, price, slug and image are required" }, { status: 400 });
  }

  const { data, error } = await supabase.from("products").insert([{
    name, variant, price: Number(price),
    original_price: original_price ? Number(original_price) : null,
    rating: Number(rating ?? 0),
    review_count: Number(review_count ?? 0),
    image, slug, badge, badge_color,
    spec_screen, spec_ram, spec_camera,
    is_featured: is_featured ?? false,
    created_at: new Date().toISOString(),
  }]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data }, { status: 201 });
}
