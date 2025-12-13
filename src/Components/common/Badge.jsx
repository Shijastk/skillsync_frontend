import React from 'react';
import { X } from 'lucide-react';

/**
 * Badge - Reusable badge/tag component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.variant - 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 * @param {boolean} props.removable - Show remove button
 * @param {Function} props.onRemove - Remove handler
 * @param {string} props.className - Additional CSS classes
 */
const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    removable = false,
    onRemove,
    className = '',
}) => {
    const baseClasses = `
    inline-flex items-center gap-1.5
    font-medium rounded-full
    transition-all duration-200
  `;

    const variantClasses = {
        default: 'bg-gray-100 text-gray-700 border border-gray-200',
        primary: 'bg-gray-900 text-white border border-gray-900',
        success: 'bg-green-50 text-green-700 border border-green-200',
        warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
        danger: 'bg-red-50 text-red-700 border border-red-200',
        info: 'bg-blue-50 text-blue-700 border border-blue-200',
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
    };

    return (
        <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
            {children}
            {removable && onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
                    type="button"
                >
                    <X size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />
                </button>
            )}
        </span>
    );
};

export default Badge;
