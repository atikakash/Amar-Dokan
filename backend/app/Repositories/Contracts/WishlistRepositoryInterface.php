<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface WishlistRepositoryInterface
{
    public function forUser(User $user): Collection;

    public function add(User $user, int $productId): void;

    public function remove(User $user, int $productId): void;
}
