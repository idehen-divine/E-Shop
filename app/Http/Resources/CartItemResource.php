<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product' => [
                'id' => $this->product->id,
                'name' => $this->product->name,
                'slug' => $this->product->slug,
                'image' => $this->product->image,
                'price' => (string) $this->product->price,
                'stock' => $this->product->stock,
            ],
            'quantity' => $this->quantity,
            'price' => (string) $this->price,
            'subtotal' => (string) $this->subtotal,
        ];
    }
}
