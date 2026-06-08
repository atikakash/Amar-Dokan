<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_list_products(): void
    {
        $category = Category::factory()->create();
        Product::factory()->for($category)->count(2)->create();

        $response = $this->getJson('/api/v1/products');

        $response->assertOk()->assertJsonCount(2, 'data');
    }
}
