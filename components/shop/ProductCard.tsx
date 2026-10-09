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
    /* mt-3 gives space for the badge that overflows the top */
    <div className="group relative bg-white rounded-xl border border-gray-100 hover:border-brand-300 hover:shadow-card-hover transition-all duration-300 flex flex-col mt-3">

      {/* Badge — sits at the very top-left, half outside the card */}
      {product.badge && (
        <span
          className="absolute left-3 -top-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-20 shadow-md whitespace-nowrap"
          style={{ backgroundColor: product.badgeColor ?? "#FB5724" }}
        >
          {product.badge}
        </span>
      )}

      {/* ── Image Zone ── */}
      <div className="relative bg-[#F7F8FA] rounded-t-xl overflow-hidden" style={{ height: "155px" }}>

        {/* Top-right: discount pill + wishlist stacked */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1.5">
          {discount && (
            <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm leading-none">
              -{discount}%
            </span>
          )}
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
          className="absolute inset-0 flex items-center justify-center p-3"
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
      <div className="px-2.5 pt-2 pb-2.5 flex flex-col flex-1">

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-gray-900 font-bold text-[14px] leading-snug hover:text-brand-500 transition-colors truncate w-full">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-400 text-[10px] mt-0.5 truncate">{product.variant}</p>

        {product.specs && (
          <div className="flex items-center flex-nowrap gap-1 mt-1 overflow-hidden">
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

        <div className="flex items-center gap-2 mt-1.5">
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

        {/* ── Action Buttons ── */}
        <div className="flex gap-1.5 mt-2">
          <button
            onClick={handleAddToCart}
            className={`
              relative flex-1 min-w-0 h-8 flex items-center justify-center gap-1
              text-[10px] font-bold rounded-lg overflow-hidden
              transition-all duration-200 active:scale-95 shadow-sm
              ${added
                ? "bg-green-500 text-white shadow-green-200"
                : "bg-brand-500 hover:bg-brand-600 text-white hover:shadow-brand-200 hover:shadow-md"
              }
            `}
          >
            {!added && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
                }}
              />
            )}
            <ShoppingCart size={11} className="shrink-0" />
            <span className="truncate">{added ? "Added ✓" : "Add to Cart"}</span>
          </button>

          <Link
            href={`/products/${product.slug}`}
            className="
              h-8 flex items-center justify-center gap-1 px-2.5
              text-[10px] font-bold rounded-lg whitespace-nowrap
              border-2 border-brand-400 text-brand-500
              hover:bg-brand-500 hover:text-white hover:border-brand-500
              transition-all duration-200 active:scale-95
            "
          >
            <Zap size={11} className="shrink-0" />
            Buy
          </Link>
        </div>
      </div>
    </div>
  );
}
