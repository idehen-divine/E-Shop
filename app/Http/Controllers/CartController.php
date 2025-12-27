<?php

namespace App\Http\Controllers;

use App\Http\Requests\Cart\StoreCartItemRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Services\Cart\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(
        protected CartService $cartService
    ) {}

    /**
     * Display the user's cart.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $cartResult = $this->cartService->getCartForUser($request);

        if ($cartResult->getCode() !== 200) {
            return back()->with('error', $cartResult->getMessage());
        }

        $cartData = $cartResult->getData()['cart'];

        return Inertia::render('cart/index', [
            'cart' => $cartData,
        ]);
    }

    /**
     * Add an item to the cart.
     */
    public function store(StoreCartItemRequest $request): RedirectResponse
    {
        $result = $this->cartService->addItemToCart($request);

        if ($result->getCode() !== 200) {
            return back()->with('error', $result->getMessage());
        }

        return back()->with('success', $result->getMessage());
    }

    /**
     * Update a cart item's quantity.
     */
    public function update(UpdateCartItemRequest $request, string $cartItemId): RedirectResponse
    {
        $result = $this->cartService->updateItem($cartItemId, $request->quantity);

        if ($result->getCode() !== 200) {
            return back()->with('error', $result->getMessage());
        }

        return back()->with('success', $result->getMessage());
    }

    /**
     * Remove an item from the cart.
     */
    public function destroy(string $cartItemId): RedirectResponse
    {
        $result = $this->cartService->removeItem($cartItemId);

        if ($result->getCode() !== 200) {
            return back()->with('error', $result->getMessage());
        }

        return back()->with('success', $result->getMessage());
    }

    /**
     * Clear all items from the cart.
     */
    public function clear(Request $request): RedirectResponse
    {
        $result = $this->cartService->clearCartForUser($request);

        if ($result->getCode() !== 200) {
            return back()->with('error', $result->getMessage());
        }

        return back()->with('success', $result->getMessage());
    }
}
