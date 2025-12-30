import React from 'react';
import { Search, MoreHorizontal, MessageSquare, ShieldCheck, Trophy, Clock } from 'lucide-react';

export const ConversationList = ({
    swappers,
    selectedId,
    onSelect,
    searchTerm,
    onSearchChange
}) => {
    return (
        <div className="flex flex-col h-[90vh] bg-white border-r border-slate-100 w-full md:w-[350px] lg:w-[400px]">
            <div className="p-8 border-b border-slate-50 bg-white">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-slate-200">
                            <MessageSquare size={20} className="text-white" />
                        </div>
                        <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tighter">SkillSwap</h1>
                    </div>
                    <button className="text-slate-300 hover:text-slate-900 transition-colors p-2 rounded-xl hover:bg-slate-50"><MoreHorizontal size={24} /></button>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={16} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search Protocol Logs..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-100 focus:outline-none transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar">
                {swappers.length > 0 ? swappers.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => onSelect(s.id)}
                        className={`w-full flex items-center gap-4 p-6 transition-all border-b border-slate-50 group relative
              ${selectedId === s.id ? 'bg-indigo-50/20' : 'hover:bg-slate-50/40'}
            `}
                    >
                        {selectedId === s.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600" />}

                        <div className="relative flex-shrink-0">
                            <img src={s.avatar || `https://ui-avatars.com/api/?name=${s.name}`} className="w-14 h-14 rounded-2xl border border-slate-100 object-cover shadow-sm" alt="" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 border-2 border-white rounded-lg shadow-sm" />
                        </div>

                        <div className="flex-grow text-left overflow-hidden">
                            <div className="flex items-center justify-between mb-0.5">
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-slate-900 font-extrabold text-[15px] tracking-tight truncate">{s.name}</span>
                                    {s.isVerified && <ShieldCheck size={14} className="text-indigo-600 flex-shrink-0" />}
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap ml-2">
                                    {s.lastTimestamp ? new Date(s.lastTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 mb-1.5">
                                {s.swapStatus === 'pending' && (
                                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/20">Protocol Brief</span>
                                )}
                                {s.swapStatus === 'verification_pending' && (
                                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100/20 flex items-center gap-1">
                                        <Clock size={8} /> Review Requested
                                    </span>
                                )}
                                {s.swapStatus === 'accepted' && (
                                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-indigo-400 bg-slate-50 px-2 py-0.5 rounded">Mentorship Phase</span>
                                )}
                                {s.swapStatus === 'completed' && (
                                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-300 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                                        <Trophy size={8} /> Verified
                                    </span>
                                )}
                            </div>

                            <p className={`text-[13px] truncate font-semibold ${s.unreadCount && s.unreadCount > 0 ? 'text-slate-900 font-extrabold' : 'text-slate-400'}`}>
                                {s.lastMessage || 'Open protocol brief...'}
                            </p>
                        </div>

                        {s.unreadCount && s.unreadCount > 0 ? (
                            <div className="flex-shrink-0 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/10">
                                {s.unreadCount}
                            </div>
                        ) : null}
                    </button>
                )) : (
                    <div className="p-12 text-center text-slate-400">
                        <p className="text-sm font-bold uppercase tracking-widest">No Collaborators Found</p>
                    </div>
                )}
            </div>
        </div>
    );
};
