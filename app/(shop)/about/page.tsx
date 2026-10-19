// SAVE PATH: app/(shop)/about/page.tsx
import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us – Pure Apple",
  description:
    "Pure Apple – Bangladesh's trusted smartphone & gadget shop. Meet our team, read happy client stories, and visit our store.",
};

export default function AboutPage() {
  return <AboutClient />;
}
