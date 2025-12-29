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
    public function index(Request $request): Response|\Illuminate\Http\JsonResponse|RedirectResponse
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return $this->cartService->getCartForUser($request)->toJson();
        }

        return Inertia::render('cart/index', [
            'cart' => json_decode($this->cartService->getCartForUser($request)->toJson()->getContent(), true),
        ]);
    }

    /**
     * Add an item to the cart.
     */
    public function store(StoreCartItemRequest $request): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $result = $this->cartService->addItemToCart($request);

        if ($request->expectsJson() || $request->is('api/*')) {
            return $result->toJson();
        }

        if ($result->getCode() !== 200) {
            return back()->with('error', $result->getMessage());
        }

        return back()->with('success', $result->getMessage());
    }

    /**
     * Update a cart item's quantity.
     */
    public function update(UpdateCartItemRequest $request, string $cartItemId): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $result = $this->cartService->updateItem($cartItemId, $request->quantity);

        if ($request->expectsJson() || $request->is('api/*')) {
            return $result->toJson();
        }

        if ($result->getCode() !== 200) {
            return back()->with('error', $result->getMessage());
        }

        return back()->with('success', $result->getMessage());
    }

    /**
     * Remove an item from the cart.
     */
    public function destroy(Request $request, string $cartItemId): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $result = $this->cartService->removeItem($cartItemId);

        if ($request->expectsJson() || $request->is('api/*')) {
            return $result->toJson();
        }

        if ($result->getCode() !== 200) {
            return back()->with('error', $result->getMessage());
        }

        return back()->with('success', $result->getMessage());
    }

    /**
     * Clear all items from the cart.
     */
    public function clear(Request $request): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $result = $this->cartService->clearCartForUser($request);

        if ($request->expectsJson() || $request->is('api/*')) {
            return $result->toJson();
        }

        if ($result->getCode() !== 200) {
            return back()->with('error', $result->getMessage());
        }

        return back()->with('success', $result->getMessage());
    }
}
