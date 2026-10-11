"use client";

/**
 * SharedProductCard — সব জায়গায় একই card use হবে
 * Home (PopularProducts, BestDeals), /products page, /category page
 *
 * Badge: top-left, half outside card (card-এর উপরে আধা বাইরে)
 * Discount: price-এর পাশে original price strikethrough + % saved badge
 */

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Zap, Star } from "lucide-react";
import { useState } from "react";
import type { ColorVariant } from "@/lib/phoneCatalog";
import ColorSwatches from "./ColorSwatches";

export interface SharedProduct {
  id: string;
  name: string;
  brand?: string;
  variant?: string;
  storage?: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  image: string;
  slug: string;
  badge?: string;
  badgeColor?: string;
  colors?: ColorVariant[];
  specs?: {
    screen?: string;
    ram?: string;
    camera?: string;
  };
  /** "Starting from" label দেখাবে কিনা (default: false) */
  showStartingFrom?: boolean;
}

interface SharedProductCardProps {
  product: SharedProduct;
  onAddToCart?: (product: SharedProduct) => void;
}

export default function SharedProductCard({ product, onAddToCart }: SharedProductCardProps) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const [colorIdx, setColorIdx] = useState(0);

  const colors: ColorVariant[] = Array.isArray(product.colors)
    ? product.colors.filter((c) => c && typeof c === "object" && c.image)
    : [];
  const activeColor = colors[colorIdx];
  const storage = product.storage ?? (product.variant ?? "").split(" – ")[0];
  const shownImage = activeColor?.image ?? product.image;
  const shownVariant = activeColor
    ? `${storage ? storage + " – " : ""}${activeColor.name}`
    : (product.variant ?? "");

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  function handleAddToCart() {
    onAddToCart?.(
      activeColor
        ? {
            ...product,
            id: `${product.id}:${activeColor.name}`,
            image: activeColor.image,
            variant: shownVariant,
          }
        : product
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    /**
     * mt-4 = space for badge that overflows top
     * relative + overflow-visible so badge can stick out
     */
    <div className="group relative flex flex-col mt-4" style={{ overflow: "visible" }}>
      {/* ── Badge — half outside top-left of card ─────────────── */}
      {product.badge && (
        <div
          className="absolute z-30 left-3"
          style={{ top: "-14px" }}
        >
          <span
            className="inline-block text-white text-[10px] font-extrabold px-2.5 py-[5px] rounded-full shadow-lg whitespace-nowrap tracking-wide"
            style={{ backgroundColor: product.badgeColor ?? "#FB5724" }}
          >
            {product.badge}
          </span>
        </div>
      )}

      {/* ── Card body ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 hover:border-brand-300 hover:shadow-card-hover transition-all duration-300 flex flex-col flex-1 overflow-hidden">

        {/* ── Image zone ───────────────────────────────────────── */}
        <div className="relative bg-[#F7F8FA]" style={{ height: "160px" }}>

          {/* Discount pill + wishlist — top right */}
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

          {/* Product image */}
          <Link
            href={`/products/${product.slug}`}
            className="absolute inset-0 flex items-center justify-center p-4"
          >
            <div className="relative w-full h-full">
              <Image
                src={/^(\/|https?:\/\/)/.test(shownImage) ? shownImage : "/logo/pure-apple-logo.png"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 220px"
                className="object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
              />
            </div>
          </Link>
        </div>

        {/* ── Info zone ─────────────────────────────────────────── */}
        <div className="px-2.5 pt-2.5 pb-3 flex flex-col flex-1">

          {/* Brand label (optional) */}
          {product.brand && (
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
              {product.brand}
            </p>
          )}

          {/* Name */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-gray-900 font-bold text-[13.5px] leading-snug hover:text-brand-500 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Variant / color label */}
          {shownVariant && (
            <p className="text-gray-400 text-[10px] mt-0.5 truncate">{shownVariant}</p>
          )}

          {/* Color swatches */}
          {colors.length > 0 && (
            <ColorSwatches colors={colors} active={colorIdx} onSelect={setColorIdx} />
          )}

          {/* Rating */}
          {product.rating != null && product.rating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Star size={10} className="fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] font-semibold text-gray-600">{product.rating.toFixed(1)}</span>
              {product.reviewCount != null && product.reviewCount > 0 && (
                <span className="text-[9px] text-gray-400">({product.reviewCount})</span>
              )}
            </div>
          )}

          {/* Specs pills */}
          {product.specs && (
            <div className="flex items-center flex-nowrap gap-1 mt-1 overflow-hidden">
              {product.specs.screen && (
                <span className="inline-flex items-center gap-0.5 whitespace-nowrap shrink-0 text-[9px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">
                  📱{product.specs.screen}
                </span>
              )}
              {product.specs.ram && (
                <span className="inline-flex items-center gap-0.5 whitespace-nowrap shrink-0 text-[9px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">
                  ⚙️{product.specs.ram}
                </span>
              )}
              {product.specs.camera && (
                <span className="inline-flex items-center gap-0.5 whitespace-nowrap shrink-0 text-[9px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">
                  📷{product.specs.camera}
                </span>
              )}
            </div>
          )}

          {/* ── Price block ───────────────────────────────────── */}
          <div className="mt-2">
            {product.showStartingFrom && (
              <p className="text-[9px] text-gray-400 mb-0.5 uppercase tracking-wide">Starting from</p>
            )}
            <div className="flex items-baseline flex-wrap gap-x-1.5 gap-y-0.5">
              {/* Discounted / current price */}
              <span className="text-gray-900 font-extrabold text-[16px] tracking-tight leading-none">
                ৳{product.price.toLocaleString("en-BD")}
              </span>

              {/* Original (crossed) price */}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] line-through text-gray-400 leading-none">
                  ৳{product.originalPrice.toLocaleString("en-BD")}
                </span>
              )}

              {/* Saved % */}
              {discount && (
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded leading-none">
                  Save {discount}%
                </span>
              )}
            </div>
          </div>

          {/* ── Buttons ───────────────────────────────────────── */}
          <div className="flex gap-1.5 mt-2.5">
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
    </div>
  );
}
