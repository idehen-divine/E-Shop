import { type Product } from '@/types/products';

export function getAllCategories(products: Product[]): string[] {
    return Array.from(
        new Set(
            products.flatMap((p) => p.categories?.map((c) => c.slug) || []),
        ),
    );
}

export function formatCategoryName(categorySlug: string): string {
    return categorySlug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

