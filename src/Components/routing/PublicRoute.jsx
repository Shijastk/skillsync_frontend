import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/api';

/**
 * PublicRoute - Wrapper component for routes that should only be accessible when NOT authenticated
 * Redirects authenticated users to home page
 */
const PublicRoute = ({ children }) => {
    const isAuthenticated = authService.isAuthenticated();

    if (isAuthenticated) {
        // Redirect authenticated users to home page
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;
