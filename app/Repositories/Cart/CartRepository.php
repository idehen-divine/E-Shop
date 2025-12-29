<?php

namespace App\Repositories\Cart;

use LaravelEasyRepository\Repository;

interface CartRepository extends Repository
{
    public function getOrCreateCart($userId = null, $sessionId = null);

    public function getCartWithItems($cartId);

    public function addItem($cartId, $product, $quantity);

    public function updateItem($cartItemId, $quantity);

    public function removeItem($cartItemId);

    public function clearCart($cartId);

    public function getCartItem($cartId, $productId);

    public function findSessionCartForMigration($cookieCartId = null, $sessionId = null);

    public function migrateCartItems($fromCartId, $toCartId);

    public function updateCartSessionId($cartId, $sessionId);
}
