import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface UseUserFiltersProps {
    initialSearch?: string;
    initialSortBy?: string | '';
    initialSortOrder?: 'asc' | 'desc';
    initialPerPage?: number;
    initialStatus?: string;
    initialVerified?: string;
    basePath?: string;
}

export function useUserFilters({
    initialSearch = '',
    initialSortBy = '',
    initialSortOrder = 'asc',
    initialPerPage = 10,
    initialStatus = 'all',
    initialVerified = 'all',
    basePath = '/admin/users',
}: UseUserFiltersProps = {}) {
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [sortBy, setSortBy] = useState(initialSortBy || '');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
        initialSortOrder,
    );
    const [perPage, setPerPage] = useState(initialPerPage);
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);
    const [selectedVerified, setSelectedVerified] = useState(initialVerified);

    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialMount = useRef(true);
    const prevSearchRef = useRef(searchQuery);
    const prevSortByRef = useRef(sortBy);
    const prevSortOrderRef = useRef(sortOrder);
    const prevPerPageRef = useRef(perPage);
    const prevStatusRef = useRef(selectedStatus);
    const prevVerifiedRef = useRef(selectedVerified);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            prevSearchRef.current = searchQuery;
            prevSortByRef.current = sortBy;
            prevSortOrderRef.current = sortOrder;
            prevPerPageRef.current = perPage;
            prevStatusRef.current = selectedStatus;
            prevVerifiedRef.current = selectedVerified;
            return;
        }

        const searchChanged = prevSearchRef.current !== searchQuery;
        const sortByChanged = prevSortByRef.current !== sortBy;
        const sortOrderChanged = prevSortOrderRef.current !== sortOrder;
        const perPageChanged = prevPerPageRef.current !== perPage;
        const statusChanged = prevStatusRef.current !== selectedStatus;
        const verifiedChanged = prevVerifiedRef.current !== selectedVerified;

        if (
            !searchChanged &&
            !sortByChanged &&
            !sortOrderChanged &&
            !perPageChanged &&
            !statusChanged &&
            !verifiedChanged
        ) {
            return;
        }

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        const applyFilters = () => {
            const params: Record<string, string | undefined> = {};

            const newSearch = searchQuery.trim() || undefined;
            const newSortBy = sortBy || undefined;
            const newSortOrder = newSortBy ? sortOrder : undefined;
            const newPerPage = perPage !== 10 ? String(perPage) : undefined;
            const newStatus =
                selectedStatus !== 'all' ? selectedStatus : undefined;
            const newVerified =
                selectedVerified !== 'all' ? selectedVerified : undefined;

            // Always include all current filter values
            if (newSearch) {
                params.search = newSearch;
            }
            if (newSortBy) {
                params.sort_by = newSortBy;
                params.sort_order = newSortOrder || 'asc';
            }
            if (newPerPage) {
                params.per_page = newPerPage;
            }
            if (newStatus) {
                params.status = newStatus;
            }
            if (newVerified) {
                params.verified = newVerified;
            }

            if (Object.keys(params).length === 0) {
                prevSearchRef.current = searchQuery;
                prevSortByRef.current = sortBy;
                prevSortOrderRef.current = sortOrder;
                prevStatusRef.current = selectedStatus;
                prevVerifiedRef.current = selectedVerified;
                return;
            }

            params.page = '1';

            prevSearchRef.current = searchQuery;
            prevSortByRef.current = sortBy;
            prevSortOrderRef.current = sortOrder;
            prevPerPageRef.current = perPage;
            prevStatusRef.current = selectedStatus;
            prevVerifiedRef.current = selectedVerified;

            const onlySearchChanged =
                searchChanged &&
                !sortByChanged &&
                !sortOrderChanged &&
                !perPageChanged &&
                !statusChanged &&
                !verifiedChanged;

            router.get(basePath, params, {
                preserveState: onlySearchChanged,
                preserveScroll: onlySearchChanged,
            });
        };

        if (searchChanged) {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
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
        sortBy,
        sortOrder,
        perPage,
        selectedStatus,
        selectedVerified,
        basePath,
    ]);

    const navigateToPage = (page: number) => {
        const params: Record<string, string | undefined> = {
            page: String(page),
        };

        if (searchQuery.trim()) {
            params.search = searchQuery.trim();
        }
        if (sortBy) {
            params.sort_by = sortBy;
            params.sort_order = sortOrder;
        }
        if (perPage !== 10) {
            params.per_page = String(perPage);
        }
        if (selectedStatus !== 'all') {
            params.status = selectedStatus;
        }
        if (selectedVerified !== 'all') {
            params.verified = selectedVerified;
        }

        router.get(basePath, params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSort = (column: string) => {
        if (sortBy === column) {
            if (sortOrder === 'asc') {
                setSortOrder('desc');
            } else {
                setSortBy('');
                setSortOrder('asc');
            }
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    return {
        searchQuery,
        setSearchQuery,
        sortBy,
        sortOrder,
        perPage,
        setPerPage,
        selectedStatus,
        setSelectedStatus,
        selectedVerified,
        setSelectedVerified,
        handleSort,
        navigateToPage,
    };
}
