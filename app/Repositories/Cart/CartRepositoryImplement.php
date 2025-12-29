<?php

namespace App\Repositories\Cart;

use App\Models\Cart;
use App\Models\CartItem;
use LaravelEasyRepository\Implementations\Eloquent;

/**
 * Cart Repository Implementation
 */
class CartRepositoryImplement extends Eloquent implements CartRepository
{
    protected Cart $model;

    public function __construct(Cart $model)
    {
        $this->model = $model;
    }

    /**
     * Get an existing cart with items or create a new one for the given user ID or session ID.
     *
     * @param  string|null  $userId
     * @param  string|null  $sessionId
     */
    public function getOrCreateCart($userId = null, $sessionId = null): Cart
    {
        $query = $this->model->with(['items.product']);

        if ($userId) {
            $query->where('user_id', $userId);
        } elseif ($sessionId) {
            $query->where('session_id', $sessionId)->whereNull('user_id');
        }

        $cart = $query->first();

        if (! $cart) {
            $cart = $this->model->create([
                'user_id' => $userId,
                'session_id' => $sessionId,
            ]);
            $cart->load(['items.product']);
        }

        return $cart;
    }

    /**
     * Get a cart with its items and product relationships by cart ID.
     *
     * @param  string  $cartId
     */
    public function getCartWithItems($cartId): ?Cart
    {
        return $this->model->with(['items.product'])->find($cartId);
    }

    /**
     * Add an item to a cart or update quantity if item already exists.
     *
     * @param  string  $cartId
     * @param  \App\Models\Product  $product
     * @param  int  $quantity
     */
    public function addItem($cartId, $product, $quantity): CartItem
    {
        $cartItem = CartItem::where('cart_id', $cartId)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            $cartItem = CartItem::create([
                'cart_id' => $cartId,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'price' => $product->price,
            ]);
        }

        return $cartItem->load('product');
    }

    /**
     * Update the quantity of a cart item.
     *
     * @param  string  $cartItemId
     * @param  int  $quantity
     */
    public function updateItem($cartItemId, $quantity): bool
    {
        $cartItem = CartItem::find($cartItemId);

        if (! $cartItem) {
            return false;
        }

        $cartItem->quantity = $quantity;

        return $cartItem->save();
    }

    /**
     * Remove an item from the cart.
     *
     * @param  string  $cartItemId
     */
    public function removeItem($cartItemId): bool
    {
        return CartItem::where('id', $cartItemId)->delete();
    }

    /**
     * Clear all items from a cart.
     *
     * @param  string  $cartId
     */
    public function clearCart($cartId): bool
    {
        return CartItem::where('cart_id', $cartId)->delete();
    }

    /**
     * Get a specific cart item by cart ID and product ID.
     *
     * @param  string  $cartId
     * @param  string  $productId
     */
    public function getCartItem($cartId, $productId): ?CartItem
    {
        return CartItem::where('cart_id', $cartId)
            ->where('product_id', $productId)
            ->first();
    }

    /**
     * Find a session cart for migration (checks cookie, session ID, then recent carts).
     *
     * @param  string|null  $cookieCartId
     * @param  string|null  $sessionId
     */
    public function findSessionCartForMigration($cookieCartId = null, $sessionId = null): ?Cart
    {
        if ($cookieCartId) {
            $cart = $this->getCartWithItems($cookieCartId);
            if ($cart && $cart->user_id === null) {
                return $cart;
            }
        }

        if ($sessionId) {
            $cart = $this->model->with('items.product')
                ->where('session_id', $sessionId)
                ->whereNull('user_id')
                ->first();

            if ($cart) {
                return $cart;
            }
        }

        $recentCart = $this->model->with('items.product')
            ->whereNull('user_id')
            ->where('created_at', '>=', now()->subMinutes(60))
            ->whereHas('items', function ($query) {
                $query->where('quantity', '>', 0);
            })
            ->orderBy('created_at', 'desc')
            ->first();

        return $recentCart && $recentCart->items->isNotEmpty() ? $recentCart : null;
    }

    /**
     * Migrate cart items from one cart to another.
     *
     * @param  string  $fromCartId
     * @param  string  $toCartId
     */
    public function migrateCartItems($fromCartId, $toCartId): void
    {
        $fromCart = $this->getCartWithItems($fromCartId);
        $toCart = $this->getCartWithItems($toCartId);

        if (! $fromCart || $fromCart->items->isEmpty()) {
            return;
        }

        foreach ($fromCart->items as $item) {
            $product = $item->product;

            if (! $product) {
                continue;
            }

            $existingItem = $this->getCartItem($toCartId, $item->product_id);

            if ($existingItem) {
                $newQuantity = $existingItem->quantity + $item->quantity;

                if ($product->stock < $newQuantity) {
                    $this->updateItem($existingItem->id, $product->stock);
                } else {
                    $this->updateItem($existingItem->id, $newQuantity);
                }
            } else {
                $quantityToAdd = min($item->quantity, $product->stock);

                if ($quantityToAdd > 0) {
                    $this->addItem($toCartId, $product, $quantityToAdd);
                }
            }
        }
    }

    /**
     * Update cart session ID.
     *
     * @param  string  $cartId
     * @param  string  $sessionId
     */
    public function updateCartSessionId($cartId, $sessionId): bool
    {
        $cart = $this->model->find($cartId);

        if (! $cart) {
            return false;
        }

        $cart->session_id = $sessionId;

        return $cart->save();
    }
}
