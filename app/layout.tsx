import type { Metadata } from "next";
import "./globals.css";
import SplashScreen from "@/components/shop/SplashScreen";

export const metadata: Metadata = {
  title: {
    default: "Pure Apple – Better Tech, Brighter Tomorrow",
    template: "%s | Pure Apple",
  },
  description:
    "Shop the latest smartphones from Apple, Samsung, Google, OnePlus and more at the best prices with secure payment.",
  keywords: ["smartphones", "apple", "samsung", "google pixel", "oneplus", "buy phone online"],
  openGraph: {
    title: "Pure Apple",
    description: "Better Tech, Brighter Tomorrow.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
