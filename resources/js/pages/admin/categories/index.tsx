import {
    CategoryColumnVisibilityDialog,
    defaultVisibleColumns as defaultCategoryColumns,
    type CategoryColumnKey,
} from '@/components/admin/categories/category-column-visibility-dialog';
import { CategoryFilters } from '@/components/admin/categories/category-filters';
import { CategoryTable } from '@/components/admin/categories/category-table';
import { CreateCategoryDialog } from '@/components/admin/categories/create-category-dialog';
import { DeleteCategoryDialog } from '@/components/admin/categories/delete-category-dialog';
import { EditCategoryDialog } from '@/components/admin/categories/edit-category-dialog';
import { Pagination as PaginationComponent } from '@/components/products/pagination';
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
import { useAdminCategoryFilters } from '@/hooks/use-admin-category-filters';
import { useDialogState } from '@/hooks/use-dialog-state';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Category, type Pagination } from '@/types/products';
import { Head } from '@inertiajs/react';
import { FolderTree, Plus, Settings2 } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '#',
    },
];

interface AdminCategoriesIndexProps {
    categories?: {
        data: {
            categories:
                | Category[]
                | {
                      code: number;
                      message: string;
                      data: Category[];
                      pagination?: Pagination | null;
                  };
            parentCategories:
                | Category[]
                | {
                      code: number;
                      message: string;
                      data: Category[];
                  };
        };
    };
}

export default function AdminCategoriesIndex({
    categories: categoriesProp,
}: AdminCategoriesIndexProps) {
    const categoriesList = useMemo(() => {
        const rawCategories = categoriesProp?.data?.categories;

        // Handle serialized response from backend
        if (
            rawCategories &&
            typeof rawCategories === 'object' &&
            'data' in rawCategories
        ) {
            const innerData = rawCategories.data;
            // Check if data contains categories array
            if (
                innerData &&
                typeof innerData === 'object' &&
                'categories' in innerData
            ) {
                return Array.isArray(innerData.categories)
                    ? innerData.categories
                    : [];
            }
            return Array.isArray(innerData) ? innerData : [];
        }

        // Handle direct array
        if (Array.isArray(rawCategories)) {
            return rawCategories;
        }

        return [];
    }, [categoriesProp]);

    const pagination = useMemo(() => {
        const rawCategories = categoriesProp?.data?.categories;
        if (
            rawCategories &&
            typeof rawCategories === 'object' &&
            'data' in rawCategories
        ) {
            const innerData = rawCategories.data;
            if (
                innerData &&
                typeof innerData === 'object' &&
                'pagination' in innerData
            ) {
                return innerData.pagination ?? null;
            }
        }
        return categoriesProp?.data?.pagination ?? null;
    }, [categoriesProp]);

    const parentCategories = useMemo(() => {
        const rawParents = categoriesProp?.data?.parentCategories;

        // Handle serialized response from backend
        if (
            rawParents &&
            typeof rawParents === 'object' &&
            'data' in rawParents
        ) {
            const innerData = rawParents.data;
            // Check if data contains categories array or is direct array
            if (
                innerData &&
                typeof innerData === 'object' &&
                'categories' in innerData
            ) {
                return Array.isArray(innerData.categories)
                    ? innerData.categories
                    : [];
            }
            return Array.isArray(innerData) ? innerData : [];
        }

        // Handle direct array
        if (Array.isArray(rawParents)) {
            return rawParents;
        }

        return [];
    }, [categoriesProp]);
    const [columnVisibilityDialogOpen, setColumnVisibilityDialogOpen] =
        useState(false);

    const getDefaultVisibleColumns = (): CategoryColumnKey[] => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('category-table-columns');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    return defaultCategoryColumns;
                }
            }
        }
        return defaultCategoryColumns;
    };

    const [visibleColumns, setVisibleColumns] = useState<CategoryColumnKey[]>(
        getDefaultVisibleColumns,
    );

    const handleColumnsChange = (columns: CategoryColumnKey[]) => {
        setVisibleColumns(columns);
        if (typeof window !== 'undefined') {
            localStorage.setItem(
                'category-table-columns',
                JSON.stringify(columns),
            );
        }
    };

    const searchParams = new URLSearchParams(
        typeof window !== 'undefined' ? window.location.search : '',
    );

    const {
        searchQuery,
        setSearchQuery,
        sortBy,
        sortOrder,
        perPage,
        setPerPage,
        selectedParent,
        setSelectedParent,
        handleSort,
        navigateToPage,
    } = useAdminCategoryFilters({
        initialSearch: searchParams.get('search') || '',
        initialParent: searchParams.get('parent') || 'all',
        initialSortBy: searchParams.get('sort_by') || '',
        initialSortOrder:
            (searchParams.get('sort_order') as 'asc' | 'desc') || 'asc',
        initialPerPage: parseInt(searchParams.get('per_page') || '10', 10),
        basePath: '/admin/categories',
    });

    const { openDialog, closeDialog, isDialogOpen, getSelectedItem } =
        useDialogState<Category>(['edit', 'delete', 'create']);

    const handleEdit = (category: Category): void => {
        openDialog('edit', category);
    };

    const handleDelete = (category: Category): void => {
        openDialog('delete', category);
    };

    const selectedCategory =
        getSelectedItem('edit') || getSelectedItem('delete');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories Management" />

            <div className="flex flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <FolderTree className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Categories</CardTitle>
                                    <CardDescription>
                                        Manage your product categories
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
                                    onClick={() => openDialog('create')}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Category
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CategoryFilters
                            searchQuery={searchQuery}
                            selectedParent={selectedParent}
                            categories={parentCategories}
                            onSearchChange={setSearchQuery}
                            onParentChange={setSelectedParent}
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
                        <CategoryTable
                            categories={categoriesList}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            visibleColumns={visibleColumns}
                        />
                        {pagination && pagination.last_page > 1 && (
                            <PaginationComponent
                                pagination={pagination}
                                onPageChange={navigateToPage}
                                onPrevious={() => {
                                    if (pagination.previous_page) {
                                        navigateToPage(
                                            pagination.previous_page,
                                        );
                                    }
                                }}
                                onNext={() => {
                                    if (pagination.next_page) {
                                        navigateToPage(pagination.next_page);
                                    }
                                }}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            <CategoryColumnVisibilityDialog
                open={columnVisibilityDialogOpen}
                onOpenChange={setColumnVisibilityDialogOpen}
                visibleColumns={visibleColumns}
                onColumnsChange={handleColumnsChange}
            />

            <CreateCategoryDialog
                open={isDialogOpen('create')}
                onOpenChange={(open) => {
                    if (!open) {
                        closeDialog('create');
                    }
                }}
                parentCategories={parentCategories}
            />

            {selectedCategory && (
                <>
                    <EditCategoryDialog
                        open={isDialogOpen('edit')}
                        onOpenChange={(open) => {
                            if (!open) {
                                closeDialog('edit');
                            }
                        }}
                        category={selectedCategory}
                        parentCategories={parentCategories}
                    />

                    <DeleteCategoryDialog
                        open={isDialogOpen('delete')}
                        onOpenChange={(open) => {
                            if (!open) {
                                closeDialog('delete');
                            }
                        }}
                        category={selectedCategory}
                    />
                </>
            )}
        </AppLayout>
    );
}
