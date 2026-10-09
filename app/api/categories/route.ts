// app/api/categories/route.ts
// ─────────────────────────────────────────────────────────────
// GET  /api/categories          → সব categories
// PATCH /api/categories         → { slug, is_enabled } → toggle
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getCategorySettings, updateCategoryEnabled } from "@/lib/categories";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Helper: check if request is from an admin user
async function isAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    // Get auth token from cookie
    const token = cookieStore.get("sb-access-token")?.value
      ?? cookieStore.get("supabase-auth-token")?.value;

    if (!token) {
      // Fallback: check service role header
      return false;
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return false;

    // Check user metadata or a profiles table for admin role
    const userMeta = user.user_metadata as { role?: string } | undefined;
    return userMeta?.role === "admin";
  } catch {
    return false;
  }
}

export async function GET() {
  const categories = await getCategorySettings();
  return NextResponse.json({ categories });
}

export async function PATCH(req: NextRequest) {
  // Auth check — must be admin
  // Note: your existing auth uses a custom JWT cookie. Adjust isAdmin() if needed.
  // For now we also accept requests with the service role key in header.
  const authHeader = req.headers.get("x-admin-key");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminByKey = authHeader === serviceKey;
  const adminBySession = await isAdmin();

  if (!adminByKey && !adminBySession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json() as { slug?: string; is_enabled?: boolean };

  if (!body.slug || typeof body.is_enabled !== "boolean") {
    return NextResponse.json({ error: "slug and is_enabled required" }, { status: 400 });
  }

  const result = await updateCategoryEnabled(body.slug, body.is_enabled);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
