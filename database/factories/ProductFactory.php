<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 10, 1000),
            'compare_at_price' => fake()->optional()->randomFloat(2, 100, 1500),
            'stock' => fake()->numberBetween(0, 100),
            'image' => fake()->imageUrl(640, 480, 'products', true),
            'images' => [],
            'is_active' => fake()->boolean(80),
            'is_featured' => fake()->boolean(20),
        ];
    }
}
