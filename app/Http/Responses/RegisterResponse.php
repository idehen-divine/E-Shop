<?php

namespace App\Http\Responses;

use App\Services\Cart\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    public function __construct(
        protected CartService $cartService
    ) {}

    public function toResponse($request): RedirectResponse|JsonResponse
    {
        $user = auth()->user();

        $this->cartService->migrateCart($request);

        return redirect('/');
    }
}
