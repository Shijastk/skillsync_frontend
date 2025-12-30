import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, ChevronRight, Monitor, MapPin, Video, Search } from 'lucide-react';

export const ScheduleModal = ({ isOpen, onClose, onSchedule, swapperName, initialData }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [modality, setModality] = useState('online');
    const [locationText, setLocationText] = useState('');

    useEffect(() => {
        if (isOpen && initialData) {
            if (initialData.scheduledDate) {
                const d = new Date(initialData.scheduledDate);
                if (!isNaN(d.getTime())) {
                    // Format YYYY-MM-DD
                    const dateStr = d.toISOString().split('T')[0];
                    // Format HH:MM
                    const timeStr = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                    setDate(dateStr);
                    setTime(timeStr);
                }
            }
            if (initialData.modality) {
                setModality(initialData.modality);
            }
            if (initialData.location) {
                setLocationText(initialData.location);
            }
        } else if (isOpen) {
            // Reset if opening fresh
            setDate('');
            setTime('');
            setModality('online');
            setLocationText('');
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!date || !time) return;

        if (modality === 'in-person' && !locationText.trim()) {
            return;
        }

        const selectedDate = new Date(`${date}T${time}`);
        const formattedDate = selectedDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Generate detail: Jitsi link for online, location text for in-person
        const detail = modality === 'online'
            ? `https://meet.jit.si/SkillSwap-${Math.random().toString(36).substring(7)}`
            : locationText;

        onSchedule(formattedDate, modality, detail, selectedDate.toISOString());
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />

            <div className="relative bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 w-full max-w-[500px]">
                <div className="p-10 pb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-slate-900 font-extrabold text-2xl tracking-tighter">Propose Session</h2>
                        <p className="text-slate-400 text-[13px] font-medium mt-1">Booking collaboration with {swapperName}</p>
                    </div>
                    <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-50">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 pt-2 space-y-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setModality('online')}
                                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${modality === 'online' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                            >
                                <Monitor size={24} className={modality === 'online' ? 'text-indigo-600' : 'text-slate-400'} />
                                <span className={`text-[11px] font-extrabold uppercase tracking-widest ${modality === 'online' ? 'text-indigo-600' : 'text-slate-400'}`}>Online</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setModality('in-person')}
                                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${modality === 'in-person' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                            >
                                <MapPin size={24} className={modality === 'in-person' ? 'text-indigo-600' : 'text-slate-400'} />
                                <span className={`text-[11px] font-extrabold uppercase tracking-widest ${modality === 'in-person' ? 'text-indigo-600' : 'text-slate-400'}`}>In-Person</span>
                            </button>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                <Calendar size={14} className="text-indigo-600" /> Collaboration Date
                            </label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 focus:outline-none transition-all font-bold"
                            />
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                <Clock size={14} className="text-indigo-600" /> Professional Window
                            </label>
                            <input
                                type="time"
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 focus:outline-none transition-all font-bold"
                            />
                        </div>

                        {modality === 'online' ? (
                            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-3">
                                <Video size={20} className="text-indigo-600" />
                                <span className="text-[11px] font-bold text-indigo-900">A free Jitsi Meet room will be generated automatically.</span>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                    <Search size={14} className="text-indigo-600" /> Location Details
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={locationText}
                                    onChange={(e) => setLocationText(e.target.value)}
                                    placeholder="Enter meeting location (e.g. Starbucks, Main Library)"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 focus:outline-none transition-all font-bold text-sm"
                                />
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-5 text-slate-500 text-[11px] font-bold uppercase tracking-widest hover:text-slate-900 transition-all rounded-2xl border border-slate-100 hover:bg-slate-50"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-5 bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 active:scale-95"
                        >
                            Confirm Session <ChevronRight size={16} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
