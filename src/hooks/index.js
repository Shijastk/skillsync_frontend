// Authentication
export { useLogin, useRegister, useLogout } from './useAuth';

// Users
export { useUsers, useUser, useUserStats, useUpdateProfile, useUpdateUser, useCurrentUser } from './useUsers';

// Swaps
export { useUserSwaps, useSwap, useCreateSwap, useUpdateSwap, useSwaps } from './useSwaps';

// Messages
export { useConversations, useMessages, useSendMessage, useMarkAsRead, useCreateConversation } from './useMessages';

// Posts
export { usePosts, useCreatePost, useLikePost, useAddComment } from './usePosts';

// Groups
export { useGroups, useGroup, useCreateGroup, useUpdateGroup, useJoinGroup } from './useGroups';

// Transactions & Wallet
export { useWallet, useEarningOpportunities, useTransactions, useUserTransactions, useCreateTransaction } from './useTransactions';

// Notifications
export { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead, useDeleteNotification } from './useNotifications';

// Gamification
export { useGamificationProfile, useLeaderboard, useAchievements, useClaimAchievement, useTrackActivity } from './useGamification';

// Referrals
export { useReferralCode, useReferralStats, useApplyReferral } from './useReferrals';

// Search
export { useSearch, useSearchSuggestions, useDebouncedSearch } from './useSearch';

// Stats & Recommendations
export { usePlatformStats, useStatsLeaderboard, useActivityFeed, useRecommendations, useTrending } from './useStats';

// Utilities
export { default as useClickOutside } from './useClickOutside';
export { default as useResponsive } from './useResponsive';
