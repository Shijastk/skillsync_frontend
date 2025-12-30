import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/api';
import { QUERY_KEYS, CACHE_TIMES } from '../config';

/**
 * Get all notifications
 * @param {Object} params - Query parameters
 * @returns {Object} React Query result
 */
export const useNotifications = (params = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.NOTIFICATIONS.ALL(params),
        queryFn: () => notificationsService.getAll(params),
        staleTime: CACHE_TIMES.SHORT, // Notifications change frequently
    });
};

/**
 * Mark notification as read with optimistic update
 * @returns {Object} React Query mutation result
 */
export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: notificationsService.markAsRead,

        // Optimistic update
        onMutate: async (notificationId) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.ALL() });

            const previousNotifications = queryClient.getQueryData(QUERY_KEYS.NOTIFICATIONS.ALL({}));

            // Mark as read optimistically
            queryClient.setQueryData(QUERY_KEYS.NOTIFICATIONS.ALL({}), (old) => {
                if (!Array.isArray(old)) return old;

                return old.map(notification =>
                    notification.id === notificationId || notification._id === notificationId
                        ? { ...notification, read: true, isOptimistic: true }
                        : notification
                );
            });

            return { previousNotifications };
        },

        onError: (err, notificationId, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(QUERY_KEYS.NOTIFICATIONS.ALL({}), context.previousNotifications);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.ALL() });
        },
    });
};

/**
 * Mark all notifications as read with optimistic update
 * @returns {Object} React Query mutation result
 */
export const useMarkAllNotificationsAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: notificationsService.markAllAsRead,

        // Optimistic update
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.ALL() });

            const previousNotifications = queryClient.getQueryData(QUERY_KEYS.NOTIFICATIONS.ALL({}));

            // Mark all as read optimistically
            queryClient.setQueryData(QUERY_KEYS.NOTIFICATIONS.ALL({}), (old) => {
                if (!Array.isArray(old)) return old;

                return old.map(notification => ({
                    ...notification,
                    read: true,
                    isOptimistic: true,
                }));
            });

            return { previousNotifications };
        },

        onError: (err, variables, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(QUERY_KEYS.NOTIFICATIONS.ALL({}), context.previousNotifications);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.ALL() });
        },
    });
};

/**
 * Delete notification with optimistic update
 * @returns {Object} React Query mutation result
 */
export const useDeleteNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: notificationsService.delete,

        // Optimistic update
        onMutate: async (notificationId) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.ALL() });

            const previousNotifications = queryClient.getQueryData(QUERY_KEYS.NOTIFICATIONS.ALL({}));

            // Remove notification optimistically
            queryClient.setQueryData(QUERY_KEYS.NOTIFICATIONS.ALL({}), (old) => {
                if (!Array.isArray(old)) return old;

                return old.filter(notification =>
                    notification.id !== notificationId && notification._id !== notificationId
                );
            });

            return { previousNotifications };
        },

        onError: (err, notificationId, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(QUERY_KEYS.NOTIFICATIONS.ALL({}), context.previousNotifications);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.ALL() });
        },
    });
};

/**
 * Get unread notification count
 * Derived from notifications query
 * @returns {number} Unread count
 */
export const useUnreadNotificationCount = () => {
    const { data: notifications = [] } = useNotifications();

    return notifications.filter(n => !n.read).length;
};
