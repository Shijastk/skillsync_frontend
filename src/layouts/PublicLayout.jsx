import React, { lazy, Suspense } from 'react';
import LoadingSpinner from '../Components/common/LoadingSpinner';

const PublicRoute = lazy(() => import('../Components/routing/PublicRoute'));

/**
 * Public Layout Component
 * Wraps public routes (login, register) and redirects if authenticated
 */
const PublicLayout = ({ children }) => (
    <Suspense fallback={<LoadingSpinner />}>
        <PublicRoute>
            <div className="min-h-screen bg-gray-50">
                {children}
            </div>
        </PublicRoute>
    </Suspense>
);

export default PublicLayout;
