"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/features/products/product-card";
import { Field, Select } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { useCategories, useProducts } from "@/lib/hooks/use-commerce";

export function ProductsPage({ initialCategory }: { initialCategory?: string }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "");
  const [sort, setSort] = useState("latest");
  const categories = useCategories({ per_page: 100, is_active: true });
  const filters = useMemo(() => ({ search, category_id: category, per_page: 48, is_active: true }), [category, search]);
  const products = useProducts(filters);
  const rows = [...(products.data?.data ?? [])].sort((a, b) => {
    if (sort === "price_asc") return Number(a.price) - Number(b.price);
    if (sort === "price_desc") return Number(b.price) - Number(a.price);
    return b.id - a.id;
  });

  return (
    <>
      <SectionHeading title="Products" description="Browse the shared product catalog with live inventory." />
      <div className="mb-5 grid gap-3 rounded-lg border border-border bg-panel p-4 shadow-soft md:grid-cols-[1fr_220px_180px]">
        <div className="flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-3">
          <Search className="h-4 w-4 text-muted" />
          <input className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search products" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <Field label="Category">
          <Select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {(categories.data?.data ?? []).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Sort">
          <Select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="latest">Latest</option>
            <option value="price_asc">Price low to high</option>
            <option value="price_desc">Price high to low</option>
          </Select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {!products.isLoading && rows.length === 0 ? <p className="rounded-lg border border-border bg-panel p-8 text-center text-muted">No products found.</p> : null}
    </>
  );
}
