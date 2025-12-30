import {
    ColumnVisibilityDialog,
    defaultVisibleColumns as defaultColumns,
    type ColumnKey,
} from '@/components/admin/products/column-visibility-dialog';
import { CreateProductDialog } from '@/components/admin/products/create-product-dialog';
import { DeleteProductDialog } from '@/components/admin/products/delete-product-dialog';
import { EditProductDialog } from '@/components/admin/products/edit-product-dialog';
import { ProductTable } from '@/components/admin/products/product-table';
import { ToggleActiveDialog } from '@/components/admin/products/toggle-active-dialog';
import { ToggleFeaturedDialog } from '@/components/admin/products/toggle-featured-dialog';
import { UpdateStockDialog } from '@/components/admin/products/update-stock-dialog';
import { Pagination as PaginationComponent } from '@/components/products/pagination';
import { ProductFilters } from '@/components/products/product-filters';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAdminProductFilters } from '@/hooks/use-admin-product-filters';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Product } from '@/types/products';
import { Head } from '@inertiajs/react';
import { Package, Plus, Settings2 } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '#',
    },
];

export default function AdminProductsIndex({
    products: productsResponse,
    categories: categoriesResponse = {},
}: {
    products?: Record<string, unknown>;
    categories?: Record<string, unknown>;
}) {
    const products = (productsResponse?.data?.products ?? []) as Product[];
    const pagination = productsResponse?.data?.pagination ?? null;
    const categoriesData = useMemo(
        () => categoriesResponse?.data?.categories ?? [],
        [categoriesResponse],
    );
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [stockDialogOpen, setStockDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [toggleActiveDialogOpen, setToggleActiveDialogOpen] = useState(false);
    const [toggleFeaturedDialogOpen, setToggleFeaturedDialogOpen] =
        useState(false);
    const [columnVisibilityDialogOpen, setColumnVisibilityDialogOpen] =
        useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null,
    );

    const getDefaultVisibleColumns = (): ColumnKey[] => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('product-table-columns');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    return defaultColumns;
                }
            }
        }
        return defaultColumns;
    };

    const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>(
        getDefaultVisibleColumns,
    );

    const handleColumnsChange = (columns: ColumnKey[]) => {
        setVisibleColumns(columns);
        if (typeof window !== 'undefined') {
            localStorage.setItem(
                'product-table-columns',
                JSON.stringify(columns),
            );
        }
    };

    const categoriesList = useMemo(() => {
        if (Array.isArray(categoriesData)) {
            return categoriesData;
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
        selectedStatus,
        setSelectedStatus,
        selectedFeatured,
        setSelectedFeatured,
        sortBy,
        sortOrder,
        perPage,
        setPerPage,
        handleSort,
        navigateToPage,
    } = useAdminProductFilters({
        initialSearch: searchParams.get('search') || '',
        initialCategory: searchParams.get('category') || 'all',
        initialPrice: searchParams.get('price') || 'all',
        initialStatus: searchParams.get('status') || 'all',
        initialFeatured: searchParams.get('featured') || 'all',
        initialSortBy: searchParams.get('sort_by') || '',
        initialSortOrder:
            (searchParams.get('sort_order') as 'asc' | 'desc') || 'asc',
        initialPerPage: parseInt(searchParams.get('per_page') || '10', 10),
    });

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setEditDialogOpen(true);
    };

    const handleUpdateStock = (product: Product) => {
        setSelectedProduct(product);
        setStockDialogOpen(true);
    };

    const handleDelete = (product: Product) => {
        setSelectedProduct(product);
        setDeleteDialogOpen(true);
    };

    const handleToggleActive = (product: Product) => {
        setSelectedProduct(product);
        setToggleActiveDialogOpen(true);
    };

    const handleToggleFeatured = (product: Product) => {
        setSelectedProduct(product);
        setToggleFeaturedDialogOpen(true);
    };

    const handlePreviousPage = () => {
        if (pagination && pagination.previous_page) {
            navigateToPage(pagination.previous_page);
        }
    };

    const handleNextPage = () => {
        if (pagination && pagination.next_page) {
            navigateToPage(pagination.next_page);
        }
    };

    const handlePageClick = (page: number) => {
        navigateToPage(page);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products Management" />

            <div className="flex flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <Package className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Products</CardTitle>
                                    <CardDescription>
                                        Manage your product inventory
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setColumnVisibilityDialogOpen(true)
                                    }
                                    className="gap-2"
                                >
                                    <Settings2 className="h-4 w-4" />
                                    Columns
                                </Button>
                                <Button
                                    onClick={() => setCreateDialogOpen(true)}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Product
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ProductFilters
                            categories={categoriesList}
                            searchQuery={searchQuery}
                            selectedCategory={selectedCategory}
                            priceRange={priceRange}
                            selectedStatus={selectedStatus}
                            selectedFeatured={selectedFeatured}
                            onSearchChange={setSearchQuery}
                            onCategoryChange={setSelectedCategory}
                            onPriceRangeChange={setPriceRange}
                            onStatusChange={setSelectedStatus}
                            onFeaturedChange={setSelectedFeatured}
                        />
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Show per page:
                                </label>
                                <Select
                                    value={String(perPage)}
                                    onValueChange={(value) =>
                                        setPerPage(parseInt(value, 10))
                                    }
                                >
                                    <SelectTrigger className="w-20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <ProductTable
                            products={products}
                            onEdit={handleEdit}
                            onUpdateStock={handleUpdateStock}
                            onDelete={handleDelete}
                            onToggleActive={handleToggleActive}
                            onToggleFeatured={handleToggleFeatured}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            visibleColumns={visibleColumns}
                        />
                        {pagination && pagination.last_page > 1 && (
                            <PaginationComponent
                                pagination={pagination}
                                onPageChange={handlePageClick}
                                onPrevious={handlePreviousPage}
                                onNext={handleNextPage}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            <CreateProductDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                categories={categoriesData}
            />

            <ColumnVisibilityDialog
                open={columnVisibilityDialogOpen}
                onOpenChange={setColumnVisibilityDialogOpen}
                visibleColumns={visibleColumns}
                onColumnsChange={handleColumnsChange}
            />

            {selectedProduct && (
                <>
                    <EditProductDialog
                        open={editDialogOpen}
                        onOpenChange={setEditDialogOpen}
                        product={selectedProduct}
                        categories={categoriesData}
                    />

                    <UpdateStockDialog
                        open={stockDialogOpen}
                        onOpenChange={setStockDialogOpen}
                        product={selectedProduct}
                    />

                    <DeleteProductDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                        product={selectedProduct}
                    />

                    <ToggleActiveDialog
                        open={toggleActiveDialogOpen}
                        onOpenChange={setToggleActiveDialogOpen}
                        product={selectedProduct}
                    />

                    <ToggleFeaturedDialog
                        open={toggleFeaturedDialogOpen}
                        onOpenChange={setToggleFeaturedDialogOpen}
                        product={selectedProduct}
                    />
                </>
            )}
        </AppLayout>
    );
}
