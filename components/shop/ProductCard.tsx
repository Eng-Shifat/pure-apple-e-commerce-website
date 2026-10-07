"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Zap } from "lucide-react";
import { useState } from "react";

export interface Product {
  id: string;
  name: string;
  variant: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  slug: string;
  badge?: string;
  badgeColor?: string;
  specs?: {
    screen?: string;
    ram?: string;
    camera?: string;
  };
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  function handleAddToCart() {
    onAddToCart?.(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-brand-300 hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col">

      {/* ── Image Zone ── */}
      <div className="relative bg-[#F7F8FA] overflow-hidden" style={{ height: "200px" }}>

        {/* Top-left: badge */}
        {product.badge && (
          <span
            className="absolute top-2.5 left-2.5 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm"
            style={{ backgroundColor: product.badgeColor ?? "#FB5724" }}
          >
            {product.badge}
          </span>
        )}

        {/* Top-right: discount pill + wishlist stacked */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1.5">
          {/* Discount badge */}
          {discount && (
            <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm leading-none">
              -{discount}%
            </span>
          )}

          {/* Wishlist button — always visible, fills in on toggle */}
          <button
            onClick={() => setWished((w) => !w)}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 active:scale-95
              ${wished
                ? "bg-red-500 border-0"
                : "bg-white border border-gray-200 hover:border-red-300"
              }`}
          >
            <Heart
              size={13}
              className={wished ? "fill-white text-white" : "text-gray-400 group-hover:text-red-400 transition-colors"}
            />
          </button>
        </div>

        {/* Product Image */}
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 flex items-center justify-center p-5"
        >
          <div className="relative w-full h-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 220px"
              className="object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
            />
          </div>
        </Link>
      </div>

      {/* ── Info Zone ── */}
      <div className="px-3 pt-2.5 pb-3 flex flex-col flex-1">

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-gray-900 font-bold text-[14px] leading-snug hover:text-brand-500 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Variant */}
        <p className="text-gray-400 text-[11px] mt-0.5 truncate">{product.variant}</p>

        {/* Specs pills */}
        {product.specs && (
          <div className="flex items-center flex-nowrap gap-1 mt-1.5 overflow-hidden">
            {product.specs.screen && (
              <span className="inline-flex items-center gap-0.5 whitespace-nowrap shrink-0 text-[10px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">
                📱{product.specs.screen}
              </span>
            )}
            {product.specs.ram && (
              <span className="inline-flex items-center gap-0.5 whitespace-nowrap shrink-0 text-[10px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">
                ⚙️{product.specs.ram}
              </span>
            )}
            {product.specs.camera && (
              <span className="inline-flex items-center gap-0.5 whitespace-nowrap shrink-0 text-[10px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">
                📷{product.specs.camera}
              </span>
            )}
          </div>
        )}

        {/* Price row */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-gray-900 font-extrabold text-[16px] tracking-tight">
            ৳{product.price.toLocaleString("en-BD")}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] line-through text-gray-400">
              ৳{product.originalPrice.toLocaleString("en-BD")}
            </span>
          )}
          {discount && (
            <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
              Save {discount}%
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-[1fr_auto] gap-1.5 mt-2.5">
          <button
            onClick={handleAddToCart}
            className={`h-8 flex items-center justify-center gap-1.5 whitespace-nowrap text-[11px] font-semibold px-3 rounded-lg transition-all duration-200 active:scale-95 shadow-sm
              ${added
                ? "bg-green-500 text-white"
                : "bg-brand-500 hover:bg-brand-600 text-white hover:shadow-md"
              }`}
          >
            <ShoppingCart size={12} className="shrink-0" />
            {added ? "Added!" : "Add to Cart"}
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="h-8 flex items-center justify-center gap-1 whitespace-nowrap text-[11px] font-semibold px-3 rounded-lg border-2 border-brand-200 text-brand-500 hover:bg-brand-50 transition-all"
          >
            <Zap size={11} className="shrink-0" />
            Buy
          </Link>
        </div>
      </div>
    </div>
  );
}
