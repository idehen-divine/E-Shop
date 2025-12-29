<?php

namespace App\Services\ProductCategory;

use LaravelEasyRepository\BaseService;

interface ProductCategoryService extends BaseService
{
    public function getAllCategories();
}
