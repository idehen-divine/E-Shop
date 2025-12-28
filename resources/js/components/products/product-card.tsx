import { DeleteCartItemDialog } from '@/components/cart/delete-cart-item-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCartActions } from '@/hooks/use-cart-actions';
import { type CartItem, type Product } from '@/types/products';
import { Link } from '@inertiajs/react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface ProductCardActions {
    addToCart: (productId: string) => void;
    updateQuantity: (
        cartItemId: string,
        quantity: number,
        maxStock?: number,
    ) => void;
    removeItem: (cartItemId: string) => void;
    addingToCart: Set<string>;
    updatingItems: Set<string>;
}

interface ProductCardProps {
    product: Product;
    cartItem?: CartItem;
    actions?: ProductCardActions;
    showDescription?: boolean;
    showStock?: boolean;
    className?: string;
    onProductClick?: (product: Product) => void;
    renderActions?: (props: {
        product: Product;
        cartItem?: CartItem;
        isInCart: boolean;
        isAdding: boolean;
        isUpdating: boolean;
    }) => ReactNode;
}

export function ProductCard({
    product,
    cartItem,
    actions,
    showDescription = true,
    showStock = true,
    className = '',
    onProductClick,
    renderActions,
}: ProductCardProps) {
    const defaultActions = useCartActions();
    const cartActions = actions || defaultActions;

    const {
        addToCart,
        updateQuantity,
        removeItem,
        addingToCart,
        updatingItems,
    } = cartActions;

    const isInCart = !!cartItem;
    const isAdding = addingToCart.has(product.id);
    const isUpdating = cartItem ? updatingItems.has(cartItem.id) : false;
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleProductClick = () => {
        if (onProductClick) {
            onProductClick(product);
        }
    };

    const handleDeleteConfirm = () => {
        if (cartItem) {
            removeItem(cartItem.id);
            setShowDeleteDialog(false);
        }
    };

    const productNameElement = onProductClick ? (
        <button
            onClick={handleProductClick}
            className="mb-2 text-left text-lg font-semibold transition-colors hover:text-primary"
        >
            {product.name}
        </button>
    ) : (
        <Link
            href={`/products/${product.slug || product.id}`}
            className="mb-2 block text-lg font-semibold transition-colors hover:text-primary"
        >
            {product.name}
        </Link>
    );

    const defaultActionsRender = () => {
        if (isInCart) {
            return (
                <>
                    <div className="flex w-full items-center gap-2">
                        <div className="flex flex-1 items-center justify-between rounded-md border">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 cursor-pointer rounded-none"
                                onClick={() =>
                                    updateQuantity(
                                        cartItem!.id,
                                        cartItem!.quantity - 1,
                                        product.stock,
                                    )
                                }
                                disabled={cartItem!.quantity <= 1 || isUpdating}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                                type="number"
                                min="1"
                                max={product.stock}
                                value={cartItem!.quantity}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (
                                        !isNaN(value) &&
                                        value >= 1 &&
                                        value <= product.stock
                                    ) {
                                        updateQuantity(
                                            cartItem!.id,
                                            value,
                                            product.stock,
                                        );
                                    }
                                }}
                                className="h-9 w-16 border-x text-center"
                                disabled={isUpdating}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-none cursor-pointer"
                                onClick={() =>
                                    updateQuantity(
                                        cartItem!.id,
                                        cartItem!.quantity + 1,
                                        product.stock,
                                    )
                                }
                                disabled={
                                    cartItem!.quantity >= product.stock ||
                                    isUpdating
                                }
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={isUpdating}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <DeleteCartItemDialog
                        open={showDeleteDialog}
                        onOpenChange={setShowDeleteDialog}
                        onConfirm={handleDeleteConfirm}
                        itemName={product.name}
                        isDeleting={isUpdating}
                    />
                </>
            );
        }

        return (
            <Button
                className="w-full"
                disabled={!product.in_stock || isAdding}
                onClick={() => addToCart(product.id)}
            >
                {isAdding
                    ? 'Adding...'
                    : product.in_stock
                      ? 'Add to Cart'
                      : 'Out of Stock'}
            </Button>
        );
    };

    return (
        <Card
            className={`overflow-hidden transition-shadow duration-200 hover:shadow-md ${className}`}
        >
            <div className="relative aspect-square w-full bg-muted">
                {onProductClick ? (
                    <button
                        onClick={handleProductClick}
                        className="h-full w-full"
                    >
                        <img
                            src={
                                product.image ||
                                'https://via.placeholder.com/300x300?text=Product+Image'
                            }
                            alt={product.name}
                            className="h-64 w-full object-cover object-center"
                        />
                    </button>
                ) : (
                    <Link href={`/products/${product.slug || product.id}`}>
                        <img
                            src={
                                product.image ||
                                'https://via.placeholder.com/300x300?text=Product+Image'
                            }
                            alt={product.name}
                            className="h-64 w-full object-cover object-center"
                        />
                    </Link>
                )}
                {!product.in_stock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                        <Badge variant="secondary" className="text-base">
                            Out of Stock
                        </Badge>
                    </div>
                )}
            </div>
            <CardContent className="p-4">
                {productNameElement}
                {showDescription && product.description && (
                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                        {product.description}
                    </p>
                )}
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                        ${product.price}
                    </span>
                    {showStock && (
                        <span
                            className={`text-sm font-medium ${
                                product.stock < 10
                                    ? 'text-red-600'
                                    : 'text-green-600'
                            }`}
                        >
                            {product.stock} in stock
                        </span>
                    )}
                </div>
                {renderActions
                    ? renderActions({
                          product,
                          cartItem,
                          isInCart,
                          isAdding,
                          isUpdating,
                      })
                    : defaultActionsRender()}
            </CardContent>
        </Card>
    );
}

export default ProductCard;
