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
                'description' => 'Electronic devices and accessories',
                'order' => 1,
                'children' => [
                    ['name' => 'Smartphones', 'description' => 'Mobile phones and accessories', 'order' => 1],
                    ['name' => 'Laptops', 'description' => 'Laptops and notebooks', 'order' => 2],
                    ['name' => 'Tablets', 'description' => 'Tablets and e-readers', 'order' => 3],
                    ['name' => 'Audio', 'description' => 'Headphones, speakers, and audio equipment', 'order' => 4],
                    ['name' => 'Cameras', 'description' => 'Digital cameras and accessories', 'order' => 5],
                ],
            ],
            [
                'name' => 'Clothing',
                'description' => 'Fashion and apparel',
                'order' => 2,
                'children' => [
                    ['name' => 'Men\'s Clothing', 'description' => 'Clothing for men', 'order' => 1],
                    ['name' => 'Women\'s Clothing', 'description' => 'Clothing for women', 'order' => 2],
                    ['name' => 'Kids Clothing', 'description' => 'Clothing for children', 'order' => 3],
                    ['name' => 'Shoes', 'description' => 'Footwear for all', 'order' => 4],
                    ['name' => 'Accessories', 'description' => 'Fashion accessories', 'order' => 5],
                ],
            ],
            [
                'name' => 'Home & Garden',
                'description' => 'Home improvement and garden supplies',
                'order' => 3,
                'children' => [
                    ['name' => 'Furniture', 'description' => 'Home and office furniture', 'order' => 1],
                    ['name' => 'Kitchen', 'description' => 'Kitchen appliances and utensils', 'order' => 2],
                    ['name' => 'Decor', 'description' => 'Home decoration items', 'order' => 3],
                    ['name' => 'Garden', 'description' => 'Gardening tools and supplies', 'order' => 4],
                    ['name' => 'Lighting', 'description' => 'Indoor and outdoor lighting', 'order' => 5],
                ],
            ],
            [
                'name' => 'Sports & Outdoors',
                'description' => 'Sports equipment and outdoor gear',
                'order' => 4,
                'children' => [
                    ['name' => 'Fitness', 'description' => 'Fitness equipment and accessories', 'order' => 1],
                    ['name' => 'Camping', 'description' => 'Camping and hiking gear', 'order' => 2],
                    ['name' => 'Team Sports', 'description' => 'Equipment for team sports', 'order' => 3],
                    ['name' => 'Water Sports', 'description' => 'Equipment for water activities', 'order' => 4],
                    ['name' => 'Cycling', 'description' => 'Bicycles and cycling accessories', 'order' => 5],
                ],
            ],
            [
                'name' => 'Books & Media',
                'description' => 'Books, movies, music, and games',
                'order' => 5,
                'children' => [
                    ['name' => 'Books', 'description' => 'Fiction and non-fiction books', 'order' => 1],
                    ['name' => 'Movies', 'description' => 'DVDs and Blu-rays', 'order' => 2],
                    ['name' => 'Music', 'description' => 'CDs and vinyl records', 'order' => 3],
                    ['name' => 'Video Games', 'description' => 'Games for all platforms', 'order' => 4],
                ],
            ],
            [
                'name' => 'Toys & Games',
                'description' => 'Toys and games for all ages',
                'order' => 6,
                'children' => [
                    ['name' => 'Action Figures', 'description' => 'Action figures and collectibles', 'order' => 1],
                    ['name' => 'Board Games', 'description' => 'Board games and puzzles', 'order' => 2],
                    ['name' => 'Educational Toys', 'description' => 'Learning and educational toys', 'order' => 3],
                    ['name' => 'Outdoor Toys', 'description' => 'Toys for outdoor play', 'order' => 4],
                ],
            ],
            [
                'name' => 'Beauty & Health',
                'description' => 'Beauty products and health supplies',
                'order' => 7,
                'children' => [
                    ['name' => 'Skincare', 'description' => 'Skincare products and treatments', 'order' => 1],
                    ['name' => 'Makeup', 'description' => 'Cosmetics and makeup', 'order' => 2],
                    ['name' => 'Hair Care', 'description' => 'Hair care products', 'order' => 3],
                    ['name' => 'Personal Care', 'description' => 'Personal hygiene products', 'order' => 4],
                    ['name' => 'Vitamins', 'description' => 'Vitamins and supplements', 'order' => 5],
                ],
            ],
            [
                'name' => 'Food & Beverages',
                'description' => 'Food products and beverages',
                'order' => 8,
                'children' => [
                    ['name' => 'Snacks', 'description' => 'Snacks and treats', 'order' => 1],
                    ['name' => 'Beverages', 'description' => 'Drinks and beverages', 'order' => 2],
                    ['name' => 'Organic', 'description' => 'Organic food products', 'order' => 3],
                    ['name' => 'Specialty Foods', 'description' => 'Gourmet and specialty foods', 'order' => 4],
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
