<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartEndpointTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $category = ProductCategory::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
        ]);

        $this->product = Product::create([
            'name' => 'Test Product',
            'slug' => 'test-product',
            'sku' => 'TEST-001',
            'price' => 10000,
            'stock' => 50,
        ]);
        $this->product->categories()->attach($category->id);
    }

    public function test_guest_can_view_cart(): void
    {
        $response = $this->get(route('cart.index'));

        $response->assertOk();
    }

    public function test_user_can_add_product_to_cart(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('cart.store'), [
                'product_id' => $this->product->id,
                'quantity' => 2,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('cart_items', [
            'product_id' => $this->product->id,
            'quantity' => 2,
        ]);
    }

    public function test_user_can_update_cart_item_quantity(): void
    {
        $cart = Cart::create(['user_id' => $this->user->id]);
        $cartItem = CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $this->product->id,
            'quantity' => 2,
            'price' => $this->product->price,
        ]);

        $response = $this->actingAs($this->user)
            ->put(route('cart.update', $cartItem->id), [
                'quantity' => 5,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('cart_items', [
            'id' => $cartItem->id,
            'quantity' => 5,
        ]);
    }

    public function test_user_can_remove_item_from_cart(): void
    {
        $cart = Cart::create(['user_id' => $this->user->id]);
        $cartItem = CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $this->product->id,
            'quantity' => 2,
            'price' => $this->product->price,
        ]);

        $response = $this->actingAs($this->user)
            ->delete(route('cart.destroy', $cartItem->id));

        $response->assertRedirect();
        $this->assertDatabaseMissing('cart_items', ['id' => $cartItem->id]);
    }

    public function test_user_can_clear_cart(): void
    {
        $cart = Cart::create(['user_id' => $this->user->id]);
        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $this->product->id,
            'quantity' => 2,
            'price' => $this->product->price,
        ]);

        $response = $this->actingAs($this->user)->delete(route('cart.clear'));

        $response->assertRedirect();
        $this->assertDatabaseMissing('cart_items', ['cart_id' => $cart->id]);
    }

    public function test_quantity_must_be_positive(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('cart.store'), [
                'product_id' => $this->product->id,
                'quantity' => 0,
            ]);

        $response->assertSessionHasErrors('quantity');
    }
}
