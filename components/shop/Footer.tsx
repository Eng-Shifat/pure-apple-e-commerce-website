import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, Music } from "lucide-react";

const quickLinks = ["Home", "Shop", "Apple", "Samsung", "About", "Contact"];
const categories = ["Apple", "Samsung", "Google", "OnePlus", "Accessories"];
const customerService = [
  { label: "Help Center", href: "/help" },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "Track Order", href: "/track" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PA</span>
              </div>
              <span className="text-gray-900 font-bold text-lg">Pure Apple</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-5 max-w-[160px]">
              Better Tech, Brighter Tomorrow.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-gray-500 flex items-center justify-center transition-colors">
                <Facebook size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-pink-100 hover:text-pink-600 text-gray-500 flex items-center justify-center transition-colors">
                <Instagram size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-500 flex items-center justify-center transition-colors">
                <Youtube size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors">
                <Music size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase()}`}
                    className="text-gray-400 text-xs hover:text-blue-600 transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-gray-900 font-semibold text-sm mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/products?category=${cat.toLowerCase()}`}
                    className="text-gray-400 text-xs hover:text-blue-600 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-gray-900 font-semibold text-sm mb-4">Customer Service</h4>
            <ul className="space-y-2.5">
              {customerService.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-400 text-xs hover:text-blue-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="text-gray-900 font-semibold text-sm mb-4">Payment Methods</h4>
            <div className="flex flex-wrap gap-2">
              {/* Add your payment method logos */}
              {["visa", "mastercard", "paypal", "applepay"].map((pm) => (
                <div
                  key={pm}
                  className="relative w-10 h-6 rounded border border-gray-200 bg-gray-50 overflow-hidden"
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
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 mt-10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 text-xs">
            © 2025 Pure Apple. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-gray-400 text-xs hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 text-xs hover:text-blue-600 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
