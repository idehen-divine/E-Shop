<?php

namespace App\Repositories\Product;

use App\Models\Product;
use LaravelEasyRepository\Implementations\Eloquent;

class ProductRepositoryImplement extends Eloquent implements ProductRepository
{
    /**
     * Model class to be used in this repository for the common methods inside Eloquent
     * Don't remove or change $this->model variable name
     *
     * @property Product|mixed $model;
     */
    protected Product $model;

    public function __construct(Product $model)
    {
        $this->model = $model;
    }

    /**
     * Get all products
     *
     * @param  \Illuminate\Http\Request  $request  Request with optional filters
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function getAllProducts($request)
    {
        return helpers()->queryableHelper()->fetchWithFilters($this->model, function ($query) use ($request) {
            $query->with('categories');

            if ($request->filled('search')) {
                $query->where('name', 'like', '%'.$request->search.'%');
            }
            if ($request->filled('category')) {
                $query->whereHas('categories', function ($query) use ($request) {
                    $query->where('name', 'like', '%'.$request->category.'%');
                });
            }
            if ($request->filled('price')) {
                $query->where('price', '>=', $request->price);
            }

            $query->active();
        });
    }
}
