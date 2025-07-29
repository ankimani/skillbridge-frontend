import React, { useState, useEffect } from "react";
import Footer from '../shared/Footer';
import { fetchUserProfile } from '../../components/services/authProfile';
import { fetchTeacherProfile, updateTeacherProfile } from '../../components/services/teacherProfile';
import { fetchTeacherEducation, updateTeacherEducation, createTeacherEducation } from '../../components/services/teacherEducationProfile';
import { fetchTeacherExperience, updateTeacherExperience, createTeacherExperience } from "../../components/services/teacherExperienceProfile";
import { fetchTeachingDetails, updateTeachingDetails } from "../../components/services/teachingDetailsProfile";
import { fetchSubjectExperience } from "../../components/services/teacherSubjectsProfile";
import { useAuthStore } from '../../store/useAuthStore';

// Modal Components


const ProfileEditModal = ({ profile, onClose, onSave, saveLoading }) => {
  // Format date for HTML date input (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    // If it's already in YYYY-MM-DD format, return as is
    if (dateString.includes('-') && dateString.length === 10) {
      return dateString;
    }
    // If it's a date object or different format, convert it
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const [formData, setFormData] = useState({
    ...profile,
    birthdate: formatDateForInput(profile.birthdate)
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-3xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Edit Profile</h2>
                <p className="text-blue-100 text-sm">Update your personal information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <div className="space-y-6">
            {/* Birthdate Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Birthdate
              </label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
            </div>

            {/* Location Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your location"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
            </div>

            {/* Postal Code Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Enter postal code"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
            </div>

            {/* Phone Number Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
            </div>

            {/* Profile Description Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Profile Description
              </label>
              <textarea
                name="profileDescription"
                value={formData.profileDescription}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              disabled={saveLoading}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                saveLoading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
              }`}
            >
              {saveLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
  
  const EducationEditModal = ({ education, onClose, onSave, saveLoading }) => {
    console.log('EducationEditModal - received education:', education);
    
    // Format dates for the input fields
    const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      // If it's already in YYYY-MM-DD format, return as is
      if (dateString.includes('-') && dateString.length === 10) {
        return dateString;
      }
      // If it's a date object or different format, convert it
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
      } catch (error) {
        console.error('Error formatting date:', error);
        return '';
      }
    };
  
    const [formData, setFormData] = useState({
      ...education,
      startDate: formatDateForInput(education.startDate),
      endDate: formatDateForInput(education.endDate)
    });
  
    console.log('EducationEditModal - formatted formData:', formData);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/20">
          {/* Modern Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-3xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Edit Education</h2>
                  <p className="text-blue-100 text-sm">Update your educational background</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Institution Name Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Institution Name
                </label>
                <input
                  type="text"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                  placeholder="Enter institution name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                />
              </div>

              {/* Degree Type Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Degree Type
                </label>
                <select
                  name="degreeType"
                  value={formData.degreeType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                >
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="PhD">Doctorate/PHD</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Secondary">Secondary</option>
                  <option value="Higher Secondary">Higher Secondary</option>
                  <option value="Junior Secondary">Junior Secondary</option>
                  <option value="Advanced Diploma">Advanced Diploma</option>
                  <option value="Post Graduation">Post Graduation</option>
                  <option value="Certification">Certification</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Degree Name Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Degree Name
                </label>
                <input
                  type="text"
                  name="degreeName"
                  value={formData.degreeName}
                  onChange={handleChange}
                  placeholder="Enter degree name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                />
              </div>

              {/* Date Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Specialization Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="Enter specialization"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                />
              </div>

              {/* Association Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Study Mode
                </label>
                <select
                  name="association"
                  value={formData.association}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              {/* Score Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  GPA Score
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="4"
                  name="score"
                  value={formData.score}
                  onChange={handleChange}
                  placeholder="Enter GPA (0-4)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(formData)}
                disabled={saveLoading}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                  saveLoading 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl'
                }`}
              >
                {saveLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  'Save Education'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const ExperienceEditModal = ({ experience, onClose, onSave,currentExperienceIndex, saveLoading }) => {
    // Format date for HTML date input (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      // If it's already in YYYY-MM-DD format, return as is
      if (dateString.includes('-') && dateString.length === 10) {
        return dateString;
      }
      // If it's a date object or different format, convert it
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
      } catch (error) {
        console.error('Error formatting date:', error);
        return '';
      }
    };

    const [formData, setFormData] = useState({
      organizationName: experience.organizationName || "",
      organizationUrl: experience.organizationUrl || "",
      designation: experience.designation || "",
      startDate: formatDateForInput(experience.startDate),
      endDate: experience.currentJob ? "" : formatDateForInput(experience.endDate),
      association: experience.association || "Full-time",
      jobDescription: experience.jobDescription || "",
      skills: experience.skills ? [...experience.skills] : [],
      currentJob: experience.currentJob || false
    });
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      
      if (name === 'currentJob') {
        setFormData(prev => ({ 
          ...prev, 
          [name]: checked,
          endDate: checked ? "" : prev.endDate // Clear endDate when currentJob is checked
        }));
      } else {
        setFormData(prev => ({ 
          ...prev, 
          [name]: type === 'checkbox' ? checked : value 
        }));
      }
    };
  
    const handleSkillsChange = (e, index) => {
      const newSkills = [...formData.skills];
      newSkills[index] = e.target.value;
      setFormData(prev => ({ ...prev, skills: newSkills }));
    };
  
    const addSkill = () => {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, ''] }));
    };
  
    const removeSkill = (index) => {
      const newSkills = formData.skills.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, skills: newSkills }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };
  
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/20">
          {/* Modern Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-t-3xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {currentExperienceIndex !== null ? "Edit Experience" : "Add New Experience"}
                  </h2>
                  <p className="text-green-100 text-sm">Update your professional experience</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Organization Name Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Organization Name*
                  </label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="Enter organization name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    required
                  />
                </div>

                {/* Designation Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Designation*
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Enter your job title"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    required
                  />
                </div>

                {/* Date Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Start Date*
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      required
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      End Date*
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                        formData.currentJob ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      disabled={formData.currentJob}
                      required={!formData.currentJob}
                    />
                  </div>
                </div>

                {/* Current Job Checkbox */}
                <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-200">
                  <input
                    type="checkbox"
                    name="currentJob"
                    checked={formData.currentJob}
                    onChange={handleChange}
                    className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    id="currentJobCheckbox"
                  />
                  <label htmlFor="currentJobCheckbox" className="ml-3 block text-sm font-semibold text-gray-700">
                    This is my current job
                  </label>
                </div>

                {/* Job Description Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Job Description
                  </label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your responsibilities and achievements..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                  />
                </div>

                {/* Skills Section */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Skills
                  </label>
                  
                  {formData.skills.length > 0 ? (
                    <div className="space-y-3">
                      {formData.skills.map((skill, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => handleSkillsChange(e, index)}
                            placeholder="Enter a skill"
                            className="flex-grow px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="ml-3 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                            aria-label="Remove skill"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No skills added yet</p>
                  )}
                  
                  <button
                    type="button"
                    onClick={addSkill}
                    className="mt-3 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-xl font-semibold hover:from-orange-200 hover:to-red-200 transition-all duration-200 border border-orange-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Skill
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                    saveLoading 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {saveLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </div>
                  ) : (
                    currentExperienceIndex !== null ? "Update Experience" : "Add Experience"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  const TeachingDetailsEditModal = ({ details, onClose, onSave, saveLoading }) => {
    const [formData, setFormData] = useState(details);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/20">
          {/* Modern Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-3xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Edit Professional Details</h2>
                  <p className="text-purple-100 text-sm">Update your professional service preferences</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Online Professional */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                  Available for online professional services?
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="onlineProfessional"
                    checked={formData.onlineProfessional}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-700">Online Professional Services</label>
                </div>
              </div>

              {/* Travel Willingness */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Willing to travel for professional services?
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="travelWillingness"
                    checked={formData.travelWillingness}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-700">Travel for Professional Services</label>
                </div>
              </div>

              {/* Currently Employed */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.815-8.927-2.2M21 13.255L18.5 15.5m0 0l-3-3m3 3l3-3M3 13.255A23.931 23.931 0 0012 15c3.183 0 6.22-.815 8.927-2.2M3 13.255L5.5 15.5m0 0l3-3m-3 3l-3-3" />
                  </svg>
                  Currently employed as professional?
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="currentlyEmployed"
                    checked={formData.currentlyEmployed}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-700">Currently Employed as Professional</label>
                </div>
              </div>

              {/* Digital Pen */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Digital Pen Available
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="digitalPen"
                    checked={formData.digitalPen}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-700">Digital Pen Available</label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button onClick={onClose} className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105">
                Cancel
              </button>
              <button onClick={() => onSave(formData)} disabled={saveLoading} className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${saveLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'}`}>
                {saveLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  'Save Professional Details'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default function TeacherProfile() {
  const [userProfile, setUserProfile] = useState({
    userId: '',
    displayName: '',
    gender: '',
    birthdate: '',
    location: '',
    postalCode: '',
    phoneNumber: '',
    profileDescription: '',
    imagePath: '',
  });

  const [educationList, setEducationList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [teachingDetails, setTeachingDetails] = useState({
    teacherId: '',
    rate: "hourly",
    maxFee: 0,
    minFee: 0,
    paymentDetails: "",
    totalExpYears: 0,
    onlineExpYears: 0,
    travelWillingness: false,
    travelDistance: 0,
    onlineAvailability: false,
    homeAvailability: false,
    homeworkHelp: false,
    currentlyEmployed: false,
    workPreference: "",
  });
  const [subjects, setSubjects] = useState([]);
  
  // Modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showTeachingModal, setShowTeachingModal] = useState(false);
  const [currentEducationIndex, setCurrentEducationIndex] = useState(null);
  const [currentExperienceIndex, setCurrentExperienceIndex] = useState(null);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [loadingSections, setLoadingSections] = useState({
    profile: true,
    education: true,
    experience: true,
    teaching: true,
    subjects: true
  });
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [saveLoading, setSaveLoading] = useState({ profile: false, education: false, experience: false, teaching: false });

  // Get user from auth store
  const authUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  // Optimized fetch function with timeout
  const fetchWithTimeout = async (fetchFn, timeout = 5000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const result = await fetchFn();
      clearTimeout(timeoutId);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  };

  // Move fetchProfileData outside useEffect
  const fetchProfileData = async () => {
    if (!token || !authUser?.userId) {
      setError('No authentication token or user data found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Use userId from auth store instead of fetching again
      const userId = authUser.userId;
      
      // Fetch critical data first (profile)
      const teacherProfile = await fetchWithTimeout(() => fetchTeacherProfile(userId, token));
      
      setUserProfile({
        userId: teacherProfile.userId,
        displayName: teacherProfile.displayName || '',
        gender: teacherProfile.gender || '',
        birthdate: teacherProfile.birthdate || '',
        location: teacherProfile.location || '',
        postalCode: teacherProfile.postalCode || '',
        phoneNumber: teacherProfile.phoneNumber || '',
        profileDescription: teacherProfile.profileDescription || '',
        imagePath: teacherProfile.imagePath || '',
      });
      setLoadingSections(prev => ({ ...prev, profile: false }));

      // Fetch remaining data in parallel with individual error handling
      const fetchPromises = [
        // Education
        fetchWithTimeout(() => fetchTeacherEducation(userId, token))
          .then(data => {
            setEducationList((data || []).map(edu => ({
              educationId: edu.educationId,
              institutionName: edu.institutionName || '',
              degreeType: edu.degreeType || 'Bachelor',
              degreeName: edu.degreeName || '',
              startDate: edu.startDate || '',
              endDate: edu.endDate || '',
              association: edu.association || "Full-time",
              specialization: edu.specialization || '',
              score: edu.score || 0
            })));
            setLoadingSections(prev => ({ ...prev, education: false }));
          })
          .catch(() => {
            setEducationList([]);
            setLoadingSections(prev => ({ ...prev, education: false }));
          }),

        // Experience
        fetchWithTimeout(() => fetchTeacherExperience(userId, token))
          .then(data => {
            setExperienceList((data || []).map(exp => ({
              experienceId: exp.experienceId,
              organizationName: exp.organizationName || '',
              organizationUrl: exp.organizationUrl || "#",
              designation: exp.designation || '',
              jobDescription: exp.jobDescription || "No description provided",
              startDate: exp.startDate || '',
              endDate: exp.endDate || '',
              association: exp.association || "Full-time",
              skills: exp.skills || [],
              currentJob: exp.currentJob || false
            })));
            setLoadingSections(prev => ({ ...prev, experience: false }));
          })
          .catch(() => {
            setExperienceList([]);
            setLoadingSections(prev => ({ ...prev, experience: false }));
          }),

        // Professional Details
        fetchWithTimeout(() => fetchTeachingDetails(userId, token))
          .then(data => {
            if (data) {
              setTeachingDetails({
                teacherId: data.teacherId,
                rate: data.rate || "hourly",
                maxFee: data.maxFee || 0,
                minFee: data.minFee || 0,
                paymentDetails: data.paymentDetails || "",
                totalExpYears: data.totalExpYears || 0,
                onlineExpYears: data.onlineExpYears || 0,
                travelWillingness: data.travelWillingness || false,
                travelDistance: data.travelDistance || 0,
                onlineAvailability: data.onlineAvailability || false,
                homeAvailability: data.homeAvailability || false,
                homeworkHelp: data.homeworkHelp || false,
                currentlyEmployed: data.currentlyEmployed || false,
                workPreference: data.workPreference || "",
              });
            }
            setLoadingSections(prev => ({ ...prev, teaching: false }));
          })
          .catch(() => {
            setLoadingSections(prev => ({ ...prev, teaching: false }));
          }),

        // Subjects
        fetchWithTimeout(() => fetchSubjectExperience(userId, token))
          .then(data => {
            setSubjects(data.subjects || []);
            setLoadingSections(prev => ({ ...prev, subjects: false }));
          })
          .catch(() => {
            setSubjects([]);
            setLoadingSections(prev => ({ ...prev, subjects: false }));
          })
      ];

      await Promise.allSettled(fetchPromises);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError(err.message || "Failed to load profile data");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && authUser?.userId) {
      fetchProfileData();
    } else if (!token) {
      setLoading(false);
      setError('No authentication token available. Please login again.');
    } else if (!authUser?.userId) {
      setLoading(false);
      setError('User data not available. Please login again.');
    } else {
      setLoading(false);
      setError('No authentication data available');
    }
  }, [token, authUser?.userId]);

  // Add loading and error states to the return
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="sticky top-0 z-10">
        </div>
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="sticky top-0 z-10">
        </div>
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center text-red-500">
            <p>Error loading profile: {error}</p>
            <button 
              onClick={() => fetchProfileData()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Keep all the modal handlers the same
  const openProfileModal = () => setShowProfileModal(true);
  const openEducationModal = (index = null) => {
    setCurrentEducationIndex(index);
    setShowEducationModal(true);
  };
  const openExperienceModal = (index = null) => {
    setCurrentExperienceIndex(index);
    setShowExperienceModal(true);
  };
  const openTeachingModal = () => setShowTeachingModal(true);

  const saveProfile = async (data) => {
    setSaveLoading(prev => ({ ...prev, profile: true }));
    try {
      if (!token) throw new Error('No authentication token found');
      await updateTeacherProfile(userProfile.userId, {
        birthdate: data.birthdate,
        location: data.location,
        postalCode: data.postalCode,
        phoneNumber: data.phoneNumber,
        profileDescription: data.profileDescription,
      }, token);
      // Refetch only profile data instead of everything
      const teacherProfile = await fetchWithTimeout(() => fetchTeacherProfile(userProfile.userId, token));
      setUserProfile({
        userId: teacherProfile.userId,
        displayName: teacherProfile.displayName || '',
        gender: teacherProfile.gender || '',
        birthdate: teacherProfile.birthdate || '',
        location: teacherProfile.location || '',
        postalCode: teacherProfile.postalCode || '',
        phoneNumber: teacherProfile.phoneNumber || '',
        profileDescription: teacherProfile.profileDescription || '',
        imagePath: teacherProfile.imagePath || '',
      });
      setShowProfileModal(false);
      setNotification({ type: 'success', message: 'Profile updated successfully!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ type: 'error', message: `Error updating profile: ${error.message}` });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setSaveLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const saveEducation = async (data) => {
    setSaveLoading(prev => ({ ...prev, education: true }));
    try {
      if (!token) throw new Error('No authentication token found');
      if (currentEducationIndex !== null) {
        const educationToUpdate = educationList[currentEducationIndex];
        await updateTeacherEducation(
          educationToUpdate.educationId,
          userProfile.userId,
          {
            institutionName: data.institutionName,
            degreeType: data.degreeType,
            degreeName: data.degreeName,
            startDate: data.startDate,
            endDate: data.endDate,
            association: data.association,
            specialization: data.specialization,
            score: data.score
          },
          token
        );
        setNotification({ type: 'success', message: 'Education updated successfully!' });
      } else {
        await createTeacherEducation(
          userProfile.userId,
          {
            institutionName: data.institutionName,
            degreeType: data.degreeType,
            degreeName: data.degreeName,
            startDate: data.startDate,
            endDate: data.endDate,
            association: data.association,
            specialization: data.specialization,
            score: data.score
          },
          token
        );
        setNotification({ type: 'success', message: 'Education added successfully!' });
      }
      // Refetch only education data
      const educationData = await fetchWithTimeout(() => fetchTeacherEducation(userProfile.userId, token));
      setEducationList((educationData || []).map(edu => ({
        educationId: edu.educationId,
        institutionName: edu.institutionName || '',
        degreeType: edu.degreeType || 'Bachelor',
        degreeName: edu.degreeName || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        association: edu.association || "Full-time",
        specialization: edu.specialization || '',
        score: edu.score || 0
      })));
      setShowEducationModal(false);
      setCurrentEducationIndex(null);
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ type: 'error', message: `Error saving education: ${error.message}` });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setSaveLoading(prev => ({ ...prev, education: false }));
    }
  };

  const saveExperience = async (data) => {
    setSaveLoading(prev => ({ ...prev, experience: true }));
    try {
      if (!token) throw new Error('No authentication token found');
      if (currentExperienceIndex !== null) {
        const experienceToUpdate = experienceList[currentExperienceIndex];
        await updateTeacherExperience(
          experienceToUpdate.experienceId,
          userProfile.userId,
          {
            organizationName: data.organizationName,
            designation: data.designation,
            association: data.association,
            startDate: data.startDate,
            endDate: data.currentJob ? null : data.endDate,
            jobDescription: data.jobDescription,
            currentJob: data.currentJob,
            organizationUrl: data.organizationUrl,
            skills: data.skills
          },
          token
        );
        setNotification({ type: 'success', message: 'Experience updated successfully!' });
      } else {
        await createTeacherExperience(
          userProfile.userId,
          {
            organizationName: data.organizationName,
            designation: data.designation,
            startDate: data.startDate,
            endDate: data.currentJob ? null : data.endDate,
            association: data.association,
            jobDescription: data.jobDescription,
            currentJob: data.currentJob,
            organizationUrl: data.organizationUrl,
            skills: data.skills
          },
          token
        );
        setNotification({ type: 'success', message: 'Experience added successfully!' });
      }
      // Refetch only experience data
      const experienceData = await fetchWithTimeout(() => fetchTeacherExperience(userProfile.userId, token));
      setExperienceList((experienceData || []).map(exp => ({
        experienceId: exp.experienceId,
        organizationName: exp.organizationName || '',
        organizationUrl: exp.organizationUrl || "#",
        designation: exp.designation || '',
        jobDescription: exp.jobDescription || "No description provided",
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        association: exp.association || "Full-time",
        skills: exp.skills || [],
        currentJob: exp.currentJob || false
      })));
      setShowExperienceModal(false);
      setCurrentExperienceIndex(null);
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ type: 'error', message: `Error saving experience: ${error.message}` });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setSaveLoading(prev => ({ ...prev, experience: false }));
    }
  };

  const saveTeachingDetails = async (data) => {
    setSaveLoading(prev => ({ ...prev, teaching: true }));
    try {
      if (!token) throw new Error('No authentication token found');
      const updateData = {
        rate: data.rate,
        maxFee: Number(data.maxFee),
        minFee: Number(data.minFee),
        paymentDetails: data.paymentDetails || "",
        totalExpYears: Number(data.totalExpYears),
        onlineExpYears: Number(data.onlineExpYears),
        travelWillingness: data.travelWillingness,
        travelDistance: Number(data.travelDistance || 0),
        onlineAvailability: data.onlineAvailability,
        homeAvailability: data.homeAvailability,
        homeworkHelp: data.homeworkHelp,
        currentlyEmployed: data.currentlyEmployed,
        workPreference: data.workPreference,
      };
      const teachingDetailsId = teachingDetails.teacherId;
      await updateTeachingDetails(
        teachingDetailsId,
        userProfile.userId,
        updateData,
        token
      );
      setNotification({ type: 'success', message: 'Professional details updated successfully!' });
      // Refetch only teaching details
      const teachingDetailsData = await fetchWithTimeout(() => fetchTeachingDetails(userProfile.userId, token));
      if (teachingDetailsData) {
        setTeachingDetails({
          teacherId: teachingDetailsData.teacherId,
          rate: teachingDetailsData.rate || "hourly",
          maxFee: teachingDetailsData.maxFee || 0,
          minFee: teachingDetailsData.minFee || 0,
          paymentDetails: teachingDetailsData.paymentDetails || "",
          totalExpYears: teachingDetailsData.totalExpYears || 0,
          onlineExpYears: teachingDetailsData.onlineExpYears || 0,
          travelWillingness: teachingDetailsData.travelWillingness || false,
          travelDistance: teachingDetailsData.travelDistance || 0,
          onlineAvailability: teachingDetailsData.onlineAvailability || false,
          homeAvailability: teachingDetailsData.homeAvailability || false,
          homeworkHelp: teachingDetailsData.homeworkHelp || false,
          currentlyEmployed: teachingDetailsData.currentlyEmployed || false,
          workPreference: teachingDetailsData.workPreference || "",
        });
      }
      setShowTeachingModal(false);
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ type: 'error', message: `Error updating teaching details: ${error.message}` });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setSaveLoading(prev => ({ ...prev, teaching: false }));
    }
  };

  // The rest of your component remains the same
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar at the top */}
      <div className="sticky top-0 z-10">
      </div>
      
      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto p-8 bg-white shadow-2xl rounded-3xl mt-10 mb-10 relative">
          

               {/* Modern Profile Header with Gradient Banner */}
<div className="mb-10 relative overflow-hidden">
  {/* Gradient Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 opacity-90"></div>
  
  {/* Glassmorphic Overlay */}
  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
  
  {/* Content */}
  <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
    <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
      {/* Enhanced Profile Image */}
      <div className="flex-shrink-0 relative">
        <div className="w-40 h-40 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full overflow-hidden flex items-center justify-center shadow-2xl border-4 border-white/50 relative">
          {userProfile.imagePath ? (
            <img
              src={userProfile.imagePath}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="text-6xl text-indigo-400 font-bold">
              {userProfile.displayName?.charAt(0) || '?'}
            </div>
          )}
          {/* Status Badge */}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Profile Details */}
      <div className="flex-1 text-center lg:text-left">
        <div className="mb-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {userProfile.displayName}
          </h1>
          
          {/* Professional Title with Badge */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-semibold shadow-lg">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Professional
            </div>
          </div>
          
          {/* Contact Information with Enhanced Icons */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-6">
            {userProfile.location && (
              <div className="flex items-center text-gray-600 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">{userProfile.location}</span>
              </div>
            )}
            {userProfile.phoneNumber && (
              <div className="flex items-center text-gray-600 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-medium">{userProfile.phoneNumber}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced Personal Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Personal Details</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Gender</span>
                <span className="text-sm font-semibold text-gray-800">
                  {userProfile.gender ? (
                    <span className="capitalize bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs">{userProfile.gender}</span>
                  ) : (
                    <span className="text-gray-400">Not specified</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Birthdate</span>
                <span className="text-sm font-semibold text-gray-800">
                  {userProfile.birthdate ? (
                    new Date(userProfile.birthdate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  ) : (
                    <span className="text-gray-400">Not specified</span>
                  )}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Address</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Postal Code</span>
                <span className="text-sm font-semibold text-gray-800">
                  {userProfile.postalCode || <span className="text-gray-400">Not specified</span>}
                </span>
              </div>
              {userProfile.companyName && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Company</span>
                  <span className="text-sm font-semibold text-gray-800">{userProfile.companyName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Edit Button */}
      <div className="flex-shrink-0">
        <button 
          onClick={openProfileModal}
          className="group bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          aria-label="Edit profile"
        >
          <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</div>

{/* About Me */}
<Section title="About Me">
  <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800">Personal Introduction</h3>
      </div>
      <button 
        onClick={openProfileModal}
        className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        aria-label="Edit profile description"
      >
        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
    </div>
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
      <p className="text-gray-700 leading-relaxed text-lg">
        {userProfile.profileDescription || (
          <span className="text-gray-400 italic">No description provided. Click the edit button to add your personal introduction.</span>
        )}
      </p>
    </div>
  </div>
</Section>

        {/* Education */}
        <Section title="Education">
  <div className="space-y-6">
    {/* Add Education Button - Always visible */}
    <div className="flex justify-end">
      <button
        onClick={() => openEducationModal()}
        className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center"
      >
        <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Education
      </button>
    </div>

    {/* Education List */}
    {educationList.length > 0 ? (
      <div className="space-y-8">
        {educationList.map((education, index) => (
          <div
            key={education.educationId || index}
            className="group bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02]"
          >
            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Enhanced Institution Icon */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                
                {/* Enhanced Education Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {education.degreeName}
                      </h3>
                      <p className="text-lg text-blue-600 font-semibold mb-3">
                        {education.institutionName}
                      </p>
                    </div>
                    <button 
                      onClick={() => openEducationModal(index)}
                      className="group/edit bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      aria-label="Edit education"
                    >
                      <svg className="w-5 h-5 group-hover/edit:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>

                  {/* Enhanced Degree Badge */}
                  <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-bold px-4 py-2 rounded-full mb-6 border border-blue-200">
                    {education.degreeType}
                  </div>

                  {/* Enhanced Details Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {education.specialization && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                          <span className="text-sm font-semibold text-gray-600 block mb-1">Specialization</span>
                          <p className="text-gray-800 font-medium">{education.specialization}</p>
                        </div>
                      )}
                      {education.association && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                          <span className="text-sm font-semibold text-gray-600 block mb-1">Study Mode</span>
                          <p className="text-gray-800 font-medium">{education.association}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                        <span className="text-sm font-semibold text-gray-600 block mb-1">Duration</span>
                        <p className="text-gray-800 font-medium">
                          {new Date(education.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - {' '}
                          {new Date(education.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      {education.score && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                          <span className="text-sm font-semibold text-gray-600 block mb-2">GPA Score</span>
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl font-bold text-blue-600">{education.score}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500" 
                                style={{ width: `${(education.score / 4) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500">/ 4.0</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-dashed border-gray-300 p-12 text-center hover:border-blue-300 transition-all duration-300">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="h-10 w-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">No Education Added</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">Add your educational background to showcase your qualifications and expertise to potential students.</p>
      </div>
    )}
  </div>
</Section>

  {/* Experience */}
  <Section title="Professional Experience">
  <div className="space-y-6">
    {/* Add Experience Button - Always visible */}
    <div className="flex justify-end">
      <button
        onClick={() => openExperienceModal()}
        className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center"
      >
        <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Experience
      </button>
    </div>

    {/* Experience List */}
    {experienceList?.length > 0 ? (
      <div className="space-y-8">
        {experienceList.map((experience, index) => (
          <div
            key={experience.experienceId || index}
            className="group bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02]"
          >
            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Enhanced Company Logo/Icon */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                {/* Enhanced Experience Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {experience.designation}
                      </h3>
                      
                      <div className="flex items-center mb-3">
                        <a 
                          href={experience.organizationUrl || "#"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-lg text-green-600 hover:text-green-800 font-semibold inline-flex items-center transition-colors duration-200"
                        >
                          {experience.organizationName}
                          {experience.organizationUrl && (
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          )}
                        </a>
                        {experience.association && (
                          <span className="ml-4 text-sm bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full font-semibold border border-green-200">
                            {experience.association}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 inline-flex">
                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(experience.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} -{' '}
                        {experience.currentJob ? (
                          <span className="text-green-600 font-bold">Present</span>
                        ) : (
                          new Date(experience.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => openExperienceModal(index)}
                      className="group/edit bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      aria-label="Edit experience"
                    >
                      <svg className="w-5 h-5 group-hover/edit:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>

                  {/* Enhanced Responsibilities */}
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Key Responsibilities
                    </h4>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
                      <ul className="space-y-3">
                        {experience.jobDescription.split("\n").filter(Boolean).map((point, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full mr-4"></span>
                            <span className="text-gray-700 leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Enhanced Skills */}
                  {experience.skills?.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Skills Applied
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {experience.skills.map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold hover:from-green-200 hover:to-emerald-200 transition-all duration-200 border border-green-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-dashed border-gray-300 p-12 text-center hover:border-green-300 transition-all duration-300">
        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">No Professional Experience Added</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">Showcase your work history to highlight your expertise and professional achievements to potential students.</p>
      </div>
    )}
  </div>
</Section>
 {/* NEW SKILLS SECTION */}
 <Section title="Your Professional Skills">
            {subjects.length > 0 ? (
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Professional Subjects</h3>
                </div>
                <div className="flex flex-wrap gap-4">
                  {subjects.map((subject, index) => (
                    <span 
                      key={index}
                      className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 px-6 py-3 rounded-full text-sm font-semibold hover:from-yellow-200 hover:to-orange-200 transition-all duration-200 border border-yellow-200 shadow-sm hover:shadow-md"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-dashed border-gray-300 p-12 text-center hover:border-yellow-300 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="h-10 w-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No Subjects Added</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">Add the subjects you're qualified to teach to showcase your expertise to potential students.</p>
                <button className="group bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center">
                  <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Subjects
                </button>
              </div>
            )}
    </Section>
{/* Teaching Details */}
<Section title="Professional Preferences">
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Professional Preferences and Rates</h3>
          <p className="text-gray-600">Customize your professional details to match your style and preferences</p>
        </div>
        <button 
          onClick={openTeachingModal}
          className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          aria-label="Edit professional details"
        >
          <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Enhanced Rate Card */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-800">Rate</h4>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-2">
            ${teachingDetails?.minFee ?? 0} - ${teachingDetails?.maxFee ?? 0}
          </p>
          <p className="text-sm text-gray-600">
            per {teachingDetails?.rate ?? 'hour'}
          </p>
        </div>

        {/* Enhanced Experience Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-800">Experience</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Experience</span>
              <span className="text-xl font-bold text-blue-600">{teachingDetails?.totalExpYears ?? 0} years</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Online Professional</span>
              <span className="text-xl font-bold text-blue-600">{teachingDetails?.onlineExpYears ?? 0} years</span>
            </div>
          </div>
        </div>

        {/* Enhanced Availability Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-800">Availability</h4>
          </div>
          <div className="space-y-3">
            {teachingDetails?.onlineAvailability ? (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700 font-medium">Online Sessions</span>
              </div>
            ) : null}
            {teachingDetails?.homeAvailability ? (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700 font-medium">In-Home Professional Services</span>
              </div>
            ) : null}
            {teachingDetails?.homeworkHelp ? (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700 font-medium">Homework Help</span>
              </div>
            ) : null}
            {!teachingDetails?.onlineAvailability && 
             !teachingDetails?.homeAvailability && 
             !teachingDetails?.homeworkHelp && (
              <p className="text-gray-500 text-sm italic">No availability specified</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
</Section>
        </div>
      </main>
      
      {/* Footer at the bottom */}
      <Footer />

      {/* Enhanced Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 max-w-sm w-full ${
          notification.type === 'success' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
        } rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm p-6 transform transition-all duration-500 ease-out animate-in slide-in-from-right-full`}>
          <div className="flex items-start">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
              notification.type === 'success' ? 'bg-green-400' : 'bg-red-400'
            }`}>
              {notification.type === 'success' ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h4 className={`text-lg font-bold mb-1 ${
                notification.type === 'success' ? 'text-green-100' : 'text-red-100'
              }`}>
                {notification.type === 'success' ? 'Success!' : 'Error!'}
              </h4>
              <p className="text-white/90 leading-relaxed">
                {notification.message}
              </p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="ml-4 text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showProfileModal && (
        <ProfileEditModal
          profile={userProfile}
          onClose={() => setShowProfileModal(false)}
          onSave={saveProfile}
          saveLoading={saveLoading.profile}
        />
      )}

      {showEducationModal && (
        <EducationEditModal
          education={currentEducationIndex !== null ? educationList[currentEducationIndex] : {
            institutionName: "",
            degreeType: "Bachelor",
            degreeName: "",
            startDate: "",
            endDate: "",
            association: "Full-time",
            specialization: "",
            score: 0,
          }}
          onClose={() => setShowEducationModal(false)}
          onSave={saveEducation}
          saveLoading={saveLoading.education}
        />
      )}

      {showExperienceModal && (
       <ExperienceEditModal
       experience={currentExperienceIndex !== null ? experienceList[currentExperienceIndex] : {
         organizationName: "",
         organizationUrl: "",
         designation: "",
         startDate: "",
         endDate: "",
         association: "Full-time",
         jobDescription: "",
         skills: [],
         currentJob: false,
       }}
       onClose={() => setShowExperienceModal(false)}
       onSave={saveExperience}
       currentExperienceIndex={currentExperienceIndex}
       saveLoading={saveLoading.experience}
     />
      )}

      {showTeachingModal && (
        <TeachingDetailsEditModal
          details={teachingDetails}
          onClose={() => setShowTeachingModal(false)}
          onSave={saveTeachingDetails}
          saveLoading={saveLoading.teaching}
        />
      )}
    </div>
  );
}

// Reusable Section Component
function Section({ title, children }) {
  // Get icon based on title
  const getIcon = (title) => {
    switch (title.toLowerCase()) {
      case 'about me':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'education':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'experience':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'teaching details':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
    }
  };

  return (
    <div className="mb-12">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
          {getIcon(title)}
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2"></div>
        </div>
      </div>
      {children}
    </div>
  );
}

// Reusable Detail Row
function Detail({ label, children }) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-500">{label}</p>
      <p>{children}</p>
    </div>
  );
}