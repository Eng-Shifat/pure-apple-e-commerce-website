"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, Zap, Heart, ChevronRight,
  Shield, RefreshCw, Truck, BadgeCheck, Minus, Plus,
  Share2, Check, ChevronLeft, Package, Tag, MessageCircle, CreditCard, X, Timer,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/types";
import { phoneBySlug, PHONES, type CatalogPhone } from "@/lib/phoneCatalog";
import { supabase } from "@/lib/supabase";

function fixImage(src: string | undefined) {
  if (!src) return "/logo/pure-apple-logo.png";
  return /^(\/|https?:\/\/)/.test(src) ? src : "/logo/pure-apple-logo.png";
}
function parseArr(val: string | undefined): string[] {
  if (!val) return [];
  try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; }
}

// Catalog phone → page-এর Product shape
function catalogToProduct(p: CatalogPhone): Product {
  return {
    id: p.id, name: p.name, variant: "", price: p.price, original_price: p.originalPrice,
    rating: p.rating, review_count: p.reviewCount, image: p.colors[0].image, slug: p.slug,
    badge: p.badge, badge_color: p.badgeColor,
    spec_screen: p.specs.screen, spec_ram: p.specs.ram, spec_camera: p.specs.camera,
    category: p.brand, condition: "brand-new", is_available: true,
    colors: JSON.stringify(p.colors.map((c) => c.name)),
    storage_variants: JSON.stringify([p.storage]),
  } as Product;
}


// ── Related card ──
function RelatedCard({ p }: { p: Product }) {
  const discount = p.original_price ? Math.round(((p.original_price - p.price) / p.original_price) * 100) : null;
  return (
    <Link href={`/products/${p.slug}`} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1 flex flex-col">
      <div className="relative bg-gray-50 flex items-center justify-center h-44 overflow-hidden">
        {p.badge && <span className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10" style={{ backgroundColor: p.badge_color ?? "#FB5724" }}>{p.badge}</span>}
        {discount && <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full z-10">-{discount}%</span>}
        <div className="relative w-32 h-32">
          <Image src={fixImage(p.image)} alt={p.name} fill className="object-contain drop-shadow group-hover:scale-105 transition-transform duration-300" sizes="128px"/>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-gray-400 mb-0.5 truncate">{p.category ?? "Phone"}</p>
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 flex-1">{p.name}</h3>

        <div className="flex items-end gap-2 mt-2">
          <span className="font-extrabold text-gray-900 text-sm">৳{p.price.toLocaleString("en-BD")}</span>
          {p.original_price && <span className="text-xs line-through text-gray-400">৳{p.original_price.toLocaleString("en-BD")}</span>}
        </div>
        <button className="mt-2 w-full text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-lg py-1.5 transition-colors active:scale-95">Add to Cart</button>
      </div>
    </Link>
  );
}


// ── Sticky Cart Bar ──
function StickyCartBar({
  product, qty, selColor, selStorage, price, onDismiss,
}: {
  product: Product; qty: number; selColor: string; selStorage: string; price: number; onDismiss: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" style={{ animation: "slideUp 0.25s ease-out" }}>
      <div className="bg-white border-t-2 border-brand-500 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Product thumbnail */}
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
            <Image
              src={fixImage(product.image)}
              alt={product.name}
              fill
              className="object-contain p-1"
              sizes="48px"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
            <div className="flex items-center gap-2 flex-wrap mt-0.5">
              {selColor   && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{selColor}</span>}
              {selStorage && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{selStorage}</span>}
              <span className="text-xs text-gray-400">Qty: <strong>{qty}</strong></span>
            </div>
          </div>

          {/* Price */}
          <div className="shrink-0 text-right hidden sm:block">
            <p className="text-xs text-gray-400">Total</p>
            <p className="text-sm font-extrabold text-gray-900">৳{(price * qty).toLocaleString("en-BD")}</p>
          </div>

          {/* Added badge */}
          <div className="shrink-0 flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-full">
            <Check size={13}/> Added to Cart
          </div>

          {/* View Cart */}
          <Link
            href="/cart"
            className="shrink-0 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors active:scale-95 whitespace-nowrap"
          >
            View Cart
          </Link>

          {/* Dismiss */}
          <button
            onClick={onDismiss}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Deal Banner shown on product page when product is today's deal ──────────
function useDealCountdown(endsAt: string | null) {
  const calc = () => {
    if (!endsAt) return null;
    const diff = new Date(endsAt).getTime() - Date.now();
    if (diff <= 0) return { h: 0, m: 0, s: 0, expired: true };
    const totalSec = Math.floor(diff / 1000);
    return { h: Math.floor(totalSec / 3600), m: Math.floor((totalSec % 3600) / 60), s: totalSec % 60, expired: false };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    if (!endsAt) return;
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endsAt]);
  return time;
}
function padN(n: number) { return String(n).padStart(2, "0"); }

function DealBanner({ id, dealPrice, regularPrice, dealEndsAt }: {
  id?: string;
  dealPrice: number;
  regularPrice: number;
  dealEndsAt: string | null;
}) {
  const time = useDealCountdown(dealEndsAt);
  const discount = regularPrice > dealPrice
    ? Math.round(((regularPrice - dealPrice) / regularPrice) * 100)
    : null;

  return (
    <div
      id={id}
      className="mb-7 rounded-2xl overflow-hidden border border-orange-200 shadow-sm"
      style={{ background: "linear-gradient(135deg, #fff4ec 0%, #fffdf5 100%)" }}
    >
      <div className="flex flex-wrap items-center gap-4 px-5 py-4">
        {/* Flash icon + label */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500 shadow-md shadow-orange-200">
            <Zap size={18} className="text-white fill-white" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500 leading-none">Flash Offer</p>
            <p className="text-sm font-extrabold text-gray-900 leading-tight">Today&apos;s Deal</p>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-10 bg-orange-200" />

        {/* Price block */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl font-extrabold text-orange-500">৳{dealPrice.toLocaleString("en-BD")}</span>
          {regularPrice > dealPrice && (
            <span className="text-sm text-gray-400 line-through">৳{regularPrice.toLocaleString("en-BD")}</span>
          )}
          {discount && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              <Tag size={10} /> Save {discount}%
            </span>
          )}
        </div>

        {/* Timer */}
        {dealEndsAt && time && !time.expired && (
          <>
            <div className="hidden sm:block w-px h-10 bg-orange-200" />
            <div className="flex items-center gap-1.5">
              <Timer size={13} className="text-orange-500 shrink-0" />
              <span className="text-[11px] font-semibold text-gray-500">Ends in</span>
              {[padN(time.h), padN(time.m), padN(time.s)].map((u, i) => (
                <span key={i} className="flex items-center gap-0.5">
                  <span className="inline-flex items-center justify-center w-8 h-7 rounded-lg bg-gray-900 text-white font-mono text-xs font-extrabold shadow-sm">{u}</span>
                  {i < 2 && <span className="text-gray-500 font-bold text-xs">:</span>}
                </span>
              ))}
            </div>
          </>
        )}

        {dealEndsAt && time?.expired && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full ml-auto">
            <Timer size={12} /> Deal Ended
          </span>
        )}

        {/* Right label */}
        <div className="ml-auto shrink-0 hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-orange-600 bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-full">
          <Zap size={11} className="fill-orange-500 text-orange-500" />
          This product is part of today&apos;s special deal
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────
export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [product,     setProduct]     = useState<Product | null>(null);
  const [related,     setRelated]     = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [activeImg,   setActiveImg]   = useState(0);
  const [qty,         setQty]         = useState(1);
  const { toggle: toggleWishlist, isWished } = useWishlistStore();
  const [added,       setAdded]       = useState(false);
  const [showCartBar, setShowCartBar] = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [activeTab,   setActiveTab]   = useState<"specs"|"description"|"reviews">("specs");
  const [selColor,    setSelColor]    = useState<string>("");
  const [selStorage,  setSelStorage]  = useState<string>("");
  const [selRegion,   setSelRegion]   = useState<string>("");
  const [catalogPhone, setCatalogPhone] = useState<CatalogPhone | null>(null);
  // ── Condition-aware base price ──────────────────────────────────────────────
  // Catalog phone হলে catalog থেকে নেয় (double counting এড়াতে)
  // DB product হলে condition অনুযায়ী brand_new_price বা pre_owned_price
  const conditionBasePrice: number = (() => {
    if (!product) return 0;
    if (catalogPhone) return catalogPhone.price; // catalog phone: always use catalog price
    if (product.condition === "pre-owned") {
      return product.pre_owned_price ?? product.price;
    }
    return product.brand_new_price ?? product.price;
  })();

  // ── Active offer/deal resolution (time-based, auto-expire) ───────────────
  // Priority: new offer system > legacy today's deal
  const activeOfferInfo: { offer_price: number; offer_ends_at: string | null; offer_label: string } | null = (() => {
    if (!product) return null;
    const now = Date.now();

    // New offer system
    const offerEnded = product.offer_ends_at ? new Date(product.offer_ends_at).getTime() < now : false;
    if (!offerEnded) {
      const offerPrice = product.condition === "pre-owned"
        ? product.offer_price_pre_owned
        : product.offer_price_brand_new;
      if (offerPrice && offerPrice > 0 && offerPrice < conditionBasePrice) {
        return {
          offer_price: offerPrice,
          offer_ends_at: product.offer_ends_at ?? null,
          offer_label: product.offer_type ?? "Offer",
        };
      }
    }

    // Legacy today's deal
    if (product.is_today_deal && product.deal_price && product.deal_price < product.price) {
      const dealEnded = product.deal_ends_at ? new Date(product.deal_ends_at).getTime() < now : false;
      if (!dealEnded) {
        return {
          offer_price: product.deal_price,
          offer_ends_at: product.deal_ends_at ?? null,
          offer_label: "Today's Deal",
        };
      }
    }
    return null;
  })();

  // backward compat alias so DealBanner still works
  const dealInfo = activeOfferInfo ? {
    deal_price: activeOfferInfo.offer_price,
    deal_ends_at: activeOfferInfo.offer_ends_at,
  } : null;

  const addItem = useCartStore((s) => s.addItem);

  // Reset "Added!" state when user changes qty/color/storage
  useEffect(() => { setAdded(false); }, [qty, selColor, selStorage]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => {
        const found: Product | undefined = Array.isArray(d.products)
          ? d.products.find((p: Product) => p.slug === slug)
          : undefined;
        const fromCatalog = !found ? phoneBySlug(slug) : undefined;
        setCatalogPhone(fromCatalog ?? null);
        setProduct(found ?? (fromCatalog ? catalogToProduct(fromCatalog) : null));
        if (fromCatalog) {
          setSelColor(fromCatalog.colors[0].name);
          setSelStorage(fromCatalog.storageVariants?.[0] ?? fromCatalog.storage);
          setSelRegion(fromCatalog.regions?.[0] ?? "HK");
          setActiveImg(0);
          setRelated(
            PHONES.filter((x) => x.brand === fromCatalog.brand && x.slug !== slug).slice(0, 8).map(catalogToProduct)
          );
        }

        if (found) {
          const colors = parseArr(found.colors);
          const storages = parseArr(found.storage_variants);
          const regions = found.regions ? found.regions.split(",").map((r) => r.trim()) : [];
          if (colors.length)   setSelColor(colors[0]);
          if (storages.length) setSelStorage(storages[0]);
          if (regions.length)  setSelRegion(regions[0]);
          if (found.category) {
            fetch(`/api/products?category=${encodeURIComponent(found.category)}&available=true`)
              .then((r) => r.json())
              .then((rd) => {
                if (Array.isArray(rd.products))
                  setRelated(rd.products.filter((p: Product) => p.slug !== slug).slice(0, 8));
              }).catch(() => {});
          }
        }
      })
      .catch(() => {
        // API না চললেও catalog-এর product দেখাবে
        const c = phoneBySlug(slug);
        if (!c) return;
        setCatalogPhone(c);
        setProduct(catalogToProduct(c));
        setSelColor(c.colors[0].name);
        setSelStorage(c.storageVariants?.[0] ?? c.storage);
        setSelRegion(c.regions?.[0] ?? "HK");
        setRelated(PHONES.filter((x) => x.brand === c.brand && x.slug !== slug).slice(0, 8).map(catalogToProduct));
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // ── Live update: admin যা বদলাবে (দাম, battery %, stock, deal ইত্যাদি) সাথে সাথে এই পেজে আসবে ──
  const liveId = product?.id;
  const liveDb = !!product && !catalogPhone;
  useEffect(() => {
    if (!liveId || !liveDb) return;
    const channel = supabase
      .channel(`product-live-${liveId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "products", filter: `id=eq.${liveId}` },
        (payload) => setProduct((prev) => (prev ? { ...prev, ...(payload.new as Partial<Product>) } : prev))
      )
      .subscribe();
    // Realtime বন্ধ থাকলেও আপডেট আসবে: tab-এ ফিরলে ও প্রতি ৩০ সেকেন্ডে নতুন করে আনে
    const refetch = () => {
      if (document.visibilityState === "hidden") return;
      fetch(`/api/products?slug=${slug}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          const f: Product | undefined = Array.isArray(d.products)
            ? d.products.find((p: Product) => p.slug === slug) : undefined;
          if (f) setProduct((prev) => (prev ? { ...prev, ...f } : prev));
        })
        .catch(() => {});
    };
    const timer = setInterval(refetch, 30000);
    document.addEventListener("visibilitychange", refetch);
    return () => {
      supabase.removeChannel(channel);
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refetch);
    };
  }, [liveId, liveDb, slug]);

  // Catalog product হলে: প্রতিটা color-এর ছবি + বাড়তি side ছবি thumbnail হিসেবে
  const images: string[] = catalogPhone
    ? [...catalogPhone.colors.map((c) => c.image), ...(catalogPhone.gallery ?? [])]
    : product ? [fixImage(product.image)] : [];

  function pickColor(name: string) {
    setSelColor(name);
    const idx = catalogPhone?.colors.findIndex((c) => c.name === name) ?? -1;
    if (idx >= 0) setActiveImg(idx);
  }
  const colors = catalogPhone
    ? catalogPhone.colors.map((c) => c.name)
    : parseArr(product?.colors);

  const storageVariants = catalogPhone?.storageVariants
    ?? (product?.storage_variants ? parseArr(product.storage_variants) : []);

  const regionList: string[] = catalogPhone?.regions
    ?? (product?.regions ? product.regions.split(",").map((r) => r.trim()) : []);

  // ── Dynamic price based on selected storage + region ──
  // base price of a storage (without region adjustment)
  const baseFor = (storage: string): number => {
    if (catalogPhone?.storagePrices) return catalogPhone.storagePrices[storage] ?? catalogPhone.price;
    // প্রথম storage = condition অনুযায়ী সঠিক price (brand-new বা pre-owned)
    if (product && storage === storageVariants[0]) return conditionBasePrice;
    if (product?.storage_prices) {
      try {
        const sp: Record<string, number> = JSON.parse(product.storage_prices);
        return sp[storage] ?? conditionBasePrice;
      } catch { /* fall through */ }
    }
    return conditionBasePrice;
  };
  // region price adjustment (+/-)
  const deltaFor = (region: string): number => {
    if (catalogPhone?.regionPrices) return catalogPhone.regionPrices[region] ?? 0;
    if (product?.region_prices) {
      try {
        const rp: Record<string, number> = JSON.parse(product.region_prices);
        return rp[region] ?? 0;
      } catch { /* ignore */ }
    }
    return 0;
  };

  // regular (sale) price for the selected storage + region
  const computedPrice = baseFor(selStorage) + deltaFor(selRegion);

  // Offer discount: offer price flat discount থেকে condition base price বাদ দেওয়া হয়
  // সব storage/region variant-এ সমান ভাবে apply হয়
  const offerDiscount = activeOfferInfo && product
    ? Math.max(0, conditionBasePrice - activeOfferInfo.offer_price)
    : 0;
  const displayPrice = Math.max(0, computedPrice - offerDiscount);

  // কাটা দাম: Original Price থাকলে সেটা (Sale Price-এর চেয়ে বেশি হলে), না হলে condition base price
  const origGap = product?.original_price && product.original_price > conditionBasePrice
    ? product.original_price - conditionBasePrice : 0;
  const reference = computedPrice + origGap;
  const displayOriginal: number | undefined = reference > displayPrice ? reference : undefined;

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    // Build variant label: Storage · Color · Region (only non-empty parts)
    const variantParts: string[] = [];
    if (selStorage) variantParts.push(selStorage);
    if (selColor)   variantParts.push(selColor);
    if (selRegion)  variantParts.push(`Region: ${selRegion}`);
    const variantLabel = variantParts.join(" · ");

    const chosen = catalogPhone?.colors.find((c) => c.name === selColor);
    // Unique cart id per variant so same product with diff variants sit as separate lines
    const variantId = variantParts.length
      ? `${product.id}:${variantParts.join("-").replace(/\s+/g, "_")}`
      : product.id;

    addItem(
      {
        ...product,
        id: variantId,
        price: displayPrice,
        original_price: displayOriginal,
        ...(chosen ? { image: chosen.image } : {}),
        variant: variantLabel || product.variant,
      },
      qty
    );
    setAdded(true);
    setShowCartBar(true);
  }, [product, qty, addItem, catalogPhone, selColor, selStorage, selRegion, displayPrice, displayOriginal]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }, []);

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-56 mb-6"/>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-100 rounded-3xl h-[420px]"/>
          <div className="space-y-4 pt-2">
            <div className="h-7 bg-gray-100 rounded w-3/4"/>
            <div className="h-4 bg-gray-100 rounded w-1/2"/>
            <div className="h-10 bg-gray-100 rounded w-1/3 mt-4"/>
            <div className="h-12 bg-gray-100 rounded-xl mt-6"/>
            <div className="h-12 bg-gray-100 rounded-xl"/>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Package size={32} className="text-gray-300"/>
        </div>
        <p className="text-gray-500 text-lg font-semibold">Product not found.</p>
        <Link href="/products" className="mt-6 inline-flex items-center gap-2 text-brand-500 font-bold hover:underline text-sm">
          <ChevronLeft size={16}/> Back to Products
        </Link>
      </div>
    );
  }

  const discount  = displayOriginal ? Math.round(((displayOriginal - displayPrice) / displayOriginal) * 100) : null;
  const savings   = displayOriginal ? displayOriginal - displayPrice : null;

  // ── Warranty / Replacement (condition + brand অনুযায়ী) ──
  const isPreOwned = product.condition === "pre-owned";
  const isApple    = (product.category ?? "").toLowerCase() === "apple" || catalogPhone?.brand === "apple";
  const warrantyPoints: string[] = isPreOwned
    ? ["15 Days Replacement Guarantee", "2 Years Service Warranty"]
    : isApple
      ? ["1 Year Apple Official Warranty Support", "15 Days Replacement Guarantee"]
      : ["15 Days Replacement Guarantee", "2 Years Service Warranty"];
  const warrantyTile = !isPreOwned && isApple
    ? { label: "1 Year Warranty", sub: "Apple official warranty" }
    : { label: "2 Years Warranty", sub: "Service warranty" };
  const inStock   = product.is_available !== false;
  const stockCount = product.stock ?? null;

  // WhatsApp message
  const waMsg = encodeURIComponent(`Hi! I'm interested in *${product.name}*${selColor ? ` (${selColor})` : ""}${selStorage ? ` – ${selStorage}` : ""}. Please let me know more. Product link: ${typeof window !== "undefined" ? window.location.href : ""}`);
  const waLink = product.whatsapp_number ? `https://wa.me/${product.whatsapp_number.replace(/\D/g,"")}?text=${waMsg}` : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3 md:mb-6 flex-wrap">
          <Link href="/" className="hover:text-brand-500 transition-colors">Home</Link>
          <ChevronRight size={12}/>
          <Link href="/products" className="hover:text-brand-500 transition-colors">Products</Link>
          {product.category && (
            <><ChevronRight size={12}/>
            <Link href={`/products?category=${product.category.toLowerCase().replace(/\s+/g,"-")}`} className="hover:text-brand-500 transition-colors capitalize">{product.category}</Link></>
          )}
          <ChevronRight size={12}/>
          <span className="text-gray-700 font-medium line-clamp-1">{product.name}</span>
        </nav>

        {/* ── Offer / Today's Deal Banner — auto shows when offer active, auto hides when expired ── */}
        {activeOfferInfo && (
          <DealBanner
            id="deal"
            dealPrice={activeOfferInfo.offer_price}
            regularPrice={Math.max(product?.original_price ?? 0, conditionBasePrice)}
            dealEndsAt={activeOfferInfo.offer_ends_at}
          />
        )}

        {/* ── Main Grid ── */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-8 lg:gap-14 items-start">

          {/* LEFT: Image */}
          <div className="flex flex-col gap-3">
            {/* ── Main image with zoom-on-hover ── */}
            <div className="relative bg-white rounded-3xl border border-gray-100 overflow-hidden flex items-center justify-center min-h-[300px] md:min-h-[400px] group/imgbox">
              {/* Auto offer badge — offer active থাকলে দেখায়, expire হলে সরে যায় */}
              {activeOfferInfo ? (
                <span className="absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow animate-pulse" style={{ backgroundColor: "#FB5724" }}>
                  🔥 {activeOfferInfo.offer_label}
                </span>
              ) : product.badge ? (
                <span className="absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow" style={{ backgroundColor: product.badge_color ?? "#FB5724" }}>{product.badge}</span>
              ) : null}
              {discount && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full z-10">-{discount}%</span>
              )}
              <button onClick={() => product && toggleWishlist(product as never)} className={`absolute top-14 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-md z-10 transition-all hover:scale-110 ${product && isWished(product.id) ? "bg-red-500" : "bg-white border border-gray-200"}`}>
                <Heart size={16} className={product && isWished(product.id) ? "fill-white text-white" : "text-gray-400"}/>
              </button>
              <button onClick={handleShare} className="absolute top-24 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-md z-10 bg-white border border-gray-200 hover:scale-110 transition-all">
                {copied ? <Check size={16} className="text-green-500"/> : <Share2 size={16} className="text-gray-400"/>}
              </button>
              {/* Condition badge */}
              {product.condition === "pre-owned"
                ? <span className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50/95 border border-amber-200 px-2.5 py-1 rounded-full shadow-sm"><Tag size={11}/> Pre-Owned</span>
                : <span className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 text-[11px] font-bold text-leaf-700 bg-leaf-50/95 border border-leaf-200 px-2.5 py-1 rounded-full shadow-sm"><BadgeCheck size={11}/> Brand New</span>
              }
              {/* Zoom container — overflow:hidden on parent clips the scale */}
              <div className="relative w-full px-4 h-[260px] md:h-[340px]">
                <Image
                  src={images[activeImg] ?? "/logo/pure-apple-logo.png"}
                  alt={product.name}
                  fill
                  className="object-contain drop-shadow-xl transition-transform duration-500 ease-out group-hover/imgbox:scale-[1.18] cursor-zoom-in"
                  sizes="(max-width:768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            {/* ── Thumbnail strip with slide animation ── */}
            {images.length > 1 && (
              <div className="flex gap-2 justify-center flex-wrap">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveImg(i);
                      if (catalogPhone && i < catalogPhone.colors.length) setSelColor(catalogPhone.colors[i].name);
                    }}
                    className={`
                      relative w-16 h-16 rounded-xl border-2 overflow-hidden bg-white
                      flex items-center justify-center
                      transition-all duration-300 ease-out
                      ${i === activeImg
                        ? "border-brand-500 shadow-[0_4px_14px_rgba(251,87,36,0.25)] scale-105"
                        : "border-gray-200 hover:border-brand-300 hover:scale-105 opacity-70 hover:opacity-100"
                      }
                    `}
                  >
                    {/* Active slide indicator bar */}
                    <span className={`
                      absolute bottom-0 left-0 right-0 h-[3px] rounded-b-xl
                      transition-all duration-300
                      ${i === activeImg ? "bg-brand-500 opacity-100" : "opacity-0"}
                    `}/>
                    <div className="relative w-12 h-12">
                      <Image src={src} alt={`View ${i + 1}`} fill className="object-contain" sizes="48px"/>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Info */}
          <div className="flex flex-col">
            {/* Brand row */}
            <div className="flex items-center justify-between mb-0.5">
              {product.category && (
                <Link href={`/products?category=${product.category.toLowerCase().replace(/\s+/g,"-")}`} className="text-xs font-semibold text-brand-500 uppercase tracking-wider hover:underline">
                  {product.category}
                </Link>
              )}
              {product.product_code && (
                <span className="text-xs text-gray-400 font-mono">Code: <span className="font-bold text-gray-600">{product.product_code}</span></span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">{product.name}</h1>
            {product.variant && <p className="text-gray-400 text-sm mt-1">{product.variant}</p>}

            {/* Price */}
            <div className="mt-3 p-4 bg-brand-50 rounded-2xl border border-brand-100">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1 font-semibold">Cash Price</div>
              <div className="flex items-end gap-3 flex-wrap">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">৳{displayPrice.toLocaleString("en-BD")}</span>
                {displayOriginal && (
                  <>
                    <span className="text-lg line-through text-gray-400">৳{displayOriginal.toLocaleString("en-BD")}</span>
                    <span className="text-sm font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-lg">৳{savings?.toLocaleString("en-BD")} OFF</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">Availability:</span>
                <span className={`text-xs font-bold ${inStock ? "text-green-600" : "text-red-500"}`}>{inStock ? "In Stock" : "Out of Stock"}</span>
              </div>
            </div>

            {/* ── Color Selector ── */}
            {colors.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-bold text-gray-700 mb-2">Color: <span className="text-brand-500">{selColor}</span></p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button key={c} type="button" onClick={() => pickColor(c)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${selColor===c ? "border-brand-500 text-brand-700 bg-brand-50" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                    >
                      {catalogPhone?.colors.find((x) => x.name === c) && (
                        <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: catalogPhone.colors.find((x) => x.name === c)!.hex }} />
                      )}
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Storage + Region ── */}
            {(storageVariants.length > 0 || regionList.length > 0) && (
              <div className="mt-4 p-3.5 bg-white border border-gray-100 rounded-2xl space-y-3">

                {/* Storage row */}
                {storageVariants.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Storage</p>
                    <div className="flex flex-wrap gap-1.5">
                      {storageVariants.map((s) => {
                        const isSelected = selStorage === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelStorage(s)}
                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-150 active:scale-95
                              ${isSelected
                                ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                              }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Region row */}
                {regionList.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Region</p>
                    <div className="flex flex-wrap gap-1.5">
                      {regionList.map((r) => {
                        const isSelected = selRegion === r;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setSelRegion(r)}
                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-150 active:scale-95
                              ${isSelected
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                              }`}
                          >
                            {r}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Key points */}
            <ul className="mt-4 space-y-1.5">
              {warrantyPoints.map((w) => (
                <li key={w} className="flex items-center gap-2 text-sm text-gray-700"><Check size={14} className="text-green-500 shrink-0"/> {w}</li>
              ))}
              <li className="flex items-center gap-2 text-sm text-gray-700"><Check size={14} className="text-green-500 shrink-0"/> Activation is Mandatory to Get the Offer Price</li>
              {product.emi_available && (
                <li className="flex items-center gap-2 text-sm text-gray-700"><CreditCard size={14} className="text-brand-500 shrink-0"/> EMI Available — <Link href="#emi" className="text-brand-500 underline font-semibold">View Plans</Link></li>
              )}
            </ul>

            {/* Quantity */}
            <div className="flex items-center gap-3 mt-5">
              <span className="text-sm font-semibold text-gray-700">Select Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <button onClick={() => setQty((q) => Math.max(1, q-1))} disabled={!inStock} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors active:scale-95 disabled:opacity-40"><Minus size={16}/></button>
                <span className="w-12 text-center text-sm font-extrabold text-gray-900">{qty}</span>
                <button onClick={() => setQty((q) => (stockCount !== null ? Math.min(stockCount, q+1) : q+1))} disabled={!inStock} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors active:scale-95 disabled:opacity-40"><Plus size={16}/></button>
              </div>
              {stockCount !== null && stockCount > 0 && stockCount <= 10 && (
                <span className="text-xs text-amber-600 font-semibold">Only {stockCount} left!</span>
              )}
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3 mt-4">
              <button onClick={handleAddToCart} disabled={!inStock}
                className={`flex-1 h-12 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all active:scale-95 shadow-sm
                  ${!inStock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : added ? "bg-green-500 text-white" : "bg-brand-500 hover:bg-brand-600 text-white"}`}
              >
                {added ? <Check size={16}/> : <ShoppingCart size={16}/>}
                {added ? "Added!" : inStock ? "Add to Cart" : "Out of Stock"}
              </button>
              <Link href="/checkout" onClick={inStock ? handleAddToCart : undefined}
                className={`flex-1 h-12 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all active:scale-95 ${inStock ? "bg-gray-900 hover:bg-gray-800 text-white" : "bg-gray-200 text-gray-400 pointer-events-none"}`}
              >
                <Zap size={15}/> Shop Now
              </Link>
            </div>

            {/* EMI & WhatsApp row */}
            <div className="flex gap-3 mt-3">
              {product.emi_available && (
                <button className="flex-1 h-11 flex items-center justify-center gap-2 text-sm font-semibold rounded-xl border-2 border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">
                  <CreditCard size={15}/> EMI Available — View Plans
                </button>
              )}
              {waLink && (
                <a href={waLink} target="_blank" rel="noopener noreferrer"
                  className="flex-1 h-11 flex items-center justify-center gap-2 text-sm font-bold rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors">
                  <MessageCircle size={15}/> WhatsApp
                </a>
              )}
            </div>

            {/* Trust badges */}
            <div className="mt-5 rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-leaf-50 via-white to-brand-50 border-b border-gray-100">
                <BadgeCheck size={14} className="text-leaf-600" />
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-gray-700">Pure Apple Promise</p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 [&>*:nth-child(-n+2)]:border-t-0">
                {[
                  { icon: Shield,     label:warrantyTile.label, sub:warrantyTile.sub, tile:"bg-brand-50 text-brand-500 ring-brand-100" },
                  { icon: Truck,      label:"Free Delivery",   sub:"Dhaka & nationwide", tile:"bg-sky-50 text-sky-600 ring-sky-100" },
                  { icon: RefreshCw,  label:"15 Days Replacement", sub:"Hassle-free",    tile:"bg-amber-50 text-amber-600 ring-amber-100" },
                  { icon: BadgeCheck, label:"100% Genuine",    sub:"Verified authentic", tile:"bg-leaf-50 text-leaf-600 ring-leaf-100" },
                ].map(({ icon: Icon, label, sub, tile }) => (
                  <div key={label} className="flex items-center gap-3 px-3.5 py-3.5">
                    <div className={`w-10 h-10 rounded-xl ring-1 flex items-center justify-center shrink-0 ${tile}`}>
                      <Icon size={18} strokeWidth={2.1}/>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-gray-900 leading-tight">{label}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mt-10">
          <div className="flex gap-1 border-b border-gray-200 mb-6">
            {(["specs","description"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-bold capitalize transition-colors relative ${activeTab===tab ? "text-brand-500" : "text-gray-400 hover:text-gray-700"}`}
              >
                {tab==="specs" ? "Specifications" : "Description"}
                {activeTab===tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-t"/>}
              </button>
            ))}
          </div>

          {activeTab==="specs" && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { label:"Brand / Category",  value: product.category || "—" },
                    { label:"Model / Variant",    value: product.variant || product.name },
                    { label:"Product Code",       value: product.product_code || "—" },
                    { label:"Condition",          value: product.condition==="pre-owned" ? "Pre-Owned" : "Brand New" },
                    ...(product.battery_health != null && Number(product.battery_health) > 0
                      ? [{ label:"Battery Health", value: `🔋 ${product.battery_health}%` }]
                      : []),
                    { label:"Display",            value: product.spec_screen || "—" },
                    { label:"RAM / Storage",      value: product.spec_ram || "—" },
                    { label:"Camera",             value: product.spec_camera || "—" },
                    { label:"Available Colors",   value: colors.length ? colors.join(", ") : "—" },
                    { label:"Storage Options",    value: storageVariants.length ? storageVariants.join(", ") : "—" },
                    { label:"Price",              value: `৳${displayPrice.toLocaleString("en-BD")}` },
                    { label:"Original Price",     value: displayOriginal ? `৳${displayOriginal.toLocaleString("en-BD")}` : "—" },
                    { label:"Discount",           value: discount ? `${discount}%` : "—" },
                    { label:"EMI",                value: product.emi_available ? "Available" : "Not Available" },
                    { label:"Availability",       value: inStock ? `In Stock${stockCount ? ` (${stockCount} units)` : ""}` : "Out of Stock" },
                  ].map(({ label, value }, i) => (
                    <tr key={label} className={i%2===0 ? "bg-gray-50" : "bg-white"}>
                      <td className="py-3 px-5 font-semibold text-gray-500 w-44">{label}</td>
                      <td className="py-3 px-5 text-gray-800">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab==="description" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 prose prose-sm max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {product.name} — {product.variant ?? "a premium device"} — is available at <strong>Pure Apple</strong> with official warranty, free delivery across Bangladesh, and hassle-free returns.
              </p>
              {(product.spec_screen || product.spec_ram || product.spec_camera) && (
                <ul className="mt-4 space-y-2 text-gray-700">
                  {product.spec_screen  && <li>📱 <strong>Display:</strong> {product.spec_screen}</li>}
                  {product.spec_ram     && <li>⚙️ <strong>RAM:</strong> {product.spec_ram}</li>}
                  {product.spec_camera  && <li>📷 <strong>Camera:</strong> {product.spec_camera}</li>}
                </ul>
              )}
              {colors.length > 0     && <p className="mt-3 text-gray-700">🎨 <strong>Colors:</strong> {colors.join(", ")}</p>}
              {storageVariants.length > 0 && <p className="mt-1 text-gray-700">💾 <strong>Storage:</strong> {storageVariants.join(", ")}</p>}
              <p className="mt-4 text-gray-500 text-xs">* Product images are for illustrative purposes. Actual colour may vary slightly.</p>
            </div>
          )}


        </div>

        {/* ── Sticky Cart Bar ── */}
        {showCartBar && product && (
          <StickyCartBar
            product={product}
            qty={qty}
            selColor={selColor}
            selStorage={selStorage}
            price={displayPrice}
            onDismiss={() => setShowCartBar(false)}
          />
        )}

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-extrabold text-gray-900">Related Products</h2>
              {product.category && (
                <Link href={`/products?category=${product.category.toLowerCase().replace(/\s+/g,"-")}`} className="text-sm font-semibold text-brand-500 hover:underline flex items-center gap-1">
                  View all <ChevronRight size={14}/>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {related.map((p) => <RelatedCard key={p.id} p={p}/>)}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
