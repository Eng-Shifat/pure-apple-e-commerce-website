"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

// ── Server-এ admin যাচাই (timeout সহ — spinner যেন কখনো আটকে না থাকে) ──
// এই "verified" সময় শুধু memory-তে থাকে (localStorage-এ না), তাই tab reload হলে আবার যাচাই হয়।
let adminVerifiedAt = 0;
export const markAdminVerified = () => { adminVerifiedAt = Date.now(); };
export const recentlyVerifiedAdmin = (maxAgeMs = 5 * 60_000) => Date.now() - adminVerifiedAt < maxAgeMs;

/** true/false = server-এর উত্তর; throw করলে = network/timeout সমস্যা */
export async function verifyAdminOnServer(token: string, timeoutMs = 6000): Promise<boolean> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch("/api/admin/verify", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: ctrl.signal,
    });
    if (!r.ok) return false;
    const ok = (await r.json()).isAdmin === true;
    if (ok) markAdminVerified();
    return ok;
  } finally {
    clearTimeout(timer);
  }
}

export interface AuthUser {
  id: string;
  email: string;
  role: "admin" | "customer";
  name: string;
}

interface AuthStore {
  user: AuthUser | null;
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  login: (email: string, password: string) => Promise<{ ok: boolean; role?: "admin" | "customer"; error?: string }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),

      async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { ok: false, error: error.message };

        // admin কিনা — server যাচাই করে (client-এর কথায় বিশ্বাস নেই)
        let role: "admin" | "customer" = "customer";
        try {
          if (await verifyAdminOnServer(data.session?.access_token ?? "", 5000)) role = "admin";
        } catch { /* timeout/network হলে customer ধরা হবে; admin হলে /admin layout আবার যাচাই করবে */ }

        set({
          user: {
            id: data.user.id,
            email: data.user.email ?? "",
            role,
            name: data.user.email?.split("@")[0] ?? "User",
          },
        });
        return { ok: true, role };
      },

      async logout() {
        await supabase.auth.signOut();
        set({ user: null });
      },
    }),
    {
      name: "pure-apple-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);