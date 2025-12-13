import React, { useState } from 'react';
import { Calendar, Clock, X } from 'lucide-react';

/**
 * DateTimePicker - A custom date and time picker component
 * @param {Object} props
 * @param {string} props.label - Label for the picker
 * @param {string} props.value - Current date/time value (ISO string or empty)
 * @param {Function} props.onChange - Change handler
 * @param {string} props.type - 'date', 'time', or 'datetime'
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.min - Minimum date/time value
 * @param {string} props.max - Maximum date/time value
 */
const DateTimePicker = ({
    label,
    value,
    onChange,
    type = 'date',
    placeholder,
    required = false,
    min,
    max,
    className = '',
    error = '',
}) => {
    const [showPicker, setShowPicker] = useState(false);

    const getInputType = () => {
        switch (type) {
            case 'datetime':
                return 'datetime-local';
            case 'time':
                return 'time';
            default:
                return 'date';
        }
    };

    const getIcon = () => {
        return type === 'time' ? <Clock size={20} /> : <Calendar size={20} />;
    };

    const formatDisplayValue = (val) => {
        if (!val) return '';

        try {
            const date = new Date(val);
            if (type === 'date') {
                return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
            } else if (type === 'time') {
                return date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } else {
                return date.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        } catch (e) {
            return val;
        }
    };

    const clearValue = (e) => {
        e.stopPropagation();
        onChange('');
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <div
                    onClick={() => setShowPicker(!showPicker)}
                    className={`
            w-full px-4 py-3 pr-10
            bg-white border-2 rounded-lg
            text-gray-900 font-medium text-sm
            cursor-pointer
            transition-all duration-200
            focus-within:outline-none focus-within:ring-0
            ${error
                            ? 'border-red-300 focus-within:border-red-500'
                            : 'border-gray-200 focus-within:border-gray-900'
                        }
            hover:border-gray-300
            flex items-center justify-between
          `}
                >
                    <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                        {value ? formatDisplayValue(value) : (placeholder || `Select ${type}`)}
                    </span>

                    <div className="flex items-center gap-2">
                        {value && (
                            <button
                                onClick={clearValue}
                                type="button"
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}
                        <div className="text-gray-600">
                            {getIcon()}
                        </div>
                    </div>
                </div>

                {showPicker && (
                    <div className="absolute z-50 mt-2 w-full">
                        <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4">
                            <input
                                type={getInputType()}
                                value={value}
                                onChange={(e) => {
                                    onChange(e.target.value);
                                    setShowPicker(false);
                                }}
                                min={min}
                                max={max}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none"
                            />
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

export default DateTimePicker;
