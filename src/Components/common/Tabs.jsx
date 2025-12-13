import React from 'react';

/**
 * Tabs - Reusable tab navigation component
 * @param {Object} props
 * @param {Array} props.tabs - Array of {id, label, icon} objects
 * @param {string} props.activeTab - Currently active tab ID
 * @param {Function} props.onChange - Tab change handler
 * @param {string} props.variant - 'underline' | 'pills' | 'boxed'
 * @param {string} props.className - Additional CSS classes
 */
const Tabs = ({
    tabs = [],
    activeTab,
    onChange,
    variant = 'underline',
    className = '',
}) => {
    const getVariantClasses = (isActive) => {
        switch (variant) {
            case 'pills':
                return isActive
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200';

            case 'boxed':
                return isActive
                    ? 'bg-white text-gray-900 border-gray-200 shadow-sm'
                    : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-50';

            default: // underline
                return isActive
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
        }
    };

    const containerClasses = {
        underline: 'border-b border-gray-200',
        pills: 'bg-gray-50 p-1 rounded-lg',
        boxed: 'border-b border-gray-200',
    };

    const tabClasses = {
        underline: 'px-6 py-3 border-b-2',
        pills: 'px-4 py-2 rounded-md',
        boxed: 'px-6 py-3 border-b-2',
    };

    return (
        <div className={`flex overflow-x-auto ${containerClasses[variant]} ${className}`}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`
              ${tabClasses[variant]}
              ${getVariantClasses(isActive)}
              flex items-center gap-2
              text-sm font-medium
              whitespace-nowrap
              transition-all duration-200
              focus:outline-none
            `}
                    >
                        {Icon && <Icon size={16} />}
                        {tab.label}
                        {tab.count !== undefined && (
                            <span
                                className={`
                  ml-1 px-2 py-0.5 rounded-full text-xs
                  ${isActive ? 'bg-white/20' : 'bg-gray-200'}
                `}
                            >
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default Tabs;
