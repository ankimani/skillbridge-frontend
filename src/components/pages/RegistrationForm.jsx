import React, { useState, useEffect } from 'react';
import { registerUser, getLatestTermsAndConditions } from '../services/registerUser';
import { Eye, EyeOff, Check, X, Loader2 } from 'lucide-react';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    joinAs: 'Tutor'
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [termsContent, setTermsContent] = useState(null);
  const [isLoadingTerms, setIsLoadingTerms] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isTermsModalOpen) {
        setIsTermsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTermsModalOpen]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await registerUser({
        ...formData,
        acceptedTerms: true
      });
      const responseCode = res?.headers?.responseCode;
      const customerMessage = res?.headers?.customerMessage || 'Registration successful!';

      if (responseCode === 200) {
        setMessageType('success');
        setMessage(customerMessage);
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          joinAs: 'Tutor'
        });
        setAcceptedTerms(false);
      } else {
        setMessageType('error');
        setMessage(customerMessage || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setMessageType('error');
      setMessage(err.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewTerms = async (e) => {
    e.preventDefault();
    setIsLoadingTerms(true);
    
    try {
      const response = await getLatestTermsAndConditions();
      
      if (response?.body?.data?.content) {
        setTermsContent(response.body.data.content);
        setIsTermsModalOpen(true);
      } else {
        throw new Error('Invalid terms and conditions format');
      }
    } catch (error) {
      console.error('Error loading terms:', error);
      setMessageType('error');
      setMessage('Failed to load terms and conditions. Please try again.');
      setIsTermsModalOpen(false);
    } finally {
      setIsLoadingTerms(false);
    }
  };

  const passwordRequirements = [
    { id: 1, text: 'At least 8 characters', meets: formData.password.length >= 8 },
    { id: 2, text: 'Contains a number', meets: /\d/.test(formData.password) },
    { id: 3, text: 'Contains a special character', meets: /[!@#$%^&*]/.test(formData.password) }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg px-6 py-8 max-w-md w-full space-y-4 border border-gray-100">
        {/* Form header */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Create Your Account</h2>
          <p className="text-xs text-gray-500 mt-1">Join as a tutor or student</p>
        </div>

        {/* Status message */}
        {message && (
          <div className={`p-2 rounded-md text-xs font-medium ${
            messageType === 'success' 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Join As selection */}
        <div>
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Join As</label>
          <div className="flex border border-gray-200 rounded-md overflow-hidden">
            {['Tutor', 'Student'].map((role) => (
              <button
                key={role}
                type="button"
                className={`flex-1 py-1.5 text-xs font-medium ${
                  formData.joinAs === role
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, joinAs: role }))}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Username field */}
        <div>
          <label htmlFor="username" className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`block w-full p-2 text-xs border ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <X className="mr-1 h-3 w-3" /> {errors.username}
            </p>
          )}
        </div>

        {/* Email field */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`block w-full p-2 text-xs border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <X className="mr-1 h-3 w-3" /> {errors.email}
            </p>
          )}
        </div>

        {/* Password field */}
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`block w-full p-2 pr-8 text-xs border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Create a password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-2 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <X className="mr-1 h-3 w-3" /> {errors.password}
            </p>
          )}

          {/* Password requirements */}
          {formData.password && (
            <div className="mt-2 space-y-1">
              {passwordRequirements.map(req => (
                <div key={req.id} className="flex items-center text-xs">
                  {req.meets ? (
                    <Check className="text-green-500 mr-1 h-3 w-3" />
                  ) : (
                    <X className="text-gray-400 mr-1 h-3 w-3" />
                  )}
                  <span className={req.meets ? 'text-green-600' : 'text-gray-500'}>{req.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirm Password field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`block w-full p-2 pr-8 text-xs border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-2 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <X className="mr-1 h-3 w-3" /> {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="flex flex-col space-y-2">
          <div className="text-xs">
            <button
              type="button"
              onClick={handleViewTerms}
              className="text-indigo-600 hover:text-indigo-500 underline bg-transparent border-none p-0 font-medium cursor-pointer"
            >
              Read Terms and Conditions
            </button>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-4">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="focus:ring-indigo-500 h-3.5 w-3.5 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-2 text-xs">
              <label htmlFor="terms" className="text-gray-700">
                I agree to the Terms and Conditions
              </label>
              {errors.terms && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <X className="mr-1 h-3 w-3" /> {errors.terms}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || !acceptedTerms}
          className={`w-full py-2 px-4 text-xs font-semibold rounded-md shadow-sm ${
            isSubmitting
              ? 'bg-indigo-400 cursor-not-allowed'
              : !acceptedTerms
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white transition duration-150 flex justify-center items-center`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-3.5 w-3.5" />
              Registering...
            </>
          ) : (
            'Register'
          )}
        </button>

        {/* Login link */}
        <div className="text-center text-xs text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </a>
        </div>
      </form>

      {/* Terms and Conditions Modal */}
      {isTermsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsTermsModalOpen(false)}
          />
          
          <div className="relative bg-white rounded-lg shadow-sm max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
            <div className="p-4 overflow-y-auto max-h-[80vh]">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Terms and Conditions
              </h3>
              
              {isLoadingTerms ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="animate-spin h-6 w-6 text-indigo-600" />
                </div>
              ) : (
                <div 
                  className="prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: termsContent }}
                />
              )}
            </div>
            
            <div className="bg-gray-50 px-4 py-2 flex justify-end">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-3 py-1.5 bg-indigo-600 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500"
                onClick={() => setIsTermsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}