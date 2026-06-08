<?php

namespace App\Repositories\Contracts;

use App\Models\Coupon;

interface CouponRepositoryInterface extends BaseRepositoryInterface
{
    public function findActiveByCode(string $code): ?Coupon;
}
