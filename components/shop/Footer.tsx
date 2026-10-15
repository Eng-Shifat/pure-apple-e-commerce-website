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


      {/* ── Main Grid ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-10 pb-0">
        {/* Mobile layout:
              Row 1 (col-span-2): Logo + description — full width
              Row 2: col1=contact+social, col2=Store Hours (naturally aligned)
              Row 3: Quick Links + Categories
            Desktop: 4 columns side by side */}

        {/* Row 1 mobile: Logo + description full width */}
        <div className="lg:hidden mb-4">
          <Link href="/" className="flex items-center gap-3 mb-4 group w-fit">
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
          <p className="text-gray-400 text-xs leading-relaxed">
            Better Tech, Brighter Tomorrow. Your trusted source for premium
            smartphones &amp; gadgets.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 pb-10 border-b border-white/10">

          {/* ── Brand Column — hidden on mobile (split above), visible desktop ── */}
          <div className="col-span-1 order-1 lg:order-1">
            {/* Desktop only: logo + description */}
            <div className="hidden lg:block">
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
            </div>

            {/* Contact info — mobile & desktop */}
            <div className="space-y-2 mb-5">
              <a
                href="tel:+8801804660238"
                className="flex items-center gap-2 text-gray-400 text-[11px] hover:text-[#FB5724] transition-colors group/c"
              >
                <span className="w-6 h-6 rounded-lg bg-white/8 flex items-center justify-center group-hover/c:bg-[#FB5724]/20 transition-colors">
                  <Phone size={11} className="text-[#FB5724]" />
                </span>
                +880 1804-660238
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

          {/* ── Quick Links — mobile: col 1 row 2, desktop: col 2 ── */}
          <div className="order-3 lg:order-2">
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

          {/* ── Categories — mobile: col 2 row 2, desktop: col 3 ── */}
          <div className="order-4 lg:order-3">
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

          {/* ── Opening Hours — mobile: col 2 row 1 (next to Brand), desktop: col 4 ── */}
          <div className="col-span-1 order-2 lg:order-4">
            {/* Mobile: Store Hours heading aligned with phone number row */}
            <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2 lg:pt-0">
              <span className="w-1 h-4 rounded-full bg-[#FB5724] inline-block" />
              Store Hours
            </h4>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 space-y-2">
              {[
                { day: "শনি – মঙ্গল", time: "10:00 – 21:00" },
                { day: "বুধবার",       time: "বন্ধ" },
                { day: "বৃহস্পতি",     time: "10:00 – 21:00" },
                { day: "শুক্রবার",     time: "14:00 – 21:00" },
              ].map((row) => (
                <div key={row.day} className="flex items-center justify-between gap-2">
                  <span className="text-gray-400 text-[10px] leading-tight">{row.day}</span>
                  <span className={`text-[10px] font-bold tabular-nums whitespace-nowrap ${row.time === "বন্ধ" ? "text-red-400" : "text-[#FB5724]"}`}>
                    {row.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Bottom Bar ─────────────────────────────────────── */}
        <div className="py-5 flex flex-col items-center gap-3 text-center">
          {/* Links row */}
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-gray-500 text-[11px] hover:text-[#FB5724] transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="w-px h-3 bg-white/15 inline-block" />
            <Link
              href="/terms"
              className="text-gray-500 text-[11px] hover:text-[#FB5724] transition-colors"
            >
              Terms &amp; Conditions
            </Link>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/5" />

          {/* Copyright + credit */}
          <p className="text-gray-600 text-[10px]">
            © 2026 Pure Apple. All rights reserved. | Developed by{" "}
            <span className="text-[#FB5724] font-bold tracking-wide">FDIT</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
