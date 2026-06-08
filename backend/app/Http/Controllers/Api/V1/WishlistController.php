<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WishlistResource;
use App\Services\WishlistService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function __construct(private readonly WishlistService $wishlists)
    {
    }

    public function index(Request $request)
    {
        return WishlistResource::collection($this->wishlists->list($request->user()));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate(['product_id' => ['required', 'integer', 'exists:products,id']]);
        $this->wishlists->add($request->user(), (int) $data['product_id']);

        return response()->json(['message' => 'Product added to wishlist.'], 201);
    }

    public function destroy(Request $request, int $product): JsonResponse
    {
        $this->wishlists->remove($request->user(), $product);

        return response()->json(['message' => 'Product removed from wishlist.']);
    }
}
