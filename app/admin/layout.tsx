export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar placeholder */}
        <aside className="w-64 min-h-screen bg-white border-r border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Pure Apple</h2>
          <nav className="space-y-2">
            <a href="/admin" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-600">Dashboard</a>
            <a href="/admin/products" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-600">Products</a>
            <a href="/admin/orders" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-600">Orders</a>
            <a href="/admin/inventory" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-600">Inventory</a>
          </nav>
        </aside>
        {/* Main content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
