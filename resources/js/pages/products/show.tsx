import { DeleteCartItemDialog } from '@/components/cart/delete-cart-item-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCartActions } from '@/hooks/use-cart-actions';
import ShopLayout from '@/layouts/app/shop-layout';
import { home } from '@/routes';
import products from '@/routes/products';
import { type BreadcrumbItem } from '@/types';
import { type CartItem, type Product } from '@/types/products';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

interface ServiceResponse<T> {
    code: number;
    message: string;
    data?: T;
    error?: string;
}

export default function ProductShow({
    product,
    cart,
}: {
    product?: ServiceResponse<{ product: Product }>;
    cart?: ServiceResponse<{ cart: { items: CartItem[] } }>;
}) {
    const productData = (product as ServiceResponse<{ product: Product }>)?.data?.product || null;
    const cartData = (cart as ServiceResponse<{ cart: { items: CartItem[] } }>)?.data?.cart;

    const cartItems = useMemo(() => {
        if (cartData?.items && Array.isArray(cartData.items)) {
            return cartData.items;
        }
        return [];
    }, [cartData?.items]);

    const {
        addToCart,
        updateQuantity,
        removeItem,
        addingToCart,
        updatingItems,
    } = useCartActions();
    const [quantity, setQuantity] = useState(1);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const cartItem = useMemo(() => {
        if (!productData) {
            return undefined;
        }
        return Array.isArray(cartItems)
            ? cartItems.find((item) => item.product.id === productData.id)
            : undefined;
    }, [cartItems, productData]);

    if (!productData) {
        return (
            <ShopLayout>
                <Head title="Product Not Found" />
                <div className="mx-auto w-full max-w-[1536px] py-6">
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed">
                        <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-semibold">
                            Product not found
                        </h3>
                        <p className="mb-4 text-muted-foreground">
                            The product you're looking for doesn't exist
                        </p>
                        <Button asChild>
                            <Link href={home().url}>Back to Products</Link>
                        </Button>
                    </div>
                </div>
            </ShopLayout>
        );
    }

    const isInCart = !!cartItem;
    const isAdding = addingToCart.has(productData.id);
    const isUpdating = cartItem ? updatingItems.has(cartItem.id) : false;

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1) {
            return;
        }
        if (newQuantity > productData.stock) {
            newQuantity = productData.stock;
        }
        setQuantity(newQuantity);
    };

    const handleAddToCart = () => {
        addToCart(productData.id, quantity);
        setQuantity(1);
    };

    const handleUpdateQuantity = (newQuantity: number) => {
        if (cartItem) {
            updateQuantity(cartItem.id, newQuantity, productData.stock);
        }
    };

    const handleDeleteConfirm = () => {
        if (cartItem) {
            removeItem(cartItem.id);
            setShowDeleteDialog(false);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Products',
            href: home().url,
        },
        {
            title: productData.name,
            href: products.show(productData.id).url,
        },
    ];

    return (
        <ShopLayout breadcrumbs={breadcrumbs}>
            <Head title={`${productData.name} - E-Commerce Store`} />
            <div className="mx-auto w-full max-w-[1536px] py-6">
                <Button
                    variant="ghost"
                    className="mb-6"
                    onClick={() => router.visit(home().url)}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Products
                </Button>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="space-y-4">
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
                            <img
                                src={
                                    productData.image ||
                                    'https://via.placeholder.com/600x600?text=Product+Image'
                                }
                                alt={productData.name}
                                className="h-full w-full object-cover object-center"
                            />
                            {!productData.in_stock && (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                                    <Badge
                                        variant="secondary"
                                        className="text-lg"
                                    >
                                        Out of Stock
                                    </Badge>
                                </div>
                            )}
                            {productData.has_discount &&
                                productData.discount_percentage && (
                                    <div className="absolute top-4 left-4">
                                        <Badge
                                            variant="destructive"
                                            className="text-sm font-semibold"
                                        >
                                            -{productData.discount_percentage}%
                                            OFF
                                        </Badge>
                                    </div>
                                )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            {productData.categories &&
                                productData.categories.length > 0 && (
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        {productData.categories.map(
                                            (category) => (
                                                <Badge
                                                    key={category.id}
                                                    variant="outline"
                                                >
                                                    {category.name}
                                                </Badge>
                                            ),
                                        )}
                                    </div>
                                )}
                            <h1 className="mb-4 text-4xl font-bold">
                                {productData.name}
                            </h1>
                            {productData.description && (
                                <p className="mb-6 text-lg text-muted-foreground">
                                    {productData.description}
                                </p>
                            )}
                        </div>

                        <Card>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    <div className="flex items-baseline gap-4">
                                        <span className="text-4xl font-bold text-primary">
                                            ${productData.price}
                                        </span>
                                        {productData.has_discount &&
                                            productData.compare_at_price && (
                                                <span className="text-xl text-muted-foreground line-through">
                                                    $
                                                    {
                                                        productData.compare_at_price
                                                    }
                                                </span>
                                            )}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span
                                            className={`text-sm font-medium ${
                                                productData.stock < 10
                                                    ? 'text-red-600'
                                                    : 'text-green-600'
                                            }`}
                                        >
                                            {productData.stock} in stock
                                        </span>
                                        {productData.sku && (
                                            <span className="text-sm text-muted-foreground">
                                                SKU: {productData.sku}
                                            </span>
                                        )}
                                    </div>

                                    {isInCart ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-1 items-center justify-between rounded-md border">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 cursor-pointer rounded-none"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleUpdateQuantity(
                                                                cartItem.quantity -
                                                                    1,
                                                            );
                                                        }}
                                                        disabled={
                                                            cartItem.quantity <=
                                                                1 || isUpdating
                                                        }
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max={productData.stock}
                                                        value={
                                                            cartItem.quantity
                                                        }
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            const value =
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                );
                                                            if (
                                                                !isNaN(value) &&
                                                                value >= 1 &&
                                                                value <=
                                                                    productData.stock
                                                            ) {
                                                                handleUpdateQuantity(
                                                                    value,
                                                                );
                                                            }
                                                        }}
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        className="h-10 w-20 border-x text-center"
                                                        disabled={isUpdating}
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 cursor-pointer rounded-none"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleUpdateQuantity(
                                                                cartItem.quantity +
                                                                    1,
                                                            );
                                                        }}
                                                        disabled={
                                                            cartItem.quantity >=
                                                                productData.stock ||
                                                            isUpdating
                                                        }
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10 cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() =>
                                                        setShowDeleteDialog(
                                                            true,
                                                        )
                                                    }
                                                    disabled={isUpdating}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <DeleteCartItemDialog
                                                open={showDeleteDialog}
                                                onOpenChange={
                                                    setShowDeleteDialog
                                                }
                                                onConfirm={handleDeleteConfirm}
                                                itemName={productData.name}
                                                isDeleting={isUpdating}
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-1 items-center justify-between rounded-md border">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 cursor-pointer rounded-none"
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                quantity - 1,
                                                            )
                                                        }
                                                        disabled={quantity <= 1}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max={productData.stock}
                                                        value={quantity}
                                                        onChange={(e) => {
                                                            const value =
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                );
                                                            if (
                                                                !isNaN(value) &&
                                                                value >= 1 &&
                                                                value <=
                                                                    productData.stock
                                                            ) {
                                                                handleQuantityChange(
                                                                    value,
                                                                );
                                                            }
                                                        }}
                                                        className="h-10 w-20 border-x text-center"
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 cursor-pointer rounded-none"
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                quantity + 1,
                                                            )
                                                        }
                                                        disabled={
                                                            quantity >=
                                                            productData.stock
                                                        }
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <Button
                                                className="w-full"
                                                size="lg"
                                                disabled={
                                                    !productData.in_stock ||
                                                    isAdding
                                                }
                                                onClick={handleAddToCart}
                                            >
                                                {isAdding
                                                    ? 'Adding...'
                                                    : productData.in_stock
                                                      ? 'Add to Cart'
                                                      : 'Out of Stock'}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
