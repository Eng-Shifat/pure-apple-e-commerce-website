// Server-side: request কে কে পাঠিয়েছে + admin কিনা
import type { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const ADMIN_EMAIL = "admin@pureapple.com"; // authStore-এর সাথে একই

export interface RequestUser { id: string; email: string; isAdmin: boolean }

export async function getRequestUser(req: NextRequest): Promise<RequestUser | null> {
  const token = req.headers.get("authorization")?.replace("Bearer ", "").trim();
  if (!token) return null;
  const { data, error } = await getSupabaseAdmin().auth.getUser(token);
  if (error || !data.user) return null;
  const u = data.user;
  const meta = u.user_metadata as { role?: string } | undefined;
  return {
    id: u.id,
    email: u.email ?? "",
    isAdmin: meta?.role === "admin" || u.email === ADMIN_EMAIL,
  };
}
