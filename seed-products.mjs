/**
 * Pure Apple — Supabase Product Seed Script
 * 
 * কী করে:
 * - phoneCatalog.ts এর সব product Supabase এ upsert করে (slug দিয়ে match)
 * - নতুন হলে INSERT, আগে থেকে থাকলে image + সব field UPDATE
 * - Admin panel থেকে যেকোনো product এ is_featured = true করলেই Popular section এ দেখাবে
 * 
 * Run: node seed-products.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://puaebozvrhhsoseywzuj.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1YWVib3p2cmhoc29zZXl3enVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTQyOTM3MCwiZXhwIjoyMTA3MDA1MzcwfQ.xa8koskMuDrYrRcJAYE2kD9-Pa6loQHG27HWdauA8bw";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// ─── phoneCatalog.ts থেকে সব PHONES data (correct image paths সহ) ───────────

const PHONES = [
  // APPLE
  { id:"a1", brand:"apple", name:"iPhone 18 Pro Max", storage:"256GB", price:174999, originalPrice:184999, rating:4.9, reviewCount:420, slug:"iphone-18-pro-max", badge:"New", badgeColor:"#7C3AED", specs:{screen:"6.9″",ram:"12GB",camera:"48 MP"}, colors:[{name:"Sky Blue",hex:"#A9C4DE",image:"/images/Phone/iphone/iPhone 18/iPhone 18 pro max/iPhone_18_Pro_Max.webp"}] },
  { id:"a2", brand:"apple", name:"iPhone 17 Pro Max", storage:"256GB", price:154999, originalPrice:164999, rating:4.8, reviewCount:980, slug:"iphone-17-pro-max", badge:"Hot", badgeColor:"#FB5724", specs:{screen:"6.9″",ram:"12GB",camera:"48 MP"}, colors:[{name:"Desert Titanium",hex:"#B79A7C",image:"/images/Phone/iphone/iPhone 17/iPhone 17 pro max/iPhone_17_Pro_Max.webp"}] },
  { id:"a3", brand:"apple", name:"iPhone 17", storage:"256GB", price:119999, originalPrice:129999, rating:4.7, reviewCount:760, slug:"iphone-17", specs:{screen:"6.3″",ram:"8GB",camera:"48 MP"}, colors:[{name:"Lavender",hex:"#C9B8E0",image:"/images/Phone/iphone/iPhone 17/iPhone_17.webp"}] },
  { id:"a4", brand:"apple", name:"iPhone 16 Pro", storage:"256GB", price:114499, originalPrice:124999, rating:4.8, reviewCount:2500, slug:"iphone-16-pro", badge:"Best Seller", badgeColor:"#4FAE53", specs:{screen:"6.3″",ram:"8GB",camera:"48 MP"}, colors:[{name:"Desert Titanium",hex:"#B79A7C",image:"/images/Phone/iphone/iPhone 16/iPhone 16 pro/iphone_16pro.webp"}] },
  { id:"a5", brand:"apple", name:"iPhone 16", storage:"128GB", price:94999, rating:4.6, reviewCount:1800, slug:"iphone-16", specs:{screen:"6.1″",ram:"8GB",camera:"48 MP"}, colors:[{name:"White",hex:"#F2F2F2",image:"/images/Phone/iphone/iPhone 16/iPhone_16.webp"}] },
  { id:"a6", brand:"apple", name:"iPhone 15 Pro Max", storage:"256GB", price:124999, originalPrice:134999, rating:4.7, reviewCount:2100, slug:"iphone-15-pro-max", specs:{screen:"6.7″",ram:"8GB",camera:"48 MP"}, colors:[{name:"Natural Titanium",hex:"#B8B2A7",image:"/images/Phone/iphone/iPhone 15/iPhone 15 pro max/iPhone 15 pro max.webp"}] },
  { id:"a7", brand:"apple", name:"iPhone 15 Pro", storage:"128GB", price:104999, originalPrice:114999, rating:4.7, reviewCount:1900, slug:"iphone-15-pro", specs:{screen:"6.1″",ram:"8GB",camera:"48 MP"}, colors:[{name:"Black Titanium",hex:"#2B2B2D",image:"/images/Phone/iphone/iPhone 15/iPhone 15 pro/iPhone 15 pro.webp"}] },
  { id:"a8", brand:"apple", name:"iPhone 15", storage:"128GB", price:79999, originalPrice:89999, rating:4.7, reviewCount:3200, slug:"iphone-15", specs:{screen:"6.1″",ram:"6GB",camera:"48 MP"}, colors:[{name:"Pink",hex:"#F2C4CE",image:"/images/Phone/iphone/iPhone 15/iPhone 15.webp"}] },
  { id:"a9", brand:"apple", name:"iPhone 13 Pro Max", storage:"256GB", price:64999, originalPrice:72999, rating:4.6, reviewCount:1500, slug:"iphone-13-pro-max", specs:{screen:"6.7″",ram:"6GB",camera:"12 MP"}, colors:[{name:"Sierra Blue",hex:"#A7C1D9",image:"/images/Phone/iphone/iPhone 13/iPhone 13 pro max/iPhone 13 pro max.webp"}] },
  { id:"a10", brand:"apple", name:"iPhone 11 Pro", storage:"64GB", price:34999, rating:4.4, reviewCount:900, slug:"iphone-11-pro", specs:{screen:"5.8″",ram:"4GB",camera:"12 MP"}, colors:[{name:"Midnight Green",hex:"#4E5851",image:"/images/Phone/iphone/iPhone 11/iPhone-11.webp"}] },

  // SAMSUNG
  { id:"s1", brand:"samsung", name:"Galaxy S26 Ultra", storage:"256GB", price:174999, originalPrice:189999, rating:4.8, reviewCount:260, slug:"galaxy-s26-ultra", badge:"New", badgeColor:"#7C3AED", specs:{screen:"6.9″",ram:"12GB",camera:"200 MP"}, colors:[{name:"Black",hex:"#1F1F22",image:"/images/Phone/Samsung/s26-ultra-black.webp"}] },
  { id:"s2", brand:"samsung", name:"Galaxy S25 Ultra", storage:"256GB", price:164999, originalPrice:179999, rating:4.7, reviewCount:870, slug:"galaxy-s25-ultra", badge:"Hot", badgeColor:"#FB5724", specs:{screen:"6.9″",ram:"12GB",camera:"200 MP"}, colors:[{name:"Silver",hex:"#D9DCE0",image:"/images/Phone/Samsung/s25-ultra-silver.webp"}] },
  { id:"s3", brand:"samsung", name:"Galaxy S25+", storage:"256GB", price:134999, rating:4.6, reviewCount:540, slug:"galaxy-s25-plus", specs:{screen:"6.7″",ram:"12GB",camera:"50 MP"}, colors:[{name:"Icy Blue",hex:"#BBD3F0",image:"/images/Phone/Samsung/s25-plus-icy-blue.webp"}] },
  { id:"s4", brand:"samsung", name:"Galaxy S25", storage:"128GB", price:109999, originalPrice:119999, rating:4.6, reviewCount:1100, slug:"galaxy-s25", specs:{screen:"6.2″",ram:"12GB",camera:"50 MP"}, colors:[{name:"Silver Shadow",hex:"#B8BCC2",image:"/images/Phone/Samsung/s25-silver.webp"}] },
  { id:"s5", brand:"samsung", name:"Galaxy S25 FE", storage:"128GB", price:84999, originalPrice:92999, rating:4.4, reviewCount:430, slug:"galaxy-s25-fe", specs:{screen:"6.7″",ram:"8GB",camera:"50 MP"}, colors:[{name:"Navy",hex:"#1F2C54",image:"/images/Phone/Samsung/s25-fe-navy.webp"}] },
  { id:"s6", brand:"samsung", name:"Galaxy S24 Ultra", storage:"256GB", price:144999, originalPrice:159999, rating:4.7, reviewCount:1980, slug:"samsung-galaxy-s24-ultra", badge:"Best Seller", badgeColor:"#4FAE53", specs:{screen:"6.8″",ram:"12GB",camera:"200 MP"}, colors:[{name:"Titanium Black",hex:"#2A2A2C",image:"/images/Phone/Samsung/s24-ultra-black.webp"}] },
  { id:"s7", brand:"samsung", name:"Galaxy A37 5G", storage:"128GB", price:44999, originalPrice:49999, rating:4.3, reviewCount:390, slug:"galaxy-a37", specs:{screen:"6.7″",ram:"8GB",camera:"50 MP"}, colors:[{name:"Awesome Graphite",hex:"#2A2A2E",image:"/images/Phone/Samsung/a37-graphite.webp"}] },

  // GOOGLE
  { id:"g1", brand:"google", name:"Pixel 11 Pro XL", storage:"256GB", price:139999, originalPrice:149999, rating:4.7, reviewCount:120, slug:"pixel-11-pro-xl", badge:"New", badgeColor:"#7C3AED", specs:{screen:"6.8″",ram:"16GB",camera:"50 MP"}, colors:[{name:"Obsidian",hex:"#2B2B2D",image:"/images/Phone/Google Pixel/Google Pixel 11/Google_Pixel_11_Pro_XL_5G_Obsidian.webp"}] },
  { id:"g2", brand:"google", name:"Pixel 11 Pro", storage:"256GB", price:124999, rating:4.7, reviewCount:150, slug:"pixel-11-pro", badge:"New", badgeColor:"#7C3AED", specs:{screen:"6.3″",ram:"16GB",camera:"50 MP"}, colors:[{name:"Jade",hex:"#BFD9CC",image:"/images/Phone/Google Pixel/Google Pixel 11/google pixel 11 pro.webp"}] },
  { id:"g3", brand:"google", name:"Pixel 10 Pro", storage:"256GB", price:109999, originalPrice:119999, rating:4.7, reviewCount:310, slug:"google-pixel-10-pro", badge:"Hot", badgeColor:"#FB5724", specs:{screen:"6.3″",ram:"16GB",camera:"50 MP"}, colors:[{name:"Moonstone",hex:"#8E8DB5",image:"/images/Phone/Google Pixel/Google Pixel 10/Google Pixel 10 Pro.webp"}] },
  { id:"g4", brand:"google", name:"Pixel 9 Pro XL", storage:"256GB", price:104999, originalPrice:114999, rating:4.6, reviewCount:420, slug:"pixel-9-pro-xl", specs:{screen:"6.8″",ram:"16GB",camera:"50 MP"}, colors:[{name:"Obsidian",hex:"#2B2B2D",image:"/images/Phone/Google Pixel/Google Pixel 9/Google Pixel 9 Pro/Google_Pixel_9_Pro_XL-removebg-preview.webp"}] },
  { id:"g5", brand:"google", name:"Pixel 9", storage:"128GB", price:79999, rating:4.4, reviewCount:530, slug:"google-pixel-9", badge:"Best Seller", badgeColor:"#4FAE53", specs:{screen:"6.3″",ram:"12GB",camera:"50 MP"}, colors:[{name:"Obsidian",hex:"#2D2E31",image:"/images/Phone/Google Pixel/Google Pixel 9/Google Pixel 9/Google_Pixel_9_5G_Obsidian.webp"}] },
  { id:"g6", brand:"google", name:"Pixel 9a", storage:"128GB", price:54999, originalPrice:59999, rating:4.3, reviewCount:380, slug:"pixel-9a", specs:{screen:"6.3″",ram:"8GB",camera:"48 MP"}, colors:[{name:"Obsidian",hex:"#2D2E31",image:"/images/Phone/Google Pixel/Google Pixel 9/Google Pixel 9a/Google_Pixel_9A__Obsidian.webp"}] },
  { id:"g7", brand:"google", name:"Pixel 8 Pro", storage:"128GB", price:74999, originalPrice:82999, rating:4.5, reviewCount:610, slug:"pixel-8-pro", specs:{screen:"6.7″",ram:"12GB",camera:"50 MP"}, colors:[{name:"Obsidian",hex:"#2D2E31",image:"/images/Phone/Google Pixel/Goolge Pixel 8/Google Pixel 8 Pro/Google Pixel 8 Pro Obsidian.jpg"}] },
  { id:"g8", brand:"google", name:"Pixel 8", storage:"128GB", price:64999, originalPrice:74999, rating:4.4, reviewCount:680, slug:"google-pixel-8", specs:{screen:"6.2″",ram:"8GB",camera:"50 MP"}, colors:[{name:"Obsidian",hex:"#2D2E31",image:"/images/Phone/Google Pixel/Goolge Pixel 8/Google Pixel 8/Google Pixel 8 256Gb - Obsidian Black.jpg"}] },
  { id:"g9", brand:"google", name:"Pixel 8a", storage:"128GB", price:44999, originalPrice:49999, rating:4.3, reviewCount:390, slug:"pixel-8a", specs:{screen:"6.1″",ram:"8GB",camera:"64 MP"}, colors:[{name:"Obsidian",hex:"#2D2E31",image:"/images/Phone/Google Pixel/Goolge Pixel 8/Goolge Pixel 8a/Google Pixel 8a Obsidian.jpg"}] },
  { id:"g10", brand:"google", name:"Pixel 7 Pro", storage:"128GB", price:49999, rating:4.3, reviewCount:420, slug:"pixel-7-pro", specs:{screen:"6.7″",ram:"12GB",camera:"50 MP"}, colors:[{name:"Snow",hex:"#F1F1EE",image:"/images/Phone/Google Pixel/Google Pixel 7/Google Pixel 7 pro/Pixel 7 Pro.webp"}] },
  { id:"g11", brand:"google", name:"Pixel 7", storage:"128GB", price:39999, rating:4.2, reviewCount:350, slug:"pixel-7", specs:{screen:"6.3″",ram:"8GB",camera:"50 MP"}, colors:[{name:"Snow",hex:"#F1F1EE",image:"/images/Phone/Google Pixel/Google Pixel 7/Google Pixel 7/Google Pixel 7 Snow.webp"}] },

  // ONEPLUS
  { id:"o1", brand:"oneplus", name:"OnePlus 13s", storage:"256GB", price:69999, originalPrice:74999, rating:4.5, reviewCount:210, slug:"oneplus-13s", badge:"New", badgeColor:"#7C3AED", specs:{screen:"6.32″",ram:"12GB",camera:"50 MP"}, colors:[{name:"Pink Satin",hex:"#E8C4CF",image:"/images/Phone/OnePlus/oneplus-13s-pink.webp"}] },
  { id:"o2", brand:"oneplus", name:"OnePlus 12", storage:"256GB", price:89999, rating:4.5, reviewCount:880, slug:"oneplus-12", badge:"Best Seller", badgeColor:"#4FAE53", specs:{screen:"6.82″",ram:"12GB",camera:"50 MP"}, colors:[{name:"Silky Black",hex:"#1E1E20",image:"/images/Phone/OnePlus/oneplus-12-black.webp"}] },
  { id:"o3", brand:"oneplus", name:"OnePlus 11R", storage:"256GB", price:54999, originalPrice:59999, rating:4.4, reviewCount:640, slug:"oneplus-11r", specs:{screen:"6.74″",ram:"16GB",camera:"50 MP"}, colors:[{name:"Sonic Black",hex:"#26262A",image:"/images/Phone/OnePlus/oneplus-11r-black.webp"}] },
  { id:"o4", brand:"oneplus", name:"OnePlus 10 Pro", storage:"256GB", price:64999, originalPrice:69999, rating:4.4, reviewCount:720, slug:"oneplus-10-pro", specs:{screen:"6.7″",ram:"12GB",camera:"48 MP"}, colors:[{name:"Volcanic Black",hex:"#2A2A2C",image:"/images/Phone/OnePlus/oneplus-10-pro-black.webp"}] },
  { id:"o5", brand:"oneplus", name:"OnePlus Nord 6", storage:"256GB", price:44999, originalPrice:48999, rating:4.3, reviewCount:300, slug:"oneplus-nord-6", badge:"New", badgeColor:"#7C3AED", specs:{screen:"6.7″",ram:"12GB",camera:"50 MP"}, colors:[{name:"Jade Green",hex:"#A8D8B9",image:"/images/Phone/OnePlus/oneplus-nord-6.webp"}] },
  { id:"o6", brand:"oneplus", name:"OnePlus Nord CE6", storage:"256GB", price:36999, rating:4.2, reviewCount:260, slug:"oneplus-nord-ce6", specs:{screen:"6.7″",ram:"8GB",camera:"50 MP"}, colors:[{name:"Black",hex:"#202024",image:"/images/Phone/OnePlus/oneplus-nord-ce6.webp"}] },
  { id:"o7", brand:"oneplus", name:"OnePlus Nord CE6 Lite", storage:"128GB", price:27999, rating:4.1, reviewCount:180, slug:"oneplus-nord-ce6-lite", specs:{screen:"6.7″",ram:"8GB",camera:"50 MP"}, colors:[{name:"Black",hex:"#202024",image:"/images/Phone/OnePlus/oneplus-nord-ce6-lite.webp"}] },

  // REDMI
  { id:"r1", brand:"redmi", name:"Redmi Note 15", storage:"128GB", price:27999, originalPrice:29999, rating:4.4, reviewCount:560, slug:"redmi-note-15", badge:"New", badgeColor:"#7C3AED", specs:{screen:"6.67″",ram:"8GB",camera:"108 MP"}, colors:[{name:"Midnight Black",hex:"#1C1C1E",image:"/images/Phone/Redmi/redmi-note-15-black.webp"}] },
  { id:"r2", brand:"redmi", name:"Redmi Note 14", storage:"128GB", price:24999, originalPrice:27999, rating:4.3, reviewCount:1200, slug:"redmi-note-14", badge:"Hot", badgeColor:"#FB5724", specs:{screen:"6.67″",ram:"6GB",camera:"108 MP"}, colors:[{name:"Midnight Black",hex:"#1C1C1E",image:"/images/Phone/Redmi/redmi-note-14-black.webp"}] },

  // REALME
  { id:"re1", brand:"realme", name:"Realme 15 Pro 5G", storage:"256GB", price:54999, originalPrice:59999, rating:4.5, reviewCount:340, slug:"realme-15-pro", badge:"New", badgeColor:"#7C3AED", specs:{screen:"6.8″",ram:"12GB",camera:"50 MP"}, colors:[{name:"Silk Silver",hex:"#E4E4E8",image:"/images/Phone/Realme/realme-15-pro-silver.webp"}] },
  { id:"re2", brand:"realme", name:"Realme 15 5G", storage:"128GB", price:39999, originalPrice:43999, rating:4.4, reviewCount:290, slug:"realme-15", specs:{screen:"6.7″",ram:"8GB",camera:"50 MP"}, colors:[{name:"Graphite Grey",hex:"#8A8076",image:"/images/Phone/Realme/realme-15-grey.webp"}] },
  { id:"re3", brand:"realme", name:"Realme C85 Pro", storage:"256GB", price:27999, rating:4.2, reviewCount:150, slug:"realme-c85-pro", specs:{screen:"6.8″",ram:"8GB",camera:"50 MP"}, colors:[{name:"Forest Green",hex:"#2F3B35",image:"/images/Phone/Realme/realme-c85-pro-green.webp"}] },
  { id:"re4", brand:"realme", name:"Realme Note 70", storage:"128GB", price:16999, rating:4.0, reviewCount:210, slug:"realme-note-70", specs:{screen:"6.74″",ram:"4GB",camera:"32 MP"}, colors:[{name:"Champagne Gold",hex:"#E6CC8A",image:"/images/Phone/Realme/realme-note-70-gold.webp"}] },
  { id:"re5", brand:"realme", name:"Realme C100i", storage:"128GB", price:14999, rating:4.0, reviewCount:170, slug:"realme-c100i", specs:{screen:"6.67″",ram:"4GB",camera:"13 MP"}, colors:[{name:"Lilac Purple",hex:"#C9A8E0",image:"/images/Phone/Realme/realme-c100i-purple.webp"}] },

  // VIVO
  { id:"v1", brand:"vivo", name:"Vivo X200 Pro", storage:"512GB", price:99999, originalPrice:109999, rating:4.6, reviewCount:260, slug:"vivo-x200-pro", badge:"Hot", badgeColor:"#FB5724", specs:{screen:"6.78″",ram:"16GB",camera:"200 MP"}, colors:[{name:"Titanium Grey",hex:"#8A8D90",image:"/images/Phone/Vivo/vivo-x200-pro-grey.webp"}] },
  { id:"v2", brand:"vivo", name:"Vivo V50", storage:"256GB", price:49999, originalPrice:54999, rating:4.4, reviewCount:410, slug:"vivo-v50", specs:{screen:"6.77″",ram:"12GB",camera:"50 MP"}, colors:[{name:"Titanium Grey",hex:"#8A8D90",image:"/images/Phone/Vivo/vivo-v50-grey.webp"}] },
  { id:"v3", brand:"vivo", name:"Vivo V40", storage:"256GB", price:44999, originalPrice:49999, rating:4.4, reviewCount:520, slug:"vivo-v40", specs:{screen:"6.78″",ram:"12GB",camera:"50 MP"}, colors:[{name:"Lotus Purple",hex:"#B9A4D8",image:"/images/Phone/Vivo/vivo-v40-purple.webp"}] },

  // IQOO
  { id:"i1", brand:"iqoo", name:"iQOO 15 Ultra", storage:"512GB", price:94999, rating:4.6, reviewCount:90, slug:"iqoo-15-ultra", badge:"New", badgeColor:"#7C3AED", specs:{screen:"6.85″",ram:"16GB",camera:"50 MP"}, colors:[{name:"Black",hex:"#2B2B2D",image:"/images/Phone/IQOO/iqoo-15-ultra-black.webp"}] },

  // HONOR
  { id:"h1", brand:"honor", name:"Honor Magic V6", storage:"512GB", price:179999, rating:4.6, reviewCount:70, slug:"honor-magic-v6", badge:"New", badgeColor:"#7C3AED", specs:{screen:"7.9″",ram:"16GB",camera:"50 MP"}, colors:[{name:"Velvet Red",hex:"#A0302A",image:"/images/Phone/Honor/honor-magic-v6.webp"}] },
  { id:"h2", brand:"honor", name:"Honor Magic V5", storage:"512GB", price:164999, rating:4.6, reviewCount:95, slug:"honor-magic-v5", specs:{screen:"7.95″",ram:"16GB",camera:"50 MP"}, colors:[{name:"Champagne Gold",hex:"#E6D3A8",image:"/images/Phone/Honor/honor-magic-v5.webp"}] },
  { id:"h3", brand:"honor", name:"Honor Magic 6 Pro", storage:"512GB", price:94999, rating:4.6, reviewCount:210, slug:"honor-magic-6-pro", specs:{screen:"6.8″",ram:"12GB",camera:"180 MP"}, colors:[{name:"Black",hex:"#1E1E20",image:"/images/Phone/Honor/honor-magic-6-pro-black.webp"}] },
  { id:"h4", brand:"honor", name:"Honor 200 Pro", storage:"512GB", price:59999, originalPrice:64999, rating:4.4, reviewCount:280, slug:"honor-200-pro", specs:{screen:"6.78″",ram:"12GB",camera:"50 MP"}, colors:[{name:"Midnight Black",hex:"#1E1E20",image:"/images/Phone/Honor/honor-200-pro-black.webp"}] },
  { id:"h5", brand:"honor", name:"Honor 200 5G", storage:"256GB", price:44999, rating:4.3, reviewCount:200, slug:"honor-200", specs:{screen:"6.7″",ram:"12GB",camera:"50 MP"}, colors:[{name:"Ocean Teal",hex:"#6FA3A3",image:"/images/Phone/Honor/honor-200-teal.webp"}] },
  { id:"h6", brand:"honor", name:"Honor 600 Smart", storage:"128GB", price:19999, rating:4.0, reviewCount:90, slug:"honor-600-smart", specs:{screen:"6.77″",ram:"6GB",camera:"50 MP"}, colors:[{name:"Midnight Black",hex:"#3A3A3E",image:"/images/Phone/Honor/honor-600-smart.webp"}] },

  // MOTOROLA
  { id:"m1", brand:"motorola", name:"Motorola Edge 70 Pro", storage:"256GB", price:64999, rating:4.4, reviewCount:100, slug:"motorola-edge-70-pro", badge:"New", badgeColor:"#7C3AED", specs:{screen:"6.7″",ram:"12GB",camera:"50 MP"}, colors:[{name:"Navy Blue",hex:"#1F3A5F",image:"/images/Phone/Motorola/motorola-edge-70-pro.webp"}] },
  { id:"m2", brand:"motorola", name:"Moto G96 5G", storage:"128GB", price:29999, originalPrice:32999, rating:4.3, reviewCount:260, slug:"moto-g96", specs:{screen:"6.67″",ram:"8GB",camera:"50 MP"}, colors:[{name:"Orchid",hex:"#A94DA3",image:"/images/Phone/Motorola/moto-g96.webp"}] },
  { id:"m3", brand:"motorola", name:"Moto G67 Power", storage:"128GB", price:21999, rating:4.1, reviewCount:190, slug:"moto-g67-power", specs:{screen:"6.7″",ram:"6GB",camera:"50 MP"}, colors:[{name:"Cyan",hex:"#1AB3C9",image:"/images/Phone/Motorola/moto-g67-power.webp"}] },

  // NOTHING
  { id:"n1", brand:"nothing", name:"Nothing Phone (4a) Pro", storage:"256GB", price:59999, rating:4.5, reviewCount:110, slug:"nothing-phone-4a-pro", badge:"New", badgeColor:"#7C3AED", specs:{screen:"6.83″",ram:"12GB",camera:"50 MP"}, colors:[{name:"Black",hex:"#1C2326",image:"/images/Phone/Nothing/nothing-4a-pro.webp"}] },
  { id:"n2", brand:"nothing", name:"Nothing Phone (4a)", storage:"128GB", price:44999, rating:4.4, reviewCount:160, slug:"nothing-phone-4a", specs:{screen:"6.7″",ram:"8GB",camera:"50 MP"}, colors:[{name:"Transparent Black",hex:"#3A3A3C",image:"/images/Phone/Nothing/nothing-4a.webp"}] },
  { id:"n3", brand:"nothing", name:"Nothing Phone (4b)", storage:"128GB", price:34999, rating:4.3, reviewCount:90, slug:"nothing-phone-4b", specs:{screen:"6.7″",ram:"8GB",camera:"50 MP"}, colors:[{name:"Black",hex:"#26272B",image:"/images/Phone/Nothing/nothing-4b.webp"}] },
];

// ─── Supabase row এ convert করো ──────────────────────────────────────────────
function toRow(p) {
  const c = p.colors[0]; // প্রথম color = default image
  return {
    name:             p.name,
    variant:          `${p.storage} – ${c.name}`,
    price:            p.price,
    original_price:   p.originalPrice ?? null,
    rating:           p.rating,
    review_count:     p.reviewCount,
    image:            c.image,        // ← correct path from phoneCatalog
    slug:             p.slug,
    badge:            p.badge ?? null,
    badge_color:      p.badgeColor ?? null,
    spec_screen:      p.specs.screen,
    spec_ram:         p.specs.ram,
    spec_camera:      p.specs.camera,
    category:         p.brand,
    condition:        "brand-new",
    is_available:     true,
    // is_featured রাখা হয়নি — admin থেকে manually control করবে
  };
}

// ─── Main seed function ───────────────────────────────────────────────────────
async function seed() {
  console.log(`\n🌱 Pure Apple — Product Seed Script`);
  console.log(`📦 Total products to sync: ${PHONES.length}\n`);

  let updated = 0, inserted = 0, failed = 0;

  for (const phone of PHONES) {
    const row = toRow(phone);

    // Slug দিয়ে check করো আগে থেকে আছে কিনা
    const { data: existing } = await supabase
      .from("products")
      .select("id, is_featured")
      .eq("slug", phone.slug)
      .single();

    if (existing) {
      // UPDATE — is_featured টা ধরে রাখো (admin এর change নষ্ট করবো না)
      const { error } = await supabase
        .from("products")
        .update({
          ...row,
          is_featured: existing.is_featured, // admin এর featured status maintain
        })
        .eq("slug", phone.slug);

      if (error) {
        console.error(`  ❌ UPDATE failed: ${phone.name} — ${error.message}`);
        failed++;
      } else {
        console.log(`  ✅ Updated: ${phone.name} → ${row.image}`);
        updated++;
      }
    } else {
      // INSERT — নতুন product
      const { error } = await supabase
        .from("products")
        .insert([{ ...row, is_featured: false, created_at: new Date().toISOString() }]);

      if (error) {
        console.error(`  ❌ INSERT failed: ${phone.name} — ${error.message}`);
        failed++;
      } else {
        console.log(`  ✨ Inserted: ${phone.name}`);
        inserted++;
      }
    }
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`✅ Updated:  ${updated}`);
  console.log(`✨ Inserted: ${inserted}`);
  console.log(`❌ Failed:   ${failed}`);
  console.log(`${"─".repeat(50)}`);
  console.log(`\n📌 এরপর করণীয়:`);
  console.log(`   Admin panel → Products → যেকোনো product এ "Featured" toggle ON করো`);
  console.log(`   সেই product গুলো Homepage এর "Popular Smartphones" section এ দেখাবে\n`);
}

seed().catch(console.error);
