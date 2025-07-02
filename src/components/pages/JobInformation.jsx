import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import getTutorRequestById from '../service/GetTutorRequestService';
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { FaMapMarkerAlt, FaUserGraduate, FaVenusMars, FaGlobe, FaInfoCircle, FaCopy } from 'react-icons/fa';
import { FiBook, FiUser, FiDollarSign, FiCalendar, FiMessageSquare, FiPhone } from 'react-icons/fi';
import CustomHeader from './CustomHeader';
import Footer from '../shared/Footer';
import ChatModal from '../chat/ChatModal';
import { getJobApplicantCount } from '../services/jobApplicantCount';
import { deductCoins } from '../services/digitalCoins';
import { fetchUserProfile } from '../services/authProfile';
import { getJobPosterContacts } from '../services/jobPosterContact';

const JobInformation = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [applicantCount, setApplicantCount] = useState(0);
  const [countLoading, setCountLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [phoneLoading, setPhoneLoading] = useState(false);

  useEffect(() => {
    const fetchJobAndCount = async () => {
      try {
        setLoading(true);
        
        const jobData = await getTutorRequestById(jobId);
        if (jobData) {
          setJob(jobData);
        }

        const token = localStorage.getItem('authToken');
        const count = await getJobApplicantCount(jobId, token);
        setApplicantCount(count);
      } catch (error) {
        console.error('Error fetching job:', error);
        setApplicantCount(0);
      } finally {
        setLoading(false);
        setCountLoading(false);
      }
    };
    
    fetchJobAndCount();
  }, [jobId]);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) return;
        
        const userProfile = await fetchUserProfile(authToken);
        setUser(userProfile);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    initializeUser();
  }, []);

  const getTitle = (job) => {
    const location = job.location || '';
    switch (job.meetingOptions) {
      case 'Travel to tutor':
      case 'At my place':
        return `Home ${job.subjects} Trainer needed in ${location}`;
      case 'Online':
        return `Online ${job.subjects} Trainer needed in ${location}`;
      default:
        return `${job.subjects} Trainer needed in ${location}`;
    }
  };

  const getFormattedDate = (dateInput) => {
    try {
      let date;
      
      if (Array.isArray(dateInput) && dateInput.length >= 6) {
        date = new Date(
          dateInput[0],
          dateInput[1] - 1,
          dateInput[2],
          dateInput[3],
          dateInput[4],
          dateInput[5],
          dateInput[6] || 0
        );
      } else if (typeof dateInput === 'string') {
        date = parseISO(dateInput);
      } else if (dateInput instanceof Date) {
        date = dateInput;
      } else {
        date = new Date();
      }
  
      if (isNaN(date.getTime())) {
        return 'Unknown date';
      }
  
      const hoursDifference = (new Date() - date) / (1000 * 60 * 60);
      return hoursDifference < 24
        ? formatDistanceToNow(date, { addSuffix: true })
        : format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown date';
    }
  };

  const handleConnectClick = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token || !user?.userId) {
        setError('Please login to connect with the job poster');
        return;
      }

      const payload = {
        coins: job.coins,
        reason: `For applying to job# ${jobId}-${getTitle(job)}`,
        jobId: jobId
      };

      const response = await deductCoins(user.userId, payload, token);
      if (response.headers.responseCode === 200 || response.headers.responseCode === 409) {
        setShowChat(true);
      } else {
        setError(response.headers.customerMessage || 'Failed to deduct coins. Please try again.');
      }
    } catch (error) {
      console.error('Error deducting coins:', error);
      setError(error.response?.data?.headers?.customerMessage || 'An error occurred while processing your request.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGetContactNumber = async () => {
    try {
      if (!user?.userId) {
        setError('Please login to view contact number');
        return;
      }

      setPhoneLoading(true);
      setError(null);

      const response = await getJobPosterContacts(jobId, user.userId);
      
      if (response.statusCode === 200) {
        setPhoneNumber(response.data);
        setShowPhoneModal(true);
      } else {
        setError(response.message || 'Could not retrieve contact number');
      }
    } catch (error) {
      console.error('Error getting contact number:', error);
      setError(error.error || 'An error occurred while fetching contact number');
    } finally {
      setPhoneLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!phoneNumber) return;
    navigator.clipboard.writeText(phoneNumber);
    // Optional: Add toast notification here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-12">
          <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm text-center">
            <FaInfoCircle className="mx-auto text-4xl text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Job Not Found</h2>
            <p className="text-gray-600">The job you're looking for doesn't exist or may have been removed.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Error</h3>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">{error}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setError(null)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showPhoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <FiPhone className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Contact Number</h3>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <span className="text-lg font-medium">{phoneNumber}</span>
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Copy to clipboard"
                >
                  <FaCopy className="text-gray-600" />
                </button>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowPhoneModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6 md:p-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                      {job.meetingOptions || 'Flexible'}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{getTitle(job)}</h1>
                </div>
                <div className="flex items-center text-blue-100 bg-white/10 px-3 py-1 rounded-full">
                  <FiCalendar className="mr-2" />
                  <span className="text-sm">Posted {getFormattedDate(job.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FiBook className="mr-2 text-indigo-600" />
                  Skills Needed
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.subjects.map((subject, index) => (
                    <span 
                      key={index} 
                      className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start bg-gray-50 p-4 rounded-lg">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <FiDollarSign className="text-indigo-600 text-lg" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Rate</h4>
                      <p className="text-gray-800 font-medium">${job.budget} <span className="text-gray-500 text-sm">({job.frequency})</span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start bg-gray-50 p-4 rounded-lg">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <FaUserGraduate className="text-indigo-600 text-lg" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Level</h4>
                      <p className="text-gray-800 font-medium">{job.level}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start bg-gray-50 p-4 rounded-lg">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <FiUser className="text-indigo-600 text-lg" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Job Type</h4>
                      <p className="text-gray-800 font-medium">{job.jobType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start bg-gray-50 p-4 rounded-lg">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <FaVenusMars className="text-indigo-600 text-lg" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Gender Preference</h4>
                      <p className="text-gray-800 font-medium">{job.genderPreference || "No preference"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start bg-gray-50 p-4 rounded-lg">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <FaGlobe className="text-indigo-600 text-lg" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Language</h4>
                      <p className="text-gray-800 font-medium">{job.language}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start bg-gray-50 p-4 rounded-lg">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <FaMapMarkerAlt className="text-indigo-600 text-lg" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                      <p className="text-gray-800 font-medium">{job.location || "Not specified"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start bg-gray-50 p-4 rounded-lg">
                    <button 
                      className="flex items-center w-full bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors duration-200"
                      onClick={handleGetContactNumber}
                      disabled={phoneLoading}
                    >
                      <div className="bg-blue-100 p-3 rounded-lg mr-4">
                        {phoneLoading ? (
                          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <FiPhone className="text-blue-600 text-lg" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-gray-800 font-medium">
                          {phoneLoading ? 'Loading...' : 'Get Contact Number'}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FaInfoCircle className="mr-2 text-indigo-600" />
                  Requirements
                </h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="prose max-w-none text-gray-700">
                    <p className="whitespace-pre-line">{job.jobRequirements}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between gap-4 border-t border-gray-200 pt-6">
                  <div className="flex items-center bg-blue-50 text-blue-800 px-4 py-3 rounded-lg">
                    {countLoading ? (
                      <span className="animate-pulse">Loading applicant count...</span>
                    ) : (
                      <span className="font-medium">
                        {applicantCount} {applicantCount === 1 ? 'applicant' : 'applicants'}
                      </span>
                    )}
                  </div>
                  <div className={`flex items-center px-4 py-3 rounded-lg ${
                    job.jobStatus === 'Open' 
                      ? 'bg-green-50 text-green-800' 
                      : 'bg-gray-100 text-red-800'
                  }`}>
                    <span className="font-medium">
                      {job.jobStatus === 'Open' 
                        ? 'Requirement open for application' 
                        : 'No longer accepting applications'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white pt-6 border-t border-gray-200 -mx-6 md:-mx-8 px-6 md:px-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  {job.jobStatus === 'Open' && (
                    <button 
                      onClick={handleConnectClick}
                      disabled={isProcessing}
                      className={`flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors shadow-md hover:shadow-lg ${
                        isProcessing ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FiMessageSquare className="mr-2" />
                          <span>Connect with Job Poster ({job.coins} coins)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showChat && job && user && (
        <ChatModal
          isOpen={showChat}
          receiverId={job.userId}
          jobId={jobId}
          onClose={() => setShowChat(false)}
          initialMessage={`Hi, I'm interested in your ${job.subjects} tutoring position`}
          senderType="tutor"
        />
      )}

      <Footer />
    </div>
  );
};

export default JobInformation;