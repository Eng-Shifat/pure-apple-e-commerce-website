"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, LayoutGrid, Search, ShoppingCart, User,
  X, ArrowRight, LogOut, Package, Settings,
  Mail, Lock, Eye, EyeOff, Loader2,
} from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { PHONES } from "@/lib/phoneCatalog";

// ── Category list for the overlay ─────────────────────────────
const CATEGORIES = [
  { slug: "iphone",      name: "iPhone",      icon: "/icon/iPhone.png",      brand: "apple"   },
  { slug: "android",     name: "Android",     icon: "/icon/android.png",     brand: null      },
  { slug: "charger",     name: "Charger",     icon: "/icon/Charger.png",     brand: null      },
  { slug: "earbuds",     name: "Ear Buds",    icon: "/icon/ear buds.png",    brand: null      },
  { slug: "powerbank",   name: "Power Bank",  icon: "/icon/power-bank.png",  brand: null      },
  { slug: "cables",      name: "Cables",      icon: "/icon/cable.png",       brand: null      },
  { slug: "speaker",     name: "Speaker",     icon: "/icon/speaker.png",     brand: null      },
  { slug: "accessories", name: "Accessories", icon: "/icon/accessories.png", brand: null      },
];

const BRAND_FILTER =
  "brightness(0) saturate(100%) invert(42%) sepia(97%) saturate(631%) hue-rotate(342deg) brightness(98%) contrast(97%)";

// ── Product search data (name + slug for instant suggestions) ──────────────
const SEARCH_CATALOG = PHONES.map((p) => ({
  name: p.name,
  brand: p.brand,
  slug: p.slug,
  image: p.colors[0]?.image ?? "",
  price: p.price,
}));

// Popular fallback suggestions (no query)
const POPULAR = [
  "iPhone 16 Pro", "Samsung Galaxy S25", "OnePlus 13",
  "Charger", "Earbuds", "Power Bank",
];

export default function MobileBottomNav() {
  const pathname   = usePathname() || "/";
  const router     = useRouter();
  const user       = useAuthStore((s) => s.user);
  const login      = useAuthStore((s) => s.login);
  const logout     = useAuthStore((s) => s.logout);

  // Overlay states
  const [searchOpen,     setSearchOpen]     = useState(false);
  const [accountOpen,    setAccountOpen]    = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [catsVisible,    setCatsVisible]    = useState(false); // animation trigger

  // Search state
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Login form state (shown inside account overlay when not logged in)
  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword,  setShowPassword]  = useState(false);
  const [loginLoading,  setLoginLoading]  = useState(false);
  const [loginError,    setLoginError]    = useState("");

  const accountActive =
    pathname.startsWith("/orders") ||
    pathname.startsWith("/login")  ||
    pathname.startsWith("/register");

  // ── Focus search input when overlay opens ────────────────────────────────
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 80);
  }, [searchOpen]);

  // ── ESC key closes any overlay ───────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeSearch(); closeAccount(); closeCategories(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function closeSearch()  { setSearchOpen(false);  setQuery(""); }
  function closeAccount() { setAccountOpen(false); setLoginError(""); }

  function openCategories() {
    setCategoriesOpen(true);
    // Small delay so the DOM mounts first, then trigger the animation
    setTimeout(() => setCatsVisible(true), 20);
  }
  function closeCategories() {
    setCatsVisible(false);
    setTimeout(() => setCategoriesOpen(false), 300);
  }

  // ── Search submit → /products?q=... ─────────────────────────────────────
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      closeSearch();
    }
  }

  // ── Instant product suggestions filtered from catalog ────────────────────
  const productSuggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SEARCH_CATALOG.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  // ── Login handler ─────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const result = await login(loginEmail, loginPassword);
      if (!result.ok) {
        setLoginError(result.error ?? "Login failed. Please try again.");
      } else {
        closeAccount();
        router.push(result.role === "admin" ? "/admin" : "/orders");
      }
    } catch {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  async function handleLogout() {
    await logout(); // authStore.logout() already calls supabase.auth.signOut()
    closeAccount();
    router.push("/");
  }

  // ── Nav items ─────────────────────────────────────────────────────────────
  const LEFT_ITEMS = [
    { label: "Home", href: "/", icon: Home, match: (p: string) => p === "/" },
  ];
  const RIGHT_ITEMS = [
    { label: "Cart",    href: "/cart", icon: ShoppingCart, match: (p: string) => p.startsWith("/cart") || p.startsWith("/checkout") },
  ];

  return (
    <>
      {/* ════════════════════════════════════════════
          SEARCH OVERLAY
      ════════════════════════════════════════════ */}
      {searchOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeSearch} />

          {/* Panel */}
          <div
            className="relative mt-auto bg-white rounded-t-3xl shadow-2xl px-4 pt-4"
            style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}
          >
            {/* Handle */}
            <div className="mx-auto w-10 h-1 rounded-full bg-gray-200 mb-4" />

            {/* Input */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-3">
                <Search size={16} className="text-brand-500 shrink-0" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="iPhone, Samsung, Accessories..."
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                />
                {query && (
                  <button type="button" onClick={() => setQuery("")}>
                    <X size={14} className="text-gray-400" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-brand-500 text-white rounded-2xl px-4 py-3 font-semibold text-sm active:scale-95 transition-transform"
              >
                Go
              </button>
            </form>

            {/* ── Product suggestions (real products → product detail page) ── */}
            <div className="mt-3 max-h-64 overflow-y-auto">
              {query.trim() ? (
                productSuggestions.length > 0 ? (
                  <>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Products</p>
                    <ul className="space-y-0.5">
                      {productSuggestions.map((p) => (
                        <li key={p.slug}>
                          <button
                            type="button"
                            onClick={() => {
                              router.push(`/products/${p.slug}`);
                              closeSearch();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 text-left transition-colors group"
                          >
                            {/* Thumbnail */}
                            {p.image && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-9 h-9 object-contain rounded-lg bg-gray-50 border border-gray-100 shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 font-medium truncate group-hover:text-brand-600">
                                {p.name}
                              </p>
                              <p className="text-xs text-gray-400 capitalize">{p.brand} · ৳{p.price.toLocaleString("en-BD")}</p>
                            </div>
                            <ArrowRight size={13} className="text-gray-300 group-hover:text-brand-400 shrink-0" />
                          </button>
                        </li>
                      ))}
                    </ul>
                    {/* Also show "See all results" */}
                    <button
                      type="button"
                      onClick={() => {
                        router.push(`/products?q=${encodeURIComponent(query.trim())}`);
                        closeSearch();
                      }}
                      className="mt-2 w-full text-center text-sm text-brand-500 font-semibold py-2.5 rounded-xl hover:bg-brand-50 transition-colors"
                    >
                      See all results for &ldquo;{query}&rdquo; →
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No products found for &ldquo;{query}&rdquo;
                  </p>
                )
              ) : (
                <>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                    Popular Searches
                  </p>
                  <ul className="space-y-0.5">
                    {POPULAR.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onClick={() => {
                            router.push(`/products?q=${encodeURIComponent(s)}`);
                            closeSearch();
                          }}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-brand-50 text-left transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <Search size={13} className="text-gray-300" />
                            <span className="text-sm text-gray-700 group-hover:text-brand-600">{s}</span>
                          </div>
                          <ArrowRight size={13} className="text-gray-300 group-hover:text-brand-400" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          ACCOUNT OVERLAY
      ════════════════════════════════════════════ */}
      {accountOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeAccount} />

          {/* Panel */}
          <div
            className="relative mt-auto bg-white rounded-t-3xl shadow-2xl px-4 pt-4"
            style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}
          >
            {/* Handle */}
            <div className="mx-auto w-10 h-1 rounded-full bg-gray-200 mb-4" />

            {user ? (
              /* ── Logged-in dashboard ── */
              <div>
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center">
                    <User size={22} className="text-brand-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{user.name ?? user.email?.split("@")[0]}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <button onClick={closeAccount} className="text-gray-400 hover:text-gray-600 p-1">
                    <X size={18} />
                  </button>
                </div>

                {/* Menu items */}
                <div className="space-y-1">
                  <Link
                    href="/orders"
                    onClick={closeAccount}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <Package size={18} className="text-gray-400 group-hover:text-brand-500" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-brand-600">My Orders</span>
                    <ArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-brand-400" />
                  </Link>

                  <Link
                    href="/cart"
                    onClick={closeAccount}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <ShoppingCart size={18} className="text-gray-400 group-hover:text-brand-500" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-brand-600">My Cart</span>
                    <ArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-brand-400" />
                  </Link>

                  <Link
                    href="/checkout"
                    onClick={closeAccount}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <Settings size={18} className="text-gray-400 group-hover:text-brand-500" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-brand-600">Settings</span>
                    <ArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-brand-400" />
                  </Link>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-colors text-sm font-semibold"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            ) : (
              /* ── Login form ── */
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-extrabold text-gray-900">Sign In</h2>
                  <button onClick={closeAccount} className="text-gray-400 hover:text-gray-600 p-1">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-3">
                  {/* Email */}
                  <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-3">
                    <Mail size={16} className="text-gray-400 shrink-0" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Email address"
                      required
                      className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                    />
                  </div>

                  {/* Password */}
                  <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-3">
                    <Lock size={16} className="text-gray-400 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {/* Error */}
                  {loginError && (
                    <p className="text-xs text-red-500 px-1">{loginError}</p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 active:scale-[.98] text-white font-bold py-3.5 rounded-2xl transition-all disabled:opacity-60"
                  >
                    {loginLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                {/* Register link */}
                <p className="text-center text-sm text-gray-400 mt-4">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    onClick={closeAccount}
                    className="text-brand-500 font-semibold hover:underline"
                  >
                    Register
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          CATEGORIES OVERLAY
      ════════════════════════════════════════════ */}
      {categoriesOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${catsVisible ? "opacity-100" : "opacity-0"}`}
            onClick={closeCategories}
          />

          {/* Panel */}
          <div
            className={`relative bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${catsVisible ? "translate-y-0" : "translate-y-full"}`}
            style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}
          >
            {/* Handle */}
            <div className="mx-auto w-10 h-1 rounded-full bg-gray-200 mt-3 mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 mb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-500 mb-0.5">Browse</p>
                <h2 className="text-[18px] font-extrabold tracking-tight text-gray-900">Shop by Category</h2>
              </div>
              <button
                onClick={closeCategories}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>

            {/* Category Grid — cards fly up with staggered animation */}
            <div className="grid grid-cols-4 gap-3 px-4">
              {CATEGORIES.map((cat, i) => {
                const href = cat.brand
                  ? `/products?brand=${cat.brand}`
                  : `/category/${cat.slug}`;
                return (
                  <Link
                    key={cat.slug}
                    href={href}
                    onClick={closeCategories}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-brand-100 bg-gradient-to-b from-white to-orange-50 py-4 px-1 shadow-sm active:scale-95 transition-all duration-200 hover:border-brand-300 hover:shadow-md"
                    style={{
                      opacity: catsVisible ? 1 : 0,
                      transform: catsVisible ? "translateY(0)" : "translateY(24px)",
                      transition: `opacity 0.3s ease ${i * 40}ms, transform 0.3s ease ${i * 40}ms`,
                    }}
                  >
                    <span className="w-8 h-8 flex items-center justify-center">
                      <Image
                        src={cat.icon}
                        alt={cat.name}
                        width={28}
                        height={28}
                        className="object-contain"
                        style={{ filter: BRAND_FILTER }}
                      />
                    </span>
                    <span className="text-[10px] font-bold text-center leading-tight text-gray-800">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* View All link */}
            <div className="px-4 mt-4">
              <Link
                href="/products"
                onClick={closeCategories}
                className="flex items-center justify-center gap-1.5 w-full py-3 rounded-2xl border border-brand-200 text-brand-500 text-sm font-semibold hover:bg-brand-50 transition-colors"
              >
                View All Products <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          BOTTOM NAV BAR
      ════════════════════════════════════════════ */}
      <nav
        className="md:hidden fixed inset-x-0 bottom-0 z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="absolute inset-0 bg-white/85 backdrop-blur-2xl border-t border-gray-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.09)]" />

        <ul className="relative mx-auto flex max-w-md items-center justify-around px-1 h-16">

          {/* Left items */}
          {LEFT_ITEMS.map((it) => {
            const Icon  = it.icon;
            const active = it.match(pathname);
            return (
              <li key={it.label} className="flex-1">
                <Link
                  href={it.href}
                  className="relative flex flex-col items-center justify-center gap-0.5 py-2 w-full active:scale-90 transition-transform duration-150"
                >
                  {active && <span className="absolute inset-x-1 inset-y-0.5 rounded-2xl bg-brand-500/10" />}
                  <span className="relative">
                    <Icon
                      size={21}
                      strokeWidth={active ? 2.3 : 1.7}
                      className={`transition-all duration-300 ${active ? "text-brand-500 -translate-y-px" : "text-gray-400"}`}
                    />
                    {active && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500" />}
                  </span>
                  <span className={`relative text-[10px] font-medium tracking-wide transition-colors duration-300 ${active ? "text-brand-500 font-semibold" : "text-gray-400"}`}>
                    {it.label}
                  </span>
                </Link>
              </li>
            );
          })}

          {/* Categories button */}
          <li className="flex-1">
            <button
              onClick={openCategories}
              className="relative flex flex-col items-center justify-center gap-0.5 py-2 w-full active:scale-90 transition-transform duration-150"
            >
              {categoriesOpen && <span className="absolute inset-x-1 inset-y-0.5 rounded-2xl bg-brand-500/10" />}
              <span className="relative">
                <LayoutGrid
                  size={21}
                  strokeWidth={categoriesOpen ? 2.3 : 1.7}
                  className={`transition-all duration-300 ${categoriesOpen ? "text-brand-500 -translate-y-px" : "text-gray-400"}`}
                />
                {categoriesOpen && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500" />}
              </span>
              <span className={`relative text-[10px] font-medium tracking-wide transition-colors duration-300 ${categoriesOpen ? "text-brand-500 font-semibold" : "text-gray-400"}`}>
                Categories
              </span>
            </button>
          </li>

          {/* ── Center Search button ── */}
          <li className="flex-none px-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="relative flex flex-col items-center justify-center active:scale-90 transition-transform duration-150"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-500 shadow-lg shadow-brand-500/40 -mt-5">
                <Search size={22} strokeWidth={2} className="text-white" />
              </span>
              <span className="text-[10px] font-medium tracking-wide text-gray-400 mt-0.5">Search</span>
            </button>
          </li>

          {/* Right items (Cart) */}
          {RIGHT_ITEMS.map((it) => {
            const Icon  = it.icon;
            const active = it.match(pathname);
            return (
              <li key={it.label} className="flex-1">
                <Link
                  href={it.href}
                  className="relative flex flex-col items-center justify-center gap-0.5 py-2 w-full active:scale-90 transition-transform duration-150"
                >
                  {active && <span className="absolute inset-x-1 inset-y-0.5 rounded-2xl bg-brand-500/10" />}
                  <span className="relative">
                    <Icon
                      size={21}
                      strokeWidth={active ? 2.3 : 1.7}
                      className={`transition-all duration-300 ${active ? "text-brand-500 -translate-y-px" : "text-gray-400"}`}
                    />
                    {active && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500" />}
                  </span>
                  <span className={`relative text-[10px] font-medium tracking-wide transition-colors duration-300 ${active ? "text-brand-500 font-semibold" : "text-gray-400"}`}>
                    {it.label}
                  </span>
                </Link>
              </li>
            );
          })}

          {/* ── Account button (opens overlay) ── */}
          <li className="flex-1">
            <button
              onClick={() => setAccountOpen(true)}
              className="relative flex flex-col items-center justify-center gap-0.5 py-2 w-full active:scale-90 transition-transform duration-150"
            >
              {accountActive && <span className="absolute inset-x-1 inset-y-0.5 rounded-2xl bg-brand-500/10" />}
              <span className="relative">
                <User
                  size={21}
                  strokeWidth={accountActive ? 2.3 : 1.7}
                  className={`transition-all duration-300 ${accountActive ? "text-brand-500 -translate-y-px" : "text-gray-400"}`}
                />
                {accountActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500" />}
              </span>
              <span className={`relative text-[10px] font-medium tracking-wide transition-colors duration-300 ${accountActive ? "text-brand-500 font-semibold" : "text-gray-400"}`}>
                Account
              </span>
            </button>
          </li>

        </ul>
      </nav>
    </>
  );
}
