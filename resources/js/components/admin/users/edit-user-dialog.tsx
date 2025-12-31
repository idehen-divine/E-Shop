import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type User } from '@/types';
import { Form } from '@inertiajs/react';
import { useEffect } from 'react';

interface EditUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
}

export function EditUserDialog({
    open,
    onOpenChange,
    user,
}: EditUserDialogProps) {
    useEffect(() => {
        if (!open) {
            return;
        }
    }, [open]);

    const isAdmin =
        user.roles?.includes('ADMIN') || user.roles?.includes('SUPER_ADMIN');
    const updateRoute = isAdmin
        ? `/admin/admins/${user.id}`
        : `/admin/users/${user.id}`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isAdmin ? 'Edit Admin' : 'Edit User'}
                    </DialogTitle>
                    <DialogDescription>
                        Update {isAdmin ? 'admin' : 'user'} information
                    </DialogDescription>
                </DialogHeader>

                <Form
                    action={updateRoute}
                    method="patch"
                    onSuccess={() => {
                        onOpenChange(false);
                    }}
                    resetOnSuccess
                >
                    {({ errors, processing, wasSuccessful }) => (
                        <>
                            <div className="space-y-4 pb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-name">
                                            Full Name *
                                        </Label>
                                        <Input
                                            id="edit-name"
                                            name="name"
                                            defaultValue={user.name}
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-destructive">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-email">
                                            Email *
                                        </Label>
                                        <Input
                                            id="edit-email"
                                            name="email"
                                            type="email"
                                            defaultValue={user.email}
                                            required
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {wasSuccessful && (
                                    <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                        User updated successfully!
                                    </div>
                                )}
                            </div>

                            <DialogFooter className="mt-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update User'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
