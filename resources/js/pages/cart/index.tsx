import { CartItem } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';
import { EmptyCart } from '@/components/cart/empty-cart';
import ShopLayout from '@/layouts/app/shop-layout';
import cartRoutes from '@/routes/cart';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface CartItemData {
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
        items?: CartItemData[];
        total: string;
        item_count: number;
    };
}

export default function CartIndex({ cart }: CartPageProps) {
    const cartItems = Array.isArray(cart.items) ? cart.items : [];
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = !!auth.user;

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

                    {cartItems.length === 0 ? (
                        <EmptyCart />
                    ) : (
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            <div className="space-y-4 lg:col-span-2">
                                {cartItems.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        id={item.id}
                                        product={item.product}
                                        quantity={item.quantity}
                                        price={item.price}
                                        subtotal={item.subtotal}
                                    />
                                ))}
                            </div>

                            <div className="lg:col-span-1">
                                <CartSummary
                                    itemCount={cart.item_count}
                                    total={cart.total}
                                    isAuthenticated={isAuthenticated}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ShopLayout>
    );
}
