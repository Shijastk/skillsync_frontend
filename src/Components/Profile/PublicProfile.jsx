import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
    MapPin, Calendar, Star, Trophy, Code2, Database,
    Palette, Cloud, BarChart3, Container, FileCode,
    MessageCircle, Share2
} from 'lucide-react';
import {
    Avatar, Badge, Button, Card, Rating, Tabs
} from '../common';
import RequestSwapModal from '../modals/RequestSwapModal';
import LoadingSpinner from '../common/LoadingSpinner';

import { useAuthContext } from '../../context/AuthContext';
import { useUser } from '../../hooks/useUsers';
import { useUserSwaps } from '../../hooks/useSwaps';

/**
 * PublicProfile - View other users' profiles
 * Displays:
 * - User information
 * - Skills they can teach
 * - Skills they want to learn
 * - Portfolio
 * - Stats and achievements
 * - Option to request a swap
 */
const PublicProfile = () => {
    const { userId } = useParams();
    const { user: currentUser } = useAuthContext();

    // Fetch user data
    const { data: userData, isLoading: isLoadingUser } = useUser(userId);
    const { data: swapsData } = useUserSwaps();

    // State
    const [activeTab, setActiveTab] = useState('overview');
    const [showSwapModal, setShowSwapModal] = useState(false);

    // Transform user data for UI
    const user = useMemo(() => {
        if (!userData) return null;

        return {
            id: userData.id,
            name: userData.firstName ? `${userData.firstName} ${userData.lastName}` : userData.name,
            initials: (userData.firstName?.[0] || 'U') + (userData.lastName?.[0] || 'U'),
            title: userData.bio ? userData.bio.split('.')[0] : 'Skill Swapper',
            location: userData.location || 'Remote',
            joinDate: userData.joinedDate ? new Date(userData.joinedDate).toLocaleDateString() : '2024',
            bio: userData.bio || 'No bio available.',

            // Skills
            skillsOffer: {
                'Expertise': (userData.skillsToTeach || []).map(s => s.title || s.name)
            },
            skillsLearn: {
                'Interests': (userData.skillsToLearn || []).map(s => s.title || s.name)
            },

            // Portfolio
            portfolio: userData.portfolio || [],

            // Badges
            badges: userData.badges || [],

            // Stats
            stats: {
                totalSwaps: userData.totalSwaps || 0,
                rating: userData.rating || 5.0,
                completedSwaps: userData.completedSwaps || 0,
                successRate: userData.totalSwaps > 0
                    ? Math.round((userData.completedSwaps / userData.totalSwaps) * 100)
                    : 100
            }
        };
    }, [userData]);

    // Check if there's an active swap with this user
    const activeSwap = useMemo(() => {
        if (!swapsData || !currentUser || !userId) return null;
        return swapsData.find(s =>
            (String(s.receiverId) === String(userId) || String(s.requesterId) === String(userId)) &&
            ['pending', 'active', 'accepted', 'scheduled', 'in-progress'].includes(s.status)
        );
    }, [swapsData, userId, currentUser]);

    // Loading state
    if (isLoadingUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // Not found state
    if (!userData && !isLoadingUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
                    <p className="text-gray-600">The user you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'skills', label: 'Skills' },
        { id: 'portfolio', label: 'Portfolio' },
        { id: 'achievements', label: 'Achievements' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Profile Header */}
                    <Card className="mb-6 shadow-lg border-gray-100">
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center mb-8">
                            <div className="relative">
                                <Avatar
                                    name={user?.name}
                                    initials={user?.initials}
                                    size="2xl"
                                    showStatus={true}
                                    status="online"
                                    className="ring-4 ring-white shadow-md"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                </div>
                            </div>

                            <div className="flex-1 w-full">
                                <div className="mb-2">
                                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                                        {user?.name}
                                    </h1>
                                    <p className="text-base text-gray-600 mt-1 font-medium">{user?.title}</p>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 mb-6">
                                    <div className="flex items-center gap-1.5 text-sm">
                                        <MapPin size={14} className="text-gray-400" />
                                        <span className="text-gray-600">{user?.location}</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                    <div className="text-sm text-gray-500">
                                        Member since <span className="text-gray-700 font-medium">{user?.joinDate}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                                    {activeSwap ? (
                                        <Button
                                            variant="secondary"
                                            className="bg-gray-100 border-gray-300 text-gray-600 shadow-sm"
                                            disabled
                                        >
                                            <MessageCircle className="w-4 h-4 mr-1" />
                                            Swap Pending
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            className="bg-black hover:bg-gray-800 text-white border-black shadow-sm hover:shadow-md transition-all duration-200"
                                            onClick={() => setShowSwapModal(true)}
                                        >
                                            <MessageCircle className="w-4 h-4 mr-1" />
                                            Start Swap
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                    >
                                        <MessageCircle className="w-4 h-4 mr-1" />
                                        Message
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                    >
                                        <Share2 className="w-4 h-4 mr-1" />
                                        Share
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
                            <div className="text-center lg:text-left">
                                <p className="text-2xl lg:text-3xl font-bold text-gray-900">{user.stats.totalSwaps}</p>
                                <p className="text-sm text-gray-500 mt-1">Total Swaps</p>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-2">
                                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">{user.stats.rating}</p>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Rating</p>
                            </div>
                            <div className="text-center lg:text-left">
                                <p className="text-2xl lg:text-3xl font-bold text-gray-900">{user.stats.completedSwaps}</p>
                                <p className="text-sm text-gray-500 mt-1">Completed</p>
                            </div>
                            <div className="text-center lg:text-left">
                                <p className="text-2xl lg:text-3xl font-bold text-gray-900">{user.stats.successRate}%</p>
                                <p className="text-sm text-gray-500 mt-1">Success Rate</p>
                            </div>
                        </div>
                    </Card>

                    {/* Tabs */}
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                    {/* Tab Content */}
                    <div className="mt-6">
                        {activeTab === 'overview' && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Skills They Can Teach */}
                                <Card>
                                    <h2 className="text-xl font-bold mb-4">Skills They Can Teach</h2>
                                    <div className="space-y-2">
                                        {user.skillsOffer.Expertise?.map((skill, index) => (
                                            <Badge key={index} variant="primary">
                                                {skill}
                                            </Badge>
                                        ))}
                                        {(!user.skillsOffer.Expertise || user.skillsOffer.Expertise.length === 0) && (
                                            <p className="text-gray-500">No skills listed</p>
                                        )}
                                    </div>
                                </Card>

                                {/* Skills They Want to Learn */}
                                <Card>
                                    <h2 className="text-xl font-bold mb-4">Skills They Want to Learn</h2>
                                    <div className="space-y-2">
                                        {user.skillsLearn.Interests?.map((skill, index) => (
                                            <Badge key={index} variant="secondary">
                                                {skill}
                                            </Badge>
                                        ))}
                                        {(!user.skillsLearn.Interests || user.skillsLearn.Interests.length === 0) && (
                                            <p className="text-gray-500">No learning goals listed</p>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'portfolio' && (
                            <Card>
                                <h2 className="text-xl font-bold mb-4">Portfolio</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {user.portfolio?.map((project, index) => (
                                        <div key={index} className="border rounded-lg p-4">
                                            <h3 className="font-semibold">{project.title}</h3>
                                            <p className="text-sm text-gray-600">{project.description}</p>
                                            {project.link && (
                                                <a
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                                                >
                                                    View Project →
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                    {(!user.portfolio || user.portfolio.length === 0) && (
                                        <p className="text-gray-500 col-span-2">No projects to display</p>
                                    )}
                                </div>
                            </Card>
                        )}

                        {activeTab === 'achievements' && (
                            <Card>
                                <h2 className="text-xl font-bold mb-4">Achievements</h2>
                                {user.badges && user.badges.length > 0 ? (
                                    <div className="grid md:grid-cols-3 gap-4">
                                        {user.badges.map((badge, index) => (
                                            <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                                <Trophy className="w-8 h-8 text-yellow-500" />
                                                <div>
                                                    <h3 className="font-semibold">{badge.name}</h3>
                                                    <p className="text-sm text-gray-600">{badge.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No achievements yet</p>
                                )}
                            </Card>
                        )}
                    </div>
                </div>
            </main>

            {/* Request Swap Modal */}
            {showSwapModal && (
                <RequestSwapModal
                    isOpen={showSwapModal}
                    onClose={() => setShowSwapModal(false)}
                    targetUser={user}
                />
            )}
        </div>
    );
};

export default PublicProfile;
