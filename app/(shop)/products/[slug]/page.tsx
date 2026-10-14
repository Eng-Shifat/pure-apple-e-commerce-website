"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star, ShoppingCart, Zap, Heart, ChevronRight,
  Shield, RefreshCw, Truck, BadgeCheck, Minus, Plus,
  Share2, Check, ChevronLeft, Package, Tag, MessageCircle, CreditCard, X,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";
import { phoneBySlug, PHONES, type CatalogPhone } from "@/lib/phoneCatalog";

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

// ── Star row ──
function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex">
      {[1,2,3,4,5].map((n) => (
        <Star key={n} size={size} className={n <= Math.round(rating) ? "fill-sun-500 text-sun-500" : "text-gray-200"}/>
      ))}
    </div>
  );
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

// ─── MAIN PAGE ────────────────────────────────────────────
export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [product,     setProduct]     = useState<Product | null>(null);
  const [related,     setRelated]     = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [activeImg,   setActiveImg]   = useState(0);
  const [qty,         setQty]         = useState(1);
  const [wished,      setWished]      = useState(false);
  const [added,       setAdded]       = useState(false);
  const [showCartBar, setShowCartBar] = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [activeTab,   setActiveTab]   = useState<"specs"|"description"|"reviews">("specs");
  const [selColor,    setSelColor]    = useState<string>("");
  const [selStorage,  setSelStorage]  = useState<string>("");
  const [selRegion,   setSelRegion]   = useState<string>("");
  const [catalogPhone, setCatalogPhone] = useState<CatalogPhone | null>(null);

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
  const computedPrice = (() => {
    if (catalogPhone?.storagePrices) {
      const base = catalogPhone.storagePrices[selStorage] ?? catalogPhone.price;
      const delta = catalogPhone.regionPrices?.[selRegion] ?? 0;
      return base + delta;
    }
    if (product?.storage_prices) {
      try {
        const sp: Record<string, number> = JSON.parse(product.storage_prices);
        const base = sp[selStorage] ?? product.price;
        const rp: Record<string, number> = product.region_prices ? JSON.parse(product.region_prices) : {};
        const delta = rp[selRegion] ?? 0;
        return base + delta;
      } catch { /* fall through */ }
    }
    return product?.price ?? 0;
  })();

  const displayPrice    = computedPrice;
  const displayOriginal = product?.original_price
    ? Math.round(product.original_price * (computedPrice / (product.price || 1)))
    : undefined;

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    const chosen = catalogPhone?.colors.find((c) => c.name === selColor);
    addItem(
      chosen
        ? { ...product, id: `${product.id}:${chosen.name}`, image: chosen.image, variant: `${catalogPhone!.storage} – ${chosen.name}` }
        : product,
      qty
    );
    setAdded(true);
    setShowCartBar(true);
  }, [product, qty, addItem, catalogPhone, selColor]);

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
  const inStock   = product.is_available !== false;
  const stockCount = product.stock ?? null;

  // WhatsApp message
  const waMsg = encodeURIComponent(`Hi! I'm interested in *${product.name}*${selColor ? ` (${selColor})` : ""}${selStorage ? ` – ${selStorage}` : ""}. Please let me know more. Product link: ${typeof window !== "undefined" ? window.location.href : ""}`);
  const waLink = product.whatsapp_number ? `https://wa.me/${product.whatsapp_number.replace(/\D/g,"")}?text=${waMsg}` : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 flex-wrap">
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

        {/* ── Main Grid ── */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-14 items-start">

          {/* LEFT: Image */}
          <div className="flex flex-col gap-3">
            <div className="relative bg-white rounded-3xl border border-gray-100 overflow-hidden flex items-center justify-center" style={{ minHeight:"400px" }}>
              {product.badge && (
                <span className="absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow" style={{ backgroundColor: product.badge_color ?? "#FB5724" }}>{product.badge}</span>
              )}
              {discount && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full z-10">-{discount}%</span>
              )}
              <button onClick={() => setWished((w) => !w)} className={`absolute top-14 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-md z-10 transition-all hover:scale-110 ${wished ? "bg-red-500" : "bg-white border border-gray-200"}`}>
                <Heart size={16} className={wished ? "fill-white text-white" : "text-gray-400"}/>
              </button>
              <button onClick={handleShare} className="absolute top-24 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-md z-10 bg-white border border-gray-200 hover:scale-110 transition-all">
                {copied ? <Check size={16} className="text-green-500"/> : <Share2 size={16} className="text-gray-400"/>}
              </button>
              <div className="relative w-full px-4" style={{ height:"340px" }}>
                <Image src={images[activeImg] ?? "/logo/pure-apple-logo.png"} alt={product.name} fill className="object-contain drop-shadow-xl" sizes="(max-width:768px) 100vw, 50vw" priority/>
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {images.map((src, i) => (
                  <button key={i} onClick={() => { setActiveImg(i); if (catalogPhone && i < catalogPhone.colors.length) setSelColor(catalogPhone.colors[i].name); }} className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-white flex items-center justify-center transition-all ${i===activeImg ? "border-brand-500 shadow-md" : "border-gray-200 hover:border-brand-300"}`}>
                    <div className="relative w-12 h-12"><Image src={src} alt={`View ${i+1}`} fill className="object-contain" sizes="48px"/></div>
                  </button>
                ))}
              </div>
            )}

            {/* Condition + Stock */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {product.condition === "pre-owned"
                ? <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full"><Tag size={12}/> Pre-Owned</span>
                : <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-leaf-700 bg-leaf-50 border border-leaf-200 px-3 py-1.5 rounded-full"><BadgeCheck size={12}/> Brand New</span>
              }
              {inStock
                ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-leaf-700 bg-leaf-50 border border-leaf-200 px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-leaf-500 inline-block"/> In Stock
                    {stockCount !== null && stockCount <= 10 && <span className="ml-1 text-amber-600">({stockCount} left)</span>}
                  </span>
                : <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"/> Out of Stock
                  </span>
              }
            </div>
          </div>

          {/* RIGHT: Info */}
          <div className="flex flex-col">
            {/* Brand row */}
            <div className="flex items-center justify-between mb-1">
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

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <StarRow rating={product.rating}/>
                <span className="text-sm font-bold text-gray-800">{product.rating}</span>
                <span className="text-xs text-gray-400">({product.review_count?.toLocaleString()} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="mt-4 p-4 bg-brand-50 rounded-2xl border border-brand-100">
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

            {/* ── Storage Selector ── */}
            {storageVariants.length > 0 && (
              <div className="mt-4 p-3.5 bg-white border border-gray-100 rounded-2xl">
                <p className="text-sm font-bold text-gray-700 mb-2.5">Storage:</p>
                <div className="flex flex-wrap gap-2">
                  {storageVariants.map((s) => {
                    const sp = catalogPhone?.storagePrices?.[s];
                    const regionDelta = catalogPhone?.regionPrices?.[selRegion] ?? 0;
                    const spWithRegion = sp !== undefined ? sp + regionDelta : undefined;
                    const isSelected = selStorage === s;
                    return (
                      <button key={s} type="button" onClick={() => setSelStorage(s)}
                        className={`flex flex-col items-center px-3.5 py-2.5 rounded-xl border-2 transition-all min-w-[72px]
                          ${isSelected
                            ? "border-[#FB5724] bg-orange-50 shadow-[0_2px_8px_rgba(251,87,36,0.15)]"
                            : "border-gray-200 text-gray-500 hover:border-orange-200 bg-white"
                          }`}
                      >
                        <span className={`text-sm font-extrabold ${isSelected ? "text-[#FB5724]" : "text-gray-700"}`}>{s}</span>
                        {spWithRegion !== undefined && (
                          <span className={`text-[10px] font-semibold mt-0.5 ${isSelected ? "text-orange-500" : "text-gray-400"}`}>
                            ৳{spWithRegion.toLocaleString("en-BD")}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Region Selector ── */}
            {regionList.length > 0 && (
              <div className="mt-3 p-3.5 bg-white border border-gray-100 rounded-2xl">
                <p className="text-sm font-bold text-gray-700 mb-2.5">
                  Region:
                  <span className="ml-2 text-[11px] font-normal text-gray-400">প্রতিটি region-এর price আলাদা</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {regionList.map((r) => {
                    const base = catalogPhone?.storagePrices?.[selStorage] ?? displayPrice;
                    const delta = catalogPhone?.regionPrices?.[r] ?? 0;
                    const rp = (() => {
                      if (product?.region_prices) {
                        try { const rpr: Record<string, number> = JSON.parse(product.region_prices); return rpr[r] ?? 0; }
                        catch { return 0; }
                      }
                      return delta;
                    })();
                    const rPrice = base + rp;
                    const isSelected = selRegion === r;
                    return (
                      <button key={r} type="button" onClick={() => setSelRegion(r)}
                        className={`flex flex-col items-center px-4 py-2.5 rounded-xl border-2 transition-all min-w-[64px]
                          ${isSelected
                            ? "border-gray-800 bg-gray-800 shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-400"
                          }`}
                      >
                        <span className={`text-sm font-extrabold ${isSelected ? "text-white" : "text-gray-700"}`}>{r}</span>
                        <span className={`text-[10px] font-semibold mt-0.5 ${isSelected ? "text-gray-300" : "text-gray-400"}`}>
                          ৳{rPrice.toLocaleString("en-BD")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Key points */}
            <ul className="mt-4 space-y-1.5">
              <li className="flex items-center gap-2 text-sm text-gray-700"><Check size={14} className="text-green-500 shrink-0"/> 1 Year Apple Official Warranty Support</li>
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
            <div className="grid grid-cols-2 gap-2.5 mt-5 pt-5 border-t border-gray-100">
              {[
                { icon: Shield,     label:"1 Year Warranty", sub:"Official warranty" },
                { icon: Truck,      label:"Free Delivery",   sub:"Dhaka & nationwide" },
                { icon: RefreshCw,  label:"7-Day Return",    sub:"Hassle-free" },
                { icon: BadgeCheck, label:"100% Genuine",    sub:"Verified authentic" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-brand-500"/>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
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
