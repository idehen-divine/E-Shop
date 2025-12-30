import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface UseAdminProductFiltersProps {
    initialSearch?: string;
    initialCategory?: string;
    initialPrice?: string;
    initialStatus?: string;
    initialFeatured?: string;
    initialSortBy?: string | '';
    initialSortOrder?: 'asc' | 'desc';
    initialPerPage?: number;
}

export function useAdminProductFilters({
    initialSearch = '',
    initialCategory = 'all',
    initialPrice = 'all',
    initialStatus = 'all',
    initialFeatured = 'all',
    initialSortBy = '',
    initialSortOrder = 'asc',
    initialPerPage = 10,
}: UseAdminProductFiltersProps = {}) {
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [priceRange, setPriceRange] = useState(initialPrice);
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);
    const [selectedFeatured, setSelectedFeatured] = useState(initialFeatured);
    const [sortBy, setSortBy] = useState(initialSortBy || '');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);
    const [perPage, setPerPage] = useState(initialPerPage);

    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialMount = useRef(true);
    const prevSearchRef = useRef(searchQuery);
    const prevCategoryRef = useRef(selectedCategory);
    const prevPriceRef = useRef(priceRange);
    const prevStatusRef = useRef(selectedStatus);
    const prevFeaturedRef = useRef(selectedFeatured);
    const prevSortByRef = useRef(sortBy);
    const prevSortOrderRef = useRef(sortOrder);
    const prevPerPageRef = useRef(perPage);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            prevSearchRef.current = searchQuery;
            prevCategoryRef.current = selectedCategory;
            prevPriceRef.current = priceRange;
            prevStatusRef.current = selectedStatus;
            prevFeaturedRef.current = selectedFeatured;
            prevSortByRef.current = sortBy;
            prevSortOrderRef.current = sortOrder;
            prevPerPageRef.current = perPage;
            return;
        }

        const searchChanged = prevSearchRef.current !== searchQuery;
        const categoryChanged = prevCategoryRef.current !== selectedCategory;
        const priceChanged = prevPriceRef.current !== priceRange;
        const statusChanged = prevStatusRef.current !== selectedStatus;
        const featuredChanged = prevFeaturedRef.current !== selectedFeatured;
        const sortByChanged = prevSortByRef.current !== sortBy;
        const sortOrderChanged = prevSortOrderRef.current !== sortOrder;
        const perPageChanged = prevPerPageRef.current !== perPage;

        if (!searchChanged && !categoryChanged && !priceChanged && !statusChanged && !featuredChanged && !sortByChanged && !sortOrderChanged && !perPageChanged) {
            return;
        }

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        const applyFilters = () => {
            const currentParams = new URLSearchParams(
                typeof window !== 'undefined' ? window.location.search : '',
            );

            const params: Record<string, string | undefined> = {};

            const newSearch = searchQuery.trim() || undefined;
            const newCategory =
                selectedCategory !== 'all' ? selectedCategory : undefined;
            const newPrice = priceRange !== 'all' ? priceRange : undefined;
            const newStatus = selectedStatus !== 'all' ? selectedStatus : undefined;
            const newFeatured = selectedFeatured !== 'all' ? selectedFeatured : undefined;
            const newSortBy = sortBy || undefined;
            const newSortOrder = newSortBy ? sortOrder : undefined;
            const newPerPage = perPage !== 10 ? String(perPage) : undefined;

            // Always include all current filter values
            if (newSearch) {
                params.search = newSearch;
            }

            if (newCategory) {
                params.category = newCategory;
            }

            if (newPrice) {
                params.price = newPrice;
            }

            if (newStatus) {
                params.status = newStatus;
            }

            if (newFeatured) {
                params.featured = newFeatured;
            }

            if (newSortBy) {
                params.sort_by = newSortBy;
                params.sort_order = newSortOrder || 'asc';
            }

            if (newPerPage) {
                params.per_page = newPerPage;
            }

            if (Object.keys(params).length === 0) {
                prevSearchRef.current = searchQuery;
                prevCategoryRef.current = selectedCategory;
                prevPriceRef.current = priceRange;
                prevStatusRef.current = selectedStatus;
                prevFeaturedRef.current = selectedFeatured;
                prevSortByRef.current = sortBy;
                prevSortOrderRef.current = sortOrder;
                prevPerPageRef.current = perPage;
                return;
            }

            params.page = '1';

            prevSearchRef.current = searchQuery;
            prevCategoryRef.current = selectedCategory;
            prevPriceRef.current = priceRange;
            prevStatusRef.current = selectedStatus;
            prevFeaturedRef.current = selectedFeatured;
            prevSortByRef.current = sortBy;
            prevSortOrderRef.current = sortOrder;
            prevPerPageRef.current = perPage;

            const onlySearchChanged = searchChanged && !categoryChanged && !priceChanged && !statusChanged && !featuredChanged && !sortByChanged && !sortOrderChanged;

            router.get('/admin/products', params, {
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
    }, [searchQuery, selectedCategory, priceRange, selectedStatus, selectedFeatured, sortBy, sortOrder, perPage]);

    const navigateToPage = (page: number) => {
        const params: Record<string, string | undefined> = {
            page: String(page),
        };

        if (searchQuery.trim()) {
            params.search = searchQuery.trim();
        }
        if (selectedCategory !== 'all') {
            params.category = selectedCategory;
        }
        if (priceRange !== 'all') {
            params.price = priceRange;
        }
        if (selectedStatus !== 'all') {
            params.status = selectedStatus;
        }
        if (selectedFeatured !== 'all') {
            params.featured = selectedFeatured;
        }
        if (sortBy) {
            params.sort_by = sortBy;
            params.sort_order = sortOrder;
        }
        if (perPage !== 10) {
            params.per_page = String(perPage);
        }

        router.get('/admin/products', params, {
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
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        selectedStatus,
        setSelectedStatus,
        selectedFeatured,
        setSelectedFeatured,
        sortBy,
        sortOrder,
        perPage,
        setPerPage,
        handleSort,
        navigateToPage,
    };
}

