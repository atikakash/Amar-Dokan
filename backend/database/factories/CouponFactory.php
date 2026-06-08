<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CouponFactory extends Factory
{
    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->unique()->bothify('SAVE##??')),
            'type' => fake()->randomElement(['fixed', 'percent']),
            'value' => fake()->randomFloat(2, 5, 30),
            'min_order_amount' => fake()->randomFloat(2, 25, 100),
            'max_discount_amount' => 50,
            'starts_at' => now()->subDay(),
            'expires_at' => now()->addMonth(),
            'usage_limit' => 500,
            'used_count' => 0,
            'is_active' => true,
        ];
    }
}
