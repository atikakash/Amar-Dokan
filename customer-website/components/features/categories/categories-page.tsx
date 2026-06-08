"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { useCategories } from "@/lib/hooks/use-commerce";
import { productImage } from "@/lib/utils/format";

export function CategoriesPage() {
  const categories = useCategories({ per_page: 100, is_active: true });

  return (
    <>
      <SectionHeading title="Categories" description="Explore product groups from the shared catalog." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(categories.data?.data ?? []).map((category) => (
          <Link key={category.id} href={`/products?category=${category.id}`} className="group overflow-hidden rounded-lg border border-border bg-panel shadow-soft">
            <div className="aspect-[16/9] bg-surface">
              <img src={productImage(category.image)} alt={category.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
            </div>
            <div className="flex items-start justify-between gap-4 p-4">
              <div>
                <h2 className="font-semibold text-ink">{category.name}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{category.description ?? "Browse products in this category."}</p>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted transition group-hover:text-leaf-700" />
            </div>
          </Link>
        ))}
      </div>
      {!categories.isLoading && (categories.data?.data ?? []).length === 0 ? <p className="rounded-lg border border-border bg-panel p-8 text-center text-muted">No categories found.</p> : null}
    </>
  );
}
