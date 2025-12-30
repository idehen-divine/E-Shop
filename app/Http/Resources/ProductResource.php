<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $imageUrl = null;
        if (! empty($this->image)) {
            if (Storage::disk('public')->exists($this->image)) {
                $imageUrl = Storage::url($this->image);
            } else {
                $encodedName = urlencode($this->name);
                $imageUrl = "https://placehold.co/800x800/d5d5d5/000000?text={$encodedName}";
            }
        } else {
            $encodedName = urlencode($this->name);
            $imageUrl = "https://placehold.co/800x800/d5d5d5/000000?text={$encodedName}";
        }

        $galleryImages = [];

        if (! empty($this->images) && is_array($this->images)) {
            foreach ($this->images as $index => $imagePath) {
                if (Storage::disk('public')->exists($imagePath)) {
                    $url = Storage::url($imagePath);
                    $galleryImages[] = $url;
                }
            }
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'compare_at_price' => $this->compare_at_price,
            'stock' => $this->stock,
            'sku' => $this->sku,
            'image' => $imageUrl,
            'images' => $galleryImages,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'in_stock' => $this->isInStock(),
            'has_discount' => $this->hasDiscount(),
            'discount_percentage' => $this->getDiscountPercentage(),
            'categories' => $this->whenLoaded('categories', function () {
                return CategoryResource::collection($this->categories);
            }),
            'created_at' => $this->created_at,
        ];
    }
}
