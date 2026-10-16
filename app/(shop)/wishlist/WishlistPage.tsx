"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Check,
  Star,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { formatPrice, calcDiscount } from "@/lib/utils";

export default function WishlistPage() {
  const { items, removeItem, clear } = useWishlistStore();
  const { addItem } = useCartStore();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [confirmClear, setConfirmClear] = useState(false);

  function flash(ids: string[]) {
    setAddedIds(new Set(ids));
    setTimeout(() => setAddedIds(new Set()), 1800);
  }

  function handleAddToCart(product: (typeof items)[0]) {
    addItem(product as never);
    flash([product.id]);
  }

  function handleAddAll() {
    items.forEach((p) => addItem(p as never));
    flash(items.map((p) => p.id));
  }

  function handleClear() {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    clear();
    setConfirmClear(false);
  }

  const total = items.reduce((s, p) => s + p.price, 0);
  const savings = items.reduce(
    (s, p) => s + (p.original_price && p.original_price > p.price ? p.original_price - p.price : 0),
    0
  );
  const allAdded = items.length > 0 && items.every((p) => addedIds.has(p.id));

  // ── Empty State ──
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
            <Heart size={44} className="text-brand-300" strokeWidth={1.6} />
          </div>
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-sun-400 animate-pulse" />
          <span className="absolute bottom-1 -left-2 w-3.5 h-3.5 rounded-full bg-leaf-400" />
        </div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-xs leading-relaxed">
          Save your favourite phones &amp; gadgets here — tap the ♡ on any product to add it.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-7 py-3.5 rounded-2xl transition-all active:scale-95 shadow-[0_8px_20px_rgba(251,87,36,0.3)]"
        >
          Browse Products <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/60 via-white to-white pb-32 md:pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-5 sm:mb-7">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              My Wishlist
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {items.length} saved item{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleClear}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border transition-all ${
              confirmClear
                ? "bg-red-500 border-red-500 text-white"
                : "bg-white border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200"
            }`}
          >
            <Trash2 size={13} />
            {confirmClear ? "Tap again to confirm" : "Clear all"}
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* ── Items ── */}
          <ul className="space-y-3 sm:space-y-4">
            {items.map((product) => {
              const isAdded = addedIds.has(product.id);
              const hasDiscount =
                !!product.original_price && product.original_price > product.price;
              const outOfStock =
                product.is_available === false ||
                (typeof product.stock === "number" && product.stock <= 0);
              const imgSrc = /^(\/|https?:\/\/)/.test(product.image)
                ? product.image
                : "/logo/pure-apple-logo.png";

              return (
                <li
                  key={product.id}
                  className="group relative bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-shadow p-3 sm:p-4"
                >
                  <div className="flex gap-3 sm:gap-4">
                    {/* Image */}
                    <Link
                      href={`/products/${product.slug}`}
                      className="relative shrink-0 w-24 h-28 sm:w-32 sm:h-36 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
                    >
                      <Image
                        src={imgSrc}
                        alt={product.name}
                        fill
                        sizes="128px"
                        className="object-contain p-2.5 group-hover:scale-105 transition-transform duration-300"
                      />
                      {hasDiscount && (
                        <span className="absolute top-1.5 left-1.5 bg-brand-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          -{calcDiscount(product.price, product.original_price!)}%
                        </span>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/products/${product.slug}`} className="min-w-0">
                          <h3 className="font-bold text-gray-900 text-[15px] sm:text-base leading-snug line-clamp-2 hover:text-brand-500 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <button
                          onClick={() => removeItem(product.id)}
                          aria-label={`Remove ${product.name} from wishlist`}
                          className="shrink-0 -mr-1 -mt-1 w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {product.variant && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{product.variant}</p>
                      )}

                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {product.rating > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700">
                            <Star size={12} className="fill-sun-500 text-sun-500" />
                            {product.rating.toFixed(1)}
                          </span>
                        )}
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            outOfStock
                              ? "bg-red-50 text-red-500"
                              : "bg-leaf-50 text-leaf-700"
                          }`}
                        >
                          {outOfStock ? "Out of stock" : "In stock"}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mt-auto pt-2 flex items-baseline gap-2 flex-wrap">
                        <span className="text-lg sm:text-xl font-extrabold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(product.original_price!)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={outOfStock}
                    className={`mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                      isAdded
                        ? "bg-leaf-500 text-white"
                        : "bg-gray-900 hover:bg-brand-500 text-white"
                    }`}
                  >
                    {isAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
                    {isAdded ? "Added to cart" : "Add to Cart"}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* ── Summary ── */}
          <aside className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Wishlist summary</h2>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Items</span>
                  <span className="font-semibold text-gray-800">{items.length}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>You save</span>
                    <span className="font-semibold text-leaf-600">{formatPrice(savings)}</span>
                  </div>
                )}
                <div className="h-px bg-gray-100" />
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-700 font-semibold">Total value</span>
                  <span className="text-xl font-extrabold text-gray-900">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleAddAll}
                className={`mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] ${
                  allAdded
                    ? "bg-leaf-500"
                    : "bg-brand-500 hover:bg-brand-600 shadow-[0_8px_20px_rgba(251,87,36,0.3)]"
                }`}
              >
                {allAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
                {allAdded ? "All added to cart" : "Add All to Cart"}
              </button>
              <Link
                href="/products"
                className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:border-brand-300 hover:text-brand-500 transition-colors"
              >
                Continue Shopping <ArrowRight size={14} />
              </Link>

              <div className="mt-5 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500">
                <p className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-leaf-500" /> 100% genuine products
                </p>
                <p className="flex items-center gap-2">
                  <Truck size={14} className="text-brand-500" /> Fast delivery across Bangladesh
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
