// PUT    /api/offers/[id] → offer update (+ products replace করতে `products` পাঠান)
// DELETE /api/offers/[id] → offer delete

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  { const denied = await requireAdmin(req); if (denied) return denied; }
  const { id } = await params;
  const supabase = getSupabase();
  const body = await req.json();

  const allowed = ["title", "slug", "subtitle", "emoji", "color", "starts_at", "ends_at", "discount_percent", "is_active", "sort_order"];
  const update: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) update[k] = body[k];

  if (update.starts_at && update.ends_at && new Date(update.ends_at as string) <= new Date(update.starts_at as string)) {
    return NextResponse.json({ error: "ends_at must be after starts_at" }, { status: 400 });
  }

  if (Object.keys(update).length) {
    const { error } = await supabase.from("offers").update(update).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (Array.isArray(body.products)) {
    const { error: d } = await supabase.from("offer_products").delete().eq("offer_id", id);
    if (d) return NextResponse.json({ error: d.message }, { status: 500 });
    if (body.products.length) {
      const { error: i } = await supabase.from("offer_products").insert(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        body.products.map((p: any, idx: number) => ({
          offer_id: id, product_id: p.product_id, offer_price: p.offer_price ?? null, sort_order: idx,
        }))
      );
      if (i) return NextResponse.json({ error: i.message }, { status: 500 });
    }
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  { const denied = await requireAdmin(req); if (denied) return denied; }
  const { id } = await params;
  const supabase = getSupabase();
  const { error } = await supabase.from("offers").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
