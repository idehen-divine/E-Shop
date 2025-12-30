<?php

namespace App\Repositories\ProductCategory;

use LaravelEasyRepository\Repository;

interface ProductCategoryRepository extends Repository
{
    public function getAllActiveCategories();

    public function getAllCategoriesForAdmin($request);
}
