import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsService } from '../services/api';

// Get all transactions
export const useTransactions = () => {
    return useQuery({
        queryKey: ['transactions'],
        queryFn: transactionsService.getAll,
    });
};

// Get user transactions
export const useUserTransactions = (userId) => {
    return useQuery({
        queryKey: ['transactions', 'user', userId],
        queryFn: () => transactionsService.getUserTransactions(userId),
        enabled: !!userId,
    });
};

// Create transaction
export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: transactionsService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });
};
