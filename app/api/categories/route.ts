// app/api/categories/route.ts
// ─────────────────────────────────────────────────────────────
// GET  /api/categories          → সব categories
// PATCH /api/categories         → { slug, is_enabled } → toggle
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getCategorySettings, updateCategoryEnabled } from "@/lib/categories";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  const categories = await getCategorySettings();
  return NextResponse.json({ categories });
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

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
