import { OrdersPage } from "@/components/features/orders/orders-page";

export default async function OrdersRoute({ searchParams }: { searchParams: Promise<{ placed?: string }> }) {
  const params = await searchParams;

  return <OrdersPage placed={params.placed} />;
}
