"use client";

import { FormEvent, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Category } from "@/lib/api/types";
import { useCategories, useCategoryMutations } from "@/lib/hooks/use-admin-data";
import { slugify } from "@/lib/utils/format";

type CategoryForm = {
  id?: number;
  parent_id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  is_active: boolean;
  sort_order: string;
};

const blank: CategoryForm = {
  parent_id: "",
  name: "",
  slug: "",
  description: "",
  image: "",
  is_active: true,
  sort_order: "0",
};

export function CategoriesPage() {
  const categories = useCategories({ per_page: 100 });
  const mutations = useCategoryMutations();
  const [editing, setEditing] = useState<CategoryForm | null>(null);

  function open(category?: Category) {
    setEditing(
      category
        ? {
            id: category.id,
            parent_id: category.parent_id ? String(category.parent_id) : "",
            name: category.name,
            slug: category.slug,
            description: category.description ?? "",
            image: category.image ?? "",
            is_active: category.is_active,
            sort_order: String(category.sort_order),
          }
        : blank,
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    await mutations.save.mutateAsync({
      id: editing.id,
      parent_id: editing.parent_id ? Number(editing.parent_id) : null,
      name: editing.name,
      slug: editing.slug || slugify(editing.name),
      description: editing.description,
      image: editing.image || null,
      is_active: editing.is_active,
      sort_order: Number(editing.sort_order),
    });
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        title="Categories"
        description="Organize product discovery with nested category groups."
        action={
          <Button onClick={() => open()}>
            <Plus className="h-4 w-4" />
            Category
          </Button>
        }
      />

      <Card>
        <CardHeader title="Category Tree" description="Parent and child category records." />
        <DataTable<Category>
          rows={categories.data?.data ?? []}
          isLoading={categories.isLoading}
          getKey={(category) => category.id}
          columns={[
            { header: "Name", cell: (category) => <span className="font-medium">{category.name}</span> },
            { header: "Slug", cell: (category) => category.slug },
            { header: "Parent", cell: (category) => category.parent?.name ?? "-" },
            { header: "Sort", cell: (category) => category.sort_order },
            { header: "Status", cell: (category) => <StatusBadge value={category.is_active ? "active" : "inactive"} /> },
            {
              header: "Actions",
              cell: (category) => (
                <div className="flex gap-2">
                  <Button variant="secondary" size="icon" onClick={() => open(category)} aria-label="Edit category">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.confirm("Delete this category?") && mutations.remove.mutate(category.id)}
                    aria-label="Delete category"
                  >
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </Card>

      <Dialog title={editing?.id ? "Edit Category" : "New Category"} open={Boolean(editing)} onClose={() => setEditing(null)}>
        {editing ? (
          <form className="grid gap-4" onSubmit={submit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <Input value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} required />
              </Field>
              <Field label="Slug">
                <Input value={editing.slug} onChange={(event) => setEditing({ ...editing, slug: event.target.value })} />
              </Field>
              <Field label="Parent">
                <Select value={editing.parent_id} onChange={(event) => setEditing({ ...editing, parent_id: event.target.value })}>
                  <option value="">No parent</option>
                  {(categories.data?.data ?? [])
                    .filter((category) => category.id !== editing.id)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </Select>
              </Field>
              <Field label="Sort Order">
                <Input type="number" min="0" value={editing.sort_order} onChange={(event) => setEditing({ ...editing, sort_order: event.target.value })} />
              </Field>
            </div>
            <Field label="Image URL">
              <Input value={editing.image} onChange={(event) => setEditing({ ...editing, image: event.target.value })} />
            </Field>
            <Field label="Description">
              <Textarea value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={editing.is_active} onChange={(event) => setEditing({ ...editing, is_active: event.target.checked })} />
              Active
            </label>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button disabled={mutations.save.isPending}>{mutations.save.isPending ? "Saving" : "Save Category"}</Button>
            </div>
          </form>
        ) : null}
      </Dialog>
    </>
  );
}
