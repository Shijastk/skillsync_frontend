import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { Button, Card } from '../common';

const PortfolioModal = ({ isOpen, onClose, onSave, editingItem }) => {
    const [formData, setFormData] = useState({
        title: '',
        tech: '',
        description: '',
        category: 'web',
    });

    useEffect(() => {
        if (editingItem) {
            setFormData({
                title: editingItem.title || '',
                tech: editingItem.tech || '',
                description: editingItem.description || '',
                category: editingItem.category || 'web',
            });
        } else {
            setFormData({
                title: '',
                tech: '',
                description: '',
                category: 'web',
            });
        }
    }, [editingItem, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {editingItem ? 'Edit Portfolio Project' : 'Add Portfolio Project'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="E.g., E-commerce Platform"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none"
                        />
                    </div>

                    {/* Technologies */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Technologies Used *
                        </label>
                        <input
                            type="text"
                            name="tech"
                            value={formData.tech}
                            onChange={handleChange}
                            required
                            placeholder="E.g., React, Node.js, MongoDB"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate technologies with commas</p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Brief description of the project..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none resize-none"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none"
                        >
                            <option value="web">Web Application</option>
                            <option value="mobile">Mobile App</option>
                            <option value="api">API/Backend</option>
                            <option value="data">Data/Analytics</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Image Upload Placeholder */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Image
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" fullWidth onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" fullWidth>
                            {editingItem ? 'Update Project' : 'Add Project'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default PortfolioModal;
