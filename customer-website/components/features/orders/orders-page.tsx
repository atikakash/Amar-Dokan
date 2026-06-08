"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { useOrders } from "@/lib/hooks/use-commerce";
import { currency, shortDate } from "@/lib/utils/format";

export function OrdersPage({ placed }: { placed?: string }) {
  const orders = useOrders({ per_page: 30 });

  return (
    <AuthGuard>
      <SectionHeading title="Orders" description="Track your order history and fulfillment status." />
      {placed ? (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          Order {placed} was placed successfully.
        </div>
      ) : null}
      <div className="grid gap-4">
        {(orders.data?.data ?? []).map((order) => (
          <Card key={order.id}>
            <CardHeader
              title={order.order_number}
              description={shortDate(order.created_at)}
              action={
                <div className="flex gap-2">
                  <StatusBadge value={order.status} />
                  <StatusBadge value={order.payment_status} />
                </div>
              }
            />
            <CardContent>
              <div className="grid gap-3">
                {(order.items ?? []).map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                    <div>
                      <p className="font-medium text-ink">{item.product_name}</p>
                      <p className="text-muted">{item.product_sku} x {item.quantity}</p>
                    </div>
                    <span className="font-medium text-ink">{currency(item.total)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end border-t border-border pt-3 font-semibold text-ink">
                {currency(order.total)}
              </div>
            </CardContent>
          </Card>
        ))}
        {!orders.isLoading && (orders.data?.data ?? []).length === 0 ? <p className="rounded-lg border border-border bg-panel p-8 text-center text-muted">No orders yet.</p> : null}
      </div>
    </AuthGuard>
  );
}
