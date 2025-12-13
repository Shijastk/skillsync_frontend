import React from 'react';

/**
 * Simple Loading Spinner Component
 * Lightweight spinner for Suspense fallbacks
 */
const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
);

export default LoadingSpinner;
