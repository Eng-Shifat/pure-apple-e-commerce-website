import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
  const skey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createClient(
    url  || "https://placeholder.supabase.co",
    skey || "placeholder"
  );
}
