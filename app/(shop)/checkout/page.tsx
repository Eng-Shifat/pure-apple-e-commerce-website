"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { validateCheckout } from "@/lib/validations";
import { Loader2, CheckCircle, CreditCard, Smartphone, HandCoins } from "lucide-react";

type PaymentMethod = "cod" | "bkash" | "nagad";

export default function CheckoutPage() {
  const router  = useRouter();
  const { lines, total, clearCart } = useCartStore();
  const [form,   setForm]   = useState({ name: "", phone: "", address: "", city: "", note: "" });
  const [method, setMethod] = useState<PaymentMethod>("cod");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function setField(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateCheckout(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map(l => ({ product_id: l.product.id, quantity: l.quantity, price: l.product.price })),
          shipping_name: form.name,
          shipping_phone: form.phone,
          shipping_address: form.address,
          shipping_city: form.city,
          payment_method: method,
          note: form.note,
        }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error ?? "Order failed"); setLoading(false); return; }

      clearCart();
      router.push(`/checkout/success?order_id=${data.order.id}`);
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (lines.length === 0) {
      router.push("/cart");
    }
  }, [lines.length, router]);

  if (lines.length === 0) return null;

  const subtotal = total();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-[1fr_380px] gap-6">

            {/* Left */}
            <div className="space-y-4">

              {/* Shipping */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-bold text-gray-900 mb-4">Shipping Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { key: "name",    label: "Full Name *",    placeholder: "Your full name",             col: 2 },
                    { key: "phone",   label: "Phone Number *", placeholder: "01XXXXXXXXX",               col: 1 },
                    { key: "city",    label: "City *",         placeholder: "Dhaka",                     col: 1 },
                    { key: "address", label: "Full Address *", placeholder: "House, Road, Area",         col: 2 },
                    { key: "note",    label: "Order Note",     placeholder: "Any special instructions…", col: 2 },
                  ].map(({ key, label, placeholder, col }) => (
                    <div key={key} className={col === 2 ? "sm:col-span-2" : ""}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                      {key === "address" || key === "note" ? (
                        <textarea rows={2} value={form[key as keyof typeof form]}
                          onChange={e => setField(key, e.target.value)} placeholder={placeholder}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none" />
                      ) : (
                        <input value={form[key as keyof typeof form]}
                          onChange={e => setField(key, e.target.value)} placeholder={placeholder}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                      )}
                      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-bold text-gray-900 mb-4">Payment Method</h2>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { value: "cod",   label: "Cash on Delivery", icon: HandCoins,  color: "text-green-600"  },
                    { value: "bkash", label: "bKash",            icon: Smartphone, color: "text-pink-600"   },
                    { value: "nagad", label: "Nagad",            icon: CreditCard, color: "text-orange-600" },
                  ] as const).map(({ value, label, icon: Icon, color }) => (
                    <button key={value} type="button" onClick={() => setMethod(value)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-xs font-semibold transition-all
                        ${method === value ? "border-brand-500 bg-brand-50 text-brand-600" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      <Icon size={22} className={method === value ? "text-brand-500" : color} />
                      {label}
                    </button>
                  ))}
                </div>
                {method === "cod" && (
                  <p className="text-xs text-gray-400 mt-3 bg-gray-50 rounded-lg px-3 py-2">
                    💡 Pay in cash when your order is delivered. No advance payment needed.
                  </p>
                )}
              </div>
            </div>

            {/* Right — Order summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 h-fit sticky top-24">
              <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {lines.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                      <Image src={product.image} alt={product.name} fill className="object-contain p-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-400">×{quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-900 shrink-0">৳{(product.price * quantity).toLocaleString("en-BD")}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold">৳{subtotal.toLocaleString("en-BD")}</span></div>
                <div className="flex justify-between text-gray-600"><span>Delivery</span><span className="text-green-600 font-semibold">Free</span></div>
                <div className="flex justify-between font-extrabold text-gray-900 text-base border-t border-gray-100 pt-2">
                  <span>Total</span><span>৳{subtotal.toLocaleString("en-BD")}</span>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="mt-5 flex items-center justify-center gap-2 w-full h-12 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-bold rounded-xl transition-all active:scale-95 shadow-sm hover:shadow-md">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                {loading ? "Placing Order…" : "Place Order"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
