"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { lines, removeItem, updateQty, total, count } = useCartStore();

  if (lines.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-20 text-center">
      <ShoppingBag size={56} className="text-gray-200 mb-4" />
      <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
      <p className="text-gray-400 text-sm mb-6">Browse our collection and find something you love.</p>
      <Link href="/products" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-all active:scale-95 shadow-sm">
        Continue Shopping <ArrowRight size={16} />
      </Link>
    </div>
  );

  const subtotal = total();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Shopping Cart <span className="text-gray-400 font-normal text-lg">({count()} items)</span></h1>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">

          {/* Items */}
          <div className="space-y-3">
            {lines.map(({ product, quantity }) => (
              <div key={product.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
                <Link href={`/products/${product.slug}`} className="relative w-20 h-20 shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                  <Image src={/^(\/|https?:\/\/)/.test(product.image) ? product.image : "/logo/pure-apple-logo.png"} alt={product.name} fill className="object-contain p-1" />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug hover:text-brand-500 transition-colors line-clamp-1">{product.name}</h3>
                  </Link>
                  {product.variant && <p className="text-xs text-gray-400 mt-0.5 truncate">{product.variant}</p>}

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <span className="font-extrabold text-gray-900">৳{(product.price * quantity).toLocaleString("en-BD")}</span>

                    <div className="flex items-center gap-3">
                      {/* Qty control */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button onClick={() => updateQty(product.id, quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:scale-95 transition-all">
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-900">{quantity}</span>
                        <button onClick={() => updateQty(product.id, quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:scale-95 transition-all">
                          <Plus size={13} />
                        </button>
                      </div>

                      <button onClick={() => removeItem(product.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors active:scale-95">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 h-fit sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({count()} items)</span>
                <span className="font-semibold text-gray-900">৳{subtotal.toLocaleString("en-BD")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-2.5 flex justify-between font-extrabold text-gray-900 text-base">
                <span>Total</span>
                <span>৳{subtotal.toLocaleString("en-BD")}</span>
              </div>
            </div>

            <Link href="/checkout"
              className="mt-5 flex items-center justify-center gap-2 w-full h-12 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-all active:scale-95 shadow-sm hover:shadow-md">
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
            <Link href="/products"
              className="mt-3 flex items-center justify-center gap-2 w-full h-10 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
