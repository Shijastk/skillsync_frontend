import React, { useState, useMemo } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useUserSwaps } from '../hooks/useSwaps';
import { useUsers } from '../hooks/useUsers';
import { usePosts, useLikePost } from '../hooks/usePosts';
import LeftSidebar from '../Components/Home/LeftSidebar';
import PostCard from '../Components/Home/PostCard';
import RightSidebar from '../Components/Home/RightSidebar';
import RequestSwapModal from '../Components/modals/RequestSwapModal';
import OnboardingModal from '../Components/modals/OnboardingModal';
import { CATEGORIES, TRENDING_SKILLS } from "../data/constants";
import LoadingSpinner from '../Components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

const Home = () => {
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
  const { data: usersData, isLoading: isLoadingUsers } = useUsers();
  const { data: postsData, isLoading: isLoadingPosts } = usePosts();
  const likePostMutation = useLikePost();
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
      const post = postsData?.find(p => String(p.id) === realId);

      if (post) {
        const newLikes = (post.likes || 0) + (isCurrentlyLiked ? -1 : 1);
        likePostMutation.mutate({ id: realId, likes: Math.max(0, newLikes) });
      }
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
    if (!usersData || !postsData) return [];

    const feed = [];

    // 1. Generate Swap Offers from Users
    const potentialPartners = usersData
      .filter(u => u.id !== currentUser?.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    potentialPartners.forEach(u => {
      const initials = (u.firstName?.[0] || '') + (u.lastName?.[0] || '');
      const colors = ["from-indigo-500 to-purple-600", "from-emerald-500 to-teal-600", "from-rose-500 to-pink-600", "from-amber-500 to-orange-600"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const existingSwap = userSwaps?.find(s =>
        (String(s.receiverId) === String(u.id) || String(s.requesterId) === String(u.id)) &&
        ['pending', 'active', 'accepted', 'scheduled', 'in-progress'].includes(s.status)
      );

      feed.push({
        id: `swap-${u.id}`,
        userId: u.id,
        avatar: { initials: initials || '?', color: color },
        user: `${u.firstName} ${u.lastName}`,
        role: u.bio ? u.bio.split('.')[0] : "Community Member",
        time: "Just now",
        type: "swap",
        status: "Active",
        content: u.bio || `Hi, I'm ${u.firstName}. I can teach you ${u.skillsToTeach?.[0]?.name || 'skills'}!`,
        teaches: (u.skillsToTeach || []).map(s => s.name),
        wants: (u.skillsToLearn || []).map(s => s.name),
        metrics: {
          views: Math.floor(Math.random() * 100),
          requests: Math.floor(Math.random() * 10),
          likes: Math.floor(Math.random() * 50),
          comments: 0
        },
        matchScore: 85 + Math.floor(Math.random() * 15),
        distance: u.location || "Remote",
        duration: "1h sessions",
        isOnline: Math.random() > 0.5,
        hasActiveSwap: !!existingSwap,
        swapStatus: existingSwap?.status
      });
    });

    // 2. Add Community Posts
    postsData.forEach(p => {
      const initials = p.author ? p.author.split(' ').map(n => n[0]).join('') : '??';

      const existingSwap = userSwaps?.find(s =>
        (String(s.receiverId) === String(p.authorId) || String(s.requesterId) === String(p.authorId)) &&
        ['pending', 'active', 'accepted', 'scheduled', 'in-progress'].includes(s.status)
      );

      feed.push({
        id: `post-${p.id}`,
        userId: p.authorId,
        avatar: { initials: initials, color: "from-blue-500 to-cyan-600" },
        user: p.author,
        role: "Community Member",
        time: new Date(p.timestamp).toLocaleDateString(),
        type: "success",
        content: p.content,
        learned: "New Skills",
        outcome: "Knowledge shared",
        verified: true,
        metrics: { likes: p.likes || 0, comments: p.comments?.length || 0 },
        hasActiveSwap: !!existingSwap,
        swapStatus: existingSwap?.status
      });
    });

    return feed.sort(() => 0.5 - Math.random());

  }, [usersData, postsData, currentUser, userSwaps]);

  const upcomingSessions = useMemo(() => {
    if (!userSwaps) return [];
    return userSwaps
      .filter(s => s.status === 'scheduled')
      .map(s => ({
        id: s.id,
        partnerName: "Partner", // Should fetch from ID, but quick mock for layout
        partnerAvatar: "P",
        topic: s.skillRequested || "Session",
        time: new Date(s.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(s.scheduledDate).toLocaleDateString(),
        isVideo: true
      }));
  }, [userSwaps]);

  const incomingRequests = useMemo(() => {
    if (!userSwaps) return [];
    // Need user details so finding partner from usersData
    return userSwaps
      .filter(s => s.status === 'pending' && String(s.receiverId) === String(currentUser?.id))
      .map(s => {
        const partner = usersData?.find(u => String(u.id) === String(s.requesterId)) || {};
        return {
          id: s.id,
          fromUser: partner.firstName ? `${partner.firstName} ${partner.lastName}` : "Unknown",
          fromUserRole: partner.bio ? partner.bio.substring(0, 20) + '...' : "Member",
          offering: s.skillOffered,
          requesting: s.skillRequested,
          status: 'pending'
        };
      });
  }, [userSwaps, usersData, currentUser]);

  const currentUserForSidebar = {
    name: currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest',
    role: currentUser?.role || "Community Member",
    initials: currentUser?.firstName ? currentUser.firstName[0] + currentUser.lastName[0] : 'G',
    stats: {
      activeSwaps: userSwaps?.filter(s => s.status === 'active' || s.status === 'in-progress').length || 0,
      completed: userSwaps?.filter(s => s.status === 'completed').length || 0,
      rating: currentUser?.rating || "New",
      successRate: currentUser?.swapsCompleted ? "100%" : "0%",
      streak: currentUser?.streak || 0,
      level: currentUser?.level || 1,
      nextLevelProgress: currentUser?.xp || 0
    },
    interests: (currentUser?.skillsToLearn || []).map(s => s.name),
    recentConnections: [],
    teaches: (currentUser?.skillsToTeach || []).map(s => s.name),
    learns: (currentUser?.skillsToLearn || []).map(s => s.name)
  };

  if (isLoadingSwaps || isLoadingUsers || isLoadingPosts) return <LoadingSpinner />;

  return (
    <main className="max-w-[1600px] mx-auto  pb-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (3) */}
        <div className="hidden lg:block lg:col-span-3">
          <LeftSidebar
            user={currentUserForSidebar}
            upcomingSessions={upcomingSessions}
            onNavigate={setView}
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
            {feedData.length > 0 ? feedData.map((post) => (
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
                <p>No posts available yet. Join the community!</p>
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
            trendingSkills={TRENDING_SKILLS}
            incomingRequests={incomingRequests}
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
