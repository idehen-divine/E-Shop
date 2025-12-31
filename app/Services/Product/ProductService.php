<?php

namespace App\Services\Product;

use LaravelEasyRepository\BaseService;

interface ProductService extends BaseService
{
    public function getAllProducts($request);

    public function getAllProductsForAdmin($request);

    public function getProductById($id);

    public function createProduct($request);

    public function updateProduct($request, $id);

    public function deleteProduct($id);

    public function stockProduct($request, $id);

    public function toggleProductActive($id);

    public function toggleProductFeatured($id);

    public function getDashboardData();
}
