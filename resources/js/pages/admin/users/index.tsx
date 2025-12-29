import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type User } from '@/types';
import { Head } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { UserTable } from '@/components/admin/users/user-table';
import { EditUserDialog } from '@/components/admin/users/edit-user-dialog';
import { DeleteUserDialog } from '@/components/admin/users/delete-user-dialog';
import { ToggleActiveDialog } from '@/components/admin/users/toggle-active-dialog';
import { PageHeader } from '@/components/admin/page-header';
import { useDialogState } from '@/hooks/use-dialog-state';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '#',
    },
];

interface ServiceResponse<T> {
    code: number;
    message: string;
    data?: T;
    error?: string;
}

interface AdminUsersIndexProps {
    users?: ServiceResponse<{ users: User[] }> | User[];
}

export default function AdminUsersIndex({
    users,
}: AdminUsersIndexProps) {
    // Extract users array from service response structure
    const usersData = (users as ServiceResponse<{ users: User[] }>)?.data;
    const usersList = usersData?.users ?? (Array.isArray(users) ? users : []);
    const {
        openDialog,
        closeDialog,
        isDialogOpen,
        getSelectedItem,
    } = useDialogState<User>(['edit', 'delete', 'toggleActive']);

    const handleEdit = (user: User): void => {
        openDialog('edit', user);
    };

    const handleDelete = (user: User): void => {
        openDialog('delete', user);
    };

    const handleToggleActive = (user: User): void => {
        openDialog('toggleActive', user);
    };

    const selectedUser = getSelectedItem('edit') || getSelectedItem('delete') || getSelectedItem('toggleActive');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Management" />

            <div className="flex flex-col gap-4 p-4">
                <Card>
                    <PageHeader
                        icon={Users}
                        title="Users"
                        description="Manage system users and their roles"
                    />
                    <CardContent>
                        <UserTable
                            users={usersList}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onToggleActive={handleToggleActive}
                        />
                    </CardContent>
                </Card>
            </div>

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

                    <ToggleActiveDialog
                        open={isDialogOpen('toggleActive')}
                        onOpenChange={(open) => {
                            if (!open) {
                                closeDialog('toggleActive');
                            }
                        }}
                        user={selectedUser}
                    />
                </>
            )}
        </AppLayout>
    );
}

