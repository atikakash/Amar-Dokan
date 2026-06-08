"use client";

import { FormEvent, useMemo, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Product } from "@/lib/api/types";
import { useCategories, useProductMutations, useProducts } from "@/lib/hooks/use-admin-data";
import { currency, slugify } from "@/lib/utils/format";

type ProductForm = {
  id?: number;
  category_id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: string;
  compare_price: string;
  stock_quantity: string;
  low_stock_threshold: string;
  is_active: boolean;
  is_featured: boolean;
  image_url: string;
};

const blank: ProductForm = {
  category_id: "",
  name: "",
  slug: "",
  sku: "",
  description: "",
  price: "",
  compare_price: "",
  stock_quantity: "0",
  low_stock_threshold: "5",
  is_active: true,
  is_featured: false,
  image_url: "",
};

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<ProductForm | null>(null);
  const filters = useMemo(() => ({ search, per_page: 50 }), [search]);
  const products = useProducts(filters);
  const categories = useCategories({ per_page: 100, is_active: true });
  const mutations = useProductMutations();

  function open(product?: Product) {
    setEditing(
      product
        ? {
            id: product.id,
            category_id: String(product.category_id),
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            description: product.description ?? "",
            price: product.price,
            compare_price: product.compare_price ?? "",
            stock_quantity: String(product.stock_quantity),
            low_stock_threshold: String(product.low_stock_threshold),
            is_active: product.is_active,
            is_featured: product.is_featured,
            image_url: product.images?.[0]?.url ?? "",
          }
        : blank,
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    await mutations.save.mutateAsync({
      id: editing.id,
      category_id: Number(editing.category_id),
      name: editing.name,
      slug: editing.slug || slugify(editing.name),
      sku: editing.sku,
      description: editing.description,
      price: editing.price,
      compare_price: editing.compare_price || null,
      stock_quantity: Number(editing.stock_quantity),
      low_stock_threshold: Number(editing.low_stock_threshold),
      is_active: editing.is_active,
      is_featured: editing.is_featured,
      images: editing.image_url ? [{ url: editing.image_url, alt_text: editing.name, is_primary: true }] : [],
    });
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        title="Products"
        description="Create, edit, publish, and monitor catalog inventory."
        action={
          <Button onClick={() => open()}>
            <Plus className="h-4 w-4" />
            Product
          </Button>
        }
      />

      <Card>
        <CardHeader
          title="Product Catalog"
          description="Synced with the Laravel products API."
          action={<Input placeholder="Search products" value={search} onChange={(event) => setSearch(event.target.value)} />}
        />
        <DataTable<Product>
          rows={products.data?.data ?? []}
          isLoading={products.isLoading}
          getKey={(product) => product.id}
          columns={[
            {
              header: "Product",
              cell: (product) => (
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-muted">{product.sku}</p>
                </div>
              ),
            },
            { header: "Category", cell: (product) => product.category?.name ?? "-" },
            { header: "Price", cell: (product) => currency(product.price) },
            { header: "Stock", cell: (product) => product.stock_quantity },
            { header: "Status", cell: (product) => <StatusBadge value={product.is_active ? "active" : "inactive"} /> },
            {
              header: "Actions",
              cell: (product) => (
                <div className="flex gap-2">
                  <Button variant="secondary" size="icon" onClick={() => open(product)} aria-label="Edit product">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.confirm("Delete this product?") && mutations.remove.mutate(product.id)}
                    aria-label="Delete product"
                  >
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </Card>

      <Dialog title={editing?.id ? "Edit Product" : "New Product"} open={Boolean(editing)} onClose={() => setEditing(null)}>
        {editing ? (
          <form className="grid gap-4" onSubmit={submit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <Input value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} required />
              </Field>
              <Field label="SKU">
                <Input value={editing.sku} onChange={(event) => setEditing({ ...editing, sku: event.target.value })} required />
              </Field>
              <Field label="Category">
                <Select value={editing.category_id} onChange={(event) => setEditing({ ...editing, category_id: event.target.value })} required>
                  <option value="">Select category</option>
                  {(categories.data?.data ?? []).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Slug">
                <Input value={editing.slug} onChange={(event) => setEditing({ ...editing, slug: event.target.value })} placeholder="Auto-generated if blank" />
              </Field>
              <Field label="Price">
                <Input type="number" min="0" step="0.01" value={editing.price} onChange={(event) => setEditing({ ...editing, price: event.target.value })} required />
              </Field>
              <Field label="Compare Price">
                <Input type="number" min="0" step="0.01" value={editing.compare_price} onChange={(event) => setEditing({ ...editing, compare_price: event.target.value })} />
              </Field>
              <Field label="Stock">
                <Input type="number" min="0" value={editing.stock_quantity} onChange={(event) => setEditing({ ...editing, stock_quantity: event.target.value })} required />
              </Field>
              <Field label="Low Stock Threshold">
                <Input type="number" min="0" value={editing.low_stock_threshold} onChange={(event) => setEditing({ ...editing, low_stock_threshold: event.target.value })} />
              </Field>
            </div>
            <Field label="Image URL">
              <Input value={editing.image_url} onChange={(event) => setEditing({ ...editing, image_url: event.target.value })} />
            </Field>
            <Field label="Description">
              <Textarea value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} />
            </Field>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={editing.is_active} onChange={(event) => setEditing({ ...editing, is_active: event.target.checked })} />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={editing.is_featured} onChange={(event) => setEditing({ ...editing, is_featured: event.target.checked })} />
                Featured
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button disabled={mutations.save.isPending}>{mutations.save.isPending ? "Saving" : "Save Product"}</Button>
            </div>
          </form>
        ) : null}
      </Dialog>
    </>
  );
}
