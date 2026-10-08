"use client";

import { useState } from "react";
import { Clock, CheckCircle, Truck, ArrowUpRight, X, Search } from "lucide-react";

const DEMO_ORDERS = [
  { id:"ORD-001", customer:"Rahim Ahmed",     phone:"01712345678", product:"iPhone 16 Pro",       amount:119999, status:"delivered",  date:"08 Oct 2026", method:"COD"   },
  { id:"ORD-002", customer:"Fatema Begum",    phone:"01812345678", product:"Samsung Galaxy S24",  amount:99999,  status:"processing", date:"08 Oct 2026", method:"bKash" },
  { id:"ORD-003", customer:"Karim Hossain",   phone:"01912345678", product:"OnePlus 12",          amount:89999,  status:"shipped",    date:"07 Oct 2026", method:"COD"   },
  { id:"ORD-004", customer:"Nadia Islam",     phone:"01611345678", product:"Google Pixel 9",      amount:79999,  status:"pending",    date:"07 Oct 2026", method:"Nagad" },
  { id:"ORD-005", customer:"Tanvir Khan",     phone:"01511345678", product:"iPhone 17 Pro Max",   amount:154999, status:"delivered",  date:"06 Oct 2026", method:"COD"   },
  { id:"ORD-006", customer:"Salma Khatun",    phone:"01755345678", product:"iPhone 16",           amount:94999,  status:"cancelled",  date:"06 Oct 2026", method:"bKash" },
  { id:"ORD-007", customer:"Rafiqul Islam",   phone:"01855345678", product:"Samsung Galaxy A55",  amount:54999,  status:"delivered",  date:"05 Oct 2026", method:"COD"   },
  { id:"ORD-008", customer:"Mitu Akter",      phone:"01955345678", product:"OnePlus Nord 4",      amount:44999,  status:"processing", date:"05 Oct 2026", method:"bKash" },
];

const STATUS_STYLE: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped:    "bg-purple-100 text-purple-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

type OrderStatus = "pending"|"processing"|"shipped"|"delivered"|"cancelled";

export default function AdminOrdersPage() {
  const [orders, setOrders]   = useState(DEMO_ORDERS);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState<OrderStatus|"all">("all");

  function changeStatus(id: string, status: OrderStatus) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }

  const visible = orders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || o.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Orders</h1>
          <p className="text-gray-400 text-sm mt-0.5">{orders.length} total orders</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search orders…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value as OrderStatus|"all")}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Order","Customer","Product","Amount","Method","Status","Date","Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {visible.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{o.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="font-semibold text-gray-900">{o.customer}</p>
                    <p className="text-[11px] text-gray-400">{o.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{o.product}</td>
                  <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">৳{o.amount.toLocaleString("en-BD")}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-gray-500">{o.method}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{o.date}</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={e => changeStatus(o.id, e.target.value as OrderStatus)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-orange-300 cursor-pointer">
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
