"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore, DEMO_ADMIN } from "@/store/authStore";
import { Eye, EyeOff, Loader2, LogIn, Mail, Lock } from "lucide-react";
import Navbar from "@/components/shop/Navbar";
import MobileBottomNav from "@/components/shop/MobileBottomNav";
import ShineLogo from "@/components/shop/ShineLogo";

export default function LoginPage() {
  const router    = useRouter();
  const login     = useAuthStore((s) => s.login);
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  function fillAdmin() {
    setEmail(DEMO_ADMIN.email);
    setPassword(DEMO_ADMIN.password);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? "Login failed");
      return;
    }
    router.push(result.role === "admin" ? "/admin" : "/");
  }

  return (
    <>
      {/* ── Top Navbar ── */}
      <Navbar />

      {/* ── Main ── */}
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50 flex items-center justify-center px-4 py-10 pb-28">

        <div className="w-full max-w-sm">

          {/* ── Brand header ── */}
          <div className="flex flex-col items-center mb-8">
            <ShineLogo height={56} priority />
            <p className="text-gray-400 text-sm mt-3 text-center">
              Welcome back — sign in to your account
            </p>
          </div>

          {/* ── Demo hint (collapsible feel) ── */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3.5 mb-5">
            <p className="text-xs font-bold text-orange-700 mb-2">🔑 Demo Credentials</p>
            <div className="space-y-0.5 text-xs text-orange-600 font-mono">
              <p>Email: <span className="font-bold">{DEMO_ADMIN.email}</span></p>
              <p>Password: <span className="font-bold">{DEMO_ADMIN.password}</span></p>
            </div>
            <button
              type="button"
              onClick={fillAdmin}
              className="mt-2.5 w-full text-xs font-semibold text-orange-700 bg-orange-100 hover:bg-orange-200 py-1.5 rounded-xl transition-colors"
            >
              ↑ Fill Admin Credentials
            </button>
          </div>

          {/* ── Card ── */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-orange-50/60 overflow-hidden">

            {/* Top accent strip */}
            <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400" />

            <div className="p-7">
              <h1 className="text-xl font-extrabold text-gray-900 mb-1">Sign In</h1>
              <p className="text-sm text-gray-400 mb-6">Enter your credentials to continue</p>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4 flex items-center gap-2">
                  <span className="shrink-0">⚠️</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                    />
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 h-12 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-2xl transition-all active:scale-[.98] shadow-md shadow-orange-200 text-[15px]"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <LogIn size={17} />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              {/* Register link */}
              <div className="mt-5 pt-5 border-t border-gray-50 text-center">
                <p className="text-sm text-gray-400">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-orange-500 font-bold hover:underline">
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ── Mobile bottom nav ── */}
      <MobileBottomNav />
    </>
  );
}
