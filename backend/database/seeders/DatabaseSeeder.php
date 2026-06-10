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
        $this->seedUsers();
        $categories = $this->seedCategories();
        $this->seedProducts($categories);
        $this->seedCoupons();
    }

    private function seedUsers(): void
    {
        foreach ([
            ['name' => 'Admin User', 'email' => 'admin@example.com', 'role' => Role::ADMIN],
            ['name' => 'Manager User', 'email' => 'manager@example.com', 'role' => Role::MANAGER],
            ['name' => 'Customer User', 'email' => 'customer@example.com', 'role' => Role::CUSTOMER],
        ] as $user) {
            User::query()->updateOrCreate(
                ['email' => $user['email']],
                [
                    ...$user,
                    'password' => 'password',
                    'phone' => '+8801700000000',
                    'email_verified_at' => now(),
                ],
            );
        }
    }

    /**
     * @return array<string, Category>
     */
    private function seedCategories(): array
    {
        $categories = [];

        foreach ([
            [
                'key' => 'electronics',
                'name' => 'Electronics',
                'description' => 'Phones, audio, wearables, and smart devices.',
                'image' => 'https://images.unsplash.com/photo-1498049794561-7780e7231661',
                'sort_order' => 1,
            ],
            [
                'key' => 'fashion',
                'name' => 'Fashion',
                'description' => 'Everyday apparel, bags, and personal accessories.',
                'image' => 'https://images.unsplash.com/photo-1445205170230-053b83016050',
                'sort_order' => 2,
            ],
            [
                'key' => 'home',
                'name' => 'Home',
                'description' => 'Home, kitchen, decor, and lifestyle goods.',
                'image' => 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6',
                'sort_order' => 3,
            ],
        ] as $category) {
            $categories[$category['key']] = Category::query()->updateOrCreate(
                ['slug' => $category['key']],
                [
                    'parent_id' => null,
                    'name' => $category['name'],
                    'description' => $category['description'],
                    'image' => $category['image'],
                    'is_active' => true,
                    'sort_order' => $category['sort_order'],
                ],
            );
        }

        return $categories;
    }

    /**
     * @param array<string, Category> $categories
     */
    private function seedProducts(array $categories): void
    {
        foreach ([
            [
                'category' => 'electronics',
                'name' => 'Nova Wireless Headphones',
                'slug' => 'nova-wireless-headphones',
                'sku' => 'AUD-NOVA-01',
                'description' => 'Noise-cancelling wireless headphones with soft ear cups and all-day battery life.',
                'price' => 129.00,
                'compare_price' => 159.00,
                'stock_quantity' => 18,
                'is_featured' => true,
                'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
            ],
            [
                'category' => 'electronics',
                'name' => 'Pulse Smart Watch',
                'slug' => 'pulse-smart-watch',
                'sku' => 'WCH-PULSE-02',
                'description' => 'Fitness tracking, notifications, sleep insights, and water resistance.',
                'price' => 89.00,
                'compare_price' => null,
                'stock_quantity' => 12,
                'is_featured' => true,
                'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
            ],
            [
                'category' => 'fashion',
                'name' => 'Everyday Canvas Tote',
                'slug' => 'everyday-canvas-tote',
                'sku' => 'BAG-CANVAS-03',
                'description' => 'Durable tote bag with reinforced handles for daily carry.',
                'price' => 34.00,
                'compare_price' => 42.00,
                'stock_quantity' => 25,
                'is_featured' => false,
                'image' => 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7',
            ],
            [
                'category' => 'home',
                'name' => 'Ceramic Pour Over Set',
                'slug' => 'ceramic-pour-over-set',
                'sku' => 'HOM-POUR-04',
                'description' => 'A compact ceramic set for slow coffee mornings.',
                'price' => 48.00,
                'compare_price' => null,
                'stock_quantity' => 20,
                'is_featured' => true,
                'image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd',
            ],
        ] as $item) {
            $product = Product::query()->updateOrCreate(
                ['sku' => $item['sku']],
                [
                    'category_id' => $categories[$item['category']]->id,
                    'name' => $item['name'],
                    'slug' => $item['slug'],
                    'description' => $item['description'],
                    'price' => $item['price'],
                    'compare_price' => $item['compare_price'],
                    'stock_quantity' => $item['stock_quantity'],
                    'low_stock_threshold' => 5,
                    'is_active' => true,
                    'is_featured' => $item['is_featured'],
                    'attributes' => ['source' => 'demo'],
                ],
            );

            $product->images()->updateOrCreate(
                ['url' => $item['image']],
                [
                    'alt_text' => $item['name'],
                    'sort_order' => 0,
                    'is_primary' => true,
                ],
            );
        }
    }

    private function seedCoupons(): void
    {
        foreach ([
            [
                'code' => 'WELCOME10',
                'type' => 'percent',
                'value' => 10,
                'min_order_amount' => 50,
                'max_discount_amount' => 25,
            ],
            [
                'code' => 'SHIPFREE',
                'type' => 'fixed',
                'value' => 5,
                'min_order_amount' => 100,
                'max_discount_amount' => null,
            ],
        ] as $coupon) {
            Coupon::query()->updateOrCreate(
                ['code' => $coupon['code']],
                [
                    ...$coupon,
                    'starts_at' => now(),
                    'expires_at' => now()->addYear(),
                    'usage_limit' => 500,
                    'is_active' => true,
                ],
            );
        }
    }
}
