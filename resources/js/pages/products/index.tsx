import { EmptyProducts } from '@/components/products/empty-products';
import { Pagination } from '@/components/products/pagination';
import { ProductCard } from '@/components/products/product-card';
import { ProductFilters } from '@/components/products/product-filters';
import { useProductFilters } from '@/hooks/use-product-filters';
import ShopLayout from '@/layouts/app/shop-layout';
import { type BreadcrumbItem } from '@/types';
import { type ProductsIndexProps } from '@/types/products';
import { Head } from '@inertiajs/react';
import { useMemo } from 'react';

export default function ProductsIndex({
    products = [],
    pagination,
    cartItems = {},
    categories = [],
}: ProductsIndexProps) {
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

    const productList = useMemo(
        () => (Array.isArray(products) ? products : []),
        [products],
    );

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
                    categories={categories}
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                    priceRange={priceRange}
                    onSearchChange={setSearchQuery}
                    onCategoryChange={setSelectedCategory}
                    onPriceRangeChange={setPriceRange}
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {productList.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            cartItem={cartItems[product.id]}
                        />
                    ))}
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
