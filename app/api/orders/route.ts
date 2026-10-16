// SAVE PATH: app/api/orders/route.ts
// GET  /api/orders  → admin: সব order (screenshot link সহ) | logged-in customer: নিজের order | guest: খালি
// POST /api/orders  → multipart/form-data: payload (JSON) + proof (screenshot image)

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { getRequestUser } from "@/lib/adminAuth";
import { deliveryCharge, minAdvanceFor, type DeliveryArea } from "@/lib/shopConfig";
import { validatePhone } from "@/lib/validations";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_PROOF_BYTES = 6 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function GET(req: NextRequest) {
  const user = await getRequestUser(req);
  if (!user) return NextResponse.json({ orders: [] });

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("orders")
    .select("*, order_items(*, product:products(*))")
    .order("created_at", { ascending: false });
  if (!user.isAdmin) query = query.eq("user_id", user.id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const orders = data ?? [];

  if (user.isAdmin) {
    const paths = orders.map((o) => o.payment_proof_path).filter(Boolean) as string[];
    if (paths.length) {
      const { data: signed } = await supabase.storage.from("payment-proofs").createSignedUrls(paths, 3600);
      const map = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));
      for (const o of orders) o.payment_proof_url = o.payment_proof_path ? map.get(o.payment_proof_path) ?? null : null;
    }
  } else {
    for (const o of orders) delete o.payment_proof_path;
  }
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  let form: FormData;
  try { form = await req.formData(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }

  let p: {
    items?: { product_id: string; quantity: number; price: number; name?: string; variant?: string; image?: string }[];
    shipping_name?: string; shipping_phone?: string; shipping_address?: string; shipping_city?: string; note?: string;
    delivery_area?: DeliveryArea; payment_method?: "cod" | "bkash" | "nagad"; advance_method?: "bkash" | "nagad";
    advance_amount?: number; payment_trx_id?: string; payment_sender?: string;
  };
  try { p = JSON.parse(String(form.get("payload") ?? "{}")); } catch { return NextResponse.json({ error: "Invalid payload" }, { status: 400 }); }

  const proof = form.get("proof");

  // ── Validate ─────────────────────────────────────────────
  if (!p.items?.length || !p.shipping_name?.trim() || !p.shipping_address?.trim() || !p.shipping_city?.trim())
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  if (!validatePhone(p.shipping_phone ?? ""))
    return NextResponse.json({ error: "Valid BD phone number দিন" }, { status: 400 });
  if (p.delivery_area !== "dhaka" && p.delivery_area !== "outside")
    return NextResponse.json({ error: "Delivery area select করুন" }, { status: 400 });
  if (!["cod", "bkash", "nagad"].includes(p.payment_method ?? ""))
    return NextResponse.json({ error: "Payment method select করুন" }, { status: 400 });

  const advanceMethod = p.payment_method === "cod" ? p.advance_method : p.payment_method;
  if (advanceMethod !== "bkash" && advanceMethod !== "nagad")
    return NextResponse.json({ error: "Advance কোন wallet-এ পাঠিয়েছেন (bKash / Nagad) select করুন" }, { status: 400 });

  const items = p.items.map((i) => ({
    product_id: String(i.product_id ?? "").split(":")[0], // variant id ("uuid:Color") থেকে আসল id
    quantity: Math.max(1, Math.min(10, Math.floor(Number(i.quantity) || 1))),
    price: Math.max(0, Number(i.price) || 0),
    name: i.name ?? null, variant: i.variant ?? null, image: i.image ?? null,
  }));

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = deliveryCharge(p.delivery_area);
  const total = subtotal + delivery;
  const minAdv = minAdvanceFor(total);
  const advance = Math.round(Number(p.advance_amount) || 0);

  if (advance < minAdv) return NextResponse.json({ error: `Minimum ৳${minAdv.toLocaleString("en-BD")} advance পাঠাতে হবে` }, { status: 400 });
  if (advance > total) return NextResponse.json({ error: "Advance total-এর বেশি হতে পারে না" }, { status: 400 });

  const trx = (p.payment_trx_id ?? "").trim().toUpperCase();
  if (!/^[A-Z0-9]{6,20}$/.test(trx)) return NextResponse.json({ error: "সঠিক Transaction ID দিন" }, { status: 400 });
  if (!validatePhone(p.payment_sender ?? "")) return NextResponse.json({ error: "যে নম্বর থেকে টাকা পাঠিয়েছেন সেটা দিন" }, { status: 400 });

  if (!(proof instanceof File) || proof.size === 0) return NextResponse.json({ error: "Payment-এর screenshot দিন" }, { status: 400 });
  const ext = ALLOWED_TYPES[proof.type];
  if (!ext) return NextResponse.json({ error: "Screenshot JPG / PNG / WEBP হতে হবে" }, { status: 400 });
  if (proof.size > MAX_PROOF_BYTES) return NextResponse.json({ error: "Screenshot ৬MB-এর কম হতে হবে" }, { status: 400 });

  const supabase = getSupabaseAdmin();

  // Stock check (যে product-এর stock set করা আছে)
  const ids = Array.from(new Set(items.map((i) => i.product_id).filter((id) => UUID.test(id))));
  if (ids.length) {
    const { data: prods } = await supabase.from("products").select("id,name,stock,is_available").in("id", ids);
    for (const pr of prods ?? []) {
      const qty = items.filter((i) => i.product_id === pr.id).reduce((s, i) => s + i.quantity, 0);
      if (pr.is_available === false || (pr.stock != null && pr.stock < qty))
        return NextResponse.json({ error: `"${pr.name}" এখন stock-এ নেই বা পর্যাপ্ত নেই` }, { status: 409 });
    }
  }

  const user = await getRequestUser(req);

  // ── Create order ─────────────────────────────────────────
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert([{
      user_id: user?.id ?? null,
      status: "pending",
      payment_status: "pending_review",
      subtotal, delivery_area: p.delivery_area, delivery_charge: delivery, total,
      shipping_name: p.shipping_name.trim(), shipping_phone: p.shipping_phone!.replace(/\s/g, ""),
      shipping_address: p.shipping_address.trim(), shipping_city: p.shipping_city.trim(),
      note: p.note?.trim() || null,
      payment_method: p.payment_method,
      advance_amount: advance, advance_method: advanceMethod,
      payment_trx_id: trx, payment_sender: p.payment_sender!.replace(/\s/g, ""),
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();
  if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 500 });

  const rollback = async () => { await supabase.from("orders").delete().eq("id", order.id); };

  // Screenshot upload (private bucket)
  const path = `${order.id}/${Date.now()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("payment-proofs")
    .upload(path, Buffer.from(await proof.arrayBuffer()), { contentType: proof.type, upsert: false });
  if (upErr) { await rollback(); return NextResponse.json({ error: `Screenshot upload হয়নি: ${upErr.message}` }, { status: 500 }); }
  await supabase.from("orders").update({ payment_proof_path: path }).eq("id", order.id);

  const { error: itemsErr } = await supabase.from("order_items").insert(
    items.map((i) => ({
      order_id: order.id,
      product_id: UUID.test(i.product_id) ? i.product_id : null,
      quantity: i.quantity, price: i.price,
      product_name: i.name, variant: i.variant, image: i.image,
    }))
  );
  if (itemsErr) {
    await supabase.storage.from("payment-proofs").remove([path]);
    await rollback();
    return NextResponse.json({ error: itemsErr.message }, { status: 500 });
  }

  if (user) await supabase.from("cart_items").delete().eq("user_id", user.id);

  return NextResponse.json({ order: { id: order.id, total, advance_amount: advance, payment_status: "pending_review" } }, { status: 201 });
}