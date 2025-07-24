import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaSpinner, FaTimes } from 'react-icons/fa';
import { tokenStorage, jwtUtils } from '../../utils/auth';

const LoginForm = () => {
    const [formData, setFormData] = useState({ 
        username: '', 
        password: '' 
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.username.trim() || !formData.password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const { token, user } = await loginUser(formData.username, formData.password);
            tokenStorage.set(token);

            // Handle user redirection based on role and step
            if (user.roleName === 'ROLE_ADMIN') {
                navigate('/admin');
            } else if (user.roleName === 'ROLE_TUTOR') {
                const tutorRoutes = {
                    PROFILE: '/profileform',
                    EDUCATION: '/education',
                    EXPERIENCE: '/experience',
                    SUBJECTS: '/subjects',
                    DETAILS: '/details',
                    COMPLETE: '/jobs'
                };
                navigate(tutorRoutes[user.stepName] || '/login');
            } else if (user.roleName === 'ROLE_STUDENT') {
                navigate(user.stepName === 'PROFILE' ? '/profile-info' : '/studentdashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-800">Sign in to your account</h1>
                    <p className="text-gray-500 mt-1 text-sm">Enter your credentials to continue</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
                        <FaTimes className="mr-2 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaUser className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="username@example.com"
                                value={formData.username}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                id="password"
                                className="block w-full pl-9 pr-9 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                                ) : (
                                    <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 text-gray-600">
                                Remember me
                            </label>
                        </div>

                        <Link 
                            to="/forgot-password" 
                            className="text-indigo-500 hover:text-indigo-400"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                        } focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 transition-colors`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <FaSpinner className="animate-spin mr-2 h-3.5 w-3.5" />
                                Signing in...
                            </>
                        ) : (
                            'Sign in'
                        )}
                    </button>
                </form>

                <div className="mt-6 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-2 bg-white text-xs text-gray-500">
                            Don't have an account?
                        </span>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <Link
                        to="/register"
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Create new account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;