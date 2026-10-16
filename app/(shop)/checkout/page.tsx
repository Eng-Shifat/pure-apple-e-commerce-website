// SAVE PATH: app/(shop)/checkout/page.tsx
"use client";

/**
 * Checkout
 * - Delivery area: Dhaka ৳60 / Outside Dhaka ৳120 (auto total-এ যোগ)
 * - Order summary-তে quantity +/- (price live update)
 * - Rule: order confirm করতে minimum ৳2,500 advance (bKash / Nagad) + screenshot + TrxID
 *   baki taka Cash on Delivery-তে দেওয়া যাবে
 * - Order admin-এর "Payment Review"-তে যায়; admin accept করলে order confirm হয়
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2, ShieldCheck, Minus, Plus, Trash2, MapPin, Truck, Copy, Check,
  ImagePlus, X, Info, Lock, ChevronRight,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { supabase } from "@/lib/supabase";
import { validatePhone } from "@/lib/validations";
import {
  SHOP, DELIVERY, MIN_ADVANCE, deliveryCharge, minAdvanceFor, walletNumber,
  type DeliveryArea, type PayMethod, type Wallet,
} from "@/lib/shopConfig";
import PayLogo from "@/components/shop/PayLogo";

const taka = (n: number) => `৳${Math.round(n).toLocaleString("en-BD")}`;
const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-300 placeholder:text-gray-400";

// Screenshot-কে ছোট করে (max 1600px, JPEG) — mobile-এর বড় ছবি দ্রুত upload হবে
async function compressImage(file: File): Promise<File> {
  try {
    if (file.size < 600 * 1024) return file;
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    return blob ? new File([blob], "payment-proof.jpg", { type: "image/jpeg" }) : file;
  } catch { return file; }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, total, updateQty, removeItem, clearCart } = useCartStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "", note: "" });
  const [area, setArea] = useState<DeliveryArea | "">("");
  const [method, setMethod] = useState<PayMethod>("cod");
  const [wallet, setWallet] = useState<Wallet>("bkash"); // COD হলে advance কোন wallet-এ
  const [amount, setAmount] = useState<string>("");
  const [amountTouched, setAmountTouched] = useState(false);
  const [trx, setTrx] = useState("");
  const [sender, setSender] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const payRef = useRef<HTMLDivElement>(null);

  const activeWallet: Wallet = method === "cod" ? wallet : method;
  const number = walletNumber(activeWallet);

  const subtotal = total();
  const delivery = deliveryCharge(area);
  const grand = subtotal + delivery;
  const minAdv = minAdvanceFor(grand);
  const advance = Math.round(Number(amount) || 0);
  const due = Math.max(0, grand - advance);

  // Default advance: COD → minimum, bKash/Nagad → চাইলে full; user নিজে বদলালে আর overwrite হবে না
  useEffect(() => {
    if (amountTouched) return;
    setAmount(String(method === "cod" ? minAdv : grand));
  }, [method, minAdv, grand, amountTouched]);

  // Total কমে গেলে advance cap
  useEffect(() => {
    if (amountTouched && Number(amount) > grand && grand > 0) setAmount(String(grand));
  }, [grand]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (mounted && lines.length === 0) router.push("/cart"); }, [mounted, lines.length, router]);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const setField = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function pickArea(a: DeliveryArea) {
    setArea(a);
    if (a === "dhaka" && !form.city.trim()) setField("city", "Dhaka");
    if (a === "outside" && form.city.trim().toLowerCase() === "dhaka") setField("city", "");
    setErrors((e) => ({ ...e, area: "" }));
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { setErrors((er) => ({ ...er, proof: "JPG / PNG / WEBP screenshot দিন" })); return; }
    const small = await compressImage(f);
    if (preview) URL.revokeObjectURL(preview);
    setProof(small);
    setPreview(URL.createObjectURL(small));
    setErrors((er) => ({ ...er, proof: "" }));
  }

  async function copyNumber() {
    try { await navigator.clipboard.writeText(number); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* ignore */ }
  }

  function validate() {
    const er: Record<string, string> = {};
    if (!form.name.trim()) er.name = "নাম দিন";
    if (!validatePhone(form.phone)) er.phone = "সঠিক BD phone number দিন";
    if (!area) er.area = "Delivery area select করুন";
    if (!form.city.trim()) er.city = "City / District দিন";
    if (!form.address.trim()) er.address = "সম্পূর্ণ address দিন";
    if (advance < minAdv) er.amount = `Minimum ${taka(minAdv)} পাঠাতে হবে`;
    else if (advance > grand) er.amount = "Total-এর বেশি হতে পারে না";
    if (!/^[A-Za-z0-9]{6,20}$/.test(trx.trim())) er.trx = "সঠিক Transaction ID দিন (৬-২০ অক্ষর)";
    if (!validatePhone(sender)) er.sender = "যে নম্বর থেকে টাকা পাঠিয়েছেন সেটা দিন";
    if (!proof) er.proof = "Payment-এর screenshot দিন";
    return er;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) {
      const first = document.querySelector("[data-err='1']") as HTMLElement | null;
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const fd = new FormData();
      fd.append("payload", JSON.stringify({
        items: lines.map((l) => ({
          product_id: l.product.id, quantity: l.quantity, price: l.product.price,
          name: l.product.name, variant: l.product.variant, image: l.product.image,
        })),
        shipping_name: form.name, shipping_phone: form.phone, shipping_address: form.address,
        shipping_city: form.city, note: form.note,
        delivery_area: area, payment_method: method,
        advance_method: activeWallet, advance_amount: advance,
        payment_trx_id: trx.trim(), payment_sender: sender,
      }));
      fd.append("proof", proof!);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: sess.session?.access_token ? { Authorization: `Bearer ${sess.session.access_token}` } : undefined,
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { alert(data.error ?? "Order failed"); setLoading(false); return; }

      clearCart();
      router.push(`/checkout/success?order_id=${data.order.id}&advance=${advance}&total=${grand}`);
    } catch {
      alert("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setLoading(false);
    }
  }

  const errCls = (k: string) => (errors[k] ? "!border-red-300 !ring-red-100" : "");
  const Err = ({ k }: { k: string }) => errors[k] ? <p data-err="1" className="text-xs text-red-500 mt-1">{errors[k]}</p> : null;

  const quickAmounts = useMemo(() => {
    const list = [{ label: `Advance ${taka(minAdv)}`, v: minAdv }];
    if (grand > minAdv) list.push({ label: `Full ${taka(grand)}`, v: grand });
    return list;
  }, [minAdv, grand]);

  if (!mounted || lines.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-28 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-5">Checkout</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid lg:grid-cols-[1fr_390px] gap-4 lg:gap-6 items-start">

            {/* ═══ 1. Shipping ═══ */}
            <section className="lg:col-start-1 bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><MapPin size={17} className="text-brand-500" /> Shipping Information</h2>
              <div className="grid sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                  <input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Your full name" className={`${inputCls} ${errCls("name")}`} />
                  <Err k="name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number *</label>
                  <input inputMode="tel" value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="01XXXXXXXXX" className={`${inputCls} ${errCls("phone")}`} />
                  <Err k="phone" />
                </div>

                {/* Delivery area */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Delivery Area *</label>
                  <div className={`grid grid-cols-2 gap-2 ${errors.area ? "rounded-xl ring-2 ring-red-100" : ""}`}>
                    {([
                      { v: "dhaka" as const,    label: "Inside Dhaka",  price: DELIVERY.dhaka },
                      { v: "outside" as const,  label: "Outside Dhaka", price: DELIVERY.outside },
                    ]).map((o) => {
                      const on = area === o.v;
                      return (
                        <button key={o.v} type="button" onClick={() => pickArea(o.v)}
                          className={`relative text-left rounded-xl border-2 px-3 py-2 transition-all active:scale-[.98] ${on ? "border-brand-500 bg-brand-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                          <span className={`block text-[12px] font-bold leading-tight ${on ? "text-brand-600" : "text-gray-700"}`}>{o.label}</span>
                          <span className={`block text-[11px] font-semibold mt-0.5 ${on ? "text-brand-500" : "text-gray-400"}`}>{taka(o.price)}</span>
                          {on && <Check size={13} className="absolute top-1.5 right-1.5 text-brand-500" />}
                        </button>
                      );
                    })}
                  </div>
                  <Err k="area" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{area === "outside" ? "District *" : "City *"}</label>
                  <input value={form.city} onChange={(e) => setField("city", e.target.value)} placeholder={area === "outside" ? "e.g. Chattogram" : "Dhaka"} className={`${inputCls} ${errCls("city")}`} />
                  <Err k="city" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Address *</label>
                  <textarea rows={2} value={form.address} onChange={(e) => setField("address", e.target.value)} placeholder="House, Road, Area" className={`${inputCls} resize-none ${errCls("address")}`} />
                  <Err k="address" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Order Note</label>
                  <textarea rows={2} value={form.note} onChange={(e) => setField("note", e.target.value)} placeholder="Any special instructions…" className={`${inputCls} resize-none`} />
                </div>
              </div>
            </section>

            {/* ═══ 2. Order summary (quantity +/-) ═══ */}
            <aside className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24 bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-3">Order Summary <span className="text-gray-400 font-normal text-sm">({lines.reduce((s, l) => s + l.quantity, 0)} items)</span></h2>

              <div className="divide-y divide-gray-50">
                {lines.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3 py-3 first:pt-0">
                    <div className="relative w-14 h-14 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                      <Image src={/^(\/|https?:\/\/)/.test(product.image) ? product.image : "/logo/pure-apple-logo.png"} alt={product.name} fill sizes="56px" className="object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-gray-800 line-clamp-1">{product.name}</p>
                      {product.variant && <p className="text-[10px] text-gray-400 line-clamp-1">{product.variant}</p>}
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="inline-flex items-center rounded-full border border-gray-200 bg-white">
                          <button type="button" aria-label="Decrease" disabled={quantity <= 1}
                            onClick={() => updateQty(product.id, quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-brand-600 disabled:opacity-30 active:scale-90 transition"><Minus size={13} /></button>
                          <span className="w-7 text-center text-[13px] font-bold text-gray-900 tabular-nums">{quantity}</span>
                          <button type="button" aria-label="Increase" disabled={quantity >= 10}
                            onClick={() => updateQty(product.id, quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-brand-600 disabled:opacity-30 active:scale-90 transition"><Plus size={13} /></button>
                        </div>
                        <button type="button" aria-label="Remove" onClick={() => removeItem(product.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <span className="text-[13px] font-extrabold text-gray-900 shrink-0 tabular-nums">{taka(product.price * quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-3 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold tabular-nums">{taka(subtotal)}</span></div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1.5"><Truck size={14} className="text-gray-400" />Delivery{area && <span className="text-[11px] text-gray-400">({area === "dhaka" ? "Inside Dhaka" : "Outside Dhaka"})</span>}</span>
                  {area ? <span className="font-semibold tabular-nums">{taka(delivery)}</span> : <span className="text-xs text-gray-400">Area select করুন</span>}
                </div>
                <div className="flex justify-between font-extrabold text-gray-900 text-base border-t border-gray-100 pt-2.5">
                  <span>Total</span><span className="tabular-nums">{taka(grand)}</span>
                </div>
              </div>

              {/* Pay now / Due */}
              <div className="mt-3 rounded-xl bg-gray-50 border border-gray-100 p-3 space-y-1.5 text-[13px]">
                <div className="flex justify-between"><span className="text-gray-500">Advance (এখন দিচ্ছেন)</span><span className="font-bold text-brand-600 tabular-nums">{taka(advance)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Delivery-র সময় দেবেন</span><span className="font-bold text-gray-900 tabular-nums">{taka(due)}</span></div>
              </div>
            </aside>

            {/* ═══ 3. Payment ═══ */}
            <section ref={payRef} className="lg:col-start-1 bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><ShieldCheck size={17} className="text-leaf-600" /> Payment Method</h2>

              {/* Store rule */}
              <div className="flex gap-2.5 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-3.5 py-3 mb-4">
                <Lock size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[12px] leading-relaxed text-amber-900">
                  <strong>Security advance:</strong> Order confirm করতে অবশ্যই কমপক্ষে <strong>{taka(MIN_ADVANCE)}</strong> আগে পাঠাতে হবে (দোকানের নিয়ম)।
                  বাকি টাকা <strong>Cash on Delivery</strong>-তে দিলেও সমস্যা নেই।
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {([
                  { v: "cod" as const,   label: "Cash on Delivery" },
                  { v: "bkash" as const, label: "bKash" },
                  { v: "nagad" as const, label: "Nagad" },
                ]).map(({ v, label }) => {
                  const on = method === v;
                  return (
                    <button key={v} type="button" onClick={() => { setMethod(v); setAmountTouched(false); }}
                      className={`relative flex flex-col items-center justify-center gap-1.5 py-3 px-1 rounded-xl border-2 text-[11px] font-bold transition-all active:scale-[.97] ${on ? "border-brand-500 bg-brand-50 text-brand-600 shadow-sm" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      <PayLogo type={v} size={38} />
                      <span className="leading-tight text-center">{label}</span>
                      {on && <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={3} /></span>}
                    </button>
                  );
                })}
              </div>

              {/* COD explanation */}
              {method === "cod" && (
                <div className="mt-3 rounded-xl bg-green-50 border border-green-100 px-3.5 py-3 text-[12px] leading-relaxed text-green-900">
                  <p className="font-bold flex items-center gap-1.5 mb-0.5"><Info size={13} /> Cash on Delivery কীভাবে কাজ করে</p>
                  <p>Order confirm করতে আগে <strong>{taka(minAdv)}</strong> bKash বা Nagad-এ পাঠান। বাকি <strong>{taka(Math.max(0, grand - minAdv))}</strong> product হাতে পেয়ে delivery-র সময় cash দেবেন।</p>
                </div>
              )}

              {/* Wallet chooser (COD only) */}
              {method === "cod" && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-600 mb-1.5">Advance কোথায় পাঠাবেন?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(["bkash", "nagad"] as const).map((w) => (
                      <button key={w} type="button" onClick={() => setWallet(w)}
                        className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 transition-all ${wallet === w ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-gray-300"}`}>
                        <PayLogo type={w} size={26} />
                        <span className={`text-[13px] font-bold ${wallet === w ? "text-brand-600" : "text-gray-700"}`}>{w === "bkash" ? "bKash" : "Nagad"}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Send-money card */}
              <div className={`mt-4 rounded-2xl p-4 text-white relative overflow-hidden ${activeWallet === "bkash" ? "bg-gradient-to-br from-pink-600 to-rose-500" : "bg-gradient-to-br from-orange-500 to-amber-500"}`}>
                <div aria-hidden className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
                <div className="relative flex items-center gap-3">
                  <div className="bg-white rounded-xl p-1.5 shrink-0"><PayLogo type={activeWallet} size={34} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-white/80 uppercase tracking-wider">{activeWallet === "bkash" ? "bKash" : "Nagad"} {SHOP.walletType} · Send Money</p>
                    <p className="text-xl font-black tracking-wide tabular-nums">{number}</p>
                  </div>
                  <button type="button" onClick={copyNumber}
                    className="shrink-0 inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 active:scale-95 transition rounded-full px-3 py-1.5 text-xs font-bold">
                    {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                  </button>
                </div>
                <ol className="relative mt-3 text-[11.5px] text-white/90 space-y-0.5 list-decimal list-inside">
                  <li>উপরের নম্বরে <strong>{taka(advance >= minAdv ? advance : minAdv)}</strong> Send Money করুন</li>
                  <li>Transaction ID ও sender number নিচে লিখুন</li>
                  <li>Payment-এর screenshot upload করুন</li>
                </ol>
              </div>

              {/* Amount */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1">কত টাকা পাঠিয়েছেন? * <span className="font-normal text-gray-400">(min {taka(minAdv)} – max {taka(grand)})</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                  <input inputMode="numeric" value={amount}
                    onChange={(e) => { setAmountTouched(true); setAmount(e.target.value.replace(/\D/g, "")); }}
                    className={`${inputCls} pl-9 font-bold ${errCls("amount")}`} />
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {quickAmounts.map((q) => (
                    <button key={q.label} type="button" onClick={() => { setAmountTouched(true); setAmount(String(q.v)); }}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition ${advance === q.v ? "bg-brand-500 border-brand-500 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-brand-300"}`}>
                      {q.label}
                    </button>
                  ))}
                </div>
                <Err k="amount" />
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Transaction ID (TrxID) *</label>
                  <input value={trx} onChange={(e) => setTrx(e.target.value.toUpperCase())} placeholder="e.g. 9K3L2M8XQ1" autoCapitalize="characters" className={`${inputCls} font-mono ${errCls("trx")}`} />
                  <Err k="trx" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">যে নম্বর থেকে পাঠিয়েছেন *</label>
                  <input inputMode="tel" value={sender} onChange={(e) => setSender(e.target.value)} placeholder="01XXXXXXXXX" className={`${inputCls} ${errCls("sender")}`} />
                  <Err k="sender" />
                </div>
              </div>

              {/* Screenshot */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Payment Screenshot *</label>
                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={onFile} className="hidden" />
                {preview ? (
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Payment screenshot" className="h-40 w-auto max-w-full rounded-xl border border-gray-200 object-contain bg-gray-50" />
                    <button type="button" aria-label="Remove screenshot" onClick={() => { setProof(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center shadow"><X size={13} /></button>
                    <button type="button" onClick={() => fileRef.current?.click()} className="block mt-1.5 text-xs font-semibold text-brand-500 hover:underline">ছবি বদলান</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className={`w-full flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed py-6 transition ${errors.proof ? "border-red-300 bg-red-50/40" : "border-gray-200 bg-gray-50 hover:border-brand-300 hover:bg-brand-50/40"}`}>
                    <ImagePlus size={24} className="text-brand-500" />
                    <span className="text-sm font-bold text-gray-700">Screenshot upload করুন</span>
                    <span className="text-[11px] text-gray-400">JPG, PNG বা WEBP</span>
                  </button>
                )}
                <Err k="proof" />
              </div>

              <button type="submit" disabled={loading}
                className="mt-5 flex items-center justify-center gap-2 w-full h-12 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-bold rounded-xl transition-all active:scale-[.98] shadow-md shadow-brand-500/25">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                {loading ? "Order পাঠানো হচ্ছে…" : `Place Order · ${taka(grand)}`}
              </button>
              <p className="text-[11px] text-gray-400 text-center mt-2">
                Payment যাচাই হলেই আপনার order confirm হবে। সমস্যা হলে <Link href={`https://wa.me/${SHOP.whatsappNumber}`} target="_blank" className="text-green-600 font-semibold inline-flex items-center">WhatsApp করুন <ChevronRight size={11} /></Link>
              </p>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
}
