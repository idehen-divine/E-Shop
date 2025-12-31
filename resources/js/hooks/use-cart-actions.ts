import cartRoutes from '@/routes/cart';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export function useCartActions() {
    const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
    const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set());

    const addToCart = (productId: string, quantity: number = 1) => {
        setAddingToCart((prev) => new Set(prev).add(productId));

        router.post(
            cartRoutes.store().url,
            {
                product_id: productId,
                quantity,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ only: ['cartItems'] });
                },
                onFinish: () => {
                    setAddingToCart((prev) => {
                        const next = new Set(prev);
                        next.delete(productId);
                        return next;
                    });
                },
            },
        );
    };

    const updateQuantity = (
        cartItemId: string,
        newQuantity: number,
        maxStock?: number,
    ) => {
        if (newQuantity < 1) {
            return;
        }

        if (maxStock && newQuantity > maxStock) {
            newQuantity = maxStock;
        }

        setUpdatingItems((prev) => new Set(prev).add(cartItemId));

        router.put(
            cartRoutes.update({ cartItemId }).url,
            { quantity: newQuantity },
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ only: ['cartItems'] });
                },
                onFinish: () => {
                    setUpdatingItems((prev) => {
                        const next = new Set(prev);
                        next.delete(cartItemId);
                        return next;
                    });
                },
            },
        );
    };

    const removeItem = (cartItemId: string) => {
        router.delete(cartRoutes.destroy({ cartItemId }).url, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['cartItems'] });
            },
        });
    };

    return {
        addToCart,
        updateQuantity,
        removeItem,
        updatingItems,
        addingToCart,
    };
}
