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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Form } from '@inertiajs/react';
import { useState } from 'react';

interface Role {
    id: number;
    name: string;
}

interface CreateUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isAdmin?: boolean;
    roles?: Role[];
}

export function CreateUserDialog({
    open,
    onOpenChange,
    isAdmin = false,
    roles = [],
}: CreateUserDialogProps) {
    const [selectedRole, setSelectedRole] = useState<string>('');

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
            key={open ? 'open' : 'closed'}
        >
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isAdmin ? 'Create New Admin' : 'Create New User'}
                    </DialogTitle>
                    <DialogDescription>
                        {isAdmin
                            ? 'Add a new admin user to the system'
                            : 'Add a new user to the system'}
                    </DialogDescription>
                </DialogHeader>

                <Form
                    action="/admin/admins"
                    method="post"
                    onSuccess={() => {
                        onOpenChange(false);
                    }}
                    resetOnSuccess
                >
                    {({ errors, processing, wasSuccessful }) => (
                        <>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Full Name *
                                        </Label>
                                        <Input id="name" name="name" required />
                                        {errors.name && (
                                            <p className="text-sm text-destructive">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">
                                            Password *
                                        </Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            minLength={8}
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-destructive">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">
                                            Confirm Password *
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            required
                                            minLength={8}
                                        />
                                    </div>
                                </div>

                                {isAdmin && roles.length > 0 && (
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role *</Label>
                                        <Select
                                            value={selectedRole}
                                            onValueChange={setSelectedRole}
                                            required
                                        >
                                            <SelectTrigger id="role">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem
                                                        key={role.id}
                                                        value={role.name}
                                                    >
                                                        {role.name
                                                            .replace(/_/g, ' ')
                                                            .toLowerCase()
                                                            .replace(
                                                                /\b\w/g,
                                                                (l) =>
                                                                    l.toUpperCase(),
                                                            )}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <input
                                            type="hidden"
                                            name="role"
                                            value={selectedRole}
                                        />
                                        {errors.role && (
                                            <p className="text-sm text-destructive">
                                                {errors.role}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {wasSuccessful && (
                                    <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                        {isAdmin
                                            ? 'Admin created successfully!'
                                            : 'User created successfully!'}
                                    </div>
                                )}
                            </div>

                            <DialogFooter className="mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? 'Creating...'
                                        : isAdmin
                                          ? 'Create Admin'
                                          : 'Create User'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
