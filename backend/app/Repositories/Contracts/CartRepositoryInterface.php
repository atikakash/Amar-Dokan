<?php

namespace App\Repositories\Contracts;

use App\Models\Cart;
use App\Models\User;

interface CartRepositoryInterface
{
    public function activeForUser(User $user): Cart;

    public function addOrUpdateItem(Cart $cart, int $productId, int $quantity, string $unitPrice): Cart;

    public function updateItem(Cart $cart, int $itemId, int $quantity): Cart;

    public function removeItem(Cart $cart, int $itemId): Cart;

    public function clear(Cart $cart): Cart;
}
