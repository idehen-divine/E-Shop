<?php

namespace App\Repositories\ProductCategory;

use LaravelEasyRepository\Repository;

interface ProductCategoryRepository extends Repository
{
    public function getAllCategoriesForAdmin($request);

    public function getDashboardStats(): array;
}
