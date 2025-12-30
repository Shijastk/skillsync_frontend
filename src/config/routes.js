import { lazy } from 'react';

/**
 * Lazy-loaded page components for code splitting
 */
export const pages = {
    // Public pages
    Landing: lazy(() => import('../pages/LandingPage')),

    // Auth pages (deprecated - now using modal)
    Login: lazy(() => import('../pages/Auth/Login')),
    Register: lazy(() => import('../pages/Auth/Register')),

    // Main pages
    Home: lazy(() => import('../pages/Home')),
    Discover: lazy(() => import('../pages/Discovery')),
    Groups: lazy(() => import('../pages/Groups')),
    GroupDetails: lazy(() => import('../pages/GroupDetails')),
    Messages: lazy(() => import('../Components/Messages')),
    Community: lazy(() => import('../pages/CommunityPage')),
    Schedule: lazy(() => import('../pages/SchedulePage')),

    // Profile pages
    PersonalProfile: lazy(() => import('../Components/Profile/PersonalProfile')),
    PublicProfile: lazy(() => import('../Components/Profile/PublicProfile')),

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
            path: '/',
            component: 'Landing',
            title: 'SkillSwap - Exchange Skills, Grow Together',
        },
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
        {
            path: '/discovery',
            component: 'Discover',
            title: 'Discover',
        },
    ],

    // Protected routes (require authentication)
    protected: [
        {
            path: '/home',
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
            path: '/groups/:groupId',
            component: 'GroupDetails',
            title: 'Group Details',
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
            component: 'PublicProfile',
            title: 'User Profile',
        },
        {
            path: '/profile',
            component: 'PersonalProfile',
            title: 'My Profile',
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
