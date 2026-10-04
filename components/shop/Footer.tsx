import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Music } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Apple", href: "/products?category=apple" },
  { label: "Samsung", href: "/products?category=samsung" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const categories = [
  "Apple",
  "Samsung",
  "Google",
  "OnePlus",
  "Accessories",
];

const customerService = [
  { label: "Help Center", href: "/help" },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "Track Order", href: "/track" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10">

          {/* ── Brand ── */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-3 mb-5 group"
            >
              <Image
                src="/logo/pure-apple-logo.svg"
                alt="Pure Apple"
                width={64}
                height={65}
                className="h-16 w-auto transition-transform duration-300 group-hover:scale-105"
              />

              <span className="block border-l border-white/15 pl-3 text-[9px] font-medium tracking-widest text-gray-400 uppercase leading-tight">
                Mobile &amp;<br />Gadget Shop
              </span>
            </Link>

            <p className="text-gray-400 text-xs leading-relaxed mb-5 max-w-[180px]">
              Better Tech, Brighter Tomorrow. Your trusted source for premium
              smartphones &amp; gadgets.
            </p>

            <div className="flex gap-2.5">
              {[
                {
                  icon: <Facebook size={14} />,
                  hover: "hover:bg-blue-600",
                },
                {
                  icon: <Instagram size={14} />,
                  hover: "hover:bg-pink-600",
                },
                {
                  icon: <Youtube size={14} />,
                  hover: "hover:bg-red-600",
                },
                {
                  icon: <Music size={14} />,
                  hover: "hover:bg-gray-600",
                },
              ].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  className={`w-8 h-8 rounded-full bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200 ${s.hover}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">
              Quick Links
            </h4>

            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-xs hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Categories ── */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">
              Categories
            </h4>

            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/products?category=${cat.toLowerCase()}`}
                    className="text-gray-400 text-xs hover:text-orange-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Customer Service ── */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">
              Customer Service
            </h4>

            <ul className="space-y-2.5">
              {customerService.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-400 text-xs hover:text-orange-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Payment & Contact ── */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">
              Payment Methods
            </h4>

            <div className="flex flex-wrap gap-2 mb-6">
              {["visa", "mastercard", "paypal", "applepay"].map((pm) => (
                <div
                  key={pm}
                  className="relative w-10 h-6 rounded border border-white/10 bg-white/5 overflow-hidden"
                >
                  <Image
                    src={`/images/payment/${pm}.png`}
                    alt={pm}
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-gray-400 leading-relaxed">
                📍 Narayanganj, Dhaka, Bangladesh
                <br />
                📞 +880 1XXX-XXXXXX
                <br />
                ✉️ info@pureapple.com.bd
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">
            © 2025 Pure Apple. All rights reserved.
          </p>

          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-gray-500 text-xs hover:text-orange-400 transition-colors"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-gray-500 text-xs hover:text-orange-400 transition-colors"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}