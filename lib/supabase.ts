import { createClient } from "@supabase/supabase-js";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
const akey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Guard: during static build these vars are empty — createClient still works,
// but actual DB calls will fail (they only run client-side / at request time).
export const supabase = createClient(url || "https://placeholder.supabase.co", akey || "placeholder");
