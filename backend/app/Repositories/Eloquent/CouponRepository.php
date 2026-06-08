<?php

namespace App\Repositories\Eloquent;

use App\Models\Coupon;

class CouponRepository extends BaseRepository
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
