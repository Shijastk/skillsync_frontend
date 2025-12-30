import React, { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './config/queryClient';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { pages, routeConfig } from './config/routes';
import { ToastProvider } from './context/ToastContext';
import ProtectedLayout from './layouts/ProtectedLayout';
import PublicLayout from './layouts/PublicLayout';
import LoadingSpinner from './Components/common/LoadingSpinner';

/**
 * Main Application Component
 * Handles routing and provides React Query and Auth context
 */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <SocketProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Routes */}
                {routeConfig.public.map((route) => {
                  const Component = pages[route.component];
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        <PublicLayout>
                          <Component {...(route.props || {})} />
                        </PublicLayout>
                      }
                    />
                  );
                })}

                {/* Protected Routes */}
                {routeConfig.protected.map((route) => {
                  const Component = pages[route.component];
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        <ProtectedLayout>
                          <Component {...(route.props || {})} />
                        </ProtectedLayout>
                      }
                    />
                  );
                })}

                {/* 404 Route */}
                <Route
                  path="*"
                  element={
                    <ProtectedLayout>
                      <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
                          <p className="text-gray-600">Page not found</p>
                        </div>
                      </div>
                    </ProtectedLayout>
                  }
                />
              </Routes>
            </Suspense>
          </SocketProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
