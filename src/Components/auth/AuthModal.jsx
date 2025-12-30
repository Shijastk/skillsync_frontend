import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    X, Eye, EyeOff, Mail, Lock, User,
    CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

/**
 * AuthModal - Login & Registration in one modal
 * Black & White theme
 * 
 */
const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot'
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, register } = useAuthContext();
    const { success, error: showError } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (mode === 'register') {
                // Validation
                if (!formData.firstName || !formData.lastName) {
                    setError('Please enter your full name');
                    setIsLoading(false);
                    return;
                }
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    setIsLoading(false);
                    return;
                }
                if (formData.password.length < 6) {
                    setError('Password must be at least 6 characters');
                    setIsLoading(false);
                    return;
                }

                await register({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password
                });

                success('Account created successfully!');
                onClose();
                navigate('/home');
            } else if (mode === 'login') {
                await login(formData.email, formData.password);
                success('Welcome back!');
                onClose();
                navigate('/home');
            } else if (mode === 'forgot') {
                // Feature not yet implemented in backend
                success('Password reset functionality coming soon');
                setMode('login');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
            showError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                className="bg-white rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {mode === 'login' && 'Welcome Back'}
                            {mode === 'register' && 'Create Account'}
                            {mode === 'forgot' && 'Reset Password'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={24} className="text-gray-600" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        {mode === 'login' && 'Sign in to access your account'}
                        {mode === 'register' && 'Join the SkillSwap community'}
                        {mode === 'forgot' && "Enter your email to reset password"}
                    </p>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                            <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Register Fields */}
                    {mode === 'register' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    First Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0 transition-colors"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0 transition-colors"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    {mode !== 'forgot' || mode === 'forgot' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0 transition-colors"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                        </div>
                    ) : null}

                    {/* Password */}
                    {mode !== 'forgot' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-2.5 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0 transition-colors"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Confirm Password */}
                    {mode === 'register' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0 transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Forgot Password Link */}
                    {mode === 'login' && (
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={() => setMode('forgot')}
                                className="text-sm text-gray-600 hover:text-black hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading && <Loader2 size={18} className="animate-spin" />}
                        {mode === 'login' && (isLoading ? 'Signing in...' : 'Sign In')}
                        {mode === 'register' && (isLoading ? 'Creating account...' : 'Create Account')}
                        {mode === 'forgot' && (isLoading ? 'Sending...' : 'Send Reset Link')}
                    </button>

                    {/* Mode Toggle */}
                    <div className="text-center pt-4 border-t border-gray-200">
                        {mode === 'login' && (
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => setMode('register')}
                                    className="text-black font-medium hover:underline"
                                >
                                    Sign up
                                </button>
                            </p>
                        )}
                        {mode === 'register' && (
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => setMode('login')}
                                    className="text-black font-medium hover:underline"
                                >
                                    Sign in
                                </button>
                            </p>
                        )}
                        {mode === 'forgot' && (
                            <p className="text-sm text-gray-600">
                                Remember your password?{' '}
                                <button
                                    type="button"
                                    onClick={() => setMode('login')}
                                    className="text-black font-medium hover:underline"
                                >
                                    Sign in
                                </button>
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthModal;
