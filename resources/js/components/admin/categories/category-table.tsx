import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Category } from '@/types/products';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Edit,
    FolderTree,
    MoreVertical,
    Power,
    Trash2,
} from 'lucide-react';
import { type CategoryColumnKey } from './category-column-visibility-dialog';

interface CategoryTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    onToggleActive?: (category: Category) => void;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    onSort?: (column: string) => void;
    visibleColumns?: CategoryColumnKey[];
}

const sortableColumns = ['name', 'parent', 'created_at'];

export function CategoryTable({
    categories,
    onEdit,
    onDelete,
    onToggleActive,
    sortBy,
    sortOrder = 'asc',
    onSort,
    visibleColumns = ['name', 'parent', 'status', 'actions'],
}: CategoryTableProps) {
    const handleSort = (column: string) => {
        if (!onSort || !sortableColumns.includes(column)) {
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
        const isSortable = sortableColumns.includes(column);
        if (!onSort || !isSortable) {
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

    const isColumnVisible = (column: CategoryColumnKey): boolean => {
        return visibleColumns.includes(column);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b">
                        {isColumnVisible('name') &&
                            renderSortableHeader('name', 'Category')}
                        {isColumnVisible('parent') &&
                            renderSortableHeader('parent', 'Parent')}
                        {isColumnVisible('status') && (
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Status
                            </th>
                        )}
                        {isColumnVisible('description') && (
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Description
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
                    {categories.length === 0 ? (
                        <tr>
                            <td
                                colSpan={visibleColumns.length}
                                className="px-4 py-8 text-center text-sm text-muted-foreground"
                            >
                                No categories found
                            </td>
                        </tr>
                    ) : (
                        categories.map((category) => (
                            <tr
                                key={category.id}
                                className="border-b transition-colors hover:bg-muted/50"
                            >
                                {isColumnVisible('name') && (
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {category.image ? (
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    className="h-10 w-10 rounded-md object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                                                    <FolderTree className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium">
                                                    {category.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                )}
                                {isColumnVisible('parent') && (
                                    <td className="px-4 py-3 text-sm">
                                        {category.parent ? (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {category.parent.name}
                                            </Badge>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                Root
                                            </span>
                                        )}
                                    </td>
                                )}
                                {isColumnVisible('status') && (
                                    <td className="px-4 py-3">
                                        {category.is_active !== undefined ? (
                                            category.is_active ? (
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
                                {isColumnVisible('description') && (
                                    <td className="line-clamp-1 px-4 py-3 text-sm text-muted-foreground">
                                        {category.description ?? '-'}
                                    </td>
                                )}
                                {isColumnVisible('created_at') && (
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {category.created_at
                                            ? new Date(
                                                  category.created_at,
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
                                                            onEdit(category)
                                                        }
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    {onToggleActive && (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                onToggleActive(
                                                                    category,
                                                                )
                                                            }
                                                        >
                                                            <Power className="mr-2 h-4 w-4" />
                                                            {category.is_active
                                                                ? 'Deactivate'
                                                                : 'Activate'}
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onDelete(category)
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
