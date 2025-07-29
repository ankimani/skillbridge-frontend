import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import postTutorRequest from '../../services.js';
import countryOptions from './countryOptions.json';
import { FaInfoCircle, FaCheckCircle, FaExclamationCircle, FaMapMarkerAlt, 
         FaPhone, FaBook, FaGraduationCap, FaClock, FaMoneyBillWave, 
         FaUsers, FaLanguage, FaStar, FaPlus, FaHandshake, FaEye, FaGlobe,
         FaCalendarAlt, FaUserTie, FaBriefcase, FaFileAlt, FaCheck } from 'react-icons/fa';
import { fetchUserProfile } from '../../components/services/authProfile';
import jobCategories from '../../data/jobCategories.json';
import SkeletonTutorRequestForm from '../shared/SkeletonTutorRequestForm';
import ErrorBanner from '../shared/ErrorBanner';
import { useNotificationStore } from '../../store/useNotificationStore';

function TutorRequestForm() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    location: '',
    phone: '',
    countryCode: '+254',
    requirements: '',
    subjects: '',
    level: '',
    meetingOption: [],
    budget: '',
    rate: 'Per Hour',
    genderPreference: 'None',
    tutorCount: 'Only One',
    partTime: 'Part Time',
    languages: '',
    jobCategory: 'Education & Training',
    iWant: 'Help with Homework'
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No access token found');
        }
        
        const userData = await fetchUserProfile(token);
        if (userData && userData.userId) {
          setUserId(userData.userId);
        } else {
          throw new Error('User ID not found in profile');
        }
      } catch (error) {
        console.error('Failed to fetch user ID:', error);
        addNotification({ type: 'error', message: 'Failed to load user information. Please log in again.' });
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    let interval;
    if (isSubmitting) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return 90;
          return prev + 5;
        });
      }, 300);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prevState => ({
        ...prevState,
        meetingOption: checked
          ? [...prevState.meetingOption, value]
          : prevState.meetingOption.filter(option => option !== value)
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: selectedOption ? selectedOption.value : ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'location', 'phone', 'requirements', 'subjects', 'level', 
      'budget', 'languages', 'jobCategory', 'iWant'
    ];

    requiredFields.forEach(field => {
      const value = formData[field];
      if (typeof value === 'string' && value.trim() === '') {
        newErrors[field] = 'This field is required';
      }
      else if (!value) {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.meetingOption.length === 0) {
      newErrors.meetingOption = 'Please select at least one meeting option';
    }

    if (formData.budget && isNaN(parseFloat(formData.budget))) {
      newErrors.budget = 'Budget must be a number';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      addNotification({ type: 'error', message: 'User information not available. Please log in again.' });
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setProgress(10);
    
    try {
      const response = await postTutorRequest(formData, userId);
      setProgress(100);

      if (response) {
        if (response.ok) {
          setMessage({
            text: response.headers?.customerMessage || 'Tutoring request posted successfully!',
            type: 'success'
          });
          // Reset form
          setFormData({
            location: '',
            phone: '',
            countryCode: '+254',
            requirements: '',
            subjects: '',
            level: '',
            meetingOption: [],
            budget: '',
            rate: 'Per Hour',
            genderPreference: 'None',
            tutorCount: 'Only One',
            partTime: 'Part Time',
            languages: '',
            jobCategory: 'Education & Training',
            iWant: 'Help with Homework'
          });
          setErrors({});
        } else {
          addNotification({ type: 'error', message: response.headers?.customerMessage || response.body?.message || 'Request completed but with some issues' });
        }
      } else {
        addNotification({ type: 'error', message: 'No response received from server' });
      }

    } catch (error) {
      setProgress(0);
      addNotification({ type: 'error', message: 'An unexpected error occurred while submitting your request.' });
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <SkeletonTutorRequestForm />;
  }

  if (!userId && message.type === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="w-full max-w-md">
          <ErrorBanner message={message.text} onRetry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Professional Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg">
                <FaPlus className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Post Tutoring Request
                </h1>
                <p className="text-gray-600 mt-2 text-lg">Create a professional request to find the perfect tutor</p>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 rounded-2xl">
                <FaStar className="text-yellow-500 text-xl" />
                <div>
                  <span className="text-sm font-medium text-gray-600">Step {currentStep} of 3</span>
                  <div className="text-xs text-gray-500">Form Progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Enhanced Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Form Progress */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaStar className="mr-3 text-yellow-500" />
                Form Progress
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <FaCheckCircle className="text-white text-lg" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">Basic Info</span>
                      <div className="text-xs text-green-600 font-medium">Complete</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <FaCheck className="text-white text-sm" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <FaBook className="text-white text-lg" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">Requirements</span>
                      <div className="text-xs text-blue-600 font-medium">In Progress</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <FaHandshake className="text-white text-lg" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">Review & Submit</span>
                      <div className="text-xs text-gray-600 font-medium">Pending</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Tips */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaInfoCircle className="mr-3 text-blue-500" />
                Professional Tips
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0 text-lg" />
                  <div>
                    <span className="text-sm font-semibold text-gray-800">Be Specific</span>
                    <div className="text-xs text-gray-600 mt-1">Detailed requirements help tutors understand your needs</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0 text-lg" />
                  <div>
                    <span className="text-sm font-semibold text-gray-800">Set Budget Range</span>
                    <div className="text-xs text-gray-600 mt-1">Realistic budget attracts quality tutors</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0 text-lg" />
                  <div>
                    <span className="text-sm font-semibold text-gray-800">Meeting Options</span>
                    <div className="text-xs text-gray-600 mt-1">Flexible options increase response rate</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0 text-lg" />
                  <div>
                    <span className="text-sm font-semibold text-gray-800">Subject Details</span>
                    <div className="text-xs text-gray-600 mt-1">Specific subjects help find the right tutor</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaClock className="mr-3 text-orange-500" />
                Response Time
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  24-48 hours
                </div>
                <p className="text-sm text-gray-600">Average response time from qualified tutors</p>
                <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="text-xs text-green-600 font-semibold">✓ Verified Tutors</div>
                  <div className="text-xs text-gray-600 mt-1">All tutors are pre-screened</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Main Form Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                    <FaFileAlt className="text-white text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Tutoring Request Details</h2>
                    <p className="text-blue-100 mt-1 text-lg">Provide comprehensive information to help tutors understand your needs</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                {message.text && (
                  <div className={`mb-8 p-6 rounded-2xl flex items-center ${
                    message.type === 'success' 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200' 
                      : message.type === 'warning'
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-800 border border-yellow-200'
                      : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border border-red-200'
                  }`}>
                    {message.type === 'success' ? (
                      <FaCheckCircle className="mr-4 text-2xl text-green-600" />
                    ) : (
                      <FaExclamationCircle className="mr-4 text-2xl text-red-600" />
                    )}
                    <span className="font-semibold">{message.text}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Location */}
                  <div className="md:col-span-2">
                    <label htmlFor="location" className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaMapMarkerAlt className="mr-3 text-blue-500 text-xl" />
                      Location <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-all duration-200 ${
                        errors.location 
                          ? 'border-red-500 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-blue-500 focus:bg-blue-50'
                      } focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20`}
                      placeholder="Enter your location (e.g., Nairobi, Kenya)"
                    />
                    {errors.location && (
                      <p className="mt-3 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="mr-2" /> {errors.location}
                      </p>
                    )}
                  </div>

                  {/* Job Category */}
                  <div className="md:col-span-2">
                    <label htmlFor="jobCategory" className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaBriefcase className="mr-3 text-blue-500 text-xl" />
                      Job Category <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Select
                      name="jobCategory"
                      id="jobCategory"
                      value={
                        formData.jobCategory
                          ? { value: formData.jobCategory, label: formData.jobCategory }
                          : null
                      }
                      onChange={(selectedOption) => handleSelectChange(selectedOption, { name: 'jobCategory' })}
                      options={jobCategories.map(category => ({
                        value: category,
                        label: category
                      }))}
                      classNamePrefix="react-select"
                      className={`text-lg ${
                        errors.jobCategory ? 'border-red-500' : 'border-gray-200'
                      } rounded-2xl`}
                      placeholder="Select job category"
                      isSearchable
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          border: state.isFocused ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                          borderRadius: '16px',
                          padding: '12px 16px',
                          fontSize: '18px',
                          backgroundColor: state.isFocused ? '#eff6ff' : 'white',
                          boxShadow: state.isFocused ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none',
                          transition: 'all 0.2s'
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
                          color: state.isSelected ? 'white' : '#374151',
                          padding: '12px 16px',
                          fontSize: '16px'
                        })
                      }}
                    />
                    {errors.jobCategory && (
                      <p className="mt-3 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="mr-2" /> {errors.jobCategory}
                      </p>
                    )}
                  </div>

                  {/* Enhanced Phone Number */}
                  <div className="md:col-span-2">
                    <label htmlFor="phone" className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaPhone className="mr-3 text-blue-500 text-xl" />
                      Phone Number <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex gap-4">
                      <div className="w-1/3">
                        <Select
                          name="countryCode"
                          value={countryOptions.find(option => option.value === formData.countryCode)}
                          onChange={handleSelectChange}
                          options={countryOptions}
                          classNamePrefix="react-select"
                          className="rounded-2xl"
                          placeholder="Code"
                          styles={{
                            control: (provided, state) => ({
                              ...provided,
                              border: state.isFocused ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                              borderRadius: '16px',
                              padding: '12px 16px',
                              fontSize: '16px',
                              backgroundColor: state.isFocused ? '#eff6ff' : 'white',
                              boxShadow: state.isFocused ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none',
                              transition: 'all 0.2s'
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
                              color: state.isSelected ? 'white' : '#374151',
                              padding: '12px 16px',
                              fontSize: '14px'
                            })
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-all duration-200 ${
                            errors.phone 
                              ? 'border-red-500 focus:border-red-500 bg-red-50' 
                              : 'border-gray-200 focus:border-blue-500 focus:bg-blue-50'
                          } focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20`}
                          placeholder="Phone number (e.g., 25411000002)"
                        />
                      </div>
                    </div>
                    {errors.phone && (
                      <p className="mt-3 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="mr-2" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Requirements */}
                  <div className="md:col-span-2">
                    <label htmlFor="requirements" className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaFileAlt className="mr-3 text-blue-500 text-xl" />
                      Detailed Requirements <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      name="requirements"
                      id="requirements"
                      rows="6"
                      value={formData.requirements}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-all duration-200 resize-none ${
                        errors.requirements 
                          ? 'border-red-500 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-blue-500 focus:bg-blue-50'
                      } focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20`}
                      placeholder="Describe your requirements in detail..."
                    />
                    {errors.requirements && (
                      <p className="mt-3 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="mr-2" /> {errors.requirements}
                      </p>
                    )}
                  </div>

                  {/* Subjects */}
                  <div className="md:col-span-2">
                    <label htmlFor="subjects" className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaGraduationCap className="mr-3 text-blue-500 text-xl" />
                      Subjects Needed <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="subjects"
                      id="subjects"
                      value={formData.subjects}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-all duration-200 ${
                        errors.subjects 
                          ? 'border-red-500 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-blue-500 focus:bg-blue-50'
                      } focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20`}
                      placeholder="e.g. Mathematics, Physics, English"
                    />
                    {errors.subjects && (
                      <p className="mt-3 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="mr-2" /> {errors.subjects}
                      </p>
                    )}
                  </div>

                  {/* Level */}
                  <div>
                    <label htmlFor="level" className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaGraduationCap className="mr-3 text-blue-500 text-xl" />
                      Education Level <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      name="level"
                      id="level"
                      value={formData.level}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-all duration-200 ${
                        errors.level 
                          ? 'border-red-500 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-blue-500 focus:bg-blue-50'
                      } focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20`}
                    >
                      <option value="">Select level</option>
                      <option value="High School">High School</option>
                      <option value="University/College">University/College</option>
                      <option value="Middle School/Junior High">Middle School/Junior High</option>
                      <option value="Early Childhood">Early Childhood</option>
                      <option value="Vocational/Technical Schools">Vocational/Technical Schools</option>
                    </select>
                    {errors.level && (
                      <p className="mt-3 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="mr-2" /> {errors.level}
                      </p>
                    )}
                  </div>

                  {/* Help Me With */}
                  <div>
                    <label htmlFor="iWant" className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaHandshake className="mr-3 text-blue-500 text-xl" />
                      Help Me With <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      name="iWant"
                      id="iWant"
                      value={formData.iWant}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-all duration-200 ${
                        errors.iWant 
                          ? 'border-red-500 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-blue-500 focus:bg-blue-50'
                      } focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20`}
                    >
                      <option value="Help with Homework">Help with Homework</option>
                      <option value="Professional Guidance">Professional Guidance</option>
                      <option value="Project">Project</option>
                      <option value="Interview Preparation">Interview Preparation</option>
                      <option value="Exam Preparation">Exam Preparation</option>
                    </select>
                    {errors.iWant && (
                      <p className="mt-3 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="mr-2" /> {errors.iWant}
                      </p>
                    )}
                  </div>

                  {/* Meeting Options */}
                  <div className="md:col-span-2">
                    <label className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaEye className="mr-3 text-blue-500 text-xl" />
                      Meeting Options <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['Online', 'At my place', 'Travel to tutor'].map((option) => (
                        <div key={option} className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-2 border-transparent hover:border-blue-200">
                          <input
                            type="checkbox"
                            name="meetingOption"
                            id={`meeting-${option.toLowerCase().replace(' ', '-')}`}
                            value={option}
                            checked={formData.meetingOption.includes(option)}
                            onChange={handleChange}
                            className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg"
                          />
                          <label 
                            htmlFor={`meeting-${option.toLowerCase().replace(' ', '-')}`} 
                            className="ml-4 text-lg font-medium text-gray-700 cursor-pointer"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.meetingOption && (
                      <p className="mt-3 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="mr-2" /> {errors.meetingOption}
                      </p>
                    )}
                  </div>

                  {/* Budget */}
                  <div>
                    <label htmlFor="budget" className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaMoneyBillWave className="mr-3 text-blue-500 text-xl" />
                      Budget ($) <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative rounded-2xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-lg font-semibold">$</span>
                      </div>
                      <input
                        type="number"
                        name="budget"
                        id="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className={`block w-full pl-12 pr-6 py-4 text-lg rounded-2xl border-2 transition-all duration-200 ${
                          errors.budget 
                            ? 'border-red-500 focus:border-red-500 bg-red-50' 
                            : 'border-gray-200 focus:border-blue-500 focus:bg-blue-50'
                        } focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20`}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    {errors.budget && (
                      <p className="mt-3 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="mr-2" /> {errors.budget}
                      </p>
                    )}
                  </div>

                  {/* Rate */}
                  <div>
                    <label htmlFor="rate" className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaClock className="mr-3 text-blue-500 text-xl" />
                      Rate Frequency <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      name="rate"
                      id="rate"
                      value={formData.rate}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-all duration-200 ${
                        errors.rate 
                          ? 'border-red-500 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-blue-500 focus:bg-blue-50'
                      } focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20`}
                    >
                      <option value="Per Hour">Per Hour</option>
                      <option value="Per Week">Per Week</option>
                      <option value="Per Month">Per Month</option>
                      <option value="Fixed">Fixed</option>
                    </select>
                    {errors.rate && (
                      <p className="mt-3 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="mr-2" /> {errors.rate}
                      </p>
                    )}
                  </div>

                  {/* Number of Tutors */}
                  <div>
                    <label htmlFor="tutorCount" className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaUsers className="mr-3 text-blue-500 text-xl" />
                      Number of Tutors <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      name="tutorCount"
                      id="tutorCount"
                      value={formData.tutorCount}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-all duration-200 ${
                        errors.tutorCount 
                          ? 'border-red-500 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-blue-500 focus:bg-blue-50'
                      } focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20`}
                    >
                      <option value="Only One">Only One</option>
                      <option value="Two">Two</option>
                      <option value="More than Two">More than Two</option>
                    </select>
                    {errors.tutorCount && (
                      <p className="mt-3 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="mr-2" /> {errors.tutorCount}
                      </p>
                    )}
                  </div>

                  {/* Job Nature */}
                  <div>
                    <label htmlFor="partTime" className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaCalendarAlt className="mr-3 text-blue-500 text-xl" />
                      Job Nature <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      name="partTime"
                      id="partTime"
                      value={formData.partTime}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-all duration-200 ${
                        errors.partTime 
                          ? 'border-red-500 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-blue-500 focus:bg-blue-50'
                      } focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20`}
                    >
                      <option value="Part Time">Part Time</option>
                      <option value="Full Time">Full Time</option>
                    </select>
                    {errors.partTime && (
                      <p className="mt-3 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="mr-2" /> {errors.partTime}
                      </p>
                    )}
                  </div>

                  {/* Languages */}
                  <div>
                    <label htmlFor="languages" className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaLanguage className="mr-3 text-blue-500 text-xl" />
                      Languages <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="languages"
                      id="languages"
                      value={formData.languages}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-all duration-200 ${
                        errors.languages 
                          ? 'border-red-500 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-blue-500 focus:bg-blue-50'
                      } focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20`}
                      placeholder="e.g. English, Spanish"
                    />
                    {errors.languages && (
                      <p className="mt-3 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="mr-2" /> {errors.languages}
                      </p>
                    )}
                  </div>
                </div>

                {/* Enhanced Submit Button */}
                <div className="mt-12 flex flex-col items-center space-y-6">
                  {isSubmitting && (
                    <div className="w-full max-w-md">
                      <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-4 rounded-full transition-all duration-300 ease-out" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-center text-sm text-gray-600 mt-2">Submitting your request... {progress}%</p>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-label="Submit Tutor Request"
                    className={`w-full max-w-md flex justify-center items-center px-12 py-6 border border-transparent text-xl font-bold rounded-2xl shadow-2xl text-white transition-all duration-300 transform hover:scale-105 ${
                      isSubmitting 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700'
                    } focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting... ({progress}%)
                      </>
                    ) : (
                      <>
                        Submit Request
                        <FaCheckCircle className="ml-4 h-6 w-6" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorRequestForm;