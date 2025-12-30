<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Services\ProductCategory\ProductCategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductCategoryController extends Controller
{
    public function __construct(
        protected ProductCategoryService $productCategoryService
    ) {}

    /**
     * Display a listing of categories for admin management.
     */
    public function index(Request $request): \Inertia\Response
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return $this->productCategoryService->getAllCategoriesForAdmin($request)->toJson();
        }

        return Inertia::render('admin/categories/index', [
            'categories' => [
                'data' => [
                    'categories' => json_decode($this->productCategoryService->getAllCategoriesForAdmin($request)->toJson()->getContent(), true),
                    'parentCategories' => json_decode($this->productCategoryService->getAllCategories()->toJson()->getContent(), true),
                ],
            ],
        ]);
    }

    /**
     * Store a newly created category.
     */
    public function store(StoreCategoryRequest $request): \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $result = $this->productCategoryService->createCategory($request);

        if ($request->expectsJson() || $request->is('api/*')) {
            return $result->toJson();
        }

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category created successfully.');
    }

    /**
     * Update the specified category.
     */
    public function update(UpdateCategoryRequest $request, string $id): \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $result = $this->productCategoryService->updateCategory($request, $id);

        if ($request->expectsJson() || $request->is('api/*')) {
            return $result->toJson();
        }

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified category.
     */
    public function destroy(string $id): \Illuminate\Http\JsonResponse
    {
        return $this->productCategoryService->deleteCategory($id)->toJson();
    }

    /**
     * Toggle the active status of a category.
     */
    public function toggleActive(Request $request, string $id): \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $result = $this->productCategoryService->toggleCategoryActive($id);

        if ($request->expectsJson() || $request->is('api/*')) {
            return $result->toJson();
        }

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category status updated successfully.');
    }
}
