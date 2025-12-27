import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ShopLayout from '@/layouts/app/shop-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link, router } from '@inertiajs/react';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useState } from 'react';
import cartRoutes from '@/routes/cart';
import { home, login } from '@/routes';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface CartItem {
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

interface CartPageProps {
    cart: {
        id: string;
        items: CartItem[];
        total: string;
        item_count: number;
    };
}

export default function CartIndex({ cart }: CartPageProps) {
    const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = !!auth.user;

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            return;
        }

        setUpdatingItems((prev) => new Set(prev).add(itemId));

        router.put(
            cartRoutes.update({ cartItemId: itemId }).url,
            { quantity: newQuantity },
            {
                preserveScroll: true,
                onFinish: () => {
                    setUpdatingItems((prev) => {
                        const next = new Set(prev);
                        next.delete(itemId);
                        return next;
                    });
                },
            },
        );
    };

    const handleRemoveItem = (itemId: string) => {
        router.delete(cartRoutes.destroy({ cartItemId: itemId }).url, {
            preserveScroll: true,
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Cart',
            href: cartRoutes.index().url,
        },
    ];

    return (
        <ShopLayout breadcrumbs={breadcrumbs}>
            <Head title="Shopping Cart" />

            <div className="px-2 py-6 sm:px-3 lg:px-4">
                <div className="mx-auto max-w-[1536px]">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Shopping Cart</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Review your items before checkout
                        </p>
                    </div>

                    {cart.items.length === 0 ? (
                        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed">
                            <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-semibold">
                                Your cart is empty
                            </h3>
                            <p className="mb-4 text-muted-foreground">
                                Start shopping to add items to your cart
                            </p>
                            <Button asChild>
                                <Link href={home()}>Continue Shopping</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            <div className="lg:col-span-2 space-y-4">
                                {cart.items.map((item) => (
                                    <Card key={item.id}>
                                        <CardContent className="p-4 sm:p-6">
                                            <div className="flex flex-col gap-4 sm:flex-row">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={
                                                            item.product.image ||
                                                            'https://via.placeholder.com/150x150?text=Product'
                                                        }
                                                        alt={item.product.name}
                                                        className="h-32 w-full rounded-md object-cover sm:w-32"
                                                    />
                                                </div>

                                                <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row">
                                                    <div className="flex-1">
                                                        <h3 className="mb-1 text-lg font-semibold">
                                                            <Link
                                                                href={`/products/${item.product.id}`}
                                                                className="hover:text-primary"
                                                            >
                                                                {item.product.name}
                                                            </Link>
                                                        </h3>
                                                        <p className="mb-2 text-sm text-muted-foreground">
                                                            ${item.price} each
                                                        </p>
                                                        <p className="text-lg font-bold text-primary">
                                                            ${item.subtotal}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-row items-end justify-between gap-4 sm:flex-col sm:items-end">
                                                        <div className="flex items-center rounded-md border">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-9 w-9 rounded-none"
                                                                onClick={() =>
                                                                    handleQuantityChange(
                                                                        item.id,
                                                                        item.quantity -
                                                                            1,
                                                                    )
                                                                }
                                                                disabled={
                                                                    item.quantity <=
                                                                        1 ||
                                                                    updatingItems.has(
                                                                        item.id,
                                                                    )
                                                                }
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </Button>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                max={item.product.stock}
                                                                value={item.quantity}
                                                                onChange={(e) => {
                                                                    const value =
                                                                        parseInt(
                                                                            e.target
                                                                                .value,
                                                                        );
                                                                    if (
                                                                        !isNaN(
                                                                            value,
                                                                        ) &&
                                                                        value >=
                                                                            1 &&
                                                                        value <=
                                                                            item
                                                                                .product
                                                                                .stock
                                                                    ) {
                                                                        handleQuantityChange(
                                                                            item.id,
                                                                            value,
                                                                        );
                                                                    }
                                                                }}
                                                                className="h-9 w-16 border-x text-center"
                                                                disabled={updatingItems.has(
                                                                    item.id,
                                                                )}
                                                            />
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-9 w-9 rounded-none"
                                                                onClick={() =>
                                                                    handleQuantityChange(
                                                                        item.id,
                                                                        item.quantity +
                                                                            1,
                                                                    )
                                                                }
                                                                disabled={
                                                                    item.quantity >=
                                                                        item
                                                                            .product
                                                                            .stock ||
                                                                    updatingItems.has(
                                                                        item.id,
                                                                    )
                                                                }
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>

                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() =>
                                                                handleRemoveItem(
                                                                    item.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="lg:col-span-1">
                                <Card>
                                    <CardContent className="p-6">
                                        <h2 className="mb-4 text-xl font-semibold">
                                            Order Summary
                                        </h2>
                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Items ({cart.item_count})
                                                </span>
                                                <span className="font-medium">
                                                    ${cart.total}
                                                </span>
                                            </div>
                                            <div className="border-t pt-4">
                                                <div className="flex justify-between text-lg font-bold">
                                                    <span>Total</span>
                                                    <span>${cart.total}</span>
                                                </div>
                                            </div>
                                            {isAuthenticated ? (
                                                <Button
                                                    className="w-full"
                                                    size="lg"
                                                    type="button"
                                                    disabled
                                                >
                                                    Proceed to Checkout
                                                </Button>
                                            ) : (
                                                <Button
                                                    className="w-full"
                                                    size="lg"
                                                    asChild
                                                >
                                                    <Link href={login()}>
                                                        Proceed to Checkout
                                                    </Link>
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                asChild
                                            >
                                                <Link href={home()}>
                                                    Continue Shopping
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ShopLayout>
    );
}

