// SAVE PATH: lib/adminFetch.ts
// Admin panel থেকে API call: login token সাথে পাঠায়, server যাচাই করে।
import { supabase } from "@/lib/supabase";

export async function adminFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const { data } = await supabase.auth.getSession();
  const headers = new Headers(init.headers);
  if (data.session?.access_token) headers.set("Authorization", `Bearer ${data.session.access_token}`);
  return fetch(input, { ...init, headers });
}
