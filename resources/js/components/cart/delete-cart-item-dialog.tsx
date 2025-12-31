import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

interface DeleteCartItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    itemName?: string;
    isDeleting?: boolean;
}

export function DeleteCartItemDialog({
    open,
    onOpenChange,
    onConfirm,
    itemName,
    isDeleting = false,
}: DeleteCartItemDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Remove item from cart?</DialogTitle>
                    <DialogDescription>
                        {itemName
                            ? `Are you sure you want to remove "${itemName}" from your cart? This action cannot be undone.`
                            : 'Are you sure you want to remove this item from your cart? This action cannot be undone.'}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            'Removing...'
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
