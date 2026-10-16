// SAVE PATH: components/shop/SharedProductCard.tsx
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
import { Heart, ShoppingCart, Zap } from "lucide-react";
import { useState } from "react";
import type { ColorVariant } from "@/lib/phoneCatalog";
import ColorSwatches from "./ColorSwatches";
import { useWishlistStore } from "@/store/wishlistStore";

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
  const { toggle, isWished } = useWishlistStore();
  const wished = isWished(product.id);
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
    /*
     * pt-4 দিয়ে badge-এর জন্য উপরে space।
     * overflow-visible যাতে badge দেখা যায়।
     * min-w-0 দিয়ে grid blowout বন্ধ করা হয়েছে।
     */
    <div className="group relative flex flex-col pt-4 min-w-0 w-full" style={{ overflow: "visible" }}>

      {/* ── Badge — card এর উপরে half-outside ───────────────── */}
      {product.badge && (
        <div className="absolute z-30 left-3" style={{ top: "2px" }}>
          <span
            className="inline-block text-white text-[10px] font-extrabold px-2.5 py-[5px] rounded-full shadow-lg whitespace-nowrap tracking-wide"
            style={{ backgroundColor: product.badgeColor ?? "#FB5724" }}
          >
            {product.badge}
          </span>
        </div>
      )}

      {/* ── Card body ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-[0_8px_30px_rgba(251,87,36,0.12)] transition-all duration-300 flex flex-col flex-1 overflow-hidden">

        {/* ── Image zone ───────────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-[#F7F8FA] to-[#F0F1F3]" style={{ height: "180px" }}>

          {/* Discount pill + wishlist — top right */}
          <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1.5">
            {discount && (
              <span className="bg-red-500 text-white text-[9px] font-extrabold px-2 py-[3px] rounded-full shadow-sm leading-none">
                -{discount}%
              </span>
            )}
            <button
              onClick={() => toggle(product as never)}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 active:scale-95
                ${wished
                  ? "bg-red-500 border-0"
                  : "bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-red-300"
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
                className="object-contain group-hover:scale-[1.06] transition-transform duration-500 drop-shadow-lg"
              />
            </div>
          </Link>
        </div>

        {/* ── Thin accent line under image ──────────────────────── */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-orange-100 to-transparent" />

        {/* ── Info zone ─────────────────────────────────────────── */}
        <div className="px-3 pt-2.5 pb-3 flex flex-col flex-1">

          {/* Brand label (optional) */}
          {product.brand && (
            <p className="text-[9px] font-bold uppercase tracking-widest text-orange-400 mb-0.5">
              {product.brand}
            </p>
          )}

          {/* Name */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-gray-900 font-bold text-[13px] leading-snug hover:text-orange-500 transition-colors line-clamp-2">
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

          {/* Specs pills */}
          {product.specs && (
            <div className="flex items-center flex-nowrap gap-1 mt-1.5 w-full min-w-0">
              {product.specs.screen && (
                <span className="inline-flex items-center gap-0.5 whitespace-nowrap shrink-0 text-[9px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5 leading-none">
                  📱 {product.specs.screen}
                </span>
              )}
              {product.specs.ram && (
                <span className="inline-flex items-center gap-0.5 whitespace-nowrap shrink-0 text-[9px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5 leading-none">
                  💾 {product.specs.ram}
                </span>
              )}
              {product.specs.camera && (
                <span className="inline-flex items-center gap-0.5 whitespace-nowrap shrink-0 text-[9px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5 leading-none">
                  📷 {product.specs.camera}
                </span>
              )}
            </div>
          )}

          {/* ── Price block ───────────────────────────────────── */}
          <div className="mt-auto pt-2">
            {product.showStartingFrom && (
              <p className="text-[9px] text-gray-400 mb-0.5 uppercase tracking-wide">Starting from</p>
            )}
            <div className="flex items-baseline flex-wrap gap-x-1.5 gap-y-0.5">
              {/* Current price */}
              <span className="text-gray-900 font-extrabold text-base tracking-tight leading-none">
                ৳{product.price.toLocaleString("en-BD")}
              </span>

              {/* Original (crossed) price */}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] line-through text-gray-400 leading-none">
                  ৳{product.originalPrice.toLocaleString("en-BD")}
                </span>
              )}
            </div>
          </div>

          {/* ── Buttons ────────────────────────────────────────── */}
          <div className="flex gap-1.5 mt-2.5 w-full">
            <button
              onClick={handleAddToCart}
              className={`
                relative flex-1 h-9 flex items-center justify-center gap-1
                text-[10px] font-bold rounded-xl overflow-hidden
                transition-all duration-200 active:scale-95
                ${added
                  ? "bg-green-500 text-white shadow-[0_4px_12px_rgba(34,197,94,0.35)]"
                  : "bg-[#FB5724] hover:bg-[#e84e1f] text-white shadow-[0_4px_12px_rgba(251,87,36,0.30)] hover:shadow-[0_6px_16px_rgba(251,87,36,0.40)]"
                }
              `}
            >
              <ShoppingCart size={12} className="shrink-0" />
              <span className="whitespace-nowrap">{added ? "Added ✓" : "Add to Cart"}</span>
            </button>

            <Link
              href={`/products/${product.slug}`}
              className="
                h-9 w-[52px] shrink-0 flex items-center justify-center gap-0.5
                text-[10px] font-bold rounded-xl
                border-2 border-[#FB5724]/70 text-[#FB5724]
                hover:bg-[#FB5724] hover:text-white hover:border-[#FB5724]
                transition-all duration-200 active:scale-95
              "
            >
              <Zap size={11} className="shrink-0" />
              <span>Buy</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
