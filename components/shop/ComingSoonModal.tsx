"use client";

// components/shop/ComingSoonModal.tsx
// ─────────────────────────────────────────────────────────────
// Full-screen bottom-sheet popup — দেখায় যখন category off থাকে
// ─────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { X, Bell, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  categoryLabel: string;
  categoryIcon: string;
  onClose: () => void;
}

export default function ComingSoonModal({ categoryLabel, categoryIcon, onClose }: Props) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    // Lock body scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-[201] flex justify-center px-4 pb-6 animate-in slide-in-from-bottom-4 duration-300">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Close button */}
          <div className="flex justify-end px-4 pt-4">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Close"
            >
              <X size={16} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-8 text-center">
            {/* Icon */}
            <div className="text-6xl mb-4 animate-bounce">{categoryIcon}</div>

            {/* Category pill */}
            <span className="inline-block bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1 rounded-full mb-3">
              {categoryLabel}
            </span>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              Coming Soon! 🚀
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              এই category-তে এখনো products add করা হয়নি।
              <br />
              শীঘ্রই দারুণ সব products আসছে!
            </p>

            {/* Notify CTA */}
            <button
              onClick={() => {
                onClose();
                // TODO: connect to newsletter/waitlist
              }}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-sm h-12 rounded-2xl transition-all shadow-md shadow-orange-200 mb-3"
            >
              <Bell size={16} />
              Notify করুন যখন আসবে
            </button>

            {/* Back button */}
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 font-semibold text-sm h-11 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={15} />
              ফিরে যান
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
