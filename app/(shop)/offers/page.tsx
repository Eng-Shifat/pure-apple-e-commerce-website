// SAVE PATH: app/(shop)/offers/page.tsx
"use client";

// /offers — সব live + upcoming offer; card click → /offers/[slug]

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Flame, ChevronRight, Tag } from "lucide-react";
import OfferCountdown from "@/components/shop/OfferCountdown";
import { offerStatus, type Offer } from "@/lib/offers";

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[] | undefined>(undefined);

  const load = () =>
    fetch("/api/offers?limit=4", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setOffers(d.offers ?? []))
      .catch(() => setOffers([]));

  useEffect(() => { load(); }, []);

  const list = useMemo(
    () => (offers ?? []).map((o) => ({ ...o, status: offerStatus(o) })).filter((o) => o.status !== "ended"),
    [offers]
  );

  return (
    <main className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-dark-hero text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-1 flex items-center gap-1">
            <Flame size={13} /> Limited Time
          </p>
          <h1 className="text-2xl sm:text-4xl font-black">Special Offers</h1>
          <p className="text-white/60 text-sm mt-1">Best deals, today&apos;s offers & festival sales — সময় শেষ হওয়ার আগে নিয়ে নিন।</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {offers === undefined && (
          <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1].map((i) => <div key={i} className="h-48 rounded-2xl bg-gray-200 animate-pulse" />)}
          </div>
        )}

        {offers !== undefined && list.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center"><Tag className="text-orange-300" /></div>
            <h2 className="text-lg font-bold text-gray-700">এখন কোনো offer চলছে না</h2>
            <p className="text-sm text-gray-400">নতুন offer আসলেই এখানে দেখতে পাবেন।</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((o) => {
            const live = o.status === "live";
            return (
              <Link key={o.id} href={`/offers/${o.slug}`}
                className="group relative block rounded-2xl overflow-hidden text-white p-4 sm:p-5 shadow-md hover:shadow-xl transition-shadow"
                style={{ background: `linear-gradient(120deg, ${o.color} 0%, ${o.color}CC 55%, #0E2318 150%)` }}>
                <div aria-hidden className="absolute -right-12 -bottom-14 w-44 h-44 rounded-full bg-white/10" />
                <div className="relative flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full">
                      {live ? "● Live now" : "Coming soon"}
                    </span>
                    <span className="text-xs font-semibold text-white/85">{o.product_count} product{o.product_count === 1 ? "" : "s"}</span>
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-black leading-tight">{o.emoji} {o.title}</h2>
                    {o.subtitle && <p className="text-white/85 text-[13px] leading-snug mt-0.5">{o.subtitle}</p>}
                  </div>

                  <div className="flex items-end justify-between gap-3 mt-1">
                    {!o.no_timer ? (
                      <OfferCountdown
                        key={o.id + o.status}
                        target={live ? o.ends_at : o.starts_at}
                        label={live ? "Offer ends in" : "Starts in"}
                        dark
                        big
                        onDone={load}
                      />
                    ) : <span />}
                    <span className="inline-flex items-center gap-0.5 text-sm font-bold bg-white/20 group-hover:bg-white/30 rounded-full pl-3.5 pr-2.5 py-2 transition-colors shrink-0">
                      View <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
