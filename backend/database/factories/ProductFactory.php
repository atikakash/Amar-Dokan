<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);
        $price = fake()->randomFloat(2, 20, 500);

        return [
            'category_id' => Category::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'sku' => strtoupper(fake()->unique()->bothify('SKU-####-???')),
            'description' => fake()->paragraphs(3, true),
            'price' => $price,
            'compare_price' => $price + fake()->randomFloat(2, 5, 80),
            'cost_price' => max(1, $price - fake()->randomFloat(2, 5, 100)),
            'stock_quantity' => fake()->numberBetween(10, 150),
            'low_stock_threshold' => 5,
            'is_active' => true,
            'is_featured' => fake()->boolean(25),
            'attributes' => [
                'brand' => fake()->company(),
                'color' => fake()->safeColorName(),
            ],
        ];
    }
}
