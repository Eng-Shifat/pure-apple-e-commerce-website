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
  colors?: string;        // JSON string: ["Black","Burgundy","Glacier","Silver"]
  storage_variants?: string; // JSON string: ["128GB","256GB","512GB","1TB"]
  emi_available?: boolean;
  whatsapp_number?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
  selected_color?: string;
  selected_storage?: string;
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
