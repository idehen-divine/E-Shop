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
        if (! $request->has('per_page')) {
            $request->merge(['per_page' => 24]);
        }

        return helpers()->queryableHelper()->fetchWithFilters($this->model, function ($query) use ($request) {
            $query->with('categories');

            if ($request->filled('search')) {
                $query->where('name', 'like', '%'.$request->search.'%');
            }
            if ($request->filled('category')) {
                $query->whereHas('categories', function ($query) use ($request) {
                    $query->where('slug', $request->category);
                });
            }
            if ($request->filled('price')) {
                $priceFilter = $request->price;
                switch ($priceFilter) {
                    case 'under-50':
                        $query->where('price', '<', 50);
                        break;
                    case '50-100':
                        $query->whereBetween('price', [50, 99.99]);
                        break;
                    case '100-200':
                        $query->whereBetween('price', [100, 199.99]);
                        break;
                    case 'over-200':
                        $query->where('price', '>=', 200);
                        break;
                }
            }

            $query->active();
        });
    }
}
