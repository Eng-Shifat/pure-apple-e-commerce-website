"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Zap } from "lucide-react";
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
      <div className="relative bg-[#F7F8FA] overflow-hidden" style={{ height: "220px" }}>

        {/* Left badge */}
        {product.badge && (
          <span
            className="absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10 shadow-sm"
            style={{ backgroundColor: product.badgeColor ?? "#FB5724" }}
          >
            {product.badge}
          </span>
        )}

        {/* Discount badge */}
        {discount && (
          <span className="absolute top-3 right-10 bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full z-10 shadow-sm">
            -{discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setWished((w) => !w)}
          aria-label="Wishlist"
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <Heart
            size={13}
            className={wished ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>

        {/* Product Image — fixed container, image fills it with object-contain */}
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 flex items-center justify-center p-6"
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
      <div className="p-4 flex flex-col flex-1">

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-gray-900 font-bold text-[15px] leading-snug hover:text-brand-500 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Variant */}
        <p className="text-gray-400 text-xs mt-0.5 truncate">{product.variant}</p>

        {/* Specs pills (optional) */}
        {product.specs && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {product.specs.screen && (
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 rounded-md px-2 py-0.5">
                📱 {product.specs.screen}
              </span>
            )}
            {product.specs.ram && (
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 rounded-md px-2 py-0.5">
                ⚙️ {product.specs.ram}
              </span>
            )}
            {product.specs.camera && (
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 rounded-md px-2 py-0.5">
                📷 {product.specs.camera}
              </span>
            )}
          </div>
        )}

        {/* Stars */}
        <div className="flex items-center gap-1 mt-2.5">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={
                  i < Math.floor(product.rating)
                    ? "fill-sun-500 text-sun-500"
                    : "fill-gray-200 text-gray-200"
                }
              />
            ))}
          </div>
          <span className="text-gray-400 text-[11px] leading-none">
            {product.rating}&nbsp;
            <span className="text-gray-300">({product.reviewCount.toLocaleString()})</span>
          </span>
        </div>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-2.5">
          <span className="text-gray-900 font-extrabold text-[17px] tracking-tight">
            ৳{product.price.toLocaleString("en-BD")}
          </span>
          {product.originalPrice && (
            <span className="text-gray-350 text-xs line-through text-gray-400">
              ৳{product.originalPrice.toLocaleString("en-BD")}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-[8px]" />

        {/* Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl transition-all duration-200 active:scale-95 shadow-sm
              ${added
                ? "bg-leaf-500 text-white"
                : "bg-brand-500 hover:bg-brand-600 text-white hover:shadow-md"
              }`}
          >
            <ShoppingCart size={13} />
            {added ? "Added!" : "Add to Cart"}
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="flex items-center justify-center gap-1 text-xs font-semibold py-2.5 px-3 rounded-xl border-2 border-brand-200 text-brand-500 hover:bg-brand-50 transition-all"
          >
            <Zap size={12} />
            Buy
          </Link>
        </div>
      </div>
    </div>
  );
}
