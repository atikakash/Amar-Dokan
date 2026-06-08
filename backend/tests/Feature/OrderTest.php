<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_verified_customer_can_create_order_from_cart(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->for($category)->create([
            'price' => 100,
            'stock_quantity' => 5,
        ]);

        Sanctum::actingAs($user);

        $this->postJson('/api/v1/cart/items', [
            'product_id' => $product->id,
            'quantity' => 2,
        ])->assertOk();

        $response = $this->postJson('/api/v1/orders', [
            'shipping_address' => [
                'name' => 'Customer',
                'phone' => '+10000000000',
                'address_line_1' => '123 Main Street',
                'city' => 'Dhaka',
                'country' => 'Bangladesh',
            ],
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.total', '200.00')
            ->assertJsonCount(1, 'data.items');

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock_quantity' => 3,
        ]);
    }
}
