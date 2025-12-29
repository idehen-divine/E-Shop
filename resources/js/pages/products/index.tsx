import { EmptyProducts } from '@/components/products/empty-products';
import { Pagination } from '@/components/products/pagination';
import { ProductCard } from '@/components/products/product-card';
import { ProductFilters } from '@/components/products/product-filters';
import { useProductFilters } from '@/hooks/use-product-filters';
import ShopLayout from '@/layouts/app/shop-layout';
import { type BreadcrumbItem } from '@/types';
import {
    type CartItem,
    type Category,
    type Pagination as PaginationType,
    type Product,
} from '@/types/products';
import { Head } from '@inertiajs/react';
import { useMemo } from 'react';

interface ServiceResponse<T> {
    code: number;
    message: string;
    data?: T;
    error?: string;
}

export default function ProductsIndex({
    products,
    cart,
    categories,
}: {
    products?: ServiceResponse<{
        products: Product[];
        pagination: PaginationType;
    }>;
    cart?: ServiceResponse<{ cart: { items: CartItem[] } }>;
    categories?: ServiceResponse<{ categories: Category[] }>;
}) {
    const productsData = (
        products as ServiceResponse<{
            products: Product[];
            pagination: PaginationType;
        }>
    )?.data;
    const cartData = (cart as ServiceResponse<{ cart: { items: CartItem[] } }>)
        ?.data;
    const categoriesData = (
        categories as ServiceResponse<{ categories: Category[] }>
    )?.data;

    const productList = useMemo(() => {
        const productsArray = productsData?.products;
        if (productsArray && Array.isArray(productsArray)) {
            return productsArray;
        }
        return [];
    }, [productsData]);

    const pagination = productsData?.pagination || null;

    const cartItems = useMemo(() => {
        const items = cartData?.cart?.items;
        if (items && Array.isArray(items)) {
            return items;
        }
        return [];
    }, [cartData]);

    const categoriesList = useMemo(() => {
        const cats = categoriesData?.categories;
        if (cats && Array.isArray(cats)) {
            return cats;
        }
        return [];
    }, [categoriesData]);
    const searchParams = new URLSearchParams(
        typeof window !== 'undefined' ? window.location.search : '',
    );

    const {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        navigateToPage,
    } = useProductFilters({
        initialSearch: searchParams.get('search') || '',
        initialCategory: searchParams.get('category') || 'all',
        initialPrice: searchParams.get('price') || 'all',
    });

    const cartItemsMap = useMemo(() => {
        const map: Record<string, CartItem> = {};
        if (Array.isArray(cartItems)) {
            cartItems.forEach((item) => {
                map[item.product.id] = item;
            });
        }
        return map;
    }, [cartItems]);

    const handlePreviousPage = () => {
        if (pagination?.previous_page) {
            navigateToPage(pagination.previous_page);
        }
    };

    const handleNextPage = () => {
        if (pagination?.next_page) {
            navigateToPage(pagination.next_page);
        }
    };

    const handlePageClick = (page: number) => {
        navigateToPage(page);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Products',
            href: '/',
        },
    ];

    return (
        <ShopLayout breadcrumbs={breadcrumbs}>
            <Head title="Products - E-Commerce Store" />
            <div className="mx-auto w-full max-w-[1536px] py-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Our Products</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Browse our collection of quality products
                    </p>
                </div>

                <ProductFilters
                    categories={categoriesList}
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                    priceRange={priceRange}
                    onSearchChange={setSearchQuery}
                    onCategoryChange={setSelectedCategory}
                    onPriceRangeChange={setPriceRange}
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {productList.map((product) => {
                        const cartItem = cartItemsMap[product.id];
                        return (
                            <ProductCard
                                key={product.id}
                                product={product}
                                cartItem={
                                    cartItem
                                        ? {
                                              id: cartItem.id,
                                              quantity: cartItem.quantity,
                                          }
                                        : undefined
                                }
                            />
                        );
                    })}
                </div>

                {productList.length === 0 && <EmptyProducts />}

                {pagination && pagination.last_page > 1 && (
                    <Pagination
                        pagination={pagination}
                        onPageChange={handlePageClick}
                        onPrevious={handlePreviousPage}
                        onNext={handleNextPage}
                    />
                )}
            </div>
        </ShopLayout>
    );
}
