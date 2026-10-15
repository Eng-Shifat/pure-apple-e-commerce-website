export interface Product {
  id: string;
  name: string;
  variant: string;
  price: number;
  original_price?: number;
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
   * Key = storage label, Value = cash price for that storage
   */
  storage_prices?: string;
  /**
   * JSON string: { "HK": 0, "JP": -5000, "US": 2000 }
   * Key = region code, Value = price delta (+/-) from base storage price
   */
  region_prices?: string;
  /** comma-separated region codes available: "HK,JP,US" */
  regions?: string;
  emi_available?: boolean;
  whatsapp_number?: string;
  created_at?: string;
  updated_at?: string;
  is_today_deal?: boolean;
  deal_price?: number;
  deal_ends_at?: string | null;
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
