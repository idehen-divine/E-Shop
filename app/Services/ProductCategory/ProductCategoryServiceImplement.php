<?php

namespace App\Services\ProductCategory;

use App\Http\Resources\CategoryResource;
use App\Repositories\ProductCategory\ProductCategoryRepository;
use LaravelEasyRepository\ServiceApi;

class ProductCategoryServiceImplement extends ServiceApi implements ProductCategoryService
{
    /**
     * don't change $this->mainRepository variable name
     * because used in extends service class
     */
    protected ProductCategoryRepository $mainRepository;

    public function __construct(ProductCategoryRepository $mainRepository)
    {
        $this->mainRepository = $mainRepository;
    }

    /**
     * Get all active categories
     */
    public function getAllCategories(): ProductCategoryServiceImplement
    {
        try {
            $categories = $this->mainRepository->getAllActiveCategories();

            return $this->setCode(200)
                ->setMessage('Categories retrieved successfully')
                ->setData([
                    'categories' => CategoryResource::collection($categories),
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while retrieving categories')
                ->setError($e->getMessage());
        }
    }
}
