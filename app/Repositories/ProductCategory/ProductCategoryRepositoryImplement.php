<?php

namespace App\Repositories\ProductCategory;

use App\Models\ProductCategory;
use LaravelEasyRepository\Implementations\Eloquent;

class ProductCategoryRepositoryImplement extends Eloquent implements ProductCategoryRepository
{
    /**
     * Model class to be used in this repository for the common methods inside Eloquent
     * Don't remove or change $this->model variable name
     *
     * @property ProductCategory|mixed $model;
     */
    protected ProductCategory $model;

    public function __construct(ProductCategory $model)
    {
        $this->model = $model;
    }

    /**
     * Get all active categories ordered by order field
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllActiveCategories()
    {
        return $this->model->active()
            ->ordered()
            ->get();
    }
}
