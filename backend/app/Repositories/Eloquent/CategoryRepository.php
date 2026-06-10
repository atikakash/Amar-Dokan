<?php

namespace App\Repositories\Eloquent;

use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class CategoryRepository extends BaseRepository implements CategoryRepositoryInterface
{
    public function __construct(Category $category)
    {
        parent::__construct($category);
    }

    protected function filter(Builder $query, array $filters): Builder
    {
        return $query
            ->when(isset($filters['is_active']), fn (Builder $q) => $q->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN)))
            ->when($filters['search'] ?? null, fn (Builder $q, string $search) => $q->where('name', 'like', "%{$search}%"))
            ->with(['parent', 'children']);
    }
}
