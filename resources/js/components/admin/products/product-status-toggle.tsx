import { Badge } from '@/components/ui/badge';
import { type Product } from '@/types/products';

interface ProductStatusToggleProps {
    product: Product;
}

export function ProductStatusToggle({ product }: ProductStatusToggleProps) {
    return (
        <Badge variant={product.is_active ? 'default' : 'secondary'}>
            {product.is_active ? 'Active' : 'Inactive'}
        </Badge>
    );
}

