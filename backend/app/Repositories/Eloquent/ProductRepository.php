<?php

namespace App\Repositories\Eloquent;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    public function __construct(Product $product)
    {
        parent::__construct($product);
    }

    public function find(int $id): Product
    {
        return Product::query()->with(['category', 'images', 'reviews'])->findOrFail($id);
    }

    public function findBySlug(string $slug): Product
    {
        return Product::query()->with(['category', 'images', 'reviews'])->where('slug', $slug)->firstOrFail();
    }

    protected function filter(Builder $query, array $filters): Builder
    {
        return $query
            ->with(['category', 'images'])
            ->when($filters['category_id'] ?? null, fn (Builder $q, int|string $id) => $q->where('category_id', $id))
            ->when(isset($filters['is_active']), fn (Builder $q) => $q->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN)))
            ->when(isset($filters['is_featured']), fn (Builder $q) => $q->where('is_featured', filter_var($filters['is_featured'], FILTER_VALIDATE_BOOLEAN)))
            ->when($filters['search'] ?? null, fn (Builder $q, string $search) => $q->where(fn (Builder $qq) => $qq
                ->where('name', 'like', "%{$search}%")
                ->orWhere('sku', 'like', "%{$search}%")));
    }
}
