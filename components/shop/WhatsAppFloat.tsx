"use client";

// ডান পাশে floating WhatsApp button — customer সরাসরি দোকানের সাথে chat করতে পারবে

import { usePathname } from "next/navigation";
import { SHOP } from "@/lib/shopConfig";

export default function WhatsAppFloat() {
  const pathname = usePathname() || "/";
  // Product page-এ product নাম সহ message
  const text = encodeURIComponent(
    pathname.startsWith("/products/")
      ? `${SHOP.whatsappGreeting}\nProduct: ${typeof window !== "undefined" ? window.location.href : ""}`
      : SHOP.whatsappGreeting
  );

  return (
    <a
      href={`https://wa.me/${SHOP.whatsappNumber}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed right-3 md:right-5 bottom-[88px] md:bottom-6 z-40 flex items-center"
    >
      <span className="hidden md:block mr-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
        Chat with us
      </span>
      <span className="relative flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-green-500/40 active:scale-95 transition-transform">
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" aria-hidden />
        <svg viewBox="0 0 32 32" className="relative h-7 w-7 md:h-8 md:w-8 fill-white" aria-hidden>
          <path d="M16.003 3C8.83 3 3 8.83 3 16c0 2.29.6 4.52 1.74 6.49L3 29l6.7-1.7A12.94 12.94 0 0 0 16 29c7.17 0 13-5.83 13-13S23.17 3 16.003 3Zm0 23.8c-1.93 0-3.82-.52-5.47-1.5l-.39-.23-3.98 1.01 1.06-3.88-.26-.4A10.76 10.76 0 0 1 5.2 16c0-5.96 4.85-10.8 10.8-10.8S26.8 10.04 26.8 16c0 5.96-4.85 10.8-10.8 10.8Zm5.92-8.08c-.32-.16-1.92-.95-2.22-1.06-.3-.11-.51-.16-.73.16-.22.32-.84 1.06-1.03 1.28-.19.21-.38.24-.7.08-.32-.16-1.37-.5-2.6-1.6-.96-.86-1.61-1.92-1.8-2.24-.19-.32-.02-.5.14-.66.15-.14.32-.38.48-.57.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.56-.08-.16-.73-1.76-1-2.41-.26-.63-.53-.54-.73-.55h-.62c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66 0 1.57 1.15 3.09 1.31 3.3.16.21 2.25 3.44 5.46 4.82.76.33 1.36.53 1.82.68.77.24 1.46.21 2.01.13.61-.09 1.92-.78 2.19-1.54.27-.75.27-1.4.19-1.54-.08-.13-.3-.21-.62-.37Z" />
        </svg>
      </span>
    </a>
  );
}
