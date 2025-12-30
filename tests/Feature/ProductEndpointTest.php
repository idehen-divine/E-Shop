<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductEndpointTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected ProductCategory $category;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\RoleAndPermissionSeeder::class);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('SUPER_ADMIN');

        $this->category = ProductCategory::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
        ]);
    }

    public function test_guest_can_view_products_list(): void
    {
        $product = Product::create([
            'name' => 'Test Product',
            'slug' => 'test-product',
            'sku' => 'TEST-001',
            'price' => 10000,
            'stock' => 50,
        ]);
        $product->categories()->attach($this->category->id);

        $response = $this->get(route('home'));

        $response->assertOk();
    }

    public function test_guest_can_view_single_product(): void
    {
        $product = Product::create([
            'name' => 'Test Product',
            'slug' => 'test-product',
            'sku' => 'TEST-001',
            'price' => 10000,
            'stock' => 50,
        ]);
        $product->categories()->attach($this->category->id);

        $response = $this->get(route('products.show', $product->id));

        $response->assertOk();
    }

    public function test_admin_can_view_admin_products_list(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.products.index'));

        $response->assertOk();
    }

    public function test_guest_cannot_access_admin_products(): void
    {
        $response = $this->get(route('admin.products.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_admin_can_create_product(): void
    {
        $response = $this->actingAs($this->admin)
            ->post(route('admin.products.store'), [
                'name' => 'New Product',
                'sku' => 'NEW-001',
                'price' => 15000,
                'stock' => 100,
                'categories' => [$this->category->id],
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('products', ['name' => 'New Product']);
    }

    public function test_admin_can_update_product(): void
    {
        $product = Product::create([
            'name' => 'Old Name',
            'slug' => 'old-name',
            'sku' => 'OLD-001',
            'price' => 10000,
            'stock' => 50,
        ]);
        $product->categories()->attach($this->category->id);

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.products.update', $product->id), [
                'name' => 'Updated Name',
                'sku' => 'UPD-001',
                'price' => 20000,
                'stock' => 75,
                'categories' => [$this->category->id],
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('products', ['name' => 'Updated Name']);
    }

    public function test_admin_can_delete_product(): void
    {
        $product = Product::create([
            'name' => 'To Delete',
            'slug' => 'to-delete',
            'sku' => 'DEL-001',
            'price' => 10000,
            'stock' => 50,
        ]);

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.products.destroy', $product->id));

        $response->assertRedirect();
        $this->assertSoftDeleted('products', ['id' => $product->id]);
    }

    public function test_admin_can_toggle_product_active_status(): void
    {
        $product = Product::create([
            'name' => 'Test Product',
            'slug' => 'test-product',
            'sku' => 'TEST-001',
            'price' => 10000,
            'stock' => 50,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.products.toggle-active', $product->id));

        $response->assertRedirect(route('admin.products.index'));
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'is_active' => false,
        ]);
    }

    public function test_admin_can_toggle_product_featured_status(): void
    {
        $product = Product::create([
            'name' => 'Test Product',
            'slug' => 'test-product',
            'sku' => 'TEST-001',
            'price' => 10000,
            'stock' => 50,
            'is_featured' => false,
        ]);

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.products.toggle-featured', $product->id));

        $response->assertRedirect(route('admin.products.index'));
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'is_featured' => true,
        ]);
    }

    public function test_admin_can_update_product_stock(): void
    {
        $product = Product::create([
            'name' => 'Test Product',
            'slug' => 'test-product',
            'sku' => 'TEST-001',
            'price' => 10000,
            'stock' => 50,
        ]);
        $product->categories()->attach($this->category->id);

        $response = $this->actingAs($this->admin)
            ->patchJson(route('admin.products.update-stock', $product->id), [
                'stock' => 100,
            ]);

        $response->assertOk();
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock' => 100,
        ]);
    }
}
