<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddCartItemRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Http\Resources\CartResource;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(private readonly CartService $carts)
    {
    }

    public function show(Request $request): CartResource
    {
        return new CartResource($this->carts->show($request->user()));
    }

    public function add(AddCartItemRequest $request): CartResource
    {
        return new CartResource($this->carts->add(
            $request->user(),
            (int) $request->validated('product_id'),
            (int) $request->validated('quantity')
        ));
    }

    public function update(UpdateCartItemRequest $request, int $item): CartResource
    {
        return new CartResource($this->carts->update($request->user(), $item, (int) $request->validated('quantity')));
    }

    public function remove(Request $request, int $item): CartResource
    {
        return new CartResource($this->carts->remove($request->user(), $item));
    }

    public function clear(Request $request): JsonResponse
    {
        $this->carts->clear($request->user());

        return response()->json(['message' => 'Cart cleared successfully.']);
    }
}
