import { QueryClient } from '@tanstack/react-query';
import { CACHE_TIMES } from './api.config';

/**
 * Custom error handler for React Query
 */
const defaultQueryErrorHandler = (error) => {
    // Log errors in development
    if (import.meta.env.DEV) {
        console.error('[React Query Error]', error);
    }

    // You can integrate with error tracking services here (e.g., Sentry)
    // if (import.meta.env.PROD) {
    //     trackError(error);
    // }
};

/**
 * Custom retry function with exponential backoff
 */
const customRetry = (failureCount, error) => {
    // Don't retry on specific status codes
    const noRetryStatuses = [400, 401, 403, 404, 422];
    if (error?.response?.status && noRetryStatuses.includes(error.response.status)) {
        return false;
    }

    // Retry up to 2 times for network errors and 5xx errors
    return failureCount < 2;
};

/**
 * Enhanced React Query Client Configuration
 * Optimized for performance and user experience
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Stale Time: How long data is considered fresh
            staleTime: CACHE_TIMES.MEDIUM, // 5 minutes default

            // Cache Time: How long unused data stays in cache (renamed to gcTime in v5)
            gcTime: CACHE_TIMES.LONG, // 15 minutes

            // Refetch Options
            refetchOnWindowFocus: false, // Don't refetch when window regains focus (can be enabled for real-time apps)
            refetchOnMount: true, // Refetch if data is stale when component mounts
            refetchOnReconnect: true, // Refetch when reconnecting to internet

            // Retry Configuration
            retry: customRetry,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff

            // Error Handling
            onError: defaultQueryErrorHandler,

            // Network Mode
            networkMode: 'online', // Only run queries when online

            // Structural Sharing (performance optimization)
            structuralSharing: true,
        },
        mutations: {
            // Retry mutations once on network errors
            retry: (failureCount, error) => {
                // Only retry network errors, not 4xx/5xx responses
                return error?.isNetworkError && failureCount < 1;
            },

            // Error Handling
            onError: defaultQueryErrorHandler,

            // Network Mode
            networkMode: 'online',
        },
    },
});

/**
 * Helper function to prefetch queries
 * Use this for predictive loading
 */
export const prefetchQuery = async (queryKey, queryFn, options = {}) => {
    await queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: CACHE_TIMES.MEDIUM,
        ...options,
    });
};

/**
 * Helper function to invalidate multiple query keys at once
 */
export const invalidateQueries = async (queryKeys = []) => {
    const promises = queryKeys.map((key) =>
        queryClient.invalidateQueries({ queryKey: key })
    );
    await Promise.all(promises);
};

/**
 * Helper function to set query data
 */
export const setQueryData = (queryKey, updater) => {
    queryClient.setQueryData(queryKey, updater);
};

/**
 * Helper function to get query data
 */
export const getQueryData = (queryKey) => {
    return queryClient.getQueryData(queryKey);
};
