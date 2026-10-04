import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ cart: [] });
}
export async function POST() {
  return NextResponse.json({ message: "Update cart" });
}
