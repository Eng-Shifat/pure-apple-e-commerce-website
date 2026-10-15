"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useState } from "react";

export default function WishlistPage() {
  const { items, removeItem, clear } = useWishlistStore();
  const { addItem } = useCartStore();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  function handleAddToCart(product: (typeof items)[0]) {
    addItem(product as never);
    setAddedIds((prev) => new Set([...prev, product.id]));
    setTimeout(() => {
      setAddedIds((prev) => {
        const n = new Set(prev);
        n.delete(product.id);
        return n;
      });
    }, 1800);
  }

  function handleAddAll() {
    items.forEach((p) => addItem(p as never));
    const allIds = new Set(items.map((p) => p.id));
    setAddedIds(allIds);
    setTimeout(() => setAddedIds(new Set()), 1800);
  }

  // ── Empty State ──
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center mb-5">
          <Heart size={40} className="text-orange-200" />
        </div>
        <h2 className="text-xl font-extrabold text-gray-800 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-400 text-sm mb-7 max-w-xs">
          Save your favourite products here — browse our collection and tap the ♡ to add.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-[#FB5724] hover:bg-[#e84e1f] text-white font-bold px-7 py-3 rounded-xl transition-all active:scale-95 shadow-[0_4px_14px_rgba(251,87,36,0.35)]"
        >
          Browse Products <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Page Title ── */}
        <h1 className="text-2xl font-extrabold text-gray-900 mb-8">My Wishlist</h1>

        {/* ── Table ── */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-[2fr_3fr_1fr] bg-gray-50 border-b border-gray-200 px-6 py-3 text-sm font-semibold text-gray-500">
            <span>Product</span>
            <span>Details</span>
            <span className="text-right">Price</span>
          </div>

          {/* Table Rows */}
          {items.map((product, idx) => {
            const isAdded = addedIds.has(product.id);
            const isLast = idx === items.length - 1;

            return (
              <div
                key={product.id}
                className={`grid grid-cols-[2fr_3fr_1fr] items-center px-6 py-5 gap-4 ${!isLast ? "border-b border-gray-100" : ""}`}
              >
                {/* Product Image */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <Link href={`/products/${product.slug}`}>
                      <Image
                        src={
                          /^(\/|https?:\/\/)/.test(product.image)
                            ? product.image
                            : "/logo/pure-apple-logo.png"
                        }
                        alt={product.name}
                        fill
                        sizes="80px"
                        className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  </div>
                  {/* Remove link below image */}
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-xs text-gray-400 underline hover:text-red-500 transition-colors mt-1 self-end"
                  >
                    Remove
                  </button>
                </div>

                {/* Details + Add to Cart */}
                <div className="flex flex-col gap-3">
                  <div>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-semibold text-gray-900 text-sm hover:text-[#FB5724] transition-colors leading-snug">
                        {product.name}
                      </h3>
                    </Link>
                    {product.variant && (
                      <p className="text-xs text-gray-400 mt-0.5">{product.variant}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`
                      self-start flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95
                      ${isAdded
                        ? "bg-green-500 text-white"
                        : "bg-gray-900 hover:bg-gray-700 text-white"
                      }
                    `}
                  >
                    <ShoppingCart size={14} />
                    {isAdded ? "Added ✓" : "Add To Cart"}
                  </button>
                </div>

                {/* Price */}
                <div className="text-right">
                  <span className="font-bold text-gray-900 text-base">
                    ৳{product.price.toLocaleString("en-BD")}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <p className="text-xs text-gray-400 line-through mt-0.5">
                      ৳{product.original_price.toLocaleString("en-BD")}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border border-gray-100 rounded-xl bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <ShoppingBag size={18} className="text-[#FB5724]" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">
                {items.length} item{items.length !== 1 ? "s" : ""} saved
              </p>
              <p className="text-xs text-gray-400">
                Total value: ৳{items.reduce((s, p) => s + p.price, 0).toLocaleString("en-BD")}
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap justify-end">
            <Link
              href="/products"
              className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-[#FB5724] text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
            >
              Continue Shopping
            </Link>
            <button
              onClick={handleAddAll}
              className="flex items-center gap-1.5 bg-[#FB5724] hover:bg-[#e84e1f] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-[0_4px_14px_rgba(251,87,36,0.35)]"
            >
              <ShoppingCart size={15} />
              Add All to Cart
            </button>
            <button
              onClick={clear}
              className="flex items-center gap-1.5 border border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-200 text-xs font-medium px-3 py-2.5 rounded-xl transition-all"
            >
              <Trash2 size={13} />
              Clear All
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
