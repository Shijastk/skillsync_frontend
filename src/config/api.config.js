/**
 * API Configuration
 * Centralized configuration for all API-related settings
 */

export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 30000,
    WITH_CREDENTIALS: true,
};

/**
 * API Endpoints
 * Centralized endpoint definitions to handle route changes easily
 */
export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
        REFRESH_TOKEN: '/auth/refresh-token',
    },

    // Users
    USERS: {
        BASE: '/users',
        BY_ID: (id) => `/users/${id}`,
        PROFILE: '/users/profile',
        STATS: (id) => `/users/${id}/stats`,
        SKILLS: {
            TEACH: '/users/skills/teach',
            LEARN: '/users/skills/learn',
            TEACH_BY_ID: (id) => `/users/skills/teach/${id}`,
            LEARN_BY_ID: (id) => `/users/skills/learn/${id}`,
        },
    },

    // Swaps
    SWAPS: {
        BASE: '/swaps',
        BY_ID: (id) => `/swaps/${id}`,
    },

    // Groups
    GROUPS: {
        BASE: '/groups',
        BY_ID: (id) => `/groups/${id}`,
        JOIN: (id) => `/groups/${id}/join`,
    },

    // Messages
    MESSAGES: {
        BASE: '/messages',
        CONVERSATIONS: '/conversations',
        CONVERSATION_MESSAGES: (id) => `/conversations/${id}/messages`,
        MARK_READ: (id) => `/messages/${id}/read`,
    },

    // Posts
    POSTS: {
        BASE: '/posts',
        BY_ID: (id) => `/posts/${id}`,
        LIKE: (id) => `/posts/${id}/like`,
        COMMENT: (id) => `/posts/${id}/comment`,
    },

    // Wallet & Transactions
    WALLET: {
        BASE: '/wallet',
        OPPORTUNITIES: '/wallet/opportunities',
        SPEND: '/wallet/spend',
    },

    // Notifications
    NOTIFICATIONS: {
        BASE: '/notifications',
        BY_ID: (id) => `/notifications/${id}`,
        READ: (id) => `/notifications/${id}/read`,
        READ_ALL: '/notifications/read-all',
    },

    // Gamification
    GAMIFICATION: {
        PROFILE: '/gamification/profile',
        LEADERBOARD: '/gamification/leaderboard',
        ACHIEVEMENTS: '/gamification/achievements',
        CLAIM: (type) => `/gamification/claim/${type}`,
        ACTIVITY: '/gamification/activity',
    },

    // Referrals
    REFERRALS: {
        CODE: '/referrals/code',
        STATS: '/referrals/stats',
        APPLY: '/referrals/apply',
    },

    // Search
    SEARCH: {
        BASE: '/search',
        SUGGESTIONS: '/search/suggestions',
    },

    // Stats
    STATS: {
        PLATFORM: '/stats/platform',
        LEADERBOARD: '/stats/leaderboard',
        ACTIVITY: '/stats/activity',
    },

    // Recommendations
    RECOMMENDATIONS: {
        BASE: '/recommendations',
        TRENDING: '/recommendations/trending',
    },
};

/**
 * Query Keys Factory
 * Centralized query key management for React Query
 * This ensures consistency and makes cache invalidation predictable
 */
export const QUERY_KEYS = {
    // Auth
    AUTH: {
        CURRENT_USER: ['auth', 'currentUser'],
        ME: ['auth', 'me'],
    },

    // Users
    USERS: {
        ALL: (params = {}) => ['users', params],
        BY_ID: (id) => ['user', id],
        STATS: (id) => ['userStats', id],
    },

    // Swaps
    SWAPS: {
        ALL: (params = {}) => ['swaps', params],
        BY_ID: (id) => ['swap', id],
        USER_SWAPS: ['swaps'],
    },

    // Groups
    GROUPS: {
        ALL: (params = {}) => ['groups', params],
        BY_ID: (id) => ['group', id],
    },

    // Messages
    MESSAGES: {
        CONVERSATIONS: ['conversations'],
        CONVERSATION_MESSAGES: (conversationId) => ['conversation', conversationId, 'messages'],
    },

    // Posts
    POSTS: {
        ALL: (params = {}) => ['posts', params],
        BY_ID: (id) => ['post', id],
    },

    // Wallet
    WALLET: {
        BASE: ['wallet'],
        OPPORTUNITIES: ['wallet', 'opportunities'],
        TRANSACTIONS: ['wallet', 'transactions'],
    },

    // Notifications
    NOTIFICATIONS: {
        ALL: (params = {}) => ['notifications', params],
    },

    // Gamification
    GAMIFICATION: {
        PROFILE: ['gamification', 'profile'],
        LEADERBOARD: (type, limit) => ['gamification', 'leaderboard', type, limit],
        ACHIEVEMENTS: ['gamification', 'achievements'],
    },

    // Referrals
    REFERRALS: {
        CODE: ['referrals', 'code'],
        STATS: ['referrals', 'stats'],
    },

    // Search
    SEARCH: {
        RESULTS: (query, type, page, limit) => ['search', query, type, page, limit],
        SUGGESTIONS: (query, limit) => ['search', 'suggestions', query, limit],
    },

    // Stats
    STATS: {
        PLATFORM: ['stats', 'platform'],
        LEADERBOARD: (type, limit) => ['stats', 'leaderboard', type, limit],
        ACTIVITY: (limit) => ['stats', 'activity', limit],
    },

    // Recommendations
    RECOMMENDATIONS: {
        ALL: ['recommendations'],
        TRENDING: ['recommendations', 'trending'],
    },
};

/**
 * Cache Time Configuration
 * Define how long different types of data should be cached
 */
export const CACHE_TIMES = {
    SHORT: 1 * 60 * 1000,      // 1 minute - frequently changing data
    MEDIUM: 5 * 60 * 1000,     // 5 minutes - moderately stable data
    LONG: 15 * 60 * 1000,      // 15 minutes - stable data
    VERY_LONG: 30 * 60 * 1000, // 30 minutes - rarely changing data
};
