<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $items = $this->whenLoaded('items');

        return [
            'id' => $this->id,
            'items' => $items ? CartItemResource::collection($items) : [],
            'total' => (string) $this->total,
            'item_count' => $this->item_count,
        ];
    }
}
