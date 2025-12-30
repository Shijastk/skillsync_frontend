import React, { useState, useMemo } from 'react';
import { Plus, Search, Calendar } from 'lucide-react';
import { Card, Button, Tabs as TabsComponent } from '../Components/common';
import SwapCard from '../Components/common/SwapCard';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import SwapDetailsModal from '../Components/modals/SwapDetailsModal';
import ScheduleSwapModal from '../Components/modals/ScheduleSwapModal';
import { useUserSwaps, useUpdateSwap } from '../hooks/useSwaps';
import { useUsers } from '../hooks/useUsers';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MySwaps = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All Swaps');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
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

    const handleScheduleSwap = (swap) => {
        setSelectedSwap(swap);
        setShowScheduleModal(true);
    };


    // Transform Data
    const { swaps, stats } = useMemo(() => {
        if (!swapsData || !currentUser) {
            return { swaps: [], stats: [] };
        }

        const transformedSwaps = swapsData.map(swap => {
            const isRequester = String(swap.requesterId) === String(currentUser.id) ||
                String(swap.requester?._id) === String(currentUser.id) ||
                String(swap.requester?._id) === String(currentUser._id);

            // Extract partner data from swap object (backend sends full user objects)
            let partner = {};
            if (isRequester) {
                // Current user is requester, partner is recipient
                partner = swap.recipient || {};
            } else {
                // Current user is recipient, partner is requester
                partner = swap.requester || {};
            }

            // Extract partner info from the object
            const partnerName = partner.firstName && partner.lastName
                ? `${partner.firstName} ${partner.lastName}`
                : (partner.name || 'Unknown User');
            const partnerInitials = (partner.firstName?.[0] || '?') + (partner.lastName?.[0] || '?');
            const partnerAvatar = partner.avatar;
            const partnerRole = partner.bio ? partner.bio.split('.')[0] : 'Skill Swapper';

            const currentUserName = currentUser.name || `${currentUser.firstName} ${currentUser.lastName}`;
            const currentUserInitials = currentUser.initials || (currentUser.firstName?.[0] || '') + (currentUser.lastName?.[0] || '');

            // Normalize status
            let status = 'Pending';
            if (swap.status === 'pending') status = 'Pending';
            if (swap.status === 'accepted') status = 'Accepted';
            if (swap.status === 'rejected') status = 'Rejected';
            if (swap.status === 'in-progress' || swap.status === 'active') status = 'Active';
            if (swap.status === 'completed') status = 'Completed';
            if (swap.status === 'cancelled') status = 'Cancelled';
            if (swap.status === 'scheduled') status = 'Scheduled';

            const swapObj = {
                id: swap.id,
                status: status,
                isIncoming: !isRequester, // Flag: true if incoming request (user is recipient)
                createdAt: swap.createdAt, // Pass through
                requestMessage: swap.message || swap.description, // Pass through
                participants: [
                    {
                        name: currentUserName,
                        initials: currentUserInitials,
                        avatar: currentUser.avatar,
                        role: currentUser.role || 'Member'
                    },
                    {
                        name: partnerName,
                        initials: partnerInitials,
                        avatar: partnerAvatar,
                        role: partnerRole
                    }
                ],
                skills: {
                    teach: isRequester ? (swap.skillOffered || swap.teachSkill) : (swap.skillRequested || swap.learnSkill),
                    teachMeta: 'Expert', // Mock level
                    learn: isRequester ? (swap.skillRequested || swap.learnSkill) : (swap.skillOffered || swap.teachSkill),
                    learnMeta: 'Beginner' // Mock level
                },
                meta: [
                    { label: 'Weekly' }, // Mock frequency
                    { label: swap.duration || '1 hour' },
                    { label: 'Chat' }
                ],
                progress: (status === 'Completed') ? 100 : (status === 'Active' ? 30 : (status === 'Scheduled' ? 50 : 0)),
                sessions: swap.scheduledDate ? [{
                    date: new Date(swap.scheduledDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    status: new Date(swap.scheduledDate) < new Date() ? 'Completed' : (new Date(swap.scheduledDate).toDateString() === new Date().toDateString() ? 'Today' : 'Upcoming')
                }] : []
            };

            // Add actions based on status
            if (status === 'Active') {
                swapObj.actions = [
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
                ];
            } else if (status === 'Pending' && !isRequester) {
                // Incoming pending request - show accept/decline
                swapObj.actions = [
                    {
                        label: 'Accept',
                        variant: 'primary',
                        onClick: () => updateSwapMutation.mutate({ id: swap.id, data: { status: 'accepted' } })
                    },
                    {
                        label: 'Decline',
                        variant: 'outline',
                        onClick: () => updateSwapMutation.mutate({ id: swap.id, data: { status: 'rejected' } })
                    },
                    {
                        label: 'Details',
                        variant: 'ghost',
                        onClick: () => handleViewDetails(swapObj)
                    }
                ];
            } else if (status === 'Accepted' || status === 'Scheduled') {
                // Accepted/Scheduled swap - show Message and Schedule
                swapObj.actions = [
                    {
                        label: 'Message',
                        variant: 'outline',
                        onClick: () => navigate('/messages')
                    },
                    {
                        label: 'Schedule',
                        variant: 'primary',
                        onClick: () => handleScheduleSwap(swapObj) // Can update to schedule modal
                    },
                    {
                        label: 'Details',
                        variant: 'ghost',
                        onClick: () => handleViewDetails(swapObj)
                    }
                ];
            } else if (status === 'Rejected' || status === 'Cancelled') {
                // Rejected/Cancelled - just view details
                swapObj.actions = [
                    {
                        label: 'View Details',
                        variant: 'outline',
                        onClick: () => handleViewDetails(swapObj)
                    }
                ];
            } else {
                // Default - view details
                swapObj.actions = [
                    {
                        label: 'View Details',
                        variant: 'outline',
                        onClick: () => handleViewDetails(swapObj)
                    }
                ];
            }

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
    }, [swapsData, currentUser, updateSwapMutation, navigate]);


    const tabs = [
        { id: 'All Swaps', label: 'All Swaps' },
        { id: 'Incoming', label: 'Incoming', count: swaps.filter(s => s.isIncoming && s.status === 'Pending').length },
        { id: 'Outgoing', label: 'Outgoing', count: swaps.filter(s => !s.isIncoming && s.status === 'Pending').length },
        { id: 'Active', label: 'Active', count: swaps.filter(s => s.status === 'Active').length },
        { id: 'Scheduled', label: 'Scheduled', count: swaps.filter(s => s.status === 'Scheduled').length },
        { id: 'Pending', label: 'All Pending', count: swaps.filter(s => s.status === 'Pending').length },
        { id: 'Completed', label: 'Completed', count: swaps.filter(s => s.status === 'Completed').length },
    ];

    const filteredSwaps = swaps.filter((swap) => {
        if (activeTab === 'All Swaps') return true;
        if (activeTab === 'Incoming') return swap.isIncoming && swap.status === 'Pending';
        if (activeTab === 'Outgoing') return !swap.isIncoming && swap.status === 'Pending';
        if (activeTab === 'Pending') return swap.status === 'Pending';
        return swap.status === activeTab;
    });

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

            {/* Schedule Modal */}
            {showScheduleModal && selectedSwap && (
                <ScheduleSwapModal
                    isOpen={showScheduleModal}
                    onClose={() => setShowScheduleModal(false)}
                    swap={selectedSwap}
                />
            )}
        </div>
    );
};

export default MySwaps;
