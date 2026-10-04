"use client";

import Link from "next/link";
import ShineLogo from "./ShineLogo";
import { useState } from "react";
import { Search, Heart, ShoppingCart, User, ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo (apple + leaf only, no circle) ── */}
          <Link href="/" aria-label="Pure Apple – Home" className="group flex items-center gap-3.5 flex-shrink-0">
            <ShineLogo
              height={54}
              priority
              className="transition-transform duration-500 ease-out group-hover:scale-105"
            />
            {/* 3-colour divider (green · orange · yellow) */}
            <span aria-hidden="true" className="hidden sm:block h-8 w-[2px] rounded-full bg-gradient-to-b from-leaf-500 via-brand-500 to-sun-500" />
            <span className="hidden sm:flex flex-col leading-none">
              <span className="text-[9px] font-semibold tracking-[0.28em] text-gray-600 uppercase">Mobile &amp;</span>
              <span className="mt-1.5 text-[11px] font-bold tracking-[0.2em] text-gray-800 uppercase">
                Gadget <span className="text-brand-500">Shop</span>
              </span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-brand-600 font-medium text-sm border-b-2 border-brand-500 pb-0.5">Home</Link>

            <div className="relative">
              <button
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
                className="flex items-center gap-1 text-gray-800 hover:text-brand-600 text-sm font-medium transition-colors"
              >
                Shop <ChevronDown size={14} />
              </button>
              {shopOpen && (
                <div
                  onMouseEnter={() => setShopOpen(true)}
                  onMouseLeave={() => setShopOpen(false)}
                  className="absolute top-full left-0 mt-1 w-44 bg-white/70 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 py-2 z-50"
                >
                  <Link href="/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600">All Products</Link>
                  <Link href="/products?category=apple" className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600">Apple</Link>
                  <Link href="/products?category=samsung" className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600">Samsung</Link>
                  <Link href="/products?category=accessories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600">Accessories</Link>
                </div>
              )}
            </div>

            <Link href="/products?view=categories" className="text-gray-800 hover:text-brand-600 text-sm font-medium transition-colors">Categories</Link>
            <Link href="/products?deals=true" className="text-gray-800 hover:text-brand-600 text-sm font-medium transition-colors">Deals</Link>
            <Link href="/about" className="text-gray-800 hover:text-brand-600 text-sm font-medium transition-colors">About</Link>
          </nav>

          {/* ── Right Icons ── */}
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/products" aria-label="Search" className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:p-2 rounded-full md:rounded-lg bg-white/60 md:bg-transparent text-gray-700 md:text-gray-800 hover:text-brand-500 hover:bg-brand-50 transition-colors">
              <Search size={18} />
            </Link>
            <button className="hidden md:block p-2 rounded-lg text-gray-800 hover:text-brand-500 hover:bg-brand-50 transition-colors">
              <Heart size={18} />
            </button>
            <Link href="/cart" className="relative flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:p-2 rounded-full md:rounded-lg bg-white/60 md:bg-transparent text-gray-700 md:text-gray-800 hover:text-brand-600 hover:bg-brand-50 transition-colors">
              <ShoppingCart size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">0</span>
            </Link>
            <Link href="/login" className="hidden md:block p-2 rounded-lg text-gray-800 hover:text-brand-600 hover:bg-brand-50 transition-colors">
              <User size={18} />
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/60 text-gray-800 active:scale-95 transition-transform"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div className={`md:hidden border-t border-white/40 overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-64 py-4" : "max-h-0"}`}>
        <div className="px-4 space-y-3">
          <Link href="/" className="block text-brand-600 font-medium text-sm">Home</Link>
          <Link href="/products" className="block text-gray-800 text-sm">Shop</Link>
          <Link href="/products?view=categories" className="block text-gray-800 text-sm">Categories</Link>
          <Link href="/products?deals=true" className="block text-gray-800 text-sm">Deals</Link>
          <Link href="/about" className="block text-gray-800 text-sm">About</Link>
        </div>
      </div>
    </header>
  );
}
