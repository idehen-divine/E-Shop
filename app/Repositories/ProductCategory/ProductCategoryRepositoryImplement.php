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

    /**
     * Get all categories for admin (including inactive) with filtering
     *
     * @param  \Illuminate\Http\Request  $request  Request with optional filters
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function getAllCategoriesForAdmin($request)
    {
        if (! $request->has('per_page')) {
            $request->merge(['per_page' => 10]);
        }

        return helpers()->queryableHelper()->fetchWithFilters($this->model, function ($query) use ($request) {
            $query->with(['parent', 'children']);

            if ($request->filled('search')) {
                $query->where(function ($q) use ($request) {
                    $q->where('name', 'like', '%'.$request->search.'%')
                        ->orWhere('description', 'like', '%'.$request->search.'%');
                });
            }

            if ($request->filled('parent')) {
                if ($request->parent === 'none') {
                    $query->whereNull('parent_id');
                } else {
                    $query->where('parent_id', $request->parent);
                }
            }

            if ($request->filled('status')) {
                if ($request->status === 'active') {
                    $query->where('is_active', true);
                } elseif ($request->status === 'inactive') {
                    $query->where('is_active', false);
                }
            }

            if ($request->filled('sort_by')) {
                $sortBy = $request->sort_by;
                $sortOrder = $request->get('sort_order', 'asc');
                $query->orderBy($sortBy, $sortOrder);
            } else {
                $query->orderBy('order')->orderBy('name');
            }
        });
    }
}
