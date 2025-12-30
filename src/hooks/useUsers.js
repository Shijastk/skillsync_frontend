import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../services/api';
import { QUERY_KEYS, CACHE_TIMES } from '../config';

/**
 * Get all users with optional filters
 * @param {Object} params - Query parameters
 * @returns {Object} React Query result
 */
export const useUsers = (params = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.USERS.ALL(params),
        queryFn: () => usersService.getAll(params),
        staleTime: CACHE_TIMES.MEDIUM,
    });
};

/**
 * Search users with unmatches support
 * @param {Object} params - Query parameters
 * @returns {Object} React Query result
 */
export const useUserSearch = (params = {}) => {
    return useQuery({
        queryKey: ['users', 'search', params], // Distinct key
        queryFn: () => usersService.search(params),
        staleTime: CACHE_TIMES.SHORT,
        placeholderData: (previousData) => previousData, // keepPreviousData replacement in v5, or keepPreviousData in v4
    });
};

/**
 * Get single user by ID
 * @param {string} id - User ID
 * @param {Object} options - Additional query options
 * @returns {Object} React Query result
 */
export const useUser = (id, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.USERS.BY_ID(id),
        queryFn: () => usersService.getById(id),
        enabled: !!id,
        staleTime: CACHE_TIMES.MEDIUM,
        ...options,
    });
};

/**
 * Get current authenticated user's profile from /api/auth/me
 * Use this for personal profile page instead of useUser
 * @returns {Object} React Query result
 */
export const useCurrentUserProfile = () => {
    return useQuery({
        queryKey: QUERY_KEYS.AUTH.CURRENT_USER,
        queryFn: async () => {
            const { authService } = await import('../services/api');
            return authService.getCurrentUser();
        },
        staleTime: CACHE_TIMES.MEDIUM,
    });
};

/**
 * Get user statistics
 * @param {string} id - User ID
 * @returns {Object} React Query result
 */
export const useUserStats = (id) => {
    return useQuery({
        queryKey: QUERY_KEYS.USERS.STATS(id),
        queryFn: () => usersService.getUserStats(id),
        enabled: !!id,
        staleTime: CACHE_TIMES.SHORT,
    });
};

/**
 * Update user profile with optimistic updates
 * @returns {Object} React Query mutation result
 */
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: usersService.update,

        // Optimistic update
        onMutate: async (newUserData) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.AUTH.CURRENT_USER });

            // Snapshot previous value
            const previousUser = queryClient.getQueryData(QUERY_KEYS.AUTH.CURRENT_USER);

            // Optimistically update
            queryClient.setQueryData(QUERY_KEYS.AUTH.CURRENT_USER, (old) => ({
                ...old,
                ...newUserData,
            }));

            // Return context with snapshot
            return { previousUser };
        },

        // On error, rollback
        onError: (err, newUserData, context) => {
            if (context?.previousUser) {
                queryClient.setQueryData(QUERY_KEYS.AUTH.CURRENT_USER, context.previousUser);
            }
        },

        // Always refetch after error or success
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.CURRENT_USER });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.BY_ID });
        },
    });
};

/**
 * Add skill to teach with optimistic updates
 * @returns {Object} React Query mutation result
 */
export const useAddSkillToTeach = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: usersService.addSkillToTeach,

        onMutate: async (newSkill) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.AUTH.CURRENT_USER });

            const previousUser = queryClient.getQueryData(QUERY_KEYS.AUTH.CURRENT_USER);

            // Optimistically add skill
            queryClient.setQueryData(QUERY_KEYS.AUTH.CURRENT_USER, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    skillsToTeach: [...(old.skillsToTeach || []), newSkill],
                };
            });

            return { previousUser };
        },

        onError: (err, newSkill, context) => {
            if (context?.previousUser) {
                queryClient.setQueryData(QUERY_KEYS.AUTH.CURRENT_USER, context.previousUser);
            }
        },

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.CURRENT_USER });
            // Also invalidate the specific user query if we know the ID
            const user = queryClient.getQueryData(QUERY_KEYS.AUTH.CURRENT_USER);
            if (user?.id) {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.BY_ID(user.id) });
            }
        },
    });
};

/**
 * Add skill to learn with optimistic updates
 * @returns {Object} React Query mutation result
 */
export const useAddSkillToLearn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: usersService.addSkillToLearn,

        onMutate: async (newSkill) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.AUTH.CURRENT_USER });

            const previousUser = queryClient.getQueryData(QUERY_KEYS.AUTH.CURRENT_USER);

            queryClient.setQueryData(QUERY_KEYS.AUTH.CURRENT_USER, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    skillsToLearn: [...(old.skillsToLearn || []), newSkill],
                };
            });

            return { previousUser };
        },

        onError: (err, newSkill, context) => {
            if (context?.previousUser) {
                queryClient.setQueryData(QUERY_KEYS.AUTH.CURRENT_USER, context.previousUser);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.CURRENT_USER });
            const user = queryClient.getQueryData(QUERY_KEYS.AUTH.CURRENT_USER);
            if (user?.id) {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.BY_ID(user.id) });
            }
        },
    });
};

/**
 * Remove skill to teach with optimistic updates
 * @returns {Object} React Query mutation result
 */
export const useRemoveSkillToTeach = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: usersService.removeSkillToTeach,

        onMutate: async (skillId) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.AUTH.CURRENT_USER });

            const previousUser = queryClient.getQueryData(QUERY_KEYS.AUTH.CURRENT_USER);

            queryClient.setQueryData(QUERY_KEYS.AUTH.CURRENT_USER, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    skillsToTeach: (old.skillsToTeach || []).filter(s => s._id !== skillId),
                };
            });

            return { previousUser };
        },

        onError: (err, skillId, context) => {
            if (context?.previousUser) {
                queryClient.setQueryData(QUERY_KEYS.AUTH.CURRENT_USER, context.previousUser);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.CURRENT_USER });
            const user = queryClient.getQueryData(QUERY_KEYS.AUTH.CURRENT_USER);
            if (user?.id) {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.BY_ID(user.id) });
            }
        },
    });
};

/**
 * Remove skill to learn with optimistic updates
 * @returns {Object} React Query mutation result
 */
export const useRemoveSkillToLearn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: usersService.removeSkillToLearn,

        onMutate: async (skillId) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.AUTH.CURRENT_USER });

            const previousUser = queryClient.getQueryData(QUERY_KEYS.AUTH.CURRENT_USER);

            queryClient.setQueryData(QUERY_KEYS.AUTH.CURRENT_USER, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    skillsToLearn: (old.skillsToLearn || []).filter(s => s._id !== skillId),
                };
            });

            return { previousUser };
        },

        onError: (err, skillId, context) => {
            if (context?.previousUser) {
                queryClient.setQueryData(QUERY_KEYS.AUTH.CURRENT_USER, context.previousUser);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.CURRENT_USER });
            const user = queryClient.getQueryData(QUERY_KEYS.AUTH.CURRENT_USER);
            if (user?.id) {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.BY_ID(user.id) });
            }
        },
    });
};

/**
 * Get current user from localStorage
 * @returns {Object} React Query result
 */
export const useCurrentUser = () => {
    return useQuery({
        queryKey: QUERY_KEYS.AUTH.CURRENT_USER,
        queryFn: () => {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        },
        staleTime: Infinity,
    });
};

// Backward compatibility aliases
export const useUpdateUser = useUpdateProfile;
