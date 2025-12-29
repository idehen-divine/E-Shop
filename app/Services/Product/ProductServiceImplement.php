<?php

namespace App\Services\Product;

use App\Http\Resources\ProductResource;
use App\Repositories\Product\ProductRepository;
use LaravelEasyRepository\ServiceApi;

class ProductServiceImplement extends ServiceApi implements ProductService
{
    /**
     * don't change $this->mainRepository variable name
     * because used in extends service class
     */
    protected ProductRepository $mainRepository;

    public function __construct(ProductRepository $mainRepository)
    {
        $this->mainRepository = $mainRepository;
    }

    /**
     * Get all products
     *
     * @param  \Illuminate\Http\Request  $request  Request with optional filters
     */
    public function getAllProducts($request): ProductServiceImplement
    {
        try {
            $products = $this->mainRepository->getAllProducts($request);

            return $this->setCode(200)
                ->setMessage('Products retrieved successfully')
                ->setData([
                    'products' => ProductResource::collection($products),
                    'pagination' => helpers()->queryableHelper()->getPagination($products),
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occured while retrieving product')
                ->setError($e->getMessage());
        }
    }

    public function getProductById($id): ProductServiceImplement
    {
        try {
            $product = $this->mainRepository->find($id);

            if (! $product) {
                return $this->setCode(404)
                    ->setMessage('Product not found');
            }

            $product->load('categories');

            return $this->setCode(200)
                ->setMessage('Product retrieved successfully')
                ->setData([
                    'product' => new ProductResource($product),
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occured while retrieving product')
                ->setError($e->getMessage());
        }
    }

    public function createProduct($request) {}

    public function updateProduct($request) {}

    public function deleteProduct($id) {}

    public function stockProduct($request) {}
}
