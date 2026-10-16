// SAVE PATH: app/(shop)/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Package, Download, Loader2 } from "lucide-react";
import { downloadInvoice } from "@/lib/invoice";
import type { Order } from "@/types";

type OrderItemRow = { quantity: number; price: number; product_name?: string | null; variant?: string | null; product?: { name: string } | null };
type FullOrder = Order & { order_items?: OrderItemRow[] };

const STATUS_STYLES: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped:    "bg-purple-100 text-purple-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const user = useAuth(s => s.user);
  const authLoading = !useAuth(s => s._hasHydrated);
  const [orders,  setOrders]  = useState<FullOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }

    supabase.auth.getSession().then(({ data }) => {
      const token = data.session?.access_token ?? "";
      fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => setOrders(d.orders ?? []))
        .catch(() => {})
        .finally(() => setLoading(false));
    });
  }, [user, authLoading]);

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-brand-500" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-20 text-center">
      <Package size={48} className="text-gray-200 mb-4" />
      <h2 className="text-xl font-bold text-gray-700 mb-2">Please sign in</h2>
      <p className="text-gray-400 text-sm mb-6">Log in to view your order history.</p>
      <Link href="/login" className="inline-flex items-center gap-2 bg-brand-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-600 transition-all">Sign In</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400">No orders yet.</p>
            <Link href="/products" className="mt-4 inline-block text-brand-500 font-semibold hover:underline">Start Shopping →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-xs text-gray-400 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString("en-BD", { dateStyle: "medium" })}</p>
                  </div>
                  {order.payment_status === "pending_review" ? (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">Payment under review</span>
                  ) : order.payment_status === "rejected" ? (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600">Payment rejected</span>
                  ) : (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <div>
                    <p className="text-xs text-gray-400">{order.order_items?.reduce((n, i) => n + i.quantity, 0) ?? 0} item(s) · {order.payment_method?.toUpperCase()}</p>
                    <p className="font-extrabold text-gray-900 mt-0.5">৳{order.total?.toLocaleString("en-BD")}</p>
                  </div>
                  <button type="button"
                    onClick={() => downloadInvoice({
                      orderId: order.id, createdAt: order.created_at,
                      customer: { name: order.shipping_name, phone: order.shipping_phone, address: order.shipping_address, city: order.shipping_city },
                      items: (order.order_items ?? []).map((i) => ({ name: i.product_name || i.product?.name || "Product", variant: i.variant, quantity: i.quantity, price: i.price })),
                      subtotal: order.subtotal ?? order.total - (order.delivery_charge ?? 0), deliveryCharge: order.delivery_charge ?? 0, deliveryArea: order.delivery_area ?? null,
                      total: order.total, advanceAmount: order.advance_amount ?? 0, paymentMethod: order.payment_method,
                      advanceMethod: order.advance_method ?? null, trxId: order.payment_trx_id ?? null, note: order.note ?? null, paymentStatus: order.payment_status ?? null,
                    })}
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 text-gray-700 hover:border-brand-300 hover:text-brand-500 transition-colors">
                    <Download size={13} /> Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
