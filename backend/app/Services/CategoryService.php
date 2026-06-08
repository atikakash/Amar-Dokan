<?php

namespace App\Services;

use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class CategoryService
{
    public function __construct(private readonly CategoryRepositoryInterface $categories)
    {
    }

    public function list(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->categories->paginate($perPage, $filters);
    }

    public function create(array $data): Category
    {
        $data['slug'] ??= Str::slug($data['name']);

        return $this->categories->create($data);
    }

    public function update(Category $category, array $data): Category
    {
        if (isset($data['name']) && ! isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return $this->categories->update($category, $data);
    }
}
