/**
 * Time Utilities
 * Format timestamps for display
 */

/**
 * Convert ISO timestamp to relative time (e.g., "2 hours ago")
 * @param {string} isoDate - ISO 8601 date string
 * @returns {string} Formatted relative time
 */
export const formatRelativeTime = (isoDate) => {
    if (!isoDate) return '';

    const now = new Date();
    const date = new Date(isoDate);
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 10) return "Just now";
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

    // For older dates, show actual date
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
};

/**
 * Format date for display
 * @param {string} isoDate - ISO 8601 date string
 * @returns {string} Formatted date
 */
export const formatDate = (isoDate) => {
    if (!isoDate) return '';

    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Format time for display
 * @param {string} isoDate - ISO 8601 date string
 * @returns {string} Formatted time
 */
export const formatTime = (isoDate) => {
    if (!isoDate) return '';

    const date = new Date(isoDate);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

/**
 * Format date and time
 * @param {string} isoDate - ISO 8601 date string
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (isoDate) => {
    if (!isoDate) return '';

    const date = new Date(isoDate);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};
