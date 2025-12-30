import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { swapsService } from '../services/api';
import { QUERY_KEYS, CACHE_TIMES } from '../config';
import { transformSwapForDisplay } from '../utils/dataTransformers';

/**
 * Get all swaps for current user
 * @returns {Object} React Query result
 */
export const useUserSwaps = () => {
    return useQuery({
        queryKey: QUERY_KEYS.SWAPS.USER_SWAPS,
        queryFn: () => swapsService.getUserSwaps(),
        staleTime: CACHE_TIMES.SHORT, // 1 minute - frequently changing
    });
};

/**
 * Get single swap by ID
 * @param {string} id - Swap ID
 * @returns {Object} React Query result
 */
export const useSwap = (id) => {
    return useQuery({
        queryKey: QUERY_KEYS.SWAPS.BY_ID(id),
        queryFn: () => swapsService.getById(id),
        enabled: !!id,
        staleTime: CACHE_TIMES.SHORT,
    });
};

/**
 * Create swap request with optimistic updates
 * @returns {Object} React Query mutation result
 */
export const useCreateSwap = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: swapsService.create,

        // Optimistic update
        onMutate: async (newSwap) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.SWAPS.USER_SWAPS });

            const previousSwaps = queryClient.getQueryData(QUERY_KEYS.SWAPS.USER_SWAPS);

            // Optimistically add new swap
            queryClient.setQueryData(QUERY_KEYS.SWAPS.USER_SWAPS, (old) => {
                const tempSwap = {
                    ...newSwap,
                    id: 'temp-' + Date.now(),
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                };
                return Array.isArray(old) ? [...old, tempSwap] : [tempSwap];
            });

            return { previousSwaps };
        },

        onError: (err, newSwap, context) => {
            // Rollback on error
            if (context?.previousSwaps) {
                queryClient.setQueryData(QUERY_KEYS.SWAPS.USER_SWAPS, context.previousSwaps);
            }
        },

        onSuccess: (data) => {
            // data = { swap: {...}, conversationId: "..." }
            console.log('Swap created successfully:', data);

            // You can use conversationId to navigate to conversation
            // Example: navigate(`/messages/${data.conversationId}`)
        },

        onSettled: () => {
            // Refetch to ensure data consistency
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SWAPS.USER_SWAPS });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SWAPS.ALL() });
        },
    });
};

/**
 * Update swap (accept, schedule, complete, etc.) with optimistic updates
 * @returns {Object} React Query mutation result
 */
export const useUpdateSwap = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => swapsService.update(id, data),

        // Optimistic update
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.SWAPS.USER_SWAPS });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.SWAPS.BY_ID(id) });

            const previousSwaps = queryClient.getQueryData(QUERY_KEYS.SWAPS.USER_SWAPS);
            const previousSwap = queryClient.getQueryData(QUERY_KEYS.SWAPS.BY_ID(id));

            // Update swap in list
            queryClient.setQueryData(QUERY_KEYS.SWAPS.USER_SWAPS, (old) => {
                if (!Array.isArray(old)) return old;
                return old.map(swap =>
                    swap.id === id || swap._id === id
                        ? { ...swap, ...data }
                        : swap
                );
            });

            // Update individual swap
            queryClient.setQueryData(QUERY_KEYS.SWAPS.BY_ID(id), (old) => ({
                ...old,
                ...data,
            }));

            return { previousSwaps, previousSwap };
        },

        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousSwaps) {
                queryClient.setQueryData(QUERY_KEYS.SWAPS.USER_SWAPS, context.previousSwaps);
            }
            if (context?.previousSwap) {
                queryClient.setQueryData(QUERY_KEYS.SWAPS.BY_ID(variables.id), context.previousSwap);
            }
        },

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SWAPS.USER_SWAPS });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SWAPS.BY_ID(variables.id) });
        },
    });
};

/**
 * Get swaps with filters
 * @param {Object} params - Query parameters
 * @returns {Object} React Query result
 */
export const useSwaps = (params = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.SWAPS.ALL(params),
        queryFn: () => swapsService.getAll(params),
        staleTime: CACHE_TIMES.SHORT,
    });
};
