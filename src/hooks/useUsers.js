import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../services/api';

// Get all users
export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: usersService.getAll,
    });
};

// Get user by ID
export const useUser = (id) => {
    return useQuery({
        queryKey: ['users', id],
        queryFn: () => usersService.getById(id),
        enabled: !!id,
    });
};

// Update user
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => usersService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
        },
    });
};

// Delete user
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: usersService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};
