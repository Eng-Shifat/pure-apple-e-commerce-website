// app/(shop)/category/[slug]/page.tsx
// ─────────────────────────────────────────────────────────────
// Dynamic category page
// /category/iphone     → শুধু iPhone
// /category/android    → iPhone বাদে সব Android
// /category/charger    → Charger products
// etc.
// ─────────────────────────────────────────────────────────────

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, getCategorySettings } from "@/lib/categories";
import CategoryPageClient from "./CategoryPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all categories
export async function generateStaticParams() {
  const categories = await getCategorySettings();
  return categories.map((c) => ({ slug: c.slug }));
}

// SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return { title: "Category Not Found" };

  return {
    title: `${cat.icon} ${cat.label} — Pure Apple`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  // Pass data to client component
  return (
    <CategoryPageClient
      slug={slug}
      label={category.label}
      icon={category.icon}
      description={category.description}
      isEnabled={category.is_enabled}
    />
  );
}
