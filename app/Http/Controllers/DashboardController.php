<?php

namespace App\Http\Controllers;

use App\Services\Cart\CartService;
use App\Services\Product\ProductService;
use App\Services\ProductCategory\ProductCategoryService;
use App\Services\User\UserService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected ProductService $productService,
        protected UserService $userService,
        protected ProductCategoryService $categoryService,
        protected CartService $cartService
    ) {}

    public function index(): Response
    {
        return Inertia::render('dashboard', [
            'productData' => json_decode($this->productService->getDashboardData()->toJson()->getContent(), true),
            'userData' => json_decode($this->userService->getDashboardData()->toJson()->getContent(), true),
            'categoryData' => json_decode($this->categoryService->getDashboardData()->toJson()->getContent(), true),
            'cartData' => json_decode($this->cartService->getDashboardData()->toJson()->getContent(), true),
        ]);
    }
}
