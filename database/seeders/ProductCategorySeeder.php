<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electronics',
                'children' => [
                    ['name' => 'Smartphones'],
                    ['name' => 'Laptops'],
                    ['name' => 'Tablets'],
                    ['name' => 'Audio'],
                    ['name' => 'Cameras'],
                ],
            ],
            [
                'name' => 'Clothing',
                'children' => [
                    ['name' => 'Men\'s Clothing'],
                    ['name' => 'Women\'s Clothing'],
                    ['name' => 'Kids Clothing'],
                    ['name' => 'Shoes'],
                    ['name' => 'Accessories'],
                ],
            ],
            [
                'name' => 'Home & Garden',
                'children' => [
                    ['name' => 'Furniture'],
                    ['name' => 'Kitchen'],
                    ['name' => 'Decor'],
                    ['name' => 'Garden'],
                    ['name' => 'Lighting'],
                ],
            ],
            [
                'name' => 'Sports & Outdoors',
                'children' => [
                    ['name' => 'Fitness'],
                    ['name' => 'Camping'],
                    ['name' => 'Team Sports'],
                    ['name' => 'Water Sports'],
                    ['name' => 'Cycling'],
                ],
            ],
            [
                'name' => 'Books & Media',
                'children' => [
                    ['name' => 'Books'],
                    ['name' => 'Movies'],
                    ['name' => 'Music'],
                    ['name' => 'Video Games'],
                ],
            ],
            [
                'name' => 'Toys & Games',
                'children' => [
                    ['name' => 'Action Figures'],
                    ['name' => 'Board Games'],
                    ['name' => 'Educational Toys'],
                    ['name' => 'Outdoor Toys'],
                ],
            ],
            [
                'name' => 'Beauty & Health',
                'children' => [
                    ['name' => 'Skincare'],
                    ['name' => 'Makeup'],
                    ['name' => 'Hair Care'],
                    ['name' => 'Personal Care'],
                    ['name' => 'Vitamins'],
                ],
            ],
            [
                'name' => 'Food & Beverages',
                'children' => [
                    ['name' => 'Snacks'],
                    ['name' => 'Beverages'],
                    ['name' => 'Organic'],
                    ['name' => 'Specialty Foods'],
                ],
            ],
        ];

        foreach ($categories as $categoryData) {
            $children = $categoryData['children'] ?? [];
            unset($categoryData['children']);

            $category = ProductCategory::create($categoryData);

            foreach ($children as $childData) {
                $childData['parent_id'] = $category->id;
                ProductCategory::create($childData);
            }
        }
    }
}
