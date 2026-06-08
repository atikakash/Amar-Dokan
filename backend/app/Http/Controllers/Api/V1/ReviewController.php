<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Http\Requests\Review\UpdateReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use App\Services\ReviewService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function __construct(private readonly ReviewService $reviews)
    {
    }

    public function index(Request $request, int $product)
    {
        return ReviewResource::collection(
            $this->reviews->productReviews($product, (int) $request->integer('per_page', 15))
        );
    }

    public function store(StoreReviewRequest $request): ReviewResource
    {
        return new ReviewResource($this->reviews->create($request->user(), $request->validated()));
    }

    public function update(UpdateReviewRequest $request, Review $review): ReviewResource
    {
        return new ReviewResource($this->reviews->update($review, $request->validated()));
    }

    public function destroy(Request $request, Review $review): JsonResponse
    {
        abort_unless($request->user()->id === $review->user_id || $request->user()->isStaff(), 403);
        $this->reviews->delete($review);

        return response()->json(['message' => 'Review deleted successfully.']);
    }
}
