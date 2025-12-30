import { useQuery } from '@tanstack/react-query';
import { statsService, recommendationsService } from '../services/api';
import { QUERY_KEYS, CACHE_TIMES } from '../config';

/**
 * Get platform statistics
 * @returns {Object} React Query result
 */
export const usePlatformStats = () => {
    return useQuery({
        queryKey: QUERY_KEYS.STATS.PLATFORM,
        queryFn: statsService.getPlatformStats,
        staleTime: CACHE_TIMES.LONG, // Stats don't change frequently
    });
};

/**
 * Get leaderboard
 * @param {string} type - Leaderboard type (skillcoins, swaps, etc.)
 * @param {number} limit - Number of results
 * @returns {Object} React Query result
 */
export const useLeaderboard = (type = 'skillcoins', limit = 10) => {
    return useQuery({
        queryKey: QUERY_KEYS.STATS.LEADERBOARD(type, limit),
        queryFn: () => statsService.getLeaderboard(type, limit),
        staleTime: CACHE_TIMES.MEDIUM,
    });
};

/**
 * Get activity feed
 * @param {number} limit - Number of activities
 * @returns {Object} React Query result
 */
export const useActivityFeed = (limit = 20) => {
    return useQuery({
        queryKey: QUERY_KEYS.STATS.ACTIVITY(limit),
        queryFn: () => statsService.getActivityFeed(limit),
        staleTime: CACHE_TIMES.SHORT, // Activity feed updates frequently
    });
};

/**
 * Get personalized recommendations
 * @returns {Object} React Query result
 */
export const useRecommendations = () => {
    return useQuery({
        queryKey: QUERY_KEYS.RECOMMENDATIONS.ALL,
        queryFn: recommendationsService.getRecommendations,
        staleTime: CACHE_TIMES.MEDIUM,
    });
};

/**
 * Get trending content
 * @returns {Object} React Query result
 */
export const useTrending = () => {
    return useQuery({
        queryKey: QUERY_KEYS.RECOMMENDATIONS.TRENDING,
        queryFn: recommendationsService.getTrending,
        staleTime: CACHE_TIMES.SHORT, // Trending changes frequently
    });
};
