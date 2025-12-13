import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * CustomSelect - A reusable custom select dropdown component
 * @param {Object} props
 * @param {string} props.label - Label for the select
 * @param {string} props.value - Current selected value
 * @param {Function} props.onChange - Change handler
 * @param {Array} props.options - Array of {value, label} objects
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.required - Whether field is required
 * @param {boolean} props.disabled - Whether field is disabled
 */
const CustomSelect = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Select an option',
    className = '',
    required = false,
    disabled = false,
    error = '',
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className={`
            w-full px-4 py-3 pr-10
            bg-white border-2 rounded-lg
            text-gray-900 font-medium text-sm
            appearance-none cursor-pointer
            transition-all duration-200
            focus:outline-none focus:ring-0
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-gray-200 focus:border-gray-900'
                        }
            hover:border-gray-300
          `}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown
                        size={20}
                        className={`transition-colors ${disabled ? 'text-gray-400' : 'text-gray-600'
                            }`}
                    />
                </div>
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

export default CustomSelect;
