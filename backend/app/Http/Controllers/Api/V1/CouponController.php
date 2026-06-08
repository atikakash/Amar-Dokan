<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Coupon\StoreCouponRequest;
use App\Http\Requests\Coupon\UpdateCouponRequest;
use App\Http\Requests\Coupon\ValidateCouponRequest;
use App\Http\Resources\CouponResource;
use App\Models\Coupon;
use App\Services\CouponService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function __construct(private readonly CouponService $coupons)
    {
    }

    public function index(Request $request)
    {
        return CouponResource::collection($this->coupons->list($request->only(['is_active']), (int) $request->integer('per_page', 15)));
    }

    public function store(StoreCouponRequest $request): CouponResource
    {
        return new CouponResource($this->coupons->create($request->validated()));
    }

    public function show(Coupon $coupon): CouponResource
    {
        return new CouponResource($coupon);
    }

    public function update(UpdateCouponRequest $request, Coupon $coupon): CouponResource
    {
        return new CouponResource($this->coupons->update($coupon, $request->validated()));
    }

    public function destroy(Coupon $coupon): JsonResponse
    {
        $coupon->delete();

        return response()->json(['message' => 'Coupon deleted successfully.']);
    }

    public function validateCoupon(ValidateCouponRequest $request): JsonResponse
    {
        $validated = $this->coupons->validate($request->validated('code'), (float) $request->validated('subtotal'));

        return response()->json([
            'data' => [
                'coupon' => new CouponResource($validated['coupon']),
                'discount' => $validated['discount'],
            ],
        ]);
    }
}
