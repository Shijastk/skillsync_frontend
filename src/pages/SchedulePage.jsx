import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Video, User, Calendar as CalendarIcon, MoreVertical } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { useUserSwaps } from '../hooks/useSwaps';
import { useUsers } from '../hooks/useUsers';
import LoadingSpinner from '../Components/common/LoadingSpinner';

const SchedulePage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const { user: currentUser } = useAuthContext();
    const { data: userSwaps, isLoading: isLoadingSwaps } = useUserSwaps(currentUser?.id);
    const { data: usersData, isLoading: isLoadingUsers } = useUsers();

    // Process Swaps into Calendar Events
    const events = useMemo(() => {
        if (!userSwaps || !usersData) return [];

        return userSwaps
            .filter(s => s.status === 'scheduled') // Only scheduled swaps
            .map(s => {
                const partnerId = s.requesterId === currentUser.id ? s.receiverId : s.requesterId;
                const partner = usersData.find(u => u.id === partnerId);

                return {
                    id: s.id,
                    title: `Swap with ${partner?.firstName || 'User'}`,
                    partnerName: `${partner?.firstName} ${partner?.lastName}` || 'Skill Swapper',
                    partnerRole: partner?.bio?.split('.')[0] || 'Member',
                    partnerAvatar: partner?.firstName?.[0] || '?',
                    skill: s.skillOffered || s.skillRequested || "Skill Swap",
                    date: parseISO(s.scheduledDate || new Date().toISOString()), // Ensure date field exists
                    time: new Date(s.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    duration: s.duration || '1 hr',
                    type: 'video'
                };
            });
    }, [userSwaps, usersData, currentUser]);

    // Calendar Grid Generation
    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [currentDate]);

    const selectedDateEvents = useMemo(() => {
        return events.filter(event => isSameDay(event.date, selectedDate));
    }, [events, selectedDate]);

    const upcomingEvents = useMemo(() => {
        return events
            .filter(e => e.date >= new Date())
            .sort((a, b) => a.date - b.date)
            .slice(0, 3);
    }, [events]);

    if (isLoadingSwaps || isLoadingUsers) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
                        <p className="text-gray-500 mt-1">Manage your upcoming skill swaps</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                        <CalendarIcon size={18} />
                        <span>Sync Calendar</span>
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Calendar View (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Calendar Header */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {format(currentDate, 'MMMM yyyy')}
                                </h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => setCurrentDate(new Date())}
                                        className="px-3 py-1 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                                    >
                                        Today
                                    </button>
                                    <button
                                        onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Days Header */}
                            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 min-h-[500px]">
                                {calendarDays.map((day, idx) => {
                                    const dayEvents = events.filter(e => isSameDay(e.date, day));
                                    const isSelected = isSameDay(day, selectedDate);
                                    const isCurrentMonth = isSameMonth(day, currentDate);
                                    const isTodayDate = isToday(day);

                                    return (
                                        <div
                                            key={day.toISOString()}
                                            onClick={() => setSelectedDate(day)}
                                            className={`min-h-[100px] border-b border-r border-gray-100 p-2 cursor-pointer transition-colors relative
                        ${!isCurrentMonth ? 'bg-gray-50/50 text-gray-400' : 'bg-white'}
                        ${isSelected ? 'bg-blue-50 ring-2 ring-inset ring-blue-500/20' : 'hover:bg-gray-50'}
                      `}
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                          ${isTodayDate ? 'bg-black text-white' : ''}
                        `}>
                                                    {format(day, 'd')}
                                                </span>
                                                {dayEvents.length > 0 && (
                                                    <span className="text-[10px] font-bold text-gray-400">{dayEvents.length}</span>
                                                )}
                                            </div>

                                            <div className="mt-2 space-y-1">
                                                {dayEvents.slice(0, 3).map((evt, i) => (
                                                    <div
                                                        key={i}
                                                        className="text-[10px] text-gray-700 bg-blue-100/50 border border-blue-100 rounded px-1.5 py-0.5 truncate flex items-center gap-1"
                                                    >
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                        {evt.time}
                                                    </div>
                                                ))}
                                                {dayEvents.length > 3 && (
                                                    <div className="text-[10px] text-gray-400 pl-1">
                                                        + {dayEvents.length - 3} more
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Selected Day & Upcoming (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Selected Date View */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-black rounded-full"></span>
                                {format(selectedDate, 'EEEE, MMMM do')}
                            </h3>

                            <div className="space-y-4">
                                {selectedDateEvents.length > 0 ? selectedDateEvents.map(event => (
                                    <div key={event.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-300 transition-colors group">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{event.title}</h4>
                                                <p className="text-xs text-gray-500 font-medium">{event.skill}</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-bold text-gray-900">{event.time}</span>
                                                <span className="text-xs text-gray-500">{event.duration}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                                                    {event.partnerAvatar}
                                                </div>
                                                <span className="text-sm text-gray-600">{event.partnerName}</span>
                                            </div>
                                            <button className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm">
                                                <Video size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-gray-400">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                            <CalendarIcon size={24} className="opacity-50" />
                                        </div>
                                        <p>No lectures scheduled</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Upcoming Summary */}
                        <div className="bg-black text-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg">Next Up</h3>
                                <button className="text-xs text-gray-400 hover:text-white transition-colors">View All</button>
                            </div>

                            <div className="space-y-4">
                                {upcomingEvents.map((evt, idx) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                        <div className="flex flex-col items-center bg-gray-800 rounded-lg p-2 min-w-[3.5rem]">
                                            <span className="text-xs text-gray-400 font-medium">{format(evt.date, 'MMM')}</span>
                                            <span className="text-lg font-bold">{format(evt.date, 'd')}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm">{evt.title}</h4>
                                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                                                <Clock size={12} />
                                                {format(evt.date, 'eeee')} • {evt.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {upcomingEvents.length === 0 && (
                                    <p className="text-gray-400 text-sm">No upcoming sessions.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchedulePage;
