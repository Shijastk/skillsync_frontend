import apiClient from './apiClient';
import { API_ENDPOINTS, API_CONFIG } from '../../config/api.config';

/**
 * Enhanced Authentication Service
 * All auth-related API calls with improved error handling
 */
export const authService = {
    /**
     * Login user
     * @param {Object} credentials - { email, password }
     * @returns {Promise<Object>} User data and tokens
     */
    login: async (credentials) => {
        const { data } = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

        // Save tokens and user
        if (data.success) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    },

    /**
     * Register new user
     * @param {Object} userData - Registration data
     * @returns {Promise<Object>} User data and tokens
     */
    register: async (userData) => {
        const { data } = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);

        // Save tokens and user
        if (data.success) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    },

    /**
     * Logout user
     * @returns {Promise<void>}
     */
    logout: async () => {
        try {
            await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    },

    /**
     * Get current user data
     * @returns {Promise<Object>} User object
     */
    getCurrentUser: async () => {
        const { data } = await apiClient.get(API_ENDPOINTS.AUTH.ME);
        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data.user;
    },

    /**
     * Refresh auth token
     * @returns {Promise<Object>} New tokens
     */
    refreshToken: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });

        if (data.success) {
            localStorage.setItem('authToken', data.token);
            if (data.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken);
            }
        }

        return data;
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    },
};

/**
 * Enhanced Users Service
 * All user-related API calls
 */
export const usersService = {
    /**
     * Get all users with optional filters
     * @param {Object} params - Query parameters
     * @returns {Promise<Array>} List of users
     */
    getAll: async (params = {}) => {
        const { data } = await apiClient.get(API_ENDPOINTS.USERS.BASE, { params });
        return data.users || data;
    },

    /**
     * Search users with full response (incl unmatches)
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} Full response { users, unmatches, pagination }
     */
    search: async (params = {}) => {
        const { data } = await apiClient.get(API_ENDPOINTS.USERS.BASE, { params });
        return data;
    },

    /**
     * Get user by ID
     * @param {string} id - User ID
     * @returns {Promise<Object>} User object
     */
    getById: async (id) => {
        const { data } = await apiClient.get(API_ENDPOINTS.USERS.BY_ID(id));
        return data;
    },

    /**
     * Get user statistics
     * @param {string} id - User ID
     * @returns {Promise<Object>} User stats
     */
    getUserStats: async (id) => {
        const { data } = await apiClient.get(API_ENDPOINTS.USERS.STATS(id));
        return data;
    },

    /**
     * Update user profile
     * @param {Object} userData - Updated user data
     * @returns {Promise<Object>} Updated user object
     */
    update: async (userData) => {
        const { data } = await apiClient.put(API_ENDPOINTS.USERS.PROFILE, userData);

        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data.user;
    },

    /**
     * Add skill to teach
     * @param {Object} skillData - Skill information
     * @returns {Promise<Object>} Response data
     */
    addSkillToTeach: async (skillData) => {
        const { data } = await apiClient.post(API_ENDPOINTS.USERS.SKILLS.TEACH, skillData);

        if (data.success) {
            // Update local user data
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.skillsToTeach) {
                user.skillsToTeach.push(data.skill);
                localStorage.setItem('user', JSON.stringify(user));
            }
        }

        return data;
    },

    /**
     * Add skill to learn
     * @param {Object} skillData - Skill information
     * @returns {Promise<Object>} Response data
     */
    addSkillToLearn: async (skillData) => {
        const { data } = await apiClient.post(API_ENDPOINTS.USERS.SKILLS.LEARN, skillData);

        if (data.success) {
            // Update local user data
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.skillsToLearn) {
                user.skillsToLearn.push(data.skill);
                localStorage.setItem('user', JSON.stringify(user));
            }
        }

        return data;
    },

    /**
     * Remove skill to teach
     * @param {string} skillId - Skill ID
     * @returns {Promise<Object>} Response data
     */
    removeSkillToTeach: async (skillId) => {
        const { data } = await apiClient.delete(API_ENDPOINTS.USERS.SKILLS.TEACH_BY_ID(skillId));

        if (data.success) {
            // Update local user data
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.skillsToTeach) {
                user.skillsToTeach = user.skillsToTeach.filter(s => s._id !== skillId);
                localStorage.setItem('user', JSON.stringify(user));
            }
        }

        return data;
    },

    /**
     * Remove skill to learn
     * @param {string} skillId - Skill ID
     * @returns {Promise<Object>} Response data
     */
    removeSkillToLearn: async (skillId) => {
        const { data } = await apiClient.delete(API_ENDPOINTS.USERS.SKILLS.LEARN_BY_ID(skillId));

        if (data.success) {
            // Update local user data
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.skillsToLearn) {
                user.skillsToLearn = user.skillsToLearn.filter(s => s._id !== skillId);
                localStorage.setItem('user', JSON.stringify(user));
            }
        }

        return data;
    },
};

/**
 * Enhanced Swaps Service
 */
export const swapsService = {
    getAll: async (params = {}) => {
        const { data } = await apiClient.get(API_ENDPOINTS.SWAPS.BASE, { params });
        return data.swaps || data;
    },

    getById: async (id) => {
        const { data } = await apiClient.get(API_ENDPOINTS.SWAPS.BY_ID(id));
        return data;
    },

    create: async (swapData) => {
        const { data } = await apiClient.post(API_ENDPOINTS.SWAPS.BASE, swapData);
        // Return both swap and conversationId for automatic navigation
        return {
            swap: data.swap || data,
            conversationId: data.conversationId
        };
    },

    update: async (id, swapData) => {
        const { data } = await apiClient.put(API_ENDPOINTS.SWAPS.BY_ID(id), swapData);
        return data.swap || data;
    },

    getUserSwaps: async () => {
        const { data } = await apiClient.get(API_ENDPOINTS.SWAPS.BASE);
        return data.swaps || data;
    },
};

/**
 * Enhanced Groups Service
 */
export const groupsService = {
    getAll: async (params = {}) => {
        const { data } = await apiClient.get(API_ENDPOINTS.GROUPS.BASE, { params });
        return data.groups || data;
    },

    getById: async (id) => {
        const { data } = await apiClient.get(API_ENDPOINTS.GROUPS.BY_ID(id));
        return data;
    },

    create: async (groupData) => {
        const { data } = await apiClient.post(API_ENDPOINTS.GROUPS.BASE, groupData);
        return data.group || data;
    },

    update: async (id, groupData) => {
        const { data } = await apiClient.patch(API_ENDPOINTS.GROUPS.BY_ID(id), groupData);
        return data;
    },

    join: async (id) => {
        const { data } = await apiClient.post(API_ENDPOINTS.GROUPS.JOIN(id));
        // Return the updated group object with new member
        return data.group || data;
    },
};

/**
 * Enhanced Messages Service
 */
export const messagesService = {
    getConversations: async () => {
        const { data } = await apiClient.get(API_ENDPOINTS.MESSAGES.CONVERSATIONS);
        return data;
    },

    getMessages: async (conversationId) => {
        const { data } = await apiClient.get(API_ENDPOINTS.MESSAGES.CONVERSATION_MESSAGES(conversationId));
        return data;
    },

    sendMessage: async (messageData) => {
        // Check if messageData is FormData (for file uploads) or plain object (for text)
        if (messageData instanceof FormData) {
            // File upload - use fetch to handle FormData properly
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_CONFIG.BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: messageData
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            return await response.json();
        } else {
            // Text message - use apiClient
            const { data } = await apiClient.post(API_ENDPOINTS.MESSAGES.BASE, messageData);
            return data;
        }
    },

    markAsRead: async (messageId) => {
        const { data } = await apiClient.put(API_ENDPOINTS.MESSAGES.MARK_READ(messageId));
        return data;
    },

    createConversation: async (conversationData) => {
        const { data } = await apiClient.post(API_ENDPOINTS.MESSAGES.CONVERSATIONS, conversationData);
        return data;
    },
};

/**
 * Enhanced Posts Service
 */
export const postsService = {
    getAll: async (params = {}) => {
        const { data } = await apiClient.get(API_ENDPOINTS.POSTS.BASE, { params });
        // Backend returns direct array, not wrapped
        return Array.isArray(data) ? data : (data.data || data);
    },

    getFeed: async (params = {}) => {
        const { data } = await apiClient.get(API_ENDPOINTS.RECOMMENDATIONS.BASE, {
            params: { ...params, type: 'feed' }
        });
        return data.recommendations || [];
    },

    create: async (postData) => {
        const { data } = await apiClient.post(API_ENDPOINTS.POSTS.BASE, postData);
        return data.post || data;
    },

    like: async (postId) => {
        const { data } = await apiClient.put(API_ENDPOINTS.POSTS.LIKE(postId));
        return data;
    },

    addComment: async (postId, comment) => {
        const { data } = await apiClient.post(API_ENDPOINTS.POSTS.COMMENT(postId), { text: comment });
        return data;
    },
};

/**
 * Enhanced Wallet Service
 */
export const walletService = {
    getWallet: async () => {
        const { data } = await apiClient.get(API_ENDPOINTS.WALLET.BASE);
        return data;
    },

    getOpportunities: async () => {
        const { data } = await apiClient.get(API_ENDPOINTS.WALLET.OPPORTUNITIES);
        return data;
    },

    spend: async (amount, description, feature) => {
        const { data } = await apiClient.post(API_ENDPOINTS.WALLET.SPEND, { amount, description, feature });
        return data;
    },
};

/**
 * Enhanced Transactions Service
 */
export const transactionsService = {
    getAll: async () => {
        const { data } = await apiClient.get(API_ENDPOINTS.WALLET.BASE);
        return data.transactions || [];
    },

    getUserTransactions: async () => {
        const { data } = await apiClient.get(API_ENDPOINTS.WALLET.BASE);
        return data.transactions || [];
    },
};

/**
 * Enhanced Notifications Service
 */
export const notificationsService = {
    getAll: async (params = {}) => {
        const { data } = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.BASE, { params });
        return data.data || data;
    },

    markAsRead: async (id) => {
        const { data } = await apiClient.put(API_ENDPOINTS.NOTIFICATIONS.READ(id));
        return data;
    },

    markAllAsRead: async () => {
        const { data } = await apiClient.put(API_ENDPOINTS.NOTIFICATIONS.READ_ALL);
        return data;
    },

    delete: async (id) => {
        const { data } = await apiClient.delete(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id));
        return data;
    },
};

/**
 * Enhanced Gamification Service
 */
export const gamificationService = {
    getProfile: async () => {
        const { data } = await apiClient.get(API_ENDPOINTS.GAMIFICATION.PROFILE);
        return data;
    },

    getLeaderboard: async (type = 'level', limit = 10) => {
        const { data } = await apiClient.get(API_ENDPOINTS.GAMIFICATION.LEADERBOARD, {
            params: { type, limit }
        });
        return data;
    },

    getAchievements: async () => {
        const { data } = await apiClient.get(API_ENDPOINTS.GAMIFICATION.ACHIEVEMENTS);
        return data;
    },

    claimAchievement: async (type) => {
        const { data } = await apiClient.post(API_ENDPOINTS.GAMIFICATION.CLAIM(type));
        return data;
    },

    trackActivity: async (activityType, metadata = {}) => {
        const { data } = await apiClient.post(API_ENDPOINTS.GAMIFICATION.ACTIVITY, {
            type: activityType,
            metadata
        });
        return data;
    },
};

/**
 * Enhanced Referrals Service
 */
export const referralsService = {
    getCode: async () => {
        const { data } = await apiClient.get(API_ENDPOINTS.REFERRALS.CODE);
        return data;
    },

    getStats: async () => {
        const { data } = await apiClient.get(API_ENDPOINTS.REFERRALS.STATS);
        return data;
    },

    applyCode: async (referralCode, newUserId) => {
        const { data } = await apiClient.post(API_ENDPOINTS.REFERRALS.APPLY, {
            referralCode,
            newUserId
        });
        return data;
    },
};

/**
 * Enhanced Search Service
 */
export const searchService = {
    search: async (query, type = null, page = 1, limit = 10) => {
        const { data } = await apiClient.get(API_ENDPOINTS.SEARCH.BASE, {
            params: { q: query, type, page, limit }
        });
        return data;
    },

    getSuggestions: async (query, limit = 5) => {
        const { data } = await apiClient.get(API_ENDPOINTS.SEARCH.SUGGESTIONS, {
            params: { q: query, limit }
        });
        return data;
    },
};

/**
 * Enhanced Stats Service
 */
export const statsService = {
    getPlatformStats: async () => {
        const { data } = await apiClient.get(API_ENDPOINTS.STATS.PLATFORM);
        return data;
    },

    getLeaderboard: async (type = 'skillcoins', limit = 10) => {
        const { data } = await apiClient.get(API_ENDPOINTS.STATS.LEADERBOARD, {
            params: { type, limit }
        });
        return data;
    },

    getActivityFeed: async (limit = 20) => {
        const { data } = await apiClient.get(API_ENDPOINTS.STATS.ACTIVITY, {
            params: { limit }
        });
        return data;
    },
};

/**
 * Enhanced Recommendations Service
 */
export const recommendationsService = {
    getRecommendations: async () => {
        const { data } = await apiClient.get(API_ENDPOINTS.RECOMMENDATIONS.BASE);
        return data;
    },

    getTrending: async () => {
        const { data } = await apiClient.get(API_ENDPOINTS.RECOMMENDATIONS.TRENDING);
        return data;
    },
};
