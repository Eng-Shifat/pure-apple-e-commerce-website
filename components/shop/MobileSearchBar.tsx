"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

const SUGGESTIONS = [
  "iPhone 16 Pro",
  "Samsung Galaxy S25",
  "OnePlus 13",
  "Charger",
  "Earbuds",
  "Power Bank",
];

export default function MobileSearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim().length > 0
    ? SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : SUGGESTIONS;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      setFocused(false);
      inputRef.current?.blur();
    }
  }

  function handleSuggestion(s: string) {
    router.push(`/products?q=${encodeURIComponent(s)}`);
    setQuery("");
    setFocused(false);
  }

  function clearInput() {
    setQuery("");
    inputRef.current?.focus();
  }

  // Close suggestions on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest("#mobile-search-bar")) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div id="mobile-search-bar" className="md:hidden px-4 pt-3 pb-1 relative z-30">
      <form onSubmit={handleSubmit} className="relative">
        {/* Input */}
        <div className={`flex items-center gap-2 rounded-full border px-4 py-2.5 bg-white shadow-sm transition-all duration-200 ${
          focused
            ? "border-brand-400 ring-2 ring-brand-100 shadow-brand-100"
            : "border-gray-200"
        }`}>
          <Search size={17} className="text-brand-500 shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="iPhone, Samsung, Accessories..."
            className="flex-1 bg-transparent text-[14px] text-gray-800 placeholder-gray-400 outline-none"
          />
          {query.length > 0 && (
            <button type="button" onClick={clearInput} className="text-gray-400 hover:text-gray-600 shrink-0">
              <X size={15} />
            </button>
          )}
          <button
            type="submit"
            className="ml-1 shrink-0 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-[13px] font-semibold px-4 py-1.5 rounded-full transition-all"
          >
            Go
          </button>
        </div>

        {/* Suggestions dropdown */}
        {focused && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <p className="px-4 pt-3 pb-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {query.trim() ? "Suggestions" : "Popular Searches"}
            </p>
            {filtered.length > 0 ? (
              <ul className="pb-2">
                {filtered.map(s => (
                  <li key={s}>
                    <button
                      type="button"
                      onMouseDown={() => handleSuggestion(s)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-gray-700 hover:bg-brand-50 hover:text-brand-600 text-left transition-colors"
                    >
                      <Search size={14} className="text-gray-300 shrink-0" />
                      <span>{s}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-4 text-sm text-gray-400 text-center">No results for &ldquo;{query}&rdquo;</p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
