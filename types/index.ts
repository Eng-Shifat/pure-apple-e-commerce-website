// SAVE PATH: types/index.ts
export interface Product {
  id: string;
  name: string;
  variant: string;
  /**
   * `price` = brand-new price (backward compat).
   * যদি condition === "pre-owned" হয় তাহলে `pre_owned_price` use করো।
   * UI সবসময় resolvePrice() দিয়ে price নেবে।
   */
  price: number;
  original_price?: number;

  // ── Brand New vs Pre-Owned আলাদা price ──────────────────────────
  /** Brand New price (= price field, backward compat) */
  brand_new_price?: number | null;
  /** Pre-Owned price — এটা brand_new_price থেকে আলাদা, কখনো mix হবে না */
  pre_owned_price?: number | null;

  // ── Offer / Deal system (time-based, auto-expire) ────────────────
  /**
   * Brand New condition এর জন্য offer price।
   * offer_ends_at পার হলে auto expire, badge সরে যায়।
   */
  offer_price_brand_new?: number | null;
  /**
   * Pre-Owned condition এর জন্য offer price।
   */
  offer_price_pre_owned?: number | null;
  /** Offer শেষের ISO datetime — null = no expiry set */
  offer_ends_at?: string | null;
  /** Offer type label — "offer" | "today's deal" | custom */
  offer_type?: string | null;

  // ── Today's Deal (legacy, backward compat) ────────────────────
  is_today_deal?: boolean;
  deal_price?: number;
  deal_ends_at?: string | null;

  rating: number;
  review_count: number;
  image: string;
  slug: string;
  badge?: string;
  badge_color?: string;
  spec_screen?: string;
  spec_ram?: string;
  spec_camera?: string;
  is_featured?: boolean;
  category?: string;
  condition?: "brand-new" | "pre-owned";
  is_available?: boolean;
  stock?: number;
  product_code?: string;
  colors?: string;           // JSON string: ["Black","Burgundy","Glacier","Silver"]
  storage_variants?: string; // JSON string: ["128GB","256GB","512GB","1TB"]
  /**
   * JSON string: { "256GB": 174999, "512GB": 194999, "1TB": 224999 }
   * Key = storage label, Value = cash price for that storage (brand-new based)
   */
  storage_prices?: string;
  /**
   * JSON string: { "HK": 0, "JP": -5000, "US": 2000 }
   */
  region_prices?: string;
  /** comma-separated region codes: "HK,JP,US" */
  regions?: string;
  emi_available?: boolean;
  battery_health?: number | null;
  whatsapp_number?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Condition অনুযায়ী সঠিক base price resolve করে।
 * এটাই সব জায়গায় use করতে হবে — কোথাও directly p.price use করবে না।
 */
export function resolveBasePrice(p: Product): number {
  if (p.condition === "pre-owned") {
    return p.pre_owned_price ?? p.price;
  }
  return p.brand_new_price ?? p.price;
}

/**
 * Active offer price আছে কিনা চেক করে।
 * offer_ends_at পার হলে null return করে (expired)।
 */
export function resolveOfferPrice(p: Product): number | null {
  // Legacy today's deal
  if (p.is_today_deal && p.deal_price && p.deal_price > 0) {
    const expired = p.deal_ends_at ? new Date(p.deal_ends_at).getTime() < Date.now() : false;
    if (!expired) return p.deal_price;
  }
  // New offer system
  const offerEnded = p.offer_ends_at ? new Date(p.offer_ends_at).getTime() < Date.now() : false;
  if (offerEnded) return null;
  if (p.condition === "pre-owned" && p.offer_price_pre_owned) return p.offer_price_pre_owned;
  if (p.condition !== "pre-owned" && p.offer_price_brand_new) return p.offer_price_brand_new;
  return null;
}

/**
 * Product এ active offer/deal আছে কিনা।
 */
export function hasActiveOffer(p: Product): boolean {
  return resolveOfferPrice(p) !== null;
}

/**
 * Offer badge label (auto-badge system)।
 * offer_type দিলে সেটা, না হলে "Offer"।
 */
export function offerBadgeLabel(p: Product): string | null {
  if (!hasActiveOffer(p)) return null;
  if (p.is_today_deal && p.deal_price) return "Today's Deal";
  return p.offer_type ?? "Offer";
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
  selected_color?: string;
  selected_storage?: string;
  selected_region?: string;
}

export interface Order {
  id: string;
  user_id?: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  payment_method: "cod" | "bkash" | "nagad";
  created_at: string;
  subtotal?: number;
  delivery_area?: "dhaka" | "outside";
  delivery_charge?: number;
  advance_amount?: number;
  advance_method?: "bkash" | "nagad";
  payment_trx_id?: string;
  payment_sender?: string;
  payment_status?: "pending_review" | "verified" | "rejected";
  payment_proof_url?: string | null;
  reject_reason?: string | null;
  note?: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: "customer" | "admin";
}
