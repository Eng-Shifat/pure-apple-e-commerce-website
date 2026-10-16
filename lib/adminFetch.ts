"use client";
// Admin panel থেকে API call — logged-in session token সহ
import { supabase } from "@/lib/supabase";

export async function adminFetch(input: string, init: RequestInit = {}) {
  const { data } = await supabase.auth.getSession();
  const headers = new Headers(init.headers);
  if (data.session?.access_token) headers.set("Authorization", `Bearer ${data.session.access_token}`);
  return fetch(input, { ...init, headers, cache: "no-store" });
}
