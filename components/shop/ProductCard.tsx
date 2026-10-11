"use client";

/**
 * ProductCard — SharedProductCard-এর thin wrapper
 * পুরনো interface বজায় রেখে SharedProductCard use করে।
 * Home page components (PopularProducts, BestDeals, PhoneSeriesSection) এটা import করে।
 */

import SharedProductCard, { type SharedProduct } from "./SharedProductCard";
import type { ColorVariant } from "@/lib/phoneCatalog";

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
  storage?: string;
  colors?: ColorVariant[];
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
  const shared: SharedProduct = {
    id: product.id,
    name: product.name,
    variant: product.variant,
    price: product.price,
    originalPrice: product.originalPrice,
    rating: product.rating,
    reviewCount: product.reviewCount,
    image: product.image,
    slug: product.slug,
    storage: product.storage,
    colors: product.colors,
    badge: product.badge,
    badgeColor: product.badgeColor,
    specs: product.specs,
  };

  return (
    <SharedProductCard
      product={shared}
      onAddToCart={onAddToCart ? (p) => onAddToCart(product) : undefined}
    />
  );
}
