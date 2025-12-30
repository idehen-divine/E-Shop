import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { type Category } from '@/types/products';
import { AlertTriangle, Power } from 'lucide-react';
import { router } from '@inertiajs/react';

interface ToggleActiveCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: Category;
}

export function ToggleActiveCategoryDialog({
    open,
    onOpenChange,
    category,
}: ToggleActiveCategoryDialogProps) {
    const isActive = category.is_active ?? true;
    const action = isActive ? 'deactivate' : 'activate';
    const actionTitle = isActive ? 'Deactivate Category' : 'Activate Category';

    const handleToggle = () => {
        router.patch(`/admin/categories/${category.id}/toggle-active`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            isActive
                                ? 'bg-yellow-500/10'
                                : 'bg-green-500/10'
                        }`}>
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
                                    ? 'This will deactivate the category'
                                    : 'This will activate the category'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to {action}{' '}
                        <span className="font-medium text-foreground">
                            {category.name}
                        </span>
                        ? {isActive
                            ? 'The category will not be visible to customers until reactivated.'
                            : 'The category will be visible to customers again.'}
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
                        {isActive ? 'Deactivate Category' : 'Activate Category'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}



