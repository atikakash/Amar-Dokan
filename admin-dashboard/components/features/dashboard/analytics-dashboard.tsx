"use client";

import { Boxes, ListTree, Percent, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { MetricCard } from "@/components/ui/metric-card";
import { PageMotion } from "@/components/ui/motion";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useCategories, useCoupons, useOrders, useProducts } from "@/lib/hooks/use-admin-data";
import type { Order } from "@/lib/api/types";
import { currency, shortDate } from "@/lib/utils/format";

export function AnalyticsDashboard() {
  const products = useProducts({ per_page: 100, is_active: true });
  const categories = useCategories({ per_page: 100, is_active: true });
  const orders = useOrders({ per_page: 100 });
  const coupons = useCoupons({ per_page: 100 });

  const orderRows = orders.data?.data ?? [];
  const revenue = orderRows.reduce((total, order) => total + Number(order.total), 0);
  const pendingOrders = orderRows.filter((order) => order.status === "pending").length;
  const lowStock = (products.data?.data ?? []).filter((product) => product.stock_quantity <= product.low_stock_threshold).length;
  const chartBars = [42, 68, 54, 86, 72, 92, 78, 104, 88, 118, 96, 132];

  return (
    <PageMotion>
      <PageHeader title="Dashboard" description="Store performance, operational workload, and inventory pressure." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Revenue" value={currency(revenue)} note={`${orderRows.length} orders loaded`} icon={ShoppingBag} />
        <MetricCard title="Products" value={`${products.data?.meta?.total ?? products.data?.data.length ?? 0}`} note={`${lowStock} low stock`} icon={Boxes} />
        <MetricCard title="Categories" value={`${categories.data?.meta?.total ?? categories.data?.data.length ?? 0}`} note="Active catalog groups" icon={ListTree} />
        <MetricCard title="Coupons" value={`${coupons.data?.meta?.total ?? coupons.data?.data.length ?? 0}`} note={`${pendingOrders} pending orders`} icon={Percent} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="overflow-hidden">
          <CardHeader
            title="Revenue Overview"
            description="Placeholder chart area ready for production analytics."
            action={
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                <TrendingUp className="h-3.5 w-3.5" />
                18.4%
              </span>
            }
          />
          <CardContent>
            <div className="flex h-72 items-end gap-3 rounded-2xl border border-border/80 bg-surface p-4">
              {chartBars.map((height, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-xl bg-gradient-to-t from-brand-700 to-accent-500 shadow-soft transition hover:opacity-80" style={{ height }} />
                  <span className="text-[10px] font-semibold text-muted">{index + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Customer Pulse" description="High-level audience health." />
          <CardContent className="grid gap-4">
            {[
              ["Returning customers", "64%", "Healthy retention"],
              ["Conversion rate", "7.8%", "Checkout focused"],
              ["Avg. order value", currency(orderRows.length ? revenue / orderRows.length : 0), "Across loaded orders"],
            ].map(([label, value, note]) => (
              <div key={label} className="rounded-2xl border border-border/80 bg-surface p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">{label}</p>
                  <Users className="h-4 w-4 text-muted" />
                </div>
                <p className="mt-2 text-2xl font-black text-ink">{value}</p>
                <p className="mt-1 text-xs text-muted">{note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="overflow-hidden">
          <CardHeader title="Recent Orders" description="Latest order activity from the shared order API." />
          <DataTable<Order>
            rows={orderRows.slice(0, 8)}
            isLoading={orders.isLoading}
            getKey={(order) => order.id}
            empty="No orders yet."
            columns={[
              { header: "Order", cell: (order) => <span className="font-medium">{order.order_number}</span> },
              { header: "Customer", cell: (order) => order.user?.name ?? "Customer" },
              { header: "Status", cell: (order) => <StatusBadge value={order.status} /> },
              { header: "Total", cell: (order) => currency(order.total) },
              { header: "Date", cell: (order) => shortDate(order.created_at) },
            ]}
          />
        </Card>

        <Card>
          <CardHeader title="Inventory Watch" description="Products at or below threshold." />
          <CardContent className="grid gap-3">
            {(products.data?.data ?? [])
              .filter((product) => product.stock_quantity <= product.low_stock_threshold)
              .slice(0, 8)
              .map((product) => (
                <div key={product.id} className="flex items-center justify-between rounded-2xl border border-border/80 bg-surface p-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{product.name}</p>
                    <p className="text-xs text-muted">{product.sku}</p>
                  </div>
                  <span className="text-sm font-semibold text-danger">{product.stock_quantity}</span>
                </div>
              ))}
            {!products.isLoading && lowStock === 0 ? <p className="py-8 text-center text-sm text-muted">No low-stock products.</p> : null}
          </CardContent>
        </Card>
      </div>
    </PageMotion>
  );
}
