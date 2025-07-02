import { useState } from 'react';
import { Settings, Key, Eye, EyeOff } from 'lucide-react';
import { changePassword, validatePassword } from '../services/changePassword';

const SettingsTab = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleShowPassword = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setLoading(true);

    // Validate form
    const validationErrors = {};
    
    if (!formData.oldPassword) {
      validationErrors.oldPassword = 'Current password is required';
    }
    
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      validationErrors.newPassword = passwordError;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      // Get token from wherever you store it (localStorage, context, etc.)
      const token = localStorage.getItem('authToken'); // Adjust based on your auth setup
      
      await changePassword(
        token,
        formData.oldPassword,
        formData.newPassword,
        formData.confirmPassword
      );
      
      setSuccess('Password changed successfully!');
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Password Change Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Key className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                {errors.submit}
              </div>
            )}
            
            {success && (
              <div className="text-green-500 text-sm p-2 bg-green-50 rounded">
                {success}
              </div>
            )}
            
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.old ? "text" : "password"}
                  id="oldPassword"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.oldPassword ? 'border-red-300' : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('old')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.old ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.oldPassword}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.newPassword ? 'border-red-300' : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('new')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters with uppercase, lowercase, and special characters.
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('confirm')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
        
        {/* Other Settings Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Settings className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
          </div>
          <p className="text-gray-500">More configuration options will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;