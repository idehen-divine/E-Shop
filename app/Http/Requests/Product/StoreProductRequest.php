<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'compare_at_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
            'images' => ['nullable', 'array'],
            'images.*' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
            'is_active' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'categories' => ['nullable', 'array'],
            'categories.*' => ['required', 'string', 'exists:product_categories,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('is_featured')) {
            $value = $this->input('is_featured');

            if (is_bool($value)) {
                return;
            }

            if ($value === null || $value === '') {
                $this->merge(['is_featured' => false]);

                return;
            }

            $booleanValue = filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            $this->merge(['is_featured' => $booleanValue ?? false]);
        }
    }
}
