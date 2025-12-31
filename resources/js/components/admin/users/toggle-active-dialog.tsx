import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { type User } from '@/types';
import { router } from '@inertiajs/react';
import { AlertTriangle, Power } from 'lucide-react';

interface ToggleActiveDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
    isAdmin?: boolean;
}

export function ToggleActiveDialog({
    open,
    onOpenChange,
    user,
    isAdmin = false,
}: ToggleActiveDialogProps) {
    const isActive = user.is_active ?? true;
    const action = isActive ? 'suspend' : 'activate';
    const actionTitle = isAdmin
        ? isActive
            ? 'Suspend Admin'
            : 'Activate Admin'
        : isActive
          ? 'Suspend User'
          : 'Activate User';

    const handleToggle = () => {
        const route = isAdmin
            ? `/admin/admins/${user.id}/toggle-active`
            : `/admin/users/${user.id}/toggle-active`;

        router.patch(
            route,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                isActive
                                    ? 'bg-yellow-500/10'
                                    : 'bg-green-500/10'
                            }`}
                        >
                            {isActive ? (
                                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            ) : (
                                <Power className="h-5 w-5 text-green-600 dark:text-green-400" />
                            )}
                        </div>
                        <div>
                            <DialogTitle>{actionTitle}</DialogTitle>
                            <DialogDescription>
                                {isActive
                                    ? 'This will suspend the user account'
                                    : 'This will activate the user account'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to {action}{' '}
                        <span className="font-medium text-foreground">
                            {user.name}
                        </span>
                        ?{' '}
                        {isActive
                            ? 'The user will not be able to access the system until reactivated.'
                            : 'The user will regain access to the system.'}
                    </p>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant={isActive ? 'destructive' : 'default'}
                        onClick={handleToggle}
                    >
                        {isAdmin
                            ? isActive
                                ? 'Suspend Admin'
                                : 'Activate Admin'
                            : isActive
                              ? 'Suspend User'
                              : 'Activate User'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
