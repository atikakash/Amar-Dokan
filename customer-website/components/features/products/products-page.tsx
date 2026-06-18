"use client";

import { useMemo, useState } from "react";
import { Check, RotateCcw, Scale, Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/features/products/product-card";
import { Button } from "@/components/ui/button";
import { Field, Select } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { useCategories, useProducts } from "@/lib/hooks/use-commerce";
import type { Product } from "@/lib/api/types";
import { currency } from "@/lib/utils/format";

type AvailabilityFilter = "all" | "in_stock" | "low_stock" | "sale";

function averageRating(product: Product) {
  const reviews = product.reviews ?? [];

  if (reviews.length === 0) return 0;

  return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
}

export function ProductsPage({ initialCategory, initialSearch }: { initialCategory?: string; initialSearch?: string }) {
  const [search, setSearch] = useState(initialSearch ?? "");
  const [category, setCategory] = useState(initialCategory ?? "");
  const [sort, setSort] = useState("latest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const categories = useCategories({ per_page: 100, is_active: true });
  const filters = useMemo(() => ({ search, category_id: category, per_page: 48, is_active: true }), [category, search]);
  const products = useProducts(filters);
  const min = Number(minPrice);
  const max = Number(maxPrice);
  const hasMinPrice = minPrice !== "" && Number.isFinite(min);
  const hasMaxPrice = maxPrice !== "" && Number.isFinite(max);
  const selectedCategory = categories.data?.data.find((item) => String(item.id) === category);
  const rows = [...(products.data?.data ?? [])]
    .filter((product) => {
      const price = Number(product.price);

      if (hasMinPrice && price < min) return false;
      if (hasMaxPrice && price > max) return false;
      if (availability === "in_stock" && product.stock_quantity <= 0) return false;
      if (availability === "low_stock" && product.stock_quantity > product.low_stock_threshold) return false;
      if (availability === "sale" && !product.compare_price) return false;

      return true;
    })
    .sort((a, b) => {
      if (sort === "price_asc") return Number(a.price) - Number(b.price);
      if (sort === "price_desc") return Number(b.price) - Number(a.price);
      if (sort === "rating") return averageRating(b) - averageRating(a);
      if (sort === "name") return a.name.localeCompare(b.name);
      return b.id - a.id;
    });
  const compareProducts = compareIds
    .map((id) => rows.find((product) => product.id === id) ?? products.data?.data.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));
  const hasActiveFilters = Boolean(search || category || minPrice || maxPrice || availability !== "all");

  function resetFilters() {
    setSearch("");
    setCategory("");
    setSort("latest");
    setMinPrice("");
    setMaxPrice("");
    setAvailability("all");
  }

  function toggleCompare(productId: number) {
    setCompareIds((current) => {
      if (current.includes(productId)) return current.filter((id) => id !== productId);
      if (current.length >= 3) return [...current.slice(1), productId];

      return [...current, productId];
    });
  }

  return (
    <>
      <SectionHeading title="Pet Shop" description="Browse food, litter, treats, health care, and accessories with live inventory." />
      <div className="mb-5 grid gap-4 rounded-lg border border-border bg-panel p-4 shadow-soft">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <SlidersHorizontal className="h-4 w-4 text-leaf-700" />
          Shop filters
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_220px_180px]">
          <div className="flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-3">
            <Search className="h-4 w-4 text-muted" />
            <input className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search food, litter, treats" value={search} onChange={(event) => setSearch(event.target.value)} />
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
              <option value="rating">Highest rated</option>
              <option value="name">Name A-Z</option>
            </Select>
          </Field>
        </div>
        <div className="grid gap-3 md:grid-cols-[160px_160px_220px_auto] md:items-end">
          <Field label="Min price">
            <input
              type="number"
              min="0"
              inputMode="decimal"
              className="h-11 rounded-xl border border-border/90 bg-panel px-3 text-sm text-ink shadow-soft outline-none transition focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10"
              placeholder="0"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
            />
          </Field>
          <Field label="Max price">
            <input
              type="number"
              min="0"
              inputMode="decimal"
              className="h-11 rounded-xl border border-border/90 bg-panel px-3 text-sm text-ink shadow-soft outline-none transition focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10"
              placeholder="5000"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
            />
          </Field>
          <Field label="Availability">
            <Select value={availability} onChange={(event) => setAvailability(event.target.value as AvailabilityFilter)}>
              <option value="all">Any availability</option>
              <option value="in_stock">In stock</option>
              <option value="low_stock">Low stock</option>
              <option value="sale">On sale</option>
            </Select>
          </Field>
          <Button type="button" variant="secondary" onClick={resetFilters} disabled={!hasActiveFilters && sort === "latest"}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium text-ink">{products.isLoading ? "Loading products" : `${rows.length} products found`}</span>
          {search ? <span className="rounded-full border border-border bg-surface px-3 py-1 text-muted">Search: {search}</span> : null}
          {selectedCategory ? <span className="rounded-full border border-border bg-surface px-3 py-1 text-muted">{selectedCategory.name}</span> : null}
          {minPrice || maxPrice ? <span className="rounded-full border border-border bg-surface px-3 py-1 text-muted">Price: {minPrice || "0"} - {maxPrice || "any"}</span> : null}
          {availability !== "all" ? <span className="rounded-full border border-border bg-surface px-3 py-1 text-muted">{availability.replace("_", " ")}</span> : null}
        </div>
      </div>
      {compareProducts.length > 0 ? (
        <div className="mb-5 rounded-lg border border-border bg-panel p-4 shadow-soft">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-leaf-700" />
              <p className="font-semibold text-ink">Compare products</p>
              <span className="text-sm text-muted">{compareProducts.length}/3 selected</span>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => setCompareIds([])}>
              <X className="h-4 w-4" />
              Clear
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-muted">
                <tr className="border-b border-border">
                  <th className="py-2 pr-4 font-medium">Product</th>
                  <th className="py-2 pr-4 font-medium">Price</th>
                  <th className="py-2 pr-4 font-medium">Stock</th>
                  <th className="py-2 pr-4 font-medium">Category</th>
                  <th className="py-2 pr-4 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody>
                {compareProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border/70 last:border-0">
                    <td className="py-3 pr-4 font-semibold text-ink">{product.name}</td>
                    <td className="py-3 pr-4 text-ink">{currency(product.price)}</td>
                    <td className="py-3 pr-4 text-muted">{product.stock_quantity} available</td>
                    <td className="py-3 pr-4 text-muted">{product.category?.name ?? "Catalog"}</td>
                    <td className="py-3 pr-4 text-muted">{averageRating(product).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((product) => {
          const selected = compareIds.includes(product.id);

          return (
            <ProductCard
              key={product.id}
              product={product}
              compareAction={
                <button
                  type="button"
                  onClick={() => toggleCompare(product.id)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-ink transition hover:border-leaf-500 hover:text-leaf-700"
                >
                  {selected ? <Check className="h-4 w-4 text-leaf-700" /> : <Scale className="h-4 w-4" />}
                  {selected ? "Selected for compare" : "Compare"}
                </button>
              }
            />
          );
        })}
      </div>
      {!products.isLoading && rows.length === 0 ? <p className="rounded-lg border border-border bg-panel p-8 text-center text-muted">No products found.</p> : null}
    </>
  );
}
