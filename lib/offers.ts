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

/**
 * সব জায়গায় একই নিয়মে দাম দেখানোর হিসাব।
 *  - final   = এখন কাস্টমার যে দাম দেবে (চালু deal/offer থাকলে সেটা, না হলে sale price)
 *  - compare = কাটা দাম = Original Price (sale price-এর চেয়ে বেশি হলে), না হলে sale price
 *  - off     = compare − final (কত টাকা ছাড়), percent = শতকরা ছাড়
 * উদাহরণ: main 1000, offer 800 → ছাড় 200; offer 550 → ছাড় 450।
 */
export function displayPricing(price: number, original?: number | null, deal?: number | null) {
  const sale = Number(price) || 0;
  const final = validDealPrice(sale, deal);
  const orig = Number(original) || 0;
  const reference = orig > sale ? orig : sale;
  const compare = reference > final ? reference : undefined;
  const off = compare ? compare - final : 0;
  const percent = compare ? Math.round((off / compare) * 100) : 0;
  return { final, compare, off, percent };
}

/** DB product row থেকে shop-এ দেখানোর price (চালু Today's Deal থাকলে সেটা) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function publicPrices(r: any): { price: number; originalPrice?: number } {
  const dealOn =
    !!r?.is_today_deal && (!r?.deal_ends_at || new Date(r.deal_ends_at).getTime() > Date.now());
  const d = displayPricing(Number(r?.price ?? 0), r?.original_price, dealOn ? r?.deal_price : null);
  return { price: d.final, originalPrice: d.compare };
}

/** offer price নির্ধারণ: per-product price > offer % > product price */
export function resolveOfferPrice(price: number, offerPrice?: number | null, percent?: number | null): number {
  if (offerPrice != null && Number(offerPrice) > 0) return validDealPrice(price, Number(offerPrice));
  if (percent && percent > 0) return Math.round(price * (1 - percent / 100));
  return price;
}
