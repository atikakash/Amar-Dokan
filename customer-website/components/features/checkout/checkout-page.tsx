"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { apiErrorMessage } from "@/lib/api/client";
import type { PaymentGateway } from "@/lib/api/types";
import { useCart, useCheckout, useCouponValidation, usePaymentInitiation } from "@/lib/hooks/use-commerce";
import { currency } from "@/lib/utils/format";

export function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const checkout = useCheckout();
  const payment = usePaymentInitiation();
  const coupon = useCouponValidation();
  const [code, setCode] = useState("");
  const [note, setNote] = useState("");
  const [gateway, setGateway] = useState<PaymentGateway>("stripe");
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "United States",
  });
  const subtotal = (cart.data?.items ?? []).reduce((sum, item) => sum + Number(item.line_total), 0);
  const discount = coupon.data?.discount ?? 0;
  const shipping = subtotal > 0 ? 0 : 0;
  const total = Math.max(0, subtotal - discount + shipping);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const order = await checkout.mutateAsync({
      coupon_code: coupon.data?.coupon.code,
      customer_note: note,
      shipping_total: shipping,
      tax_total: 0,
      shipping_address: address,
    });
    const initiatedPayment = await payment.mutateAsync({ orderId: order.id, gateway });

    if (initiatedPayment.checkout_url) {
      window.location.href = initiatedPayment.checkout_url;
      return;
    }

    router.push(`/orders?placed=${order.order_number}&payment_id=${initiatedPayment.id}`);
  }

  return (
    <AuthGuard>
      <SectionHeading title="Checkout" description="Confirm delivery details and place your order." />
      <form className="grid gap-6 lg:grid-cols-[1fr_360px]" onSubmit={submit}>
        <Card>
          <CardHeader title="Shipping Address" />
          <CardContent className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <Input value={address.name} onChange={(event) => setAddress({ ...address, name: event.target.value })} required />
              </Field>
              <Field label="Phone">
                <Input value={address.phone} onChange={(event) => setAddress({ ...address, phone: event.target.value })} required />
              </Field>
              <Field label="Address Line 1">
                <Input value={address.address_line_1} onChange={(event) => setAddress({ ...address, address_line_1: event.target.value })} required />
              </Field>
              <Field label="Address Line 2">
                <Input value={address.address_line_2} onChange={(event) => setAddress({ ...address, address_line_2: event.target.value })} />
              </Field>
              <Field label="City">
                <Input value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value })} required />
              </Field>
              <Field label="State">
                <Input value={address.state} onChange={(event) => setAddress({ ...address, state: event.target.value })} />
              </Field>
              <Field label="Postal Code">
                <Input value={address.postal_code} onChange={(event) => setAddress({ ...address, postal_code: event.target.value })} />
              </Field>
              <Field label="Country">
                <Input value={address.country} onChange={(event) => setAddress({ ...address, country: event.target.value })} required />
              </Field>
            </div>
            <Field label="Order Note">
              <Textarea value={note} onChange={(event) => setNote(event.target.value)} />
            </Field>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader title="Order Summary" />
          <CardContent className="grid gap-3">
            <div className="flex gap-2">
              <Input placeholder="Coupon code" value={code} onChange={(event) => setCode(event.target.value)} />
              <Button type="button" variant="secondary" disabled={!code || coupon.isPending} onClick={() => coupon.mutate({ code, subtotal })}>
                Apply
              </Button>
            </div>
            <Field label="Payment Method">
              <Select value={gateway} onChange={(event) => setGateway(event.target.value as PaymentGateway)}>
                <option value="stripe">Stripe</option>
                <option value="sslcommerz">SSLCommerz</option>
                <option value="bkash">bKash</option>
              </Select>
            </Field>
            {coupon.isError ? <p className="text-sm text-danger">{apiErrorMessage(coupon.error)}</p> : null}
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span>{currency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Discount</span>
              <span>{currency(discount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Shipping</span>
              <span>{currency(shipping)}</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between font-semibold text-ink">
                <span>Total</span>
                <span>{currency(total)}</span>
              </div>
            </div>
            {checkout.isError ? <p className="text-sm text-danger">{apiErrorMessage(checkout.error)}</p> : null}
            {payment.isError ? <p className="text-sm text-danger">{apiErrorMessage(payment.error)}</p> : null}
            <Button disabled={checkout.isPending || payment.isPending || subtotal === 0}>
              {checkout.isPending || payment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Place Order & Pay
            </Button>
          </CardContent>
        </Card>
      </form>
    </AuthGuard>
  );
}
