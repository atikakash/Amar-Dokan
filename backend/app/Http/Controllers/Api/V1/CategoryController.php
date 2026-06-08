<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(private readonly CategoryService $categories)
    {
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'is_active']);

        if (! $request->user()?->isStaff() && ! array_key_exists('is_active', $filters)) {
            $filters['is_active'] = true;
        }

        return CategoryResource::collection(
            $this->categories->list($filters, (int) $request->integer('per_page', 15))
        );
    }

    public function store(StoreCategoryRequest $request): CategoryResource
    {
        return new CategoryResource($this->categories->create($request->validated()));
    }

    public function show(Category $category): CategoryResource
    {
        return new CategoryResource($category->load(['parent', 'children']));
    }

    public function update(UpdateCategoryRequest $request, Category $category): CategoryResource
    {
        return new CategoryResource($this->categories->update($category, $request->validated()));
    }

    public function destroy(Category $category): JsonResponse
    {
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully.']);
    }
}
