// SAVE PATH: components/admin/OrderPaymentPanel.tsx
"use client";

// Admin: একটা order-এর payment যাচাই panel
// - customer-এর পাঠানো screenshot (proof), TrxID, sender number, advance / due হিসাব
// - Accept → order confirm (stock কমে, dashboard-এর সংখ্যা বদলায) | Reject → order cancel

import { useState } from "react";
import { Check, X, Loader2, ExternalLink, ZoomIn, ShieldCheck, ShieldX, Clock, Copy } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import PayLogo from "@/components/shop/PayLogo";
import { SHOP, walletNumber } from "@/lib/shopConfig";
import type { Order } from "@/types";

export const taka = (n?: number | null) => `৳${Math.round(Number(n) || 0).toLocaleString("en-BD")}`;

export function PaymentBadge({ status }: { status?: Order["payment_status"] }) {
  if (status === "pending_review")
    return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700"><Clock size={11} /> Review needed</span>;
  if (status === "rejected")
    return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600"><ShieldX size={11} /> Rejected</span>;
  return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700"><ShieldCheck size={11} /> Verified</span>;
}

export default function OrderPaymentPanel({
  order, onChanged, onToast,
}: {
  order: Order;
  onChanged: (updated?: Partial<Order>) => void;
  onToast?: (msg: string, ok: boolean) => void;
}) {
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [zoom, setZoom] = useState(false);
  const [copied, setCopied] = useState(false);

  const total   = Number(order.total) || 0;
  const advance = Number(order.advance_amount) || 0;
  const due     = Math.max(0, total - advance);
  const method  = order.advance_method;
  const review  = order.payment_status === "pending_review";

  async function act(action: "approve" | "reject") {
    setBusy(action);
    try {
      const res = await adminFetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Failed");
      onToast?.(action === "approve" ? "Payment accepted — order confirmed ✓" : "Payment rejected, order cancelled", true);
      setRejecting(false);
      onChanged(d.order);
    } catch (e) {
      onToast?.((e as Error).message, false);
    } finally { setBusy(null); }
  }

  const copy = async (t: string) => { try { await navigator.clipboard.writeText(t); setCopied(true); setTimeout(() => setCopied(false), 1200); } catch { /* */ } };

  return (
    <div className="grid md:grid-cols-[1fr_220px] gap-4">
      <div className="space-y-3 min-w-0">
        {/* Money */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { l: "Subtotal", v: taka(order.subtotal ?? total - (Number(order.delivery_charge) || 0)) },
            { l: `Delivery${order.delivery_area ? ` (${order.delivery_area === "dhaka" ? "Dhaka" : "Outside"})` : ""}`, v: taka(order.delivery_charge) },
            { l: "Total", v: taka(total), strong: true },
            { l: "Due on delivery", v: taka(due), strong: true },
          ].map((x) => (
            <div key={x.l} className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">{x.l}</p>
              <p className={`mt-0.5 tabular-nums ${x.strong ? "font-extrabold text-gray-900" : "font-bold text-gray-700"}`}>{x.v}</p>
            </div>
          ))}
        </div>

        {/* Advance proof */}
        <div className="rounded-xl border border-gray-100 p-3">
          <div className="flex items-center gap-3 flex-wrap">
            {method && <PayLogo type={method} size={34} />}
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Advance received via {method === "nagad" ? "Nagad" : "bKash"}</p>
              <p className="text-lg font-extrabold text-brand-600 tabular-nums leading-tight">{taka(advance)}</p>
            </div>
            <span className="ml-auto text-[11px] font-semibold text-gray-400 uppercase">{order.payment_method === "cod" ? "COD + advance" : "Paid online"}</span>
          </div>
          <dl className="mt-2.5 grid sm:grid-cols-3 gap-2 text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">TrxID</dt>
              <dd className="font-mono font-bold text-gray-900 flex items-center gap-1.5">
                {order.payment_trx_id || "—"}
                {order.payment_trx_id && <button type="button" onClick={() => copy(order.payment_trx_id!)} className="text-gray-300 hover:text-brand-500">{copied ? <Check size={13} /> : <Copy size={13} />}</button>}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Sender number</dt>
              <dd className="font-bold text-gray-900">{order.payment_sender || "—"}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Sent to (shop)</dt>
              <dd className="font-bold text-gray-900">{method ? walletNumber(method) : SHOP.bkashNumber}</dd>
            </div>
          </dl>
        </div>

        {order.payment_status === "rejected" && order.reject_reason && (
          <p className="text-xs rounded-lg bg-red-50 border border-red-100 text-red-700 px-3 py-2"><strong>Reject reason:</strong> {order.reject_reason}</p>
        )}

        {/* Actions */}
        {review && !rejecting && (
          <div className="flex gap-2 pt-1">
            <button disabled={!!busy} onClick={() => act("approve")}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold disabled:opacity-60 active:scale-95 transition">
              {busy === "approve" ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Accept payment
            </button>
            <button disabled={!!busy} onClick={() => setRejecting(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold disabled:opacity-60 active:scale-95 transition">
              <X size={15} /> Reject
            </button>
          </div>
        )}
        {review && rejecting && (
          <div className="rounded-xl border border-red-100 bg-red-50/60 p-3 space-y-2">
            <textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reject-এর কারণ (optional) — যেমন: TrxID মেলেনি"
              className="w-full border border-red-100 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-200 resize-none" />
            <div className="flex gap-2">
              <button disabled={!!busy} onClick={() => act("reject")} className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold disabled:opacity-60">
                {busy === "reject" && <Loader2 size={14} className="animate-spin" />} Confirm reject
              </button>
              <button onClick={() => setRejecting(false)} className="h-9 px-4 rounded-lg text-sm font-semibold text-gray-600 hover:bg-white">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Screenshot proof */}
      <div>
        <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">Payment screenshot (proof)</p>
        {order.payment_proof_url ? (
          <>
            <button type="button" onClick={() => setZoom(true)} className="group relative block w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={order.payment_proof_url} alt="Payment proof" className="w-full h-56 md:h-64 object-contain" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition">
                <ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-100 transition" />
              </span>
            </button>
            <a href={order.payment_proof_url} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-500 hover:underline">
              <ExternalLink size={12} /> Open full size
            </a>
          </>
        ) : (
          <div className="h-40 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400 text-center px-3">কোনো screenshot নেই (পুরনো order)</div>
        )}
      </div>

      {zoom && order.payment_proof_url && (
        <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4" onClick={() => setZoom(false)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 text-white flex items-center justify-center" aria-label="Close"><X size={20} /></button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={order.payment_proof_url} alt="Payment proof" className="max-h-full max-w-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
