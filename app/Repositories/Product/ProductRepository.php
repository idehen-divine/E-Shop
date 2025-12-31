<?php

namespace App\Repositories\Product;

use LaravelEasyRepository\Repository;

interface ProductRepository extends Repository
{
    public function getAllProducts($request);

    public function getAllProductsForAdmin($request);

    public function getDashboardStats(): array;

    public function getRecentProducts(int $limit = 5): array;

    public function getLowStockProducts(int $limit = 5): array;
}
