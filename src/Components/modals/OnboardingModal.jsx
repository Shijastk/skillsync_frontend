import React, { useState } from 'react';
import {
    ChevronRight, ChevronLeft, User, GraduationCap,
    BookOpen, Sparkles, X, Upload, Check
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useUpdateUser } from '../../hooks/useUsers';

// Predefined skills for easy selection
const POPULAR_SKILLS = [
    "JavaScript", "React", "Python", "Design", "Marketing",
    "Photography", "Spanish", "Public Speaking", "Guitar", "Cooking"
];

const OnboardingModal = ({ isOpen, onClose }) => {
    const { user, updateUser } = useAuthContext();
    const { success, error } = useToast();
    const updateUserMutation = useUpdateUser();

    const [step, setStep] = useState(1);
    const totalSteps = 4;

    const [formData, setFormData] = useState({
        bio: user?.bio || "",
        role: user?.role || "", // e.g. Frontend Developer
        location: user?.location || "",
        skillsToTeach: user?.skillsToTeach || [],
        skillsToLearn: user?.skillsToLearn || []
    });

    const [newSkillTeach, setNewSkillTeach] = useState("");
    const [newSkillLearn, setNewSkillLearn] = useState("");

    if (!isOpen) return null;

    // Handlers
    const handleNext = () => {
        if (step === 2 && formData.skillsToTeach.length === 0) {
            error("Please add at least one skill you can teach.");
            return;
        }
        if (step < totalSteps) setStep(step + 1);
        else handleFinish();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleAddSkill = (type, skillName) => {
        if (!skillName.trim()) return;

        // Create skill object structure: { name: "React", level: "Intermediate" }
        // For MVP just defaulting level to Intermediate
        const newSkill = { id: Date.now().toString(), name: skillName.trim(), level: "Intermediate" };

        setFormData(prev => {
            const list = type === 'teach' ? prev.skillsToTeach : prev.skillsToLearn;
            if (list.some(s => s.name === newSkill.name)) return prev; // avoid dupes

            return {
                ...prev,
                [type === 'teach' ? 'skillsToTeach' : 'skillsToLearn']: [...list, newSkill]
            };
        });

        if (type === 'teach') setNewSkillTeach("");
        else setNewSkillLearn("");
    };

    const removeSkill = (type, skillName) => {
        setFormData(prev => ({
            ...prev,
            [type === 'teach' ? 'skillsToTeach' : 'skillsToLearn']:
                (type === 'teach' ? prev.skillsToTeach : prev.skillsToLearn).filter(s => s.name !== skillName)
        }));
    };

    const handleFinish = async () => {
        try {
            // 1. Update Server (Mock)
            if (user?.id) {
                await updateUserMutation.mutateAsync({ id: user.id, data: formData });
            }

            // 2. Update Local Context
            updateUser({ ...user, ...formData });

            success("Profile Setup Complete!");
            onClose();
        } catch (err) {
            console.error("Onboarding Error:", err);
            error("Failed to save profile.");
        }
    };

    // Render Step Content
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                                <User size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Let's get to know you</h3>
                            <p className="text-gray-500 text-sm">Tell the community who you are</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Your Title / Role</label>
                                <input
                                    type="text"
                                    className="w-full border-b-2 border-gray-200 focus:border-black outline-none py-2 text-lg font-medium bg-transparent transition-colors"
                                    placeholder="e.g. UX Designer"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Short Bio</label>
                                <textarea
                                    className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-black outline-none resize-none bg-gray-50 focus:bg-white transition-all text-sm"
                                    rows="3"
                                    placeholder="What are you passionate about?"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Location</label>
                                <input
                                    type="text"
                                    className="w-full border-b-2 border-gray-200 focus:border-black outline-none py-2 text-sm"
                                    placeholder="City, Country or 'Remote'"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 hover:shadow-lg transition-transform hover:scale-105 duration-300">
                                <GraduationCap size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">What can you teach?</h3>
                            <p className="text-gray-500 text-sm">Share your expertise with others</p>
                        </div>

                        {/* Input Area */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black/5"
                                placeholder="Type a skill (e.g. Photography)"
                                value={newSkillTeach}
                                onChange={(e) => setNewSkillTeach(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill('teach', newSkillTeach)}
                            />
                            <button
                                onClick={() => handleAddSkill('teach', newSkillTeach)}
                                className="bg-black text-white px-4 rounded-xl hover:bg-gray-800 transition-colors"
                            >
                                Add
                            </button>
                        </div>

                        {/* Selected Tags */}
                        <div className="flex flex-wrap gap-2 min-h-[60px]">
                            {formData.skillsToTeach.map((skill, idx) => (
                                <span key={idx} className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 animate-popIn">
                                    {skill.name}
                                    <button onClick={() => removeSkill('teach', skill.name)} className="hover:text-indigo-900"><X size={14} /></button>
                                </span>
                            ))}
                        </div>

                        {/* Suggestions */}
                        <div className="border-t border-gray-100 pt-4">
                            <p className="text-xs text-gray-400 font-medium mb-3 uppercase">Popular Suggestions</p>
                            <div className="flex flex-wrap gap-2">
                                {POPULAR_SKILLS.slice(0, 6).map(s => (
                                    <button
                                        key={s}
                                        onClick={() => handleAddSkill('teach', s)}
                                        className="text-xs border border-gray-200 hover:border-black rounded-full px-3 py-1 text-gray-600 hover:text-black transition-colors"
                                    >
                                        + {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 hover:shadow-lg transition-transform hover:scale-105 duration-300">
                                <BookOpen size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">What do you want to learn?</h3>
                            <p className="text-gray-500 text-sm">Find partners to help you grow</p>
                        </div>

                        {/* Input Area */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black/5"
                                placeholder="Type a skill goal..."
                                value={newSkillLearn}
                                onChange={(e) => setNewSkillLearn(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill('learn', newSkillLearn)}
                            />
                            <button
                                onClick={() => handleAddSkill('learn', newSkillLearn)}
                                className="bg-black text-white px-4 rounded-xl hover:bg-gray-800 transition-colors"
                            >
                                Add
                            </button>
                        </div>

                        {/* Selected Tags */}
                        <div className="flex flex-wrap gap-2 min-h-[60px]">
                            {formData.skillsToLearn.map((skill, idx) => (
                                <span key={idx} className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 animate-popIn">
                                    {skill.name}
                                    <button onClick={() => removeSkill('learn', skill.name)} className="hover:text-emerald-900"><X size={14} /></button>
                                </span>
                            ))}
                        </div>
                        {/* Suggestions */}
                        <div className="border-t border-gray-100 pt-4">
                            <p className="text-xs text-gray-400 font-medium mb-3 uppercase">Popular Suggestions</p>
                            <div className="flex flex-wrap gap-2">
                                {POPULAR_SKILLS.slice(4).map(s => (
                                    <button
                                        key={s}
                                        onClick={() => handleAddSkill('learn', s)}
                                        className="text-xs border border-gray-200 hover:border-emerald-500 rounded-full px-3 py-1 text-gray-600 hover:text-emerald-600 transition-colors"
                                    >
                                        + {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="text-center space-y-6 animate-fadeIn py-6">
                        <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
                            <Sparkles size={48} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h3>
                            <p className="text-gray-500  mx-auto">
                                Your profile is ready. We've found some potential skill swaps for you based on your interests.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-2xl mx-auto border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 text-sm">Role</span>
                                <span className="font-semibold text-gray-900">{formData.role || "Member"}</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 text-sm">Skills</span>
                                <span className="font-semibold text-gray-900">{formData.skillsToTeach.length} Added</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 text-sm">Goals</span>
                                <span className="font-semibold text-gray-900">{formData.skillsToLearn.length} Set</span>
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-[600px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Progress Bar */}
                <div className="h-1.5 bg-gray-100 w-full">
                    <div
                        className="h-full bg-black transition-all duration-500 ease-out"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    ></div>
                </div>

                {/* Header Actions */}
                <div className="flex justify-between items-center p-6 pb-2">
                    {step > 1 ? (
                        <button onClick={handleBack} className="text-gray-400 hover:text-black transition-colors rounded-full p-1 hover:bg-gray-100">
                            <ChevronLeft size={24} />
                        </button>
                    ) : <div className="w-8"></div>}

                    <div className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                        Step {step} of {totalSteps}
                    </div>

                    <div className="w-8"></div> {/* Spacer for alignment */}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-8 py-4">
                    {renderStep()}
                </div>

                {/* Footer */}
                <div className="p-8 pt-4">
                    <button
                        onClick={handleNext}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {step === totalSteps ? (
                            <>Get Started <Check size={20} /></>
                        ) : (
                            <>Continue <ChevronRight size={20} /></>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default OnboardingModal;
