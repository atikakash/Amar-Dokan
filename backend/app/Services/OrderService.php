<?php

namespace App\Services;

use App\Events\OrderPlaced;
use App\Exceptions\ApiException;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Repositories\Contracts\OrderRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class OrderService
{
    public function __construct(
        private readonly CartService $cartService,
        private readonly CouponService $couponService,
        private readonly OrderRepositoryInterface $orders,
    ) {
    }

    public function list(User $user, int $perPage): LengthAwarePaginator
    {
        return $user->isStaff()
            ? $this->orders->paginateAll($perPage)
            : $this->orders->paginateForUser($user, $perPage);
    }

    public function create(User $user, array $data): Order
    {
        return DB::transaction(function () use ($user, $data): Order {
            $cart = $this->cartService->show($user)->load('items.product');

            if ($cart->items->isEmpty()) {
                throw new ApiException('Cart is empty.', 422);
            }

            $subtotal = $cart->items->sum(fn (CartItem $item): float => (float) $item->unit_price * $item->quantity);
            $discount = 0.0;
            $couponCode = null;

            if (! empty($data['coupon_code'])) {
                $validatedCoupon = $this->couponService->validate($data['coupon_code'], $subtotal);
                $discount = $validatedCoupon['discount'];
                $couponCode = $validatedCoupon['coupon']->code;
                $validatedCoupon['coupon']->increment('used_count');
            }

            $taxTotal = (float) ($data['tax_total'] ?? 0);
            $shippingTotal = (float) ($data['shipping_total'] ?? 0);
            $total = max(0, $subtotal - $discount + $taxTotal + $shippingTotal);

            $items = $cart->items->map(function (CartItem $item): array {
                /** @var Product $product */
                $product = Product::query()->lockForUpdate()->findOrFail($item->product_id);

                if ($product->stock_quantity < $item->quantity) {
                    throw new ApiException("Insufficient stock for {$product->name}.", 409);
                }

                $product->decrement('stock_quantity', $item->quantity);

                return [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total' => (float) $item->unit_price * $item->quantity,
                ];
            })->all();

            $order = $this->orders->createWithItems([
                'user_id' => $user->id,
                'order_number' => $this->makeOrderNumber(),
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'subtotal' => $subtotal,
                'discount_total' => $discount,
                'tax_total' => $taxTotal,
                'shipping_total' => $shippingTotal,
                'total' => $total,
                'coupon_code' => $couponCode,
                'customer_note' => $data['customer_note'] ?? null,
                'shipping_address' => $data['shipping_address'],
                'billing_address' => $data['billing_address'] ?? $data['shipping_address'],
            ], $items);

            $this->cartService->clear($user);

            event(new OrderPlaced($order));
            Log::info('Order created from cart', ['order_id' => $order->id, 'user_id' => $user->id]);

            return $order;
        });
    }

    public function show(User $user, int $id): Order
    {
        return $this->orders->findForUser($user, $id);
    }

    public function updateStatus(Order $order, string $status): Order
    {
        return $this->orders->updateStatus($order, $status);
    }

    private function makeOrderNumber(): string
    {
        return 'ORD-'.now()->format('Ymd').'-'.Str::upper(Str::random(8));
    }
}
