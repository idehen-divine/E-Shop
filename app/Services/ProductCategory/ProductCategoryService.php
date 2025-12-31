<?php

namespace App\Services\ProductCategory;

use LaravelEasyRepository\BaseService;

interface ProductCategoryService extends BaseService
{
    public function getAllCategories();

    public function getAllCategoriesForAdmin($request);

    public function createCategory($request);

    public function updateCategory($request, $id);

    public function deleteCategory($id);

    public function getDashboardData();
}
