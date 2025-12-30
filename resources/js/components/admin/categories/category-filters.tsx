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

interface CategoryFiltersProps {
    categories: Category[];
    searchQuery: string;
    selectedParent: string;
    selectedStatus: string;
    onSearchChange: (value: string) => void;
    onParentChange: (value: string) => void;
    onStatusChange: (value: string) => void;
}

export function CategoryFilters({
    categories,
    searchQuery,
    selectedParent,
    selectedStatus,
    onSearchChange,
    onParentChange,
    onStatusChange,
}: CategoryFiltersProps) {
    const rootCategories = categories.filter((cat) => !cat.parent_id);

    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:max-w-xs">
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="flex gap-2">
                <div className="w-[180px]">
                    <Select
                        value={selectedParent}
                        onValueChange={onParentChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All categories</SelectItem>
                            <SelectItem value="none">Root only</SelectItem>
                            {rootCategories.map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={String(category.id)}
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-[180px]">
                    <Select
                        value={selectedStatus}
                        onValueChange={onStatusChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
