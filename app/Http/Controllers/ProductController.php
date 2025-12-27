<?php

namespace App\Http\Controllers;

use App\Services\Cart\CartService;
use App\Services\Product\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService,
        protected CartService $cartService
    ) {}

    /**
     * Display a listing of products.
     */
    public function index(Request $request): Response
    {
        $productResult = $this->productService->getAllProducts($request);
        $cartResult = $this->cartService->getCartItemsMap($request);

        $productData = $productResult->getData();
        $cartData = $cartResult->getData();

        $products = $productData['products'] ?? null;

        if ($products instanceof \Illuminate\Http\Resources\Json\AnonymousResourceCollection) {
            $products = $products->toArray($request);
        }

        return Inertia::render('products/index', [
            'products' => $products ?? [],
            'pagination' => $productData['pagination'] ?? null,
            'cartItems' => $cartData['cartItems'] ?? [],
        ]);
    }

    /**
     * Display the specified product.
     *
     * @param  string  $id
     */
    public function show($id): Response
    {
        $result = $this->productService->getProductById($id);

        return Inertia::render('Products/Show', [
            'product' => $result->getData()['product'] ?? null,
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
