import { QueryClient } from '@tanstack/react-query';

/**
 * React Query Client Configuration
 * Centralized configuration for data fetching and caching
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // Don't refetch when window regains focus
            refetchOnMount: false, // Don't refetch when component mounts if data exists
            refetchOnReconnect: false, // Don't refetch when reconnecting to internet
            retry: 1, // Only retry failed requests once
            staleTime: 10 * 60 * 1000, // Data stays fresh for 10 minutes
            cacheTime: 15 * 60 * 1000, // Keep unused data in cache for 15 minutes
        },
    },
});
