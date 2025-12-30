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
        ];
    }
}
