<?php

namespace App\Repositories\Eloquent;

use App\Models\Cart;
use App\Models\User;
use App\Repositories\Contracts\CartRepositoryInterface;

class CartRepository implements CartRepositoryInterface
{
    public function activeForUser(User $user): Cart
    {
        return Cart::query()->firstOrCreate(
            ['user_id' => $user->id, 'status' => 'active'],
            ['session_id' => null]
        )->load(['items.product.images']);
    }

    public function addOrUpdateItem(Cart $cart, int $productId, int $quantity, string $unitPrice): Cart
    {
        $item = $cart->items()->firstOrNew(['product_id' => $productId]);
        $item->quantity = $item->exists ? $item->quantity + $quantity : $quantity;
        $item->unit_price = $unitPrice;
        $item->save();

        return $cart->refresh()->load(['items.product.images']);
    }

    public function updateItem(Cart $cart, int $itemId, int $quantity): Cart
    {
        $cart->items()->whereKey($itemId)->firstOrFail()->update(['quantity' => $quantity]);

        return $cart->refresh()->load(['items.product.images']);
    }

    public function removeItem(Cart $cart, int $itemId): Cart
    {
        $cart->items()->whereKey($itemId)->delete();

        return $cart->refresh()->load(['items.product.images']);
    }

    public function clear(Cart $cart): Cart
    {
        $cart->items()->delete();

        return $cart->refresh()->load(['items.product.images']);
    }
}
