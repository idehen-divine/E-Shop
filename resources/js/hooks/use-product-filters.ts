import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface UseProductFiltersProps {
    initialSearch?: string;
    initialCategory?: string;
    initialPrice?: string;
}

export function useProductFilters({
    initialSearch = '',
    initialCategory = 'all',
    initialPrice = 'all',
}: UseProductFiltersProps = {}) {
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [priceRange, setPriceRange] = useState(initialPrice);

    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialMount = useRef(true);
    const prevSearchRef = useRef(searchQuery);
    const prevCategoryRef = useRef(selectedCategory);
    const prevPriceRef = useRef(priceRange);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            prevSearchRef.current = searchQuery;
            prevCategoryRef.current = selectedCategory;
            prevPriceRef.current = priceRange;
            return;
        }

        const searchChanged = prevSearchRef.current !== searchQuery;
        const categoryChanged = prevCategoryRef.current !== selectedCategory;
        const priceChanged = prevPriceRef.current !== priceRange;

        if (!searchChanged && !categoryChanged && !priceChanged) {
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

            const currentSearch = currentParams.get('search') || undefined;
            const currentCategory = currentParams.get('category') || undefined;
            const currentPrice = currentParams.get('price') || undefined;

            if (newSearch !== currentSearch) {
                params.search = newSearch;
            }

            if (newCategory !== currentCategory) {
                params.category = newCategory;
            }

            if (newPrice !== currentPrice) {
                params.price = newPrice;
            }

            if (Object.keys(params).length === 0) {
                prevSearchRef.current = searchQuery;
                prevCategoryRef.current = selectedCategory;
                prevPriceRef.current = priceRange;
                return;
            }

            params.page = '1';

            prevSearchRef.current = searchQuery;
            prevCategoryRef.current = selectedCategory;
            prevPriceRef.current = priceRange;

            router.get('/', params, {
                preserveState: false,
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
    }, [searchQuery, selectedCategory, priceRange]);

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

        router.get('/', params);
    };

    return {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        navigateToPage,
    };
}
