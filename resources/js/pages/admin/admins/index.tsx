import { CreateUserDialog } from '@/components/admin/users/create-user-dialog';
import { DeleteUserDialog } from '@/components/admin/users/delete-user-dialog';
import { EditUserDialog } from '@/components/admin/users/edit-user-dialog';
import { ManageRolesDialog } from '@/components/admin/users/manage-roles-dialog';
import { ToggleActiveDialog } from '@/components/admin/users/toggle-active-dialog';
import {
    UserColumnVisibilityDialog,
    defaultVisibleColumns as defaultUserColumns,
    type UserColumnKey,
} from '@/components/admin/users/user-column-visibility-dialog';
import { UserFilters } from '@/components/admin/users/user-filters';
import { UserTable } from '@/components/admin/users/user-table';
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
import { useDialogState } from '@/hooks/use-dialog-state';
import { useUserFilters } from '@/hooks/use-user-filters';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { type Pagination } from '@/types/products';
import { Head } from '@inertiajs/react';
import { Plus, Settings2, Shield } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admins',
        href: '#',
    },
];

interface Role {
    id: number;
    name: string;
}

interface AdminAdminsIndexProps {
    admins?: {
        data: {
            users: User[];
            roles: Role[];
            manageRoles: Role[];
            pagination: Pagination | null;
        };
    };
}

export default function AdminAdminsIndex({
    admins: adminsData,
}: AdminAdminsIndexProps) {
    const users = useMemo(() => adminsData?.data?.users ?? [], [adminsData]);
    const roles = useMemo(() => adminsData?.data?.roles ?? [], [adminsData]);
    const manageRoles = useMemo(
        () => adminsData?.data?.manageRoles ?? [],
        [adminsData],
    );
    const pagination = adminsData?.data?.pagination ?? null;
    const [columnVisibilityDialogOpen, setColumnVisibilityDialogOpen] =
        useState(false);

    const getDefaultVisibleColumns = (): UserColumnKey[] => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('admin-table-columns');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    return defaultUserColumns;
                }
            }
        }
        return defaultUserColumns;
    };

    const [visibleColumns, setVisibleColumns] = useState<UserColumnKey[]>(
        getDefaultVisibleColumns,
    );

    const handleColumnsChange = (columns: UserColumnKey[]) => {
        setVisibleColumns(columns);
        if (typeof window !== 'undefined') {
            localStorage.setItem(
                'admin-table-columns',
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
        selectedStatus,
        setSelectedStatus,
        selectedVerified,
        setSelectedVerified,
        handleSort,
        navigateToPage,
    } = useUserFilters({
        initialSearch: searchParams.get('search') || '',
        initialSortBy: searchParams.get('sort_by') || '',
        initialSortOrder:
            (searchParams.get('sort_order') as 'asc' | 'desc') || 'asc',
        initialPerPage: parseInt(searchParams.get('per_page') || '10', 10),
        initialStatus: searchParams.get('status') || 'all',
        initialVerified: searchParams.get('verified') || 'all',
        basePath: '/admin/admins',
    });
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const { openDialog, closeDialog, isDialogOpen, getSelectedItem } =
        useDialogState<User>(['edit', 'delete', 'manageRoles', 'toggleActive']);

    const handleEdit = (user: User): void => {
        openDialog('edit', user);
    };

    const handleDelete = (user: User): void => {
        openDialog('delete', user);
    };

    const handleManageRoles = (user: User): void => {
        openDialog('manageRoles', user);
    };

    const handleToggleActive = (user: User): void => {
        openDialog('toggleActive', user);
    };

    const selectedUser =
        getSelectedItem('edit') ||
        getSelectedItem('delete') ||
        getSelectedItem('manageRoles') ||
        getSelectedItem('toggleActive');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admins Management" />

            <div className="flex flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <Shield className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Admins</CardTitle>
                                    <CardDescription>
                                        Manage admin users and their roles
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
                                    Add Admin
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <UserFilters
                            searchQuery={searchQuery}
                            selectedStatus={selectedStatus}
                            selectedVerified={selectedVerified}
                            onSearchChange={setSearchQuery}
                            onStatusChange={setSelectedStatus}
                            onVerifiedChange={setSelectedVerified}
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
                        <UserTable
                            users={users}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onManageRoles={handleManageRoles}
                            onToggleActive={handleToggleActive}
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

            <CreateUserDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                isAdmin={true}
                roles={roles}
            />

            <UserColumnVisibilityDialog
                open={columnVisibilityDialogOpen}
                onOpenChange={setColumnVisibilityDialogOpen}
                visibleColumns={visibleColumns}
                onColumnsChange={handleColumnsChange}
            />

            {selectedUser && (
                <>
                    <EditUserDialog
                        open={isDialogOpen('edit')}
                        onOpenChange={(open) => {
                            if (!open) {
                                closeDialog('edit');
                            }
                        }}
                        user={selectedUser}
                    />

                    <DeleteUserDialog
                        open={isDialogOpen('delete')}
                        onOpenChange={(open) => {
                            if (!open) {
                                closeDialog('delete');
                            }
                        }}
                        user={selectedUser}
                    />

                    <ManageRolesDialog
                        open={isDialogOpen('manageRoles')}
                        onOpenChange={(open) => {
                            if (!open) {
                                closeDialog('manageRoles');
                            }
                        }}
                        user={selectedUser}
                        roles={manageRoles}
                    />

                    <ToggleActiveDialog
                        open={isDialogOpen('toggleActive')}
                        onOpenChange={(open) => {
                            if (!open) {
                                closeDialog('toggleActive');
                            }
                        }}
                        user={selectedUser}
                        isAdmin={true}
                    />
                </>
            )}
        </AppLayout>
    );
}
