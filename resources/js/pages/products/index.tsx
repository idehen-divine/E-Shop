import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useProductFilters } from '@/hooks/use-product-filters';
import ShopLayout from '@/layouts/app/shop-layout';
import cart from '@/routes/cart';
import { type BreadcrumbItem } from '@/types';
import { type ProductsIndexProps } from '@/types/products';
import { Head, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    Search,
    ShoppingCart,
} from 'lucide-react';
import { useMemo, useState } from 'react';

export default function ProductsIndex({
    products = [],
    pagination,
    cartItems = {},
}: ProductsIndexProps) {
    const searchParams = new URLSearchParams(
        typeof window !== 'undefined' ? window.location.search : '',
    );
    const [addingToCart, setAddingToCart] = useState<Set<number>>(new Set());
    const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

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

    const handleAddToCart = (productId: number) => {
        setAddingToCart((prev) => new Set(prev).add(productId));

        router.post(
            cart.store().url,
            {
                product_id: productId.toString(),
                quantity: 1,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setAddingToCart((prev) => {
                        const next = new Set(prev);
                        next.delete(productId);
                        return next;
                    });
                },
            },
        );
    };

    const handleQuantityChange = (
        cartItemId: string,
        productId: number,
        newQuantity: number,
        maxStock: number,
    ) => {
        if (newQuantity < 1) {
            return;
        }

        if (newQuantity > maxStock) {
            newQuantity = maxStock;
        }

        setUpdatingItems((prev) => new Set(prev).add(cartItemId));

        router.put(
            cart.update({ cartItemId }).url,
            { quantity: newQuantity },
            {
                preserveScroll: true,
                onFinish: () => {
                    setUpdatingItems((prev) => {
                        const next = new Set(prev);
                        next.delete(cartItemId);
                        return next;
                    });
                },
            },
        );
    };

    const allCategories = useMemo(
        () =>
            Array.from(
                new Set(
                    productList.flatMap(
                        (p) => p.categories?.map((c) => c.slug) || [],
                    ),
                ),
            ),
        [productList],
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

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="w-full flex-1 sm:max-w-xs">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Categories
                                </SelectItem>
                                {allCategories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category
                                            .split('-')
                                            .map(
                                                (word) =>
                                                    word
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    word.slice(1),
                                            )
                                            .join(' ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={priceRange}
                            onValueChange={setPriceRange}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Prices</SelectItem>
                                <SelectItem value="under-50">
                                    Under $50
                                </SelectItem>
                                <SelectItem value="50-100">
                                    $50 - $100
                                </SelectItem>
                                <SelectItem value="100-200">
                                    $100 - $200
                                </SelectItem>
                                <SelectItem value="over-200">
                                    Over $200
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {productList.map((product) => (
                        <Card
                            key={product.id}
                            className="overflow-hidden transition-shadow duration-200 hover:shadow-md"
                        >
                            <div className="relative aspect-square w-full bg-muted">
                                <img
                                    src={
                                        product.image ||
                                        'https://via.placeholder.com/300x300?text=Product+Image'
                                    }
                                    alt={product.name}
                                    className="h-64 w-full object-cover object-center"
                                />
                                {!product.in_stock && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                                        <Badge
                                            variant="secondary"
                                            className="text-base"
                                        >
                                            Out of Stock
                                        </Badge>
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-4">
                                <h3 className="mb-2 text-lg font-semibold">
                                    {product.name}
                                </h3>
                                {product.description && (
                                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                                        {product.description}
                                    </p>
                                )}
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-2xl font-bold text-primary">
                                        ${product.price}
                                    </span>
                                    <span
                                        className={`text-sm font-medium ${
                                            product.stock < 10
                                                ? 'text-red-600'
                                                : 'text-green-600'
                                        }`}
                                    >
                                        {product.stock} in stock
                                    </span>
                                </div>
                                {cartItems[product.id] ? (
                                    <div className="flex w-full items-center justify-between rounded-md border">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-none"
                                            onClick={() =>
                                                handleQuantityChange(
                                                    cartItems[product.id]!.id,
                                                    parseInt(product.id),
                                                    cartItems[product.id]!
                                                        .quantity - 1,
                                                    product.stock,
                                                )
                                            }
                                            disabled={
                                                cartItems[product.id]!
                                                    .quantity <= 1 ||
                                                updatingItems.has(
                                                    cartItems[product.id]!.id,
                                                )
                                            }
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            type="number"
                                            min="1"
                                            max={product.stock}
                                            value={
                                                cartItems[product.id]!.quantity
                                            }
                                            onChange={(e) => {
                                                const value = parseInt(
                                                    e.target.value,
                                                );
                                                if (
                                                    !isNaN(value) &&
                                                    value >= 1 &&
                                                    value <= product.stock
                                                ) {
                                                    handleQuantityChange(
                                                        cartItems[product.id]!
                                                            .id,
                                                        parseInt(product.id),
                                                        value,
                                                        product.stock,
                                                    );
                                                }
                                            }}
                                            className="h-9 w-16 border-x text-center"
                                            disabled={updatingItems.has(
                                                cartItems[product.id]!.id,
                                            )}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-none"
                                            onClick={() =>
                                                handleQuantityChange(
                                                    cartItems[product.id]!.id,
                                                    parseInt(product.id),
                                                    cartItems[product.id]!
                                                        .quantity + 1,
                                                    product.stock,
                                                )
                                            }
                                            disabled={
                                                cartItems[product.id]!
                                                    .quantity >=
                                                    product.stock ||
                                                updatingItems.has(
                                                    cartItems[product.id]!.id,
                                                )
                                            }
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        className="w-full"
                                        disabled={
                                            !product.in_stock ||
                                            addingToCart.has(
                                                parseInt(product.id),
                                            )
                                        }
                                        onClick={() =>
                                            handleAddToCart(
                                                parseInt(product.id),
                                            )
                                        }
                                    >
                                        {addingToCart.has(parseInt(product.id))
                                            ? 'Adding...'
                                            : product.in_stock
                                              ? 'Add to Cart'
                                              : 'Out of Stock'}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {productList.length === 0 && (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed">
                        <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-semibold">
                            No products found
                        </h3>
                        <p className="text-muted-foreground">
                            Try adjusting your filters
                        </p>
                    </div>
                )}

                {pagination && pagination.last_page > 1 && (
                    <div className="mt-8 space-y-4">
                        <div className="flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">
                                Showing {pagination.from} to {pagination.to} of{' '}
                                {pagination.total} products
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!pagination.previous_page}
                                onClick={handlePreviousPage}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>

                            <div className="flex items-center gap-1">
                                {Array.from(
                                    { length: pagination.last_page },
                                    (_, i) => i + 1,
                                )
                                    .filter((page) => {
                                        const current = pagination.current_page;
                                        const last = pagination.last_page;
                                        return (
                                            page === 1 ||
                                            page === last ||
                                            (page >= current - 1 &&
                                                page <= current + 1)
                                        );
                                    })
                                    .map((page, index, array) => {
                                        const showEllipsis =
                                            index > 0 &&
                                            array[index - 1] !== page - 1;
                                        return (
                                            <div
                                                key={page}
                                                className="flex items-center gap-1"
                                            >
                                                {showEllipsis && (
                                                    <span className="px-2 text-sm text-muted-foreground">
                                                        ...
                                                    </span>
                                                )}
                                                <Button
                                                    variant={
                                                        page ===
                                                        pagination.current_page
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    size="sm"
                                                    onClick={() =>
                                                        handlePageClick(page)
                                                    }
                                                >
                                                    {page}
                                                </Button>
                                            </div>
                                        );
                                    })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!pagination.next_page}
                                onClick={handleNextPage}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}
