<?php

namespace App\Services\Cart;

use App\Http\Resources\CartResource;
use App\Models\Product;
use App\Repositories\Cart\CartRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use LaravelEasyRepository\ServiceApi;

/**
 * Cart Service Implementation
 */
class CartServiceImplement extends ServiceApi implements CartService
{
    protected CartRepository $mainRepository;

    public function __construct(CartRepository $mainRepository)
    {
        $this->mainRepository = $mainRepository;
    }

    /**
     * Get or create a cart for the given user ID or session ID.
     *
     * @param  string|null  $userId
     * @param  string|null  $sessionId
     */
    private function getOrCreateCart($userId = null, $sessionId = null): CartServiceImplement
    {
        try {
            $cart = $this->mainRepository->getOrCreateCart($userId, $sessionId);

            if (! $userId && $cart) {
                Cookie::queue('session_cart_id', $cart->id, 60 * 24 * 7);
            }

            return $this->setCode(200)
                ->setMessage('Cart retrieved successfully')
                ->setData(['cart' => $cart]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while retrieving cart')
                ->setError($e->getMessage());
        }
    }

    /**
     * Get a cart with its items by cart ID.
     *
     * @param  string  $cartId
     */
    private function getCart($cartId): CartServiceImplement
    {
        try {
            $cart = $this->mainRepository->getCartWithItems($cartId);

            if (! $cart) {
                return $this->setCode(404)
                    ->setMessage('Cart not found');
            }

            $cartResource = new CartResource($cart);

            return $this->setCode(200)
                ->setMessage('Cart retrieved successfully')
                ->setData(['cart' => $cartResource->toArray(request())]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while retrieving cart')
                ->setError($e->getMessage());
        }
    }

    /**
     * Get the cart for the authenticated user or session.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function getCartForUser($request): CartServiceImplement
    {
        try {
            if (! $request instanceof Request) {
                return $this->setCode(400)
                    ->setMessage('Invalid request provided');
            }

            $userId = $request->user()?->id;
            $sessionId = $request->session()->getId();

            $cartResult = $this->getOrCreateCart($userId, $sessionId);

            if ($cartResult->getCode() !== 200) {
                return $cartResult;
            }

            $cartData = $cartResult->getData();

            if (! $cartData || ! isset($cartData['cart'])) {
                return $this->setCode(404)
                    ->setMessage('Cart not found');
            }

            $cart = $cartData['cart'];

            $cartWithItems = $this->getCart($cart->id);

            if ($cartWithItems->getCode() !== 200) {
                return $cartWithItems;
            }

            return $cartWithItems;
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while retrieving cart')
                ->setError($e->getMessage());
        }
    }

    /**
     * Get a map of product IDs to cart item details for the user or session.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function getCartItemsMap($request): CartServiceImplement
    {
        try {
            if (! $request instanceof Request) {
                return $this->setCode(400)
                    ->setMessage('Invalid request provided');
            }

            $userId = $request->user()?->id;
            $sessionId = $request->session()->getId();

            $cartResult = $this->getOrCreateCart($userId, $sessionId);
            $cartItems = [];

            if ($cartResult->getCode() === 200) {
                $cartResultData = $cartResult->getData();

                if ($cartResultData && isset($cartResultData['cart'])) {
                    $cart = $cartResultData['cart'];
                    $cartWithItems = $this->getCart($cart->id);

                    if ($cartWithItems->getCode() === 200) {
                        $cartWithItemsData = $cartWithItems->getData();

                        if ($cartWithItemsData && isset($cartWithItemsData['cart'])) {
                            $cartData = $cartWithItemsData['cart'];
                            $cartItems = $cartData->items->mapWithKeys(function ($item) {
                                return [
                                    (string) $item->product_id => [
                                        'id' => $item->id,
                                        'quantity' => $item->quantity,
                                    ],
                                ];
                            })->toArray();
                        }
                    }
                }
            }

            return $this->setCode(200)
                ->setMessage('Cart items retrieved successfully')
                ->setData(['cartItems' => $cartItems]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while retrieving cart items')
                ->setError($e->getMessage());
        }
    }

    /**
     * Add an item to a cart.
     *
     * @param  string  $cartId
     * @param  string  $productId
     * @param  int  $quantity
     */
    private function addItem($cartId, $productId, $quantity): CartServiceImplement
    {
        try {
            $product = Product::find($productId);

            if (! $product) {
                return $this->setCode(404)
                    ->setMessage('Product not found');
            }

            if ($product->stock < $quantity) {
                return $this->setCode(400)
                    ->setMessage('Insufficient stock available');
            }

            $cartItem = $this->mainRepository->addItem($cartId, $productId, $quantity, $product->price);

            return $this->setCode(200)
                ->setMessage('Item added to cart successfully')
                ->setData(['cart_item' => $cartItem]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while adding item to cart')
                ->setError($e->getMessage());
        }
    }

    /**
     * Add an item to the user's or session's cart.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function addItemToCart($request): CartServiceImplement
    {
        try {
            if (! $request instanceof Request) {
                return $this->setCode(400)
                    ->setMessage('Invalid request provided');
            }

            $userId = $request->user()?->id;
            $sessionId = $request->session()->getId();
            $productId = $request->product_id;
            $quantity = $request->quantity;

            $cartResult = $this->getOrCreateCart($userId, $sessionId);

            if ($cartResult->getCode() !== 200) {
                return $cartResult;
            }

            $cartData = $cartResult->getData();

            if (! $cartData || ! isset($cartData['cart'])) {
                return $this->setCode(404)
                    ->setMessage('Cart not found');
            }

            $cart = $cartData['cart'];

            return $this->addItem($cart->id, $productId, $quantity);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while adding item to cart')
                ->setError($e->getMessage());
        }
    }

    /**
     * Update the quantity of a cart item.
     *
     * @param  string  $cartItemId
     * @param  int  $quantity
     */
    public function updateItem($cartItemId, $quantity): CartServiceImplement
    {
        try {
            if ($quantity <= 0) {
                return $this->setCode(400)
                    ->setMessage('Quantity must be greater than 0');
            }

            $updated = $this->mainRepository->updateItem($cartItemId, $quantity);

            if (! $updated) {
                return $this->setCode(404)
                    ->setMessage('Cart item not found');
            }

            return $this->setCode(200)
                ->setMessage('Cart item updated successfully');
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while updating cart item')
                ->setError($e->getMessage());
        }
    }

    /**
     * Remove an item from the cart.
     *
     * @param  string  $cartItemId
     */
    public function removeItem($cartItemId): CartServiceImplement
    {
        try {
            $removed = $this->mainRepository->removeItem($cartItemId);

            if (! $removed) {
                return $this->setCode(404)
                    ->setMessage('Cart item not found');
            }

            return $this->setCode(200)
                ->setMessage('Item removed from cart successfully');
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while removing item from cart')
                ->setError($e->getMessage());
        }
    }

    /**
     * Clear all items from a cart.
     *
     * @param  string  $cartId
     */
    private function clearCart($cartId): CartServiceImplement
    {
        try {
            $this->mainRepository->clearCart($cartId);

            return $this->setCode(200)
                ->setMessage('Cart cleared successfully');
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while clearing cart')
                ->setError($e->getMessage());
        }
    }

    /**
     * Clear all items from the user's or session's cart.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function clearCartForUser($request): CartServiceImplement
    {
        try {
            if (! $request instanceof Request) {
                return $this->setCode(400)
                    ->setMessage('Invalid request provided');
            }

            $userId = $request->user()?->id;
            $sessionId = $request->session()->getId();

            $cartResult = $this->getOrCreateCart($userId, $sessionId);

            if ($cartResult->getCode() !== 200) {
                return $cartResult;
            }

            $cartData = $cartResult->getData();

            if (! $cartData || ! isset($cartData['cart'])) {
                return $this->setCode(404)
                    ->setMessage('Cart not found');
            }

            $cart = $cartData['cart'];

            return $this->clearCart($cart->id);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while clearing cart')
                ->setError($e->getMessage());
        }
    }

    /**
     * Migrate cart items from session cart to user cart after authentication.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function migrateCart($request): CartServiceImplement
    {
        try {
            if (! $request instanceof Request) {
                return $this->setCode(400)
                    ->setMessage('Invalid request provided');
            }

            $userId = $request->user()?->id;
            $sessionId = $request->session()->getId();

            if (! $userId) {
                return $this->setCode(400)
                    ->setMessage('User must be authenticated to migrate cart');
            }

            $sessionCart = null;

            $cookieCartId = $request->cookie('session_cart_id');
            if ($cookieCartId) {
                $sessionCart = $this->mainRepository->getCartWithItems($cookieCartId);
                if ($sessionCart && $sessionCart->user_id !== null) {
                    $sessionCart = null;
                }
            }

            if (! $sessionCart) {
                $sessionCart = $this->mainRepository->getCartBySessionId($sessionId);
            }

            if (! $sessionCart) {
                $recentSessionCarts = $this->mainRepository->getRecentSessionCarts(60);
                $sessionCart = $recentSessionCarts->first();
            }

            if (! $sessionCart) {
                return $this->setCode(200)
                    ->setMessage('No cart items to migrate');
            }

            $sessionCart->load('items.product');

            if ($sessionCart->items->isEmpty()) {
                $sessionCart->delete();

                return $this->setCode(200)
                    ->setMessage('No cart items to migrate');
            }

            $userCart = $this->mainRepository->getOrCreateCart($userId, null);

            if ($userCart->session_id !== $sessionId) {
                $userCart->session_id = $sessionId;
                $userCart->save();
            }

            foreach ($sessionCart->items as $item) {
                $product = $item->product;

                if (! $product) {
                    continue;
                }

                $existingItem = $this->mainRepository->getCartItem($userCart->id, $item->product_id);

                if ($existingItem) {
                    $newQuantity = $existingItem->quantity + $item->quantity;

                    if ($product->stock < $newQuantity) {
                        $existingItem->quantity = $product->stock;
                        $existingItem->save();
                    } else {
                        $existingItem->quantity = $newQuantity;
                        $existingItem->save();
                    }
                } else {
                    $quantityToAdd = min($item->quantity, $product->stock);

                    if ($quantityToAdd > 0) {
                        $this->mainRepository->addItem(
                            $userCart->id,
                            $item->product_id,
                            $quantityToAdd,
                            $item->price
                        );
                    }
                }
            }

            $sessionCart->delete();

            Cookie::queue(Cookie::forget('session_cart_id'));

            $userCart->refresh();
            $userCart->load('items.product');

            return $this->setCode(200)
                ->setMessage('Cart migrated successfully')
                ->setData(['cart' => $userCart]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while migrating cart')
                ->setError($e->getMessage());
        }
    }
}
