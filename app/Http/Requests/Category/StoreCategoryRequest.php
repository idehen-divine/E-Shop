<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
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
            'parent_id' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    if ($value === null || $value === 'none') {
                        return;
                    }
                    $exists = \App\Models\ProductCategory::where('id', $value)->exists();
                    if (! $exists) {
                        $fail('The selected parent category is invalid.');
                    }
                },
            ],
            'order' => ['nullable', 'integer', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
