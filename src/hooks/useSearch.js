import { useQuery } from '@tanstack/react-query';
import { searchService } from '../services/api';
import { QUERY_KEYS, CACHE_TIMES } from '../config';

/**
 * Perform search with query and filters
 * @param {string} query - Search query
 * @param {string} type - Optional filter type (users, posts, groups, etc.)
 * @param {number} page - Page number
 * @param {number} limit - Results per page
 * @returns {Object} React Query result
 */
export const useSearch = (query, type = null, page = 1, limit = 10) => {
    return useQuery({
        queryKey: QUERY_KEYS.SEARCH.RESULTS(query, type, page, limit),
        queryFn: () => searchService.search(query, type, page, limit),
        enabled: !!query && query.length >= 2, // Only search if query has 2+ characters
        staleTime: CACHE_TIMES.SHORT,
    });
};

/**
 * Get search suggestions (for autocomplete)
 * @param {string} query - Search query
 * @param {number} limit - Number of suggestions
 * @returns {Object} React Query result
 */
export const useSearchSuggestions = (query, limit = 5) => {
    return useQuery({
        queryKey: QUERY_KEYS.SEARCH.SUGGESTIONS(query, limit),
        queryFn: () => searchService.getSuggestions(query, limit),
        enabled: !!query && query.length >= 2,
        staleTime: CACHE_TIMES.SHORT,
    });
};
