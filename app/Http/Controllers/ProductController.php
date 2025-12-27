<?php

namespace App\Http\Controllers;

use App\Services\Product\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(protected ProductService $productService) {}

    public function index(Request $request): Response
    {
        $result = $this->productService->getAllProducts($request);
        $data = $result->getData();

        $products = $data['products'] ?? null;

        if ($products instanceof \Illuminate\Http\Resources\Json\AnonymousResourceCollection) {
            $products = $products->toArray($request);
        }

        return Inertia::render('products/index', [
            'products' => $products ?? [],
            'pagination' => $data['pagination'] ?? null,
        ]);
    }

    public function show($id): Response
    {
        $result = $this->productService->getProductById($id);

        return Inertia::render('Products/Show', [
            'product' => $result->getData()['product'] ?? null,
        ]);
    }

    public function store(Request $request)
    {
        return $this->productService->createProduct($request);
    }

    public function update(Request $request, $id)
    {
        return $this->productService->updateProduct($request);
    }

    public function destroy($id)
    {
        return $this->productService->deleteProduct($id);
    }
}
