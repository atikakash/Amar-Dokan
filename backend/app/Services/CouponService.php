<?php

namespace App\Services;

use App\Exceptions\ApiException;
use App\Models\Coupon;
use App\Repositories\Contracts\CouponRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;

class CouponService
{
    public function __construct(private readonly CouponRepositoryInterface $coupons)
    {
    }

    public function list(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->coupons->paginate($perPage, $filters);
    }

    public function create(array $data): Coupon
    {
        $data['code'] = strtoupper($data['code']);

        return $this->coupons->create($data);
    }

    public function update(Coupon $coupon, array $data): Coupon
    {
        if (isset($data['code'])) {
            $data['code'] = strtoupper($data['code']);
        }

        return $this->coupons->update($coupon, $data);
    }

    public function validate(string $code, float $subtotal): array
    {
        $coupon = $this->coupons->findActiveByCode($code);

        if (! $coupon) {
            throw new ApiException('Coupon is invalid.', 422);
        }

        $now = Carbon::now();

        if (($coupon->starts_at && $coupon->starts_at->isFuture()) || ($coupon->expires_at && $coupon->expires_at->isPast())) {
            throw new ApiException('Coupon is not available.', 422);
        }

        if ($coupon->usage_limit !== null && $coupon->used_count >= $coupon->usage_limit) {
            throw new ApiException('Coupon usage limit reached.', 422);
        }

        if ($subtotal < (float) $coupon->min_order_amount) {
            throw new ApiException('Order does not meet the coupon minimum amount.', 422);
        }

        $discount = $coupon->type === 'percent'
            ? round($subtotal * ((float) $coupon->value / 100), 2)
            : (float) $coupon->value;

        if ($coupon->max_discount_amount !== null) {
            $discount = min($discount, (float) $coupon->max_discount_amount);
        }

        return [
            'coupon' => $coupon,
            'discount' => min($discount, $subtotal),
        ];
    }
}
