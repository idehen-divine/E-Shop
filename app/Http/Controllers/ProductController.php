<?php

namespace App\Http\Controllers;

use App\Services\Cart\CartService;
use App\Services\Product\ProductService;
use App\Services\ProductCategory\ProductCategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService,
        protected CartService $cartService,
        protected ProductCategoryService $productCategoryService
    ) {}

    /**
     * Display a listing of products.
     */
    public function index(Request $request): Response|\Illuminate\Http\JsonResponse
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return $this->productService->getAllProducts($request)->toJson();
        }

        return Inertia::render('products/index', [
            'products' => json_decode($this->productService->getAllProducts($request)->toJson()->getContent(), true),
            'cart' => json_decode($this->cartService->getCartForUser($request)->toJson()->getContent(), true),
            'categories' => json_decode($this->productCategoryService->getAllCategories()->toJson()->getContent(), true),
        ]);
    }

    /**
     * Display the specified product.
     *
     * @param  string  $id
     */
    public function show(Request $request, $id): Response|\Illuminate\Http\JsonResponse
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return $this->productService->getProductById($id)->toJson();
        }

        return Inertia::render('products/show', [
            'product' => json_decode($this->productService->getProductById($id)->toJson()->getContent(), true),
            'cart' => json_decode($this->cartService->getCartForUser($request)->toJson()->getContent(), true),
        ]);
    }

    /**
     * Store a newly created product.
     *
     * @return mixed
     */
    public function store(Request $request)
    {
        return $this->productService->createProduct($request);
    }

    /**
     * Update the specified product.
     *
     * @param  string  $id
     * @return mixed
     */
    public function update(Request $request, $id)
    {
        return $this->productService->updateProduct($request);
    }

    /**
     * Remove the specified product.
     *
     * @param  string  $id
     * @return mixed
     */
    public function destroy($id)
    {
        return $this->productService->deleteProduct($id);
    }
}
