import React from 'react';
import { TrendingUp, ArrowUpRight, Check, X, Star } from 'lucide-react';


const RightSidebar = ({ trendingSkills, incomingRequests, suggestedMentors = [], onMentorClick, onAcceptSwap, onDeclineSwap }) => {
    return (
        <aside className="hidden lg:flex flex-col gap-6 sticky top-24">

            {/* 1. Action Center: Incoming Requests */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-sm">Swap Requests</h3>
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{incomingRequests.length}</span>
                </div>

                <div className="space-y-4">
                    {incomingRequests.map((req) => (
                        <div key={req.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="font-semibold text-gray-900 text-sm">{req.fromUser}</span>
                                    <div className="text-xs text-gray-500">{req.fromUserRole}</div>
                                </div>
                                <div className="text-[10px] text-gray-400">1h ago</div>
                            </div>

                            <div className="text-xs text-gray-600 mb-3 bg-white p-2 rounded-lg border border-gray-100/50">
                                Wants to learn <span className="font-medium text-indigo-600">{req.requesting}</span> in exchange for <span className="font-medium text-green-600">{req.offering}</span>.
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => onAcceptSwap && onAcceptSwap(req.id)}
                                    className="flex-1 bg-gray-900 text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-1"
                                >
                                    <Check size={14} /> Accept
                                </button>
                                <button
                                    onClick={() => onDeclineSwap && onDeclineSwap(req.id)}
                                    className="flex-1 bg-white border border-gray-200 text-gray-700 text-xs font-semibold py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                                >
                                    <X size={14} /> Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Suggested Mentors - Real Data */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-4">Mentors for You</h3>
                <div className="space-y-3">
                    {suggestedMentors.length > 0 ? suggestedMentors.map((mentor) => (
                        <div
                            key={mentor.id}
                            onClick={() => onMentorClick && onMentorClick(mentor.id)}
                            className="flex items-center justify-between group cursor-pointer p-2 -mx-2 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {mentor.avatar && (mentor.avatar.startsWith('http://') || mentor.avatar.startsWith('https://')) ? (
                                    <img
                                        src={mentor.avatar}
                                        alt={mentor.name}
                                        className="w-10 h-10 rounded-full object-cover shadow-sm"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                        {mentor.initials}
                                    </div>
                                )}
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">{mentor.name}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <Star size={10} className="text-amber-400 fill-amber-400" />
                                        {mentor.rating.toFixed(1)} • Teaches {mentor.teaches[0]}
                                    </div>
                                </div>
                            </div>
                            <button className="text-indigo-600 p-1.5 rounded-lg bg-indigo-50 opacity-0 group-hover:opacity-100 transition-all">
                                <ArrowUpRight size={16} />
                            </button>
                        </div>
                    )) : (
                        <p className="text-xs text-gray-500 text-center py-4">
                            Add skills you want to learn to see matching mentors!
                        </p>
                    )}
                </div>
            </div>

            {/* 3. Compact Trending */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-sm p-5 text-white">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={16} className="text-indigo-200" />
                    <h3 className="font-bold text-sm">Rising Skills</h3>
                </div>
                <div className="space-y-3">
                    {trendingSkills.slice(0, 3).map((skill, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="font-medium text-indigo-50">{skill.name}</span>
                            <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-indigo-100">
                                {skill.learners} users
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;