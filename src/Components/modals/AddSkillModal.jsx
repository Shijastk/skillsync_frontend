import React, { useState, useEffect } from "react";
import {
    X,
    ChevronRight,
    ChevronLeft,
    Zap,
    BookOpen,
    TrendingUp,
    Code2,
    Palette,
    Cloud,
    BarChart3,
    Cpu,
    Database,
    Layers,
    Smartphone,
    Lock,
    Check,
    Award,
    MessageSquare,
    Video,
    Users,
    FileText,
} from "lucide-react";

const AddSkillModal = ({ isOpen, onClose, type = "skill", onSave }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Common fields
        title: "",
        description: "",
        category: "",
        experienceLevel: "",

        // Skill-specific fields
        proficiency: "",
        yearsExperience: "",
        tools: [],

        // Learning goal specific fields
        targetDate: "",
        currentProgress: 0,
        resources: [],

        // Both
        tags: [],
        availability: "",
        preferredMethod: "",
        notes: "",
    });

    const [newTag, setNewTag] = useState("");
    const [newTool, setNewTool] = useState("");
    const [newResource, setNewResource] = useState("");

    const categories = {
        skill: [
            { value: "frontend", label: "Frontend Development", icon: Code2 },
            { value: "backend", label: "Backend Development", icon: Database },
            { value: "design", label: "UI/UX Design", icon: Palette },
            { value: "devops", label: "DevOps & Cloud", icon: Cloud },
            { value: "data", label: "Data & Analytics", icon: BarChart3 },
            { value: "mobile", label: "Mobile Development", icon: Smartphone },
            { value: "tools", label: "Tools & Platforms", icon: Cpu },
            { value: "soft", label: "Soft Skills", icon: Users },
        ],
        learning: [
            { value: "design", label: "UI/UX Design", icon: Palette },
            { value: "cloud", label: "Cloud & DevOps", icon: Cloud },
            { value: "data", label: "Data Science", icon: BarChart3 },
            { value: "mobile", label: "Mobile Development", icon: Smartphone },
            { value: "security", label: "Security", icon: Lock },
            { value: "leadership", label: "Leadership", icon: Users },
            { value: "product", label: "Product Management", icon: TrendingUp },
            { value: "other", label: "Other Skills", icon: BookOpen },
        ],
    };

    const experienceLevels = [
        { value: "beginner", label: "Beginner", icon: BookOpen },
        { value: "intermediate", label: "Intermediate", icon: TrendingUp },
        { value: "advanced", label: "Advanced", icon: Zap },
        { value: "expert", label: "Expert", icon: Award },
    ];

    const preferredMethods = [
        { value: "one-on-one", label: "One-on-One Sessions", icon: Users },
        { value: "video-calls", label: "Video Calls", icon: Video },
        { value: "pair-programming", label: "Pair Programming", icon: Code2 },
        { value: "project-based", label: "Project Based", icon: Layers },
        { value: "documentation", label: "Documentation", icon: FileText },
        { value: "workshops", label: "Workshops", icon: MessageSquare },
    ];

    const availabilityOptions = [
        { value: "weekday-evenings", label: "Weekday Evenings" },
        { value: "weekday-mornings", label: "Weekday Mornings" },
        { value: "weekends", label: "Weekends" },
        { value: "flexible", label: "Flexible Schedule" },
        { value: "specific", label: "Specific Times" },
    ];

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const resetForm = () => {
        setCurrentStep(1);
        setFormData({
            title: "",
            description: "",
            category: "",
            experienceLevel: "",
            proficiency: "",
            yearsExperience: "",
            tools: [],
            targetDate: "",
            currentProgress: 0,
            resources: [],
            tags: [],
            availability: "",
            preferredMethod: "",
            notes: "",
        });
        setNewTag("");
        setNewTool("");
        setNewResource("");
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        // Validation
        if (currentStep === 1) {
            if (!formData.title || !formData.category) {
                alert(
                    `Please enter a ${type === "skill" ? "skill" : "learning goal"
                    } title and category`
                );
                return;
            }
        }

        if (currentStep === 2) {
            if (!formData.description) {
                alert(`Please provide a description`);
                return;
            }
        }

        if (currentStep === 3) {
            // Save the form
            onSave(formData);
            onClose();
            return;
        }

        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const addTool = () => {
        if (newTool.trim() && !formData.tools.includes(newTool.trim())) {
            setFormData((prev) => ({
                ...prev,
                tools: [...prev.tools, newTool.trim()],
            }));
            setNewTool("");
        }
    };

    const removeTool = (toolToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tools: prev.tools.filter((tool) => tool !== toolToRemove),
        }));
    };

    const addResource = () => {
        if (
            newResource.trim() &&
            !formData.resources.includes(newResource.trim())
        ) {
            setFormData((prev) => ({
                ...prev,
                resources: [...prev.resources, newResource.trim()],
            }));
            setNewResource("");
        }
    };

    const removeResource = (resourceToRemove) => {
        setFormData((prev) => ({
            ...prev,
            resources: prev.resources.filter(
                (resource) => resource !== resourceToRemove
            ),
        }));
    };

    const handleKeyPress = (e, callback) => {
        if (e.key === "Enter") {
            e.preventDefault();
            callback();
        }
    };

    if (!isOpen) return null;

    const modalTitle = type === "skill" ? "Add New Skill" : "Add Learning Goal";
    const stepLabels =
        type === "skill"
            ? ["Skill Details", "Description", "Review"]
            : ["Goal Details", "Plan", "Review"];

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-semibold">{modalTitle}</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {type === "skill"
                                    ? "Add a skill you can teach to others"
                                    : "Set a new learning goal to track your progress"}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            {[1, 2, 3].map((step) => (
                                <div
                                    key={step}
                                    className={`h-1 flex-1 rounded-full transition-colors ${step <= currentStep ? "bg-black" : "bg-gray-200"
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">
                            Step {currentStep} of 3 • {stepLabels[currentStep - 1]}
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200">
                    {/* Step 1: Basic Details */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    {type === "skill" ? "Skill Name" : "Learning Goal"}
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                    placeholder={
                                        type === "skill"
                                            ? "e.g., React, Figma, Node.js"
                                            : "e.g., Learn Kubernetes, Master Figma"
                                    }
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-3">
                                    Category
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {(type === "skill"
                                        ? categories.skill
                                        : categories.learning
                                    ).map((category) => {
                                        const Icon = category.icon;
                                        return (
                                            <button
                                                key={category.value}
                                                type="button"
                                                onClick={() =>
                                                    handleInputChange("category", category.value)
                                                }
                                                className={`p-4 border-2 rounded-lg text-center transition-colors ${formData.category === category.value
                                                        ? "border-black bg-black text-white"
                                                        : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <Icon className="mx-auto mb-2" size={20} />
                                                <div className="text-xs font-medium">
                                                    {category.label}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {type === "skill" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            Experience Level
                                        </label>
                                        <div className="space-y-2">
                                            {experienceLevels.map((level) => {
                                                const Icon = level.icon;
                                                return (
                                                    <button
                                                        key={level.value}
                                                        type="button"
                                                        onClick={() =>
                                                            handleInputChange("experienceLevel", level.value)
                                                        }
                                                        className={`w-full p-3 border rounded-lg text-left transition-colors flex items-center gap-3 ${formData.experienceLevel === level.value
                                                                ? "border-black bg-gray-50"
                                                                : "border-gray-200 hover:border-gray-300"
                                                            }`}
                                                    >
                                                        <Icon size={18} className="text-gray-600" />
                                                        <span className="font-medium">{level.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            Years of Experience
                                        </label>
                                        <select
                                            value={formData.yearsExperience}
                                            onChange={(e) =>
                                                handleInputChange("yearsExperience", e.target.value)
                                            }
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0"
                                        >
                                            <option value="">Select years</option>
                                            <option value="0-1">Less than 1 year</option>
                                            <option value="1-3">1-3 years</option>
                                            <option value="3-5">3-5 years</option>
                                            <option value="5-10">5-10 years</option>
                                            <option value="10+">10+ years</option>
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            Target Completion Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.targetDate}
                                            onChange={(e) =>
                                                handleInputChange("targetDate", e.target.value)
                                            }
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            Current Progress
                                        </label>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Progress</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {formData.currentProgress}%
                                                </span>
                                            </div>
                                            <div className="relative pt-1">
                                                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gray-900 rounded-full transition-all duration-200"
                                                        style={{ width: `${formData.currentProgress}%` }}
                                                    />
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={formData.currentProgress}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "currentProgress",
                                                            parseInt(e.target.value)
                                                        )
                                                    }
                                                    className="absolute inset-0 w-full h-1 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Description & Details */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        handleInputChange("description", e.target.value)
                                    }
                                    placeholder={
                                        type === "skill"
                                            ? "Describe your experience with this skill, projects you've worked on, and what you can teach..."
                                            : "Describe what you want to achieve, why this skill is important to you, and your learning approach..."
                                    }
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg min-h-[120px] focus:border-black focus:ring-0"
                                    rows={4}
                                />
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {formData.description.length}/500 characters
                                </div>
                            </div>

                            {type === "skill" ? (
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Tools & Technologies
                                    </label>
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={newTool}
                                            onChange={(e) => setNewTool(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, addTool)}
                                            placeholder="e.g., React Hooks, TypeScript, Redux"
                                            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0"
                                        />
                                        <button
                                            onClick={addTool}
                                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tools.map((tool, index) => (
                                            <div
                                                key={index}
                                                className="px-3 py-1.5 bg-gray-100 rounded-full flex items-center gap-2"
                                            >
                                                <span className="text-sm">{tool}</span>
                                                <button
                                                    onClick={() => removeTool(tool)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Learning Resources
                                    </label>
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={newResource}
                                            onChange={(e) => setNewResource(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, addResource)}
                                            placeholder="e.g., Online course, Book, Tutorial"
                                            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0"
                                        />
                                        <button
                                            onClick={addResource}
                                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.resources.map((resource, index) => (
                                            <div
                                                key={index}
                                                className="px-3 py-1.5 bg-gray-100 rounded-full flex items-center gap-2"
                                            >
                                                <span className="text-sm">{resource}</span>
                                                <button
                                                    onClick={() => removeResource(resource)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold mb-3">
                                    Preferred Learning/Teaching Method
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {preferredMethods.map((method) => {
                                        const Icon = method.icon;
                                        return (
                                            <button
                                                key={method.value}
                                                type="button"
                                                onClick={() =>
                                                    handleInputChange("preferredMethod", method.value)
                                                }
                                                className={`p-4 border-2 rounded-lg text-center transition-colors ${formData.preferredMethod === method.value
                                                        ? "border-black bg-gray-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <Icon className="mx-auto mb-2" size={20} />
                                                <div className="text-xs font-medium">
                                                    {method.label}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Availability
                                </label>
                                <select
                                    value={formData.availability}
                                    onChange={(e) =>
                                        handleInputChange("availability", e.target.value)
                                    }
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0"
                                >
                                    <option value="">Select availability</option>
                                    {availabilityOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                                    {type === "skill" ? "Skill Details" : "Goal Details"}
                                </p>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Title:</span>
                                        <span className="font-medium">{formData.title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Category:</span>
                                        <span className="font-medium">
                                            {categories[type].find(
                                                (c) => c.value === formData.category
                                            )?.label || "-"}
                                        </span>
                                    </div>
                                    {type === "skill" ? (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Experience Level:</span>
                                                <span className="font-medium">
                                                    {experienceLevels.find(
                                                        (l) => l.value === formData.experienceLevel
                                                    )?.label || "-"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Years of Experience:
                                                </span>
                                                <span className="font-medium">
                                                    {formData.yearsExperience || "-"}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Target Date:</span>
                                                <span className="font-medium">
                                                    {formData.targetDate || "-"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Progress:</span>
                                                <span className="font-medium">
                                                    {formData.currentProgress}%
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                                    Description
                                </p>
                                <p className="text-sm whitespace-pre-wrap">
                                    {formData.description}
                                </p>
                            </div>

                            {type === "skill" ? (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                                        Tools & Technologies
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tools.length > 0 ? (
                                            formData.tools.map((tool, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm"
                                                >
                                                    {tool}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-500">No tools added</span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                                        Learning Resources
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.resources.length > 0 ? (
                                            formData.resources.map((resource, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm"
                                                >
                                                    {resource}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-500">No resources added</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                                    Preferences
                                </p>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Learning Method:</span>
                                        <span className="font-medium">
                                            {preferredMethods.find(
                                                (m) => m.value === formData.preferredMethod
                                            )?.label || "-"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Availability:</span>
                                        <span className="font-medium">
                                            {availabilityOptions.find(
                                                (a) => a.value === formData.availability
                                            )?.label || "-"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100">
                    <div className="flex justify-between">
                        {currentStep > 1 && (
                            <button
                                onClick={handleBack}
                                className="px-6 py-3 border-2 border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <ChevronLeft size={18} />
                                Back
                            </button>
                        )}

                        <div className={`${currentStep > 1 ? "ml-auto" : "w-full"}`}>
                            <button
                                onClick={handleNext}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors w-full flex items-center justify-center gap-2 ${currentStep === 3
                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                        : "bg-black hover:bg-gray-800 text-white"
                                    }`}
                            >
                                {currentStep === 3 ? (
                                    <>
                                        <Check size={18} />
                                        {type === "skill" ? "Add Skill" : "Add Learning Goal"}
                                    </>
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

export default AddSkillModal;
