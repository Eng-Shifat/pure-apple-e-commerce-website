"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  const params  = useSearchParams();
  const orderId = params.get("order_id");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={42} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-400 text-sm mb-1">Thank you for shopping with Pure Apple.</p>
        {orderId && <p className="text-xs text-gray-300 font-mono mb-6">Order ID: #{orderId.slice(0, 8).toUpperCase()}</p>}

        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-left space-y-3 mb-6">
          {[
            { icon: "📦", title: "Order Confirmed",  desc: "We have received your order and it is being processed." },
            { icon: "🚚", title: "Delivery",          desc: "Your order will be delivered within 2–5 business days." },
            { icon: "📞", title: "We'll Call You",    desc: "Our team will contact you to confirm the order before dispatch." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="text-xl mt-0.5">{icon}</span>
              <div>
                <p className="text-sm font-bold text-gray-800">{title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {orderId && (
            <Link href={`/orders`}
              className="flex-1 flex items-center justify-center gap-2 h-11 border-2 border-brand-200 text-brand-500 font-semibold text-sm rounded-xl hover:bg-brand-50 transition-colors">
              <Package size={16} /> Track Order
            </Link>
          )}
          <Link href="/products"
            className="flex-1 flex items-center justify-center gap-2 h-11 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm rounded-xl transition-all active:scale-95 shadow-sm">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
