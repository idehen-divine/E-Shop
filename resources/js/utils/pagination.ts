import { type Pagination } from '@/types/products';

export function getVisiblePages(
    currentPage: number,
    lastPage: number,
): number[] {
    return Array.from({ length: lastPage }, (_, i) => i + 1).filter(
        (page) => {
            return (
                page === 1 ||
                page === lastPage ||
                (page >= currentPage - 1 && page <= currentPage + 1)
            );
        },
    );
}

export function shouldShowEllipsis(
    page: number,
    index: number,
    visiblePages: number[],
): boolean {
    return index > 0 && visiblePages[index - 1] !== page - 1;
}

export function canGoToPreviousPage(
    pagination: Pagination | null,
): boolean {
    return !!pagination?.previous_page;
}

export function canGoToNextPage(pagination: Pagination | null): boolean {
    return !!pagination?.next_page;
}

