<?php

namespace App\Services;

use App\Exceptions\ApiException;
use App\Models\Cart;
use App\Models\Product;
use App\Models\User;
use App\Repositories\Contracts\CartRepositoryInterface;

class CartService
{
    public function __construct(private readonly CartRepositoryInterface $carts)
    {
    }

    public function show(User $user): Cart
    {
        return $this->carts->activeForUser($user);
    }

    public function add(User $user, int $productId, int $quantity): Cart
    {
        $product = Product::query()->where('is_active', true)->findOrFail($productId);

        if ($product->stock_quantity < $quantity) {
            throw new ApiException('Insufficient product stock.', 409);
        }

        return $this->carts->addOrUpdateItem($this->show($user), $product->id, $quantity, $product->price);
    }

    public function update(User $user, int $itemId, int $quantity): Cart
    {
        $cart = $this->show($user);
        $item = $cart->items()->with('product')->whereKey($itemId)->firstOrFail();

        if ($item->product->stock_quantity < $quantity) {
            throw new ApiException('Insufficient product stock.', 409);
        }

        return $this->carts->updateItem($cart, $itemId, $quantity);
    }

    public function remove(User $user, int $itemId): Cart
    {
        return $this->carts->removeItem($this->show($user), $itemId);
    }

    public function clear(User $user): Cart
    {
        return $this->carts->clear($this->show($user));
    }
}
