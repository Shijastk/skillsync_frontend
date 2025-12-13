import React, { useState, useEffect } from "react";
import {
    X,
    Check,
    Users,
    Calendar,
    Monitor,
    Globe,
    Paintbrush,
    Code2,
    Database,
    Target,
    Smartphone,
    Cloud,
    Rocket,
    Film,
    Camera,
    PenTool,
    Briefcase,
} from "lucide-react";
import { useCreateGroup } from '../../hooks/useGroups';

const CreateGroupModal = ({ isOpen: externalIsOpen, onClose: externalOnClose } = {}) => {
    const [isOpen, setIsOpen] = useState(externalIsOpen !== undefined ? externalIsOpen : false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        groupName: "",
        groupDesc: "",
        icon: "design",
        category: "",
        topics: "",
        size: "medium",
        frequency: "weekly",
        meetingType: "virtual",
    });

    // Sync with external prop if provided
    useEffect(() => {
        if (externalIsOpen !== undefined) {
            setIsOpen(externalIsOpen);
        }
    }, [externalIsOpen]);

    const icons = [
        { id: "design", icon: Paintbrush },
        { id: "react", icon: Code2 },
        { id: "python", icon: Code2 },
        { id: "cloud", icon: Cloud },
        { id: "data", icon: Database },
        { id: "target", icon: Target },
        { id: "mobile", icon: Smartphone },
        { id: "code", icon: Code2 },
        { id: "rocket", icon: Rocket },
        { id: "film", icon: Film },
        { id: "camera", icon: Camera },
        { id: "write", icon: PenTool },
    ];

    const categories = [
        { id: "design", icon: Paintbrush, label: "Design" },
        { id: "development", icon: Code2, label: "Development" },
        { id: "data-science", icon: Database, label: "Data Science" },
        { id: "marketing", icon: Target, label: "Marketing" },
        { id: "product", icon: Smartphone, label: "Product" },
        { id: "devops", icon: Cloud, label: "DevOps" },
        { id: "business", icon: Briefcase, label: "Business" },
        { id: "content", icon: PenTool, label: "Content" },
    ];

    const sizeOptions = [
        {
            value: "small",
            label: "Small (5-15 members)",
            description: "Intimate group for focused learning",
        },
        {
            value: "medium",
            label: "Medium (16-30 members)",
            description: "Balanced community size",
        },
        {
            value: "large",
            label: "Large (31+ members)",
            description: "Open community for everyone",
        },
    ];

    const frequencyOptions = [
        { value: "daily", label: "Daily", description: "Very active community" },
        { value: "weekly", label: "Weekly", description: "Regular meetups" },
        { value: "biweekly", label: "Bi-weekly", description: "Every 2 weeks" },
        { value: "monthly", label: "Monthly", description: "Once per month" },
    ];

    const meetingTypeOptions = [
        {
            value: "virtual",
            icon: Monitor,
            label: "Virtual",
            description: "Online meetings only",
        },
        {
            value: "inperson",
            icon: Users,
            label: "In-Person",
            description: "Face-to-face meetings",
        },
        {
            value: "hybrid",
            icon: Globe,
            label: "Hybrid",
            description: "Both virtual and in-person",
        },
    ];

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                handleClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
        setIsOpen(false);
        if (externalOnClose) externalOnClose();
        // Reset to step 1 after closing
        setTimeout(() => setCurrentStep(1), 300);
    };

    // Mutation
    const { mutate: createGroup, isPending } = useCreateGroup();

    const handleNext = () => {
        if (currentStep === 1) {
            if (!formData.groupName.trim()) {
                alert("Please enter a group name");
                return;
            }
            if (formData.groupDesc.length < 20) {
                alert("Please write a description (at least 20 characters)");
                return;
            }
        }
        if (currentStep === 2 && !formData.category) {
            alert("Please select a category");
            return;
        }
        if (currentStep === 4) {
            // Create Group Payload
            const newGroup = {
                name: formData.groupName,
                description: formData.groupDesc,
                category: formData.category,
                icon: formData.icon,
                skills: formData.topics ? formData.topics.split(',').map(s => s.trim()) : [],
                size: formData.size,
                frequency: formData.frequency,
                meetingType: formData.meetingType,
                memberCount: 1, // Creator
                rating: 0,
                activity: 'New',
                bannerColor: 'bg-indigo-600', // Default or random
                avatarColor: 'bg-indigo-500', // Default
                createdAt: new Date().toISOString()
            };

            createGroup(newGroup, {
                onSuccess: () => {
                    setCurrentStep(5);
                },
                onError: (err) => {
                    alert("Failed to create group: " + err.message);
                }
            });
            return;
        }
        setCurrentStep((prev) => Math.min(prev + 1, 5));
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const getSelectedIcon = () => {
        const icon = icons.find((i) => i.id === formData.icon);
        return icon
            ? React.createElement(icon.icon, { className: "w-6 h-6" })
            : null;
    };

    const getCategoryIcon = () => {
        const category = categories.find((c) => c.id === formData.category);
        return category
            ? React.createElement(category.icon, { className: "w-8 h-8 text-white" })
            : null;
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-black mb-2">
                                Group Name
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none transition-colors bg-white"
                                placeholder="e.g., React Developers Hub"
                                maxLength={60}
                                value={formData.groupName}
                                onChange={(e) => handleChange("groupName", e.target.value)}
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Choose a clear, descriptive name (max 60 characters)
                            </p>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-black mb-2">
                                Description
                            </label>
                            <textarea
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none transition-colors min-h-[100px] resize-y bg-white"
                                placeholder="What will members learn and share in this group? What makes it special?"
                                maxLength={300}
                                value={formData.groupDesc}
                                onChange={(e) => handleChange("groupDesc", e.target.value)}
                            />
                            <div className="text-right text-xs text-gray-500 mt-1">
                                {formData.groupDesc.length}/300
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-black mb-2">
                                Choose an Icon
                            </label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                                {icons.map(({ id, icon: Icon }) => {
                                    const isSelected = formData.icon === id;
                                    return (
                                        <button
                                            key={id}
                                            className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-all ${isSelected
                                                ? "bg-black border-black text-white scale-105"
                                                : "bg-white border-gray-300 hover:border-black hover:bg-gray-50"
                                                }`}
                                            onClick={() => handleChange("icon", id)}
                                        >
                                            <Icon
                                                className={`w-5 h-5 sm:w-6 sm:h-6 ${isSelected ? "text-white" : "text-black"
                                                    }`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-black mb-2">
                                Primary Category
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {categories.map(({ id, icon: Icon, label }) => {
                                    const isSelected = formData.category === id;
                                    return (
                                        <button
                                            key={id}
                                            className={`px-3 py-3 sm:px-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all text-xs sm:text-sm ${isSelected
                                                ? "bg-black border-black text-white"
                                                : "bg-white border-gray-300 hover:border-black hover:bg-gray-50"
                                                }`}
                                            onClick={() => handleChange("category", id)}
                                        >
                                            <Icon
                                                className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isSelected ? "text-white" : "text-black"
                                                    }`}
                                            />
                                            <span
                                                className={`font-medium ${isSelected ? "text-white" : "text-black"
                                                    }`}
                                            >
                                                {label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-black mb-2">
                                Skills & Topics (Optional)
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none transition-colors bg-white"
                                placeholder="e.g., React, TypeScript, Next.js (comma separated)"
                                value={formData.topics}
                                onChange={(e) => handleChange("topics", e.target.value)}
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Add relevant skills to help people find your group
                            </p>
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-black mb-4">
                                Group Size
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {sizeOptions.map(({ value, label, description }) => {
                                    const isSelected = formData.size === value;
                                    return (
                                        <button
                                            key={value}
                                            className={`p-4 rounded-lg border-2 flex flex-col justify-between transition-all cursor-pointer ${isSelected
                                                ? "border-black bg-gray-50"
                                                : "border-gray-300 hover:border-black hover:bg-gray-50"
                                                }`}
                                            onClick={() => handleChange("size", value)}
                                        >
                                            <div>
                                                <div className="font-semibold text-sm text-black mb-1">
                                                    {label}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {description}
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <Check className="w-4 h-4 text-black self-end mt-2" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-black mb-4">
                                Meeting Frequency
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {frequencyOptions.map(({ value, label, description }) => {
                                    const isSelected = formData.frequency === value;
                                    return (
                                        <button
                                            key={value}
                                            className={`p-4 rounded-lg border-2 flex flex-col justify-between transition-all cursor-pointer ${isSelected
                                                ? "border-black bg-gray-50"
                                                : "border-gray-300 hover:border-black hover:bg-gray-50"
                                                }`}
                                            onClick={() => handleChange("frequency", value)}
                                        >
                                            <div>
                                                <div className="font-semibold text-sm text-black mb-1">
                                                    {label}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {description}
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <Check className="w-4 h-4 text-black self-end mt-2" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-black mb-4">
                                Meeting Type
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {meetingTypeOptions.map(
                                    ({ value, icon: Icon, label, description }) => {
                                        const isSelected = formData.meetingType === value;
                                        return (
                                            <button
                                                key={value}
                                                className={`p-4 rounded-lg border-2 flex flex-col justify-between transition-all cursor-pointer ${isSelected
                                                    ? "border-black bg-gray-50"
                                                    : "border-gray-300 hover:border-black hover:bg-gray-50"
                                                    }`}
                                                onClick={() => handleChange("meetingType", value)}
                                            >
                                                <div className="flex items-start gap-3 mb-2">
                                                    <Icon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <div className="font-semibold text-sm text-black">
                                                            {label}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {description}
                                                        </div>
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <Check className="w-4 h-4 text-black self-end" />
                                                )}
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </>
                );
            case 4:
                const sizeText =
                    formData.size === "small"
                        ? "5-15 members"
                        : formData.size === "medium"
                            ? "16-30 members"
                            : "31+ members";
                const frequencyText =
                    formData.frequency.charAt(0).toUpperCase() +
                    formData.frequency.slice(1);
                const meetingTypeText =
                    formData.meetingType.charAt(0).toUpperCase() +
                    formData.meetingType.slice(1);
                const categoryLabel =
                    categories.find((c) => c.id === formData.category)?.label ||
                    "Category";
                return (
                    <>
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-300 mb-6">
                            <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                                <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                                    {getCategoryIcon()}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-black">
                                        {formData.groupName || "Group Name"}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{categoryLabel}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                {formData.groupDesc || "Description will appear here..."}
                            </p>
                            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                                <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {sizeText}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {frequencyText}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Monitor className="w-3 h-3" />
                                    {meetingTypeText}
                                </span>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 leading-relaxed">
                            By creating this group, you agree to moderate discussions, ensure
                            a respectful environment, and help members achieve their learning
                            goals.
                        </div>
                    </>
                );
            case 5:
                return (
                    <div className="text-center py-10 px-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-black" />
                        </div>
                        <h3 className="font-semibold text-2xl text-black mb-2">
                            Group Created!
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Your group is now live. Start inviting members and schedule your
                            first meetup to get things rolling!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
                                onClick={handleClose}
                            >
                                View Group
                            </button>
                            <button
                                className="px-6 py-3 border-2 border-black text-black rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                onClick={handleClose}
                            >
                                Invite Members
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {!isOpen && (
                <div className="min-h-screen flex items-center justify-center bg-white p-4">
                    <button
                        onClick={handleOpen}
                        className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
                    >
                        Create Group
                    </button>
                </div>
            )}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 transition-opacity"
                    onClick={(e) => e.target === e.currentTarget && handleClose()}
                >
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-300 flex-shrink-0">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-semibold text-black">
                                        Create a Group
                                    </h2>
                                    <p className="text-gray-500 mt-1">
                                        Build a learning community
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-black transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            {/* Progress Steps */}
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4].map((step) => (
                                        <div
                                            key={step}
                                            className={`h-1 flex-1 rounded-full transition-colors ${step <= currentStep ? "bg-black" : "bg-gray-100"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Step {currentStep} of 4
                                </div>
                            </div>
                        </div>
                        {/* Body */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {renderStepContent()}
                        </div>
                        {/* Footer */}
                        {currentStep !== 5 && (
                            <div className="p-6 border-t border-gray-300 flex justify-between gap-3">
                                {currentStep > 1 && (
                                    <button
                                        onClick={handleBack}
                                        className="px-6 py-3 border-2 border-gray-300 text-black rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className={`px-6 py-3 rounded-lg font-medium transition-colors ml-auto ${currentStep === 4
                                        ? "bg-black hover:bg-gray-900 text-white"
                                        : "bg-black hover:bg-gray-900 text-white"
                                        }`}
                                >
                                    {currentStep === 4 ? "Create Group" : "Next"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateGroupModal;
