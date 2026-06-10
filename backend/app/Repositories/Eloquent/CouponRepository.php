<?php

namespace App\Repositories\Eloquent;

use App\Models\Coupon;
use App\Repositories\Contracts\CouponRepositoryInterface;

class CouponRepository extends BaseRepository implements CouponRepositoryInterface
{
    public function __construct(Coupon $coupon)
    {
        parent::__construct($coupon);
    }

    public function findActiveByCode(string $code): ?Coupon
    {
        return Coupon::query()
            ->where('code', strtoupper($code))
            ->where('is_active', true)
            ->first();
    }
}
