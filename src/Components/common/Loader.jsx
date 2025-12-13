import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loader - Loading spinner component
 * @param {Object} props
 * @param {string} props.size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} props.variant - 'spinner' | 'dots' | 'pulse'
 * @param {boolean} props.fullscreen - Show as fullscreen overlay
 * @param {string} props.text - Loading text
 * @param {string} props.className - Additional CSS classes
 */
const Loader = ({
    size = 'md',
    variant = 'spinner',
    fullscreen = false,
    text = '',
    className = '',
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const iconSizes = {
        sm: 16,
        md: 32,
        lg: 48,
        xl: 64,
    };

    const renderLoader = () => {
        switch (variant) {
            case 'dots':
                return (
                    <div className="flex items-center gap-2">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={`
                  ${sizeClasses[size]}
                  bg-gray-900 rounded-full
                  animate-bounce
                `}
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                    </div>
                );

            case 'pulse':
                return (
                    <div
                        className={`
              ${sizeClasses[size]}
              bg-gray-900 rounded-full
              animate-pulse
            `}
                    />
                );

            default: // spinner
                return (
                    <Loader2
                        size={iconSizes[size]}
                        className="text-gray-900 animate-spin"
                    />
                );
        }
    };

    const content = (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            {renderLoader()}
            {text && (
                <p className="text-sm text-gray-600 font-medium">{text}</p>
            )}
        </div>
    );

    if (fullscreen) {
        return (
            <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
                {content}
            </div>
        );
    }

    return content;
};

export default Loader;
