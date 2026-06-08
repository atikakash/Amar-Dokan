<?php

namespace App\Services;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class ProductService
{
    public function __construct(private readonly ProductRepositoryInterface $products)
    {
    }

    public function list(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->products->paginate($perPage, $filters);
    }

    public function create(array $data): Product
    {
        $images = $data['images'] ?? [];
        unset($data['images']);
        $data['slug'] ??= Str::slug($data['name']);

        /** @var Product $product */
        $product = $this->products->create($data);
        $this->syncImages($product, $images);

        return $product->load(['category', 'images']);
    }

    public function update(Product $product, array $data): Product
    {
        $images = $data['images'] ?? null;
        unset($data['images']);

        if (isset($data['name']) && ! isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        /** @var Product $product */
        $product = $this->products->update($product, $data);

        if (is_array($images)) {
            $product->images()->delete();
            $this->syncImages($product, $images);
        }

        return $product->load(['category', 'images']);
    }

    private function syncImages(Product $product, array $images): void
    {
        foreach ($images as $index => $image) {
            $product->images()->create([
                'url' => $image['url'],
                'alt_text' => $image['alt_text'] ?? $product->name,
                'sort_order' => $image['sort_order'] ?? $index,
                'is_primary' => $image['is_primary'] ?? $index === 0,
            ]);
        }
    }
}
