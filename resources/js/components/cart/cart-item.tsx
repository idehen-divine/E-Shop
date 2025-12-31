import { DeleteCartItemDialog } from '@/components/cart/delete-cart-item-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCartActions } from '@/hooks/use-cart-actions';
import products from '@/routes/products';
import { Link } from '@inertiajs/react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface CartItemProps {
    id: string;
    product: {
        id: number;
        name: string;
        slug: string;
        image: string | null;
        price: string;
        stock: number;
    };
    quantity: number;
    price: string;
    subtotal: string;
}

export function CartItem({
    id,
    product,
    quantity,
    price,
    subtotal,
}: CartItemProps) {
    const { updateQuantity, removeItem, updatingItems } = useCartActions();
    const isUpdating = updatingItems.has(id);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDeleteConfirm = () => {
        removeItem(id);
        setShowDeleteDialog(false);
    };

    const productUrl = products.show(product.id).url;

    return (
        <Card>
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-shrink-0">
                        <Link href={productUrl}>
                            <img
                                src={
                                    product.image ||
                                    'https://via.placeholder.com/150x150?text=Product'
                                }
                                alt={product.name}
                                className="h-32 w-full cursor-pointer rounded-md object-cover transition-opacity hover:opacity-80 sm:w-32"
                            />
                        </Link>
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row">
                        <div className="flex-1">
                            <h3 className="mb-1 text-lg font-semibold">
                                <Link
                                    href={productUrl}
                                    className="transition-colors hover:text-primary"
                                >
                                    {product.name}
                                </Link>
                            </h3>
                            <p className="mb-2 text-sm text-muted-foreground">
                                ${price} each
                            </p>
                            <p className="text-lg font-bold text-primary">
                                ${subtotal}
                            </p>
                        </div>

                        <div className="flex flex-row items-end justify-between gap-4 sm:flex-col sm:items-end">
                            <div className="flex items-center rounded-md border">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-none"
                                    onClick={() =>
                                        updateQuantity(id, quantity - 1)
                                    }
                                    disabled={quantity <= 1 || isUpdating}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                    type="number"
                                    min="1"
                                    max={product.stock}
                                    value={quantity}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (
                                            !isNaN(value) &&
                                            value >= 1 &&
                                            value <= product.stock
                                        ) {
                                            updateQuantity(id, value);
                                        }
                                    }}
                                    className="h-9 w-16 border-x text-center"
                                    disabled={isUpdating}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-none"
                                    onClick={() =>
                                        updateQuantity(id, quantity + 1)
                                    }
                                    disabled={
                                        quantity >= product.stock || isUpdating
                                    }
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setShowDeleteDialog(true)}
                                disabled={isUpdating}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
            <DeleteCartItemDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={handleDeleteConfirm}
                itemName={product.name}
                isDeleting={isUpdating}
            />
        </Card>
    );
}
