<?php

namespace App\Services\Product;

use App\Http\Resources\ProductResource;
use App\Repositories\Product\ProductRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use LaravelEasyRepository\ServiceApi;

class ProductServiceImplement extends ServiceApi implements ProductService
{
    /**
     * don't change $this->mainRepository variable name
     * because used in extends service class
     */
    protected ProductRepository $mainRepository;

    public function __construct(ProductRepository $mainRepository)
    {
        $this->mainRepository = $mainRepository;
    }

    /**
     * Get all products
     *
     * @param  \Illuminate\Http\Request  $request  Request with optional filters
     */
    public function getAllProducts($request): ProductServiceImplement
    {
        try {
            $products = $this->mainRepository->getAllProducts($request);

            return $this->setCode(200)
                ->setMessage('Products retrieved successfully')
                ->setData([
                    'products' => ProductResource::collection($products),
                    'pagination' => helpers()->queryableHelper()->getPagination($products),
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occured while retrieving product')
                ->setError($e->getMessage());
        }
    }

    /**
     * Get all products for admin management
     *
     * @param  \Illuminate\Http\Request  $request  Request with optional filters
     */
    public function getAllProductsForAdmin($request): ProductServiceImplement
    {
        try {
            $products = $this->mainRepository->getAllProductsForAdmin($request);

            return $this->setCode(200)
                ->setMessage('Products retrieved successfully')
                ->setData([
                    'products' => ProductResource::collection($products),
                    'pagination' => helpers()->queryableHelper()->getPagination($products),
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occured while retrieving products')
                ->setError($e->getMessage());
        }
    }

    /**
     * Get product by ID
     *
     * @param  string  $id  Product ID
     */
    public function getProductById($id): ProductServiceImplement
    {
        try {
            $product = $this->mainRepository->find($id);

            if (! $product) {
                return $this->setCode(404)
                    ->setMessage('Product not found');
            }

            $product->load('categories');

            return $this->setCode(200)
                ->setMessage('Product retrieved successfully')
                ->setData([
                    'product' => new ProductResource($product),
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occured while retrieving product')
                ->setError($e->getMessage());
        }
    }

    /**
     * Create a new product
     *
     * @param  \Illuminate\Http\Request  $request  Request with product data
     */
    public function createProduct($request): ProductServiceImplement
    {
        try {
            $product = DB::transaction(function () use ($request) {
                $data = $request->validated();

                $categories = $data['categories'] ?? [];
                unset($data['categories']);

                if ($request->hasFile('image')) {
                    $imagePath = $request->file('image')->store('products', 'public');
                    $data['image'] = $imagePath;
                }

                $galleryImages = [];

                if ($request->hasFile('images')) {
                    $files = $request->file('images');

                    if (is_array($files)) {
                        foreach ($files as $file) {
                            if ($file && $file->isValid()) {
                                $imagePath = $file->store('products', 'public');
                                $galleryImages[] = $imagePath;
                            }
                        }
                    }
                }

                if (! empty($galleryImages)) {
                    $data['images'] = $galleryImages;
                }

                $product = $this->mainRepository->create($data);

                if (! empty($categories)) {
                    $product->categories()->attach($categories);
                }

                return $product;
            });

            return $this->setCode(201)
                ->setMessage('Product created successfully')
                ->setData([
                    'product' => new ProductResource($product->load('categories')),
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while creating product')
                ->setError($e->getMessage());
        }
    }

    /**
     * Update an existing product
     *
     * @param  \Illuminate\Http\Request  $request  Request with product data
     * @param  string  $id  Product ID
     */
    public function updateProduct($request, $id): ProductServiceImplement
    {
        try {
            $product = $this->mainRepository->find($id);

            if (! $product) {
                return $this->setCode(404)
                    ->setMessage('Product not found');
            }

            DB::transaction(function () use ($request, $id, $product) {
                $data = $request->validated();

                $categories = $data['categories'] ?? [];
                unset($data['categories']);

                if ($request->hasFile('image')) {
                    if (! empty($product->image) && Storage::disk('public')->exists($product->image)) {
                        Storage::disk('public')->delete($product->image);
                    }

                    $imagePath = $request->file('image')->store('products', 'public');
                    $data['image'] = $imagePath;
                }

                if ($request->hasFile('images')) {
                    $galleryImages = [];
                    foreach ($request->file('images') as $image) {
                        $imagePath = $image->store('products', 'public');
                        $galleryImages[] = $imagePath;
                    }
                    $existingImages = $product->images ?? [];
                    $removedImages = $request->input('removed_images', []);

                    $removedImages = array_map(function ($url) {
                        if (strpos($url, '/storage/') !== false) {
                            return substr($url, strpos($url, '/storage/') + strlen('/storage/'));
                        }

                        return $url;
                    }, $removedImages);

                    foreach ($removedImages as $removedImage) {
                        if (Storage::disk('public')->exists($removedImage)) {
                            Storage::disk('public')->delete($removedImage);
                        }
                    }

                    $existingImages = array_filter($existingImages, function ($image) use ($removedImages) {
                        return ! in_array($image, $removedImages);
                    });

                    $data['images'] = array_merge(array_values($existingImages), $galleryImages);
                } else {
                    if ($request->has('removed_images')) {
                        $existingImages = $product->images ?? [];
                        $removedImages = $request->input('removed_images', []);

                        $removedImages = array_map(function ($url) {
                            if (strpos($url, '/storage/') !== false) {
                                return substr($url, strpos($url, '/storage/') + strlen('/storage/'));
                            }

                            return $url;
                        }, $removedImages);

                        foreach ($removedImages as $removedImage) {
                            if (Storage::disk('public')->exists($removedImage)) {
                                Storage::disk('public')->delete($removedImage);
                            }
                        }

                        $existingImages = array_filter($existingImages, function ($image) use ($removedImages) {
                            return ! in_array($image, $removedImages);
                        });

                        $data['images'] = array_values($existingImages);
                    }
                }

                $this->mainRepository->update($id, $data);

                if (! empty($categories)) {
                    $product->categories()->sync($categories);
                }
            });

            return $this->setCode(200)
                ->setMessage('Product updated successfully')
                ->setData([
                    'product' => new ProductResource($product->load('categories')),
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while updating product')
                ->setError($e->getMessage());
        }
    }

    /**
     * Delete a product
     *
     * @param  string  $id  Product ID
     */
    public function deleteProduct($id): ProductServiceImplement
    {
        try {
            $product = $this->mainRepository->find($id);

            if (! $product) {
                return $this->setCode(404)
                    ->setMessage('Product not found');
            }

            DB::transaction(function () use ($product) {
                if (! empty($product->image) && Storage::disk('public')->exists($product->image)) {
                    Storage::disk('public')->delete($product->image);
                }

                if (! empty($product->images) && is_array($product->images)) {
                    foreach ($product->images as $imagePath) {
                        if (Storage::disk('public')->exists($imagePath)) {
                            Storage::disk('public')->delete($imagePath);
                        }
                    }
                }

                $product->categories()->detach();

                $product->delete();
            });

            return $this->setCode(200)
                ->setMessage('Product deleted successfully');
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while deleting product')
                ->setError($e->getMessage());
        }
    }

    /**
     * Update product stock
     *
     * @param  \Illuminate\Http\Request  $request  Request with stock data
     * @param  string  $id  Product ID
     */
    public function stockProduct($request, $id): ProductServiceImplement
    {
        try {
            $product = $this->mainRepository->find($id);

            if (! $product) {
                return $this->setCode(404)
                    ->setMessage('Product not found');
            }

            $data = $request->validated();
            $oldStock = $product->stock;
            $product->update(['stock' => $data['stock']]);

            $lowStockThreshold = config('app.low_stock_threshold', 10);
            if ($product->stock <= $lowStockThreshold && $oldStock > $lowStockThreshold) {
                \App\Jobs\SendLowStockNotification::dispatch($product, $lowStockThreshold);
            }

            return $this->setCode(200)
                ->setMessage('Product stock updated successfully')
                ->setData([
                    'product' => new ProductResource($product->load('categories')),
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while updating product stock')
                ->setError($e->getMessage());
        }
    }

    /**
     * Toggle product active status
     *
     * @param  string  $id  Product ID
     */
    public function toggleProductActive($id): ProductServiceImplement
    {
        try {
            $product = $this->mainRepository->find($id);

            if (! $product) {
                return $this->setCode(404)
                    ->setMessage('Product not found');
            }

            $product->update(['is_active' => ! $product->is_active]);

            return $this->setCode(200)
                ->setMessage('Product status updated successfully')
                ->setData([
                    'product' => new ProductResource($product->load('categories')),
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while updating product status')
                ->setError($e->getMessage());
        }
    }

    /**
     * Toggle product featured status
     *
     * @param  string  $id  Product ID
     */
    public function toggleProductFeatured($id): ProductServiceImplement
    {
        try {
            $product = $this->mainRepository->find($id);

            if (! $product) {
                return $this->setCode(404)
                    ->setMessage('Product not found');
            }

            $product->update(['is_featured' => ! $product->is_featured]);

            return $this->setCode(200)
                ->setMessage('Product featured status updated successfully')
                ->setData([
                    'product' => new ProductResource($product->load('categories')),
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while updating product featured status')
                ->setError($e->getMessage());
        }
    }

    /**
     * Get dashboard data for products
     */
    public function getDashboardData(): ProductServiceImplement
    {
        try {
            $stats = $this->mainRepository->getDashboardStats();
            $recentProducts = $this->mainRepository->getRecentProducts(5);
            $lowStockProducts = $this->mainRepository->getLowStockProducts(5);

            return $this->setCode(200)
                ->setMessage('Product dashboard data retrieved successfully')
                ->setData([
                    'stats' => $stats,
                    'recentProducts' => $recentProducts,
                    'lowStockProducts' => $lowStockProducts,
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while retrieving product dashboard data')
                ->setError($e->getMessage());
        }
    }
}
