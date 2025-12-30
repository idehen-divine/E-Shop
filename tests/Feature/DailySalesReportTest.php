<?php

namespace Tests\Feature;

use App\Mail\DailySalesReport;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class DailySalesReportTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\RoleAndPermissionSeeder::class);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('SUPER_ADMIN');
    }

    public function test_daily_sales_report_is_sent_with_sales_data(): void
    {
        Mail::fake();

        $category = ProductCategory::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
        ]);

        $product1 = Product::create([
            'name' => 'Product 1',
            'slug' => 'product-1',
            'sku' => 'PRD-001',
            'price' => 10000,
            'stock' => 50,
        ]);
        $product1->categories()->attach($category->id);

        $product2 = Product::create([
            'name' => 'Product 2',
            'slug' => 'product-2',
            'sku' => 'PRD-002',
            'price' => 20000,
            'stock' => 30,
        ]);
        $product2->categories()->attach($category->id);

        $user = User::factory()->create();
        $cart = Cart::create(['user_id' => $user->id]);

        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product1->id,
            'quantity' => 2,
            'price' => $product1->price,
        ]);

        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product2->id,
            'quantity' => 3,
            'price' => $product2->price,
        ]);

        Artisan::call('sales:send-daily-report');

        Mail::assertQueued(DailySalesReport::class, function ($mail) {
            return $mail->hasTo($this->admin->email);
        });
    }

    public function test_daily_sales_report_not_sent_when_no_sales(): void
    {
        Mail::fake();

        Artisan::call('sales:send-daily-report');

        Mail::assertNothingQueued();
    }

    public function test_daily_sales_report_only_includes_today_sales(): void
    {
        Mail::fake();

        $category = ProductCategory::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
        ]);

        $product = Product::create([
            'name' => 'Test Product',
            'slug' => 'test-product',
            'sku' => 'TEST-001',
            'price' => 15000,
            'stock' => 100,
        ]);
        $product->categories()->attach($category->id);

        $user = User::factory()->create();
        $todayCart = Cart::create(['user_id' => $user->id]);

        CartItem::create([
            'cart_id' => $todayCart->id,
            'product_id' => $product->id,
            'quantity' => 3,
            'price' => $product->price,
        ]);

        Artisan::call('sales:send-daily-report');

        Mail::assertQueued(DailySalesReport::class);

        Mail::assertQueued(DailySalesReport::class, function ($mail) {
            return $mail->reportData['sales']->count() === 1
                && $mail->reportData['totalItems'] == 3;
        });
    }

    public function test_daily_sales_report_calculates_correct_totals(): void
    {
        Mail::fake();

        $category = ProductCategory::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
        ]);

        $product1 = Product::create([
            'name' => 'Product A',
            'slug' => 'product-a',
            'sku' => 'PRDA-001',
            'price' => 10000,
            'stock' => 50,
        ]);
        $product1->categories()->attach($category->id);

        $product2 = Product::create([
            'name' => 'Product B',
            'slug' => 'product-b',
            'sku' => 'PRDB-002',
            'price' => 20000,
            'stock' => 30,
        ]);
        $product2->categories()->attach($category->id);

        $user = User::factory()->create();
        $cart = Cart::create(['user_id' => $user->id]);

        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product1->id,
            'quantity' => 2,
            'price' => $product1->price,
        ]);

        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product2->id,
            'quantity' => 3,
            'price' => $product2->price,
        ]);

        Artisan::call('sales:send-daily-report');

        Mail::assertQueued(DailySalesReport::class, function ($mail) {
            $expectedRevenue = (2 * 10000) + (3 * 20000);

            return $mail->reportData['totalRevenue'] == $expectedRevenue
                && $mail->reportData['totalItems'] == 5
                && $mail->reportData['uniqueProducts'] == 2;
        });
    }
}
