import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { order_id } = body;

  if (!order_id) return NextResponse.json({ error: "order_id required" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  await supabase.from("orders").update({ status: "processing" }).eq("id", order_id);

  return NextResponse.json({ message: "Payment confirmed", order_id });
}
