import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    X, Check, Moon, Calendar, Sun, Handshake, Video, Share2, FileCode,
    Star, MapPin, RefreshCw, ChevronRight, ChevronLeft, Send, PartyPopper
} from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useCreateSwap } from "../../hooks/useSwaps";
import { useCreateConversation, useSendMessage } from "../../hooks/useMessages";

const RequestSwapModal = ({ isOpen: externalIsOpen, onClose: externalOnClose, targetUser } = {}) => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuthContext();
    const { error } = useToast();
    const [isOpen, setIsOpen] = useState(externalIsOpen !== undefined ? externalIsOpen : false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mutations
    const createSwapMutation = useCreateSwap();
    const createConversationMutation = useCreateConversation();
    const sendMessageMutation = useSendMessage();

    const [formData, setFormData] = useState({
        learnSkill: "",
        teachSkill: "",
        message: "",
        availability: "",
        duration: "1 hour",
        preferences: {
            videoCalls: true,
            screenSharing: false,
            projectBased: false,
        },
    });

    // Auto-fill effects when modal opens
    useEffect(() => {
        if (isOpen && targetUser && currentUser) {
            // Smart match: What I teach that they want
            const mySkills = (currentUser.skillsToTeach || []).map(s => s.name || s);
            const theirWants = targetUser.wants || [];
            const matchTeach = mySkills.find(s => theirWants.includes(s)) || mySkills[0] || "";

            // Smart match: What they teach (just pick first)
            const theirTeaches = targetUser.teaches || targetUser.skills || [];
            const matchLearn = theirTeaches[0] || "";

            setFormData(prev => ({
                ...prev,
                teachSkill: matchTeach,
                learnSkill: matchLearn
            }));
        }
    }, [isOpen, targetUser, currentUser]);

    // Sync with external prop if provided
    useEffect(() => {
        if (externalIsOpen !== undefined) {
            setIsOpen(externalIsOpen);
        }
    }, [externalIsOpen]);

    // Use provided user data or fallback (should always provide targetUser in real app)
    const user = targetUser || {
        id: "mock_id",
        name: "Sarah Chen",
        role: "Senior UX Designer",
        rating: 4.9,
        swaps: 47,
        location: "San Francisco",
        initials: "SC",
        skills: ["Figma", "UI Design"] // Mock fallback
    };

    // Mock skills if not provided in user object
    const skillsToLearn = user.teaches || user.skills || [
        "Figma & Design Tools",
        "UX Research & Testing",
        "Design Systems",
        "UI Design Principles",
    ];

    // Get real skills from current user
    const skillsToTeach = (currentUser?.skillsToTeach || []).map(s => s.name || s);
    if (skillsToTeach.length === 0) {
        // Fallback if user has no skills listed
        skillsToTeach.push("Coding", "Mentorship");
    }

    const timeOptions = [
        { value: "Weekday Evenings", icon: Moon, label: "Weekday Evenings" },
        { value: "Weekends", icon: Calendar, label: "Weekends" },
        { value: "Weekday Mornings", icon: Sun, label: "Weekday Mornings" },
        { value: "Flexible", icon: Handshake, label: "Flexible" },
    ];

    const durationOptions = [
        { value: "1 hour", label: "1 hour" },
        { value: "1.5 hours", label: "1.5 hours" },
        { value: "2 hours", label: "2 hours" },
    ];

    const preferenceOptions = [
        { id: "videoCalls", label: "Video calls (Zoom, Meet, etc.)", icon: Video },
        { id: "screenSharing", label: "Screen sharing sessions", icon: Share2 },
        { id: "projectBased", label: "Project-based learning", icon: FileCode },
    ];

    // Remove auto-open effect when used as controlled component
    useEffect(() => {
        if (externalIsOpen === undefined) {
            const timer = setTimeout(() => setIsOpen(true), 500);
            return () => clearTimeout(timer);
        }
    }, [externalIsOpen]);

    const handleOpen = () => setIsOpen(true);

    const handleClose = () => {
        setIsOpen(false);
        if (externalOnClose) externalOnClose();
        // Reset after closing
        setTimeout(() => {
            setCurrentStep(1);
            setIsSubmitting(false);
            setFormData({
                learnSkill: "",
                teachSkill: "",
                message: "",
                availability: "",
                duration: "1 hour",
                preferences: {
                    videoCalls: true,
                    screenSharing: false,
                    projectBased: false,
                },
            });
        }, 300);
    };

    const handleSubmitSwap = async () => {
        if (!currentUser) {
            error("Please login to request a swap");
            navigate('/login');
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Create Swap Record
            const swapData = {
                requesterId: currentUser.id,
                receiverId: user.id,
                learnSkill: formData.learnSkill,
                teachSkill: formData.teachSkill,
                message: formData.message,
                availability: formData.availability,
                duration: formData.duration,
                preferences: formData.preferences,
                status: "pending",
                createdAt: new Date().toISOString(),
            };

            const newSwap = await createSwapMutation.mutateAsync(swapData);

            // 2. Create/Get Conversation
            // Check for existing conversation or create new one
            // For MVP, we'll create a new conversation for context
            const conversationData = {
                participants: [currentUser.id, user.id],
                lastMessage: "Swap Request: " + formData.teachSkill + " ⇄ " + formData.learnSkill,
                lastMessageTime: new Date().toISOString(),
                isGroup: false,
                type: "swap_request",
                contextId: newSwap.id
            };

            const conversation = await createConversationMutation.mutateAsync(conversationData);

            // 3. Send Initial Message
            const messageData = {
                conversationId: conversation.id,
                senderId: currentUser.id,
                content: `Hi! I'd like to swap skills with you.\n\nI can teach: ${formData.teachSkill}\nI want to learn: ${formData.learnSkill}\n\n${formData.message}`,
                type: "text",
                timestamp: new Date().toISOString(),
                isRead: false
            };

            await sendMessageMutation.mutateAsync(messageData);

            // 4. Show Success & Redirect
            setCurrentStep(5);
        } catch (err) {
            console.error("Failed to create swap:", err);
            error("Failed to create swap request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {
        // Validation
        if (currentStep === 1 && (!formData.learnSkill || !formData.teachSkill)) {
            error("Please select both skills");
            return;
        }

        if (currentStep === 2 && formData.message.length < 20) {
            error("Please write a message (at least 20 characters)");
            return;
        }

        if (currentStep === 3 && !formData.availability) {
            error("Please select your availability");
            return;
        }

        if (currentStep === 4) {
            handleSubmitSwap();
            return;
        }

        if (currentStep === 5) {
            handleClose();
            // Redirect to messages
            navigate('/messages');
            return;
        }

        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handlePreferenceChange = (preference) => {
        setFormData((prev) => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [preference]: !prev.preferences[preference],
            },
        }));
    };

    const handleAvailabilitySelect = (value) => {
        setFormData((prev) => ({ ...prev, availability: value }));
    };

    if (!isOpen) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <button
                    onClick={handleOpen}
                    className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                    Request Swap
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-semibold">Request Swap</h2>
                        <button
                            onClick={handleClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map((step) => (
                                <div
                                    key={step}
                                    className={`h-1 flex-1 rounded-full transition-colors ${step <= currentStep ? "bg-black" : "bg-gray-200"
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">Step {currentStep} of 4</p>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Step 1: User & Skills */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-xl p-6">
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-2xl">
                                        {user.initials || user.name?.[0]}
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h3 className="text-xl font-semibold">{user.name}</h3>
                                        <p className="text-gray-600">{user.role}</p>
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                                            {user.rating && (
                                                <span className="flex items-center gap-1">
                                                    <Star size={14} />
                                                    {user.rating}
                                                </span>
                                            )}
                                            {user.swaps && (
                                                <span className="flex items-center gap-1">
                                                    <RefreshCw size={14} />
                                                    {user.swaps} swaps
                                                </span>
                                            )}
                                            {user.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={14} />
                                                    {user.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        What do you want to learn?
                                    </label>
                                    <select
                                        value={formData.learnSkill}
                                        onChange={(e) =>
                                            handleInputChange("learnSkill", e.target.value)
                                        }
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white focus:border-black focus:ring-0"
                                    >
                                        <option value="">Choose a skill...</option>
                                        {skillsToLearn.map((skill) => (
                                            <option key={skill} value={skill}>
                                                {skill}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        What will you teach?
                                    </label>
                                    <select
                                        value={formData.teachSkill}
                                        onChange={(e) =>
                                            handleInputChange("teachSkill", e.target.value)
                                        }
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white focus:border-black focus:ring-0"
                                    >
                                        <option value="">Choose a skill...</option>
                                        {skillsToTeach.map((skill) => (
                                            <option key={skill} value={skill}>
                                                {skill}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Select skills that match your expertise
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Message */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-xl p-6">
                                <p className="text-sm text-gray-500 text-center mb-4">
                                    Your Exchange
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                                    <div className="bg-white rounded-lg p-4 text-center">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                                            You Teach
                                        </p>
                                        <p className="font-semibold">
                                            {formData.teachSkill || "-"}
                                        </p>
                                    </div>
                                    <div className="flex justify-center">
                                        <RefreshCw
                                            className="text-gray-300 rotate-90 md:rotate-0"
                                            size={24}
                                        />
                                    </div>
                                    <div className="bg-white rounded-lg p-4 text-center">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                                            You Learn
                                        </p>
                                        <p className="font-semibold">
                                            {formData.learnSkill || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Introduce yourself
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => handleInputChange("message", e.target.value)}
                                    placeholder="Tell your match about your experience and why you'd like to swap skills..."
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg min-h-[120px] focus:border-black focus:ring-0"
                                    maxLength={500}
                                />
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {formData.message.length}/500
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Schedule */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-3">
                                    When are you available?
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {timeOptions.map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => handleAvailabilitySelect(option.value)}
                                                className={`p-4 border-2 rounded-lg text-center transition-colors ${formData.availability === option.value
                                                    ? "border-black bg-black text-white"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <Icon className="mx-auto mb-2" size={24} />
                                                <div className="text-sm font-medium">
                                                    {option.label}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Session length
                                </label>
                                <select
                                    value={formData.duration}
                                    onChange={(e) =>
                                        handleInputChange("duration", e.target.value)
                                    }
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white focus:border-black focus:ring-0"
                                >
                                    {durationOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-3">
                                    Preferences
                                </label>
                                <div className="space-y-2">
                                    {preferenceOptions.map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <label
                                                key={option.id}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.preferences[option.id]}
                                                    onChange={() => handlePreferenceChange(option.id)}
                                                    className="w-5 h-5 text-black focus:ring-black"
                                                />
                                                <Icon size={18} className="text-gray-600" />
                                                <span className="flex-1 text-sm">{option.label}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {currentStep === 4 && (
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                                    Skills Exchange
                                </p>
                                <p className="text-sm">
                                    You teach:{" "}
                                    <span className="font-semibold">{formData.teachSkill}</span>
                                    <br />
                                    You learn:{" "}
                                    <span className="font-semibold">{formData.learnSkill}</span>
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                                    Your Message
                                </p>
                                <p className="text-sm whitespace-pre-wrap">
                                    {formData.message}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                                    Schedule
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">{formData.availability}</span>
                                    <br />
                                    {formData.duration} per session
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                                    Sending To
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-semibold">
                                        {user.initials || user.name?.[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{user.name}</h4>
                                        <p className="text-sm text-gray-600">{user.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Success */}
                    {currentStep === 5 && (
                        <div className="text-center py-8">
                            <PartyPopper className="mx-auto mb-4 text-green-500" size={64} />
                            <h3 className="text-2xl font-semibold mb-2">Request Sent!</h3>
                            <p className="text-gray-600 px-4 mb-4">
                                {user.name} will be notified about your swap request.
                            </p>
                            <button
                                onClick={() => {
                                    handleClose();
                                    navigate('/messages');
                                }}
                                className="text-blue-600 font-medium hover:underline"
                            >
                                Go to Messages
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100">
                    <div className="flex justify-between">
                        {currentStep > 1 && currentStep < 5 && (
                            <button
                                onClick={handleBack}
                                disabled={isSubmitting}
                                className="px-6 py-3 border-2 border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <ChevronLeft size={18} />
                                Back
                            </button>
                        )}

                        <div className={`${currentStep > 1 ? "ml-auto" : "w-full"}`}>
                            <button
                                onClick={handleNext}
                                disabled={isSubmitting}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 w-full flex items-center justify-center gap-2 shadow-sm border-0
                  ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-black text-white hover:shadow active:scale-[0.98]"}
                `}
                            >
                                {isSubmitting ? (
                                    "Sending..."
                                ) : currentStep === 4 ? (
                                    <>
                                        <Send size={18} />
                                        Send Request
                                    </>
                                ) : currentStep === 5 ? (
                                    "Done"
                                ) : (
                                    <>
                                        Next
                                        <ChevronRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestSwapModal;
