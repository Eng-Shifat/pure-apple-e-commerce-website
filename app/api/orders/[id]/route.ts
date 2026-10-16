// SAVE PATH: app/api/orders/[id]/route.ts
// GET   /api/orders/[id]  → admin বা order-এর মালিক
// PATCH /api/orders/[id]  → admin only:
//    { action: "approve" }                 → payment verified, order confirm (processing), stock কমবে
//    { action: "reject", reason?: string } → payment rejected, order cancelled
//    { status: "shipped" | ... }           → delivery status বদল

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { getRequestUser } from "@/lib/adminAuth";
import { clearCache } from "@/lib/serverCache";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getRequestUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("orders").select("*, order_items(*, product:products(*))").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  if (!user.isAdmin && data.user_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (user.isAdmin && data.payment_proof_path) {
    const { data: s } = await supabase.storage.from("payment-proofs").createSignedUrl(data.payment_proof_path, 3600);
    data.payment_proof_url = s?.signedUrl ?? null;
  }
  if (!user.isAdmin) delete data.payment_proof_path;
  return NextResponse.json({ order: data });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getRequestUser(req);
  if (!user?.isAdmin) return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const body = await req.json();
  const supabase = getSupabaseAdmin();

  const { data: order, error: findErr } = await supabase
    .from("orders").select("*, order_items(product_id, quantity)").eq("id", id).single();
  if (findErr || !order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // ── Accept payment ─────────────────────────────────────
  if (body.action === "approve") {
    if (order.payment_status === "verified") return NextResponse.json({ error: "Already verified" }, { status: 409 });

    // Stock কমাও (শুধু যেগুলোর stock set করা আছে) — একবারই
    if (!order.stock_deducted) {
      for (const it of (order.order_items ?? []) as { product_id: string | null; quantity: number }[]) {
        if (!it.product_id) continue;
        const { data: pr } = await supabase.from("products").select("stock").eq("id", it.product_id).single();
        if (pr && pr.stock != null) {
          await supabase.from("products").update({ stock: Math.max(0, pr.stock - it.quantity) }).eq("id", it.product_id);
        }
      }
    }

    const { data, error } = await supabase.from("orders").update({
      payment_status: "verified", status: "processing", reject_reason: null,
      payment_reviewed_at: new Date().toISOString(), stock_deducted: true,
    }).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    clearCache("products:"); // stock বদলেছে
    return NextResponse.json({ order: data });
  }

  // ── Reject payment ─────────────────────────────────────
  if (body.action === "reject") {
    const { data, error } = await supabase.from("orders").update({
      payment_status: "rejected", status: "cancelled",
      reject_reason: String(body.reason ?? "").trim() || null,
      payment_reviewed_at: new Date().toISOString(),
    }).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ order: data });
  }

  // ── Delivery status ────────────────────────────────────
  const VALID = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!VALID.includes(body.status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  if (order.payment_status === "pending_review" && body.status !== "cancelled")
    return NextResponse.json({ error: "আগে payment accept করুন" }, { status: 409 });

  const { data, error } = await supabase.from("orders").update({ status: body.status }).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ order: data });
}
