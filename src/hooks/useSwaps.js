import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { swapsService } from '../services/api';

// Get all swaps
export const useSwaps = () => {
    return useQuery({
        queryKey: ['swaps'],
        queryFn: swapsService.getAll,
    });
};

// Get swap by ID
export const useSwap = (id) => {
    return useQuery({
        queryKey: ['swaps', id],
        queryFn: () => swapsService.getById(id),
        enabled: !!id,
    });
};

// Get user swaps
export const useUserSwaps = (userId) => {
    return useQuery({
        queryKey: ['swaps', 'user', userId],
        queryFn: () => swapsService.getUserSwaps(userId),
        enabled: !!userId,
    });
};

// Create swap
export const useCreateSwap = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: swapsService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['swaps'] });
        },
    });
};

// Update swap
export const useUpdateSwap = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => swapsService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['swaps'] });
        },
    });
};

// Delete swap
export const useDeleteSwap = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: swapsService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['swaps'] });
        },
    });
};
