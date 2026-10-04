"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Record<string,unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => { setData(d.product); setLoading(false); });
  }, [id]);

  if (loading) return <div className="p-6 text-gray-400 text-sm">Loading…</div>;
  if (!data)   return <div className="p-6 text-red-500 text-sm">Product not found.</div>;

  return <ProductForm mode="edit" initialData={data as Parameters<typeof ProductForm>[0]["initialData"]} />;
}
