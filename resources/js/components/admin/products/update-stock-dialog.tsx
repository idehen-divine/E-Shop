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
import { type Product } from '@/types/products';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface UpdateStockDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product;
}

export function UpdateStockDialog({
    open,
    onOpenChange,
    product,
}: UpdateStockDialogProps) {
    const [stock, setStock] = useState(() => product.stock.toString());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.patch(
            `/admin/products/${product.id}/update-stock`,
            {
                stock: parseInt(stock, 10),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} key={product.id}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Stock</DialogTitle>
                    <DialogDescription>
                        Update stock quantity for {product.name}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="stock">Stock Quantity *</Label>
                        <Input
                            id="stock"
                            type="number"
                            min="0"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Current stock: {product.stock}
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
                        <Button type="submit">Update Stock</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
