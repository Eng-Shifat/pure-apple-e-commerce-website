"use client";

// /admin/offers — Offer / Campaign manager
// Best Deal, Today's Offer, Black Friday, Black Sunday … সব এখান থেকে বানান।
// Start/End time দিলে shop-এ নিজে থেকেই live → শেষ হলে hide হয়ে যায়।

import { adminFetch } from "@/lib/adminFetch";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, X, Search, Loader2, Flame, Clock, Package } from "lucide-react";
import { offerStatus, type Offer } from "@/lib/offers";

interface Prod { id: string; name: string; slug: string; image: string; price: number; }
interface Row { product_id: string; offer_price: string; }

const PRESETS: { title: string; slug: string; emoji: string; color: string; subtitle: string; hours: number }[] = [
  { title: "Best Deal",         slug: "best-deal",     emoji: "🔥", color: "#FB5724", subtitle: "Top offers. Limited time only.", hours: 24 * 7 },
  { title: "Today's Offer",     slug: "todays-offer",  emoji: "⚡", color: "#EAB308", subtitle: "আজকের বিশেষ অফার",               hours: 0 },
  { title: "Black Friday Deal", slug: "black-friday",  emoji: "🛍️", color: "#111827", subtitle: "Biggest sale of the year",        hours: 24 },
  { title: "Black Sunday Deal", slug: "black-sunday",  emoji: "🖤", color: "#4B5563", subtitle: "Sunday special prices",           hours: 24 },
];

const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};
const endOfToday = () => { const d = new Date(); d.setHours(23, 59, 0, 0); return d; };
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const EMPTY = {
  id: "", title: "", slug: "", subtitle: "", emoji: "🔥", color: "#FB5724",
  starts_at: toLocalInput(new Date().toISOString()),
  ends_at: toLocalInput(new Date(Date.now() + 24 * 3600_000).toISOString()),
  discount_percent: "", is_active: true, sort_order: "0",
};

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [products, setProducts] = useState<Prod[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState("");

  const say = (msg: string, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 2500); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [o, p] = await Promise.all([
        adminFetch("/api/offers?all=true", { cache: "no-store" }).then((r) => r.json()),
        adminFetch("/api/products").then((r) => r.json()),
      ]);
      setOffers(o.offers ?? []);
      setProducts(p.products ?? []);
    } catch { say("Load করতে সমস্যা হয়েছে", false); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const prodById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => !rows.some((r) => r.product_id === p.id) && (!q || p.name.toLowerCase().includes(q))).slice(0, 8);
  }, [products, rows, search]);

  function openNew(preset?: (typeof PRESETS)[number]) {
    const start = new Date();
    const end = preset?.hours === 0 ? endOfToday() : new Date(Date.now() + (preset?.hours ?? 24) * 3600_000);
    setForm({
      ...EMPTY,
      ...(preset ? { title: preset.title, slug: preset.slug, emoji: preset.emoji, color: preset.color, subtitle: preset.subtitle } : {}),
      starts_at: toLocalInput(start.toISOString()),
      ends_at: toLocalInput(end.toISOString()),
    });
    setRows([]); setSearch(""); setOpen(true);
  }

  async function openEdit(o: Offer) {
    const r = await adminFetch(`/api/offers?slug=${encodeURIComponent(o.slug)}`, { cache: "no-store" }).then((x) => x.json());
    const full: Offer = r.offer ?? o;
    setForm({
      id: o.id, title: o.title, slug: o.slug, subtitle: o.subtitle ?? "", emoji: o.emoji ?? "🔥", color: o.color,
      starts_at: toLocalInput(o.starts_at), ends_at: toLocalInput(o.ends_at),
      discount_percent: o.discount_percent ? String(o.discount_percent) : "", is_active: o.is_active, sort_order: String(o.sort_order ?? 0),
    });
    setRows((full.products ?? []).map((p) => ({
      product_id: p.id,
      // শুধু আলাদা করে সেট করা price দেখাই (discount % থেকে আসা নয়)
      offer_price: o.discount_percent ? "" : p.offer_price !== p.price ? String(p.offer_price) : "",
    })));
    setSearch(""); setOpen(true);
  }

  async function save() {
    if (!form.title.trim()) return say("Title দিন", false);
    const slug = form.slug.trim() || slugify(form.title);
    if (new Date(form.ends_at) <= new Date(form.starts_at)) return say("End time, start time-এর পরে হতে হবে", false);

    const payload = {
      title: form.title.trim(), slug, subtitle: form.subtitle.trim() || null, emoji: form.emoji || "🔥", color: form.color,
      starts_at: new Date(form.starts_at).toISOString(), ends_at: new Date(form.ends_at).toISOString(),
      discount_percent: form.discount_percent ? Number(form.discount_percent) : null,
      is_active: form.is_active, sort_order: Number(form.sort_order || 0),
      products: rows.map((r) => ({ product_id: r.product_id, offer_price: r.offer_price ? Number(r.offer_price) : null })),
    };

    setSaving(true);
    try {
      const res = await adminFetch(form.id ? `/api/offers/${form.id}` : "/api/offers", {
        method: form.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Failed");
      say(form.id ? "Offer updated ✓" : "Offer created ✓");
      setOpen(false); load();
    } catch (e) { say((e as Error).message, false); }
    setSaving(false);
  }

  async function toggleActive(o: Offer) {
    await adminFetch(`/api/offers/${o.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: !o.is_active }) });
    load();
  }
  async function remove(o: Offer) {
    if (!confirm(`"${o.title}" delete করবেন?`)) return;
    const res = await adminFetch(`/api/offers/${o.id}`, { method: "DELETE" });
    say(res.ok ? "Deleted ✓" : "Delete হয়নি", res.ok); load();
  }

  const badge = (o: Offer) => {
    const st = offerStatus(o);
    if (!o.is_active) return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">OFF</span>;
    if (st === "live") return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">LIVE</span>;
    if (st === "upcoming") return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">UPCOMING</span>;
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">ENDED</span>;
  };
  const fmt = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  const input = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2"><Flame className="text-orange-500" size={22} /> Offers</h1>
          <p className="text-gray-400 text-sm mt-0.5">Time frame দিন — শুরু হলে shop-এ live, শেষ হলে নিজে থেকেই সরে যাবে।</p>
        </div>
        <button onClick={() => openNew()} className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl">
          <Plus size={15} /> New Offer
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <span className="text-xs text-gray-400 self-center">Quick start:</span>
        {PRESETS.map((p) => (
          <button key={p.slug} onClick={() => openNew(p)} className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:border-orange-300 hover:text-orange-600">
            {p.emoji} {p.title}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-orange-400" /></div>
        ) : offers.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">এখনো কোনো offer নেই — উপরের Quick start থেকে শুরু করুন।</div>
        ) : offers.map((o) => (
          <div key={o.id} className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: o.color + "22" }}>{o.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-gray-900 text-sm truncate">{o.title}</p>{badge(o)}
              </div>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1"><Clock size={11} />{fmt(o.starts_at)} → {fmt(o.ends_at)}</span>
                <span className="flex items-center gap-1"><Package size={11} />{o.product_count ?? 0} products</span>
              </p>
            </div>
            <button onClick={() => toggleActive(o)} title="On/Off"
              className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${o.is_active ? "bg-orange-500" : "bg-gray-200"}`}>
              <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${o.is_active ? "left-6" : "left-1"}`} />
            </button>
            <button onClick={() => openEdit(o)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"><Pencil size={15} /></button>
            <button onClick={() => remove(o)} className="p-2 rounded-lg text-red-500 hover:bg-red-50"><Trash2 size={15} /></button>
          </div>
        ))}
      </div>

      {/* ── Modal ── */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-extrabold text-gray-900">{form.id ? "Edit Offer" : "New Offer"}</h3>
              <button onClick={() => setOpen(false)} className="p-1 text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-500">Title</label>
                  <input className={input} value={form.title} placeholder="Black Friday Deal"
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: f.id ? f.slug : slugify(e.target.value) }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">Slug (URL)</label>
                  <input className={input} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">Subtitle</label>
                  <input className={input} value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">Start</label>
                  <input type="datetime-local" className={input} value={form.starts_at} onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">End</label>
                  <input type="datetime-local" className={input} value={form.ends_at} onChange={(e) => setForm((f) => ({ ...f, ends_at: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">Discount % (সব product-এ, optional)</label>
                  <input type="number" min={0} max={90} className={input} value={form.discount_percent} placeholder="যেমন 10"
                    onChange={(e) => setForm((f) => ({ ...f, discount_percent: e.target.value }))} />
                </div>
                <div className="flex gap-3">
                  <div className="w-20">
                    <label className="text-xs font-semibold text-gray-500">Emoji</label>
                    <input className={input} value={form.emoji} onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))} />
                  </div>
                  <div className="w-20">
                    <label className="text-xs font-semibold text-gray-500">Color</label>
                    <input type="color" className="w-full h-[38px] rounded-xl border border-gray-200 p-1" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} />
                  </div>
                  <div className="w-20">
                    <label className="text-xs font-semibold text-gray-500">Order</label>
                    <input type="number" className={input} value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))} />
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="accent-orange-500" />
                Active (বন্ধ করলে time frame থাকলেও shop-এ দেখাবে না)
              </label>

              {/* Products */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Products ({rows.length})</p>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className={input + " pl-9"} placeholder="Product খুঁজে add করুন…" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                {search.trim() && (
                  <div className="mt-1 border border-gray-100 rounded-xl overflow-hidden">
                    {results.length === 0 && <p className="text-xs text-gray-400 p-3">কিছু পাওয়া যায়নি</p>}
                    {results.map((p) => (
                      <button key={p.id} onClick={() => { setRows((r) => [...r, { product_id: p.id, offer_price: "" }]); setSearch(""); }}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-orange-50 text-left">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt="" className="w-8 h-8 object-contain" />
                        <span className="flex-1 text-sm text-gray-800 truncate">{p.name}</span>
                        <span className="text-xs text-gray-400">৳{Number(p.price).toLocaleString("en-BD")}</span>
                        <Plus size={14} className="text-orange-500" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-2 space-y-1.5 max-h-72 overflow-y-auto">
                  {rows.map((r, i) => {
                    const p = prodById.get(r.product_id);
                    return (
                      <div key={r.product_id} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {p && <img src={p.image} alt="" className="w-8 h-8 object-contain" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{p?.name ?? r.product_id}</p>
                          <p className="text-[11px] text-gray-400">Regular ৳{Number(p?.price ?? 0).toLocaleString("en-BD")}</p>
                        </div>
                        <input type="number" placeholder="Offer ৳" value={r.offer_price}
                          onChange={(e) => setRows((rs) => rs.map((x, j) => (j === i ? { ...x, offer_price: e.target.value } : x)))}
                          className="w-28 border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-orange-400" />
                        <button onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} className="p-1 text-gray-400 hover:text-red-500"><X size={15} /></button>
                      </div>
                    );
                  })}
                  {rows.length === 0 && <p className="text-xs text-gray-400 py-2">কোনো product add করা হয়নি। Offer price ফাঁকা রাখলে Discount % (বা regular price) ধরা হবে।</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
              <button onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={save} disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-60 flex items-center gap-2">
                {saving && <Loader2 size={14} className="animate-spin" />} Save Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-[60] px-4 py-3 rounded-xl text-sm font-semibold shadow-lg text-white ${toast.ok ? "bg-green-600" : "bg-red-500"}`}>{toast.msg}</div>
      )}
    </div>
  );
}
