import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { order_id, amount, method } = body;

  if (!order_id || !amount)
    return NextResponse.json({ error: "order_id and amount required" }, { status: 400 });

  // COD — no gateway needed
  if (method === "cod") {
    return NextResponse.json({ status: "confirmed", order_id, method: "cod" });
  }

  // bKash / Nagad — integrate SSLCommerz or bKash API here
  // For now return a mock redirect URL
  const mockUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/checkout/success?order_id=${order_id}`;
  return NextResponse.json({ redirect_url: mockUrl, order_id, method });
}
