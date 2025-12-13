import React, { lazy, Suspense } from 'react';
import LoadingSpinner from '../Components/common/LoadingSpinner';

const ProtectedRoute = lazy(() => import('../Components/routing/ProtectedRoute'));
const Navbar = lazy(() => import('../Components/Navbar'));

/**
 * Protected Layout Component
 * Wraps protected routes with authentication check and navigation
 */
const ProtectedLayout = ({ children }) => (
    <Suspense fallback={<LoadingSpinner />}>
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main>{children}</main>
            </div>
        </ProtectedRoute>
    </Suspense>
);

export default ProtectedLayout;
