"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useCart, useCartMutations } from "@/lib/hooks/use-commerce";
import { currency, productImage } from "@/lib/utils/format";

export function CartPage() {
  const cart = useCart();
  const mutations = useCartMutations();
  const items = cart.data?.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + Number(item.line_total), 0);
  const shipping = items.length > 0 ? 80 : 0;

  return (
    <AuthGuard>
      <SectionHeading title="Cart" description="Review pet essentials, delivery charge, and stock-aware quantities before checkout." />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader title="Items" description={`${items.length} products in your cart`} />
          <CardContent className="grid gap-4">
            {items.map((item) => (
              <div key={item.id} className="grid gap-4 rounded-lg border border-border p-3 sm:grid-cols-[96px_1fr_auto]">
                <img src={productImage(item.product?.images?.[0]?.url)} alt={item.product?.name ?? "Product"} className="h-24 w-24 rounded-md object-cover" />
                <div>
                  <Link href={`/products/${item.product_id}`} className="font-semibold text-ink hover:text-leaf-700">
                    {item.product?.name ?? "Product"}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{currency(item.unit_price)}</p>
                  {item.product ? (
                    <p className="mt-1 text-xs text-muted">
                      {item.product.stock_quantity > 0 ? `${item.product.stock_quantity} available` : "Out of stock"}
                    </p>
                  ) : null}
                  <div className="mt-3 inline-flex h-9 items-center rounded-md border border-border">
                    <button
                      className="px-3 text-muted disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={item.quantity <= 1 || mutations.update.isPending}
                      onClick={() => mutations.update.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm">{item.quantity}</span>
                    <button
                      className="px-3 text-muted disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={mutations.update.isPending || Boolean(item.product && item.quantity >= item.product.stock_quantity)}
                      onClick={() => mutations.update.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:grid sm:justify-items-end">
                  <p className="font-semibold text-ink">{currency(item.line_total)}</p>
                  <Button variant="ghost" size="icon" onClick={() => mutations.remove.mutate(item.id)} aria-label="Remove item">
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              </div>
            ))}
            {!cart.isLoading && items.length === 0 ? <p className="py-10 text-center text-muted">Your cart is empty.</p> : null}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader title="Summary" />
          <CardContent className="grid gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-medium text-ink">{currency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Shipping</span>
              <span className="font-medium text-ink">{currency(shipping)}</span>
            </div>
            <p className="text-xs leading-5 text-muted">Inside Dhaka delivery estimate. Heavy food or litter bags may be adjusted after confirmation.</p>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-ink">Total</span>
                <span className="font-semibold text-ink">{currency(subtotal + shipping)}</span>
              </div>
            </div>
            <Link href="/checkout">
              <Button className="mt-2 w-full" disabled={items.length === 0}>
                Checkout
              </Button>
            </Link>
            <Link href="/products" className="text-center text-sm font-medium text-leaf-700 hover:text-leaf-800">
              Continue shopping
            </Link>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
