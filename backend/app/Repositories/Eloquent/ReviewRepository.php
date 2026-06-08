<?php

namespace App\Repositories\Eloquent;

use App\Models\Review;
use App\Models\User;
use App\Repositories\Contracts\ReviewRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class ReviewRepository implements ReviewRepositoryInterface
{
    public function productReviews(int $productId, int $perPage = 15): LengthAwarePaginator
    {
        return Review::query()
            ->with('user')
            ->where('product_id', $productId)
            ->where('is_approved', true)
            ->latest()
            ->paginate($perPage);
    }

    public function create(User $user, array $data): Review
    {
        return $user->reviews()->create($data)->load(['user', 'product']);
    }

    public function update(Review $review, array $data): Review
    {
        $review->update($data);

        return $review->refresh()->load(['user', 'product']);
    }

    public function delete(Review $review): bool
    {
        return (bool) $review->delete();
    }
}
