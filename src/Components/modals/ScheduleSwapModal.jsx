import React, { useState, useMemo } from 'react';
import { X, Calendar, Clock, Video, Users, MessageCircle, ChevronRight } from 'lucide-react';
import { useUpdateSwap } from '../../hooks/useSwaps';
import { useToast } from '../../context/ToastContext';

const ScheduleSwapModal = ({ isOpen, onClose, swap }) => {
    // Extract duration from meta array (e.g., "1.5 hours" -> "1.5")
    const getInitialDuration = () => {
        const durationMeta = swap?.meta?.find(m => m.label?.includes('hour'));
        if (durationMeta?.label) {
            const match = durationMeta.label.match(/(\d+\.?\d*)/);
            return match ? match[1] : '1';
        }
        return '1';
    };

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [duration, setDuration] = useState(getInitialDuration());
    const [sessionType, setSessionType] = useState('video');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const updateSwapMutation = useUpdateSwap();
    const { success, error: showError } = useToast();

    // Extract data from already-transformed swap object (from MySwaps)
    const swapInfo = useMemo(() => {
        if (!swap) return null;

        // Partner is in participants array (MySwaps already determined which one)
        const partner = swap.participants?.find(p => p.role === 'Skill Swapper') || swap.participants?.[1];

        return {
            partnerName: partner?.name || 'Skill Swapper',
            partnerInitials: partner?.initials || 'SS',
            partnerAvatar: partner?.avatar,
            youTeach: swap.skills?.teach || 'Skill',
            youLearn: swap.skills?.learn || 'Skill'
        };
    }, [swap]);

    if (!isOpen || !swap || !swapInfo) return null;

    const handleSchedule = async () => {
        if (!selectedDate || !selectedTime) {
            showError('Please select both date and time');
            return;
        }

        setIsLoading(true);

        try {
            // Combine date and time
            const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);

            await updateSwapMutation.mutateAsync({
                id: swap.id,
                data: {
                    status: 'scheduled',
                    scheduledDate: scheduledDateTime.toISOString(),
                    duration: `${duration} hour${duration > 1 ? 's' : ''}`,
                    sessionType,
                    notes
                }
            });

            success('Session scheduled successfully! 🎉');
            onClose();
        } catch (err) {
            showError('Failed to schedule session. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Generate time slots (9 AM to 9 PM)
    const timeSlots = [];
    for (let hour = 9; hour <= 21; hour++) {
        const time24 = `${hour.toString().padStart(2, '0')}:00`;
        const time12 = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
        timeSlots.push({ value: time24, label: time12 });
    }

    // Get minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                            <Calendar className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Schedule Session</h2>
                            <p className="text-gray-300 text-sm">Set up your first swap session</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                        <X className="text-white" size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {/* Swap Info Card */}
                    <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                    {swapInfo.partnerInitials}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{swapInfo.partnerName}</p>
                                    <p className="text-sm text-gray-500">Skill Swapper</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                                <p className="text-gray-500 text-xs mb-1">You teach</p>
                                <p className="font-semibold text-gray-900">{swapInfo.youTeach}</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                                <p className="text-gray-500 text-xs mb-1">You learn</p>
                                <p className="font-semibold text-gray-900">{swapInfo.youLearn}</p>
                            </div>
                        </div>
                    </div>

                    {/* Date Selection */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                            <Calendar size={18} className="text-gray-600" />
                            Select Date
                        </label>
                        <input
                            type="date"
                            min={today}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-gray-900 font-medium"
                        />
                    </div>

                    {/* Time Selection */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                            <Clock size={18} className="text-gray-600" />
                            Select Time
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {timeSlots.map((slot) => (
                                <button
                                    key={slot.value}
                                    onClick={() => setSelectedTime(slot.value)}
                                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${selectedTime === slot.value
                                        ? 'bg-gray-900 text-white shadow-lg scale-105'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {slot.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                            <Clock size={18} className="text-gray-600" />
                            Duration
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {['0.5', '1', '1.5', '2'].map((dur) => (
                                <button
                                    key={dur}
                                    onClick={() => setDuration(dur)}
                                    className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${duration === dur
                                        ? 'bg-gray-900 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {dur === '0.5' ? '30 min' : `${dur} hr${dur > 1 ? 's' : ''}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Session Type */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                            <Video size={18} className="text-gray-600" />
                            Session Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setSessionType('video')}
                                className={`p-4 rounded-xl border-2 transition-all ${sessionType === 'video'
                                    ? 'border-gray-900 bg-gray-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Video size={24} className={sessionType === 'video' ? 'text-gray-900' : 'text-gray-400'} />
                                <p className="font-semibold text-gray-900 mt-2">Video Call</p>
                                <p className="text-xs text-gray-500">Online session</p>
                            </button>
                            <button
                                onClick={() => setSessionType('in-person')}
                                className={`p-4 rounded-xl border-2 transition-all ${sessionType === 'in-person'
                                    ? 'border-gray-900 bg-gray-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Users size={24} className={sessionType === 'in-person' ? 'text-gray-900' : 'text-gray-400'} />
                                <p className="font-semibold text-gray-900 mt-2">In Person</p>
                                <p className="text-xs text-gray-500">Meet locally</p>
                            </button>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                            <MessageCircle size={18} className="text-gray-600" />
                            Notes (Optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any details about the session..."
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-colors resize-none text-gray-900"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSchedule}
                        disabled={isLoading || !selectedDate || !selectedTime}
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${isLoading || !selectedDate || !selectedTime
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gray-900 hover:bg-gray-800 shadow-lg hover:shadow-xl'
                            }`}
                    >
                        {isLoading ? (
                            'Scheduling...'
                        ) : (
                            <>
                                Schedule Session
                                <ChevronRight size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleSwapModal;
