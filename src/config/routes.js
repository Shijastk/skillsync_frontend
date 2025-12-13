import { lazy } from 'react';

/**
 * Lazy-loaded page components for code splitting
 */
export const pages = {
    // Auth pages
    Login: lazy(() => import('../pages/Auth/Login')),
    Register: lazy(() => import('../pages/Auth/Register')),

    // Main pages
    Home: lazy(() => import('../pages/Home')),
    Discover: lazy(() => import('../pages/Discovery')),
    Groups: lazy(() => import('../pages/Groups')),
    Messages: lazy(() => import('../Components/Messages')),
    Community: lazy(() => import('../pages/CommunityPage')),
    Schedule: lazy(() => import('../pages/SchedulePage')),

    // Profile pages
    Profile: lazy(() => import('../Components/Profile/UnifiedProfile')),

    // Other pages
    Wallet: lazy(() => import('../pages/WalletPage')),
    MySwaps: lazy(() => import('../pages/MySwaps')),
};

/**
 * Route configuration
 * Defines all application routes with their paths and components
 */
export const routeConfig = {
    // Public routes (accessible without authentication)
    public: [
        {
            path: '/login',
            component: 'Login',
            title: 'Login',
        },
        {
            path: '/register',
            component: 'Register',
            title: 'Register',
        },
    ],

    // Protected routes (require authentication)
    protected: [
        {
            path: '/',
            component: 'Home',
            title: 'Home',
        },
        {
            path: '/discover',
            component: 'Discover',
            title: 'Discover',
        },
        {
            path: '/groups',
            component: 'Groups',
            title: 'Groups',
        },
        {
            path: '/messages',
            component: 'Messages',
            title: 'Messages',
        },
        {
            path: '/schedule',
            component: 'Schedule',
            title: 'Schedule',
        },
        {
            path: '/community',
            component: 'Community',
            title: 'Community',
        },
        {
            path: '/profile/:userId',
            component: 'Profile',
            title: 'Profile',
            props: {},
        },
        {
            path: '/profile',
            component: 'Profile',
            title: 'My Profile',
            props: { isOwnProfile: true },
        },
        {
            path: '/wallet',
            component: 'Wallet',
            title: 'Wallet',
        },
        {
            path: '/my-swaps',
            component: 'MySwaps',
            title: 'My Swaps',
        },
    ],
};
