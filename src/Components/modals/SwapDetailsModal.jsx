import React from 'react';
import { X, Calendar, Clock, MessageSquare, ArrowRightLeft, CheckCircle } from 'lucide-react';
import { Avatar, Badge, Button } from '../common';

const SwapDetailsModal = ({ isOpen, onClose, swap }) => {
    if (!isOpen || !swap) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl transform transition-all max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Swap Details</h2>
                        <p className="text-sm text-gray-500 mt-1 font-mono">ID: #{swap.id?.slice(0, 8)}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-8">

                    {/* Status Section */}
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100">
                        <div className={`p-3 rounded-full ${swap.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-600' :
                            swap.status?.toLowerCase() === 'completed' ? 'bg-blue-100 text-blue-600' :
                                swap.status?.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-600' :
                                    'bg-yellow-100 text-yellow-600'
                            }`}>
                            {swap.status?.toLowerCase() === 'active' ? <CheckCircle size={24} /> :
                                swap.status?.toLowerCase() === 'completed' ? <CheckCircle size={24} /> :
                                    <Clock size={24} />}
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">Current Status</div>
                            <div className="text-lg font-bold text-gray-900 capitalize">{swap.status}</div>
                        </div>
                    </div>

                    {/* Participants & Exchange */}
                    <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        {/* You */}
                        <div className="flex items-center space-x-4">
                            <Avatar
                                name={swap.participants?.[0]?.name}
                                initials={swap.participants?.[0]?.initials}
                                size="lg"
                                className="ring-4 ring-gray-50"
                            />
                            <div className="text-left">
                                <div className="font-bold text-gray-900 text-sm">{swap.participants?.[0]?.name}</div>
                                <div className="text-xs text-gray-500 mb-2">{swap.participants?.[0]?.role}</div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Offers:</span>
                                    <Badge variant="secondary" className="px-3 py-1 text-sm bg-gray-100 text-gray-800">
                                        {swap.skills?.teach}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Exchange Icon */}
                        <div className="flex justify-center text-gray-300 mx-4">
                            <ArrowRightLeft size={28} strokeWidth={1.5} />
                        </div>

                        {/* Partner */}
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <div className="font-bold text-gray-900 text-sm">{swap.participants?.[1]?.name}</div>
                                <div className="text-xs text-gray-500 mb-2">{swap.participants?.[1]?.role}</div>
                                <div className="flex items-center justify-end space-x-2">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Teaches:</span>
                                    <Badge variant="secondary" className="px-3 py-1 text-sm bg-gray-900 text-white">
                                        {swap.skills?.learn}
                                    </Badge>
                                </div>
                            </div>
                            <Avatar
                                name={swap.participants?.[1]?.name}
                                initials={swap.participants?.[1]?.initials}
                                size="lg"
                                className="ring-4 ring-gray-50"
                            />
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="border border-gray-100 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                <Calendar size={18} />
                                <span className="font-medium text-sm">Requested On</span>
                            </div>
                            <div className="text-gray-900 pl-7 font-medium">
                                {formatDate(swap.createdAt)}
                            </div>
                        </div>
                        <div className="border border-gray-100 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                <Clock size={18} />
                                <span className="font-medium text-sm">Session Duration</span>
                            </div>
                            <div className="text-gray-900 pl-7 font-medium">
                                60 Minutes (Default)
                            </div>
                        </div>
                    </div>

                    {/* Message Log / Note */}
                    {swap.requestMessage && (
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Original Request Note</h3>
                            <div className="bg-gray-50 p-5 rounded-xl text-gray-700 italic border-l-4 border-gray-900 relative">
                                <MessageSquare size={16} className="absolute top-5 right-5 text-gray-300" />
                                "{swap.requestMessage}"
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <Button variant="outline" onClick={onClose} className="px-6">Close</Button>
                </div>
            </div>
        </div>
    );
};

export default SwapDetailsModal;
