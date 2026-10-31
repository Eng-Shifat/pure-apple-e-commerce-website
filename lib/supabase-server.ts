// SAVE PATH: lib/supabase-server.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Memoized per warm Lambda instance. This helper runs on nearly every
// request (login, logout, /me, admin checks, uploads) — rebuilding the
// Supabase client each time was wasted Active CPU on Vercel's Fluid
// Compute billing. Reuse the same client across requests instead.
let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin() {
  if (_supabaseAdmin) return _supabaseAdmin;
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
  const skey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  _supabaseAdmin = createClient(
    url  || "https://placeholder.supabase.co",
    skey || "placeholder"
  );
  return _supabaseAdmin;
}
