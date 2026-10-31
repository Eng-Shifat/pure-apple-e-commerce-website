import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const akey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Guard: during static build these vars can be empty or invalid — validate http protocol
const validUrl = url.startsWith("http") ? url : "https://placeholder.supabase.co";
const validKey = akey && akey.length > 0 ? akey : "placeholder";

export const supabase = createClient(validUrl, validKey);