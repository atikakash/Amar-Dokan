<?php

namespace App\Repositories\Contracts;

use App\Models\Review;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

interface ReviewRepositoryInterface
{
    public function productReviews(int $productId, int $perPage = 15): LengthAwarePaginator;

    public function create(User $user, array $data): Review;

    public function update(Review $review, array $data): Review;

    public function delete(Review $review): bool;
}
