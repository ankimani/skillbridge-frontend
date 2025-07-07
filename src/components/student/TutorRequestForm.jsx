import React, { useState, useEffect } from 'react';
import Menus from './Menus';
import Select from 'react-select';
import postTutorRequest from '../service/TutorRequestService';
import countryOptions from './countryOptions.json';
import { FaInfoCircle, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { fetchUserProfile } from '../services/authProfile';
import jobCategories from '../../data/jobCategories.json';

function TutorRequestForm() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    location: '',
    phone: '',
    countryCode: '+1',
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
        setMessage({
          text: 'Failed to load user information. Please log in again.',
          type: 'error'
        });
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
      setMessage({
        text: 'User information not available. Please log in again.',
        type: 'error'
      });
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
            countryCode: '+1',
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
          // Handle 4xx responses
          setMessage({
            text: response.headers?.customerMessage || 
                 response.body?.message || 
                 'Request completed but with some issues',
            type: 'warning'
          });
        }
      } else {
        setMessage({
          text: 'No response received from server',
          type: 'error'
        });
      }
    } catch (error) {
      setProgress(0);
      setMessage({
        text: 'An unexpected error occurred while submitting your request.',
        type: 'error'
      });
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Menus />
        <div className="max-w-4xl mx-auto px-4 py-8 flex justify-center items-center h-64">
          <div className="text-center">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading user information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userId && message.type === 'error') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Menus />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
            <div className="bg-red-100 text-red-800 p-4 rounded-lg flex items-center justify-center">
              <FaExclamationCircle className="mr-2 text-lg" />
              <span>{message.text}</span>
            </div>
            <div className="mt-4">
              <a 
                href="/login" 
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
              >
                Go to Login Page
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Menus />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Post a Tutoring Request</h1>
            <p className="text-blue-100">Fill out the form below to find the perfect tutor for your needs</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg flex items-center ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800' 
                  : message.type === 'warning'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {message.type === 'success' ? (
                  <FaCheckCircle className="mr-2 text-lg" />
                ) : (
                  <FaExclamationCircle className="mr-2 text-lg" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div className="md:col-span-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter your location (e.g., Nairobi)"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.location}
                  </p>
                )}
              </div>

              {/* Job Category */}
              <div className="md:col-span-2">
                <label htmlFor="jobCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Category <span className="text-red-500">*</span>
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
                  className={`border ${
                    errors.jobCategory ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg`}
                  placeholder="Select job category"
                  isSearchable
                />
                {errors.jobCategory && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.jobCategory}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="md:col-span-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <div className="w-1/3">
                    <Select
                      name="countryCode"
                      value={countryOptions.find(option => option.value === formData.countryCode)}
                      onChange={handleSelectChange}
                      options={countryOptions}
                      classNamePrefix="react-select"
                      className={`border ${
                        errors.countryCode ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg`}
                      placeholder="Code"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Phone number (e.g., 25411000002)"
                    />
                  </div>
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Requirements */}
              <div className="md:col-span-2">
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="requirements"
                  id="requirements"
                  rows="4"
                  value={formData.requirements}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.requirements ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Describe your requirements in detail"
                />
                {errors.requirements && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.requirements}
                  </p>
                )}
              </div>

              {/* Subjects */}
              <div className="md:col-span-2">
                <label htmlFor="subjects" className="block text-sm font-medium text-gray-700 mb-1">
                  Subjects Needed <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subjects"
                  id="subjects"
                  value={formData.subjects}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.subjects ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g. Mathematics, Physics, English"
                />
                {errors.subjects && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.subjects}
                  </p>
                )}
              </div>

              {/* Level */}
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                  Education Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="level"
                  id="level"
                  value={formData.level}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.level ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">Select level</option>
                  <option value="High School">High School</option>
                  <option value="University/College">University/College</option>
                  <option value="Middle School/Junior High">Middle School/Junior High</option>
                  <option value="Early Childhood">Early Childhood</option>
                  <option value="Vocational/Technical Schools">Vocational/Technical Schools</option>
                </select>
                {errors.level && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.level}
                  </p>
                )}
              </div>

              {/* Help Me With */}
              <div>
                <label htmlFor="iWant" className="block text-sm font-medium text-gray-700 mb-1">
                  Help Me With <span className="text-red-500">*</span>
                </label>
                <select
                  name="iWant"
                  id="iWant"
                  value={formData.iWant}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.iWant ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="Help with Homework">Help with Homework</option>
                  <option value="Professional Guidance">Professional Guidance</option>
                  <option value="Project">Project</option>
                  <option value="Interview Preparation">Interview Preparation</option>
                  <option value="Exam Preparation">Exam Preparation</option>
                </select>
                {errors.iWant && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.iWant}
                  </p>
                )}
              </div>

              {/* Meeting Options */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Options <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['Online', 'At my place', 'Travel to tutor'].map((option) => (
                    <div key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        name="meetingOption"
                        id={`meeting-${option.toLowerCase().replace(' ', '-')}`}
                        value={option}
                        checked={formData.meetingOption.includes(option)}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label 
                        htmlFor={`meeting-${option.toLowerCase().replace(' ', '-')}`} 
                        className="ml-2 text-sm text-gray-700"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.meetingOption && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.meetingOption}
                  </p>
                )}
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                  Budget ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="budget"
                    id="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className={`block w-full pl-7 pr-12 py-2 rounded-lg border ${
                      errors.budget ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.budget}
                  </p>
                )}
              </div>

              {/* Rate */}
              <div>
                <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">
                  Rate Frequency <span className="text-red-500">*</span>
                </label>
                <select
                  name="rate"
                  id="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.rate ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="Per Hour">Per Hour</option>
                  <option value="Per Week">Per Week</option>
                  <option value="Per Month">Per Month</option>
                  <option value="Fixed">Fixed</option>
                </select>
                {errors.rate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.rate}
                  </p>
                )}
              </div>

              {/* Number of Tutors */}
              <div>
                <label htmlFor="tutorCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Tutors <span className="text-red-500">*</span>
                </label>
                <select
                  name="tutorCount"
                  id="tutorCount"
                  value={formData.tutorCount}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.tutorCount ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="Only One">Only One</option>
                  <option value="Two">Two</option>
                  <option value="More than Two">More than Two</option>
                </select>
                {errors.tutorCount && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.tutorCount}
                  </p>
                )}
              </div>

              {/* Job Nature */}
              <div>
                <label htmlFor="partTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Nature <span className="text-red-500">*</span>
                </label>
                <select
                  name="partTime"
                  id="partTime"
                  value={formData.partTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.partTime ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="Part Time">Part Time</option>
                  <option value="Full Time">Full Time</option>
                </select>
                {errors.partTime && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.partTime}
                  </p>
                )}
              </div>

              {/* Languages */}
              <div>
                <label htmlFor="languages" className="block text-sm font-medium text-gray-700 mb-1">
                  Languages <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="languages"
                  id="languages"
                  value={formData.languages}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.languages ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g. English, Spanish"
                />
                {errors.languages && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.languages}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex flex-col items-center space-y-4">
              {isSubmitting && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                  isSubmitting ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting... ({progress}%)
                  </>
                ) : (
                  'Submit Tutoring Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TutorRequestForm;