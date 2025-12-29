<?php

namespace App\Services\Cart;

use LaravelEasyRepository\BaseService;

interface CartService extends BaseService
{
    public function getCartForUser($request);

    public function addItemToCart($request);

    public function updateItem($cartItemId, $quantity);

    public function removeItem($cartItemId);

    public function clearCartForUser($request);

    public function migrateCart($request);
}
