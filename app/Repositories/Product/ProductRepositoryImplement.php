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
            $request->merge(['per_page' => 10]);
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

    /**
     * Get all products for admin (including inactive)
     *
     * @param  \Illuminate\Http\Request  $request  Request with optional filters
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function getAllProductsForAdmin($request)
    {
        if (! $request->has('per_page')) {
            $request->merge(['per_page' => 10]);
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
            if ($request->filled('status')) {
                $statusFilter = $request->status;
                if ($statusFilter === 'active') {
                    $query->where('is_active', true);
                } elseif ($statusFilter === 'inactive') {
                    $query->where('is_active', false);
                }
            }
            if ($request->filled('featured')) {
                $featuredFilter = $request->featured;
                if ($featuredFilter === 'featured') {
                    $query->where('is_featured', true);
                } elseif ($featuredFilter === 'not-featured') {
                    $query->where('is_featured', false);
                }
            }
        });
    }

    /**
     * Get dashboard statistics for products
     */
    public function getDashboardStats(): array
    {
        return [
            'total' => $this->model->count(),
            'active' => $this->model->where('is_active', true)->count(),
            'lowStock' => $this->model->where('stock', '<', 10)->where('is_active', true)->count(),
            'outOfStock' => $this->model->where('stock', '<=', 0)->count(),
        ];
    }

    /**
     * Get recent products
     */
    public function getRecentProducts(int $limit = 5): array
    {
        return $this->model
            ->with('categories')
            ->latest()
            ->take($limit)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'stock' => $product->stock,
                    'is_active' => $product->is_active,
                    'is_featured' => $product->is_featured,
                    'categories' => $product->categories->pluck('name')->toArray(),
                    'created_at' => $product->created_at->format('M d, Y'),
                ];
            })
            ->toArray();
    }

    /**
     * Get low stock products
     */
    public function getLowStockProducts(int $limit = 5): array
    {
        return $this->model
            ->where('stock', '<', 10)
            ->where('is_active', true)
            ->orderBy('stock', 'asc')
            ->take($limit)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'stock' => $product->stock,
                    'sku' => $product->sku,
                ];
            })
            ->toArray();
    }
}
