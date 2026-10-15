/**
 * Shared phone catalog — প্রতিটা model-এর color অনুযায়ী আলাদা image।
 * Image paths: actual public folder structure অনুযায়ী (spaces allowed — Next.js encodeURI handles it).
 * Homepage Popular / Best Deals / Series section + product pages সব এখান থেকে data নেয়।
 * নতুন product বা color যোগ করতে শুধু এই file-এ entry বসালেই হবে।
 */

export interface ColorVariant {
  name: string;
  hex: string;
  image: string;
}

export interface CatalogPhone {
  id: string;
  brand: BrandKey;
  name: string;
  storage: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  slug: string;
  badge?: string;
  badgeColor?: string;
  specs: { screen: string; ram: string; camera: string };
  colors: ColorVariant[];
  gallery?: string[];
}

export type BrandKey =
  | "apple" | "samsung" | "oneplus" | "redmi" | "realme" | "google"
  | "vivo" | "iqoo" | "honor" | "motorola" | "nothing";

export const BRAND_LABEL: Record<BrandKey, string> = {
  apple: "Apple", samsung: "Samsung", google: "Google", oneplus: "OnePlus",
  redmi: "Redmi", realme: "Realme", vivo: "Vivo", iqoo: "iQOO",
  honor: "Honor", motorola: "Motorola", nothing: "Nothing",
};

export interface BrandSeries {
  key: BrandKey;
  seriesName: string;
  accentColor: string;
  accentBg: string;
  borderColor: string;
}

export const BRAND_SERIES: BrandSeries[] = [
  { key: "apple",    seriesName: "Apple iPhone Series",    accentColor: "#1d1d1f", accentBg: "#f5f5f7", borderColor: "#d1d1d6" },
  { key: "samsung",  seriesName: "Samsung Galaxy Series",  accentColor: "#1428A0", accentBg: "#f0f4ff", borderColor: "#bde5bf" },
  { key: "google",   seriesName: "Google Pixel Series",    accentColor: "#4285F4", accentBg: "#eff6ff", borderColor: "#bfdbfe" },
  { key: "oneplus",  seriesName: "OnePlus Series",         accentColor: "#dc2626", accentBg: "#fff1f1", borderColor: "#fecaca" },
  { key: "vivo",     seriesName: "Vivo Series",            accentColor: "#3B5BDB", accentBg: "#edf2ff", borderColor: "#bac8ff" },
  { key: "iqoo",     seriesName: "iQOO Series",            accentColor: "#111827", accentBg: "#f3f4f6", borderColor: "#d1d5db" },
  { key: "honor",    seriesName: "Honor Series",           accentColor: "#0891B2", accentBg: "#ecfeff", borderColor: "#a5f3fc" },
  { key: "redmi",    seriesName: "Redmi Series",           accentColor: "#E8470F", accentBg: "#fff7ed", borderColor: "#fed7aa" },
  { key: "realme",   seriesName: "Realme Series",          accentColor: "#A87A05", accentBg: "#fffbeb", borderColor: "#fde68a" },
  { key: "motorola", seriesName: "Motorola Series",        accentColor: "#7C3AED", accentBg: "#f5f3ff", borderColor: "#ddd6fe" },
  { key: "nothing",  seriesName: "Nothing Series",         accentColor: "#374151", accentBg: "#f9fafb", borderColor: "#e5e7eb" },
];

export const PHONES: CatalogPhone[] = [

  // ═══════════════════════════════════════════════
  // APPLE — /images/Phone/iphone/...
  // ═══════════════════════════════════════════════
  {
    id: "a1", brand: "apple", name: "iPhone 18 Pro Max", storage: "256GB",
    price: 174999, originalPrice: 184999, rating: 4.9, reviewCount: 420,
    slug: "iphone-18-pro-max", badge: "New", badgeColor: "#7C3AED",
    specs: { screen: "6.9″", ram: "12GB", camera: "48 MP" },
        colors: [
      { name: "Black", hex: "#1c1c1e", image: "/images/Phone/iphone/iPhone 18/iPhone 18 pro max/iPhone_18_Pro_Max.webp" },
      { name: "Sky Blue", hex: "#A9C4DE", image: "/images/Phone/iphone/iPhone 18/iPhone 18 pro max/iPhone 18 pro max.webp" },
      { name: "Burgundy", hex: "#6D2B3D", image: "/images/Phone/iphone/iPhone 18/iPhone 18 pro max/iPhone_18_Pro_Max.webp" },
      { name: "Silver", hex: "#E8E8E8", image: "/images/Phone/iphone/iPhone 18/iPhone 18 pro max/iPhone 18 pro max.webp" },
    ],
  },
  {
    id: "a2", brand: "apple", name: "iPhone 17 Pro Max", storage: "256GB",
    price: 154999, originalPrice: 164999, rating: 4.8, reviewCount: 980,
    slug: "iphone-17-pro-max", badge: "Hot", badgeColor: "#FB5724",
    specs: { screen: "6.9″", ram: "12GB", camera: "48 MP" },
        colors: [
      { name: "Desert Titanium", hex: "#C8A882", image: "/images/Phone/iphone/iPhone 17/iPhone 17 pro max/iPhone_17_Pro_Max.webp" },
      { name: "Black Titanium", hex: "#3A3A3C", image: "/images/Phone/iphone/iPhone 17/iPhone 17 pro max/iPhone_17_Pro_Max.webp" },
      { name: "White Titanium", hex: "#E8E8E0", image: "/images/Phone/iphone/iPhone 17/iPhone 17 pro max/iPhone_17_Pro_Max.webp" },
    ],
  },
  {
    id: "a3", brand: "apple", name: "iPhone 17", storage: "256GB",
    price: 119999, originalPrice: 129999, rating: 4.7, reviewCount: 760,
    slug: "iphone-17",
    specs: { screen: "6.3″", ram: "8GB", camera: "48 MP" },
        colors: [
      { name: "Lavender", hex: "#C8B8E8", image: "/images/Phone/iphone/iPhone 17/iPhone_17.webp" },
      { name: "Teal", hex: "#4A8888", image: "/images/Phone/iphone/iPhone 17/iPhone_17.webp" },
      { name: "Pink", hex: "#F2A7B0", image: "/images/Phone/iphone/iPhone 17/iPhone_17.webp" },
      { name: "Black", hex: "#1c1c1e", image: "/images/Phone/iphone/iPhone 17/iPhone_17.webp" },
    ],
  },
  {
    id: "a4", brand: "apple", name: "iPhone 16 Pro", storage: "256GB",
    price: 114499, originalPrice: 124999, rating: 4.8, reviewCount: 2500,
    slug: "iphone-16-pro", badge: "Best Seller", badgeColor: "#4FAE53",
    specs: { screen: "6.3″", ram: "8GB", camera: "48 MP" },
        colors: [
      { name: "Desert Titanium", hex: "#C8A882", image: "/images/Phone/iphone/iPhone 16/iPhone 16 pro/iphone_16pro.webp" },
      { name: "Black Titanium", hex: "#3A3A3C", image: "/images/Phone/iphone/iPhone 16/iPhone 16 pro/iphone_16pro.webp" },
      { name: "White Titanium", hex: "#E8E8E0", image: "/images/Phone/iphone/iPhone 16/iPhone 16 pro/iphone_16pro.webp" },
      { name: "Natural Titanium", hex: "#D4C5A9", image: "/images/Phone/iphone/iPhone 16/iPhone 16 pro/iphone_16pro.webp" },
    ],
  },
  {
    id: "a5", brand: "apple", name: "iPhone 16", storage: "128GB",
    price: 94999, rating: 4.6, reviewCount: 1800,
    slug: "iphone-16",
    specs: { screen: "6.1″", ram: "8GB", camera: "48 MP" },
        colors: [
      { name: "White", hex: "#F5F5F0", image: "/images/Phone/iphone/iPhone 16/iPhone_16.webp" },
      { name: "Black", hex: "#1c1c1e", image: "/images/Phone/iphone/iPhone 16/iPhone16.webp" },
      { name: "Pink", hex: "#F2A7B0", image: "/images/Phone/iphone/iPhone 16/iPhone_16-removebg-preview.webp" },
      { name: "Teal", hex: "#4A8888", image: "/images/Phone/iphone/iPhone 16/iPhone_16.webp" },
      { name: "Ultramarine", hex: "#3A5A9A", image: "/images/Phone/iphone/iPhone 16/iPhone_16.webp" },
    ],
  },
  {
    id: "a6", brand: "apple", name: "iPhone 15 Pro Max", storage: "256GB",
    price: 124999, originalPrice: 134999, rating: 4.7, reviewCount: 2100,
    slug: "iphone-15-pro-max",
    specs: { screen: "6.7″", ram: "8GB", camera: "48 MP" },
        colors: [
      { name: "Natural Titanium", hex: "#D4C5A9", image: "/images/Phone/iphone/iPhone 15/iPhone 15 pro max/iPhone 15 pro max.webp" },
      { name: "Black Titanium", hex: "#3A3A3C", image: "/images/Phone/iphone/iPhone 15/iPhone 15 pro max/iPhone 15 pro max.webp" },
      { name: "Blue Titanium", hex: "#5A7A9A", image: "/images/Phone/iphone/iPhone 15/iPhone 15 pro max/iPhone 15 pro max.webp" },
      { name: "White Titanium", hex: "#E8E8E0", image: "/images/Phone/iphone/iPhone 15/iPhone 15 pro max/iPhone 15 pro max.webp" },
    ],
  },
  {
    id: "a7", brand: "apple", name: "iPhone 15 Pro", storage: "128GB",
    price: 104999, originalPrice: 114999, rating: 4.7, reviewCount: 1900,
    slug: "iphone-15-pro",
    specs: { screen: "6.1″", ram: "8GB", camera: "48 MP" },
        colors: [
      { name: "Black Titanium", hex: "#3A3A3C", image: "/images/Phone/iphone/iPhone 15/iPhone 15 pro/iPhone 15 pro.webp" },
      { name: "Natural Titanium", hex: "#D4C5A9", image: "/images/Phone/iphone/iPhone 15/iPhone 15 pro/iPhone 15 pro.webp" },
      { name: "Blue Titanium", hex: "#5A7A9A", image: "/images/Phone/iphone/iPhone 15/iPhone 15 pro/iPhone 15 pro.webp" },
      { name: "White Titanium", hex: "#E8E8E0", image: "/images/Phone/iphone/iPhone 15/iPhone 15 pro/iPhone 15 pro.webp" },
    ],
  },
  {
    id: "a8", brand: "apple", name: "iPhone 15", storage: "128GB",
    price: 79999, originalPrice: 89999, rating: 4.7, reviewCount: 3200,
    slug: "iphone-15",
    specs: { screen: "6.1″", ram: "6GB", camera: "48 MP" },
        colors: [
      { name: "Pink", hex: "#F2A7B0", image: "/images/Phone/iphone/iPhone 15/iPhone 15.webp" },
      { name: "Yellow", hex: "#F5E050", image: "/images/Phone/iphone/iPhone 15/iPhone 15.webp" },
      { name: "Green", hex: "#4A8858", image: "/images/Phone/iphone/iPhone 15/iPhone 15.webp" },
      { name: "Black", hex: "#1c1c1e", image: "/images/Phone/iphone/iPhone 15/iPhone 15.webp" },
      { name: "Blue", hex: "#4870B8", image: "/images/Phone/iphone/iPhone 15/iPhone 15.webp" },
    ],
  },
  {
    id: "a9", brand: "apple", name: "iPhone 13 Pro Max", storage: "256GB",
    price: 64999, originalPrice: 72999, rating: 4.6, reviewCount: 1500,
    slug: "iphone-13-pro-max",
    specs: { screen: "6.7″", ram: "6GB", camera: "12 MP" },
        colors: [
      { name: "Sierra Blue", hex: "#9DC0D4", image: "/images/Phone/iphone/iPhone 13/iPhone 13 pro max/iPhone 13 pro max.webp" },
      { name: "Graphite", hex: "#4A4A4A", image: "/images/Phone/iphone/iPhone 13/iPhone 13 pro max/iPhone 13 pro max.webp" },
      { name: "Gold", hex: "#C8A870", image: "/images/Phone/iphone/iPhone 13/iPhone 13 pro max/iPhone 13 pro max.webp" },
      { name: "Silver", hex: "#E8E8E8", image: "/images/Phone/iphone/iPhone 13/iPhone 13 pro max/iPhone 13 pro max.webp" },
    ],
  },
  {
    id: "a10", brand: "apple", name: "iPhone 11 Pro", storage: "64GB",
    price: 34999, rating: 4.4, reviewCount: 900,
    slug: "iphone-11-pro",
    specs: { screen: "5.8″", ram: "4GB", camera: "12 MP" },
        colors: [
      { name: "Midnight Green", hex: "#3D5A4C", image: "/images/Phone/iphone/iPhone 11/iPhone-11.webp" },
      { name: "Space Gray", hex: "#4A4A4A", image: "/images/Phone/iphone/iPhone 11/iPhone-11.webp" },
      { name: "Silver", hex: "#E8E8E8", image: "/images/Phone/iphone/iPhone 11/iPhone-11.webp" },
      { name: "Gold", hex: "#C8A870", image: "/images/Phone/iphone/iPhone 11/iPhone-11.webp" },
    ],
  },

  // ═══════════════════════════════════════════════
  // SAMSUNG
  // ═══════════════════════════════════════════════
  {
    id: "s1", brand: "samsung", name: "Galaxy S26 Ultra", storage: "256GB",
    price: 174999, originalPrice: 189999, rating: 4.8, reviewCount: 260,
    slug: "galaxy-s26-ultra", badge: "New", badgeColor: "#7C3AED",
    specs: { screen: "6.9″", ram: "12GB", camera: "200 MP" },
        colors: [
      { name: "Black", hex: "#1c1c1e", image: "/images/Phone/Samsung/Galaxy S26 Ultra/Samsung_Galaxy_S26_Ultra_Black.webp" },
      { name: "Cobalt Violet", hex: "#4B4D9E", image: "/images/Phone/Samsung/Galaxy S26 Ultra/Samsung_Galaxy_s26_ultra_Cobalt.webp" },
    ],
  },
  {
    id: "s2", brand: "samsung", name: "Galaxy S25 Ultra", storage: "256GB",
    price: 164999, originalPrice: 179999, rating: 4.7, reviewCount: 870,
    slug: "galaxy-s25-ultra", badge: "Hot", badgeColor: "#FB5724",
    specs: { screen: "6.9″", ram: "12GB", camera: "200 MP" },
        colors: [
      { name: "Silver", hex: "#C0C0C0", image: "/images/Phone/Samsung/s25-ultra-silver.webp" },
      { name: "Titanium Black", hex: "#2C2C2C", image: "/images/Phone/Samsung/Samsung_s25_ultra.webp" },
    ],
  },
  {
    id: "s3", brand: "samsung", name: "Galaxy S25+", storage: "256GB",
    price: 134999, rating: 4.6, reviewCount: 540,
    slug: "galaxy-s25-plus",
    specs: { screen: "6.7″", ram: "12GB", camera: "50 MP" },
        colors: [
      { name: "Icy Blue", hex: "#A8C8D8", image: "/images/Phone/Samsung/s25-plus-icy-blue.webp" },
    ],
  },
  {
    id: "s4", brand: "samsung", name: "Galaxy S25", storage: "128GB",
    price: 109999, originalPrice: 119999, rating: 4.6, reviewCount: 1100,
    slug: "galaxy-s25",
    specs: { screen: "6.2″", ram: "12GB", camera: "50 MP" },
        colors: [
      { name: "Silver Shadow", hex: "#B8B8C0", image: "/images/Phone/Samsung/s25-silver.webp" },
      { name: "Icy Blue", hex: "#A8C8D8", image: "/images/Phone/Samsung/Samsung Galaxy S25/Samsung_Galaxy_S25+_5G_-_ICY_Blue.webp" },
    ],
  },
  {
    id: "s5", brand: "samsung", name: "Galaxy S25 FE", storage: "128GB",
    price: 84999, originalPrice: 92999, rating: 4.4, reviewCount: 430,
    slug: "galaxy-s25-fe",
    specs: { screen: "6.7″", ram: "8GB", camera: "50 MP" },
        colors: [
      { name: "Navy", hex: "#1B2A4A", image: "/images/Phone/Samsung/s25-fe-navy.webp" },
    ],
  },
  {
    id: "s6", brand: "samsung", name: "Galaxy S24 Ultra", storage: "256GB",
    price: 144999, originalPrice: 159999, rating: 4.7, reviewCount: 1980,
    slug: "samsung-galaxy-s24-ultra", badge: "Best Seller", badgeColor: "#4FAE53",
    specs: { screen: "6.8″", ram: "12GB", camera: "200 MP" },
        colors: [
      { name: "Titanium Black", hex: "#2C2C2C", image: "/images/Phone/Samsung/s24-ultra-black.webp" },
    ],
  },
  {
    id: "s7", brand: "samsung", name: "Galaxy A37 5G", storage: "128GB",
    price: 44999, originalPrice: 49999, rating: 4.3, reviewCount: 390,
    slug: "galaxy-a37",
    specs: { screen: "6.7″", ram: "8GB", camera: "50 MP" },
        colors: [
      { name: "Awesome Graphite", hex: "#4A4A4A", image: "/images/Phone/Samsung/a37-graphite.webp" },
    ],
  },

  // ═══════════════════════════════════════════════
  // GOOGLE — /images/Phone/Google Pixel/...
  // ═══════════════════════════════════════════════
  {
    id: "g1", brand: "google", name: "Pixel 11 Pro XL", storage: "256GB",
    price: 139999, originalPrice: 149999, rating: 4.7, reviewCount: 120,
    slug: "pixel-11-pro-xl", badge: "New", badgeColor: "#7C3AED",
    specs: { screen: "6.8″", ram: "16GB", camera: "50 MP" },
        colors: [
      { name: "Obsidian", hex: "#1C1C1E", image: "/images/Phone/Google Pixel/Google Pixel 11/Google_Pixel_11_Pro_XL_5G_Obsidian.webp" },
      { name: "Jade", hex: "#4A7C6A", image: "/images/Phone/Google Pixel/Google Pixel 11/google pixel 11 pro.webp" },
    ],
  },
  {
    id: "g2", brand: "google", name: "Pixel 11 Pro", storage: "256GB",
    price: 124999, rating: 4.7, reviewCount: 150,
    slug: "pixel-11-pro", badge: "New", badgeColor: "#7C3AED",
    specs: { screen: "6.3″", ram: "16GB", camera: "50 MP" },
        colors: [
      { name: "Jade", hex: "#4A7C6A", image: "/images/Phone/Google Pixel/Google Pixel 11/Google Pixel 11 Pro/google pixel 11 pro.webp" },
      { name: "Obsidian", hex: "#1C1C1E", image: "/images/Phone/Google Pixel/Google Pixel 11/Google Pixel 11 Pro/google pixel 11 pro XL.webp" },
    ],
  },
  {
    id: "g3", brand: "google", name: "Pixel 10 Pro", storage: "256GB",
    price: 109999, originalPrice: 119999, rating: 4.7, reviewCount: 310,
    slug: "google-pixel-10-pro", badge: "Hot", badgeColor: "#FB5724",
    specs: { screen: "6.3″", ram: "16GB", camera: "50 MP" },
        colors: [
      { name: "Moonstone", hex: "#A8A8A0", image: "/images/Phone/Google Pixel/Google Pixel 10/Google Pixel 10 Pro.webp" },
    ],
  },
  {
    id: "g4", brand: "google", name: "Pixel 9 Pro XL", storage: "256GB",
    price: 104999, originalPrice: 114999, rating: 4.6, reviewCount: 420,
    slug: "pixel-9-pro-xl",
    specs: { screen: "6.8″", ram: "16GB", camera: "50 MP" },
        colors: [
      { name: "Obsidian", hex: "#1C1C1E", image: "/images/Phone/Google Pixel/Google Pixel 9/Google Pixel 9 Pro/Google_Pixel_9_Pro_XL-removebg-preview.webp" },
      { name: "Hazel", hex: "#8A9070", image: "/images/Phone/Google Pixel/Google Pixel 9/Google Pixel 9 Pro/Google_Pixel_9_Pro__128GB__Hazel_-_Unlocked__Renewed_-removebg-preview.webp" },
    ],
  },
  {
    id: "g5", brand: "google", name: "Pixel 9", storage: "128GB",
    price: 79999, rating: 4.4, reviewCount: 530,
    slug: "google-pixel-9", badge: "Best Seller", badgeColor: "#4FAE53",
    specs: { screen: "6.3″", ram: "12GB", camera: "50 MP" },
        colors: [
      { name: "Obsidian", hex: "#1C1C1E", image: "/images/Phone/Google Pixel/Google Pixel 9/Google Pixel 9/Google_Pixel_9_5G_Obsidian.webp" },
      { name: "Porcelain", hex: "#F0EDE8", image: "/images/Phone/Google Pixel/Google Pixel 9/Google Pixel 9/Google_Pixel_9 Porcelain.webp" },
      { name: "Peony", hex: "#E8A0B0", image: "/images/Phone/Google Pixel/Google Pixel 9/Google Pixel 9/GOOGLE__Pixel_9_Peony.webp" },
    ],
  },
  {
    id: "g6", brand: "google", name: "Pixel 9a", storage: "128GB",
    price: 54999, originalPrice: 59999, rating: 4.3, reviewCount: 380,
    slug: "pixel-9a",
    specs: { screen: "6.3″", ram: "8GB", camera: "48 MP" },
        colors: [
      { name: "Obsidian", hex: "#1C1C1E", image: "/images/Phone/Google Pixel/Google Pixel 9/Google Pixel 9a/Google_Pixel_9A__Obsidian.webp" },
      { name: "Iris", hex: "#7A7AC8", image: "/images/Phone/Google Pixel/Google Pixel 9/Google Pixel 9a/Google_Pixel_9a_Iris.webp" },
      { name: "Peony", hex: "#E8A0B0", image: "/images/Phone/Google Pixel/Google Pixel 9/Google Pixel 9a/Google_Pixel_9a_Peony.webp" },
    ],
  },
  {
    id: "g7", brand: "google", name: "Pixel 8 Pro", storage: "128GB",
    price: 74999, originalPrice: 82999, rating: 4.5, reviewCount: 610,
    slug: "pixel-8-pro",
    specs: { screen: "6.7″", ram: "12GB", camera: "50 MP" },
        colors: [
      { name: "Obsidian", hex: "#1C1C1E", image: "/images/Phone/Google Pixel/Goolge Pixel 8/Google Pixel 8 Pro/Google Pixel 8 Pro Obsidian.jpg" },
      { name: "Porcelain", hex: "#F0EDE8", image: "/images/Phone/Google Pixel/Goolge Pixel 8/Google Pixel 8 Pro/Google Pixel 8 Pro Porcelain.jpg" },
      { name: "Mint", hex: "#A8D8C8", image: "/images/Phone/Google Pixel/Goolge Pixel 8/Google Pixel 8 Pro/Google Pixel 8 Pro Mint.jpg" },
      { name: "Bay", hex: "#6890C8", image: "/images/Phone/Google Pixel/Goolge Pixel 8/Google Pixel 8 Pro/Google Pixel 8 Pro Bay.jpg" },
    ],
  },
  {
    id: "g8", brand: "google", name: "Pixel 8", storage: "128GB",
    price: 64999, originalPrice: 74999, rating: 4.4, reviewCount: 680,
    slug: "google-pixel-8",
    specs: { screen: "6.2″", ram: "8GB", camera: "50 MP" },
        colors: [
      { name: "Obsidian", hex: "#1C1C1E", image: "/images/Phone/Google Pixel/Goolge Pixel 8/Google Pixel 8/Google Pixel 8 256Gb - Obsidian Black.jpg" },
      { name: "Mint", hex: "#A8D8C8", image: "/images/Phone/Google Pixel/Goolge Pixel 8/Google Pixel 8/Google Pixel 8 Mint.jpg" },
      { name: "Rose", hex: "#E8B0B8", image: "/images/Phone/Google Pixel/Goolge Pixel 8/Google Pixel 8/Google Pixel 8 Rose.jpg" },
      { name: "Haze", hex: "#B0C0C8", image: "/images/Phone/Google Pixel/Goolge Pixel 8/Google Pixel 8/google pixel 8 Haze.jpg" },
    ],
  },
  {
    id: "g9", brand: "google", name: "Pixel 8a", storage: "128GB",
    price: 44999, originalPrice: 49999, rating: 4.3, reviewCount: 390,
    slug: "pixel-8a",
    specs: { screen: "6.1″", ram: "8GB", camera: "64 MP" },
        colors: [
      { name: "Obsidian", hex: "#1C1C1E", image: "/images/Phone/Google Pixel/Google Pixel 8/Goolge Pixel 8a/Google_Pixel_8_256Gb_-_Obsidian_Black-removebg-preview.webp" },
      { name: "Porcelain", hex: "#F0EDE8", image: "/images/Phone/Google Pixel/Google Pixel 8/Goolge Pixel 8a/Google Pixel 8a Porcelain.jpg" },
      { name: "Aloe", hex: "#A8C8A0", image: "/images/Phone/Google Pixel/Google Pixel 8/Goolge Pixel 8a/Google_Pixel_8_Mint-removebg-preview.webp" },
    ],
  },
  {
    id: "g10", brand: "google", name: "Pixel 7 Pro", storage: "128GB",
    price: 49999, rating: 4.3, reviewCount: 420,
    slug: "pixel-7-pro",
    specs: { screen: "6.7″", ram: "12GB", camera: "50 MP" },
        colors: [
      { name: "Snow", hex: "#F0EDE8", image: "/images/Phone/Google Pixel/Google Pixel 7/Google Pixel 7 pro/Pixel 7 Pro.webp" },
    ],
  },
  {
    id: "g11", brand: "google", name: "Pixel 7", storage: "128GB",
    price: 39999, rating: 4.2, reviewCount: 350,
    slug: "pixel-7",
    specs: { screen: "6.3″", ram: "8GB", camera: "50 MP" },
        colors: [
      { name: "Snow", hex: "#F0EDE8", image: "/images/Phone/Google Pixel/Google Pixel 7/Google Pixel 7/Google Pixel 7 Snow.webp" },
      { name: "Obsidian", hex: "#1C1C1E", image: "/images/Phone/Google Pixel/Google Pixel 7/Google Pixel 7/Pixel 7 Obsidian.webp" },
    ],
  },

  // ═══════════════════════════════════════════════
  // ONEPLUS
  // ═══════════════════════════════════════════════
  {
    id: "o1", brand: "oneplus", name: "OnePlus 13s", storage: "256GB",
    price: 69999, originalPrice: 74999, rating: 4.5, reviewCount: 210,
    slug: "oneplus-13s", badge: "New", badgeColor: "#7C3AED",
    specs: { screen: "6.32″", ram: "12GB", camera: "50 MP" },
        colors: [
      { name: "Pink Satin", hex: "#E8B0C0", image: "/images/Phone/OnePlus/oneplus-13s-pink.webp" },
    ],
  },
  {
    id: "o2", brand: "oneplus", name: "OnePlus 12", storage: "256GB",
    price: 89999, rating: 4.5, reviewCount: 880,
    slug: "oneplus-12", badge: "Best Seller", badgeColor: "#4FAE53",
    specs: { screen: "6.82″", ram: "12GB", camera: "50 MP" },
        colors: [
      { name: "Silky Black", hex: "#1C1C1E", image: "/images/Phone/OnePlus/oneplus-12-black.webp" },
      { name: "Flowy Emerald", hex: "#3A7A5A", image: "/images/Phone/OnePlus/oneplus-12-flowy.webp" },
      { name: "Glacial White", hex: "#F0F0F0", image: "/images/Phone/OnePlus/oneplus-12-white.webp" },
    ],
  },
  {
    id: "o3", brand: "oneplus", name: "OnePlus 11R", storage: "256GB",
    price: 54999, originalPrice: 59999, rating: 4.4, reviewCount: 640,
    slug: "oneplus-11r",
    specs: { screen: "6.74″", ram: "16GB", camera: "50 MP" },
        colors: [
      { name: "Sonic Black", hex: "#1C1C1E", image: "/images/Phone/OnePlus/oneplus-11r-black.webp" },
      { name: "Galactic Silver", hex: "#C0C0C8", image: "/images/Phone/OnePlus/oneplus-11r-silver.webp" },
      { name: "Solar Red", hex: "#C83030", image: "/images/Phone/OnePlus/oneplus-11r-red.webp" },
    ],
  },
  {
    id: "o4", brand: "oneplus", name: "OnePlus 10 Pro", storage: "256GB",
    price: 64999, originalPrice: 69999, rating: 4.4, reviewCount: 720,
    slug: "oneplus-10-pro",
    specs: { screen: "6.7″", ram: "12GB", camera: "48 MP" },
        colors: [
      { name: "Volcanic Black", hex: "#1C1C1E", image: "/images/Phone/OnePlus/oneplus-10-pro-black.webp" },
      { name: "Emerald Forest", hex: "#2A5A3A", image: "/images/Phone/OnePlus/oneplus-10-pro-emerald.webp" },
      { name: "Panda White", hex: "#F0F0F0", image: "/images/Phone/OnePlus/oneplus-10-pro-white.webp" },
    ],
  },
  {
    id: "o5", brand: "oneplus", name: "OnePlus Nord 6", storage: "256GB",
    price: 44999, originalPrice: 48999, rating: 4.3, reviewCount: 300,
    slug: "oneplus-nord-6", badge: "New", badgeColor: "#7C3AED",
    specs: { screen: "6.7″", ram: "12GB", camera: "50 MP" },
        colors: [
      { name: "Jade Green", hex: "#4A7C6A", image: "/images/Phone/OnePlus/oneplus-nord-6.webp" },
    ],
  },
  {
    id: "o6", brand: "oneplus", name: "OnePlus Nord CE6", storage: "256GB",
    price: 36999, rating: 4.2, reviewCount: 260,
    slug: "oneplus-nord-ce6",
    specs: { screen: "6.7″", ram: "8GB", camera: "50 MP" },
        colors: [
      { name: "Black", hex: "#1C1C1E", image: "/images/Phone/OnePlus/oneplus-nord-ce6.webp" },
    ],
  },
  {
    id: "o7", brand: "oneplus", name: "OnePlus Nord CE6 Lite", storage: "128GB",
    price: 27999, rating: 4.1, reviewCount: 180,
    slug: "oneplus-nord-ce6-lite",
    specs: { screen: "6.7″", ram: "8GB", camera: "50 MP" },
        colors: [
      { name: "Black", hex: "#1C1C1E", image: "/images/Phone/OnePlus/oneplus-nord-ce6-lite.webp" },
    ],
  },

  // ═══════════════════════════════════════════════
  // REDMI
  // ═══════════════════════════════════════════════
  {
    id: "r1", brand: "redmi", name: "Redmi Note 15", storage: "128GB",
    price: 27999, originalPrice: 29999, rating: 4.4, reviewCount: 560,
    slug: "redmi-note-15", badge: "New", badgeColor: "#7C3AED",
    specs: { screen: "6.67″", ram: "8GB", camera: "108 MP" },
        colors: [
      { name: "Midnight Black", hex: "#1C1C1E", image: "/images/Phone/Redmi/redmi-note-15-black.webp" },
      { name: "Blue", hex: "#4870B8", image: "/images/Phone/Redmi/redmi-note-15-blue.webp" },
      { name: "Mist Purple", hex: "#8878C0", image: "/images/Phone/Redmi/redmi-note-15-purple.webp" },
    ],
  },
  {
    id: "r2", brand: "redmi", name: "Redmi Note 14", storage: "128GB",
    price: 24999, originalPrice: 27999, rating: 4.3, reviewCount: 1200,
    slug: "redmi-note-14", badge: "Hot", badgeColor: "#FB5724",
    specs: { screen: "6.67″", ram: "6GB", camera: "108 MP" },
        colors: [
      { name: "Midnight Black", hex: "#1C1C1E", image: "/images/Phone/Redmi/redmi-note-14-black.webp" },
      { name: "Lime Green", hex: "#7AB040", image: "/images/Phone/Redmi/redmi-note-14-green.webp" },
    ],
  },

  // ═══════════════════════════════════════════════
  // REALME
  // ═══════════════════════════════════════════════
  {
    id: "re1", brand: "realme", name: "Realme 15 Pro 5G", storage: "256GB",
    price: 54999, originalPrice: 59999, rating: 4.5, reviewCount: 340,
    slug: "realme-15-pro", badge: "New", badgeColor: "#7C3AED",
    specs: { screen: "6.8″", ram: "12GB", camera: "50 MP" },
        colors: [
      { name: "Silk Silver", hex: "#C0C0C8", image: "/images/Phone/Realme/realme-15-pro-silver.webp" },
    ],
  },
  {
    id: "re2", brand: "realme", name: "Realme 15 5G", storage: "128GB",
    price: 39999, originalPrice: 43999, rating: 4.4, reviewCount: 290,
    slug: "realme-15",
    specs: { screen: "6.7″", ram: "8GB", camera: "50 MP" },
        colors: [
      { name: "Graphite Grey", hex: "#606068", image: "/images/Phone/Realme/realme-15-grey.webp" },
    ],
  },
  {
    id: "re3", brand: "realme", name: "Realme C85 Pro", storage: "256GB",
    price: 27999, rating: 4.2, reviewCount: 150,
    slug: "realme-c85-pro",
    specs: { screen: "6.8″", ram: "8GB", camera: "50 MP" },
        colors: [
      { name: "Forest Green", hex: "#2A5A3A", image: "/images/Phone/Realme/realme-c85-pro-green.webp" },
    ],
  },
  {
    id: "re4", brand: "realme", name: "Realme Note 70", storage: "128GB",
    price: 16999, rating: 4.0, reviewCount: 210,
    slug: "realme-note-70",
    specs: { screen: "6.74″", ram: "4GB", camera: "32 MP" },
        colors: [
      { name: "Champagne Gold", hex: "#C8A870", image: "/images/Phone/Realme/realme-note-70-gold.webp" },
    ],
  },
  {
    id: "re5", brand: "realme", name: "Realme C100i", storage: "128GB",
    price: 14999, rating: 4.0, reviewCount: 170,
    slug: "realme-c100i",
    specs: { screen: "6.67″", ram: "4GB", camera: "13 MP" },
        colors: [
      { name: "Lilac Purple", hex: "#C8A8D8", image: "/images/Phone/Realme/realme-c100i-purple.webp" },
    ],
  },

  // ═══════════════════════════════════════════════
  // VIVO
  // ═══════════════════════════════════════════════
  {
    id: "v1", brand: "vivo", name: "Vivo X200 Pro", storage: "512GB",
    price: 99999, originalPrice: 109999, rating: 4.6, reviewCount: 260,
    slug: "vivo-x200-pro", badge: "Hot", badgeColor: "#FB5724",
    specs: { screen: "6.78″", ram: "16GB", camera: "200 MP" },
        colors: [
      { name: "Titanium Grey", hex: "#808088", image: "/images/Phone/Vivo/vivo-x200-pro-grey.webp" },
      { name: "White", hex: "#F0F0F0", image: "/images/Phone/Vivo/vivo-x200-pro-white.webp" },
    ],
  },
  {
    id: "v2", brand: "vivo", name: "Vivo V50", storage: "256GB",
    price: 49999, originalPrice: 54999, rating: 4.4, reviewCount: 410,
    slug: "vivo-v50",
    specs: { screen: "6.77″", ram: "12GB", camera: "50 MP" },
        colors: [
      { name: "Titanium Grey", hex: "#808088", image: "/images/Phone/Vivo/vivo-v50-grey.webp" },
      { name: "Starry Night", hex: "#1A1A40", image: "/images/Phone/Vivo/vivo-v50-night.webp" },
      { name: "Rose Red", hex: "#C84058", image: "/images/Phone/Vivo/vivo-v50-rose.webp" },
    ],
  },
  {
    id: "v3", brand: "vivo", name: "Vivo V40", storage: "256GB",
    price: 44999, originalPrice: 49999, rating: 4.4, reviewCount: 520,
    slug: "vivo-v40",
    specs: { screen: "6.78″", ram: "12GB", camera: "50 MP" },
        colors: [
      { name: "Lotus Purple", hex: "#9870A8", image: "/images/Phone/Vivo/vivo-v40-purple.webp" },
      { name: "Ganges Blue", hex: "#4870B8", image: "/images/Phone/Vivo/vivo-v40-blue.webp" },
      { name: "Titanium Grey", hex: "#808088", image: "/images/Phone/Vivo/vivo-v40-grey.webp" },
    ],
  },

  // ═══════════════════════════════════════════════
  // IQOO
  // ═══════════════════════════════════════════════
  {
    id: "i1", brand: "iqoo", name: "iQOO 15 Ultra", storage: "512GB",
    price: 94999, rating: 4.6, reviewCount: 90,
    slug: "iqoo-15-ultra", badge: "New", badgeColor: "#7C3AED",
    specs: { screen: "6.85″", ram: "16GB", camera: "50 MP" },
        colors: [
      { name: "Black", hex: "#1C1C1E", image: "/images/Phone/IQOO/iqoo-15-ultra-black.webp" },
    ],
  },

  // ═══════════════════════════════════════════════
  // HONOR
  // ═══════════════════════════════════════════════
  {
    id: "h1", brand: "honor", name: "Honor Magic V6", storage: "512GB",
    price: 179999, rating: 4.6, reviewCount: 70,
    slug: "honor-magic-v6", badge: "New", badgeColor: "#7C3AED",
    specs: { screen: "7.9″", ram: "16GB", camera: "50 MP" },
        colors: [
      { name: "Velvet Red", hex: "#8B0000", image: "/images/Phone/Honor/honor-magic-v6.webp" },
    ],
  },
  {
    id: "h2", brand: "honor", name: "Honor Magic V5", storage: "512GB",
    price: 164999, rating: 4.6, reviewCount: 95,
    slug: "honor-magic-v5",
    specs: { screen: "7.95″", ram: "16GB", camera: "50 MP" },
        colors: [
      { name: "Champagne Gold", hex: "#C8A870", image: "/images/Phone/Honor/honor-magic-v5.webp" },
    ],
  },
  {
    id: "h3", brand: "honor", name: "Honor Magic 6 Pro", storage: "512GB",
    price: 94999, rating: 4.6, reviewCount: 210,
    slug: "honor-magic-6-pro",
    specs: { screen: "6.8″", ram: "12GB", camera: "180 MP" },
        colors: [
      { name: "Black", hex: "#1C1C1E", image: "/images/Phone/Honor/honor-magic-6-pro-black.webp" },
      { name: "Epi Green", hex: "#2A6040", image: "/images/Phone/Honor/honor-magic-6-pro-green.webp" },
    ],
  },
  {
    id: "h4", brand: "honor", name: "Honor 200 Pro", storage: "512GB",
    price: 59999, originalPrice: 64999, rating: 4.4, reviewCount: 280,
    slug: "honor-200-pro",
    specs: { screen: "6.78″", ram: "12GB", camera: "50 MP" },
        colors: [
      { name: "Midnight Black", hex: "#1C1C1E", image: "/images/Phone/Honor/honor-200-pro-black.webp" },
      { name: "Moonlight White", hex: "#F0EDE8", image: "/images/Phone/Honor/honor-200-pro-white.webp" },
      { name: "Ocean Cyan", hex: "#3898A8", image: "/images/Phone/Honor/honor-200-pro-cyan.webp" },
    ],
  },
  {
    id: "h5", brand: "honor", name: "Honor 200 5G", storage: "256GB",
    price: 44999, rating: 4.3, reviewCount: 200,
    slug: "honor-200",
    specs: { screen: "6.7″", ram: "12GB", camera: "50 MP" },
        colors: [
      { name: "Ocean Teal", hex: "#207878", image: "/images/Phone/Honor/honor-200-teal.webp" },
    ],
  },
  {
    id: "h6", brand: "honor", name: "Honor 600 Smart", storage: "128GB",
    price: 19999, rating: 4.0, reviewCount: 90,
    slug: "honor-600-smart",
    specs: { screen: "6.77″", ram: "6GB", camera: "50 MP" },
        colors: [
      { name: "Midnight Black", hex: "#1C1C1E", image: "/images/Phone/Honor/honor-600-smart.webp" },
    ],
  },

  // ═══════════════════════════════════════════════
  // MOTOROLA
  // ═══════════════════════════════════════════════
  {
    id: "m1", brand: "motorola", name: "Motorola Edge 70 Pro", storage: "256GB",
    price: 64999, rating: 4.4, reviewCount: 100,
    slug: "motorola-edge-70-pro", badge: "New", badgeColor: "#7C3AED",
    specs: { screen: "6.7″", ram: "12GB", camera: "50 MP" },
        colors: [
      { name: "Navy Blue", hex: "#1B2A4A", image: "/images/Phone/Motorola/motorola-edge-70-pro.webp" },
    ],
  },
  {
    id: "m2", brand: "motorola", name: "Moto G96 5G", storage: "128GB",
    price: 29999, originalPrice: 32999, rating: 4.3, reviewCount: 260,
    slug: "moto-g96",
    specs: { screen: "6.67″", ram: "8GB", camera: "50 MP" },
        colors: [
      { name: "Orchid", hex: "#C080C0", image: "/images/Phone/Motorola/moto-g96.webp" },
    ],
  },
  {
    id: "m3", brand: "motorola", name: "Moto G67 Power", storage: "128GB",
    price: 21999, rating: 4.1, reviewCount: 190,
    slug: "moto-g67-power",
    specs: { screen: "6.7″", ram: "6GB", camera: "50 MP" },
        colors: [
      { name: "Cyan", hex: "#00B8C8", image: "/images/Phone/Motorola/moto-g67-power.webp" },
    ],
  },

  // ═══════════════════════════════════════════════
  // NOTHING
  // ═══════════════════════════════════════════════
  {
    id: "n1", brand: "nothing", name: "Nothing Phone (4a) Pro", storage: "256GB",
    price: 59999, rating: 4.5, reviewCount: 110,
    slug: "nothing-phone-4a-pro", badge: "New", badgeColor: "#7C3AED",
    specs: { screen: "6.83″", ram: "12GB", camera: "50 MP" },
        colors: [
      { name: "Black", hex: "#1C1C1E", image: "/images/Phone/Nothing/nothing-4a-pro.webp" },
    ],
  },
  {
    id: "n2", brand: "nothing", name: "Nothing Phone (4a)", storage: "128GB",
    price: 44999, rating: 4.4, reviewCount: 160,
    slug: "nothing-phone-4a",
    specs: { screen: "6.7″", ram: "8GB", camera: "50 MP" },
        colors: [
      { name: "Transparent Black", hex: "#2C2C2C", image: "/images/Phone/Nothing/nothing-4a.webp" },
    ],
  },
  {
    id: "n3", brand: "nothing", name: "Nothing Phone (4b)", storage: "128GB",
    price: 34999, rating: 4.3, reviewCount: 90,
    slug: "nothing-phone-4b",
    specs: { screen: "6.7″", ram: "8GB", camera: "50 MP" },
        colors: [
      { name: "Black", hex: "#1C1C1E", image: "/images/Phone/Nothing/nothing-4b.webp" },
    ],
  },
];

export const phonesByBrand = (brand: BrandKey) => PHONES.filter((p) => p.brand === brand);
export const phoneBySlug = (slug: string) => PHONES.find((p) => p.slug === slug);
export const phonesBySlugs = (slugs: string[]) =>
  slugs.map((s) => phoneBySlug(s)).filter((p): p is CatalogPhone => Boolean(p));

/** ProductCard-এর জন্য shape — প্রথম color default হিসেবে active থাকে */
export function toCardProduct(p: CatalogPhone) {
  const c = p.colors[0];
  return {
    id: p.id,
    name: p.name,
    storage: p.storage,
    variant: `${p.storage} – ${c.name}`,
    price: p.price,
    originalPrice: p.originalPrice,
    rating: p.rating,
    reviewCount: p.reviewCount,
    image: c.image,
    slug: p.slug,
    badge: p.badge,
    badgeColor: p.badgeColor,
    specs: p.specs,
    colors: p.colors,
    gallery: p.gallery,
  };
}
