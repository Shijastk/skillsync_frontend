import React, { useState, useMemo } from 'react';
import {
    MapPin, Calendar, Star, Trophy, Code2, Database,
    Palette, Cloud, BarChart3, Container, FileCode,
    Share2, Plus, Check, Edit2, Save, X
} from 'lucide-react';
import {
    Avatar, Badge, Button, Card, Rating, Tabs
} from '../common';
import AddSkillModal from '../modals/AddSkillModal';
import PortfolioModal from '../modals/PortfolioModal';
import LoadingSpinner from '../common/LoadingSpinner';

import { useAuthContext } from '../../context/AuthContext';
import { useUser, useUpdateUser, useCurrentUserProfile } from '../../hooks/useUsers';
import { useUserSwaps } from '../../hooks/useSwaps';
import { useQueryClient } from '@tanstack/react-query';

/**
 * PersonalProfile - Your own profile with edit capabilities
 * Displays and allows editing of:
 * - Personal information
 * - Skills to teach
 * - Skills to learn
 * -Portfolio
 * - Stats and achievements
 */
const PersonalProfile = () => {
    const { user: currentUser, updateUser } = useAuthContext();
    const queryClient = useQueryClient();

    // Fetch own data using /api/auth/me endpoint
    const { data: userData, isLoading: isLoadingUser } = useCurrentUserProfile();
    const { data: swapsData } = useUserSwaps();

    // Mutations
    const updateUserMutation = useUpdateUser();

    // State management
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [showSkillModal, setShowSkillModal] = useState(false);
    const [showLearningModal, setShowLearningModal] = useState(false);
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
            title: userData.bio ? userData.bio.split('.')[0] : 'Skill Swapper',
            location: userData.location || 'Remote',
            joinDate: userData.joinedDate ? new Date(userData.joinedDate).toLocaleDateString() : '2024',
            bio: userData.bio || 'No bio yet.',

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
            badges: userData.badges || [
                { name: 'Early Adopter', description: 'Joined in beta' }
            ],

            // Stats
            stats: {
                totalSwaps: swapsData?.length || 0,
                rating: userData.rating || 5.0,
                hoursTaught: (swapsData?.filter(s => s.status === 'completed').length || 0) * 5,
                successRate: 100
            }
        };
    }, [userData, swapsData]);

    // Handlers
    const handleEdit = () => {
        setEditForm({
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            bio: userData?.bio || '',
            location: userData?.location || '',
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await updateUserMutation.mutateAsync({
                id: currentUser.id,
                updates: editForm
            });

            // Update local storage
            const updatedUserData = { ...currentUser, ...editForm };
            localStorage.setItem('user', JSON.stringify(updatedUserData));
            updateUser(updatedUserData);

            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ['user', currentUser.id] });
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert("Failed to update profile");
        }
    };

    const handleInputChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSkillSave = async (skillData) => {
        try {
            const { usersService } = await import('../../services/api');
            await usersService.addSkillToTeach(skillData);

            // Invalidate queries - React Query will refetch automatically in background
            queryClient.invalidateQueries({ queryKey: ['user', currentUser.id] });
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });

            setShowSkillModal(false);
            setEditingSkill(null);
        } catch (error) {
            console.error("Failed to add skill", error);
            alert(error.response?.data?.message || "Failed to add skill. Please try again.");
        }
    };

    const handleLearningGoalSave = async (skillData) => {
        try {
            const { usersService } = await import('../../services/api');
            await usersService.addSkillToLearn(skillData);

            // Invalidate queries - React Query will refetch automatically in background
            queryClient.invalidateQueries({ queryKey: ['user', currentUser.id] });
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });

            setShowLearningModal(false);
        } catch (error) {
            console.error("Failed to add learning goal", error);
            alert(error.response?.data?.message || "Failed to add learning goal. Please try again.");
        }
    };

    const handlePortfolioSave = async (data) => {
        const newItem = {
            id: editingPortfolio ? editingPortfolio.id : Date.now(),
            ...data
        };

        const updatedPortfolio = editingPortfolio
            ? user.portfolio.map(p => p.id === editingPortfolio.id ? newItem : p)
            : [...(user.portfolio || []), newItem];

        try {
            await updateUserMutation.mutateAsync({
                id: currentUser.id,
                updates: { portfolio: updatedPortfolio }
            });

            setShowPortfolioModal(false);
            setEditingPortfolio(null);
            queryClient.invalidateQueries({ queryKey: ['user', currentUser.id] });
        } catch (error) {
            console.error('Failed to update portfolio', error);
            alert("Failed to update portfolio");
        }
    };

    // Loading state
    if (isLoadingUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // Only show "not found" if we're not loading AND userData is null
    if (!userData && !isLoadingUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Error</h2>
                    <p className="text-gray-600">Unable to load your profile.</p>
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

    const categoryIcons = {
        frontend: Code2,
        backend: Database,
        design: Palette,
        devops: Cloud,
        data: BarChart3,
        mobile: Container,
        other: FileCode,
    };

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
                                    className="ring-4 ring-white shadow-md"
                                />
                            </div>

                            <div className="flex-1 w-full">
                                {isEditing ? (
                                    <div className="space-y-4 animate-in fade-in duration-200">
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
                                    {isEditing ? (
                                        <>
                                            <Button
                                                variant="primary"
                                                className="bg-black hover:bg-gray-800 text-white border-black shadow-sm hover:shadow-md transition-all duration-200"
                                                onClick={handleSave}
                                            >
                                                <Save className="w-4 h-4 mr-1" />
                                                Save Changes
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                                onClick={() => setIsEditing(false)}
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="secondary"
                                                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
                                                onClick={handleEdit}
                                            >
                                                <Edit2 className="w-4 h-4 mr-1" />
                                                Edit Profile
                                            </Button>
                                            <Button
                                                variant="primary"
                                                className="bg-black hover:bg-gray-800 text-white border-black shadow-sm hover:shadow-md"
                                                onClick={() => setShowSkillModal(true)}
                                            >
                                                <Plus className="w-4 h-4 mr-1" />
                                                Add Skill
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                            >
                                                <Share2 className="w-4 h-4 mr-1" />
                                                Share Profile
                                            </Button>
                                        </>
                                    )}
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
                                <p className="text-2xl lg:text-3xl font-bold text-gray-900">{user.stats.hoursTaught}</p>
                                <p className="text-sm text-gray-500 mt-1">Hours Taught</p>
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
                                {/* Skills to Teach */}
                                <Card>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold">Skills I Can Teach</h2>
                                        <Button size="sm" onClick={() => setShowSkillModal(true)}>
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add Skill
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {user.skillsOffer.Expertise?.map((skill, index) => (
                                            <Badge key={index} variant="primary">
                                                {skill}
                                            </Badge>
                                        ))}
                                        {(!user.skillsOffer.Expertise || user.skillsOffer.Expertise.length === 0) && (
                                            <p className="text-gray-500">No skills added yet</p>
                                        )}
                                    </div>
                                </Card>

                                {/* Skills to Learn */}
                                <Card>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold">Skills I Want to Learn</h2>
                                        <Button size="sm" onClick={() => setShowLearningModal(true)}>
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add Goal
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {user.skillsLearn.Interests?.map((skill, index) => (
                                            <Badge key={index} variant="secondary">
                                                {skill}
                                            </Badge>
                                        ))}
                                        {(!user.skillsLearn.Interests || user.skillsLearn.Interests.length === 0) && (
                                            <p className="text-gray-500">No learning goals yet</p>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'portfolio' && (
                            <Card>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">Portfolio</h2>
                                    <Button size="sm" onClick={() => {
                                        setEditingPortfolio(null);
                                        setShowPortfolioModal(true);
                                    }}>
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add Project
                                    </Button>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {user.portfolio?.map((project, index) => (
                                        <div key={index} className="border rounded-lg p-4">
                                            <h3 className="font-semibold">{project.title}</h3>
                                            <p className="text-sm text-gray-600">{project.description}</p>
                                        </div>
                                    ))}
                                    {(!user.portfolio || user.portfolio.length === 0) && (
                                        <p className="text-gray-500 col-span-2">No projects yet</p>
                                    )}
                                </div>
                            </Card>
                        )}

                        {activeTab === 'achievements' && (
                            <Card>
                                <h2 className="text-xl font-bold mb-4">Achievements</h2>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {user.badges?.map((badge, index) => (
                                        <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <Trophy className="w-8 h-8 text-yellow-500" />
                                            <div>
                                                <h3 className="font-semibold">{badge.name}</h3>
                                                <p className="text-sm text-gray-600">{badge.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </main>

            {/* Modals */}
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
            <PortfolioModal
                isOpen={showPortfolioModal}
                onClose={() => setShowPortfolioModal(false)}
                onSave={handlePortfolioSave}
                editingItem={editingPortfolio}
            />
        </div>
    );
};

export default PersonalProfile;
