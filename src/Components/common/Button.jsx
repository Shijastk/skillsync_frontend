import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Button - Reusable button component with variants
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {string} props.variant - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.leftIcon - Icon to show on left
 * @param {React.ReactNode} props.rightIcon - Icon to show on right
 * @param {boolean} props.fullWidth - Whether button should be full width
 */
const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className = '',
    leftIcon,
    rightIcon,
    fullWidth = false,
    type = 'button',
    ...props
}) => {
    const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-0
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-[0.98]
  `;

    const variantClasses = {
        primary: `
      bg-gray-900 text-white
      hover:bg-gray-800
      shadow-sm hover:shadow
    `,
        secondary: `
      bg-gray-100 text-gray-900
      hover:bg-gray-200
      border border-gray-200
    `,
        outline: `
      bg-white text-gray-900
      border-2 border-gray-300
      hover:border-gray-900
      hover:bg-gray-50
    `,
        ghost: `
      bg-transparent text-gray-700
      hover:bg-gray-100
    `,
        danger: `
      bg-red-600 text-white
      hover:bg-red-700
      shadow-sm hover:shadow
    `,
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${className}
      `}
            {...props}
        >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {!loading && leftIcon && leftIcon}
            {children}
            {!loading && rightIcon && rightIcon}
        </button>
    );
};

export default Button;
