<?php

namespace App\Services\ProductCategory;

use App\Http\Resources\CategoryResource;
use App\Repositories\ProductCategory\ProductCategoryRepository;
use Illuminate\Http\Request;
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
            $categories = $this->mainRepository->all();

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

    /**
     * Get all categories for admin with filtering
     *
     * @param  Request  $request
     */
    public function getAllCategoriesForAdmin($request): ProductCategoryServiceImplement
    {
        try {
            $categories = $this->mainRepository->getAllCategoriesForAdmin($request);

            return $this->setCode(200)
                ->setMessage('Categories retrieved successfully')
                ->setData([
                    'categories' => CategoryResource::collection($categories),
                    'pagination' => helpers()->queryableHelper()->getPagination($categories),
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while retrieving categories')
                ->setError($e->getMessage());
        }
    }

    /**
     * Create a new category
     *
     * @param  Request  $request
     */
    public function createCategory($request): ProductCategoryServiceImplement
    {
        \DB::beginTransaction();
        try {
            $data = $request->validated();

            $category = $this->mainRepository->create($data);

            \DB::commit();

            return $this->setCode(201)
                ->setMessage('Category created successfully')
                ->setData([
                    'category' => new CategoryResource($category),
                ]);
        } catch (\Exception $e) {
            \DB::rollBack();

            return $this->setCode(500)
                ->setMessage('An error occurred while creating category')
                ->setError($e->getMessage());
        }
    }

    /**
     * Update a category
     *
     * @param  Request  $request
     * @param  string  $id
     */
    public function updateCategory($request, $id): ProductCategoryServiceImplement
    {
        \DB::beginTransaction();
        try {
            $category = $this->mainRepository->find($id);

            if (! $category) {
                return $this->setCode(404)
                    ->setMessage('Category not found');
            }

            $data = $request->validated();

            $updated = $this->mainRepository->update($id, $data);
            $category = $this->mainRepository->find($id);
            $category->load(['parent', 'children']);

            \DB::commit();

            return $this->setCode(200)
                ->setMessage('Category updated successfully')
                ->setData([
                    'category' => new CategoryResource($category),
                ]);
        } catch (\Exception $e) {
            \DB::rollBack();

            return $this->setCode(500)
                ->setMessage('An error occurred while updating category')
                ->setError($e->getMessage());
        }
    }

    /**
     * Delete a category
     *
     * @param  string  $id
     */
    public function deleteCategory($id): ProductCategoryServiceImplement
    {
        \DB::beginTransaction();
        try {
            $category = $this->mainRepository->find($id);

            if (! $category) {
                return $this->setCode(404)
                    ->setMessage('Category not found');
            }

            $this->mainRepository->delete($id);

            \DB::commit();

            return $this->setCode(200)
                ->setMessage('Category deleted successfully');
        } catch (\Exception $e) {
            \DB::rollBack();

            return $this->setCode(500)
                ->setMessage('An error occurred while deleting category')
                ->setError($e->getMessage());
        }
    }

    /**
     * Get dashboard data for categories
     */
    public function getDashboardData(): ProductCategoryServiceImplement
    {
        try {
            $stats = $this->mainRepository->getDashboardStats();

            return $this->setCode(200)
                ->setMessage('Category dashboard data retrieved successfully')
                ->setData([
                    'stats' => $stats,
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while retrieving category dashboard data')
                ->setError($e->getMessage());
        }
    }
}
