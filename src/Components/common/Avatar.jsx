import React from 'react';

/**
 * Avatar - User avatar component with fallback to initials
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.name - User name (for initials)
 * @param {string} props.initials - Custom initials override
 * @param {string} props.size - 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 * @param {string} props.status - 'online' | 'offline' | 'away' | 'busy'
 * @param {boolean} props.showStatus - Show status indicator
 * @param {string} props.className - Additional CSS classes
 */
const Avatar = ({
    src,
    name = '',
    initials,
    size = 'md',
    status,
    showStatus = false,
    className = '',
}) => {
    const getInitials = () => {
        if (initials) return initials;
        if (!name) return '?';

        const names = name.trim().split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const sizeClasses = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl',
        '2xl': 'w-20 h-20 text-2xl',
    };

    const statusColors = {
        online: 'bg-green-500',
        offline: 'bg-gray-400',
        away: 'bg-yellow-500',
        busy: 'bg-red-500',
    };

    const statusSizes = {
        xs: 'w-1.5 h-1.5',
        sm: 'w-2 h-2',
        md: 'w-2.5 h-2.5',
        lg: 'w-3 h-3',
        xl: 'w-4 h-4',
        '2xl': 'w-5 h-5',
    };

    return (
        <div className={`relative inline-flex ${className}`}>
            {src ? (
                <img
                    src={src}
                    alt={name}
                    className={`
            ${sizeClasses[size]}
            rounded-full object-cover
            border-2 border-white
            shadow-sm
          `}
                />
            ) : (
                <div
                    className={`
            ${sizeClasses[size]}
            bg-gradient-to-br from-gray-700 to-gray-900
            rounded-full
            flex items-center justify-center
            text-white font-bold
            border-2 border-white
            shadow-sm
          `}
                >
                    {getInitials()}
                </div>
            )}

            {showStatus && status && (
                <span
                    className={`
            absolute bottom-0 right-0
            ${statusSizes[size]}
            ${statusColors[status]}
            rounded-full
            border-2 border-white
          `}
                />
            )}
        </div>
    );
};

export default Avatar;
