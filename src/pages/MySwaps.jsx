import React, { useState, useMemo } from 'react';
import { Plus, Search, Calendar } from 'lucide-react';
import { Card, Button, Tabs as TabsComponent } from '../Components/common';
import SwapCard from '../Components/common/SwapCard';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import SwapDetailsModal from '../Components/modals/SwapDetailsModal';
import { useUserSwaps, useUpdateSwap } from '../hooks/useSwaps';
import { useUsers } from '../hooks/useUsers';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MySwaps = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All Swaps');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedSwap, setSelectedSwap] = useState(null);

    const updateSwapMutation = useUpdateSwap();

    // Data Fetching
    const { user: currentUser } = useAuthContext();
    const { data: swapsData, isLoading: isLoadingSwaps } = useUserSwaps(currentUser?.id);
    const { data: usersData, isLoading: isLoadingUsers } = useUsers();

    const handleViewDetails = (swap) => {
        setSelectedSwap(swap);
        setShowDetailsModal(true);
    };

    // Transform Data
    const { swaps, stats } = useMemo(() => {
        if (!swapsData || !usersData || !currentUser) {
            return { swaps: [], stats: [] };
        }

        const transformedSwaps = swapsData.map(swap => {
            const isRequester = String(swap.requesterId) === String(currentUser.id);
            const partnerId = isRequester ? swap.receiverId : swap.requesterId;
            const partner = usersData.find(u => String(u.id) === String(partnerId)) || {};

            const partnerName = partner.firstName ? `${partner.firstName} ${partner.lastName}` : 'Unknown User';
            const partnerInitials = (partner.firstName?.[0] || '?') + (partner.lastName?.[0] || '?');
            const partnerRole = partner.bio ? partner.bio.split('.')[0] : 'Skill Swapper';

            const currentUserName = currentUser.name || `${currentUser.firstName} ${currentUser.lastName}`;
            const currentUserInitials = currentUser.initials || (currentUser.firstName?.[0] || '') + (currentUser.lastName?.[0] || '');

            // Normalize status
            let status = 'Pending';
            if (swap.status === 'in-progress' || swap.status === 'active') status = 'Active';
            if (swap.status === 'completed') status = 'Completed';
            if (swap.status === 'cancelled') status = 'Cancelled';
            if (swap.status === 'scheduled') status = 'Scheduled';

            const swapObj = {
                id: swap.id,
                status: status,
                createdAt: swap.createdAt, // Pass through
                requestMessage: swap.message, // Pass through
                participants: [
                    {
                        name: currentUserName,
                        initials: currentUserInitials,
                        role: currentUser.role || 'Member'
                    },
                    {
                        name: partnerName,
                        initials: partnerInitials,
                        role: partnerRole
                    }
                ],
                skills: {
                    teach: isRequester ? swap.teachSkill : swap.learnSkill,
                    teachMeta: 'Expert', // Mock level
                    learn: isRequester ? swap.learnSkill : swap.teachSkill,
                    learnMeta: 'Beginner' // Mock level
                },
                meta: [
                    { label: 'Weekly' }, // Mock frequency
                    { label: '1 hour' }, // Mock duration
                    { label: 'Chat' }
                ],
                progress: status === 'Active' ? 30 : (status === 'Completed' ? 100 : 0),
                sessions: []
            };

            // Add actions with self-reference via closure wrapper if needed, 
            // but simpler to define actions here knowing they trigger external handlers
            swapObj.actions = status === 'Active' ? [
                {
                    label: 'Message',
                    variant: 'outline',
                    onClick: () => navigate('/messages')
                },
                {
                    label: 'Complete',
                    variant: 'primary',
                    onClick: () => updateSwapMutation.mutate({ id: swap.id, data: { status: 'completed' } })
                },
                {
                    label: 'Details',
                    variant: 'ghost',
                    onClick: () => handleViewDetails(swapObj)
                }
            ] : [
                {
                    label: 'View Details',
                    variant: 'outline',
                    onClick: () => handleViewDetails(swapObj)
                }
            ];

            return swapObj;
        });

        // Calculate Stats
        const statsData = [
            { label: 'Active Swaps', number: transformedSwaps.filter(s => s.status === 'Active').length },
            { label: 'Completed', number: transformedSwaps.filter(s => s.status === 'Completed').length },
            { label: 'Hours Learned', number: transformedSwaps.filter(s => s.status === 'Completed').length * 10 }, // Mock hours
            { label: 'Reputation', number: currentUser.credits || 0 }
        ];

        return { swaps: transformedSwaps, stats: statsData };
    }, [swapsData, usersData, currentUser, updateSwapMutation, navigate]);


    const tabs = [
        { id: 'All Swaps', label: 'All Swaps' },
        { id: 'Active', label: 'Active', count: swaps.filter(s => s.status === 'Active').length },
        { id: 'Scheduled', label: 'Scheduled', count: swaps.filter(s => s.status === 'Scheduled').length },
        { id: 'Pending', label: 'Pending', count: swaps.filter(s => s.status === 'Pending').length },
        { id: 'Completed', label: 'Completed', count: swaps.filter(s => s.status === 'Completed').length },
    ];

    const filteredSwaps = swaps.filter(
        (swap) => activeTab === 'All Swaps' || swap.status === activeTab
    );

    if (isLoadingSwaps || isLoadingUsers) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Swaps</h1>
                    <p className="text-lg text-gray-600">Track and manage all your skill exchange activities</p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index} className="text-center">
                            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <Card className="bg-gradient-to-r from-gray-50 to-white mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Ready to Learn Something New?
                    </h2>
                    <p className="text-gray-600 mb-5">
                        Start a new skill exchange or browse available opportunities
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="primary"
                            leftIcon={<Plus size={18} />}
                            onClick={() => navigate('/discover')} // Redirect to discovery
                        >
                            Create New Swap
                        </Button>
                        <Button variant="outline" leftIcon={<Search size={18} />} onClick={() => navigate('/discover')}>
                            Browse Skills
                        </Button>
                        <Button variant="outline" leftIcon={<Calendar size={18} />} onClick={() => navigate('/groups')}>
                            Join Group Swap
                        </Button>
                    </div>
                </Card>

                {/* Tabs */}
                <TabsComponent
                    tabs={tabs.map(tab => ({
                        ...tab,
                        icon: null
                    }))}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    variant="underline"
                    className="mb-8"
                />

                {/* Swaps Grid */}
                {filteredSwaps.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredSwaps.map((swap) => (
                            <SwapCard key={swap.id} swap={swap} />
                        ))}
                    </div>
                ) : (
                    <Card className="text-center py-16">
                        <div className="text-6xl mb-4 opacity-50">🔄</div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">No swaps found</h3>
                        <p className="text-gray-600 mb-6">
                            You don't have any {activeTab !== 'All Swaps' ? activeTab.toLowerCase() : ''} swaps yet.
                        </p>
                        <Button
                            variant="primary"
                            leftIcon={<Plus size={18} />}
                            onClick={() => navigate('/discover')}
                        >
                            Find a Partner
                        </Button>
                    </Card>
                )}
            </main>

            {/* Details Modal */}
            {showDetailsModal && selectedSwap && (
                <SwapDetailsModal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    swap={selectedSwap}
                />
            )}
        </div>
    );
};

export default MySwaps;
