import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsService } from '../services/api';

export const usePosts = () => {
    return useQuery({
        queryKey: ['posts'],
        queryFn: postsService.getAll,
    });
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: postsService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
};

export const useAddComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, comment }) => postsService.addComment(postId, comment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
};

export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, likes }) => postsService.update(id, { likes }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
};
