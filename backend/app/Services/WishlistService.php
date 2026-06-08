<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\WishlistRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class WishlistService
{
    public function __construct(private readonly WishlistRepositoryInterface $wishlists)
    {
    }

    public function list(User $user): Collection
    {
        return $this->wishlists->forUser($user);
    }

    public function add(User $user, int $productId): void
    {
        $this->wishlists->add($user, $productId);
    }

    public function remove(User $user, int $productId): void
    {
        $this->wishlists->remove($user, $productId);
    }
}
