export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: string;
    compare_at_price: string | null;
    stock: number;
    image: string | null;
    is_featured: boolean;
    in_stock: boolean;
    has_discount: boolean;
    discount_percentage: number | null;
    categories: Category[];
}

export interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    previous_page: number | null;
    next_page: number | null;
    first_page: number;
}

export interface ProductsIndexProps {
    products: Product[];
    pagination: Pagination | null;
}

