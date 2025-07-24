import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { saveBillingInfo } from '../services/coinWallet';
import { FaUser, FaGlobe, FaMapMarkerAlt, FaCity, FaPhone, FaArrowRight, FaTimes } from 'react-icons/fa';

const BillingInfoModal = ({ userId , isOpen, onClose, onContinue, initialData }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    country: '',
    state: '',
    city: '',
    address: '',
    contactNo: '',
  });

  const [loading, setLoading] = useState(false);

  // Pre-fill form if initialData is provided
  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened with initialData:', initialData);
      if (initialData) {
        const billingData = initialData.body?.data || initialData;
        console.log('Extracted billing data:', billingData);
        setFormData({
          fullName: billingData.body.data.fullName || '',
          country: billingData.body.data.country || '',
          state: billingData.body.data.state || '',
          city: billingData.body.data.city || '',
          address: billingData.body.data.address || '',
          contactNo: billingData.body.data.contactNo || ''
        });
      } else {
        // Reset form if no initialData
        setFormData({
          fullName: '',
          country: '',
          state: '',
          city: '',
          address: '',
          contactNo: ''
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Basic validation
    if (!formData.fullName || !formData.country || !formData.city || !formData.address || !formData.contactNo) {
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }
  
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }
  
      // Use the existing service function
      await saveBillingInfo(userId, formData, token);
      
      // Continue to payment
      onContinue(formData);
    } catch (err) {
      console.error('Billing info error:', err);
      toast.error(err.message || 'Failed to save billing information');
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Billing Information</h2>
            <button 
              onClick={onClose} 
              className="text-white hover:text-gray-200 focus:outline-none text-xl"
            >
              &times;
            </button>
          </div>
          <p className="mt-1 opacity-90">Please enter your billing details</p>
        </div>
        
        {/* Scrollable Content Area */}
        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaUser className="mr-2 text-gray-500" />
                Full Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                required
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaGlobe className="mr-2 text-gray-500" />
                Country <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                required
              />
            </div>

            {/* State/Region */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-gray-500" />
                State/Region
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaCity className="mr-2 text-gray-500" />
                City <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                required
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaPhone className="mr-2 text-gray-500" />
                Phone Number <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="tel"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-colors flex items-center justify-center ${
                  loading ? 'bg-indigo-400' : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
                }`}
                disabled={loading}
              >
                {loading ? 'Saving...' : (
                  <>
                    Continue to Payment
                    <FaArrowRight className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BillingInfoModal;