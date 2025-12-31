import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { home, login } from '@/routes';
import { Link } from '@inertiajs/react';

interface CartSummaryProps {
    itemCount: number;
    total: string;
    isAuthenticated: boolean;
}

export function CartSummary({
    itemCount,
    total,
    isAuthenticated,
}: CartSummaryProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Items ({itemCount})
                        </span>
                        <span className="font-medium">${total}</span>
                    </div>
                    <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>${total}</span>
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
                        <Button className="w-full" size="lg" asChild>
                            <Link href={login()}>Proceed to Checkout</Link>
                        </Button>
                    )}
                    <Button variant="outline" className="w-full" asChild>
                        <Link href={home()}>Continue Shopping</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
