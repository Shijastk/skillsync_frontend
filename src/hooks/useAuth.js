import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

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

                // Update React Query Cache if needed
                queryClient.setQueryData(['currentUser'], data.user);

                console.log('Login successful, navigating to home...');
                navigate('/', { replace: true });
            }
        },
        onError: (error) => {
            console.error('Login failed raw:', error);
            console.error('Login failed message:', error.message);
            console.error('Login failed response:', error.response);
        },
    });
};

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
                queryClient.setQueryData(['currentUser'], data.user);

                // Context update will trigger state change, then navigate
                navigate('/');
            }
        },
        onError: (error) => {
            console.error('Registration failed:', error);
        },
    });
};

export const useLogout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return () => {
        authService.logout();
        queryClient.clear();
        navigate('/login');
    };
};
