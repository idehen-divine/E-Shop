<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoryId = $this->route('id');

        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'parent_id' => [
                'nullable',
                function ($attribute, $value, $fail) use ($categoryId) {
                    if ($value === null || $value === 'none') {
                        return;
                    }
                    $exists = \App\Models\ProductCategory::where('id', $value)
                        ->where('id', '!=', $categoryId)
                        ->exists();
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
