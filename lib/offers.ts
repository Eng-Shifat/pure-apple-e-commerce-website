// Shared offer types + helpers (client & server safe)

export interface OfferProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  variant?: string;
  price: number;            // product-এর আসল price
  original_price?: number | null;
  offer_price: number;      // এই offer-এ final price
  rating?: number;
  review_count?: number;
  badge?: string | null;
  badge_color?: string | null;
  spec_screen?: string;
  spec_ram?: string;
  spec_camera?: string;
}

export interface Offer {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  emoji?: string | null;
  color: string;
  starts_at: string;
  ends_at: string;
  discount_percent?: number | null;
  is_active: boolean;
  sort_order: number;
  /** true হলে end time নেই (admin timer দেয়নি) — countdown দেখাবে না */
  no_timer?: boolean;
  status?: "live" | "upcoming" | "ended";
  product_count?: number;
  products?: OfferProduct[];
}

export function offerStatus(o: Pick<Offer, "starts_at" | "ends_at" | "is_active">, now = Date.now()): "live" | "upcoming" | "ended" {
  if (new Date(o.ends_at).getTime() <= now) return "ended";
  if (new Date(o.starts_at).getTime() > now) return "upcoming";
  return "live";
}

/**
 * Deal / offer price শুধু তখনই valid যখন সেটা sale price-এর চেয়ে কম।
 * না হলে (ভুল করে বেশি বা সমান দিলে) sale price-ই চলবে।
 */
export function validDealPrice(price: number, deal?: number | null): number {
  const p = Number(price) || 0;
  const d = Number(deal);
  return d > 0 && d < p ? d : p;
}

/** offer price নির্ধারণ: per-product price > offer % > product price */
export function resolveOfferPrice(price: number, offerPrice?: number | null, percent?: number | null): number {
  if (offerPrice != null && Number(offerPrice) > 0) return validDealPrice(price, Number(offerPrice));
  if (percent && percent > 0) return Math.round(price * (1 - percent / 100));
  return price;
}
