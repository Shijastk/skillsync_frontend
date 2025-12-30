import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsService } from '../services/api';
import { QUERY_KEYS, CACHE_TIMES } from '../config';

/**
 * Get all groups with optional filters
 * @param {Object} params - Query parameters
 * @returns {Object} React Query result
 */
export const useGroups = (params = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.GROUPS.ALL(params),
        queryFn: () => groupsService.getAll(params),
        staleTime: CACHE_TIMES.MEDIUM, // 5 minutes
    });
};

/**
 * Get single group
 * @param {string} id - Group ID
 * @returns {Object} React Query result
 */
export const useGroup = (id) => {
    return useQuery({
        queryKey: QUERY_KEYS.GROUPS.BY_ID(id),
        queryFn: () => groupsService.getById(id),
        enabled: !!id,
        staleTime: CACHE_TIMES.MEDIUM,
    });
};

/**
 * Create group with optimistic updates
 * @returns {Object} React Query mutation result
 */
export const useCreateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: groupsService.create,

        // Optimistic update
        onMutate: async (newGroup) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.GROUPS.ALL() });

            const previousGroups = queryClient.getQueryData(QUERY_KEYS.GROUPS.ALL({}));
            const currentUser = queryClient.getQueryData(QUERY_KEYS.AUTH.CURRENT_USER);

            // Optimistically add new group
            queryClient.setQueryData(QUERY_KEYS.GROUPS.ALL({}), (old) => {
                const optimisticGroup = {
                    ...newGroup,
                    id: 'temp-' + Date.now(),
                    creator: currentUser,
                    members: [currentUser],
                    memberCount: 1,
                    createdAt: new Date().toISOString(),
                    isOptimistic: true,
                };

                return Array.isArray(old) ? [optimisticGroup, ...old] : [optimisticGroup];
            });

            return { previousGroups };
        },

        onError: (err, newGroup, context) => {
            if (context?.previousGroups) {
                queryClient.setQueryData(QUERY_KEYS.GROUPS.ALL({}), context.previousGroups);
            }
        },

        onSuccess: (data) => {
            console.log('Group created successfully:', data);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUPS.ALL() });
        },
    });
};

/**
 * Update group with optimistic updates
 * @returns {Object} React Query mutation result
 */
export const useUpdateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => groupsService.update(id, data),

        // Optimistic update
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.GROUPS.ALL() });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.GROUPS.BY_ID(id) });

            const previousGroups = queryClient.getQueryData(QUERY_KEYS.GROUPS.ALL({}));
            const previousGroup = queryClient.getQueryData(QUERY_KEYS.GROUPS.BY_ID(id));

            // Update group in list
            queryClient.setQueryData(QUERY_KEYS.GROUPS.ALL({}), (old) => {
                if (!Array.isArray(old)) return old;
                return old.map(group =>
                    group.id === id || group._id === id
                        ? { ...group, ...data }
                        : group
                );
            });

            // Update individual group
            queryClient.setQueryData(QUERY_KEYS.GROUPS.BY_ID(id), (old) => ({
                ...old,
                ...data,
            }));

            return { previousGroups, previousGroup };
        },

        onError: (err, variables, context) => {
            if (context?.previousGroups) {
                queryClient.setQueryData(QUERY_KEYS.GROUPS.ALL({}), context.previousGroups);
            }
            if (context?.previousGroup) {
                queryClient.setQueryData(QUERY_KEYS.GROUPS.BY_ID(variables.id), context.previousGroup);
            }
        },

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUPS.ALL() });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUPS.BY_ID(variables.id) });
        },
    });
};

/**
 * Join group with optimistic updates
 * @returns {Object} React Query mutation result
 */
export const useJoinGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: groupsService.join,

        // Optimistic update
        onMutate: async (groupId) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.GROUPS.BY_ID(groupId) });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.GROUPS.ALL() });

            const previousGroup = queryClient.getQueryData(QUERY_KEYS.GROUPS.BY_ID(groupId));
            const previousGroups = queryClient.getQueryData(QUERY_KEYS.GROUPS.ALL({}));
            const currentUser = queryClient.getQueryData(QUERY_KEYS.AUTH.CURRENT_USER);

            // Optimistically add user to group members
            queryClient.setQueryData(QUERY_KEYS.GROUPS.BY_ID(groupId), (old) => {
                if (!old) return old;
                return {
                    ...old,
                    members: [...(old.members || []), currentUser],
                    memberCount: (old.memberCount || 0) + 1,
                };
            });

            // Also update in groups list
            queryClient.setQueryData(QUERY_KEYS.GROUPS.ALL({}), (old) => {
                if (!Array.isArray(old)) return old;
                return old.map(group => {
                    if (group.id === groupId || group._id === groupId) {
                        return {
                            ...group,
                            members: [...(group.members || []), currentUser],
                            memberCount: (group.memberCount || 0) + 1,
                        };
                    }
                    return group;
                });
            });

            return { previousGroup, previousGroups };
        },

        onError: (err, groupId, context) => {
            if (context?.previousGroup) {
                queryClient.setQueryData(QUERY_KEYS.GROUPS.BY_ID(groupId), context.previousGroup);
            }
            if (context?.previousGroups) {
                queryClient.setQueryData(QUERY_KEYS.GROUPS.ALL({}), context.previousGroups);
            }
        },

        onSettled: (data, error, groupId) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUPS.BY_ID(groupId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUPS.ALL() });
        },
    });
};
