"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Package, ShoppingBag, TrendingUp, Zap,
  ArrowUpRight, Clock, CheckCircle, Truck,
  Star, Flame, EyeOff, BarChart3,
  RefreshCw, AlertCircle, ChevronRight,
  ShoppingCart, Users, Activity,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Order {
  id: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_city: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_method: string;
  created_at: string;
  order_items?: { quantity: number; price: number; product?: { name: string; image: string } }[];
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  category: string;
  is_featured: boolean;
  is_hot_deal: boolean;
  is_published: boolean;
  badge?: string;
  badge_color?: string;
}

interface DashStats {
  totalProducts: number;
  publishedProducts: number;
  unpublishedProducts: number;
  popularCount: number;
  hotDealCount: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  pending:    { bg: "bg-yellow-50",  text: "text-yellow-700",  icon: <Clock size={11} />,        label: "Pending"    },
  processing: { bg: "bg-blue-50",    text: "text-blue-700",    icon: <Activity size={11} />,     label: "Processing" },
  shipped:    { bg: "bg-purple-50",  text: "text-purple-700",  icon: <Truck size={11} />,        label: "Shipped"    },
  delivered:  { bg: "bg-green-50",   text: "text-green-700",   icon: <CheckCircle size={11} />,  label: "Delivered"  },
  cancelled:  { bg: "bg-red-50",     text: "text-red-600",     icon: <AlertCircle size={11} />,  label: "Cancelled"  },
};

const PAYMENT_LABEL: Record<string, string> = {
  cod:    "💵 COD",
  bkash:  "📱 bKash",
  nagad:  "📱 Nagad",
  card:   "💳 Card",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function fmt(n: number) {
  if (n >= 10000000) return `৳${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `৳${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)     return `৳${(n / 1000).toFixed(0)}K`;
  return `৳${n.toLocaleString("en-BD")}`;
}

function safeImg(src: string) {
  if (!src || src.startsWith("file:")) return "/images/Phone/iphone/iPhone 16/iPhone_16.webp";
  return src;
}

// ─── Mini Stat Card ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color, href }: {
  icon: React.ReactNode; label: string; value: string | number;
  sub?: string; color: string; href?: string;
}) {
  const inner = (
    <div className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group ${href ? "cursor-pointer hover:border-orange-200" : ""}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        {icon}
      </div>
      <p className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none">{value}</p>
      <p className="text-xs font-semibold text-gray-500 mt-1">{label}</p>
      {sub && <p className="text-[11px] text-green-600 font-semibold mt-1.5">{sub}</p>}
      {href && (
        <div className="flex items-center gap-1 mt-2 text-[11px] text-orange-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          View <ChevronRight size={10} />
        </div>
      )}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

// ─── Order Status Badge ───────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${cfg.bg} ${cfg.text}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ─── Order Status Update ──────────────────────────────────────────────────────

function StatusSelect({ orderId, current, onUpdate }: {
  orderId: string; current: string; onUpdate: (id: string, status: string) => void;
}) {
  const [saving, setSaving] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) onUpdate(orderId, next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative">
      {saving && <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg z-10"><RefreshCw size={11} className="animate-spin text-orange-500" /></div>}
      <select value={current} onChange={handleChange}
        className="text-[11px] font-bold border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-orange-400 cursor-pointer capitalize appearance-none pr-5">
        {["pending","processing","shipped","delivered","cancelled"].map(s => (
          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
        ))}
      </select>
      <ChevronRight size={9} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [stats,    setStats]    = useState<DashStats | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, oRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders"),
      ]);
      const pData = await pRes.json();
      const oData = await oRes.json();

      const prods: Product[] = pData.products ?? [];
      const ords:  Order[]   = oData.orders   ?? [];

      setProducts(prods);
      setOrders(ords);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayOrders = ords.filter(o => new Date(o.created_at) >= today);
      const todayRev    = todayOrders.reduce((s, o) => s + (o.total ?? 0), 0);
      const totalRev    = ords.filter(o => o.status !== "cancelled").reduce((s, o) => s + (o.total ?? 0), 0);

      setStats({
        totalProducts:     prods.length,
        publishedProducts: prods.filter(p => p.is_published).length,
        unpublishedProducts: prods.filter(p => !p.is_published).length,
        popularCount:      prods.filter(p => p.is_featured).length,
        hotDealCount:      prods.filter(p => p.is_hot_deal).length,
        totalOrders:       ords.length,
        pendingOrders:     ords.filter(o => o.status === "pending").length,
        processingOrders:  ords.filter(o => o.status === "processing").length,
        shippedOrders:     ords.filter(o => o.status === "shipped").length,
        deliveredOrders:   ords.filter(o => o.status === "delivered").length,
        cancelledOrders:   ords.filter(o => o.status === "cancelled").length,
        totalRevenue:      totalRev,
        todayRevenue:      todayRev,
        lowStockCount:     prods.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 5).length,
        outOfStockCount:   prods.filter(p => (p.stock ?? 0) === 0).length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  function handleStatusUpdate(orderId: string, status: string) {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as Order["status"] } : o));
    if (stats) {
      setStats(prev => {
        if (!prev) return prev;
        const updated = { ...prev };
        const order = orders.find(o => o.id === orderId);
        if (order) {
          const old = order.status;
          const k = (s: string) => `${s}Orders` as keyof DashStats;
          (updated[k(old)] as number) = Math.max(0, (updated[k(old)] as number) - 1);
          (updated[k(status)] as number) = (updated[k(status)] as number) + 1;
        }
        return updated;
      });
    }
  }

  // Derived
  const recentOrders  = orders.slice(0, 6);
  const lowStockItems = products.filter(p => (p.stock ?? 0) <= 5).sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0)).slice(0, 5);
  const popularItems  = products.filter(p => p.is_featured).slice(0, 4);

  // Order status funnel
  const orderFunnel = [
    { label: "Pending",    count: stats?.pendingOrders    ?? 0, color: "bg-yellow-400", text: "text-yellow-700" },
    { label: "Processing", count: stats?.processingOrders ?? 0, color: "bg-blue-400",   text: "text-blue-700"   },
    { label: "Shipped",    count: stats?.shippedOrders    ?? 0, color: "bg-purple-400", text: "text-purple-700" },
    { label: "Delivered",  count: stats?.deliveredOrders  ?? 0, color: "bg-green-500",  text: "text-green-700"  },
    { label: "Cancelled",  count: stats?.cancelledOrders  ?? 0, color: "bg-red-400",    text: "text-red-600"    },
  ];
  const maxFunnel = Math.max(...orderFunnel.map(f => f.count), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-10 h-10 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
          <p className="text-sm font-medium">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">Real data from Supabase — live overview</p>
          </div>
          <button onClick={fetchAll}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-orange-300 hover:text-orange-500 transition-all shadow-sm">
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* ── Quick Actions ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Add Product",   href: "/admin/products/new", icon: <Package size={16} />,    bg: "bg-orange-500 hover:bg-orange-600 shadow-orange-200" },
            { label: "All Products",  href: "/admin/products",     icon: <ShoppingCart size={16} />,bg: "bg-gray-800 hover:bg-gray-900 shadow-gray-200" },
            { label: "All Orders",    href: "/admin/orders",       icon: <ShoppingBag size={16} />, bg: "bg-blue-600 hover:bg-blue-700 shadow-blue-200" },
            { label: "View Store",    href: "/",                   icon: <Zap size={16} />,         bg: "bg-green-600 hover:bg-green-700 shadow-green-200" },
          ].map(a => (
            <Link key={a.label} href={a.href}
              className={`flex items-center justify-center gap-2 h-11 ${a.bg} text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-md`}>
              {a.icon} {a.label}
            </Link>
          ))}
        </div>

        {/* ── Main Stats Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard href="/admin/products" icon={<Package size={18}/>}     label="Total Products"  value={stats?.totalProducts ?? 0}  color="bg-orange-50 text-orange-500"  />
          <StatCard href="/admin/products" icon={<Star size={18}/>}        label="Popular Items"   value={stats?.popularCount ?? 0}   color="bg-yellow-50 text-yellow-500"  sub="on homepage" />
          <StatCard href="/admin/products" icon={<Flame size={18}/>}       label="Hot Deals"       value={stats?.hotDealCount ?? 0}   color="bg-red-50 text-red-500"        sub="on homepage" />
          <StatCard href="/admin/products" icon={<EyeOff size={18}/>}      label="Unpublished"     value={stats?.unpublishedProducts ?? 0} color="bg-gray-100 text-gray-500" />
          <StatCard href="/admin/orders"   icon={<ShoppingBag size={18}/>} label="Total Orders"    value={stats?.totalOrders ?? 0}    color="bg-blue-50 text-blue-500"      />
          <StatCard                        icon={<TrendingUp size={18}/>}   label="Total Revenue"   value={fmt(stats?.totalRevenue ?? 0)} color="bg-green-50 text-green-500" sub={`Today: ${fmt(stats?.todayRevenue ?? 0)}`} />
        </div>

        {/* ── Order Status Funnel + Low Stock ── */}
        <div className="grid lg:grid-cols-2 gap-5">

          {/* Order Funnel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-orange-500" />
                <h2 className="font-bold text-gray-900 text-sm">Order Status Breakdown</h2>
              </div>
              <Link href="/admin/orders" className="text-xs text-orange-500 font-semibold hover:underline">
                Manage →
              </Link>
            </div>
            <div className="space-y-3">
              {orderFunnel.map(f => (
                <div key={f.label} className="flex items-center gap-3">
                  <span className={`text-[11px] font-bold w-20 shrink-0 ${f.text}`}>{f.label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${f.color}`}
                      style={{ width: `${(f.count / maxFunnel) * 100}%` }}
                    />
                  </div>
                  <span className={`text-sm font-extrabold w-6 text-right ${f.text}`}>{f.count}</span>
                </div>
              ))}
            </div>
            {/* Pending alert */}
            {(stats?.pendingOrders ?? 0) > 0 && (
              <div className="mt-4 flex items-center gap-2.5 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2.5">
                <AlertCircle size={14} className="text-yellow-600 shrink-0" />
                <p className="text-xs font-semibold text-yellow-700">
                  {stats?.pendingOrders} order{(stats?.pendingOrders ?? 0) > 1 ? "s" : ""} waiting for confirmation
                </p>
                <Link href="/admin/orders" className="ml-auto text-xs text-yellow-700 font-bold hover:underline shrink-0">
                  Act now →
                </Link>
              </div>
            )}
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-red-500" />
                <h2 className="font-bold text-gray-900 text-sm">Stock Alerts</h2>
              </div>
              <Link href="/admin/products" className="text-xs text-orange-500 font-semibold hover:underline">
                Update stock →
              </Link>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-300">
                <CheckCircle size={28} className="text-green-400 mb-2" />
                <p className="text-sm font-semibold text-gray-500">All products stocked!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {lowStockItems.map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 shrink-0 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={safeImg(p.image)} alt={p.name} className="w-full h-full object-contain p-1"
                        onError={e => { (e.target as HTMLImageElement).src = "/images/Phone/iphone/iPhone 16/iPhone_16.webp"; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-400 capitalize">{p.category}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      {(p.stock ?? 0) === 0 ? (
                        <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">Out of stock</span>
                      ) : (
                        <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                          Only {p.stock} left
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stock summary */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                <p className="text-xl font-extrabold text-red-500">{stats?.outOfStockCount ?? 0}</p>
                <p className="text-[10px] font-semibold text-red-400 mt-0.5">Out of Stock</p>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
                <p className="text-xl font-extrabold text-orange-500">{stats?.lowStockCount ?? 0}</p>
                <p className="text-[10px] font-semibold text-orange-400 mt-0.5">Low Stock (≤5)</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Recent Orders (real, with status update) ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-blue-500" />
              <h2 className="font-bold text-gray-900 text-sm">Recent Orders</h2>
              {(stats?.pendingOrders ?? 0) > 0 && (
                <span className="bg-yellow-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {stats?.pendingOrders} pending
                </span>
              )}
            </div>
            <Link href="/admin/orders" className="text-xs text-orange-500 font-semibold hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-300">
              <ShoppingBag size={32} className="mb-3" />
              <p className="text-sm font-semibold text-gray-400">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Order ID", "Customer", "Items", "Amount", "Payment", "Status", "Update Status", "Time"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o, idx) => (
                    <tr key={o.id} className={`border-b border-gray-50 hover:bg-orange-50/30 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                      <td className="px-4 py-3">
                        <Link href={`/admin/orders/${o.id}`} className="font-mono text-xs text-blue-500 hover:underline font-bold">
                          #{o.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900 whitespace-nowrap text-sm">{o.shipping_name}</p>
                        <p className="text-[10px] text-gray-400">{o.shipping_city} · {o.shipping_phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {o.order_items?.slice(0, 2).map((item, i) => (
                            <div key={i} className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={safeImg(item.product?.image ?? "")} alt="" className="w-full h-full object-contain p-0.5"
                                onError={e => { (e.target as HTMLImageElement).src = "/images/Phone/iphone/iPhone 16/iPhone_16.webp"; }} />
                            </div>
                          ))}
                          {(o.order_items?.length ?? 0) > 2 && (
                            <span className="text-[10px] text-gray-400 font-semibold">+{(o.order_items?.length ?? 0) - 2}</span>
                          )}
                          <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                            {o.order_items?.length ?? 0} item{(o.order_items?.length ?? 0) !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-extrabold text-gray-900 whitespace-nowrap">
                        ৳{(o.total ?? 0).toLocaleString("en-BD")}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {PAYMENT_LABEL[o.payment_method] ?? o.payment_method}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusSelect orderId={o.id} current={o.status} onUpdate={handleStatusUpdate} />
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{timeAgo(o.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Popular Products (from is_featured) ── */}
        {popularItems.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-orange-500 fill-orange-400" />
                <h2 className="font-bold text-gray-900 text-sm">Popular Products (Homepage)</h2>
              </div>
              <Link href="/admin/products" className="text-xs text-orange-500 font-semibold hover:underline">
                Manage →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {popularItems.map(p => (
                <div key={p.id} className="bg-gray-50 rounded-xl border border-gray-100 p-3 flex flex-col items-center gap-2 hover:border-orange-200 transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={safeImg(p.image)} alt={p.name} className="w-full h-full object-contain p-1"
                      onError={e => { (e.target as HTMLImageElement).src = "/images/Phone/iphone/iPhone 16/iPhone_16.webp"; }} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight">{p.name}</p>
                    <p className="text-[11px] font-extrabold text-orange-500 mt-0.5">৳{p.price.toLocaleString("en-BD")}</p>
                  </div>
                  {p.badge && (
                    <span className="text-[9px] font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: p.badge_color ?? "#FB5724" }}>
                      {p.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="flex items-center justify-between text-[11px] text-gray-300 pb-2">
          <span>Pure Apple Admin · Powered by Supabase</span>
          <span>Last updated: {new Date().toLocaleTimeString("en-BD")}</span>
        </div>

      </div>
    </div>
  );
}
