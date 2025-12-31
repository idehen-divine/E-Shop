<?php

namespace App\Services\Cart;

use App\Http\Resources\CartItemResource;
use App\Http\Resources\CartResource;
use App\Repositories\Cart\CartRepository;
use App\Repositories\Product\ProductRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use LaravelEasyRepository\ServiceApi;

/**
 * Cart Service Implementation
 */
class CartServiceImplement extends ServiceApi implements CartService
{
    public function __construct(
        protected CartRepository $mainRepository,
        protected ProductRepository $productRepository
    ) {}

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

            $cart = $this->mainRepository->getOrCreateCart($userId, $sessionId);

            if (! $userId && $cart) {
                Cookie::queue('session_cart_id', $cart->id, 60 * 24 * 7);
            }

            return $this->setCode(200)
                ->setMessage('Cart retrieved successfully')
                ->setData(['cart' => new CartResource($cart)]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while retrieving cart')
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

            $product = $this->productRepository->find($productId);

            if (! $product) {
                return $this->setCode(404)
                    ->setMessage('Product not found');
            }

            if ($product->stock < $quantity) {
                return $this->setCode(400)
                    ->setMessage('Insufficient stock available');
            }

            $cart = $this->mainRepository->getOrCreateCart($userId, $sessionId);

            if (! $userId && $cart) {
                Cookie::queue('session_cart_id', $cart->id, 60 * 24 * 7);
            }

            $cartItem = $this->mainRepository->addItem($cart->id, $product, $quantity);

            return $this->setCode(200)
                ->setMessage('Item added to cart successfully')
                ->setData(['cart_item' => new CartItemResource($cartItem)]);
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

            $cart = $this->mainRepository->getOrCreateCart($userId, $sessionId);

            $this->mainRepository->clearCart($cart->id);

            return $this->setCode(200)
                ->setMessage('Cart cleared successfully');
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

            $cookieCartId = $request->cookie('session_cart_id');
            $sessionCart = $this->mainRepository->findSessionCartForMigration($cookieCartId, $sessionId);

            if (! $sessionCart || $sessionCart->items->isEmpty()) {
                if ($sessionCart) {
                    $sessionCart->delete();
                }

                return $this->setCode(200)
                    ->setMessage('No cart items to migrate');
            }

            $userCart = $this->mainRepository->getOrCreateCart($userId, null);

            if ($userCart->session_id !== $sessionId) {
                $this->mainRepository->updateCartSessionId($userCart->id, $sessionId);
            }

            $this->mainRepository->migrateCartItems($sessionCart->id, $userCart->id);

            $sessionCart->delete();

            Cookie::queue(Cookie::forget('session_cart_id'));

            $userCart = $this->mainRepository->getCartWithItems($userCart->id);

            return $this->setCode(200)
                ->setMessage('Cart migrated successfully')
                ->setData(['cart' => new CartResource($userCart)]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while migrating cart')
                ->setError($e->getMessage());
        }
    }

    /**
     * Get dashboard data for carts
     */
    public function getDashboardData(): CartServiceImplement
    {
        try {
            $stats = $this->mainRepository->getDashboardStats();

            return $this->setCode(200)
                ->setMessage('Cart dashboard data retrieved successfully')
                ->setData([
                    'stats' => $stats,
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while retrieving cart dashboard data')
                ->setError($e->getMessage());
        }
    }
}
