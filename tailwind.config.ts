import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Pure Apple logo colours ────────────────────────────
        // brand = logo ORANGE  (#FB5724) – buttons, links, active states
        brand: {
          50:  "#FFF4EE",
          100: "#FFE5D6",
          200: "#FFCBAE",
          300: "#FFA877",
          400: "#FF7D45",
          500: "#FB5724",
          600: "#E8470F",
          700: "#C13A0B",
          800: "#9A300F",
          900: "#7C2A10",
        },
        // leaf = logo GREEN (#4FAE53) – trust, success, "Pure"
        leaf: {
          50:  "#F2FAF2",
          100: "#DDF2DE",
          200: "#BDE5BF",
          300: "#92D195",
          400: "#6BBF6F",
          500: "#4FAE53",
          600: "#3E9142",
          700: "#327536",
          800: "#2A5D2D",
          900: "#234C26",
        },
        // sun = logo YELLOW (#FCC10B) – highlights, ratings, accents
        sun: {
          50:  "#FFFBEB",
          100: "#FFF3C4",
          200: "#FFE88A",
          300: "#FED94D",
          400: "#FDCB2E",
          500: "#FCC10B",
          600: "#D9A006",
          700: "#A87A05",
          800: "#7F5C06",
          900: "#5E4508",
        },
        // deep green used for dark sections (footer, promo, newsletter)
        dark: {
          hero: "#0E2318",
          card: "#12301F",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.07)",
        "card-hover": "0 8px 30px rgba(251,87,36,0.14)",
      },
      animation: {
        "spin-slow": "spin 12s linear infinite",
        "phone-float": "phoneFloat 3s ease-in-out infinite",
      },
      keyframes: {
        phoneFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
