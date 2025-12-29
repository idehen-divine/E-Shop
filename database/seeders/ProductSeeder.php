<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'iPhone 15 Pro Max',
                'description' => 'Latest Apple iPhone with A17 Pro chip, titanium design, and advanced camera system.',
                'price' => 1199.99,
                'compare_at_price' => 1299.99,
                'stock' => 50,
                'is_featured' => true,
                'categories' => ['Electronics', 'Smartphones'],
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra',
                'description' => 'Premium Android smartphone with S Pen, 200MP camera, and AI features.',
                'price' => 1099.99,
                'stock' => 45,
                'is_featured' => true,
                'categories' => ['Electronics', 'Smartphones'],
            ],
            [
                'name' => 'MacBook Pro 16" M3 Max',
                'description' => 'Professional laptop with M3 Max chip, stunning Liquid Retina XDR display.',
                'price' => 3499.99,
                'compare_at_price' => 3699.99,
                'stock' => 20,
                'is_featured' => true,
                'categories' => ['Electronics', 'Laptops'],
            ],
            [
                'name' => 'Dell XPS 15',
                'description' => 'Premium Windows laptop with InfinityEdge display and powerful performance.',
                'price' => 1899.99,
                'stock' => 30,
                'categories' => ['Electronics', 'Laptops'],
            ],
            [
                'name' => 'iPad Pro 12.9"',
                'description' => 'Ultimate iPad experience with M2 chip and stunning display.',
                'price' => 1099.99,
                'compare_at_price' => 1199.99,
                'stock' => 40,
                'categories' => ['Electronics', 'Tablets'],
            ],
            [
                'name' => 'Samsung Galaxy Tab S9',
                'description' => 'Premium Android tablet with S Pen and Dynamic AMOLED display.',
                'price' => 799.99,
                'stock' => 35,
                'categories' => ['Electronics', 'Tablets'],
            ],
            [
                'name' => 'Apple Watch Series 9',
                'description' => 'Advanced health and fitness tracking with always-on Retina display.',
                'price' => 399.99,
                'stock' => 60,
                'is_featured' => true,
                'categories' => ['Electronics', 'Wearables'],
            ],
            [
                'name' => 'Sony A7 IV Camera',
                'description' => 'Professional full-frame mirrorless camera with 33MP sensor.',
                'price' => 2499.99,
                'stock' => 15,
                'categories' => ['Electronics', 'Cameras'],
            ],
            [
                'name' => 'Sony WH-1000XM5',
                'description' => 'Industry-leading noise canceling wireless headphones.',
                'price' => 399.99,
                'compare_at_price' => 449.99,
                'stock' => 80,
                'is_featured' => true,
                'categories' => ['Electronics', 'Audio'],
            ],
            [
                'name' => 'AirPods Pro 2nd Gen',
                'description' => 'Active noise cancellation with transparency mode and spatial audio.',
                'price' => 249.99,
                'stock' => 100,
                'categories' => ['Electronics', 'Audio'],
            ],
            [
                'name' => 'Men\'s Classic T-Shirt',
                'description' => '100% cotton comfortable fit t-shirt available in multiple colors.',
                'price' => 29.99,
                'stock' => 200,
                'categories' => ['Clothing', 'Men\'s Apparel'],
            ],
            [
                'name' => 'Women\'s Summer Dress',
                'description' => 'Elegant floral print dress perfect for summer occasions.',
                'price' => 79.99,
                'compare_at_price' => 99.99,
                'stock' => 75,
                'categories' => ['Clothing', 'Women\'s Apparel'],
            ],
            [
                'name' => 'Kids\' Winter Jacket',
                'description' => 'Warm waterproof jacket with hood for cold weather.',
                'price' => 59.99,
                'stock' => 90,
                'categories' => ['Clothing', 'Kids\' Clothing'],
            ],
            [
                'name' => 'Running Shoes Pro',
                'description' => 'Professional running shoes with cushioned sole and breathable mesh.',
                'price' => 129.99,
                'compare_at_price' => 149.99,
                'stock' => 120,
                'is_featured' => true,
                'categories' => ['Clothing', 'Footwear', 'Sports & Outdoors'],
            ],
            [
                'name' => 'Leather Wallet',
                'description' => 'Genuine leather bifold wallet with multiple card slots.',
                'price' => 49.99,
                'stock' => 150,
                'categories' => ['Clothing', 'Accessories'],
            ],
            [
                'name' => 'Modern Sofa 3-Seater',
                'description' => 'Contemporary design sofa with premium fabric upholstery.',
                'price' => 899.99,
                'compare_at_price' => 1099.99,
                'stock' => 25,
                'categories' => ['Home & Garden', 'Furniture'],
            ],
            [
                'name' => 'Wooden Coffee Table',
                'description' => 'Solid oak coffee table with rustic finish.',
                'price' => 299.99,
                'stock' => 40,
                'categories' => ['Home & Garden', 'Furniture'],
            ],
            [
                'name' => 'Wall Art Canvas Set',
                'description' => 'Set of 3 modern abstract canvas prints.',
                'price' => 149.99,
                'stock' => 60,
                'categories' => ['Home & Garden', 'Decor'],
            ],
            [
                'name' => 'Ceramic Dinnerware Set',
                'description' => '16-piece ceramic dinnerware set for 4 people.',
                'price' => 89.99,
                'stock' => 70,
                'categories' => ['Home & Garden', 'Kitchenware'],
            ],
            [
                'name' => 'Luxury Bedding Set',
                'description' => 'Egyptian cotton bedding set with 800 thread count.',
                'price' => 199.99,
                'compare_at_price' => 249.99,
                'stock' => 50,
                'categories' => ['Home & Garden', 'Bedding'],
            ],
            [
                'name' => 'Garden Tool Set',
                'description' => 'Complete 10-piece gardening tool set with carrying case.',
                'price' => 79.99,
                'stock' => 85,
                'categories' => ['Home & Garden', 'Gardening Tools'],
            ],
            [
                'name' => 'LED String Lights',
                'description' => 'Waterproof LED string lights for indoor and outdoor use.',
                'price' => 34.99,
                'stock' => 150,
                'categories' => ['Home & Garden', 'Lighting'],
            ],
            [
                'name' => 'Yoga Mat Premium',
                'description' => 'Non-slip eco-friendly yoga mat with carrying strap.',
                'price' => 49.99,
                'stock' => 100,
                'categories' => ['Sports & Outdoors', 'Fitness Equipment'],
            ],
            [
                'name' => 'Camping Tent 4-Person',
                'description' => 'Waterproof camping tent with easy setup system.',
                'price' => 199.99,
                'stock' => 45,
                'categories' => ['Sports & Outdoors', 'Camping Gear'],
            ],
            [
                'name' => 'Mountain Bike Pro',
                'description' => '27.5" mountain bike with 21-speed gear system.',
                'price' => 499.99,
                'compare_at_price' => 599.99,
                'stock' => 30,
                'is_featured' => true,
                'categories' => ['Sports & Outdoors', 'Cycling'],
            ],
            [
                'name' => 'Basketball Official Size',
                'description' => 'Official size 7 basketball for indoor and outdoor use.',
                'price' => 39.99,
                'stock' => 120,
                'categories' => ['Sports & Outdoors', 'Team Sports'],
            ],
            [
                'name' => 'Hiking Jacket',
                'description' => 'Waterproof breathable hiking jacket with multiple pockets.',
                'price' => 129.99,
                'stock' => 65,
                'categories' => ['Sports & Outdoors', 'Outdoor Apparel'],
            ],
            [
                'name' => 'The Great Novel',
                'description' => 'Bestselling fiction novel by renowned author.',
                'price' => 24.99,
                'stock' => 200,
                'categories' => ['Books & Media', 'Fiction'],
            ],
            [
                'name' => 'Business Strategy Guide',
                'description' => 'Comprehensive guide to modern business strategies.',
                'price' => 34.99,
                'stock' => 150,
                'categories' => ['Books & Media', 'Non-Fiction'],
            ],
            [
                'name' => 'Digital Audiobook Player',
                'description' => 'Dedicated audiobook player with long battery life.',
                'price' => 149.99,
                'stock' => 40,
                'categories' => ['Books & Media', 'Audiobooks'],
            ],
            [
                'name' => 'Classic Movie Collection',
                'description' => 'Blu-ray collection of 10 classic movies.',
                'price' => 79.99,
                'compare_at_price' => 99.99,
                'stock' => 55,
                'categories' => ['Books & Media', 'Movies'],
            ],
            [
                'name' => 'Building Blocks Set',
                'description' => '500-piece creative building blocks for ages 6+.',
                'price' => 49.99,
                'stock' => 180,
                'categories' => ['Toys & Games', 'Educational Toys'],
            ],
            [
                'name' => 'Action Figure Superhero',
                'description' => 'Collectible action figure with accessories.',
                'price' => 29.99,
                'stock' => 220,
                'categories' => ['Toys & Games', 'Action Figures'],
            ],
            [
                'name' => 'Strategy Board Game',
                'description' => 'Award-winning strategy board game for 2-4 players.',
                'price' => 59.99,
                'stock' => 95,
                'categories' => ['Toys & Games', 'Board Games'],
            ],
            [
                'name' => '1000-Piece Jigsaw Puzzle',
                'description' => 'Beautiful landscape jigsaw puzzle.',
                'price' => 24.99,
                'stock' => 130,
                'categories' => ['Toys & Games', 'Puzzles'],
            ],
            [
                'name' => 'Fashion Doll Playset',
                'description' => 'Fashion doll with wardrobe and accessories.',
                'price' => 39.99,
                'stock' => 160,
                'categories' => ['Toys & Games', 'Dolls'],
            ],
            [
                'name' => 'Vitamin C Serum',
                'description' => 'Brightening vitamin C serum for all skin types.',
                'price' => 34.99,
                'stock' => 200,
                'is_featured' => true,
                'categories' => ['Beauty & Health', 'Skincare'],
            ],
            [
                'name' => 'Keratin Hair Mask',
                'description' => 'Deep conditioning hair mask with keratin and argan oil.',
                'price' => 29.99,
                'stock' => 175,
                'categories' => ['Beauty & Health', 'Haircare'],
            ],
            [
                'name' => 'Makeup Palette Pro',
                'description' => '48-color eyeshadow palette with mirror.',
                'price' => 49.99,
                'compare_at_price' => 69.99,
                'stock' => 140,
                'categories' => ['Beauty & Health', 'Makeup'],
            ],
            [
                'name' => 'Luxury Perfume',
                'description' => 'Premium eau de parfum with floral notes.',
                'price' => 89.99,
                'stock' => 100,
                'categories' => ['Beauty & Health', 'Fragrances'],
            ],
            [
                'name' => 'Multivitamin Complex',
                'description' => 'Complete daily multivitamin supplement, 90 tablets.',
                'price' => 24.99,
                'stock' => 250,
                'categories' => ['Beauty & Health', 'Vitamins & Supplements'],
            ],
            [
                'name' => 'Organic Coffee Beans',
                'description' => '1kg premium arabica coffee beans, medium roast.',
                'price' => 19.99,
                'stock' => 300,
                'categories' => ['Food & Beverages', 'Coffee & Tea'],
            ],
            [
                'name' => 'Green Tea Selection',
                'description' => 'Premium green tea variety pack with 40 bags.',
                'price' => 14.99,
                'stock' => 280,
                'categories' => ['Food & Beverages', 'Coffee & Tea'],
            ],
            [
                'name' => 'Mixed Nuts Pack',
                'description' => 'Premium roasted mixed nuts, 500g resealable bag.',
                'price' => 12.99,
                'stock' => 350,
                'categories' => ['Food & Beverages', 'Snacks'],
            ],
            [
                'name' => 'Sparkling Water 12-Pack',
                'description' => 'Natural sparkling water, 12 x 500ml bottles.',
                'price' => 9.99,
                'stock' => 400,
                'categories' => ['Food & Beverages', 'Drinks'],
            ],
            [
                'name' => 'Artisan Cheese Collection',
                'description' => 'Selection of 5 gourmet cheeses from around the world.',
                'price' => 49.99,
                'compare_at_price' => 59.99,
                'stock' => 75,
                'categories' => ['Food & Beverages', 'Gourmet Foods'],
            ],
            [
                'name' => 'Wireless Charger Stand',
                'description' => 'Fast wireless charging stand compatible with all Qi devices.',
                'price' => 39.99,
                'stock' => 180,
                'categories' => ['Electronics'],
            ],
            [
                'name' => 'Smart Home Hub',
                'description' => 'Central control hub for all your smart home devices.',
                'price' => 129.99,
                'stock' => 95,
                'is_featured' => true,
                'categories' => ['Electronics'],
            ],
            [
                'name' => 'Portable Power Bank',
                'description' => '20000mAh portable power bank with dual USB ports.',
                'price' => 49.99,
                'stock' => 250,
                'categories' => ['Electronics'],
            ],
            [
                'name' => 'Gaming Mouse RGB',
                'description' => 'Professional gaming mouse with customizable RGB lighting.',
                'price' => 79.99,
                'compare_at_price' => 99.99,
                'stock' => 140,
                'categories' => ['Electronics'],
            ],
            [
                'name' => 'Mechanical Keyboard',
                'description' => 'RGB mechanical keyboard with blue switches.',
                'price' => 149.99,
                'stock' => 110,
                'is_featured' => true,
                'categories' => ['Electronics'],
            ],
        ];

        foreach ($products as $productData) {
            $categoryNames = $productData['categories'];
            unset($productData['categories']);

            $product = Product::create($productData);

            $categoryIds = ProductCategory::whereIn('name', $categoryNames)->pluck('id')->toArray();
            $product->categories()->attach($categoryIds);
        }

        $allProducts = Product::all();
        $randomProducts = $allProducts->random(min(10, $allProducts->count()));

        foreach ($randomProducts as $product) {
            $product->update([
                'stock' => fake()->numberBetween(1, 9),
            ]);
        }
    }
}
