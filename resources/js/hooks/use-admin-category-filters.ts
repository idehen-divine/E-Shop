import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface UseAdminCategoryFiltersProps {
    initialSearch?: string;
    initialParent?: string;
    initialStatus?: string;
    initialSortBy?: string;
    initialSortOrder?: 'asc' | 'desc';
    initialPerPage?: number;
    basePath?: string;
}

export function useAdminCategoryFilters({
    initialSearch = '',
    initialParent = 'all',
    initialStatus = 'all',
    initialSortBy = '',
    initialSortOrder = 'asc',
    initialPerPage = 10,
    basePath = '/admin/categories',
}: UseAdminCategoryFiltersProps = {}) {
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedParent, setSelectedParent] = useState(initialParent);
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);
    const [sortBy, setSortBy] = useState(initialSortBy || '');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
        initialSortOrder,
    );
    const [perPage, setPerPage] = useState(initialPerPage);

    const isInitialMount = useRef(true);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const prevSearchRef = useRef(initialSearch);
    const prevParentRef = useRef(initialParent);
    const prevStatusRef = useRef(initialStatus);
    const prevSortByRef = useRef(initialSortBy);
    const prevSortOrderRef = useRef(initialSortOrder);
    const prevPerPageRef = useRef(initialPerPage);

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const navigateToPage = (page: number) => {
        const params: Record<string, string | undefined> = {};

        if (searchQuery.trim()) {
            params.search = searchQuery.trim();
        }
        if (selectedParent !== 'all') {
            params.parent = selectedParent;
        }
        if (selectedStatus !== 'all') {
            params.status = selectedStatus;
        }
        if (sortBy) {
            params.sort_by = sortBy;
            params.sort_order = sortOrder;
        }
        if (perPage !== 10) {
            params.per_page = String(perPage);
        }
        if (page > 1) {
            params.page = String(page);
        }

        router.get(basePath, params, {
            preserveState: searchQuery === prevSearchRef.current,
            preserveScroll: true,
        });
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            prevSearchRef.current = searchQuery;
            prevParentRef.current = selectedParent;
            prevStatusRef.current = selectedStatus;
            prevSortByRef.current = sortBy;
            prevSortOrderRef.current = sortOrder;
            prevPerPageRef.current = perPage;
            return;
        }

        const searchChanged = prevSearchRef.current !== searchQuery;
        const parentChanged = prevParentRef.current !== selectedParent;
        const statusChanged = prevStatusRef.current !== selectedStatus;
        const sortByChanged = prevSortByRef.current !== sortBy;
        const sortOrderChanged = prevSortOrderRef.current !== sortOrder;
        const perPageChanged = prevPerPageRef.current !== perPage;

        if (
            !searchChanged &&
            !parentChanged &&
            !statusChanged &&
            !sortByChanged &&
            !sortOrderChanged &&
            !perPageChanged
        ) {
            return;
        }

        const applyFilters = () => {
            const params: Record<string, string | undefined> = {};

            if (searchQuery.trim()) {
                params.search = searchQuery.trim();
            }
            if (selectedParent !== 'all') {
                params.parent = selectedParent;
            }
            if (selectedStatus !== 'all') {
                params.status = selectedStatus;
            }
            if (sortBy) {
                params.sort_by = sortBy;
                params.sort_order = sortOrder;
            }
            if (perPage !== 10) {
                params.per_page = String(perPage);
            }

            params.page = '1';

            prevSearchRef.current = searchQuery;
            prevParentRef.current = selectedParent;
            prevStatusRef.current = selectedStatus;
            prevSortByRef.current = sortBy;
            prevSortOrderRef.current = sortOrder;
            prevPerPageRef.current = perPage;

            router.get(basePath, params, {
                preserveState:
                    searchChanged &&
                    !parentChanged &&
                    !statusChanged &&
                    !sortByChanged &&
                    !sortOrderChanged &&
                    !perPageChanged,
                preserveScroll: false,
            });
        };

        if (searchChanged) {
            searchTimeoutRef.current = setTimeout(applyFilters, 500);
        } else {
            applyFilters();
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [
        searchQuery,
        selectedParent,
        selectedStatus,
        sortBy,
        sortOrder,
        perPage,
        basePath,
    ]);

    return {
        searchQuery,
        setSearchQuery,
        selectedParent,
        setSelectedParent,
        selectedStatus,
        setSelectedStatus,
        sortBy,
        sortOrder,
        perPage,
        setPerPage,
        handleSort,
        navigateToPage,
    };
}
