// SAVE PATH: app/(shop)/checkout/success/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, ShieldCheck } from "lucide-react";
import { SHOP } from "@/lib/shopConfig";

const taka = (n: number) => `৳${Math.round(n).toLocaleString("en-BD")}`;

function SuccessContent() {
  const params  = useSearchParams();
  const orderId = params.get("order_id");
  const advance = Number(params.get("advance") || 0);
  const total   = Number(params.get("total") || 0);
  const due     = Math.max(0, total - advance);
  const code    = orderId ? `#${orderId.slice(0, 8).toUpperCase()}` : "";

  const waText = encodeURIComponent(`Hi Pure Apple! আমি order ${code} করেছি। Payment verify হয়েছে কিনা জানতে চাই।`);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={42} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1.5">Order Received!</h1>
        <p className="text-gray-500 text-sm">আপনার order ও payment screenshot আমরা পেয়েছি।</p>
        {code && <p className="text-xs text-gray-400 font-mono mt-1.5 mb-5">Order ID: {code}</p>}

        {total > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 grid grid-cols-3 divide-x divide-gray-100 text-center">
            <div><p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Total</p><p className="font-extrabold text-gray-900 mt-0.5">{taka(total)}</p></div>
            <div><p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Advance</p><p className="font-extrabold text-brand-600 mt-0.5">{taka(advance)}</p></div>
            <div><p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Due on delivery</p><p className="font-extrabold text-gray-900 mt-0.5">{taka(due)}</p></div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-left space-y-3.5 mb-5">
          {[
            { icon: <ShieldCheck size={18} className="text-amber-500" />, title: "Payment যাচাই চলছে", desc: "আমাদের টিম আপনার screenshot ও TrxID মিলিয়ে দেখবে। যাচাই হলেই order confirm হবে।" },
            { icon: <span className="text-lg leading-none">📞</span>,    title: "আমরা কল করব",       desc: "Dispatch-এর আগে আমাদের টিম আপনার সাথে যোগাযোগ করবে।" },
            { icon: <span className="text-lg leading-none">🚚</span>,    title: "Delivery",           desc: "Confirm হওয়ার পর ২–৫ কর্মদিবসের মধ্যে পৌঁছে যাবে।" },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="w-7 flex justify-center mt-0.5">{icon}</span>
              <div>
                <p className="text-sm font-bold text-gray-800">{title}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a href={`https://wa.me/${SHOP.whatsappNumber}?text=${waText}`} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 h-11 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm rounded-xl transition-all active:scale-95 shadow-sm">
            WhatsApp-এ কথা বলুন
          </a>
          {orderId && (
            <Link href="/orders"
              className="flex-1 flex items-center justify-center gap-2 h-11 border-2 border-brand-200 text-brand-500 font-semibold text-sm rounded-xl hover:bg-brand-50 transition-colors">
              <Package size={16} /> My Orders
            </Link>
          )}
        </div>
        <Link href="/products" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-brand-500">
          Continue Shopping <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
