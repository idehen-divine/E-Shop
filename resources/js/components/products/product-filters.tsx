import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { type Category } from '@/types/products';
import { Search } from 'lucide-react';

interface ProductFiltersProps {
    categories: Category[];
    searchQuery: string;
    selectedCategory: string;
    priceRange: string;
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onPriceRangeChange: (value: string) => void;
}

export function ProductFilters({
    categories = [],
    searchQuery,
    selectedCategory,
    priceRange,
    onSearchChange,
    onCategoryChange,
    onPriceRangeChange,
}: ProductFiltersProps) {

    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full flex-1 sm:max-w-xs">
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>
            <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.slug}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={priceRange} onValueChange={onPriceRangeChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="under-50">Under $50</SelectItem>
                        <SelectItem value="50-100">$50 - $100</SelectItem>
                        <SelectItem value="100-200">$100 - $200</SelectItem>
                        <SelectItem value="over-200">Over $200</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

