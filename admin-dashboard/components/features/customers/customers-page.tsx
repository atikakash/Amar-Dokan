"use client";

import { Mail, Phone, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import type { User } from "@/lib/api/types";
import { useCustomers, useOrders } from "@/lib/hooks/use-admin-data";
import { shortDate } from "@/lib/utils/format";

export function CustomersPage() {
  const customers = useCustomers({ per_page: 50 });
  const orders = useOrders({ per_page: 100 });
  const fallbackCustomers = Array.from(
    new Map((orders.data?.data ?? []).filter((order) => order.user).map((order) => [order.user!.id, order.user!])).values(),
  );
  const rows = customers.data?.data ?? fallbackCustomers;

  return (
    <>
      <PageHeader title="Customers" description="Customer accounts, verification state, and order-linked contact details." />

      {customers.isError ? (
        <Card className="mb-4 border-amber-200 bg-amber-50">
          <CardContent>
            <p className="text-sm text-amber-800">
              The dashboard is showing customers discovered from orders because a dedicated customer list endpoint is not available yet.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3">
            <UserRound className="h-5 w-5 text-brand-700" />
            <div>
              <p className="text-sm text-muted">Customers</p>
              <p className="text-xl font-semibold text-ink">{rows.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-accent-600" />
            <div>
              <p className="text-sm text-muted">Verified</p>
              <p className="text-xl font-semibold text-ink">{rows.filter((user) => user.email_verified_at).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-warn" />
            <div>
              <p className="text-sm text-muted">With Phone</p>
              <p className="text-xl font-semibold text-ink">{rows.filter((user) => user.phone).length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader title="Customer Accounts" description="Read access for support and order operations." />
        <DataTable<User>
          rows={rows}
          isLoading={customers.isLoading && !customers.isError}
          getKey={(user) => user.id}
          columns={[
            {
              header: "Customer",
              cell: (user) => (
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted">{user.email}</p>
                </div>
              ),
            },
            { header: "Phone", cell: (user) => user.phone ?? "-" },
            { header: "Role", cell: (user) => <StatusBadge value={user.role} /> },
            { header: "Email", cell: (user) => <StatusBadge value={user.email_verified_at ? "active" : "pending"} /> },
            { header: "Joined", cell: (user) => shortDate(user.created_at) },
          ]}
        />
      </Card>
    </>
  );
}
