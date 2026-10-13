import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, ArrowRight } from "lucide-react";

// TikTok SVG icon
function TikTokIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.16 8.16 0 004.77 1.52V7.02a4.85 4.85 0 01-1-.33z" />
    </svg>
  );
}

const quickLinks = [
  { label: "Home",       href: "/" },
  { label: "Shop",       href: "/products" },
  { label: "Apple",      href: "/products?category=apple" },
  { label: "Samsung",    href: "/products?category=samsung" },
  { label: "Deals",      href: "/deals" },
  { label: "About",      href: "/about" },
  { label: "Contact",    href: "/contact" },
];

const categories = [
  { label: "iPhone",       href: "/category/iphone" },
  { label: "Android",      href: "/category/android" },
  { label: "Chargers",     href: "/category/charger" },
  { label: "Earbuds",      href: "/category/earbuds" },
  { label: "Power Banks",  href: "/category/powerbank" },
  { label: "Accessories",  href: "/category/accessories" },
];

const socialLinks = [
  {
    icon: <Facebook size={15} />,
    href: "https://www.facebook.com/share/1DvXTZtFFW/",
    label: "Facebook",
    bg: "hover:bg-[#1877F2]",
  },
  {
    icon: <Instagram size={15} />,
    href: "https://www.instagram.com/pureapplebd",
    label: "Instagram",
    bg: "hover:bg-gradient-to-tr hover:from-[#f09433] hover:to-[#bc1888]",
  },
  {
    icon: <Youtube size={15} />,
    href: "https://youtube.com/@pure_iphone",
    label: "YouTube",
    bg: "hover:bg-[#FF0000]",
  },
  {
    icon: <TikTokIcon size={15} />,
    href: "https://tiktok.com/@pureapplebd",
    label: "TikTok",
    bg: "hover:bg-[#010101]",
  },
];

export default function Footer() {
  return (
    <footer className="bg-dark-hero text-white">

      {/* ── Newsletter Banner ─────────────────────────────────── */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-white font-bold text-base">
                অফার মিস করতে চান না? 🔥
              </p>
              <p className="text-gray-400 text-xs mt-0.5">
                সাবস্ক্রাইব করুন — exclusive deals সবার আগে পাবেন।
              </p>
            </div>
            <div className="flex w-full sm:w-auto gap-2">
              <input
                type="email"
                placeholder="আপনার email লিখুন..."
                className="flex-1 sm:w-64 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FB5724]/60 transition-colors"
              />
              <button className="shrink-0 bg-[#FB5724] hover:bg-[#e84e1f] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-[0_4px_14px_rgba(251,87,36,0.4)] flex items-center gap-1.5">
                Subscribe <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Grid ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-10 pb-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">

          {/* ── Brand Column ── */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5 group w-fit">
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

            <p className="text-gray-400 text-xs leading-relaxed mb-5 max-w-[210px]">
              Better Tech, Brighter Tomorrow. Your trusted source for premium
              smartphones &amp; gadgets.
            </p>

            {/* Contact info */}
            <div className="space-y-2 mb-5">
              <a
                href="tel:+8801XXXXXXXXX"
                className="flex items-center gap-2 text-gray-400 text-[11px] hover:text-[#FB5724] transition-colors group/c"
              >
                <span className="w-6 h-6 rounded-lg bg-white/8 flex items-center justify-center group-hover/c:bg-[#FB5724]/20 transition-colors">
                  <Phone size={11} className="text-[#FB5724]" />
                </span>
                +880 1XXX-XXXXXX
              </a>
              <a
                href="mailto:info@pureapple.com.bd"
                className="flex items-center gap-2 text-gray-400 text-[11px] hover:text-[#FB5724] transition-colors group/m"
              >
                <span className="w-6 h-6 rounded-lg bg-white/8 flex items-center justify-center group-hover/m:bg-[#FB5724]/20 transition-colors">
                  <Mail size={11} className="text-[#FB5724]" />
                </span>
                info@pureapple.com.bd
              </a>
              <div className="flex items-start gap-2 text-gray-400 text-[11px]">
                <span className="w-6 h-6 rounded-lg bg-white/8 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={11} className="text-[#FB5724]" />
                </span>
                <span className="leading-relaxed">
                  Jamuna Future Park, Level-4,<br />
                  Block-B, Shop No: 4B-012B2,<br />
                  Dhaka, Bangladesh
                </span>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`w-8 h-8 rounded-xl bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 ${s.bg}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-[#FB5724] inline-block" />
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-xs hover:text-[#FB5724] transition-colors flex items-center gap-1.5 group/l"
                  >
                    <ArrowRight
                      size={10}
                      className="opacity-0 -translate-x-1 group-hover/l:opacity-100 group-hover/l:translate-x-0 transition-all duration-200 text-[#FB5724]"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Categories ── */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-[#FB5724] inline-block" />
              Categories
            </h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    href={cat.href}
                    className="text-gray-400 text-xs hover:text-[#FB5724] transition-colors flex items-center gap-1.5 group/c"
                  >
                    <ArrowRight
                      size={10}
                      className="opacity-0 -translate-x-1 group-hover/c:opacity-100 group-hover/c:translate-x-0 transition-all duration-200 text-[#FB5724]"
                    />
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Opening Hours ── */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-[#FB5724] inline-block" />
              Store Hours
            </h4>
            <ul className="space-y-2">
              {[
                { day: "শনি – বৃহস্পতি", time: "10:00 – 21:00" },
                { day: "শুক্রবার",        time: "14:00 – 21:00" },
                { day: "সরকারি ছুটি",    time: "বন্ধ" },
              ].map((row) => (
                <li key={row.day} className="flex items-center justify-between gap-4">
                  <span className="text-gray-400 text-[11px]">{row.day}</span>
                  <span
                    className={`text-[11px] font-semibold ${
                      row.time === "বন্ধ" ? "text-red-400" : "text-[#FB5724]"
                    }`}
                  >
                    {row.time}
                  </span>
                </li>
              ))}
            </ul>

            {/* Trust badges */}
            <div className="mt-6 space-y-2">
              {[
                { emoji: "🔒", text: "Secure Payment" },
                { emoji: "🚚", text: "Fast Delivery" },
                { emoji: "↩️", text: "Easy Returns" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2">
                  <span className="text-sm">{b.emoji}</span>
                  <span className="text-gray-400 text-[11px]">{b.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Bottom Bar ─────────────────────────────────────── */}
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-[11px]">
            © 2026 Pure Apple. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="/privacy"
              className="text-gray-500 text-[11px] hover:text-[#FB5724] transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-white/10">|</span>
            <Link
              href="/terms"
              className="text-gray-500 text-[11px] hover:text-[#FB5724] transition-colors"
            >
              Terms &amp; Conditions
            </Link>
          </div>

          <p className="text-gray-600 text-[10px]">
            Developed by{" "}
            <span className="text-[#FB5724] font-bold tracking-wide">FDIT</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
