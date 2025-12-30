import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface UserFiltersProps {
    searchQuery: string;
    selectedStatus: string;
    selectedVerified: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onVerifiedChange: (value: string) => void;
}

export function UserFilters({
    searchQuery,
    selectedStatus,
    selectedVerified,
    onSearchChange,
    onStatusChange,
    onVerifiedChange,
}: UserFiltersProps) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full flex-1 sm:max-w-xs">
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>
            <div className="flex gap-2">
                <Select value={selectedStatus} onValueChange={onStatusChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={selectedVerified}
                    onValueChange={onVerifiedChange}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Verified" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Verified</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="unverified">Unverified</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
