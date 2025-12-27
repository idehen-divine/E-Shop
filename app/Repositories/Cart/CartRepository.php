<?php

namespace App\Repositories\Cart;

use LaravelEasyRepository\Repository;

interface CartRepository extends Repository
{
    public function getOrCreateCart($userId = null, $sessionId = null);

    public function getCartWithItems($cartId);

    public function addItem($cartId, $productId, $quantity, $price);

    public function updateItem($cartItemId, $quantity);

    public function removeItem($cartItemId);

    public function clearCart($cartId);

    public function getCartItem($cartId, $productId);

    public function getCartBySessionId($sessionId);

    public function getRecentSessionCarts($minutes = 60);
}
