import { ShoppingCart } from 'lucide-react';

export function EmptyProducts() {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed">
            <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
    );
}
