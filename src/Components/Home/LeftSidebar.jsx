import React from 'react';
import {
    Zap, Calendar, BookOpen, User,
    Settings, Award, Video, ArrowRight
} from 'lucide-react';



const LeftSidebar = ({ user, upcomingSessions, onNavigate, onScheduleClick }) => {


    const quickLinks = [
        { icon: Zap, label: 'Requests', color: 'bg-amber-100 text-amber-600', action: () => onNavigate('messages') },
        { icon: BookOpen, label: 'Saved', color: 'bg-blue-100 text-blue-600', action: () => onNavigate('discover') },
        { icon: Award, label: 'Badges', color: 'bg-purple-100 text-purple-600', action: () => onNavigate('my-swaps') },
        { icon: Settings, label: 'Settings', color: 'bg-gray-100 text-gray-600', action: () => onNavigate('discover') },
    ];

    return (
        <aside className="hidden lg:flex flex-col gap-6 sticky top-24">

            {/* 1. Identity & Stats Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden relative">
                <div className="flex items-start justify-between">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-xl font-bold shadow-md">
                            {user.initials}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white w-6 h-6 rounded-full"></div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold text-indigo-600">Level {user.stats.level}</div>
                        <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Expert</div>
                    </div>
                </div>

                <div className="mt-4">
                    <h2 className="font-bold text-gray-900 text-lg leading-tight">{user.name}</h2>
                    <p className="text-gray-500 text-sm">{user.role}</p>
                </div>

                {/* Skill Breakdown */}
                <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-100">
                    <div className="bg-indigo-50/50 rounded-xl p-3">
                        <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wide mb-2">Teaching</div>
                        <div className="flex flex-wrap gap-1">
                            {user.teaches.map((skill, i) => (
                                <span key={i} className="text-xs font-medium text-indigo-900 bg-white px-2 py-0.5 rounded shadow-sm border border-indigo-100/50">{skill}</span>
                            ))}
                        </div>
                    </div>
                    <div className="bg-green-50/50 rounded-xl p-3">
                        <div className="text-[10px] uppercase font-bold text-green-500 tracking-wide mb-2">Learning</div>
                        <div className="flex flex-wrap gap-1">
                            {user.learns.map((skill, i) => (
                                <span key={i} className="text-xs font-medium text-green-900 bg-white px-2 py-0.5 rounded shadow-sm border border-green-100/50">{skill}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Upcoming Schedule (High Value Info) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        Your Schedule
                    </h3>
                    <span className="text-xs font-medium text-indigo-600 cursor-pointer hover:underline" onClick={() => onNavigate('my-swaps')}>Calendar</span>
                </div>

                <div className="space-y-3">
                    {upcomingSessions.map((session) => (
                        <div key={session.id} onClick={() => onScheduleClick && onScheduleClick(session.id)} className="flex gap-3 items-center group cursor-pointer p-2 -mx-2 hover:bg-gray-50 rounded-xl transition-colors">
                            <div className="flex flex-col items-center justify-center w-12 h-12 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
                                <span className="text-xs font-bold">{session.time}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 text-sm truncate">{session.topic}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                                    <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold">{session.partnerAvatar}</span>
                                    <span>with {session.partnerName}</span>
                                </div>
                            </div>
                            {session.isVideo && (
                                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
                                    <Video size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button onClick={() => onScheduleClick && onScheduleClick('new')} className="w-full mt-2 py-2 text-xs font-medium text-gray-500 border border-dashed border-gray-200 rounded-lg hover:border-gray-300 hover:text-gray-700 transition-colors">
                        + Schedule Session
                    </button>
                </div>
            </div>

            {/* 3. Quick Shortcuts */}
            <div>
                <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3 px-1">Quick Links</h3>
                <div className="grid grid-cols-2 gap-3">
                    {quickLinks.map((link, idx) => (
                        <button
                            key={idx}
                            onClick={link.action}
                            className="flex flex-col items-center justify-center gap-2 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200 group"
                        >
                            <div className={`p-2.5 rounded-xl ${link.color} group-hover:scale-110 transition-transform`}>
                                <link.icon size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">{link.label}</span>
                        </button>
                    ))}
                </div>
            </div>

        </aside>
    );
};

export default LeftSidebar;