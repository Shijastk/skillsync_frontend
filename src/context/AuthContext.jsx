import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount by reading from localStorage
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');

        if (storedUser && storedToken) {
            try {
                const userData = JSON.parse(storedUser);
                // Transform _id to id for frontend compatibility
                if (userData._id && !userData.id) {
                    userData.id = userData._id;
                }
                setUser(userData);
            } catch (error) {
                console.error('Failed to parse stored user:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await authService.login({ email, password });
        if (response.success && response.user) {
            // Transform _id to id
            const userData = response.user;
            if (userData._id && !userData.id) {
                userData.id = userData._id;
            }
            setUser(userData);
        }
        return response;
    };

    const register = async (userData) => {
        const response = await authService.register(userData);
        if (response.success && response.user) {
            // Transform _id to id
            const user = response.user;
            if (user._id && !user.id) {
                user.id = user._id;
            }
            setUser(user);
        }
        return response;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
            // Force navigation to landing page after logout
            window.location.href = '/';
        }
    };

    const updateUser = (updatedUserData) => {
        // Transform _id to id
        if (updatedUserData._id && !updatedUserData.id) {
            updatedUserData.id = updatedUserData._id;
        }
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        setUser(updatedUserData);
    };

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
