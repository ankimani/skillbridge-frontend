import React, { useState, useEffect } from 'react';
import { FaKey, FaTimes, FaCheckCircle, FaExclamationTriangle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { changePassword, validatePassword } from '../services/changePassword';

const ChangePasswordModal = ({ onClose, onSave = () => {} })=> {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    form: ''
  });
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Validate individual fields on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate new password complexity
  useEffect(() => {
    if (formData.newPassword && !errors.newPassword) {
      const validationError = validatePassword(formData.newPassword);
      if (validationError) {
        setErrors(prev => ({ ...prev, newPassword: validationError }));
      }
    }
  }, [formData.newPassword, errors.newPassword]);

  // Validate password match
  useEffect(() => {
    if (formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords don't match" }));
    } else if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  }, [formData.confirmPassword, formData.newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      form: ''
    });

    // Validate all fields
    let hasErrors = false;
    const newErrors = { ...errors };

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      hasErrors = true;
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
      hasErrors = true;
    } else {
      const validationError = validatePassword(formData.newPassword);
      if (validationError) {
        newErrors.newPassword = validationError;
        hasErrors = true;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
      hasErrors = true;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await changePassword(
        token,
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      );

      // Check backend response for success
      if (response.headers?.responseCode === 200) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          onSave();
        }, 1500);
      } else {
        throw new Error(response.headers?.customerMessage || 'Password change failed');
      }
    } catch (err) {
      // Handle specific error cases
      const errorMessage = err.message || 'Failed to change password';
      
      if (errorMessage.toLowerCase().includes('old password') || 
          errorMessage.toLowerCase().includes('current password')) {
        setErrors(prev => ({ 
          ...prev, 
          currentPassword: errorMessage,
          form: errorMessage 
        }));
      } else {
        setErrors(prev => ({ ...prev, form: errorMessage }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <FaKey className="mr-2" />
            Change Password
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isLoading}
          >
            <FaTimes />
          </button>
        </div>
        
        {success ? (
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <FaCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Password Changed!</h3>
            <p className="mt-2 text-sm text-gray-500">
              Your password has been updated successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaExclamationTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.form}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="currentPassword">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500 pr-10 text-gray-900 ${
                    errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility('current')}
                  tabIndex="-1"
                >
                  {showPasswords.current ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="newPassword">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500 pr-10 text-gray-900 ${
                    errors.newPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.newPassword}
                  onChange={handleChange}
                  minLength="8"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility('new')}
                  tabIndex="-1"
                >
                  {showPasswords.new ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.newPassword ? (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters with uppercase, lowercase, and special character
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500 pr-10 text-gray-900 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength="8"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility('confirm')}
                  tabIndex="-1"
                >
                  {showPasswords.confirm ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Changing...
                  </>
                ) : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;