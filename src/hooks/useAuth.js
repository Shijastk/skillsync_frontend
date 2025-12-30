import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { QUERY_KEYS } from '../config';

/**
 * Login hook with enhanced error handling
 * @returns {Object} React Query mutation result
 */
export const useLogin = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { login } = useAuthContext();

    return useMutation({
        mutationFn: authService.login,

        onSuccess: (data) => {
            console.log('Login response:', data);

            if (data.success) {
                // Update Global Context & LocalStorage via Context function
                login(data.user, data.token);

                // Update React Query Cache
                queryClient.setQueryData(QUERY_KEYS.AUTH.CURRENT_USER, data.user);

                console.log('Login successful, navigating to home...');
                navigate('/', { replace: true });
            }
        },

        onError: (error) => {
            console.error('Login failed:', error);
            // Error message is already user-friendly from apiClient
        },
    });
};

/**
 * Register hook with enhanced error handling
 * @returns {Object} React Query mutation result
 */
export const useRegister = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { login } = useAuthContext();

    return useMutation({
        mutationFn: authService.register,

        onSuccess: (data) => {
            if (data.success) {
                // Update Global Context & LocalStorage via Context function
                login(data.user, data.token);

                // Update React Query Cache
                queryClient.setQueryData(QUERY_KEYS.AUTH.CURRENT_USER, data.user);

                // Context update will trigger state change, then navigate
                navigate('/');
            }
        },

        onError: (error) => {
            console.error('Registration failed:', error);
        },
    });
};

/**
 * Logout hook
 * @returns {Function} Logout function
 */
export const useLogout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { logout: contextLogout } = useAuthContext();

    return () => {
        // Clear auth state
        authService.logout();

        // Update context
        if (contextLogout) {
            contextLogout();
        }

        // Clear all React Query cache
        queryClient.clear();

        // Navigate to login
        navigate('/login');
    };
};

/**
 * Get current authenticated user
 * Use this for getting real-time user data from API
 * For cached user data, use useCurrentUser from useUsers.js
 * @returns {Object} React Query result
 */
export const useCurrentAuthUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.getCurrentUser,

        onSuccess: (user) => {
            // Update cache
            queryClient.setQueryData(QUERY_KEYS.AUTH.CURRENT_USER, user);
        },
    });
};
