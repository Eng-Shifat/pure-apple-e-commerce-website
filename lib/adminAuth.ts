// SAVE PATH: lib/adminAuth.ts
// Server-side only: request কে পাঠিয়েছে + সে admin কিনা — সব admin API এখানের check-এর উপর নির্ভর করে।
//
// Admin হওয়ার উপায় (যেকোনো একটা):
//   1) Vercel/.env-এ ADMIN_EMAILS="you@gmail.com,other@gmail.com" (comma separated) — সবচেয়ে সহজ
//   2) Supabase user-এর app_metadata.role = "admin"  (শুধু server/dashboard থেকে বদলানো যায়)
// ⚠️ user_metadata কখনো ব্যবহার করা হয় না — ওটা যেকোনো user নিজে browser থেকে বদলাতে পারে।
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export interface RequestUser { id: string; email: string; isAdmin: boolean }

function adminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "admin@pureapple.com";
  return raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export async function getRequestUser(req: NextRequest): Promise<RequestUser | null> {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  const { data, error } = await getSupabaseAdmin().auth.getUser(token);
  if (error || !data.user) return null;
  const u = data.user;
  const email = (u.email ?? "").toLowerCase();
  const appMeta = u.app_metadata as { role?: string } | undefined;
  const emailOk = !!email && adminEmails().includes(email);
  return {
    id: u.id,
    email: u.email ?? "",
    isAdmin: appMeta?.role === "admin" || emailOk,
  };
}

/** Admin না হলে 401/403 response ফেরত দেয়; admin হলে null (মানে এগোও) */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const user = await getRequestUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return null;
}
