import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  MessageSquare, 
  Phone, 
  Copy, 
  CheckCircle, 
  Star, 
  TrendingUp, 
  BookOpen, 
  User, 
  Globe, 
  Calendar,
  ArrowLeft,
  Heart,
  Eye,
  Zap,
  Award,
  Sparkles,
  Target,
  Briefcase,
  GraduationCap,
  Languages,
  Map,
  PhoneCall,
  MessageCircle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import Footer from '../../features/shared/Footer';
import ChatModal from '../chat/ChatModal';
import { getJobApplicantCount } from '../../components/services/jobApplicantCount';
import { deductCoins } from '../../components/services/digitalCoins';
import { fetchUserProfile } from '../../components/services/authProfile';
import { getJobPosterContacts } from '../../components/services/jobPosterContact';
import { getJobById } from '../../components/services/myRequirements';
import { useAuthStore } from '../../store/useAuthStore';

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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchJobAndCount = async () => {
      try {
        setLoading(true);
        
        const token = useAuthStore.getState().token || localStorage.getItem('authToken');
        const jobData = await getJobById(jobId, token);
        if (jobData) {
          setJob(jobData);
        }

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

  // Debug showChat state changes
  useEffect(() => {
    console.log('showChat state changed:', showChat);
  }, [showChat]);

  const getTitle = (job) => {
    const location = job.location || '';
    switch (job.meetingOptions) {
      case 'Travel to tutor':
      case 'At my place':
        return `Home ${job.subjects} Professional needed in ${location}`;
      case 'Online':
        return `Online ${job.subjects} Professional needed in ${location}`;
      default:
        return `${job.subjects} Professional needed in ${location}`;
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
        return 'Unknown date';
      }
      
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };

  const handleConnectClick = async () => {
    if (!user) {
      setError('Please login to connect with the job poster.');
      return;
    }

    try {
      setIsProcessing(true);
      const token = useAuthStore.getState().token || localStorage.getItem('authToken');
      
      // Validate token exists
      if (!token) {
        setError('Authentication token not found. Please login again.');
        return;
      }
      
      console.log('User ID:', user.id);
      console.log('Token available:', !!token);
      console.log('Job coins:', job.coins);
      console.log('Full user object:', user);
      
      const userId = user.id || user.userId;
      console.log('Using user ID:', userId);
      
      const jobTitle = getTitle(job);
      const reason = `For applying to job# ${jobId}-${jobTitle}`;
      
      console.log('Sending payload:', { 
        coins: job.coins,
        reason: reason,
        jobId: jobId
      });
      
      let response;
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount < maxRetries) {
        try {
          console.log(`Attempt ${retryCount + 1} of ${maxRetries}`);
          if (retryCount > 0) {
            setError(`Retrying connection... (${retryCount}/${maxRetries - 1})`);
          }
          
          response = await deductCoins(userId, { 
            coins: job.coins,
            reason: reason,
            jobId: jobId
          }, token);
          
          console.log('Response received:', response);
          console.log('Response headers:', response.headers);
          console.log('Response code:', response.headers?.responseCode);
          break; // Success, exit the retry loop
        } catch (error) {
          retryCount++;
          console.error(`Attempt ${retryCount} failed:`, error);
          
          if (retryCount >= maxRetries) {
            throw error; // Re-throw if we've exhausted retries
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      console.log('Deduct coins response:', response);
      
      // Check for success (200) or already connected (409)
      if (response.headers?.responseCode === 200 || response.headers?.responseCode === 409) {
        console.log('Success! Opening chat modal...');
        setShowChat(true);
      } else {
        console.error('Deduct coins failed:', response);
        setError(response.headers?.customerMessage || 'Failed to connect. Please try again.');
      }
    } catch (error) {
      console.error('Error connecting:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.headers?.customerMessage || 'An error occurred while connecting. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGetContactNumber = async () => {
    if (!user) {
      setError('Please login to get the contact number.');
      return;
    }

    try {
      setPhoneLoading(true);
      const token = useAuthStore.getState().token || localStorage.getItem('authToken');
      
      const response = await getJobPosterContacts(jobId, token);
      
      if (response.success) {
        setPhoneNumber(response.phoneNumber);
        setShowPhoneModal(true);
      } else {
        setError(response.error || 'Failed to get contact number. Please try again.');
      }
    } catch (error) {
      console.error('Error getting contact number:', error);
      setError('An error occurred while getting the contact number. Please try again.');
    } finally {
      setPhoneLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (phoneNumber) {
      navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading job details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center py-12">
          <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Job Not Found</h2>
            <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or may have been removed.</p>
            <Link 
              to="/jobs" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse Other Jobs
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      {/* Error Modal */}
      {error && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <CheckCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Error</h3>
            </div>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => setError(null)}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Phone Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Phone className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Contact Number</h3>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                <span className="text-lg font-semibold text-gray-800">{phoneNumber}</span>
                <button
                  onClick={copyToClipboard}
                  className={`p-2 rounded-full transition-colors ${
                    copied ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title="Copy to clipboard"
                >
                  {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              {copied && (
                <p className="text-green-600 text-sm mt-2 text-center">Copied to clipboard!</p>
              )}
            </div>
            <button
              onClick={() => setShowPhoneModal(false)}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-center mb-6">
              <Link 
                to="/jobs" 
                className="flex items-center text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Link>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2">
                <div className="flex items-center mb-4">
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-white border border-white/30">
                    {job.meetingOptions || 'Flexible'}
                  </span>
                  <div className="ml-4 flex items-center text-white/80">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">Posted {getFormattedDate(job.createdAt)}</span>
                  </div>
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                  {getTitle(job)}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{job.location || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>${job.budget} {job.frequency}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{applicantCount} applicants</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Application Cost</h3>
                  <p className="text-2xl font-bold text-white mb-4">{job.coins} coins</p>
                  {job.jobStatus === 'Open' && (
                    <button 
                      onClick={handleConnectClick}
                      disabled={isProcessing}
                      className={`w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 ${
                        isProcessing ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 mr-2" />
                          Connect Now
                        </div>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Skills Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Skills Required</h2>
                    <p className="text-gray-600">Expertise needed for this position</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {job.subjects.map((subject, index) => (
                    <span 
                      key={index} 
                      className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold border border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-all transform hover:scale-105"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {/* Requirements Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Job Requirements</h2>
                    <p className="text-gray-600">Detailed requirements and expectations</p>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.jobRequirements}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Job Details */}
            <div className="space-y-6">
              {/* Job Details Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                  Job Details
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Budget</p>
                      <p className="font-semibold text-gray-900">${job.budget} <span className="text-gray-500 text-sm">({job.frequency})</span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <GraduationCap className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Level</p>
                      <p className="font-semibold text-gray-900">{job.level}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Job Type</p>
                      <p className="font-semibold text-gray-900">{job.jobType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <Languages className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Language</p>
                      <p className="font-semibold text-gray-900">{job.language}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <Map className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold text-gray-900">{job.location || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Actions Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
                  Contact Options
                </h3>
                
                <div className="space-y-4">
                  <button 
                    onClick={handleGetContactNumber}
                    disabled={phoneLoading}
                    className="w-full flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all transform hover:scale-105 border border-green-200"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      {phoneLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                      ) : (
                        <Phone className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">
                        {phoneLoading ? 'Loading...' : 'Get Contact Number'}
                      </p>
                      <p className="text-sm text-gray-600">Direct phone contact</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                  </button>
                  
                  <button 
                    onClick={handleConnectClick}
                    disabled={isProcessing || job.jobStatus !== 'Open'}
                    className={`w-full flex items-center p-4 rounded-xl transition-all transform hover:scale-105 ${
                      job.jobStatus === 'Open' 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200' 
                        : 'bg-gray-100 border border-gray-200 cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      job.jobStatus === 'Open' ? 'bg-blue-100' : 'bg-gray-200'
                    }`}>
                      {isProcessing ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      ) : (
                        <MessageSquare className={`w-5 h-5 ${job.jobStatus === 'Open' ? 'text-blue-600' : 'text-gray-400'}`} />
                      )}
                    </div>
                    <div className="text-left">
                      <p className={`font-semibold ${job.jobStatus === 'Open' ? 'text-gray-900' : 'text-gray-500'}`}>
                        {isProcessing ? 'Processing...' : 'Start Chat'}
                      </p>
                      <p className={`text-sm ${job.jobStatus === 'Open' ? 'text-gray-600' : 'text-gray-400'}`}>
                        {job.coins} coins required
                      </p>
                    </div>
                    <ChevronRight className={`w-5 h-5 ml-auto ${job.jobStatus === 'Open' ? 'text-gray-400' : 'text-gray-300'}`} />
                  </button>
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-purple-600" />
                  Job Status
                </h3>
                
                <div className="space-y-4">
                  <div className={`flex items-center p-4 rounded-xl ${
                    job.jobStatus === 'Open' 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                      : 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200'
                  }`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      job.jobStatus === 'Open' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <CheckCircle className={`w-5 h-5 ${job.jobStatus === 'Open' ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {job.jobStatus === 'Open' ? 'Open for Applications' : 'Applications Closed'}
                      </p>
                      <p className={`text-sm ${job.jobStatus === 'Open' ? 'text-green-600' : 'text-red-600'}`}>
                        {applicantCount} {applicantCount === 1 ? 'applicant' : 'applicants'}
                      </p>
                    </div>
                  </div>
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
          initialMessage={`Hi, I'm interested in your ${job.subjects} professional position`}
          senderType="tutor"
        />
      )}
      
      {console.log('Rendering modal section:', { showChat, job: !!job, user: !!user })}

      <Footer />
    </div>
  );
};

export default JobInformation;