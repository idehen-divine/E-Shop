<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'compare_at_price' => $this->compare_at_price,
            'stock' => $this->stock,
            'sku' => $this->sku,
            'image' => $this->image,
            'images' => $this->images,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'in_stock' => $this->isInStock(),
            'has_discount' => $this->hasDiscount(),
            'discount_percentage' => $this->getDiscountPercentage(),
            'categories' => $this->whenLoaded('categories', function () {
                return $this->categories->map(fn ($category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                ]);
            }),
            'created_at' => $this->created_at,
        ];
    }
}
