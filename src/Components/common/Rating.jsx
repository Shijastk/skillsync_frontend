import React from 'react';
import { Star } from 'lucide-react';

/**
 * Rating - Star rating display component
 * @param {Object} props
 * @param {number} props.value - Rating value (0-5)
 * @param {number} props.max - Maximum rating (default 5)
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 * @param {boolean} props.showValue - Show numeric value
 * @param {boolean} props.interactive - Allow clicking to rate
 * @param {Function} props.onChange - Change handler for interactive mode
 * @param {string} props.className - Additional CSS classes
 */
const Rating = ({
    value = 0,
    max = 5,
    size = 'md',
    showValue = false,
    interactive = false,
    onChange,
    className = '',
}) => {
    const [hoverValue, setHoverValue] = React.useState(0);

    const sizeClasses = {
        sm: 14,
        md: 18,
        lg: 24,
    };

    const iconSize = sizeClasses[size];

    const handleClick = (rating) => {
        if (interactive && onChange) {
            onChange(rating);
        }
    };

    const displayValue = hoverValue || value;

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="flex items-center gap-0.5">
                {Array.from({ length: max }).map((_, index) => {
                    const ratingValue = index + 1;
                    const isFilled = ratingValue <= displayValue;
                    const isPartiallyFilled = !Number.isInteger(displayValue) &&
                        ratingValue === Math.ceil(displayValue);

                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleClick(ratingValue)}
                            onMouseEnter={() => interactive && setHoverValue(ratingValue)}
                            onMouseLeave={() => interactive && setHoverValue(0)}
                            disabled={!interactive}
                            className={`
                ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                transition-transform duration-150
                focus:outline-none
              `}
                        >
                            <Star
                                size={iconSize}
                                className={`
                  ${isFilled || isPartiallyFilled ? 'text-yellow-500' : 'text-gray-300'}
                  transition-colors duration-150
                `}
                                fill={isFilled || isPartiallyFilled ? 'currentColor' : 'none'}
                            />
                        </button>
                    );
                })}
            </div>

            {showValue && (
                <span className="text-sm font-medium text-gray-700">
                    {value.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default Rating;
