"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
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
  badge?: string; // e.g. "Best Seller", "10%"
  badgeColor?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [wished, setWished] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Image Container */}
      <div className="relative bg-gray-50 p-4 aspect-square flex items-center justify-center">
        {/* Badge */}
        {product.badge && (
          <span
            className="absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10"
            style={{ backgroundColor: product.badgeColor ?? "#2563EB" }}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setWished((w) => !w)}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart
            size={14}
            className={wished ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>

        {/* Product Image */}
        <Link href={`/products/${product.slug}`} className="relative w-36 h-36 block">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Info */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-gray-900 font-semibold text-sm leading-snug hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-400 text-xs mt-0.5">{product.variant}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-200 fill-gray-200"
                }
              />
            ))}
          </div>
          <span className="text-gray-400 text-[11px]">
            {product.rating} ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-gray-900 font-bold text-base">
            ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          {product.originalPrice && (
            <span className="text-gray-400 text-xs line-through">
              ${product.originalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all">
          <ShoppingCart size={13} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
