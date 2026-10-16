// ─────────────────────────────────────────────────────────────
// Shop-wide settings — নম্বর / charge বদলাতে হলে শুধু এই file edit করুন
// ─────────────────────────────────────────────────────────────

export const SHOP = {
  name: "Pure Apple",

  // Customer এই নম্বরে Send Money করবে
  bkashNumber: "01804660238",
  nagadNumber: "01804660238",
  // "Send Money" নাকি "Payment" — customer-কে যা বলতে চান
  walletType: "Personal",

  // WhatsApp (country code সহ, + ছাড়া)
  whatsappNumber: "8801804660238",
  whatsappGreeting: "Hi Pure Apple! আমি একটা বিষয়ে জানতে চাই।",
} as const;

/** Delivery charge (৳) */
export const DELIVERY = {
  dhaka: 60,
  outside: 120,
} as const;

export type DeliveryArea = keyof typeof DELIVERY;

/** Order confirm করতে minimum advance (security) */
export const MIN_ADVANCE = 2500;

export type PayMethod = "cod" | "bkash" | "nagad";
export type Wallet = "bkash" | "nagad";

export const walletNumber = (w: Wallet) => (w === "bkash" ? SHOP.bkashNumber : SHOP.nagadNumber);

/** Total কম হলে (যেমন charger ৳800) advance total-এর বেশি হতে পারে না */
export const minAdvanceFor = (total: number) => Math.min(MIN_ADVANCE, Math.max(total, 0));

export const deliveryCharge = (area: DeliveryArea | "" | null | undefined) =>
  area === "dhaka" ? DELIVERY.dhaka : area === "outside" ? DELIVERY.outside : 0;
