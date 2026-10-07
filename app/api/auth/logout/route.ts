import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function POST() {
  const supabase = getSupabaseAdmin();
  await supabase.auth.signOut();
  return NextResponse.json({ message: "Logged out" });
}
