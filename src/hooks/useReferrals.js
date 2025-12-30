import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { referralsService } from '../services/api';
import { QUERY_KEYS, CACHE_TIMES } from '../config';

/**
 * Get referral code
 * @returns {Object} React Query result
 */
export const useReferralCode = () => {
    return useQuery({
        queryKey: QUERY_KEYS.REFERRALS.CODE,
        queryFn: referralsService.getCode,
        staleTime: CACHE_TIMES.VERY_LONG, // Referral code rarely changes
    });
};

/**
 * Get referral stats
 * @returns {Object} React Query result
 */
export const useReferralStats = () => {
    return useQuery({
        queryKey: QUERY_KEYS.REFERRALS.STATS,
        queryFn: referralsService.getStats,
        staleTime: CACHE_TIMES.MEDIUM,
    });
};

/**
 * Apply referral code
 * @returns {Object} React Query mutation result
 */
export const useApplyReferralCode = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ referralCode, newUserId }) =>
            referralsService.applyCode(referralCode, newUserId),

        onSuccess: () => {
            // Refetch referral stats (for the referrer)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REFERRALS.STATS });
        },
    });
};
