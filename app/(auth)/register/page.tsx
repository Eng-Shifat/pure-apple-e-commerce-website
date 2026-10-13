"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  Eye, EyeOff, Loader2, UserPlus, User, Mail, Lock, CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/shop/Navbar";
import MobileBottomNav from "@/components/shop/MobileBottomNav";
import ShineLogo from "@/components/shop/ShineLogo";

export default function RegisterPage() {
  const router    = useRouter();
  const login     = useAuthStore((s) => s.login);
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? "Registration failed");
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/"), 1200);
  }

  const pwStrength =
    password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : 3;

  const pwLabel  = ["", "Weak", "Good", "Strong"][pwStrength];
  const pwColor  = ["", "bg-red-400", "bg-yellow-400", "bg-green-500"][pwStrength];
  const pwText   = ["", "text-red-500", "text-yellow-500", "text-green-600"][pwStrength];

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
              Join Pure Apple — Better Tech, Brighter Tomorrow
            </p>
          </div>

          {/* ── Card ── */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-orange-50/60 overflow-hidden">

            {/* Card top accent strip */}
            <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400" />

            <div className="p-7">

              {/* Success state */}
              {success ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <CheckCircle2 size={48} className="text-green-500 mb-3" />
                  <p className="font-bold text-gray-800 text-lg">Account created!</p>
                  <p className="text-sm text-gray-400 mt-1">Redirecting you to the home page…</p>
                </div>
              ) : (
                <>
                  <h1 className="text-xl font-extrabold text-gray-900 mb-1">Create Account</h1>
                  <p className="text-sm text-gray-400 mb-6">Fill in your details to get started</p>

                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4 flex items-center gap-2">
                      <span className="shrink-0">⚠️</span>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                        Full Name
                      </label>
                      <div className="relative">
                        <User
                          size={15}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                        />
                        <input
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
                        />
                      </div>
                    </div>

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
                          placeholder="Min. 6 characters"
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

                      {/* Password strength bar */}
                      {password.length > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 flex gap-1 h-1.5">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className={`flex-1 rounded-full transition-all duration-300 ${
                                  i <= pwStrength ? pwColor : "bg-gray-100"
                                }`}
                              />
                            ))}
                          </div>
                          <span className={`text-[11px] font-semibold ${pwText}`}>{pwLabel}</span>
                        </div>
                      )}
                    </div>

                    {/* Terms note */}
                    <p className="text-[11px] text-gray-400 text-center px-2">
                      By creating an account, you agree to our{" "}
                      <span className="text-orange-500 font-medium cursor-pointer hover:underline">
                        Terms of Service
                      </span>{" "}
                      &amp;{" "}
                      <span className="text-orange-500 font-medium cursor-pointer hover:underline">
                        Privacy Policy
                      </span>
                      .
                    </p>

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
                          <UserPlus size={17} />
                          Create Account
                        </>
                      )}
                    </button>
                  </form>

                  {/* Sign in link */}
                  <div className="mt-5 pt-5 border-t border-gray-50 text-center">
                    <p className="text-sm text-gray-400">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="text-orange-500 font-bold hover:underline"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* ── Mobile bottom nav ── */}
      <MobileBottomNav />
    </>
  );
}
