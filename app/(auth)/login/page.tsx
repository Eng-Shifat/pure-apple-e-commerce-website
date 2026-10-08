"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore, DEMO_ADMIN } from "@/store/authStore";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
  const router     = useRouter();
  const login      = useAuthStore(s => s.login);
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

    const result = await login(email, password);   // ← async/await
    setLoading(false);

    if (!result.ok) {
      setError(result.error ?? "Login failed");
      return;
    }

    if (result.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-extrabold text-orange-500">Pure Apple</span>
          </Link>
          <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Demo hint */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-5">
          <p className="text-xs font-bold text-orange-700 mb-2">🔑 Demo Credentials</p>
          <div className="space-y-1 text-xs text-orange-600 font-mono">
            <p>Email: <span className="font-bold">{DEMO_ADMIN.email}</span></p>
            <p>Password: <span className="font-bold">{DEMO_ADMIN.password}</span></p>
          </div>
          <button type="button" onClick={fillAdmin}
            className="mt-2.5 w-full text-xs font-semibold text-orange-700 bg-orange-100 hover:bg-orange-200 py-1.5 rounded-lg transition-colors">
            ↑ Fill Admin Credentials
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 h-11 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl transition-all active:scale-95 shadow-sm">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-orange-500 font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
