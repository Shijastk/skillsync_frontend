import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, UserPlus, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Register = () => {
    const { register } = useAuthContext();
    const { success, error: showError } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
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
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
            showError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4 py-4 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className=" relative z-10">
                {/* Header */}
                <div className="text-center mb-6">
                    {/* <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-xl shadow-indigo-500/20 ring-2 ring-white/5">
                        <UserPlus className="w-6 h-6 text-white" />
                    </div> */}
                    <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
                    <p className="text-gray-400 text-sm">Join the community and start swapping skills</p>
                </div>

                {/* Register Card */}
                <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label htmlFor="firstName" className="text-xs font-medium text-gray-300 ml-1">
                                    First Name
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                    </div>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="block w-full pl-9 pr-3 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                                        placeholder="John"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="lastName" className="text-xs font-medium text-gray-300 ml-1">
                                    Last Name
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                    </div>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="block w-full pl-9 pr-3 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1">
                            <label htmlFor="email" className="text-xs font-medium text-gray-300 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-9 pr-3 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1">
                            <label htmlFor="password" className="text-xs font-medium text-gray-300 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-9 pr-10 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                                    placeholder="At least 8 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-1">
                            <label htmlFor="confirmPassword" className="text-xs font-medium text-gray-300 ml-1">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="block w-full pl-9 pr-10 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                                    placeholder="Repeat password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                                <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                                <p className="text-xs text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Terms & Conditions */}
                        <div className="flex items-start ml-1">
                            <div className="flex items-center h-4 mt-0.5">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    className="h-3.5 w-3.5 bg-black/50 border-white/20 text-indigo-500 focus:ring-indigo-500 rounded transition-colors"
                                />
                            </div>
                            <div className="ml-2 text-xs">
                                <label htmlFor="terms" className="text-gray-400">
                                    I agree to the{' '}
                                    <Link to="/terms" className="font-medium text-indigo-400 hover:text-indigo-300">
                                        Terms and Conditions
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="font-medium text-indigo-400 hover:text-indigo-300">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 bg-white text-black rounded-lg font-bold text-base hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/5"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin mr-2" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-3 bg-black text-xs text-gray-500 rounded">Already have an account?</span>
                        </div>
                    </div>

                    {/* Sign In Link */}
                    <Link
                        to="/login"
                        className="w-full flex justify-center items-center py-3 px-4 bg-transparent border border-white/20 rounded-lg text-white text-sm font-semibold hover:bg-white/5 transition-all"
                    >
                        Sign In Instead
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
