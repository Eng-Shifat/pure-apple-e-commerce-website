"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star, ShoppingCart, Zap, Heart, ChevronRight,
  Shield, RefreshCw, Truck, BadgeCheck, Minus, Plus,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty,     setQty]     = useState(1);
  const [wished,  setWished]  = useState(false);
  const [added,   setAdded]   = useState(false);

  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    fetch(`/api/products?slug=${slug}`)
      .then(r => r.json())
      .then(d => {
        const found = Array.isArray(d.products)
          ? d.products.find((p: Product) => p.slug === slug)
          : null;
        setProduct(found ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  function handleAddToCart() {
    if (!product) return;
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-10 animate-pulse">
        <div className="bg-gray-100 rounded-3xl h-96" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-100 rounded w-3/4" />
          <div className="h-5 bg-gray-100 rounded w-1/2" />
          <div className="h-10 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <p className="text-gray-400 text-lg">Product not found.</p>
      <Link href="/products" className="mt-4 inline-block text-brand-500 font-semibold hover:underline">← Back to Products</Link>
    </div>
  );

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-brand-500">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-brand-500">Products</Link>
          <ChevronRight size={12} />
          <span className="text-gray-700 font-medium line-clamp-1">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-14">

          {/* Image */}
          <div className="relative bg-white rounded-3xl border border-gray-100 overflow-hidden flex items-center justify-center p-8" style={{ minHeight: "400px" }}>
            {product.badge && (
              <span className="absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow"
                style={{ backgroundColor: product.badge_color ?? "#FB5724" }}>
                {product.badge}
              </span>
            )}
            {discount && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full z-10">
                -{discount}%
              </span>
            )}
            <button
              onClick={() => setWished(w => !w)}
              className={`absolute top-14 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-md z-10 transition-all hover:scale-110 ${wished ? "bg-red-500" : "bg-white border border-gray-200"}`}>
              <Heart size={16} className={wished ? "fill-white text-white" : "text-gray-400"} />
            </button>
            <div className="relative w-full" style={{ height: "340px" }}>
              <Image src={/^(\/|https?:\/\/)/.test(product.image) ? product.image : "/logo/pure-apple-logo.png"} alt={product.name} fill className="object-contain drop-shadow-xl" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{product.name}</h1>
            {product.variant && <p className="text-gray-400 text-sm mt-1">{product.variant}</p>}

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} size={14}
                      className={n <= Math.round(product.rating) ? "fill-sun-500 text-sun-500" : "text-gray-200"} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                <span className="text-xs text-gray-400">({product.review_count?.toLocaleString()} reviews)</span>
              </div>
            )}

            {/* Specs */}
            {(product.spec_screen || product.spec_ram || product.spec_camera) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.spec_screen && <span className="text-xs text-gray-600 bg-gray-100 rounded-lg px-3 py-1.5">📱 {product.spec_screen}</span>}
                {product.spec_ram   && <span className="text-xs text-gray-600 bg-gray-100 rounded-lg px-3 py-1.5">⚙️ {product.spec_ram} RAM</span>}
                {product.spec_camera && <span className="text-xs text-gray-600 bg-gray-100 rounded-lg px-3 py-1.5">📷 {product.spec_camera}</span>}
              </div>
            )}

            {/* Price */}
            <div className="mt-5 flex items-end gap-3">
              <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                ৳{product.price.toLocaleString("en-BD")}
              </span>
              {product.original_price && (
                <>
                  <span className="text-lg line-through text-gray-400">৳{product.original_price.toLocaleString("en-BD")}</span>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Qty */}
            <div className="flex items-center gap-3 mt-6">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors active:scale-95">
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-sm font-bold text-gray-900">{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors active:scale-95">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button onClick={handleAddToCart}
                className={`flex-1 h-12 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all active:scale-95 shadow-sm
                  ${added ? "bg-green-500 text-white" : "bg-brand-500 hover:bg-brand-600 text-white hover:shadow-md"}`}>
                <ShoppingCart size={16} />
                {added ? "Added to Cart!" : "Add to Cart"}
              </button>
              <Link href="/checkout"
                onClick={handleAddToCart}
                className="flex-1 h-12 flex items-center justify-center gap-2 text-sm font-bold rounded-xl bg-gray-900 hover:bg-gray-800 text-white transition-all active:scale-95">
                <Zap size={15} />
                Buy Now
              </Link>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
              {[
                { icon: Shield,     label: "1 Year Warranty",  sub: "Official warranty" },
                { icon: Truck,      label: "Free Delivery",    sub: "Dhaka & nationwide" },
                { icon: RefreshCw,  label: "7-Day Return",     sub: "Hassle-free returns" },
                { icon: BadgeCheck, label: "100% Genuine",     sub: "Verified authentic" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-brand-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
