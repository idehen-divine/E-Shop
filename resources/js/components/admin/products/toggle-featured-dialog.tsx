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
import { router } from '@inertiajs/react';
import { Star, StarOff } from 'lucide-react';

interface ToggleFeaturedDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product;
}

export function ToggleFeaturedDialog({
    open,
    onOpenChange,
    product,
}: ToggleFeaturedDialogProps) {
    const isFeatured = product.is_featured ?? false;
    const action = isFeatured ? 'unfeature' : 'feature';
    const actionTitle = isFeatured ? 'Unfeature Product' : 'Feature Product';

    const handleToggle = () => {
        router.patch(
            `/admin/products/${product.id}/toggle-featured`,
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
                                isFeatured
                                    ? 'bg-yellow-500/10'
                                    : 'bg-blue-500/10'
                            }`}
                        >
                            {isFeatured ? (
                                <StarOff className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            ) : (
                                <Star className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            )}
                        </div>
                        <div>
                            <DialogTitle>{actionTitle}</DialogTitle>
                            <DialogDescription>
                                {isFeatured
                                    ? 'This will remove the featured status from the product'
                                    : 'This will mark the product as featured'}
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
                        ?{' '}
                        {isFeatured
                            ? 'The product will no longer be highlighted as featured.'
                            : 'The product will be highlighted as featured and may appear in featured sections.'}
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
                        variant={isFeatured ? 'outline' : 'default'}
                        onClick={handleToggle}
                    >
                        {isFeatured ? 'Unfeature Product' : 'Feature Product'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
