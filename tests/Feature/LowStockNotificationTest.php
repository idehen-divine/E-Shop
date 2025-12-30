<?php

namespace Tests\Feature;

use App\Jobs\SendLowStockNotification;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class LowStockNotificationTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles and permissions
        $this->seed(\Database\Seeders\RoleAndPermissionSeeder::class);

        // Create admin user
        $this->admin = User::factory()->create();
        $this->admin->assignRole('SUPER_ADMIN');
    }

    public function test_low_stock_notification_is_dispatched_when_stock_falls_below_threshold(): void
    {
        Queue::fake();

        $category = ProductCategory::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
        ]);

        $product = Product::create([
            'name' => 'Test Product',
            'slug' => 'test-product',
            'sku' => 'TEST-001',
            'price' => 10000,
            'stock' => 15,
        ]);
        $product->categories()->attach($category->id);

        // Update stock to below threshold (default is 10)
        $this->actingAs($this->admin)
            ->patchJson("/admin/products/{$product->id}/update-stock", [
                'stock' => 8,
            ])
            ->assertOk();

        Queue::assertPushed(SendLowStockNotification::class, function ($job) use ($product) {
            return $job->product->id === $product->id;
        });
    }

    public function test_low_stock_notification_is_not_dispatched_when_stock_stays_above_threshold(): void
    {
        Queue::fake();

        $category = ProductCategory::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
        ]);

        $product = Product::create([
            'name' => 'Test Product',
            'slug' => 'test-product',
            'sku' => 'TEST-001',
            'price' => 10000,
            'stock' => 15,
        ]);
        $product->categories()->attach($category->id);

        // Update stock but keep it above threshold
        $this->actingAs($this->admin)
            ->patchJson("/admin/products/{$product->id}/update-stock", [
                'stock' => 12,
            ])
            ->assertOk();

        Queue::assertNotPushed(SendLowStockNotification::class);
    }

    public function test_low_stock_notification_is_not_dispatched_when_stock_was_already_below_threshold(): void
    {
        Queue::fake();

        $category = ProductCategory::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
        ]);

        $product = Product::create([
            'name' => 'Test Product',
            'slug' => 'test-product',
            'sku' => 'TEST-001',
            'price' => 10000,
            'stock' => 5, // Already below threshold
        ]);
        $product->categories()->attach($category->id);

        // Update stock to another low value
        $this->actingAs($this->admin)
            ->patchJson("/admin/products/{$product->id}/update-stock", [
                'stock' => 3,
            ])
            ->assertOk();

        // Should not dispatch notification again
        Queue::assertNotPushed(SendLowStockNotification::class);
    }

    public function test_low_stock_notification_email_contains_correct_product_details(): void
    {
        $product = Product::create([
            'name' => 'Test Product',
            'slug' => 'test-product',
            'sku' => 'TEST-SKU-123',
            'price' => 10000,
            'stock' => 5,
        ]);

        $mailable = new \App\Mail\LowStockNotification($product, 10);

        $mailable->assertSeeInHtml('Test Product');
        $mailable->assertSeeInHtml('TEST-SKU-123');
        $mailable->assertSeeInHtml('5 units');
        $mailable->assertSeeInHtml('10 units');
    }
}
