import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGroup, useJoinGroup } from '../hooks/useGroups';
import { useAuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import { Users, MessageCircle, Star, ArrowLeft, Send } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const GroupDetails = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuthContext();
    const { success, error: toastError } = useToast();

    const { data: group, isLoading } = useGroup(groupId);
    const joinGroupMutation = useJoinGroup();

    const [messageText, setMessageText] = useState('');
    const [activeTab, setActiveTab] = useState('discussions');

    // Derived state
    const isMember = group?.members?.some(m =>
        (m.id === currentUser?.id) || (m._id === currentUser?.id)
    );

    const handleJoin = async () => {
        if (!currentUser) return toastError("Please login to join");
        try {
            await joinGroupMutation.mutateAsync(groupId);
            success("Joined group successfully!");
        } catch (err) {
            toastError("Failed to join group");
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (!group) return <div className="p-8 text-center">Group not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header Banner */}
            <div className={`${group.bannerColor || 'bg-gray-900'} h-48 md:h-64 relative`}>
                <button
                    onClick={() => navigate('/groups')}
                    className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                        {/* Avatar */}
                        <div className={`w-32 h-32 rounded-3xl border-4 border-white shadow-md flex items-center justify-center text-white text-4xl font-bold ${group.avatarColor || 'bg-indigo-500'}`}>
                            <Users size={48} />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
                            <p className="text-gray-600 mb-4 max-w-2xl">{group.description}</p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Users size={16} />
                                    {group.members?.length || group.memberCount || 0} members
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                    {group.rating || 'New'} rating
                                </div>
                                <div className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium uppercase tracking-wide">
                                    {group.type || 'Public'} Group
                                </div>
                            </div>
                        </div>

                        {/* Action */}
                        <div>
                            {isMember ? (
                                <button
                                    disabled
                                    className="px-6 py-3 bg-green-100 text-green-700 rounded-xl font-medium flex items-center gap-2 cursor-default"
                                >
                                    <Users size={20} />
                                    Joined
                                </button>
                            ) : (
                                <button
                                    onClick={handleJoin}
                                    disabled={joinGroupMutation.isPending}
                                    className="px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
                                >
                                    {joinGroupMutation.isPending ? 'Joining...' : 'Join Group'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-8 mt-10 border-b border-gray-100 overflow-x-auto">
                        {['discussions', 'members', 'events', 'resources'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 px-2 border-b-2 font-medium capitalize transition-colors whitespace-nowrap ${activeTab === tab
                                    ? 'border-gray-900 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">

                        {/* DISCUSSIONS TAB */}
                        {activeTab === 'discussions' && (
                            <>
                                {isMember && (
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-gray-500">
                                            {currentUser?.firstName?.[0] || 'U'}
                                        </div>
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={messageText}
                                                onChange={(e) => setMessageText(e.target.value)}
                                                placeholder="Start a discussion..."
                                                className="w-full h-10 bg-gray-50 rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                                            />
                                            <button className="absolute right-2 top-1.5 p-1.5 bg-gray-900 text-white rounded-full hover:bg-gray-800">
                                                <Send size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center py-16">
                                    <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No discussions yet</h3>
                                    <p className="text-gray-500">Be the first to start a conversation in this group!</p>
                                </div>
                            </>
                        )}

                        {/* MEMBERS TAB */}
                        {activeTab === 'members' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-semibold">Members ({group.members?.length || 0})</h3>
                                    <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">All Members</div>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {group.members && group.members.length > 0 ? (
                                        group.members.map((member, idx) => (
                                            <div key={idx} className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                                    {(member.firstName?.[0] || member.name?.[0] || '?')}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm">
                                                        {member.firstName} {member.lastName}
                                                        {member.id === currentUser?.id && <span className="ml-2 text-xs text-gray-400">(You)</span>}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{member.role || 'Member'}</div>
                                                </div>
                                                <button className="ml-auto text-xs font-medium text-gray-900 hover:underline">View</button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-gray-500">No members found</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* EVENTS TAB */}
                        {activeTab === 'events' && (
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center py-16">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Star size={32} className="text-orange-500" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No Upcoming Events</h3>
                                <p className="text-gray-500 mb-6">Events and meetups for this group will appear here.</p>
                                {isMember && <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Suggest an Event</button>}
                            </div>
                        )}

                        {/* RESOURCES TAB */}
                        {activeTab === 'resources' && (
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center py-16">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users size={32} className="text-blue-500" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">Shared Resources</h3>
                                <p className="text-gray-500 mb-6">Files, links, and guides shared by the community.</p>
                                {isMember && <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">Upload Resource</button>}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* About Card - Always visible */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold mb-4">About</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {group.description || "No description available."}
                            </p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <h4 className="text-xs font-semibold uppercase text-gray-400 mb-2">Focused Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(group.skills || []).map((skill, i) => (
                                        <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Admins Card (New) */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold mb-4 text-sm">Group Admins</h3>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                                    A
                                </div>
                                <div className="text-sm font-medium">Admin User</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupDetails;
