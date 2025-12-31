import { Button } from '@/components/ui/button';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';

export function EmptyCart() {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed">
            <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Your cart is empty</h3>
            <p className="mb-4 text-muted-foreground">
                Start shopping to add items to your cart
            </p>
            <Button asChild>
                <Link href={home()}>Continue Shopping</Link>
            </Button>
        </div>
    );
}
