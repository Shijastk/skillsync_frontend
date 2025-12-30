import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
    MapPin, Calendar, Star, Trophy, Code2, Database,
    Palette, Cloud, BarChart3, Container, FileCode,
    MessageCircle, Share2, Plus, Check, Edit2, Save, X
} from 'lucide-react';
import {
    Avatar, Badge, Button, Card, Rating, Tabs
} from '../common';
import AddSkillModal from '../modals/AddSkillModal';
import RequestSwapModal from '../modals/RequestSwapModal';
import PortfolioModal from '../modals/PortfolioModal';
import LoadingSpinner from '../common/LoadingSpinner';

import { useAuthContext } from '../../context/AuthContext';
import { useUser, useUpdateUser } from '../../hooks/useUsers';
import { useUserSwaps } from '../../hooks/useSwaps';
import { useQueryClient } from '@tanstack/react-query';

/**
 * UnifiedProfile - Single component for both own profile and public profiles
 * @param {Object} props
 * @param {boolean} props.isOwnProfile - Whether viewing own profile
 */
const UnifiedProfile = ({ isOwnProfile: propIsOwnProfile }) => {
    const { userId } = useParams();
    const { user: currentUser, updateUser } = useAuthContext();
    const queryClient = useQueryClient();

    // Determine if viewing own profile
    // Note: If userId param matches currentUser.id, it's also own profile
    const isOwnProfile = propIsOwnProfile || (userId && String(userId) === String(currentUser?.id));

    // Fetch data
    const targetUserId = isOwnProfile ? currentUser?.id : userId;
    const { data: userData, isLoading: isLoadingUser, refetch: refetchUser } = useUser(targetUserId);

    // Only fetch swaps for own profile (backend endpoint only returns current user's swaps)
    const { data: swapsData } = useUserSwaps();

    // Mutations
    const updateUserMutation = useUpdateUser();

    // State management
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [showSkillModal, setShowSkillModal] = useState(false);
    const [showLearningModal, setShowLearningModal] = useState(false);
    const [showSwapModal, setShowSwapModal] = useState(false);
    const [showPortfolioModal, setShowPortfolioModal] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [editingPortfolio, setEditingPortfolio] = useState(null);

    // Transform user data for UI
    const user = useMemo(() => {
        if (!userData) return null;

        return {
            id: userData.id,
            name: userData.firstName ? `${userData.firstName} ${userData.lastName}` : userData.name,
            initials: (userData.firstName?.[0] || 'U') + (userData.lastName?.[0] || 'U'),
            title: userData.bio ? userData.bio.split('.')[0] : 'Skill Swapper', // Simple title extraction
            location: userData.location || 'Remote',
            joinDate: userData.joinedDate ? new Date(userData.joinedDate).toLocaleDateString() : '2024',
            bio: userData.bio || 'No bio yet.',

            // Skills
            skillsOffer: {
                'Expertise': (userData.skillsToTeach || []).map(s => s.title || s.name) // Support both old and new schema
            },
            skillsLearn: {
                'Interests': (userData.skillsToLearn || []).map(s => s.title || s.name) // Support both old and new schema
            },

            // Portfolio (safeguard if missing in DB)
            portfolio: userData.portfolio || [],

            // Badges (safeguard)
            badges: userData.badges || [
                { name: 'Early Adopter', description: 'Joined in beta' }
            ],

            // Stats (Derived)
            stats: {
                totalSwaps: swapsData?.length || 0,
                rating: userData.rating || 5.0,
                hoursTaught: (swapsData?.filter(s => s.status === 'completed').length || 0) * 5, // Mock calc
                successRate: 100
            }
        };
    }, [userData, swapsData])
    console.log(user," user")

    const activeSwap = useMemo(() => {
        if (isOwnProfile || !swapsData || !currentUser) return null;
        return swapsData.find(s =>
            (String(s.receiverId) === String(currentUser.id) || String(s.requesterId) === String(currentUser.id)) &&
            ['pending', 'active', 'accepted', 'scheduled', 'in-progress'].includes(s.status)
        );
    }, [swapsData, currentUser, isOwnProfile]);

    const hasActiveSwap = !!activeSwap;
    const swapStatus = activeSwap?.status;

    // Handlers
    const handleStartEdit = () => {
        setEditForm({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            bio: userData.bio || '',
            location: userData.location || '',
            // If title is derived from bio split, we might want a dedicated field or just edit bio. 
            // For now assuming we edit bio and location. Name is split.
        });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditForm({});
    };

    const handleSaveProfile = async () => {
        try {
            await updateUserMutation.mutateAsync({
                id: userData.id,
                data: editForm
            });
            setIsEditing(false);

            // Sync AuthContext if needed
            if (isOwnProfile) {
                // Note: we can't use hook here inside function, but we have updateUser from calling useAuthContext earlier
                // Let's use the one from scope (needs to be added to destructuring above)
                updateUser({ ...currentUser, ...editForm });
            }
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile");
        }
    };

    // Reset editing state when navigating to clear conflicts
    React.useEffect(() => {
        setIsEditing(false);
        setEditForm({});
    }, [userId, targetUserId]);

    const handleInputChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSkillSave = async (skillData) => {
        try {
            // Import the usersService
            const { usersService } = await import('../../services/api');

            // Call the new API endpoint with all skill data
            await usersService.addSkillToTeach(skillData);

            // Invalidate queries - React Query will refetch automatically in background
            queryClient.invalidateQueries({ queryKey: ['user', targetUserId] });

            // If viewing own profile, sync AuthContext
            if (isOwnProfile) {
                queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            }

            setShowSkillModal(false);
            setEditingSkill(null);
        } catch (error) {
            console.error("Failed to add skill", error);
            alert(error.response?.data?.message || "Failed to add skill. Please try again.");
        }
    };

    const handleLearningGoalSave = async (skillData) => {
        try {
            // Import the usersService
            const { usersService } = await import('../../services/api');

            // Call the new API endpoint with all skill data
            await usersService.addSkillToLearn(skillData);

            // Invalidate queries - React Query will refetch automatically in background
            queryClient.invalidateQueries({ queryKey: ['user', targetUserId] });

            // If viewing own profile, sync AuthContext
            if (isOwnProfile) {
                queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            }

            setShowLearningModal(false);
        } catch (error) {
            console.error("Failed to add learning goal", error);
            alert(error.response?.data?.message || "Failed to add learning goal. Please try again.");
        }
    };

    const handlePortfolioSave = async (data) => {
        // data: { title, tech, ... }
        const newItem = {
            id: editingPortfolio ? editingPortfolio.id : Date.now(),
            ...data
        };

        let updatedPortfolio = userData.portfolio || [];
        if (editingPortfolio) {
            updatedPortfolio = updatedPortfolio.map(p => p.id === newItem.id ? newItem : p);
        } else {
            updatedPortfolio = [...updatedPortfolio, newItem];
        }

        try {
            await updateUserMutation.mutateAsync({
                id: userData.id,
                data: { portfolio: updatedPortfolio }
            });
            setShowPortfolioModal(false);
            setEditingPortfolio(null);
        } catch (error) {
            console.error("Failed to update portfolio", error);
        }
    };

    const handleEditSkill = (skillName, category) => {
        // Simplified: just passing name as object for now, modal expects object
        setEditingSkill({ skill: skillName });
        setShowSkillModal(true);
    };

    const handleEditPortfolio = (portfolio) => {
        setEditingPortfolio(portfolio);
        setShowPortfolioModal(true);
    };

    const handleAddPortfolio = () => {
        setEditingPortfolio(null);
        setShowPortfolioModal(true);
    };

    // Tabs configuration
    const tabs = [
        { id: 'overview', label: 'Overview', icon: Trophy },
        { id: 'skills', label: 'Skills', icon: Code2 },
        { id: 'portfolio', label: 'Portfolio', icon: Container },
        { id: 'badges', label: 'Badges', icon: Star },
    ];

    // Debug logging
    console.log('Profile Debug:', {
        isLoadingUser,
        userData,
        user,
        targetUserId,
        currentUser
    });

    if (isLoadingUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // Only show "not found" if we're not loading AND userData is null
    // (userData can be temporarily null during refetch)
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
                                    showStatus={!isOwnProfile}
                                    status="online"
                                    className="ring-4 ring-white shadow-md"
                                />
                                {!isOwnProfile && (
                                    <div className="absolute -bottom-2 -right-2 bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 w-full">
                                {isOwnProfile && isEditing ? (
                                    <div className="space-y-4  animate-in fade-in duration-200">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-gray-700 ml-1">First Name</label>
                                                <input
                                                    type="text"
                                                    value={editForm.firstName}
                                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm bg-white"
                                                    placeholder="First Name"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-gray-700 ml-1">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={editForm.lastName}
                                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm bg-white"
                                                    placeholder="Last Name"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-700 ml-1">Brief Bio / Title</label>
                                            <input
                                                type="text"
                                                value={editForm.bio}
                                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm bg-white"
                                                placeholder="e.g. Senior Developer specializing in React..."
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-700 ml-1">Location</label>
                                            <input
                                                type="text"
                                                value={editForm.location}
                                                onChange={(e) => handleInputChange('location', e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm bg-white"
                                                placeholder="e.g. New York, USA"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
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
                                    </>
                                )}

                                <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                                    {isOwnProfile ? (
                                        isEditing ? (
                                            <>
                                                <Button
                                                    variant="primary"
                                                    className="bg-black hover:bg-gray-800 text-white border-black shadow-sm hover:shadow-md transition-all duration-200"
                                                    leftIcon={<Save size={14} />}
                                                    onClick={handleSaveProfile}
                                                >
                                                    Save Changes
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                                    leftIcon={<X size={14} />}
                                                    onClick={handleCancelEdit}
                                                >
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="secondary"
                                                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
                                                    leftIcon={<Edit2 size={14} />}
                                                    onClick={handleStartEdit}
                                                >
                                                    Edit Profile
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    className="bg-black hover:bg-gray-800 text-white border-black shadow-sm hover:shadow-md"
                                                    leftIcon={<Plus size={14} />}
                                                    onClick={() => setShowSkillModal(true)}
                                                >
                                                    Add Skill
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                                    leftIcon={<Share2 size={14} />}
                                                >
                                                    Share Profile
                                                </Button>
                                            </>
                                        )
                                    ) : (
                                        <>
                                            <Button
                                                variant={hasActiveSwap ? "secondary" : "primary"}
                                                className={`${hasActiveSwap ?
                                                    'bg-gray-100 border-gray-300 text-gray-600' :
                                                    'bg-black hover:bg-gray-800 text-white border-black'
                                                    } shadow-sm hover:shadow-md transition-all duration-200`}
                                                onClick={() => !hasActiveSwap && setShowSwapModal(true)}
                                                disabled={hasActiveSwap}
                                                leftIcon={hasActiveSwap && <Check size={14} />}
                                            >
                                                {hasActiveSwap ? (swapStatus === 'pending' ? 'Request Sent' : 'Active Swap') : 'Start Swap'}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                                leftIcon={<MessageCircle size={14} />}
                                            >
                                                Message
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                leftIcon={<Share2 size={14} />}
                                            >
                                                Share
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="border-t border-gray-200 pt-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Total Swaps', value: user.stats.totalSwaps },
                                    { label: 'Rating', value: user.stats.rating },
                                    { label: 'Hours Taught', value: user.stats.hoursTaught },
                                    { label: 'Success Rate', value: `${user.stats.successRate}%` },
                                ].map((stat, idx) => (
                                    <div key={idx} className="text-center">
                                        <div className="text-2xl font-bold text-gray-900 mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Tabs */}
                    <Tabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                        variant="underline"
                        className="mb-6"
                    />

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* About */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        {user.bio}
                                    </p>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Location', value: user.location },
                                            { label: 'Language', value: 'English' }, // Mock
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex justify-between py-3 border-b border-gray-100">
                                                <span className="text-sm text-gray-500">{item.label}</span>
                                                <span className="text-sm font-medium text-gray-900">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Skills Preview</h2>
                                    <div className="space-y-4">
                                        <div className="font-semibold mb-2">Teaching</div>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.values(user.skillsOffer).flat().map((skill, idx) => (
                                                <Badge key={idx} variant="primary">{skill}</Badge>
                                            ))}
                                            {Object.values(user.skillsOffer).flat().length === 0 && <span className="text-gray-500 text-sm">No skills listed</span>}
                                        </div>
                                        <div className="font-semibold mb-2 mt-4">Learning</div>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.values(user.skillsLearn).flat().map((skill, idx) => (
                                                <Badge key={idx} variant="default">{skill}</Badge>
                                            ))}
                                            {Object.values(user.skillsLearn).flat().length === 0 && <span className="text-gray-500 text-sm">No interests listed</span>}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === 'skills' && (
                        <div className="space-y-6">
                            <Card>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Skills I Offer</h2>
                                    {isOwnProfile && (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            leftIcon={<Plus size={16} />}
                                            onClick={() => setShowSkillModal(true)}
                                        >
                                            Add Skill
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {Object.values(user.skillsOffer).flat().map((skill, idx) => (
                                        <Card
                                            key={idx}
                                            noPadding
                                            className={`p-4 ${isOwnProfile ? 'cursor-pointer hover:border-gray-400 hover:shadow-md transition-all' : ''}`}
                                            onClick={() => isOwnProfile && handleEditSkill(skill, 'offer')}
                                        >
                                            <div className="font-medium text-gray-900 mb-2">{skill}</div>
                                            <Rating value={5} size="sm" />
                                        </Card>
                                    ))}
                                </div>
                            </Card>

                            <Card>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Skills I Want to Learn</h2>
                                    {isOwnProfile && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            leftIcon={<Plus size={16} />}
                                            onClick={() => setShowLearningModal(true)}
                                        >
                                            Add Learning Goal
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {Object.values(user.skillsLearn).flat().map((skill, idx) => (
                                        <Card key={idx} noPadding className="p-4">
                                            <div className="font-medium text-gray-900 mb-2">{skill}</div>
                                            <div className="text-xs text-gray-500">Beginner Level</div>
                                        </Card>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'badges' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {user.badges.map((badge, idx) => (
                                <Card key={idx} className="text-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                                        <Trophy className="text-gray-600" size={24} />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1">{badge.name}</h3>
                                    <p className="text-xs text-gray-500">{badge.description}</p>
                                </Card>
                            ))}
                        </div>
                    )}

                    {activeTab === 'portfolio' && (
                        <div>
                            {isOwnProfile && (
                                <div className="flex justify-end mb-6">
                                    <Button
                                        variant="primary"
                                        size="md"
                                        leftIcon={<Plus size={18} />}
                                        onClick={handleAddPortfolio}
                                    >
                                        Add Portfolio Project
                                    </Button>
                                </div>
                            )}
                            {user.portfolio.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {user.portfolio.map((item) => (
                                        <Card
                                            key={item.id}
                                            className={isOwnProfile ? 'cursor-pointer hover:shadow-lg transition-all group' : ''}
                                            onClick={() => isOwnProfile && handleEditPortfolio(item)}
                                        >
                                            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 relative overflow-hidden">
                                                {isOwnProfile && (
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white text-sm font-medium">Click to edit</span>
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                                            <p className="text-sm text-gray-600">{item.tech}</p>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="text-center py-12">
                                    <p className="text-gray-500 mb-4">No portfolio projects yet</p>
                                    {isOwnProfile && (
                                        <Button variant="primary" onClick={handleAddPortfolio}>
                                            Add Your First Project
                                        </Button>
                                    )}
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Modals */}
            {isOwnProfile && (
                <>
                    <AddSkillModal
                        isOpen={showSkillModal}
                        onClose={() => setShowSkillModal(false)}
                        type="skill"
                        onSave={handleSkillSave}
                    />
                    <AddSkillModal
                        isOpen={showLearningModal}
                        onClose={() => setShowLearningModal(false)}
                        type="learning"
                        onSave={handleLearningGoalSave}
                    />
                </>
            )}

            {!isOwnProfile && showSwapModal && (
                <RequestSwapModal
                    isOpen={showSwapModal}
                    onClose={() => setShowSwapModal(false)}
                    targetUser={user} // mapped correctly
                />
            )}

            {showPortfolioModal && (
                <PortfolioModal
                    isOpen={showPortfolioModal}
                    onClose={() => setShowPortfolioModal(false)}
                    onSave={handlePortfolioSave}
                    editingItem={editingPortfolio}
                />
            )}
        </div>
    );
};

export default UnifiedProfile;
