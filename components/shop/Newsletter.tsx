"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0E2318 0%, #1E5A33 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-white text-2xl lg:text-3xl font-bold mb-2">
              Stay Connected
            </h2>
            <p className="text-leaf-100/80 text-sm">
              Get the latest updates, offers and new arrivals.
            </p>

            {submitted ? (
              <p className="mt-6 text-leaf-300 font-medium text-sm">
                ✓ You're subscribed! Check your inbox.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 flex gap-2 max-w-md lg:mx-0 mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-sun-400 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-brand-500 hover:bg-brand-400 text-white px-4 py-3 rounded-xl transition-colors flex items-center"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>

          {/* Right side image */}
          <div className="hidden lg:block relative w-72 h-48">
            <Image
              src="/images/promo/newsletter-phone.png"
              alt="Stay connected"
              fill
              className="object-contain"
            />
            {/* Decorative text */}
            <div className="absolute -right-4 top-0 text-right">
              <p className="text-white/20 text-xl font-bold italic">Your</p>
              <p className="text-white/20 text-xl font-bold italic">Next Phone</p>
              <p className="text-white/20 text-xl font-bold italic">Awaits</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
