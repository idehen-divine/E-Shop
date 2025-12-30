import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { type Product } from '@/types/products';
import { AlertTriangle, Power } from 'lucide-react';
import { router } from '@inertiajs/react';

interface ToggleActiveDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product;
}

export function ToggleActiveDialog({
    open,
    onOpenChange,
    product,
}: ToggleActiveDialogProps) {
    const isActive = product.is_active ?? true;
    const action = isActive ? 'suspend' : 'activate';
    const actionTitle = isActive ? 'Suspend Product' : 'Activate Product';

    const handleToggle = () => {
        router.patch(`/admin/products/${product.id}/toggle-active`, {}, {
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
                                    ? 'This will suspend the product'
                                    : 'This will activate the product'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to {action}{' '}
                        <span className="font-medium text-foreground">
                            {product.name}
                        </span>
                        ? {isActive
                            ? 'The product will not be visible to customers until reactivated.'
                            : 'The product will be visible to customers again.'}
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
                        {isActive ? 'Suspend Product' : 'Activate Product'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

