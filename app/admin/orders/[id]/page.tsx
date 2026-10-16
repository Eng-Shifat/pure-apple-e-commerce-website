// SAVE PATH: app/admin/orders/[id]/page.tsx
"use client";

// Admin → Order detail (customer, items, payment proof, status)

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Loader2, Phone, MapPin, MessageCircle } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import OrderPaymentPanel, { PaymentBadge, taka } from "@/components/admin/OrderPaymentPanel";
import type { Order } from "@/types";

type Item = { quantity: number; price: number; product_name?: string | null; variant?: string | null; image?: string | null; product?: { name: string; image: string } | null };
type FullOrder = Order & { order_items?: Item[] };

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<FullOrder | null | undefined>(undefined);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const say = (msg: string, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 2600); };

  const load = useCallback(async () => {
    const r = await adminFetch(`/api/orders/${id}`);
    const d = await r.json().catch(() => ({}));
    setOrder(r.ok ? d.order : null);
  }, [id]);
  useEffect(() => { load(); }, [load]);

  async function changeStatus(status: string) {
    const res = await adminFetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (res.ok) { say("Status updated ✓"); load(); } else say((await res.json().catch(() => ({}))).error || "Failed", false);
  }

  if (order === undefined) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-orange-400" /></div>;
  if (order === null) return <div className="p-10 text-center text-gray-500">Order পাওয়া যায়নি। <Link href="/admin/orders" className="text-orange-500 font-semibold">← Orders</Link></div>;

  const img = (i: Item) => { const s = i.image || i.product?.image || ""; return /^(\/|https?:\/\/)/.test(s) ? s : "/logo/pure-apple-logo.png"; };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4">
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800"><ChevronLeft size={16} /> Orders</Link>

      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl font-extrabold text-gray-900 font-mono">#{order.id.slice(0, 8).toUpperCase()}</h1>
        <PaymentBadge status={order.payment_status} />
        <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString("en-GB")}</span>
        <select value={order.status} onChange={(e) => changeStatus(e.target.value)} disabled={order.payment_status === "pending_review"}
          className="ml-auto text-sm font-bold border border-gray-200 rounded-xl px-3 py-2 bg-white capitalize disabled:opacity-50">
          {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-1.5 text-sm">
          <h2 className="font-bold text-gray-900 mb-1">Customer</h2>
          <p className="font-bold text-gray-900 text-base">{order.shipping_name}</p>
          <p className="flex items-center gap-1.5 text-gray-600"><Phone size={13} className="text-gray-400" />{order.shipping_phone}
            <a href={`https://wa.me/88${order.shipping_phone.replace(/\D/g, "").replace(/^88/, "")}`} target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex items-center gap-1 text-[11px] font-bold text-green-600"><MessageCircle size={12} /> WhatsApp</a>
          </p>
          <p className="flex items-start gap-1.5 text-gray-600"><MapPin size={13} className="text-gray-400 mt-1 shrink-0" />{order.shipping_address}, {order.shipping_city}</p>
          {order.note && <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1.5">📝 {order.note}</p>}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2.5">
          <h2 className="font-bold text-gray-900">Items</h2>
          {order.order_items?.map((i, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <div className="relative w-11 h-11 rounded-lg bg-gray-50 overflow-hidden shrink-0"><Image src={img(i)} alt="" fill sizes="44px" className="object-contain p-0.5" /></div>
              <div className="min-w-0 flex-1"><p className="text-[13px] font-semibold text-gray-800 truncate">{i.product_name || i.product?.name || "Product"}</p>{i.variant && <p className="text-[10px] text-gray-400 truncate">{i.variant}</p>}</div>
              <span className="text-xs text-gray-500">×{i.quantity}</span>
              <span className="text-[13px] font-bold tabular-nums">{taka(i.price * i.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <h2 className="font-bold text-gray-900 mb-3">Payment</h2>
        <OrderPaymentPanel order={order} onToast={say} onChanged={load} />
      </div>

      {toast && <div className={`fixed bottom-6 right-6 z-[80] px-4 py-3 rounded-xl text-sm font-semibold shadow-lg text-white ${toast.ok ? "bg-green-600" : "bg-red-500"}`}>{toast.msg}</div>}
    </div>
  );
}
