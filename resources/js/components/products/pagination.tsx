import { Button } from '@/components/ui/button';
import {
    canGoToNextPage,
    canGoToPreviousPage,
    getVisiblePages,
    shouldShowEllipsis,
} from '@/utils/pagination';
import { type Pagination } from '@/types/products';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    pagination: Pagination;
    onPageChange: (page: number) => void;
    onPrevious: () => void;
    onNext: () => void;
}

export function Pagination({
    pagination,
    onPageChange,
    onPrevious,
    onNext,
}: PaginationProps) {
    const visiblePages = getVisiblePages(
        pagination.current_page,
        pagination.last_page,
    );

    return (
        <div className="mt-8 space-y-4">
            <div className="flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                    Showing {pagination.from} to {pagination.to} of{' '}
                    {pagination.total} products
                </p>
            </div>

            <div className="flex items-center justify-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!canGoToPreviousPage(pagination)}
                    onClick={onPrevious}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>

                <div className="flex items-center gap-1">
                    {visiblePages.map((page, index) => {
                        const showEllipsis = shouldShowEllipsis(
                            page,
                            index,
                            visiblePages,
                        );
                        return (
                            <div
                                key={page}
                                className="flex items-center gap-1"
                            >
                                {showEllipsis && (
                                    <span className="px-2 text-sm text-muted-foreground">
                                        ...
                                    </span>
                                )}
                                <Button
                                    variant={
                                        page === pagination.current_page
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() => onPageChange(page)}
                                >
                                    {page}
                                </Button>
                            </div>
                        );
                    })}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={!canGoToNextPage(pagination)}
                    onClick={onNext}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

