import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
    MapPin, Calendar, Star, Trophy, Code2, Database,
    Palette, Cloud, BarChart3, Container, FileCode,
    MessageCircle, Share2, Plus, Check
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

/**
 * UnifiedProfile - Single component for both own profile and public profiles
 * @param {Object} props
 * @param {boolean} props.isOwnProfile - Whether viewing own profile
 */
const UnifiedProfile = ({ isOwnProfile: propIsOwnProfile }) => {
    const { userId } = useParams();
    const { user: currentUser } = useAuthContext();

    // Determine if viewing own profile
    // Note: If userId param matches currentUser.id, it's also own profile
    const isOwnProfile = propIsOwnProfile || (userId && String(userId) === String(currentUser?.id));

    // Fetch data
    const targetUserId = isOwnProfile ? currentUser?.id : userId;
    const { data: userData, isLoading: isLoadingUser } = useUser(targetUserId);
    const { data: swapsData } = useUserSwaps(targetUserId);

    // Mutations
    const updateUserMutation = useUpdateUser();

    // State management
    const [activeTab, setActiveTab] = useState('overview');
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
                'Expertise': (userData.skillsToTeach || []).map(s => s.name)
            },
            skillsLearn: {
                'Interests': (userData.skillsToLearn || []).map(s => s.name)
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
    const handleSkillSave = async (data) => {
        // data: { skill: "React", level: "Expert", category: "Frontend" }
        // We need to add to skillsToTeach
        const newSkill = {
            id: Date.now(),
            name: data.skill,
            level: data.level
        };

        const updatedSkills = [...(userData.skillsToTeach || []), newSkill];

        try {
            await updateUserMutation.mutateAsync({
                id: userData.id,
                data: { skillsToTeach: updatedSkills } // Patch update
            });
            setShowSkillModal(false);
            setEditingSkill(null);
        } catch (error) {
            console.error("Failed to update skills", error);
        }
    };

    const handleLearningGoalSave = async (data) => {
        const newSkill = {
            id: Date.now(),
            name: data.skill || data.goal, // Adjust based on modal output
            level: 'Beginner'
        };

        const updatedSkills = [...(userData.skillsToLearn || []), newSkill];

        try {
            await updateUserMutation.mutateAsync({
                id: userData.id,
                data: { skillsToLearn: updatedSkills }
            });
            setShowLearningModal(false);
        } catch (error) {
            console.error("Failed to update learning goals", error);
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

    if (isLoadingUser || !user) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Profile Header */}
                    <Card className="mb-6">
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center mb-8">
                            <Avatar
                                name={user.name}
                                initials={user.initials}
                                size="2xl"
                                showStatus={!isOwnProfile}
                                status="online"
                            />

                            <div className="flex-1">
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                    {user.name}
                                </h1>
                                <p className="text-lg text-gray-600 mb-3">{user.title}</p>

                                <div className="flex items-center gap-2 text-gray-500 mb-6">
                                    <MapPin size={16} />
                                    <span>{user.location}</span>
                                    <span>•</span>
                                    <span>Member since {user.joinDate}</span>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {isOwnProfile ? (
                                        <>
                                            <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setShowSkillModal(true)}>
                                                Add Skill
                                            </Button>
                                            <Button variant="outline" leftIcon={<Share2 size={16} />}>
                                                Share Profile
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant={hasActiveSwap ? "secondary" : "primary"}
                                                onClick={() => !hasActiveSwap && setShowSwapModal(true)}
                                                disabled={hasActiveSwap}
                                                leftIcon={hasActiveSwap && <Check size={16} />}
                                            >
                                                {hasActiveSwap ? (swapStatus === 'pending' ? 'Requested' : 'Active Swap') : 'Start Swap'}
                                            </Button>
                                            <Button variant="outline" leftIcon={<MessageCircle size={16} />}>
                                                Message
                                            </Button>
                                            <Button variant="ghost" leftIcon={<Share2 size={16} />}>
                                                Share Profile
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
                                        <div className="text-3xl font-bold text-gray-900 mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">
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
