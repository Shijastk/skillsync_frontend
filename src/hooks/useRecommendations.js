import { useQuery } from '@tanstack/react-query';
import { recommendationsService } from '../services/api';
import { QUERY_KEYS, CACHE_TIMES } from '../config';

export const useRecommendations = (type = 'users', limit = 10) => {
    return useQuery({
        queryKey: ['recommendations', type, limit],
        queryFn: () => recommendationsService.getRecommendations({ type, limit }),
        staleTime: CACHE_TIMES.MEDIUM,
    });
};

export const useTrending = (type = 'posts', timeframe = 'week') => {
    return useQuery({
        queryKey: ['trending', type, timeframe],
        queryFn: () => recommendationsService.getTrending({ type, timeframe }),
        staleTime: CACHE_TIMES.LONG,
    });
};
