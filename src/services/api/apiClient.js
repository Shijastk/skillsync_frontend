import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../../config/api.config';

/**
 * Enhanced API Client with better error handling and logging
 */
const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: API_CONFIG.WITH_CREDENTIALS,
});

// Track if we're currently refreshing to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

/**
 * Process queued requests after token refresh
 */
const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

/**
 * Request Interceptor
 * - Adds auth token to requests
 * - Logs requests in development
 */
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log in development
        if (import.meta.env.DEV) {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
                params: config.params,
                data: config.data,
            });
        }

        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * - Handles token refresh automatically
 * - Logs responses in development
 * - Transforms error responses
 */
apiClient.interceptors.response.use(
    (response) => {
        // Log successful responses in development
        if (import.meta.env.DEV) {
            console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Log errors
        if (import.meta.env.DEV) {
            console.error(`[API Error] ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
        }

        // Handle 401 Unauthorized with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                // No refresh token, clear auth and redirect
                clearAuthAndRedirect();
                return Promise.reject(error);
            }

            try {
                // Attempt token refresh
                const { data } = await axios.post(
                    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
                    { refreshToken },
                    { withCredentials: true }
                );

                if (data.success && data.token) {
                    // Save new tokens
                    localStorage.setItem('authToken', data.token);
                    if (data.refreshToken) {
                        localStorage.setItem('refreshToken', data.refreshToken);
                    }

                    // Update default headers
                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                    originalRequest.headers.Authorization = `Bearer ${data.token}`;

                    // Process queued requests
                    processQueue(null, data.token);

                    // Retry original request
                    return apiClient(originalRequest);
                } else {
                    throw new Error('Token refresh failed');
                }
            } catch (refreshError) {
                // Refresh failed, clear queue and auth
                processQueue(refreshError, null);
                clearAuthAndRedirect();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Handle network errors
        if (!error.response) {
            error.isNetworkError = true;
            error.message = 'Network error. Please check your connection.';
        }

        // Enhance error object with user-friendly messages
        error.userMessage = getUserFriendlyErrorMessage(error);

        return Promise.reject(error);
    }
);

/**
 * Clear authentication data and redirect to login
 */
const clearAuthAndRedirect = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    // Only redirect if not already on login page
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
};

/**
 * Get user-friendly error message based on error type
 */
const getUserFriendlyErrorMessage = (error) => {
    if (error.isNetworkError) {
        return 'Network error. Please check your internet connection.';
    }

    const status = error.response?.status;
    const message = error.response?.data?.message;

    switch (status) {
        case 400:
            return message || 'Invalid request. Please check your input.';
        case 401:
            return 'You need to be logged in to perform this action.';
        case 403:
            return 'You do not have permission to perform this action.';
        case 404:
            return message || 'The requested resource was not found.';
        case 409:
            return message || 'This action conflicts with existing data.';
        case 422:
            return message || 'Validation error. Please check your input.';
        case 429:
            return 'Too many requests. Please try again later.';
        case 500:
            return 'Server error. Please try again later.';
        case 503:
            return 'Service temporarily unavailable. Please try again later.';
        default:
            return message || 'An unexpected error occurred. Please try again.';
    }
};

export default apiClient;
