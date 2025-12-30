import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Product } from '@/types/products';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Edit,
    MoreVertical,
    Package,
    Power,
    Star,
    Trash2,
} from 'lucide-react';
import { type ColumnKey } from './column-visibility-dialog';

interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onUpdateStock: (product: Product) => void;
    onDelete: (product: Product) => void;
    onToggleActive?: (product: Product) => void;
    onToggleFeatured?: (product: Product) => void;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    onSort?: (column: string) => void;
    visibleColumns?: ColumnKey[];
}

const defaultVisibleColumns: ColumnKey[] = [
    'name',
    'sku',
    'price',
    'stock',
    'actions',
];

export function ProductTable({
    products,
    onEdit,
    onUpdateStock,
    onDelete,
    onToggleActive,
    onToggleFeatured,
    sortBy,
    sortOrder = 'asc',
    onSort,
    visibleColumns = defaultVisibleColumns,
}: ProductTableProps) {
    const handleSort = (column: string) => {
        if (!onSort) {
            return;
        }
        onSort(column);
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (!onSort || sortBy !== column) {
            return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
        }
        if (sortOrder === 'asc') {
            return <ArrowUp className="ml-2 h-4 w-4" />;
        }
        return <ArrowDown className="ml-2 h-4 w-4" />;
    };

    const renderSortableHeader = (
        column: string,
        children: React.ReactNode,
    ) => {
        if (!onSort) {
            return (
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {children}
                </th>
            );
        }
        return (
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                <button
                    onClick={() => handleSort(column)}
                    className="flex items-center transition-colors hover:text-foreground"
                >
                    {children}
                    <SortIcon column={column} />
                </button>
            </th>
        );
    };
    const isColumnVisible = (column: ColumnKey): boolean => {
        return visibleColumns.includes(column);
    };

    const getVisibleColumnCount = (): number => {
        return visibleColumns.length;
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b">
                        {isColumnVisible('name') &&
                            renderSortableHeader('name', 'Product')}
                        {isColumnVisible('sku') &&
                            renderSortableHeader('sku', 'SKU')}
                        {isColumnVisible('price') &&
                            renderSortableHeader('price', 'Price')}
                        {isColumnVisible('stock') &&
                            renderSortableHeader('stock', 'Stock')}
                        {isColumnVisible('status') && (
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Status
                            </th>
                        )}
                        {isColumnVisible('featured') && (
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Featured
                            </th>
                        )}
                        {isColumnVisible('categories') && (
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Categories
                            </th>
                        )}
                        {isColumnVisible('created_at') &&
                            renderSortableHeader('created_at', 'Created Date')}
                        {isColumnVisible('actions') && (
                            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td
                                colSpan={getVisibleColumnCount()}
                                className="px-4 py-8 text-center text-sm text-muted-foreground"
                            >
                                No products found
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr
                                key={product.id}
                                className="border-b transition-colors hover:bg-muted/50"
                            >
                                {isColumnVisible('name') && (
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-10 w-10 rounded-md object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                                                    <Package className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium">
                                                    {product.name}
                                                </div>
                                                {product.description && (
                                                    <div className="line-clamp-1 text-xs text-muted-foreground">
                                                        {product.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                )}
                                {isColumnVisible('sku') && (
                                    <td className="px-4 py-3 text-sm">
                                        {product.sku || '-'}
                                    </td>
                                )}
                                {isColumnVisible('price') && (
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                ${product.price}
                                            </span>
                                            {product.compare_at_price && (
                                                <span className="text-xs text-muted-foreground line-through">
                                                    ${product.compare_at_price}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                )}
                                {isColumnVisible('stock') && (
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-sm font-medium ${
                                                    product.stock === 0
                                                        ? 'text-destructive'
                                                        : product.stock < 10
                                                          ? 'text-yellow-600 dark:text-yellow-400'
                                                          : 'text-foreground'
                                                }`}
                                            >
                                                {product.stock}
                                            </span>
                                            {product.stock < 10 && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    Low
                                                </Badge>
                                            )}
                                        </div>
                                    </td>
                                )}
                                {isColumnVisible('status') && (
                                    <td className="px-4 py-3">
                                        {product.is_active !== undefined ? (
                                            product.is_active ? (
                                                <Badge variant="default">
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    Inactive
                                                </Badge>
                                            )
                                        ) : (
                                            <Badge variant="default">
                                                Active
                                            </Badge>
                                        )}
                                    </td>
                                )}
                                {isColumnVisible('featured') && (
                                    <td className="px-4 py-3">
                                        {product.is_featured ? (
                                            <Badge>Featured</Badge>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                -
                                            </span>
                                        )}
                                    </td>
                                )}
                                {isColumnVisible('categories') && (
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {product.categories &&
                                            product.categories.length > 0 ? (
                                                product.categories.map(
                                                    (category) => (
                                                        <Badge
                                                            key={category.id}
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {category.name}
                                                        </Badge>
                                                    ),
                                                )
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    No categories
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                )}
                                {isColumnVisible('created_at') && (
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {product.created_at
                                            ? new Date(
                                                  product.created_at,
                                              ).toLocaleDateString('en-US', {
                                                  year: 'numeric',
                                                  month: 'short',
                                                  day: 'numeric',
                                              })
                                            : '-'}
                                    </td>
                                )}
                                {isColumnVisible('actions') && (
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onEdit(product)
                                                        }
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    {onToggleActive && (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                onToggleActive(
                                                                    product,
                                                                )
                                                            }
                                                        >
                                                            <Power className="mr-2 h-4 w-4" />
                                                            {product.is_active
                                                                ? 'Suspend'
                                                                : 'Enable'}
                                                        </DropdownMenuItem>
                                                    )}
                                                    {onToggleFeatured && (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                onToggleFeatured(
                                                                    product,
                                                                )
                                                            }
                                                        >
                                                            <Star className="mr-2 h-4 w-4" />
                                                            {product.is_featured
                                                                ? 'Unfeature'
                                                                : 'Feature'}
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onUpdateStock(
                                                                product,
                                                            )
                                                        }
                                                    >
                                                        <Package className="mr-2 h-4 w-4" />
                                                        Update Stock
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onDelete(product)
                                                        }
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
