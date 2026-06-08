<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\WishlistRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class WishlistRepository implements WishlistRepositoryInterface
{
    public function forUser(User $user): Collection
    {
        return $user->wishlists()->with('product.images')->latest()->get();
    }

    public function add(User $user, int $productId): void
    {
        $user->wishlists()->firstOrCreate(['product_id' => $productId]);
    }

    public function remove(User $user, int $productId): void
    {
        $user->wishlists()->where('product_id', $productId)->delete();
    }
}
