<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar ?? null,
            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            'two_factor_enabled' => $this->two_factor_confirmed_at !== null,
            'is_active' => $this->is_active ?? true,
            'roles' => $this->whenLoaded('roles', function () {
                return $this->getRoleNames()->toArray();
            }, []),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
