import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesService } from '../services/api';
import { QUERY_KEYS, CACHE_TIMES } from '../config/api.config';

/**
 * Get all conversations
 * @returns {Object} React Query result
 */
export const useConversations = () => {
    return useQuery({
        queryKey: QUERY_KEYS.MESSAGES.CONVERSATIONS,
        queryFn: messagesService.getConversations,
        staleTime: CACHE_TIMES.SHORT,
    });
};

import { useSocket } from '../context/SocketContext';

/**
 * Get messages for a specific conversation
 * @param {string} conversationId - Conversation ID
 * @returns {Object} React Query result
 */
export const useMessages = (conversationId) => {
    const { isConnected } = useSocket();

    return useQuery({
        queryKey: QUERY_KEYS.MESSAGES.CONVERSATION_MESSAGES(conversationId),
        queryFn: () => messagesService.getMessages(conversationId),
        enabled: !!conversationId,
        staleTime: CACHE_TIMES.SHORT,
        refetchInterval: isConnected ? false : 10000, // Poll only if socket disconnected
    });
};

/**
 * Send message with optimistic update (text only)
 * Media messages skip optimistic update and wait for backend response
 * @returns {Object} React Query mutation result
 */
export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: messagesService.sendMessage,

        onMutate: async (messageData) => {
            // Extract conversationId from FormData or JSON
            const conversationId = messageData instanceof FormData
                ? messageData.get('conversationId')
                : messageData.conversationId;

            // Cancel any outgoing refetches
            await queryClient.cancelQueries({
                queryKey: QUERY_KEYS.MESSAGES.CONVERSATION_MESSAGES(conversationId)
            });

            // Snapshot the previous value
            const previousMessages = queryClient.getQueryData(
                QUERY_KEYS.MESSAGES.CONVERSATION_MESSAGES(conversationId)
            );

            const currentUser = queryClient.getQueryData(QUERY_KEYS.AUTH.CURRENT_USER);

            // Construct optimistic message
            let optimisticMessage;

            if (messageData instanceof FormData) {
                const type = messageData.get('type');
                const content = messageData.get('content');
                const file = messageData.get('attachment');

                // Create temporary URL for preview
                const tempUrl = file ? URL.createObjectURL(file) : null;

                optimisticMessage = {
                    _id: 'temp-' + Date.now(),
                    id: 'temp-' + Date.now(),
                    sender: currentUser,
                    content: content || '',
                    type: type,
                    attachmentUrl: tempUrl,
                    metadata: {
                        fileName: file?.name,
                        fileSize: file?.size,
                        mimeType: file?.type
                    },
                    createdAt: new Date().toISOString(),
                    readBy: [currentUser?.id || currentUser?._id],
                    isOptimistic: true,
                    status: 'sending'
                };
            } else {
                optimisticMessage = {
                    ...messageData,
                    id: 'temp-' + Date.now(),
                    _id: 'temp-' + Date.now(),
                    sender: currentUser,
                    createdAt: new Date().toISOString(),
                    readBy: [currentUser?.id || currentUser?._id],
                    isOptimistic: true,
                    status: 'sending'
                };
            }

            // Add optimistic message to cache
            queryClient.setQueryData(
                QUERY_KEYS.MESSAGES.CONVERSATION_MESSAGES(conversationId),
                (old) => {
                    return Array.isArray(old)
                        ? [...old, optimisticMessage]
                        : [optimisticMessage];
                }
            );

            // Update conversation list preview
            queryClient.setQueryData(QUERY_KEYS.MESSAGES.CONVERSATIONS, (old) => {
                if (!Array.isArray(old)) return old;

                return old.map(conv =>
                    conv.id === conversationId || conv._id === conversationId
                        ? {
                            ...conv,
                            lastMessage: optimisticMessage.content ||
                                (optimisticMessage.type === 'voice' ? '🎤 Voice message' : '📎 Attachment'),
                            lastMessageTime: new Date().toISOString(),
                        }
                        : conv
                );
            });

            return { previousMessages, conversationId };
        },

        onError: (err, messageData, context) => {
            console.error('❌ Message send failed:', err);

            // Rollback on error
            if (context?.previousMessages && context?.conversationId) {
                queryClient.setQueryData(
                    QUERY_KEYS.MESSAGES.CONVERSATION_MESSAGES(context.conversationId),
                    context.previousMessages
                );
            }
        },

        onSuccess: (data) => {
            // Success handled internally
        },

        onSettled: (data, error, messageData, context) => {
            // Get conversationId from context or messageData
            const conversationId = context?.conversationId ||
                (messageData instanceof FormData
                    ? messageData.get('conversationId')
                    : messageData.conversationId);

            // Refetch to get server state
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.CONVERSATION_MESSAGES(conversationId)
            });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.CONVERSATIONS
            });
        },
    });
};

/**
 * Mark message as read with optimistic update
 * @returns {Object} React Query mutation result
 */
export const useMarkMessageAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ messageId }) => messagesService.markAsRead(messageId),

        onMutate: async ({ messageId, conversationId }) => {
            await queryClient.cancelQueries({
                queryKey: QUERY_KEYS.MESSAGES.CONVERSATION_MESSAGES(conversationId)
            });

            const previousMessages = queryClient.getQueryData(
                QUERY_KEYS.MESSAGES.CONVERSATION_MESSAGES(conversationId)
            );

            // Mark as read optimistically
            queryClient.setQueryData(
                QUERY_KEYS.MESSAGES.CONVERSATION_MESSAGES(conversationId),
                (old) => {
                    if (!Array.isArray(old)) return old;

                    return old.map(message =>
                        message.id === messageId || message._id === messageId
                            ? { ...message, isRead: true }
                            : message
                    );
                }
            );

            return { previousMessages, conversationId };
        },

        onError: (err, variables, context) => {
            if (context?.previousMessages) {
                queryClient.setQueryData(
                    QUERY_KEYS.MESSAGES.CONVERSATION_MESSAGES(context.conversationId),
                    context.previousMessages
                );
            }
        },

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.CONVERSATION_MESSAGES(variables.conversationId)
            });
        },
    });
};

/**
 * Create new conversation
 * @returns {Object} React Query mutation result
 */
export const useCreateConversation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: messagesService.createConversation,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MESSAGES.CONVERSATIONS });
        },
    });
};

/**
 * Get unread message count across all conversations
 * @returns {number} Unread count
 */
export const useUnreadMessageCount = () => {
    const { data: conversations = [] } = useConversations();

    return conversations.reduce((count, conv) => count + (conv.unreadCount || 0), 0);
};
