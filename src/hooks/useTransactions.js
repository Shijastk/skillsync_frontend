import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletService, transactionsService } from '../services/api';
import { QUERY_KEYS, CACHE_TIMES } from '../config';

/**
 * Get wallet data
 * @returns {Object} React Query result
 */
export const useWallet = () => {
    return useQuery({
        queryKey: QUERY_KEYS.WALLET.BASE,
        queryFn: walletService.getWallet,
        staleTime: CACHE_TIMES.SHORT, // Wallet balance changes frequently
    });
};

/**
 * Get earning opportunities
 * @returns {Object} React Query result
 */
export const useWalletOpportunities = () => {
    return useQuery({
        queryKey: QUERY_KEYS.WALLET.OPPORTUNITIES,
        queryFn: walletService.getOpportunities,
        staleTime: CACHE_TIMES.MEDIUM,
    });
};

/**
 * Spend skillcoins with optimistic update
 * @returns {Object} React Query mutation result
 */
export const useSpendCoins = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ amount, description, feature }) =>
            walletService.spend(amount, description, feature),

        // Optimistic update
        onMutate: async ({ amount }) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.WALLET.BASE });

            const previousWallet = queryClient.getQueryData(QUERY_KEYS.WALLET.BASE);

            // Optimistically decrease balance
            queryClient.setQueryData(QUERY_KEYS.WALLET.BASE, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    balance: (old.balance || 0) - amount,
                };
            });

            return { previousWallet };
        },

        onError: (err, variables, context) => {
            if (context?.previousWallet) {
                queryClient.setQueryData(QUERY_KEYS.WALLET.BASE, context.previousWallet);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WALLET.BASE });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WALLET.TRANSACTIONS });
        },
    });
};

/**
 * Get all transactions
 * @returns {Object} React Query result
 */
export const useTransactions = () => {
    return useQuery({
        queryKey: QUERY_KEYS.WALLET.TRANSACTIONS,
        queryFn: transactionsService.getAll,
        staleTime: CACHE_TIMES.SHORT,
    });
};

/**
 * Get user transactions (alias for backward compatibility)
 * @returns {Object} React Query result
 */
export const useUserTransactions = useTransactions;

/**
 * Create transaction (alias for useSpendCoins)
 * @returns {Object} React Query mutation result
 */
export const useCreateTransaction = useSpendCoins;
