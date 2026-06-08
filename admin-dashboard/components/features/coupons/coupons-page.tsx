"use client";

import { FormEvent, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Coupon } from "@/lib/api/types";
import { useCouponMutations, useCoupons } from "@/lib/hooks/use-admin-data";
import { currency, shortDate } from "@/lib/utils/format";

type CouponForm = {
  id?: number;
  code: string;
  type: "fixed" | "percent";
  value: string;
  min_order_amount: string;
  max_discount_amount: string;
  starts_at: string;
  expires_at: string;
  usage_limit: string;
  is_active: boolean;
};

const blank: CouponForm = {
  code: "",
  type: "percent",
  value: "10",
  min_order_amount: "0",
  max_discount_amount: "",
  starts_at: "",
  expires_at: "",
  usage_limit: "",
  is_active: true,
};

function dateInput(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

export function CouponsPage() {
  const coupons = useCoupons({ per_page: 100 });
  const mutations = useCouponMutations();
  const [editing, setEditing] = useState<CouponForm | null>(null);

  function open(coupon?: Coupon) {
    setEditing(
      coupon
        ? {
            id: coupon.id,
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            min_order_amount: coupon.min_order_amount,
            max_discount_amount: coupon.max_discount_amount ?? "",
            starts_at: dateInput(coupon.starts_at),
            expires_at: dateInput(coupon.expires_at),
            usage_limit: coupon.usage_limit ? String(coupon.usage_limit) : "",
            is_active: coupon.is_active,
          }
        : blank,
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    await mutations.save.mutateAsync({
      id: editing.id,
      code: editing.code.toUpperCase(),
      type: editing.type,
      value: editing.value,
      min_order_amount: editing.min_order_amount,
      max_discount_amount: editing.max_discount_amount || null,
      starts_at: editing.starts_at || null,
      expires_at: editing.expires_at || null,
      usage_limit: editing.usage_limit ? Number(editing.usage_limit) : null,
      is_active: editing.is_active,
    });
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        title="Coupons"
        description="Manage promotional codes, usage windows, and discount limits."
        action={
          <Button onClick={() => open()}>
            <Plus className="h-4 w-4" />
            Coupon
          </Button>
        }
      />

      <Card>
        <CardHeader title="Promotion Codes" description="Coupons are validated by the backend before checkout." />
        <DataTable<Coupon>
          rows={coupons.data?.data ?? []}
          isLoading={coupons.isLoading}
          getKey={(coupon) => coupon.id}
          columns={[
            { header: "Code", cell: (coupon) => <span className="font-medium">{coupon.code}</span> },
            { header: "Type", cell: (coupon) => coupon.type },
            {
              header: "Value",
              cell: (coupon) => (coupon.type === "percent" ? `${coupon.value}%` : currency(coupon.value)),
            },
            { header: "Min Order", cell: (coupon) => currency(coupon.min_order_amount) },
            { header: "Usage", cell: (coupon) => `${coupon.used_count}/${coupon.usage_limit ?? "unlimited"}` },
            { header: "Expires", cell: (coupon) => shortDate(coupon.expires_at) },
            { header: "Status", cell: (coupon) => <StatusBadge value={coupon.is_active ? "active" : "inactive"} /> },
            {
              header: "Actions",
              cell: (coupon) => (
                <div className="flex gap-2">
                  <Button variant="secondary" size="icon" onClick={() => open(coupon)} aria-label="Edit coupon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.confirm("Delete this coupon?") && mutations.remove.mutate(coupon.id)}
                    aria-label="Delete coupon"
                  >
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </Card>

      <Dialog title={editing?.id ? "Edit Coupon" : "New Coupon"} open={Boolean(editing)} onClose={() => setEditing(null)}>
        {editing ? (
          <form className="grid gap-4" onSubmit={submit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Code">
                <Input value={editing.code} onChange={(event) => setEditing({ ...editing, code: event.target.value })} required />
              </Field>
              <Field label="Type">
                <Select value={editing.type} onChange={(event) => setEditing({ ...editing, type: event.target.value as CouponForm["type"] })}>
                  <option value="percent">Percent</option>
                  <option value="fixed">Fixed</option>
                </Select>
              </Field>
              <Field label="Value">
                <Input type="number" min="0" step="0.01" value={editing.value} onChange={(event) => setEditing({ ...editing, value: event.target.value })} required />
              </Field>
              <Field label="Minimum Order">
                <Input type="number" min="0" step="0.01" value={editing.min_order_amount} onChange={(event) => setEditing({ ...editing, min_order_amount: event.target.value })} />
              </Field>
              <Field label="Max Discount">
                <Input type="number" min="0" step="0.01" value={editing.max_discount_amount} onChange={(event) => setEditing({ ...editing, max_discount_amount: event.target.value })} />
              </Field>
              <Field label="Usage Limit">
                <Input type="number" min="1" value={editing.usage_limit} onChange={(event) => setEditing({ ...editing, usage_limit: event.target.value })} />
              </Field>
              <Field label="Starts At">
                <Input type="date" value={editing.starts_at} onChange={(event) => setEditing({ ...editing, starts_at: event.target.value })} />
              </Field>
              <Field label="Expires At">
                <Input type="date" value={editing.expires_at} onChange={(event) => setEditing({ ...editing, expires_at: event.target.value })} />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={editing.is_active} onChange={(event) => setEditing({ ...editing, is_active: event.target.checked })} />
              Active
            </label>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button disabled={mutations.save.isPending}>{mutations.save.isPending ? "Saving" : "Save Coupon"}</Button>
            </div>
          </form>
        ) : null}
      </Dialog>
    </>
  );
}
