export function formatPrice(amount: number) {
  return "৳" + amount.toLocaleString("en-BD");
}

export function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function calcDiscount(price: number, original: number) {
  return Math.round(((original - price) / original) * 100);
}
