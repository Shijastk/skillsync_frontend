import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsService } from '../services/api';

// Get all groups
export const useGroups = () => {
    return useQuery({
        queryKey: ['groups'],
        queryFn: groupsService.getAll,
    });
};

// Get group by ID
export const useGroup = (id) => {
    return useQuery({
        queryKey: ['groups', id],
        queryFn: () => groupsService.getById(id),
        enabled: !!id,
    });
};

// Create group
export const useCreateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: groupsService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
    });
};

// Update group
export const useUpdateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => groupsService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
    });
};

// Delete group
export const useDeleteGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: groupsService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
    });
};
