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
                'key' => 'cat-food',
                'name' => 'Cat Food',
                'description' => 'Dry food, wet food, kitten meals, and premium formulas.',
                'image' => 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119',
                'sort_order' => 1,
            ],
            [
                'key' => 'cat-litter',
                'name' => 'Cat Litter',
                'description' => 'Clumping litter, tofu litter, deodorizer, and trays.',
                'image' => 'https://images.unsplash.com/photo-1570824104453-508955ab713e',
                'sort_order' => 2,
            ],
            [
                'key' => 'accessories',
                'name' => 'Accessories',
                'description' => 'Bowls, collars, carriers, toys, grooming, and care items.',
                'image' => 'https://images.unsplash.com/photo-1545249390-6bdfa286032f',
                'sort_order' => 3,
            ],
            [
                'key' => 'dog-essentials',
                'name' => 'Dog Essentials',
                'description' => 'Food, treats, grooming, and daily care for dogs.',
                'image' => 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee',
                'sort_order' => 4,
            ],
            [
                'key' => 'health-care',
                'name' => 'Health Care',
                'description' => 'Deworming, supplements, hygiene, and routine wellness.',
                'image' => 'https://images.unsplash.com/photo-1615461066841-6116e61058f4',
                'sort_order' => 5,
            ],
            [
                'key' => 'treats',
                'name' => 'Treats',
                'description' => 'Crunchy bites, creamy treats, and reward snacks.',
                'image' => 'https://images.unsplash.com/photo-1601758064224-c3c94cf1f14f',
                'sort_order' => 6,
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
                'category' => 'cat-food',
                'name' => 'Reflex Plus Adult Cat Food Salmon 1.5kg',
                'slug' => 'reflex-plus-adult-cat-food-salmon-1-5kg',
                'sku' => 'CAT-REF-SAL-15',
                'description' => 'Complete salmon dry food for adult cats with balanced protein, vitamins, and digestive support.',
                'price' => 1450.00,
                'compare_price' => 1650.00,
                'stock_quantity' => 18,
                'is_featured' => true,
                'attributes' => ['weight' => '1.5kg', 'flavour' => 'Salmon', 'sold_count' => '126', 'reward_points' => '14', 'delivery_note' => 'Inside Dhaka 1-2 days'],
                'image' => 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119',
            ],
            [
                'category' => 'cat-litter',
                'name' => 'Tofu Cat Litter Green Tea 6L',
                'slug' => 'tofu-cat-litter-green-tea-6l',
                'sku' => 'LIT-TOFU-GT-06',
                'description' => 'Low-dust clumping tofu litter with green tea fragrance and easy disposal.',
                'price' => 780.00,
                'compare_price' => 900.00,
                'stock_quantity' => 4,
                'is_featured' => true,
                'attributes' => ['size' => '6L', 'scent' => 'Green Tea', 'sold_count' => '82', 'reward_points' => '8', 'delivery_note' => 'Same-day delivery in selected Dhaka areas'],
                'image' => 'https://images.unsplash.com/photo-1570824104453-508955ab713e',
            ],
            [
                'category' => 'accessories',
                'name' => 'Adjustable Cat Harness and Leash Set',
                'slug' => 'adjustable-cat-harness-and-leash-set',
                'sku' => 'ACC-HARNESS-03',
                'description' => 'Soft breathable harness with secure clips and a matching leash for outdoor walks.',
                'price' => 520.00,
                'compare_price' => 650.00,
                'stock_quantity' => 25,
                'is_featured' => false,
                'attributes' => ['sizes' => 'S, M, L', 'colors' => 'Red, Blue, Black', 'sold_count' => '64', 'reward_points' => '5', 'delivery_note' => 'Exchange available for size issue'],
                'image' => 'https://images.unsplash.com/photo-1545249390-6bdfa286032f',
            ],
            [
                'category' => 'treats',
                'name' => 'Creamy Cat Treat Tuna Pack',
                'slug' => 'creamy-cat-treat-tuna-pack',
                'sku' => 'TRT-CREAM-TUNA-04',
                'description' => 'Smooth tuna treat sticks for training, bonding, and picky snack moments.',
                'price' => 260.00,
                'compare_price' => null,
                'stock_quantity' => 20,
                'is_featured' => true,
                'attributes' => ['flavour' => 'Tuna', 'pack' => '5 sticks', 'sold_count' => '213', 'reward_points' => '3', 'delivery_note' => 'Best paired with dry meals'],
                'image' => 'https://images.unsplash.com/photo-1601758064224-c3c94cf1f14f',
            ],
            [
                'category' => 'dog-essentials',
                'name' => 'Drools Puppy Chicken and Egg 3kg',
                'slug' => 'drools-puppy-chicken-and-egg-3kg',
                'sku' => 'DOG-DROOLS-PUP-05',
                'description' => 'High-protein puppy food with chicken, egg, calcium, and growth support nutrients.',
                'price' => 2350.00,
                'compare_price' => 2600.00,
                'stock_quantity' => 9,
                'is_featured' => true,
                'attributes' => ['weight' => '3kg', 'flavour' => 'Chicken and Egg', 'sold_count' => '45', 'reward_points' => '24', 'delivery_note' => 'Heavy item delivery charge may vary'],
                'image' => 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee',
            ],
            [
                'category' => 'health-care',
                'name' => 'Cat Deworming Tablet 10mg',
                'slug' => 'cat-deworming-tablet-10mg',
                'sku' => 'HLT-DEWORM-06',
                'description' => 'Routine deworming support for cats. Use based on weight and vet guidance.',
                'price' => 120.00,
                'compare_price' => null,
                'stock_quantity' => 31,
                'is_featured' => false,
                'attributes' => ['dose' => '10mg', 'pet_type' => 'Cat', 'sold_count' => '97', 'reward_points' => '1', 'delivery_note' => 'Consult a vet for correct dosage'],
                'image' => 'https://images.unsplash.com/photo-1615461066841-6116e61058f4',
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
                    'attributes' => $item['attributes'],
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
                'min_order_amount' => 500,
                'max_discount_amount' => 250,
            ],
            [
                'code' => 'SHIPFREE',
                'type' => 'fixed',
                'value' => 80,
                'min_order_amount' => 1500,
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
