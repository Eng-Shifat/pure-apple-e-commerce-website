import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

async function getUserId(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data } = await getSupabaseAdmin().auth.getUser(token);
  return data.user?.id ?? null;
}

export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("orders")
    .select("*, order_items(*, product:products(*))")
    .order("created_at", { ascending: false });

  if (userId) query = query.eq("user_id", userId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data ?? [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    items, shipping_name, shipping_phone,
    shipping_address, shipping_city, payment_method,
  } = body;

  if (!items?.length || !shipping_name || !shipping_phone || !shipping_address || !shipping_city)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const userId = await getUserId(req);
  const supabase = getSupabaseAdmin();

  const total = items.reduce(
    (s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0
  );

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert([{
      user_id: userId,
      status: "pending",
      total,
      shipping_name, shipping_phone, shipping_address, shipping_city,
      payment_method: payment_method ?? "cod",
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 500 });

  const orderItems = items.map((i: { product_id: string; quantity: number; price: number }) => ({
    order_id: order.id,
    product_id: i.product_id,
    quantity: i.quantity,
    price: i.price,
  }));

  const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 });

  // Clear cart for logged-in users
  if (userId) {
    await supabase.from("cart_items").delete().eq("user_id", userId);
  }

  return NextResponse.json({ order }, { status: 201 });
}
