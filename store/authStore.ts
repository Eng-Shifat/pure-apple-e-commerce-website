"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  accessToken?: string;
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
        // সরাসরি Supabase-এ না গিয়ে Next.js API route দিয়ে login — CORS সমস্যা নেই
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          return { ok: false, error: data.error ?? "Login failed" };
        }

        const { user: u, session } = await res.json();
        const token = session?.access_token ?? "";

        // admin কিনা — server যাচাই করে
        let role: "admin" | "customer" = "customer";
        try {
          if (await verifyAdminOnServer(token, 5000)) role = "admin";
        } catch { /* timeout/network হলে customer ধরা হবে */ }

        set({
          user: {
            id: u.id,
            email: u.email ?? "",
            role,
            name: u.email?.split("@")[0] ?? "User",
            accessToken: token,
          },
        });
        return { ok: true, role };
      },

      async logout() {
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
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