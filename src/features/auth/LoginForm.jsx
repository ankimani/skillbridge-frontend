import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../components/services/authService';
import { Eye, EyeOff, User, Lock, Loader2, X, ArrowRight, LogIn } from 'lucide-react';
import { setAuthErrorSetter } from '../../components/services/apiInterceptor';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { toast } from 'react-toastify';
import ErrorBanner from '../../features/shared/ErrorBanner';

const LoginForm = () => {
    const [formData, setFormData] = useState({ 
        username: '', 
        password: '' 
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const authError = useAuthStore((state) => state.authError);
    const setAuthError = useAuthStore((state) => state.setAuthError);
    const login = useAuthStore((state) => state.login);
    const addNotification = useNotificationStore((state) => state.addNotification);

    useEffect(() => {
        setAuthErrorSetter(setAuthError);
        return () => setAuthError(null);
    }, [setAuthError]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
        if (authError) setAuthError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.username.trim() || !formData.password.trim()) {
            setError("Please fill in all fields");
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const { token, user } = await loginUser(formData.username, formData.password);
            localStorage.setItem("authToken", token);
            login(user, token);
            setAuthError(null);

            if (user.roleName === "ROLE_ADMIN") {
                navigate("/admin");
            } else if (user.roleName === "ROLE_TUTOR") {
                const tutorRoutes = {
                    PROFILE: "/profileform",
                    EDUCATION: "/education",
                    EXPERIENCE: "/experience",
                    SUBJECTS: "/subjects",
                    DETAILS: "/details",
                    COMPLETE: "/jobs"
                };
                navigate(tutorRoutes[user.stepName] || "/login");
            } else if (user.roleName === "ROLE_STUDENT") {
                navigate(user.stepName === "PROFILE" ? "/profile-info" : "/studentdashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            toast.error(err.message || "Invalid username or password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* SkillBridge Branded Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Large SkillBridge text watermark */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl font-bold text-blue-100/20 select-none pointer-events-none">
                    SkillBridge
                </div>
                
                {/* Subtle geometric patterns */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-200/10 to-purple-200/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200/10 to-blue-200/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-2xl"></div>
                
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.1) 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>
            </div>

            <div className="relative w-full max-w-md z-10">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Gradient Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <LogIn className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Sign In</h2>
                                <p className="text-blue-100 text-sm">Welcome back to SkillBridge</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <ErrorBanner />

                        {/* Error Messages */}
                        {authError && (
                            <div className="rounded-xl p-4 bg-red-50 text-red-700 flex items-center border border-red-200">
                                <X className="w-5 h-5 mr-3 text-red-500" />
                                <span>{authError}</span>
                            </div>
                        )}

                        {error && (
                            <div className="rounded-xl p-4 bg-red-50 text-red-700 flex items-center border border-red-200">
                                <X className="w-5 h-5 mr-3 text-red-500" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username Field */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span>Username</span>
                                    </div>
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    className="w-full px-4 py-3 text-sm border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                                    placeholder="Enter your username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                    <div className="flex items-center space-x-2">
                                        <Lock className="h-4 w-4 text-gray-500" />
                                        <span>Password</span>
                                    </div>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        id="password"
                                        className="w-full px-4 py-3 pr-12 text-sm border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="remember-me" className="ml-3 text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>

                                <Link 
                                    to="/forgot-password" 
                                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={`w-full py-3 px-6 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                                    isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                                }`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="h-4 w-4 mr-2" />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Register Link */}
                        <div className="text-center pt-6 border-t border-gray-100">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-blue-600 hover:text-blue-500 font-semibold underline">
                                    Create account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;