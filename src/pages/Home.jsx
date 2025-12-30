import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useUserSwaps, useUpdateSwap } from '../hooks/useSwaps';
import { useUsers } from '../hooks/useUsers';
import { usePosts, useLikePost } from '../hooks/usePosts';
import { useRecommendations, useTrending } from '../hooks/useRecommendations';
import LeftSidebar from '../Components/Home/LeftSidebar';
import PostCard from '../Components/Home/PostCard';
import RightSidebar from '../Components/Home/RightSidebar';
import RequestSwapModal from '../Components/modals/RequestSwapModal';
import OnboardingModal from '../Components/modals/OnboardingModal';
import { CATEGORIES } from "../data/constants";
import LoadingSpinner from '../Components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';


const Home = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("for-you");
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [view, setView] = useState();
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);

  // Real Data Hooks
  const { user: currentUser } = useAuthContext();
  const { data: userSwaps, isLoading: isLoadingSwaps } = useUserSwaps(currentUser?.id);
  const { data: usersData, isLoading: isLoadingUsers } = useUsers(); // Keep for fallback lookups
  const { data: postsData, isLoading: isLoadingPosts } = usePosts(); // Now fetches personalized feed

  // New Optimized Hooks
  const { data: recommendationsData, isLoading: isLoadingRecs } = useRecommendations('users', 10);
  const { data: trendingSkillsData, isLoading: isLoadingTrending } = useTrending('skills');

  const likePostMutation = useLikePost();
  const updateSwapMutation = useUpdateSwap();
  const { success, info } = useToast();

  const handleLike = (postId) => {
    const isCurrentlyLiked = likedPosts.has(postId);

    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      isCurrentlyLiked ? newSet.delete(postId) : newSet.add(postId);
      return newSet;
    });

    // Backend Sync for Community Posts
    if (String(postId).startsWith('post-')) {
      const realId = String(postId).split('-')[1];
      // Backend like endpoint toggles like automatically
      likePostMutation.mutate(realId);
    }
  };


  const handleSave = (postId) => {
    const isSaved = savedPosts.has(postId);
    setSavedPosts((prev) => {
      const newSet = new Set(prev);
      isSaved ? newSet.delete(postId) : newSet.add(postId);
      return newSet;
    });

    if (isSaved) {
      info("Post removed from saved");
    } else {
      success("Post saved to collection");
    }
  };

  const handleReport = (postId) => {
    info("Post reported to moderators");
  };

  const handleSwap = (post) => {
    setSelectedPost(post);
    setShowSwapModal(true);
  };

  // Derived State
  const feedData = useMemo(() => {
    if (!postsData) return [];

    const feed = [];

    // 1. Generate Swap Offers from Backend Recommendations
    const potentialPartners = recommendationsData?.recommendations?.slice(0, 5) || [];

    potentialPartners.forEach(u => {
      const initials = (u.firstName?.[0] || '') + (u.lastName?.[0] || '');
      const colors = ["from-indigo-500 to-purple-600", "from-emerald-500 to-teal-600", "from-rose-500 to-pink-600", "from-amber-500 to-orange-600"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const existingSwap = userSwaps?.find(s =>
        (String(s.receiverId) === String(u._id) ||
          String(s.requesterId) === String(u._id) ||
          String(s.recipientId) === String(u._id)) &&
        ['pending', 'active', 'accepted', 'scheduled', 'in-progress'].includes(s.status)
      );

      feed.push({
        id: `swap-${u._id}`,
        userId: u._id,
        avatar: { initials: initials || '?', color: color },
        user: `${u.firstName} ${u.lastName}`,
        role: u.bio ? u.bio.split('.')[0] : "Community Member",
        time: "Recommended for you",
        type: "swap",
        status: "Active",
        content: u.bio || `Hi, I'm ${u.firstName}. I can teach you ${u.skillsToTeach?.[0]?.title || 'skills'}!`,
        teaches: (u.skillsToTeach || []).map(s => s.title),
        wants: (u.skillsToLearn || []).map(s => s.title),
        metrics: {
          views: 10 + Math.floor((u.matchScore || 0) * 1.5),
          requests: Math.floor((u.matchScore || 0) / 15),
          likes: Math.floor(Math.random() * 50),
          comments: 0
        },
        matchScore: (typeof u.matchScore === 'number') ? u.matchScore : 85,
        distance: u.location || "Remote",
        duration: "1h sessions",
        isOnline: Math.random() > 0.5,
        hasActiveSwap: !!existingSwap,
        swapStatus: existingSwap?.status
      });
    });

    // 2. Add Community Posts from Backend (Personalized Feed)
    postsData.forEach(p => {
      // Handle author - backend returns populated author object
      const authorName = p.author && typeof p.author === 'object'
        ? `${p.author.firstName} ${p.author.lastName}`
        : (p.author || 'Unknown');
      const initials = p.author && typeof p.author === 'object'
        ? (p.author.firstName?.[0] || '') + (p.author.lastName?.[0] || '')
        : '??';

      // Get authorId - could be in author._id or authorId field
      const authorId = p.author && typeof p.author === 'object'
        ? p.author._id || p.author.id
        : p.authorId;

      const existingSwap = userSwaps?.find(s =>
        (String(s.receiverId) === String(authorId) ||
          String(s.requesterId) === String(authorId) ||
          String(s.recipientId) === String(authorId)) &&
        ['pending', 'active', 'accepted', 'scheduled', 'in-progress'].includes(s.status)
      );

      // Format timestamp
      const postTime = p.createdAt || p.timestamp;
      const timeAgo = postTime ? (() => {
        const date = new Date(postTime);
        const diff = (new Date() - date) / 1000; // seconds
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return date.toLocaleDateString();
      })() : 'Just now';

      feed.push({
        id: `post-${p._id || p.id}`,
        userId: authorId,
        avatar: { initials: initials, color: "from-blue-500 to-cyan-600" },
        user: authorName,
        role: "Community Member",
        time: timeAgo,
        type: "post",                          // ✅ Regular post, not forced to success
        content: p.content,
        image: p.image || null,                // Image from backend
        metrics: {
          likes: Array.isArray(p.likes) ? p.likes.length : (p.likes || 0),
          comments: p.comments?.length || 0
        },
        hasActiveSwap: !!existingSwap,
        swapStatus: existingSwap?.status
      });
    });

    // 3. Fallback / Inject Mock Data if Feed is too empty (Better UX)
    if (feed.length < 3) {
      const mockPosts = [
        {
          id: 'mock-1',
          userId: 'system-1',
          avatar: { initials: 'SW', color: 'from-purple-500 to-indigo-500' },
          user: 'SkillSwap Team',
          role: 'Admin',
          time: 'Pinned',
          type: 'post',
          content: 'Welcome to SkillSwap! 🚀 Start by searching for a skill you want to learn, or complete your profile to get better recommendations. The more you interact, the better your feed gets!',
          metrics: { likes: 120, comments: 45 },
          hasActiveSwap: false
        },
        {
          id: 'mock-2',
          userId: 'system-2',
          avatar: { initials: 'AI', color: 'from-blue-500 to-cyan-500' },
          user: 'Aisha I.',
          role: 'Community Guide',
          time: '2h ago',
          type: 'success',
          content: 'Just had my first successful swap session! Teaching Python in exchange for Guitar lessons was easier than I thought. #SkillSwapSuccess',
          learned: 'Guitar Basics',
          outcome: 'Played my first chord!',
          metrics: { likes: 85, comments: 12 },
          hasActiveSwap: false
        },
        {
          id: 'mock-3',
          userId: 'system-3',
          avatar: { initials: 'MK', color: 'from-green-500 to-emerald-500' },
          user: 'Mike K.',
          role: 'Design Mentor',
          time: '4h ago',
          type: 'swap',
          content: 'Hey everyone! I am looking to improve my public speaking skills. I have 5 years of experience in UI/UX Design to offer in return. Let\'s connect!',
          teaches: ['UI/UX Design', 'Figma'],
          wants: ['Public Speaking', 'Communication'],
          metrics: { views: 45, requests: 3 },
          matchScore: 92,
          hasActiveSwap: false
        }
      ];
      feed.push(...mockPosts);
    }

    return feed.sort(() => 0.5 - Math.random());

  }, [postsData, recommendationsData, currentUser, userSwaps]);

  const upcomingSessions = useMemo(() => {
    if (!userSwaps) return [];
    return userSwaps
      .filter(s => s.status === 'scheduled')
      .map(s => ({
        id: s.id,
        partnerName: s.recipientId === currentUser?.id ? (s.requester?.firstName || 'Partner') : (s.recipient?.firstName || 'Partner'),
        partnerAvatar: "P",
        topic: s.skillRequested || "Session",
        time: new Date(s.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(s.scheduledDate).toLocaleDateString(),
        isVideo: true
      }));
  }, [userSwaps, currentUser]);

  const incomingRequests = useMemo(() => {
    if (!userSwaps || !currentUser) return [];

    // Filter incoming requests where current user is recipient
    return userSwaps
      .filter(s => {
        const isRecipient = String(s.recipient._id || s.recipientId) === String(currentUser._id || currentUser.id);
        return s.status === 'pending' && isRecipient;
      })
      .map(s => {
        // Extract partner data from swap object (backend sends full user objects)
        let partner = s.requester || {};

        const partnerName = partner.firstName ? `${partner.firstName} ${partner.lastName}` : 'Unknown';

        return {
          id: s._id || s.id,
          fromUser: partnerName,
          fromUserAvatar: partner.avatar,
          fromUserRole: partner.bio ? partner.bio.substring(0, 20) + '...' : "Member",
          offering: s.skillOffered,
          requesting: s.skillRequested,
          status: 'pending'
        };
      });
  }, [userSwaps, currentUser]);


  // Suggested Mentors - From Real Backend Recommendations
  const suggestedMentors = useMemo(() => {
    if (!recommendationsData?.recommendations) return [];

    // Take next 3 recommendations (after the ones used in feed)
    return recommendationsData.recommendations
      .slice(5, 8)
      .map(u => ({
        id: u._id,
        name: `${u.firstName} ${u.lastName}`,
        firstName: u.firstName,
        lastName: u.lastName,
        avatar: u.avatar,
        bio: u.bio,
        role: u.bio ? u.bio.split('.')[0] : 'Skill Swapper',
        rating: 4.5 + (u.matchScore ? u.matchScore / 20 : 0),
        initials: `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`,
        teaches: (u.skillsToTeach || []).map(s => s.title)
      }));
  }, [recommendationsData]);

  // Trending Skills - From Real Backend Data
  const trendingSkills = useMemo(() => {
    if (!trendingSkillsData?.trending) return [];
    return trendingSkillsData.trending.map(t => ({
      name: t._id,
      learners: t.count
    }));
  }, [trendingSkillsData]);

  const currentUserForSidebar = {
    name: currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest',
    role: currentUser?.role || "Community Member",
    initials: currentUser?.firstName ? currentUser.firstName[0] + currentUser.lastName[0] : 'G',
    stats: {
      activeSwaps: userSwaps?.filter(s => s.status === 'active' || s.status === 'in-progress').length || 0,
      completed: userSwaps?.filter(s => s.status === 'completed').length || 0,
      rating: "5.0",
      successRate: currentUser?.completedSwaps > 0 ? "100%" : "New",
      streak: currentUser?.loginStreak || 0,
      level: currentUser?.level || 1,
      nextLevelProgress: currentUser?.xp || 0
    },
    interests: (currentUser?.skillsToLearn || []).map(s => s.title),
    recentConnections: [],
    teaches: (currentUser?.skillsToTeach || []).map(s => s.title),
    learns: (currentUser?.skillsToLearn || []).map(s => s.title)
  };

  // Filter feed data based on active category
  const filteredFeed = useMemo(() => {
    if (activeCategory === 'for-you') return feedData;
    if (activeCategory === 'swaps') return feedData.filter(p => p.type === 'swap');
    if (activeCategory === 'success-stories') return feedData.filter(p => p.type === 'success');
    if (activeCategory === 'tips') return feedData.filter(p => p.type === 'tip');
    return feedData;
  }, [feedData, activeCategory]);

  // Navigation handlers
  const handleNavigate = (destination) => {
    if (destination === 'messages') {
      navigate('/messages');
    } else if (destination === 'discover') {
      navigate('/discover');
    } else if (destination === 'my-swaps') {
      navigate('/my-swaps');
    } else if (destination === 'groups') {
      navigate('/groups');
    }
  };

  const handleScheduleClick = (sessionId) => {
    info('Schedule feature coming soon!');
  };

  const handleMentorClick = (mentorId) => {
    navigate(`/profile/${mentorId}`);
  };

  const handleAcceptSwap = async (swapId) => {
    try {
      await updateSwapMutation.mutateAsync({
        id: swapId,
        data: { status: 'accepted' }
      });
      success('Swap request accepted! 🎉');
    } catch (error) {
      info('Failed to accept swap request');
    }
  };

  const handleDeclineSwap = async (swapId) => {
    try {
      await updateSwapMutation.mutateAsync({
        id: swapId,
        data: { status: 'rejected' }
      });
      info('Swap request declined');
    } catch (error) {
      info('Failed to decline swap request');
    }
  };

  if (isLoadingSwaps || isLoadingUsers || isLoadingPosts || isLoadingRecs || isLoadingTrending) return <LoadingSpinner />;

  return (
    <main className="max-w-[1600px] mx-auto  pb-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (3) */}
        <div className="hidden lg:block lg:col-span-3">
          <LeftSidebar
            user={currentUserForSidebar}
            upcomingSessions={upcomingSessions}
            onNavigate={handleNavigate}
            onScheduleClick={handleScheduleClick}
          />
        </div>

        {/* Center Column (6) - Feed */}
        <div className="lg:col-span-6 space-y-6">
          {/* Mobile Search - Visible only on small screens */}
          <div className="md:hidden mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-4 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="sticky top-20 z-40 mx-4 px-4 sm:mx-0 sm:px-0 bg-[#F8FAFC]/95 backdrop-blur-sm py-2">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide p-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${isActive
                      ? "bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/20 transform scale-105"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <Icon size={16} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {filteredFeed.length > 0 ? filteredFeed.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isLiked={likedPosts.has(post.id)}
                isSaved={savedPosts.has(post.id)}
                onLike={handleLike}
                onSave={handleSave}

                onSwap={handleSwap}
                onReport={handleReport}
                hasActiveSwap={post.hasActiveSwap}
                swapStatus={post.swapStatus}
              />
            )) : (
              <div className="text-center py-10 opacity-60">
                <p>No posts available in this category. Try another filter!</p>
              </div>
            )}
          </div>

          <div className="flex justify-center py-8">
            {/* Load More Trigger could go here */}
          </div>
        </div>

        {/* Right Column (3) */}
        <div className="hidden lg:block lg:col-span-3">
          <RightSidebar
            trendingSkills={trendingSkills}
            incomingRequests={incomingRequests}
            suggestedMentors={suggestedMentors}
            onMentorClick={handleMentorClick}
            onAcceptSwap={handleAcceptSwap}
            onDeclineSwap={handleDeclineSwap}
          />
        </div>
      </div>

      {/* Request Swap Modal */}
      {showSwapModal && selectedPost && (
        <RequestSwapModal
          isOpen={showSwapModal}
          onClose={() => setShowSwapModal(false)}
          targetUser={{
            id: selectedPost.userId,
            name: selectedPost.user,
            role: selectedPost.role,
            rating: 4.9,
            swaps: 10,
            location: selectedPost.distance || "Remote",
            initials: selectedPost.avatar.initials,
            teaches: selectedPost.teaches,
            wants: selectedPost.wants
          }}
        />
      )}

      {/* Onboarding Modal - Auto-triggers if user profile is incomplete */}
      <OnboardingModal
        isOpen={currentUser && (!currentUser.skillsToTeach || currentUser.skillsToTeach.length === 0) && !onboardingDismissed}
        onClose={() => setOnboardingDismissed(true)}
      />
    </main>
  );
};

export default Home;
