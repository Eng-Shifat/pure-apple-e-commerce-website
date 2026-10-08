"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import {
  Package, ShoppingBag, TrendingUp, Users,
  ArrowUpRight, Clock, CheckCircle, Truck,
} from "lucide-react";

const DEMO_ORDERS = [
  { id:"ORD-001", customer:"Rahim Ahmed",   product:"iPhone 16 Pro",      amount:119999, status:"delivered",  date:"2 hours ago" },
  { id:"ORD-002", customer:"Fatema Begum",  product:"Samsung Galaxy S24", amount:99999,  status:"processing", date:"5 hours ago" },
  { id:"ORD-003", customer:"Karim Hossain", product:"OnePlus 12",         amount:89999,  status:"shipped",    date:"1 day ago"   },
  { id:"ORD-004", customer:"Nadia Islam",   product:"Google Pixel 9",     amount:79999,  status:"pending",    date:"1 day ago"   },
  { id:"ORD-005", customer:"Tanvir Khan",   product:"iPhone 17 Pro Max",  amount:154999, status:"delivered",  date:"2 days ago"  },
];

const STATUS_STYLE: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped:    "bg-purple-100 text-purple-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};
const STATUS_ICON: Record<string, React.ReactNode> = {
  pending:    <Clock size={11} />,
  processing: <ArrowUpRight size={11} />,
  shipped:    <Truck size={11} />,
  delivered:  <CheckCircle size={11} />,
};

export default function AdminDashboard() {
  const cartCount = useCartStore(s => s.count());

  const stats = [
    { label:"Total Products", value:"47",       icon: Package,    color:"bg-orange-50 text-orange-600",  trend:"+3 this week" },
    { label:"Total Orders",   value:"128",       icon: ShoppingBag,color:"bg-blue-50 text-blue-600",     trend:"+12 today"    },
    { label:"Revenue",        value:"৳12.4L",   icon: TrendingUp, color:"bg-green-50 text-green-600",   trend:"+8% vs last month" },
    { label:"Active Carts",   value:String(cartCount || 3), icon: Users, color:"bg-purple-50 text-purple-600", trend:"Live" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-0.5">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {stats.map(({ label, value, icon: Icon, color, trend }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{value}</p>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">{label}</p>
            <p className="text-[10px] text-green-600 mt-1.5 font-medium">{trend}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-3 mb-7">
        {[
          { label:"Add New Product", href:"/admin/products/new", color:"bg-orange-500 hover:bg-orange-600" },
          { label:"View All Orders", href:"/admin/orders",       color:"bg-gray-800 hover:bg-gray-900"    },
          { label:"View Store",      href:"/",                   color:"bg-green-600 hover:bg-green-700"  },
        ].map(({ label, href, color }) => (
          <Link key={label} href={href}
            className={`flex items-center justify-center gap-2 h-11 ${color} text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-sm`}>
            {label} <ArrowUpRight size={15} />
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-orange-500 font-semibold hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Order ID","Customer","Product","Amount","Status","Time"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {DEMO_ORDERS.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{o.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{o.customer}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{o.product}</td>
                  <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">৳{o.amount.toLocaleString("en-BD")}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[o.status]}`}>
                      {STATUS_ICON[o.status]}{o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
