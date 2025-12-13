import React from 'react';

/**
 * Card - Reusable card container component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hoverable - Whether card has hover effect
 * @param {Function} props.onClick - Click handler (makes card clickable)
 * @param {boolean} props.noPadding - Remove default padding
 * @param {boolean} props.noBorder - Remove border
 */
const Card = ({
    children,
    className = '',
    hoverable = false,
    onClick,
    noPadding = false,
    noBorder = false,
}) => {
    const baseClasses = `
    bg-white rounded-xl
    ${noBorder ? '' : 'border border-gray-200'}
    ${noPadding ? '' : 'p-6'}
    transition-all duration-200
  `;

    const interactiveClasses = onClick || hoverable ? `
    cursor-pointer
    hover:shadow-md
    active:scale-[0.99]
  ` : 'shadow-sm';

    return (
        <div
            className={`${baseClasses} ${interactiveClasses} ${className}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {children}
        </div>
    );
};

export default Card;
