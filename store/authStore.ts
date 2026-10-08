"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const DEMO_ADMIN = { email: "admin@pureapple.com", password: "admin123" };

interface AuthStore {
  user: { email: string; role: "admin" | "customer"; name: string } | null;
  login: (email: string, password: string) => { ok: boolean; role?: "admin" | "customer"; error?: string };
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,

      login(email, password) {
        if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
          set({ user: { email, role: "admin", name: "Admin" } });
          return { ok: true, role: "admin" };
        }
        if (email && password.length >= 6) {
          set({ user: { email, role: "customer", name: email.split("@")[0] } });
          return { ok: true, role: "customer" };
        }
        return { ok: false, error: "Invalid email or password" };
      },

      logout() {
        set({ user: null });
      },
    }),
    { name: "pure-apple-auth" }
  )
);
