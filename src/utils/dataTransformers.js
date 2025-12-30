/**
 * Data Transformers
 * Transform backend API responses to frontend display format
 */

import { formatRelativeTime } from './timeUtils';

/**
 * Get user display name from user object
 * @param {Object} user - User object with firstName/lastName or name
 * @returns {string} Display name
 */
export const getUserDisplayName = (user) => {
    if (!user) return 'Unknown User';

    if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`.trim();
    }

    if (user.firstName) return user.firstName;
    if (user.name) return user.name;

    return 'Unknown User';
};

/**
 * Get user initials
 * @param {Object} user - User object
 * @returns {string} Initials (e.g., "JD")
 */
export const getUserInitials = (user) => {
    if (!user) return 'U';

    const first = user.firstName?.[0] || user.name?.[0] || 'U';
    const last = user.lastName?.[0] || '';

    return (first + last).toUpperCase();
};

/**
 * Get random gradient for avatar
 * @param {string} userId - User ID for consistency
 * @returns {string} Tailwind gradient class
 */
const getAvatarGradient = (userId) => {
    const gradients = [
        'from-indigo-500 to-purple-500',
        'from-pink-500 to-rose-500',
        'from-blue-500 to-cyan-500',
        'from-green-500 to-emerald-500',
        'from-yellow-500 to-orange-500',
        'from-purple-500 to-pink-500',
        'from-cyan-500 to-blue-500',
        'from-orange-500 to-red-500',
    ];

    // Use userId to consistently pick same gradient for same user
    const index = userId ? userId.charCodeAt(0) % gradients.length : 0;
    return gradients[index];
};

/**
 * Transform post from backend API format to frontend display format
 * @param {Object} apiPost - Post from backend API
 * @returns {Object} Transformed post for display
 */
export const transformPostForDisplay = (apiPost) => {
    if (!apiPost) return null;

    const author = apiPost.author || {};
    const userId = author.id || author._id || '';

    return {
        id: apiPost.id || apiPost._id,

        // User info from author object
        user: getUserDisplayName(author),
        role: author.bio?.split('.')[0] || 'Skill Swapper',

        // Avatar
        avatar: {
            url: author.avatar,
            initials: getUserInitials(author),
            color: getAvatarGradient(userId),
            icon: null
        },

        // Content
        content: apiPost.content || '',
        image: apiPost.image || null,

        // Metrics - transform arrays to counts
        metrics: {
            likes: Array.isArray(apiPost.likes) ? apiPost.likes.length : 0,
            comments: Array.isArray(apiPost.comments) ? apiPost.comments.length : 0,
            shares: 0 // Not in backend yet
        },

        // Time
        time: formatRelativeTime(apiPost.createdAt),
        createdAt: apiPost.createdAt,

        // Likes - keep array for checking if user liked
        likes: Array.isArray(apiPost.likes) ? apiPost.likes : [],

        // Comments - transform structure
        comments: Array.isArray(apiPost.comments)
            ? apiPost.comments.map(transformCommentForDisplay)
            : [],

        // Group info (if any)
        groupId: apiPost.group || null,

        // Post type and tags
        type: apiPost.type || 'post',
        tags: Array.isArray(apiPost.tags) ? apiPost.tags : [],

        // Keep original data for reference
        _raw: apiPost
    };
};

/**
 * Transform comment for display
 * @param {Object} apiComment - Comment from backend API
 * @returns {Object} Transformed comment
 */
export const transformCommentForDisplay = (apiComment) => {
    if (!apiComment) return null;

    const user = apiComment.user || {};

    return {
        id: apiComment.id || apiComment._id,
        user: getUserDisplayName(user),
        userAvatar: user.avatar,
        userInitials: getUserInitials(user),
        text: apiComment.text || apiComment.content || '',
        time: formatRelativeTime(apiComment.createdAt),
        createdAt: apiComment.createdAt,
        _raw: apiComment
    };
};

/**
 * Transform swap for display
 * @param {Object} apiSwap - Swap from backend API
 * @returns {Object} Transformed swap
 */
export const transformSwapForDisplay = (apiSwap) => {
    if (!apiSwap) return null;

    const requester = apiSwap.requester || {};
    const recipient = apiSwap.recipient || {};

    return {
        id: apiSwap.id || apiSwap._id,

        requester: {
            id: requester.id || requester._id,
            name: getUserDisplayName(requester),
            avatar: requester.avatar,
            initials: getUserInitials(requester)
        },

        recipient: {
            id: recipient.id || recipient._id,
            name: getUserDisplayName(recipient),
            avatar: recipient.avatar,
            initials: getUserInitials(recipient)
        },

        skillOffered: apiSwap.skillOffered,
        skillRequested: apiSwap.skillRequested,
        description: apiSwap.description || apiSwap.message || '',

        status: apiSwap.status,
        duration: apiSwap.duration || '1 hour',
        scheduledDate: apiSwap.scheduledDate,

        skillcoinsEarned: apiSwap.skillcoinsEarned || 0,

        createdAt: apiSwap.createdAt,
        time: formatRelativeTime(apiSwap.createdAt),

        _raw: apiSwap
    };
};

/**
 * Transform user for display
 * @param {Object} apiUser - User from backend API
 * @returns {Object} Transformed user
 */
export const transformUserForDisplay = (apiUser) => {
    if (!apiUser) return null;

    return {
        id: apiUser.id || apiUser._id,
        name: getUserDisplayName(apiUser),
        initials: getUserInitials(apiUser),
        avatar: apiUser.avatar,
        bio: apiUser.bio || '',
        location: apiUser.location || 'Remote',

        skillsToTeach: apiUser.skillsToTeach || [],
        skillsToLearn: apiUser.skillsToLearn || [],

        skillcoins: apiUser.skillcoins || 0,
        level: apiUser.level || 1,
        xp: apiUser.xp || 0,

        badges: apiUser.badges || [],

        joinedDate: apiUser.joinedDate || apiUser.createdAt,

        _raw: apiUser
    };
};

/**
 * Transform notification for display
 * @param {Object} apiNotification - Notification from backend API
 * @returns {Object} Transformed notification
 */
export const transformNotificationForDisplay = (apiNotification) => {
    if (!apiNotification) return null;

    return {
        id: apiNotification.id || apiNotification._id,
        type: apiNotification.type,
        title: apiNotification.title,
        message: apiNotification.message,
        isRead: apiNotification.isRead || false,

        actionUrl: apiNotification.actionUrl,
        data: apiNotification.data || {},

        time: formatRelativeTime(apiNotification.createdAt),
        createdAt: apiNotification.createdAt,

        _raw: apiNotification
    };
};
