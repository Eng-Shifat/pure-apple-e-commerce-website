// SAVE PATH: app/api/admin/verify/route.ts
// Browser জিজ্ঞেস করে: "আমি কি সত্যিই admin?" — উত্তর server দেয়, localStorage না।
import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getRequestUser(req);
  return NextResponse.json({ isAdmin: !!user?.isAdmin });
}
