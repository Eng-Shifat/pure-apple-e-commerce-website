// SAVE PATH: app/admin/orders/page.tsx
"use client";

// Admin → Orders
// Tab 1: Payment Review — customer-এর screenshot দেখে Accept / Reject
// Tab 2: All Orders     — accept হওয়া order (delivery status বদল করা যায়)

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, RefreshCw, ShieldCheck, ShoppingBag, MessageCircle, Phone, MapPin, Loader2, ChevronRight } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import OrderPaymentPanel, { PaymentBadge, taka } from "@/components/admin/OrderPaymentPanel";
import type { Order } from "@/types";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type FullOrder = Order & {
  order_items?: { quantity: number; price: number; product_name?: string | null; variant?: string | null; image?: string | null; product?: { name: string; image: string } | null }[];
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700", processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700",
};

const code = (id: string) => `#${id.slice(0, 8).toUpperCase()}`;
const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
const wa = (phone: string) => `https://wa.me/88${phone.replace(/\D/g, "").replace(/^88/, "")}`;
const itemName = (i: NonNullable<FullOrder["order_items"]>[number]) => i.product_name || i.product?.name || "Product";
const itemImg = (i: NonNullable<FullOrder["order_items"]>[number]) => {
  const s = i.image || i.product?.image || "";
  return /^(\/|https?:\/\/)/.test(s) ? s : "/logo/pure-apple-logo.png";
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<FullOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"review" | "all">("review");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const say = (msg: string, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 2600); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await adminFetch("/api/orders");
      const d = await r.json();
      setOrders(d.orders ?? []);
    } catch { say("Orders load করা যায়নি", false); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const review = useMemo(() => orders.filter((o) => o.payment_status === "pending_review"), [orders]);
  const confirmed = useMemo(() => orders.filter((o) => o.payment_status !== "pending_review"), [orders]);

  // নতুন order এলে tab নিজে থেকে review-তে না থাকলেও সংখ্যা দেখা যাবে
  const visible = confirmed.filter((o) => {
    const q = search.toLowerCase();
    const hit = !q || o.shipping_name?.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.shipping_phone?.includes(q)
      || o.order_items?.some((i) => itemName(i).toLowerCase().includes(q));
    return hit && (filter === "all" || o.status === filter);
  });

  async function changeStatus(id: string, status: OrderStatus) {
    const res = await adminFetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (res.ok) { setOrders((p) => p.map((o) => (o.id === id ? { ...o, status } : o))); say("Status updated ✓"); }
    else say((await res.json().catch(() => ({}))).error || "Failed", false);
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Orders</h1>
          <p className="text-gray-400 text-sm mt-0.5">{review.length} payment review বাকি · {confirmed.length} confirmed/closed</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="inline-flex p-1 rounded-xl bg-gray-100 mb-5">
        {([
          { k: "review" as const, label: "Payment Review", n: review.length, icon: ShieldCheck },
          { k: "all" as const,    label: "All Orders",     n: confirmed.length, icon: ShoppingBag },
        ]).map(({ k, label, n, icon: Icon }) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${tab === k ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            <Icon size={15} className={tab === k ? "text-orange-500" : ""} /> {label}
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${k === "review" && n > 0 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600"}`}>{n}</span>
          </button>
        ))}
      </div>

      {loading && orders.length === 0 && <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-orange-400" /></div>}

      {/* ── Payment Review ── */}
      {tab === "review" && !loading && (
        review.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
            <ShieldCheck size={36} className="mx-auto text-green-300 mb-2" />
            <p className="font-bold text-gray-700">সব payment যাচাই করা হয়ে গেছে</p>
            <p className="text-sm text-gray-400 mt-1">নতুন order এলে এখানে screenshot সহ দেখাবে।</p>
          </div>
        ) : (
          <div className="space-y-4">
            {review.map((o) => (
              <div key={o.id} className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 flex-wrap px-4 py-3 bg-gradient-to-r from-amber-50 to-white border-b border-amber-100">
                  <Link href={`/admin/orders/${o.id}`} className="font-mono text-sm font-extrabold text-gray-900 hover:text-orange-600">{code(o.id)}</Link>
                  <span className="text-xs text-gray-400">{when(o.created_at)}</span>
                  <PaymentBadge status={o.payment_status} />
                  <span className="ml-auto font-extrabold text-gray-900 tabular-nums">{taka(o.total)}</span>
                </div>

                <div className="p-4 space-y-4">
                  {/* Customer + items */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="text-sm space-y-1">
                      <p className="font-bold text-gray-900 text-base">{o.shipping_name}</p>
                      <p className="flex items-center gap-1.5 text-gray-600"><Phone size={13} className="text-gray-400" />{o.shipping_phone}
                        <a href={wa(o.shipping_phone)} target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex items-center gap-1 text-[11px] font-bold text-green-600 hover:underline"><MessageCircle size={12} /> WhatsApp</a>
                      </p>
                      <p className="flex items-start gap-1.5 text-gray-600"><MapPin size={13} className="text-gray-400 mt-1 shrink-0" /><span>{o.shipping_address}, {o.shipping_city}</span></p>
                      {o.note && <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1.5">📝 {o.note}</p>}
                    </div>
                    <div className="space-y-2">
                      {o.order_items?.map((i, idx) => (
                        <div key={idx} className="flex items-center gap-2.5">
                          <div className="relative w-10 h-10 rounded-lg bg-gray-50 overflow-hidden shrink-0"><Image src={itemImg(i)} alt="" fill sizes="40px" className="object-contain p-0.5" /></div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold text-gray-800 truncate">{itemName(i)}</p>
                            {i.variant && <p className="text-[10px] text-gray-400 truncate">{i.variant}</p>}
                          </div>
                          <span className="text-xs text-gray-500 tabular-nums">×{i.quantity}</span>
                          <span className="text-[13px] font-bold text-gray-900 tabular-nums">{taka(i.price * i.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <OrderPaymentPanel order={o} onToast={say} onChanged={() => load()} />
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── All Orders ── */}
      {tab === "all" && !loading && (
        <>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, phone, order id, product…"
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white" />
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value as OrderStatus | "all")}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300">
              <option value="all">All Status</option>
              {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Order", "Customer", "Items", "Total", "Advance", "Payment", "Status", "Date", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {visible.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/60">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{code(o.id)}</td>
                      <td className="px-4 py-3 whitespace-nowrap"><p className="font-semibold text-gray-900">{o.shipping_name}</p><p className="text-[11px] text-gray-400">{o.shipping_phone}</p></td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{o.order_items?.map((i) => `${itemName(i)} ×${i.quantity}`).join(", ")}</td>
                      <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap tabular-nums">{taka(o.total)}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-gray-600 whitespace-nowrap tabular-nums">{o.advance_amount ? `${taka(o.advance_amount)} · ${o.advance_method === "nagad" ? "Nagad" : "bKash"}` : "—"}</td>
                      <td className="px-4 py-3"><PaymentBadge status={o.payment_status} /></td>
                      <td className="px-4 py-3">
                        <select value={o.status} onChange={(e) => changeStatus(o.id, e.target.value as OrderStatus)}
                          className={`text-[11px] font-bold border-0 rounded-full px-2.5 py-1 capitalize cursor-pointer focus:outline-none ${STATUS_STYLE[o.status]}`}>
                          {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{when(o.created_at)}</td>
                      <td className="px-4 py-3"><Link href={`/admin/orders/${o.id}`} className="inline-flex items-center text-xs font-bold text-orange-500 hover:underline whitespace-nowrap">Details <ChevronRight size={13} /></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visible.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No orders found.</div>}
            </div>
          </div>
        </>
      )}

      {toast && <div className={`fixed bottom-6 right-6 z-[80] px-4 py-3 rounded-xl text-sm font-semibold shadow-lg text-white ${toast.ok ? "bg-green-600" : "bg-red-500"}`}>{toast.msg}</div>}
    </div>
  );
}
