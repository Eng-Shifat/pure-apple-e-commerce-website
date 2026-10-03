"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PA</span>
            </div>
            <span className="text-gray-900 font-bold text-lg tracking-tight">
              Pure Apple
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-blue-600 font-medium text-sm border-b-2 border-blue-600 pb-0.5"
            >
              Home
            </Link>

            {/* Shop Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                Shop <ChevronDown size={14} />
              </button>
              {shopOpen && (
                <div
                  onMouseEnter={() => setShopOpen(true)}
                  onMouseLeave={() => setShopOpen(false)}
                  className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                >
                  <Link href="/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">All Products</Link>
                  <Link href="/products?category=apple" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">Apple</Link>
                  <Link href="/products?category=samsung" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">Samsung</Link>
                  <Link href="/products?category=accessories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">Accessories</Link>
                </div>
              )}
            </div>

            <Link href="/products?view=categories" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">Categories</Link>
            <Link href="/products?deals=true" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">Deals</Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">About</Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            <button className="hidden md:flex p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <Search size={18} />
            </button>
            <button className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors">
              <Heart size={18} />
            </button>
            <Link href="/cart" className="relative p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <ShoppingCart size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
            <Link href="/login" className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <User size={18} />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link href="/" className="block text-blue-600 font-medium text-sm">Home</Link>
          <Link href="/products" className="block text-gray-600 text-sm">Shop</Link>
          <Link href="/products?view=categories" className="block text-gray-600 text-sm">Categories</Link>
          <Link href="/products?deals=true" className="block text-gray-600 text-sm">Deals</Link>
          <Link href="/about" className="block text-gray-600 text-sm">About</Link>
        </div>
      )}
    </header>
  );
}
