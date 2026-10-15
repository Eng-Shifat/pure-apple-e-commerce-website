import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Youtube, ArrowRight } from "lucide-react";

// TikTok SVG icon
function TikTokIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.16 8.16 0 004.77 1.52V7.02a4.85 4.85 0 01-1-.33z" />
    </svg>
  );
}

const quickLinks = [
  { label: "Home",    href: "/" },
  { label: "Shop",    href: "/products" },
  { label: "Apple",   href: "/products?category=apple" },
  { label: "Samsung", href: "/products?category=samsung" },
  { label: "Deals",   href: "/deals" },
  { label: "About",   href: "/about" },
  { label: "Contact", href: "/contact" },
];

const categories = [
  { label: "iPhone",      href: "/category/iphone" },
  { label: "Android",     href: "/category/android" },
  { label: "Chargers",    href: "/category/charger" },
  { label: "Earbuds",     href: "/category/earbuds" },
  { label: "Power Banks", href: "/category/powerbank" },
  { label: "Accessories", href: "/category/accessories" },
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

      {/* ── Main content ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 pb-0">

        {/* ════════════════════════════════════════════════════════
            MOBILE layout  (lg:hidden)
            Row 1: Logo + description — full width
            Row 2: Contact + Store Hours side by side
            No Quick Links / Categories on mobile
            ════════════════════════════════════════════════════════ */}
        <div className="lg:hidden">

          {/* Row 1 — Logo + tagline */}
          <div className="flex items-center gap-3 mb-2">
            <Link href="/" className="group flex items-center gap-3 w-fit">
              <Image
                src="/logo/pure-apple-logo.svg"
                alt="Pure Apple"
                width={48}
                height={48}
                className="h-11 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <span className="block border-l border-white/15 pl-3 text-[9px] font-medium tracking-widest text-gray-400 uppercase leading-tight">
                Mobile &amp;<br />Gadget Shop
              </span>
            </Link>
          </div>
          <p className="text-gray-400 text-[11px] leading-relaxed mb-3">
            Better Tech, Brighter Tomorrow. Your trusted source for premium smartphones &amp; gadgets.
          </p>

          {/* Row 2 — Contact + Store Hours */}
          <div className="grid grid-cols-2 gap-x-3 mb-3">

            {/* Contact */}
            <div className="space-y-2">
              {/* Phone */}
              <a href="tel:+8801804660238"
                className="flex items-center gap-2 text-gray-400 text-[11px] hover:text-[#FB5724] transition-colors group/c">
                {/* orange filter = invert+sepia+saturate converts black PNG → #FB5724 */}
                <span className="w-6 h-6 rounded-md bg-[#FB5724]/15 flex items-center justify-center shrink-0 group-hover/c:bg-[#FB5724]/25 transition-colors">
                  <Image
                    src="/icon/telephone.png" alt="Phone" width={13} height={13}
                    className="object-contain"
                    style={{ filter: "invert(45%) sepia(90%) saturate(600%) hue-rotate(345deg) brightness(105%)" }}
                  />
                </span>
                <span className="leading-tight">+880 1804-660238</span>
              </a>

              {/* Email */}
              <a href="mailto:info@pureapple.com.bd"
                className="flex items-center gap-2 text-gray-400 text-[11px] hover:text-[#FB5724] transition-colors group/m">
                <span className="w-6 h-6 rounded-md bg-[#FB5724]/15 flex items-center justify-center shrink-0 group-hover/m:bg-[#FB5724]/25 transition-colors">
                  <Image
                    src="/icon/email.png" alt="Email" width={13} height={13}
                    className="object-contain"
                    style={{ filter: "invert(45%) sepia(90%) saturate(600%) hue-rotate(345deg) brightness(105%)" }}
                  />
                </span>
                <span className="break-all leading-tight">info@pureapple.com.bd</span>
              </a>

              {/* Address */}
              <div className="flex gap-2 text-gray-400 text-[11px]">
                <span className="w-6 h-6 rounded-md bg-[#FB5724]/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Image
                    src="/icon/location.png" alt="Location" width={13} height={13}
                    className="object-contain"
                    style={{ filter: "invert(45%) sepia(90%) saturate(600%) hue-rotate(345deg) brightness(105%)" }}
                  />
                </span>
                <span className="leading-relaxed">
                  Jamuna Future Park,<br />
                  Level-4, Block-B,<br />
                  Shop No: 4B-012B2,<br />
                  Dhaka, Bangladesh
                </span>
              </div>
            </div>

            {/* Store Hours */}
            <div>
              <h4 className="text-white font-bold text-[12px] mb-1.5 flex items-center gap-1.5">
                <span className="w-1 h-3.5 rounded-full bg-[#FB5724] inline-block" />
                Store Hours
              </h4>
              <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-2 space-y-1.5">
                {[
                  { day: "শনি – মঙ্গল", time: "10:00–21:00" },
                  { day: "বুধবার",       time: "বন্ধ" },
                  { day: "বৃহস্পতি",     time: "10:00–21:00" },
                  { day: "শুক্রবার",     time: "14:00–21:00" },
                ].map((row) => (
                  <div key={row.day} className="flex items-center justify-between gap-1">
                    <span className="text-gray-400 text-[9.5px] leading-tight whitespace-nowrap">{row.day}</span>
                    <span className={`text-[9.5px] font-bold tabular-nums whitespace-nowrap ${row.time === "বন্ধ" ? "text-red-400" : "text-[#FB5724]"}`}>
                      {row.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex gap-2 mb-4">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className={`w-7 h-7 rounded-xl bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 ${s.bg}`}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            DESKTOP layout  (hidden on mobile, lg:grid)
            4 columns: Brand+Contact | Quick Links | Categories | Hours
            ════════════════════════════════════════════════════════ */}
        <div className="hidden lg:grid grid-cols-4 gap-x-8 gap-y-8 pb-10 border-b border-white/10">

          {/* Col 1 — Brand + contact */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-5 group w-fit">
              <Image src="/logo/pure-apple-logo.svg" alt="Pure Apple" width={64} height={65}
                className="h-14 w-auto transition-transform duration-300 group-hover:scale-105" />
              <span className="block border-l border-white/15 pl-3 text-[9px] font-medium tracking-widest text-gray-400 uppercase leading-tight">
                Mobile &amp;<br />Gadget Shop
              </span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed mb-5 max-w-[210px]">
              Better Tech, Brighter Tomorrow. Your trusted source for premium smartphones &amp; gadgets.
            </p>

            <div className="space-y-2.5 mb-5">
              <a href="tel:+8801804660238"
                className="flex items-center gap-2 text-gray-400 text-[11px] hover:text-[#FB5724] transition-colors group/c">
                <span className="w-6 h-6 rounded-lg bg-[#FB5724]/15 flex items-center justify-center shrink-0 group-hover/c:bg-[#FB5724]/25 transition-colors">
                  <Image src="/icon/telephone.png" alt="Phone" width={13} height={13} className="object-contain"
                    style={{ filter: "invert(45%) sepia(90%) saturate(600%) hue-rotate(345deg) brightness(105%)" }} />
                </span>
                +880 1804-660238
              </a>
              <a href="mailto:info@pureapple.com.bd"
                className="flex items-center gap-2 text-gray-400 text-[11px] hover:text-[#FB5724] transition-colors group/m">
                <span className="w-6 h-6 rounded-lg bg-[#FB5724]/15 flex items-center justify-center shrink-0 group-hover/m:bg-[#FB5724]/25 transition-colors">
                  <Image src="/icon/email.png" alt="Email" width={13} height={13} className="object-contain"
                    style={{ filter: "invert(45%) sepia(90%) saturate(600%) hue-rotate(345deg) brightness(105%)" }} />
                </span>
                info@pureapple.com.bd
              </a>
              <div className="flex items-start gap-2 text-gray-400 text-[11px]">
                <span className="w-6 h-6 rounded-lg bg-[#FB5724]/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Image src="/icon/location.png" alt="Location" width={13} height={13} className="object-contain"
                    style={{ filter: "invert(45%) sepia(90%) saturate(600%) hue-rotate(345deg) brightness(105%)" }} />
                </span>
                <span className="leading-relaxed">
                  Jamuna Future Park, Level-4,<br />
                  Block-B, Shop No: 4B-012B2,<br />
                  Dhaka, Bangladesh
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className={`w-8 h-8 rounded-xl bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 ${s.bg}`}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-[#FB5724] inline-block" />
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-gray-400 text-xs hover:text-[#FB5724] transition-colors flex items-center gap-1.5 group/l">
                    <ArrowRight size={10}
                      className="opacity-0 -translate-x-1 group-hover/l:opacity-100 group-hover/l:translate-x-0 transition-all duration-200 text-[#FB5724]" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Categories */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-[#FB5724] inline-block" />
              Categories
            </h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <Link href={cat.href}
                    className="text-gray-400 text-xs hover:text-[#FB5724] transition-colors flex items-center gap-1.5 group/c">
                    <ArrowRight size={10}
                      className="opacity-0 -translate-x-1 group-hover/c:opacity-100 group-hover/c:translate-x-0 transition-all duration-200 text-[#FB5724]" />
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Store Hours */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
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

        {/* Desktop border below grid */}
        <div className="hidden lg:block" />

        {/* Mobile border */}
        <div className="lg:hidden border-t border-white/10 mb-0" />

        {/* ── Bottom Bar ─────────────────────────────────────── */}
        <div className="py-3 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-gray-500 text-[11px] hover:text-[#FB5724] transition-colors">
              Privacy Policy
            </Link>
            <span className="w-px h-3 bg-white/15 inline-block" />
            <Link href="/terms" className="text-gray-500 text-[11px] hover:text-[#FB5724] transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
          <div className="w-full h-px bg-white/5" />
          <p className="text-gray-600 text-[10px]">
            © 2026 Pure Apple. All rights reserved. | Developed by{" "}
            <span className="text-[#FB5724] font-bold tracking-wide">FDIT</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
