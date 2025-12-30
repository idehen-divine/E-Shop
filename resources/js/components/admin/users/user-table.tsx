import { type UserColumnKey } from '@/components/admin/users/user-column-visibility-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type User } from '@/types';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Edit,
    MoreVertical,
    Power,
    Shield,
    Trash2,
} from 'lucide-react';

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onToggleActive?: (user: User) => void;
    onManageRoles?: (user: User) => void;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    onSort?: (column: string) => void;
    visibleColumns?: UserColumnKey[];
}

export function UserTable({
    users,
    onEdit,
    onDelete,
    onToggleActive,
    onManageRoles,
    sortBy,
    sortOrder = 'desc',
    onSort,
    visibleColumns = ['name', 'email', 'verified', 'actions'],
}: UserTableProps) {
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

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b">
                        {visibleColumns.includes('name') &&
                            renderSortableHeader('name', 'User')}
                        {visibleColumns.includes('email') &&
                            renderSortableHeader('email', 'Email')}
                        {visibleColumns.includes('verified') && (
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Verified
                            </th>
                        )}
                        {visibleColumns.includes('status') && (
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Status
                            </th>
                        )}
                        {visibleColumns.includes('created_at') &&
                            renderSortableHeader('created_at', 'Joined')}
                        {visibleColumns.includes('actions') && (
                            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td
                                colSpan={visibleColumns.length}
                                className="px-4 py-8 text-center text-sm text-muted-foreground"
                            >
                                No users found
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b transition-colors hover:bg-muted/50"
                            >
                                {visibleColumns.includes('name') && (
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                                    <span className="text-sm font-medium">
                                                        {user.name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')
                                                            .toUpperCase()
                                                            .slice(0, 2)}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium">
                                                    {user.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {user.id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                )}
                                {visibleColumns.includes('email') && (
                                    <td className="px-4 py-3 text-sm">
                                        {user.email}
                                    </td>
                                )}
                                {visibleColumns.includes('verified') && (
                                    <td className="px-4 py-3">
                                        {user.email_verified_at ? (
                                            <Badge variant="default">
                                                Verified
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">
                                                Unverified
                                            </Badge>
                                        )}
                                    </td>
                                )}
                                {visibleColumns.includes('status') && (
                                    <td className="px-4 py-3">
                                        {user.is_active !== undefined ? (
                                            user.is_active ? (
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
                                {visibleColumns.includes('created_at') && (
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {user.created_at
                                            ? new Date(
                                                  user.created_at,
                                              ).toLocaleDateString('en-US', {
                                                  year: 'numeric',
                                                  month: 'short',
                                                  day: 'numeric',
                                              })
                                            : '-'}
                                    </td>
                                )}
                                {visibleColumns.includes('actions') && (
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
                                                            onEdit(user)
                                                        }
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    {onToggleActive && (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                onToggleActive(
                                                                    user,
                                                                )
                                                            }
                                                        >
                                                            <Power className="mr-2 h-4 w-4" />
                                                            {user.is_active
                                                                ? 'Disable'
                                                                : 'Enable'}
                                                        </DropdownMenuItem>
                                                    )}
                                                    {onManageRoles && (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                onManageRoles(
                                                                    user,
                                                                )
                                                            }
                                                        >
                                                            <Shield className="mr-2 h-4 w-4" />
                                                            Manage Roles
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onDelete(user)
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
