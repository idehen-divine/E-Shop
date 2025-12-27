<?php

namespace App\Services\Product;

use LaravelEasyRepository\BaseService;

interface ProductService extends BaseService
{
    public function getAllProducts($request);

    public function getProductById($id);

    public function createProduct($request);

    public function updateProduct($request);

    public function deleteProduct($id);

    public function stockProduct($request);
}
