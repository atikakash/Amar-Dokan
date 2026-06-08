<?php

namespace App\Services;

use App\Models\Review;
use App\Models\User;
use App\Repositories\Contracts\ReviewRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class ReviewService
{
    public function __construct(private readonly ReviewRepositoryInterface $reviews)
    {
    }

    public function productReviews(int $productId, int $perPage): LengthAwarePaginator
    {
        return $this->reviews->productReviews($productId, $perPage);
    }

    public function create(User $user, array $data): Review
    {
        return $this->reviews->create($user, $data);
    }

    public function update(Review $review, array $data): Review
    {
        return $this->reviews->update($review, $data);
    }

    public function delete(Review $review): bool
    {
        return $this->reviews->delete($review);
    }
}
