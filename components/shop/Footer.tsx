import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

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

const socialLinks = [
  { icon: <Facebook size={14} />, href: "#", label: "Facebook", hover: "hover:bg-brand-500" },
  { icon: <Instagram size={14} />, href: "#", label: "Instagram", hover: "hover:bg-brand-500" },
  { icon: <Youtube size={14} />, href: "#", label: "Youtube", hover: "hover:bg-brand-500" },
];

export default function Footer() {
  return (
    <footer className="bg-dark-hero text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-0">

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 pb-8 border-b border-white/10">

          {/* ── Brand ── */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <Image
                src="/logo/pure-apple-logo.svg"
                alt="Pure Apple"
                width={64}
                height={65}
                className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <span className="block border-l border-white/15 pl-3 text-[9px] font-medium tracking-widest text-gray-400 uppercase leading-tight">
                Mobile &amp;<br />Gadget Shop
              </span>
            </Link>

            {/* Social icons */}
            <div className="flex gap-2 mb-4">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className={`w-8 h-8 rounded-full bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200 ${s.hover}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            <p className="text-gray-400 text-xs leading-relaxed max-w-[200px]">
              Better Tech, Brighter Tomorrow. Your trusted source for premium
              smartphones &amp; gadgets.
            </p>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-1.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-xs hover:text-sun-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Categories ── */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 tracking-wide">
              Categories
            </h4>
            <ul className="space-y-1.5">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/products?category=${cat.toLowerCase()}`}
                    className="text-gray-400 text-xs hover:text-sun-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="py-4 flex flex-col items-center gap-1.5 border-t border-white/5">
          <p className="text-gray-500 text-[11px]">
            © 2026 Pure Apple. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="/privacy"
              className="text-gray-500 text-[11px] hover:text-sun-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-white/10 text-xs">|</span>
            <Link
              href="/terms"
              className="text-gray-500 text-[11px] hover:text-sun-400 transition-colors"
            >
              Terms &amp; Conditions
            </Link>
          </div>

          <p className="text-gray-600 text-[10px]">
            Developed by{" "}
            <span className="text-sun-400 font-semibold tracking-wide">
              FDIT
            </span>
          </p>
        </div>

      </div>
    </footer>
  );
}
