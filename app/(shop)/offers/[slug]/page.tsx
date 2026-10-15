"use client";

// /offers/[slug] — একটা offer-এর সব product (Black Friday, Black Sunday, Best Deal …)

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ChevronLeft, Tag } from "lucide-react";
import SharedProductCard, { type SharedProduct } from "@/components/shop/SharedProductCard";
import OfferCountdown from "@/components/shop/OfferCountdown";
import { toCard } from "@/components/shop/OffersSection";
import { useCartStore } from "@/store/cartStore";
import { offerStatus, type Offer } from "@/lib/offers";

export default function OfferDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [offer, setOffer] = useState<Offer | null | undefined>(undefined);
  const addItem = useCartStore((s) => s.addItem);

  const load = () =>
    fetch(`/api/offers?slug=${encodeURIComponent(slug)}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { offer: null }))
      .then((d) => setOffer(d.offer ?? null))
      .catch(() => setOffer(null));

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [slug]);

  function handleAddToCart(p: SharedProduct) {
    addItem({
      id: p.id, name: p.name, variant: p.variant ?? "", price: p.price,
      original_price: p.originalPrice, rating: p.rating ?? 0, review_count: p.reviewCount ?? 0,
      image: p.image, slug: p.slug, badge: p.badge ?? offer?.title, badge_color: p.badgeColor ?? offer?.color,
      spec_screen: p.specs?.screen, spec_ram: p.specs?.ram, spec_camera: p.specs?.camera,
    } as never);
  }

  if (offer === undefined) {
    return (
      <main className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-40 rounded-2xl bg-gray-200 mb-6" />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-72 rounded-2xl bg-gray-200" />)}
          </div>
        </div>
      </main>
    );
  }

  if (offer === null) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center"><Tag className="text-orange-300" /></div>
        <h1 className="text-lg font-bold text-gray-700">Offer পাওয়া যায়নি</h1>
        <Link href="/offers" className="text-brand-500 font-semibold text-sm">← সব offer দেখুন</Link>
      </main>
    );
  }

  const status = offerStatus(offer);
  const live = status === "live";
  const ended = status === "ended";

  return (
    <main className="min-h-screen bg-gray-50 pb-10">
      <div className="text-white" style={{ background: `linear-gradient(120deg, ${offer.color} 0%, ${offer.color}CC 55%, #0E2318 150%)` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <Link href="/offers" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm font-medium mb-4">
            <ChevronLeft size={16} /> All Offers
          </Link>
          <h1 className="text-2xl sm:text-4xl font-black leading-tight">{offer.emoji} {offer.title}</h1>
          {offer.subtitle && <p className="text-white/80 text-sm mt-1">{offer.subtitle}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {ended ? (
              <span className="text-xs font-bold bg-black/25 px-3 py-1.5 rounded-full">এই offer শেষ হয়ে গেছে</span>
            ) : !offer.no_timer && (
              <OfferCountdown key={status} target={live ? offer.ends_at : offer.starts_at}
                label={live ? "Ends in" : "Starts in"} dark onDone={load} />
            )}
            <span className="text-xs font-semibold text-white/80">{offer.products?.length ?? 0} products</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {!live ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center">
            <p className="font-semibold text-gray-700">{ended ? "Offer শেষ" : "Offer এখনো শুরু হয়নি"}</p>
            <p className="text-sm text-gray-400 mt-1">{ended ? "নতুন offer-এর জন্য চোখ রাখুন" : "শুরু হলেই product গুলো এখানে দেখাবে"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {(offer.products ?? []).map((p) => (
              <SharedProductCard key={p.id} product={toCard(p)} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
