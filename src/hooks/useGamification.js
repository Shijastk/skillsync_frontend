import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationService } from '../services/api';
import { QUERY_KEYS, CACHE_TIMES } from '../config';

/**
 * Get gamification profile
 * @returns {Object} React Query result
 */
export const useGamificationProfile = () => {
    return useQuery({
        queryKey: QUERY_KEYS.GAMIFICATION.PROFILE,
        queryFn: gamificationService.getProfile,
        staleTime: CACHE_TIMES.SHORT,
    });
};

/**
 * Get gamification leaderboard
 * @param {string} type - Leaderboard type (level, xp, etc.)
 * @param {number} limit - Number of results
 * @returns {Object} React Query result
 */
export const useGamificationLeaderboard = (type = 'level', limit = 10) => {
    return useQuery({
        queryKey: QUERY_KEYS.GAMIFICATION.LEADERBOARD(type, limit),
        queryFn: () => gamificationService.getLeaderboard(type, limit),
        staleTime: CACHE_TIMES.MEDIUM,
    });
};

/**
 * Get achievements
 * @returns {Object} React Query result
 */
export const useAchievements = () => {
    return useQuery({
        queryKey: QUERY_KEYS.GAMIFICATION.ACHIEVEMENTS,
        queryFn: gamificationService.getAchievements,
        staleTime: CACHE_TIMES.MEDIUM,
    });
};

/**
 * Claim achievement with optimistic update
 * @returns {Object} React Query mutation result
 */
export const useClaimAchievement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: gamificationService.claimAchievement,

        // Optimistic update
        onMutate: async (achievementType) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.GAMIFICATION.ACHIEVEMENTS });

            const previousAchievements = queryClient.getQueryData(QUERY_KEYS.GAMIFICATION.ACHIEVEMENTS);

            // Mark achievement as claimed
            queryClient.setQueryData(QUERY_KEYS.GAMIFICATION.ACHIEVEMENTS, (old) => {
                if (!Array.isArray(old)) return old;

                return old.map(achievement =>
                    achievement.type === achievementType
                        ? { ...achievement, claimed: true, claimedAt: new Date().toISOString() }
                        : achievement
                );
            });

            return { previousAchievements };
        },

        onError: (err, achievementType, context) => {
            if (context?.previousAchievements) {
                queryClient.setQueryData(QUERY_KEYS.GAMIFICATION.ACHIEVEMENTS, context.previousAchievements);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GAMIFICATION.ACHIEVEMENTS });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GAMIFICATION.PROFILE });
        },
    });
};

/**
 * Track activity (for XP gain)
 * @returns {Object} React Query mutation result
 */
export const useTrackActivity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ activityType, metadata }) =>
            gamificationService.trackActivity(activityType, metadata),

        onSuccess: () => {
            // Refetch profile to get updated XP/level
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GAMIFICATION.PROFILE });
        },
    });
};
