/**
 * React Query Utilities
 * Common patterns and helper functions for React Query
 */

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

/**
 * Hook to manually trigger cache invalidation for multiple query keys
 * @returns {Function} Invalidate function
 * 
 * @example
 * const invalidate = useInvalidateQueries();
 * invalidate([QUERY_KEYS.USERS.ALL(), QUERY_KEYS.POSTS.ALL()]);
 */
export const useInvalidateQueries = () => {
    const queryClient = useQueryClient();

    return useCallback(
        async (queryKeys = []) => {
            const promises = queryKeys.map((key) =>
                queryClient.invalidateQueries({ queryKey: key })
            );
            await Promise.all(promises);
        },
        [queryClient]
    );
};

/**
 * Hook to manually update cache data
 * @returns {Function} Update function
 * 
 * @example
 * const updateCache = useUpdateCache();
 * updateCache(QUERY_KEYS.USERS.BY_ID(userId), (old) => ({ ...old, name: 'New Name' }));
 */
export const useUpdateCache = () => {
    const queryClient = useQueryClient();

    return useCallback(
        (queryKey, updater) => {
            queryClient.setQueryData(queryKey, updater);
        },
        [queryClient]
    );
};

/**
 * Hook to get data from cache without triggering a fetch
 * @returns {Function} Get function
 * 
 * @example
 * const getCache = useGetCache();
 * const user = getCache(QUERY_KEYS.USERS.BY_ID(userId));
 */
export const useGetCache = () => {
    const queryClient = useQueryClient();

    return useCallback(
        (queryKey) => {
            return queryClient.getQueryData(queryKey);
        },
        [queryClient]
    );
};

/**
 * Hook to prefetch data (useful for hover states, pagination, etc.)
 * @returns {Function} Prefetch function
 * 
 * @example
 * const prefetch = usePrefetch();
 * 
 * <Link
 *   onMouseEnter={() => prefetch(QUERY_KEYS.USERS.BY_ID(userId), () => usersService.getById(userId))}
 * >
 *   View Profile
 * </Link>
 */
export const usePrefetch = () => {
    const queryClient = useQueryClient();

    return useCallback(
        async (queryKey, queryFn, options = {}) => {
            await queryClient.prefetchQuery({
                queryKey,
                queryFn,
                ...options,
            });
        },
        [queryClient]
    );
};

/**
 * Hook to reset all queries (useful for logout, etc.)
 * @returns {Function} Reset function
 * 
 * @example
 * const resetAllQueries = useResetQueries();
 * resetAllQueries(); // Clears all cache
 */
export const useResetQueries = () => {
    const queryClient = useQueryClient();

    return useCallback(() => {
        queryClient.clear();
    }, [queryClient]);
};

/**
 * Hook to cancel ongoing queries (useful when navigating away)
 * @returns {Function} Cancel function
 * 
 * @example
 * const cancelQueries = useCancelQueries();
 * cancelQueries([QUERY_KEYS.USERS.ALL()]);
 */
export const useCancelQueries = () => {
    const queryClient = useQueryClient();

    return useCallback(
        async (queryKeys = []) => {
            const promises = queryKeys.map((key) =>
                queryClient.cancelQueries({ queryKey: key })
            );
            await Promise.all(promises);
        },
        [queryClient]
    );
};

/**
 * Hook to check if a query is currently loading
 * @returns {Function} Check function
 * 
 * @example
 * const isLoading = useIsQueryLoading();
 * if (isLoading(QUERY_KEYS.USERS.ALL())) {
 *   return <LoadingSpinner />;
 * }
 */
export const useIsQueryLoading = () => {
    const queryClient = useQueryClient();

    return useCallback(
        (queryKey) => {
            const state = queryClient.getQueryState(queryKey);
            return state?.isFetching ?? false;
        },
        [queryClient]
    );
};

/**
 * Create optimistic update handlers
 * Reduces boilerplate for common optimistic update patterns
 * 
 * @param {Object} options
 * @param {Array} options.queryKey - Query key to update
 * @param {Function} options.updateFn - Function to update cache (receives old data, returns new data)
 * @returns {Object} onMutate, onError, onSettled handlers
 * 
 * @example
 * const optimisticHandlers = createOptimisticHandlers({
 *   queryKey: QUERY_KEYS.POSTS.ALL(),
 *   updateFn: (old, newPost) => [newPost, ...old],
 * });
 * 
 * useMutation({
 *   mutationFn: postsService.create,
 *   ...optimisticHandlers,
 * });
 */
export const createOptimisticHandlers = ({ queryKey, updateFn }) => {
    return {
        onMutate: async (variables) => {
            const queryClient = useQueryClient();

            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey });

            // Snapshot previous value
            const previousData = queryClient.getQueryData(queryKey);

            // Optimistically update
            queryClient.setQueryData(queryKey, (old) => updateFn(old, variables));

            // Return context with snapshot
            return { previousData };
        },

        onError: (err, variables, context) => {
            const queryClient = useQueryClient();

            // Rollback on error
            if (context?.previousData) {
                queryClient.setQueryData(queryKey, context.previousData);
            }
        },

        onSettled: () => {
            const queryClient = useQueryClient();

            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey });
        },
    };
};

/**
 * Pagination helper
 * Manages pagination state and provides helpers
 * 
 * @param {Object} options
 * @param {number} options.initialPage - Initial page number
 * @param {number} options.pageSize - Items per page
 * @returns {Object} Pagination state and helpers
 * 
 * @example
 * const pagination = usePagination({ initialPage: 1, pageSize: 10 });
 * const { data } = useUsers(pagination.params);
 * 
 * return (
 *   <>
 *     <UserList users={data} />
 *     <button onClick={pagination.nextPage}>Next</button>
 *     <button onClick={pagination.prevPage}>Previous</button>
 *   </>
 * );
 */
export const usePagination = ({ initialPage = 1, pageSize = 10 } = {}) => {
    const [page, setPage] = React.useState(initialPage);

    const nextPage = useCallback(() => setPage((p) => p + 1), []);
    const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
    const goToPage = useCallback((pageNum) => setPage(pageNum), []);
    const reset = useCallback(() => setPage(initialPage), [initialPage]);

    return {
        page,
        pageSize,
        params: { page, limit: pageSize },
        nextPage,
        prevPage,
        goToPage,
        reset,
    };
};

/**
 * Debounced search helper
 * Useful for search inputs to prevent excessive API calls
 * 
 * @param {string} value - Search query
 * @param {number} delay - Debounce delay in ms
 * @returns {string} Debounced value
 * 
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 500);
 * const { data } = useSearchUsers({ query: debouncedSearch });
 */
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

/**
 * Error boundary for React Query errors
 * Display user-friendly error messages
 * 
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const getQueryErrorMessage = (error) => {
    // Use userMessage if available (from apiClient)
    if (error?.userMessage) {
        return error.userMessage;
    }

    // Fallback to response message
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }

    // Network error
    if (!error?.response) {
        return 'Network error. Please check your connection.';
    }

    // Generic fallback
    return 'An unexpected error occurred. Please try again.';
};

/**
 * Check if query has data
 * @param {Object} query - React Query result
 * @returns {boolean}
 */
export const hasData = (query) => {
    return query.isSuccess && query.data != null;
};

/**
 * Check if query is in initial loading state
 * @param {Object} query - React Query result
 * @returns {boolean}
 */
export const isInitialLoading = (query) => {
    return query.isLoading && !query.data;
};
