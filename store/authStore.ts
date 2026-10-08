"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

export const DEMO_ADMIN = { email: "admin@pureapple.com", password: "admin123" };

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

const ADMIN_EMAIL = "admin@pureapple.com";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),

      async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { ok: false, error: error.message };

        const role: "admin" | "customer" =
          data.user.email === ADMIN_EMAIL ? "admin" : "customer";

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