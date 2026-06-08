"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Field, Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Order, OrderStatus } from "@/lib/api/types";
import { useOrderMutations, useOrders } from "@/lib/hooks/use-admin-data";
import { currency, shortDate } from "@/lib/utils/format";

const statuses: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const orders = useOrders({ per_page: 50 });
  const mutations = useOrderMutations();
  const rows = (orders.data?.data ?? []).filter((order) => (statusFilter ? order.status === statusFilter : true));
  const total = rows.reduce((sum, order) => sum + Number(order.total), 0);

  return (
    <>
      <PageHeader title="Orders" description="Manage fulfillment status and review customer order details." />

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent>
            <p className="text-sm text-muted">Visible Orders</p>
            <p className="mt-2 text-2xl font-semibold text-ink">{rows.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted">Visible Revenue</p>
            <p className="mt-2 text-2xl font-semibold text-ink">{currency(total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Field label="Status Filter">
              <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="">All statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </Field>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader title="Order Queue" description="Staff order access is controlled by the backend role middleware." />
        <DataTable<Order>
          rows={rows}
          isLoading={orders.isLoading}
          getKey={(order) => order.id}
          columns={[
            {
              header: "Order",
              cell: (order) => (
                <div>
                  <p className="font-medium">{order.order_number}</p>
                  <p className="text-xs text-muted">{shortDate(order.created_at)}</p>
                </div>
              ),
            },
            { header: "Customer", cell: (order) => order.user?.name ?? "Customer" },
            { header: "Payment", cell: (order) => <StatusBadge value={order.payment_status} /> },
            { header: "Items", cell: (order) => order.items?.length ?? 0 },
            { header: "Total", cell: (order) => currency(order.total) },
            {
              header: "Status",
              cell: (order) => (
                <Select
                  value={order.status}
                  disabled={mutations.updateStatus.isPending}
                  onChange={(event) =>
                    mutations.updateStatus.mutate({ id: order.id, status: event.target.value as OrderStatus })
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              ),
            },
          ]}
        />
      </Card>
    </>
  );
}
