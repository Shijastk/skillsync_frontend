import React, { useState } from "react";
import {
    Users,
    Calendar,
    MessageCircle,
    Heart,
    Plus,
    Send,
    X,
    Clock,
    User,
    TrendingUp,
    Search,
    BookOpen,
} from "lucide-react";
import { usePosts, useCreatePost, useAddComment, useLikePost } from '../hooks/usePosts';
import { useAuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../Components/common/LoadingSpinner';

const SkillSwapCommunityPage = () => {
    const { user: currentUser } = useAuthContext();
    const { success, error } = useToast();
    const { data: postsData, isLoading } = usePosts();
    const createPostMutation = useCreatePost();
    const addCommentMutation = useAddComment();
    const likePostMutation = useLikePost();

    const posts = postsData || [];

    const [newPostContent, setNewPostContent] = useState("");
    const [replyContents, setReplyContents] = useState({});
    const [expandedComments, setExpandedComments] = useState({});

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (newPostContent.trim()) {
            const newPost = {
                author: currentUser.name || "Anonymous",
                authorId: currentUser.id,
                avatar: currentUser.avatar || null,
                content: newPostContent,
                timestamp: new Date().toISOString(),
                likes: 0,
                comments: [],
            };

            try {
                await createPostMutation.mutateAsync(newPost);
                setNewPostContent("");
                success("Post shared successfully!");
            } catch (err) {
                error("Failed to create post");
                console.error("Failed to create post", err);
            }
        }
    };

    const handleAddComment = async (postId, commentContent) => {
        if (commentContent.trim()) {
            const newComment = {
                id: Date.now(), // Generate ID
                author: currentUser.name || "Anonymous",
                authorId: currentUser.id,
                content: commentContent,
                timestamp: new Date().toISOString(),
            };

            try {
                await addCommentMutation.mutateAsync({ postId, comment: newComment });
                setReplyContents((prev) => ({ ...prev, [postId]: "" }));
                success("Comment added!");
            } catch (err) {
                error("Failed to add comment");
                console.error("Failed to add comment", err);
            }
        }
    };

    const toggleComments = (postId) => {
        setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
    };

    const handleLike = (post) => {
        likePostMutation.mutate({ id: post.id, likes: (post.likes || 0) + 1 });
    };

    const formatTime = (isoString) => {
        if (!isoString) return 'Just now';
        const date = new Date(isoString);
        // Simple relative time check
        const now = new Date();
        const diff = (now - date) / 1000; // seconds
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
        return date.toLocaleDateString();
    };

    const trendingTopics = [
        "React",
        "UI/UX Design",
        "Python",
        "Mentorship",
        "Figma",
    ];
    const popularSkills = [
        "Frontend Development",
        "Graphic Design",
        "Data Analysis",
        "Public Speaking",
    ];

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-white text-black">
            {/* Header */}
            <div className="border-b border-gray-300">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold">SkillSwap Community</h1>
                        </div>
                        <button className="px-4 py-2 border border-black text-black rounded-lg font-medium hover:bg-gray-50 transition-colors">
                            Profile
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content - Posts Feed */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Create Post Section */}
                        <form
                            onSubmit={handleCreatePost}
                            className="bg-gray-50 p-6 rounded-xl border border-gray-300"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <textarea
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="Share your skill swap story, ask for advice, or offer help..."
                                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none resize-none bg-white"
                                    rows={3}
                                    maxLength={500}
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">
                                    {newPostContent.length}/500
                                </span>
                                <button
                                    type="submit"
                                    disabled={!newPostContent.trim() || createPostMutation.isPending}
                                    className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 disabled:bg-gray-300 transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    {createPostMutation.isPending ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </form>

                        {/* Posts Feed */}
                        <div className="space-y-6">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-white border border-gray-300 rounded-xl overflow-hidden"
                                >
                                    {/* Post Header */}
                                    <div className="p-6 border-b border-gray-300">
                                        <div className="flex items-start gap-4 mb-3">
                                            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-sm">
                                                    {post.author && typeof post.author === 'object'
                                                        ? `${post.author.firstName} ${post.author.lastName}`
                                                        : (post.author || 'Anonymous')}
                                                    {post.author?.level && (
                                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            Lvl {post.author.level}
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    {formatTime(post.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">
                                            {post.content}
                                        </p>
                                    </div>

                                    {/* Post Actions */}
                                    <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <button
                                                onClick={() => handleLike(post)}
                                                className="flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors"
                                            >
                                                <Heart className="w-4 h-4" />
                                                {post.likes || 0}
                                            </button>
                                            <button
                                                onClick={() => toggleComments(post.id)}
                                                className="flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                {post.comments ? post.comments.length : 0}
                                            </button>
                                        </div>
                                        <span className="text-xs text-gray-500">...</span>
                                    </div>

                                    {/* Comments Section */}
                                    {expandedComments[post.id] && (
                                        <div className="space-y-4">
                                            {/* Comments List */}
                                            {(post.comments || []).map((comment) => (
                                                <div
                                                    key={comment.id}
                                                    className="px-6 py-3 border-t border-gray-200"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <User className="w-4 h-4 text-white" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-medium text-sm">
                                                                    {comment.author && typeof comment.author === 'object'
                                                                        ? `${comment.author.firstName} ${comment.author.lastName}`
                                                                        : (comment.author || 'Anonymous')}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    <Clock className="w-3 h-3 inline mr-1" />
                                                                    {formatTime(comment.timestamp)}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-700">
                                                                {comment.content}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add Comment Form */}
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleAddComment(
                                                        post.id,
                                                        replyContents[post.id] || ""
                                                    );
                                                }}
                                                className="px-6 py-4 border-t border-gray-200"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <User className="w-4 h-4 text-white" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={replyContents[post.id] || ""}
                                                        onChange={(e) =>
                                                            setReplyContents((prev) => ({
                                                                ...prev,
                                                                [post.id]: e.target.value,
                                                            }))
                                                        }
                                                        placeholder="Add a comment..."
                                                        className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none bg-white"
                                                    />
                                                    <button
                                                        type="submit"
                                                        disabled={!(replyContents[post.id] || "").trim()}
                                                        className="p-2 text-gray-500 hover:text-black disabled:text-gray-300 transition-colors"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {posts.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                    No posts yet
                                </h3>
                                <p className="text-gray-500">
                                    Be the first to share your skill swap experience!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Trending Topics */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-300">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Trending Topics
                            </h2>
                            <div className="space-y-2">
                                {trendingTopics.map((topic, index) => (
                                    <a
                                        key={index}
                                        href="#"
                                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-white hover:text-black rounded-lg transition-colors"
                                    >
                                        #{topic}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Popular Skills */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-300">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Popular Skills
                            </h2>
                            <div className="space-y-2">
                                {popularSkills.map((skill, index) => (
                                    <a
                                        key={index}
                                        href="#"
                                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-white hover:text-black rounded-lg transition-colors"
                                    >
                                        {skill}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Search */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-300">
                            <h2 className="text-lg font-semibold mb-4">Quick Search</h2>
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search skills..."
                                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillSwapCommunityPage;
