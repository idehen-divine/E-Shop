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
import { AlertTriangle } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface DeleteProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product;
}

export function DeleteProductDialog({
    open,
    onOpenChange,
    product,
}: DeleteProductDialogProps) {
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(`/admin/products/${product.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    variant: 'success',
                    title: 'Success',
                    description: 'Product deleted successfully!',
                });
                onOpenChange(false);
            },
            onError: (errors) => {
                const errorMessages = Object.values(errors).flat();
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: errorMessages.length > 0
                        ? errorMessages.join(', ')
                        : 'Failed to delete product. Please try again.',
                });
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                            <DialogTitle>Delete Product</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete{' '}
                        <span className="font-medium text-foreground">
                            {product.name}
                        </span>
                        ? This will permanently remove the product from your
                        inventory.
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
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Product'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

