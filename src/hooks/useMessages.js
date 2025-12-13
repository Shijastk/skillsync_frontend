import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesService } from '../services/api';

/**
 * Hook to fetch all conversations for current user
 */
export const useConversations = () => {
    return useQuery({
        queryKey: ['conversations'],
        queryFn: messagesService.getConversations,
    });
};

/**
 * Hook to fetch messages for a specific conversation
 */
export const useMessages = (conversationId) => {
    return useQuery({
        queryKey: ['messages', conversationId],
        queryFn: () => messagesService.getMessages(conversationId),
        enabled: !!conversationId, // Only fetch if conversationId exists
    });
};

/**
 * Hook to send a new message
 */
export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: messagesService.sendMessage,
        onSuccess: (data) => {
            // Invalidate messages query to refetch
            queryClient.invalidateQueries({ queryKey: ['messages', data.conversationId] });
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
};

/**
 * Hook to mark message as read
 */
export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: messagesService.markAsRead,
        onSuccess: (_, messageId) => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
        },
    });
};

/**
 * Hook to create a new conversation
 */
export const useCreateConversation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (conversationData) => {
            // Create conversation
            const conversation = await messagesService.createConversation(conversationData);
            return conversation;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
};
