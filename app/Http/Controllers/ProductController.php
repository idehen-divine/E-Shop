<?php

namespace App\Http\Controllers;

use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Requests\Product\UpdateStockRequest;
use App\Services\Cart\CartService;
use App\Services\Product\ProductService;
use App\Services\ProductCategory\ProductCategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService,
        protected CartService $cartService,
        protected ProductCategoryService $productCategoryService
    ) {}

    /**
     * Display a listing of products.
     *
     * @return \Inertia\Response|\Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
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
     * Display a listing of products for admin management.
     *
     * @return \Inertia\Response|\Illuminate\Http\JsonResponse
     */
    public function admin(Request $request)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return $this->productService->getAllProductsForAdmin($request)->toJson();
        }

        return Inertia::render('admin/products/index', [
            'products' => json_decode($this->productService->getAllProductsForAdmin($request)->toJson()->getContent(), true),
            'categories' => json_decode($this->productCategoryService->getAllCategories()->toJson()->getContent(), true),
        ]);
    }

    /**
     * Display the specified product.
     *
     * @param  string  $id
     * @return \Inertia\Response|\Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $id)
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
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function store(StoreProductRequest $request)
    {
        $result = $this->productService->createProduct($request);

        if ($request->expectsJson() || $request->is('api/*')) {
            return $result->toJson();
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Update the specified product.
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function update(UpdateProductRequest $request, string $id)
    {
        $result = $this->productService->updateProduct($request, $id);

        if ($request->expectsJson() || $request->is('api/*')) {
            return $result->toJson();
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified product.
     *
     * @param  string  $id
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        $result = $this->productService->deleteProduct($id);

        if ($request->expectsJson() || $request->is('api/*')) {
            return $result->toJson();
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    /**
     * Toggle the active status of a product.
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function toggleActive(Request $request, string $id)
    {
        $result = $this->productService->toggleProductActive($id);

        if ($request->expectsJson() || $request->is('api/*')) {
            return $result->toJson();
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product status updated successfully.');
    }

    /**
     * Toggle the featured status of a product.
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function toggleFeatured(Request $request, string $id)
    {
        $result = $this->productService->toggleProductFeatured($id);

        if ($request->expectsJson() || $request->is('api/*')) {
            return $result->toJson();
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product featured status updated successfully.');
    }

    /**
     * Update the stock quantity of a product.
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function updateStock(UpdateStockRequest $request, string $id)
    {
        $result = $this->productService->stockProduct($request, $id);

        if ($request->expectsJson() || $request->is('api/*')) {
            return $result->toJson();
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product stock updated successfully.');
    }
}
