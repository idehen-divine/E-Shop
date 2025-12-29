import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type User } from '@/types';
import { Head } from '@inertiajs/react';
import { Shield, Plus } from 'lucide-react';
import { useState } from 'react';
import { UserTable } from '@/components/admin/users/user-table';
import { CreateUserDialog } from '@/components/admin/users/create-user-dialog';
import { EditUserDialog } from '@/components/admin/users/edit-user-dialog';
import { DeleteUserDialog } from '@/components/admin/users/delete-user-dialog';
import { ManageRolesDialog } from '@/components/admin/users/manage-roles-dialog';
import { ToggleActiveDialog } from '@/components/admin/users/toggle-active-dialog';
import { PageHeader } from '@/components/admin/page-header';
import { useDialogState } from '@/hooks/use-dialog-state';

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

interface ServiceResponse<T> {
    code: number;
    message: string;
    data?: T;
    error?: string;
}

interface AdminAdminsIndexProps {
    admins?: ServiceResponse<{
        users: User[];
        roles: Role[];
        manageRoles: Role[];
    }>;
}

export default function AdminAdminsIndex({
    admins,
}: AdminAdminsIndexProps) {
    const data = (admins as ServiceResponse<{
        users: User[];
        roles: Role[];
        manageRoles: Role[];
    }>)?.data;
    const users = data?.users ?? [];
    const roles = data?.roles ?? [];
    const manageRoles = data?.manageRoles ?? [];
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const {
        openDialog,
        closeDialog,
        isDialogOpen,
        getSelectedItem,
    } = useDialogState<User>(['edit', 'delete', 'manageRoles', 'toggleActive']);

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

    const selectedUser = getSelectedItem('edit') || getSelectedItem('delete') || getSelectedItem('manageRoles') || getSelectedItem('toggleActive');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admins Management" />

            <div className="flex flex-col gap-4 p-4">
                <Card>
                    <PageHeader
                        icon={Shield}
                        title="Admins"
                        description="Manage admin users and their roles"
                        action={{
                            label: 'Add Admin',
                            icon: Plus,
                            onClick: () => setCreateDialogOpen(true),
                        }}
                    />
                    <CardContent>
                        <UserTable
                            users={users}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onManageRoles={handleManageRoles}
                            onToggleActive={handleToggleActive}
                        />
                    </CardContent>
                </Card>
            </div>

            <CreateUserDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                isAdmin={true}
                roles={roles}
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

