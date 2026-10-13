import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Youtube, MapPin } from "lucide-react";

// TikTok SVG icon (lucide doesn't have one)
function TikTokIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.16 8.16 0 004.77 1.52V7.02a4.85 4.85 0 01-1-.33z"/>
    </svg>
  );
}

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
  { icon: <Facebook size={14} />, href: "https://www.facebook.com/share/1DvXTZtFFW/", label: "Facebook", hover: "hover:bg-[#1877F2]" },
  { icon: <Instagram size={14} />, href: "https://www.instagram.com/pureapplebd?srtk=cjhoM3c4MDFycWFy", label: "Instagram", hover: "hover:bg-gradient-to-tr hover:from-[#f09433] hover:to-[#bc1888]" },
  { icon: <Youtube size={14} />, href: "https://youtube.com/@pure_iphone?si=Y3a6X5KiD131F_95", label: "YouTube", hover: "hover:bg-[#FF0000]" },
  { icon: <TikTokIcon size={14} />, href: "https://tiktok.com/@pureapplebd", label: "TikTok", hover: "hover:bg-black" },
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

            {/* Shop Address */}
            <div className="mt-3 flex items-start gap-2">
              <MapPin size={13} className="text-brand-500 shrink-0 mt-0.5" />
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Jamuna Future Park, Level-4,<br />
                Block-B, Shop No: 4B-012B2,<br />
                Dhaka, Bangladesh
              </p>
            </div>
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
