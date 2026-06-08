<?php

namespace Database\Seeders;

use App\Constants\Role;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => Role::ADMIN,
        ]);

        User::factory()->create([
            'name' => 'Manager User',
            'email' => 'manager@example.com',
            'role' => Role::MANAGER,
        ]);

        User::factory()->create([
            'name' => 'Customer User',
            'email' => 'customer@example.com',
            'role' => Role::CUSTOMER,
        ]);

        $categories = Category::factory()->count(6)->create();

        $categories->each(function (Category $category): void {
            Product::factory()
                ->count(5)
                ->for($category)
                ->hasImages(3)
                ->create();
        });

        Coupon::factory()->create([
            'code' => 'WELCOME10',
            'type' => 'percent',
            'value' => 10,
            'min_order_amount' => 50,
            'max_discount_amount' => 25,
        ]);

        Coupon::factory()->count(4)->create();
    }
}
