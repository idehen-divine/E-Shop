import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type User } from '@/types';
import { MoreVertical, Edit, Trash2, Power, Shield } from 'lucide-react';

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onToggleActive?: (user: User) => void;
    onManageRoles?: (user: User) => void;
}

function formatRoleName(role: string): string {
    return role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}

function getRoleBadgeVariant(role: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    if (role === 'SUPER_ADMIN') {
        return 'destructive';
    }
    if (role === 'ADMIN') {
        return 'default';
    }
    return 'secondary';
}

export function UserTable({
    users,
    onEdit,
    onDelete,
    onToggleActive,
    onManageRoles,
}: UserTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            User
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Email
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Verified
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Roles
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Joined
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td
                                colSpan={7}
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
                                <td className="px-4 py-3 text-sm">
                                    {user.email}
                                </td>
                                <td className="px-4 py-3">
                                    {user.email_verified_at ? (
                                        <Badge variant="default">Verified</Badge>
                                    ) : (
                                        <Badge variant="outline">Unverified</Badge>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        {user.roles && user.roles.length > 0 ? (
                                            user.roles.map((role) => (
                                                <Badge
                                                    key={role}
                                                    variant={getRoleBadgeVariant(role)}
                                                >
                                                    {formatRoleName(role)}
                                                </Badge>
                                            ))
                                        ) : (
                                            <Badge variant="outline">No Role</Badge>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    {user.is_active !== undefined ? (
                                        user.is_active ? (
                                            <Badge variant="default">Active</Badge>
                                        ) : (
                                            <Badge variant="secondary">Inactive</Badge>
                                        )
                                    ) : (
                                        <Badge variant="default">Active</Badge>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                    {user.created_at
                                        ? new Date(user.created_at).toLocaleDateString('en-US', {
                                              year: 'numeric',
                                              month: 'short',
                                              day: 'numeric',
                                          })
                                        : '-'}
                                </td>
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
                                                    onClick={() => onEdit(user)}
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                {onToggleActive && (
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onToggleActive(user)
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
                                                            onManageRoles(user)
                                                        }
                                                    >
                                                        <Shield className="mr-2 h-4 w-4" />
                                                        Manage Roles
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem
                                                    onClick={() => onDelete(user)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
