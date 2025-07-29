import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { profileByTeacherId } from '../../components/services/allTeachersProfile';
import { fetchMyRequirements } from '../../components/services/myRequirements';
import { FaChalkboardTeacher, FaCheck, FaVenusMars, FaMoneyBillWave, FaHome, FaLaptop, FaPhone, FaMapMarkerAlt, FaIdBadge, FaGraduationCap, FaBook, FaClock, FaUserTie, FaBriefcase, FaTimes, FaCopy, 
         FaStar, FaEye, FaHeart, FaShare, FaEnvelope, FaCalendar, FaAward, FaCertificate, FaGlobe, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { FiArrowLeft, FiMessageSquare, FiArrowRight, FiMail, FiMapPin, FiDollarSign } from 'react-icons/fi';
import { IoMdTime } from 'react-icons/io';
import { fetchUserProfile } from '../../components/services/authProfile';
import { deductCoinsClient } from '../../components/services/digitalCoins';
import ChatModal from '../chat/ChatModal';
import { useAuthStore } from '../../store/useAuthStore';

const ViewTeacherProfile = () => {
    const { teacherId } = useParams();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [userJobs, setUserJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(false);
    const [jobsError, setJobsError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [currentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showChat, setShowChat] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [chatError, setChatError] = useState(null);
    const [chatJobData, setChatJobData] = useState(null);
    const [activeTab, setActiveTab] = useState('about'); // 'about', 'education', 'experience', 'subjects'
  
    // Fetch teacher profile and user data
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('authToken');
            
            // Check if token is valid
            const isTokenValid = useAuthStore.getState().isTokenValid;
            if (!isTokenValid()) {
                useAuthStore.getState().forceLogout();
                navigate('/login');
                return;
            }
            
            try {
                setLoading(true);
                const [userProfile, teacherResponse] = await Promise.all([
                    fetchUserProfile(token),
                    profileByTeacherId(teacherId)
                ]);
                setUserData(userProfile);
                setTeacher(teacherResponse.body.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                if (err.response?.status === 401) {
                    useAuthStore.getState().forceLogout();
                    navigate('/login');
                    return;
                }
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [teacherId, navigate]);

    // Fetch user jobs when modal opens
    useEffect(() => {
        const fetchUserJobs = async () => {
            if (!isContactModalOpen || !userData?.userId) return;

            try {
                setLoadingJobs(true);
                setJobsError(null);
                const token = localStorage.getItem('authToken');
                const jobs = await fetchMyRequirements(
                    userData.userId,
                    currentPage,
                    itemsPerPage,
                    token
                );
                setUserJobs(jobs.jobs?.filter(job => job.jobStatus === 'Open') || []);
            } catch (err) {
                setJobsError(err.message || 'Failed to load your job postings');
            } finally {
                setLoadingJobs(false);
            }
        };

        fetchUserJobs();
    }, [isContactModalOpen, userData, currentPage, itemsPerPage]);

    const openContactModal = () => {
        setIsContactModalOpen(true);
    };

    const closeContactModal = () => {
        setIsContactModalOpen(false);
        setSelectedJob(null);
    };

    const handleContactProfessional = async () => {
        if (!selectedJob || !teacherId) return;
        
        try {
            setIsProcessing(true);
            setChatError(null);
            
            const token = localStorage.getItem('authToken');
            if (!token || !userData?.userId) {
                setChatError('Please login to connect with the teacher');
                return;
            }
            const firstFiveWords = selectedJob.jobRequirements.split(" ").slice(0, 5).join(" ");
            const payload = {
                coins: selectedJob.coins,
                reason: `For contacting Professional ${teacher.displayName} regarding job# ${selectedJob.jobId}-${firstFiveWords}`,
                jobId: selectedJob.jobId
            };

            console.log('ViewTeacherProfile: Deducting coins with payload:', payload);
            const response = await deductCoinsClient(teacherId, userData?.userId, payload, token);
            console.log('ViewTeacherProfile: Deduct coins response:', response);
            
            if (response.headers.responseCode === 200 || response.headers.responseCode === 409) {
                            console.log('ViewTeacherProfile: Coins deducted successfully, opening chat');
            console.log('ViewTeacherProfile: Teacher data:', teacher);
            console.log('ViewTeacherProfile: Chat job data:', {
                jobId: selectedJob.jobId,
                subjects: selectedJob.subjects,
                teacherId: teacherId,
                teacherUserId: teacher.userId // This should be the actual userId of the teacher
            });
            setChatJobData({
                jobId: selectedJob.jobId,
                subjects: selectedJob.subjects,
                teacherUserId: teacher.userId // Pass the teacher's actual userId
            });
            setShowChat(true);
            closeContactModal();
            } else {
                console.log('ViewTeacherProfile: Failed to deduct coins:', response.headers.customerMessage);
                setChatError(response.headers.customerMessage || 'Failed to deduct coins. Please try again.');
            }
        } catch (error) {
            console.error('Error deducting coins:', error);
            setChatError(error.response?.data?.headers?.customerMessage || 'An error occurred while processing your request.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Helper function to safely render subjects
    const renderSubjects = () => {
        if (!teacher.subjects || teacher.subjects.length === 0) {
            return <p className="text-gray-500 italic">No subjects information provided.</p>;
        }

        return (
            <div className="flex flex-wrap gap-3">
                {teacher.subjects.map((subject, index) => (
                    <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 rounded-xl text-sm font-semibold shadow-sm border border-blue-200 hover:shadow-md transition-all duration-200"
                    >
                        {subject.subjectName}
                    </span>
                ))}
            </div>
        );
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'Present';
        const options = { year: 'numeric', month: 'short' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatJobDescription = (description) => {
        if (!description) return null;
        
        const points = description.split('\n').filter(point => point.trim() !== '');
        return (
            <ul className="mt-3 space-y-2">
                {points.map((point, index) => (
                    <li key={index} className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{point.trim()}</span>
                    </li>
                ))}
            </ul>
        );
    };

    const getAvailabilityStatus = (isAvailable) => {
        return isAvailable ? (
            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                <FaCheckCircle className="mr-1" />
                Available
            </span>
        ) : (
            <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                <FaTimesCircle className="mr-1" />
                Not Available
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    <p className="text-gray-600 text-lg">Loading professional profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Profile</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg transform hover:scale-105 flex items-center mx-auto"
                    >
                        <FiArrowLeft className="mr-2" /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!teacher) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
                    <div className="text-gray-400 text-6xl mb-4">
                        <FaChalkboardTeacher className="inline-block" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Professional Not Found</h2>
                    <p className="text-gray-600 mb-6">The requested professional profile could not be found.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg transform hover:scale-105 flex items-center mx-auto"
                    >
                        <FiArrowLeft className="mr-2" /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            {/* Error Modal */}
            {chatError && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center mb-4">
                            <div className="bg-red-100 p-3 rounded-full mr-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Error</h3>
                        </div>
                        <div className="mt-2">
                            <p className="text-sm text-gray-600">{chatError}</p>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setChatError(null)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Modal */}
            {isContactModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div 
                            className="fixed inset-0 transition-opacity" 
                            aria-hidden="true"
                            onClick={closeContactModal}
                        >
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-6 pt-6 pb-6 sm:p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Contact Professional</h2>
                                    <button 
                                        onClick={closeContactModal}
                                        className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <FaTimes className="text-xl" />
                                    </button>
                                </div>

                                {loadingJobs ? (
                                    <div className="flex justify-center py-8">
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                            <p className="text-gray-600">Loading your job postings...</p>
                                        </div>
                                    </div>
                                ) : jobsError ? (
                                    <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-xl">{jobsError}</div>
                                ) : (
                                    <>
                                        <div className="mb-6">
                                            <label className="block text-gray-700 text-sm font-semibold mb-3">
                                                Select Job/Assignment
                                            </label>
                                            <select
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                value={selectedJob?.jobId || ''}
                                                onChange={(e) => {
                                                    const jobId = e.target.value;
                                                    const job = userJobs.find(j => j.jobId.toString() === jobId);
                                                    setSelectedJob(job || null);
                                                }}
                                            >
                                                <option value="">Select a job...</option>
                                                {userJobs.map((job) => (
                                                    <option key={job.jobId} value={job.jobId}>
                                                        {job.jobRequirements.length > 50 
                                                            ? `${job.jobRequirements.substring(0, 50)}...` 
                                                            : job.jobRequirements}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {selectedJob && (
                                            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                                <h3 className="font-semibold text-gray-800 mb-3">Job Details</h3>
                                                <div className="space-y-2 text-sm">
                                                    <p className="text-gray-600">
                                                        <span className="font-medium">Subject:</span> {selectedJob.subjects}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        <span className="font-medium">Level:</span> {selectedJob.level}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        <span className="font-medium">Budget:</span> ${selectedJob.budget} ({selectedJob.frequency})
                                                    </p>
                                                    <p className="text-gray-600">
                                                        <span className="font-medium">Coins required:</span> {selectedJob.coins}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center mt-8">
                                            <button
                                                onClick={closeContactModal}
                                                className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                disabled={!selectedJob || isProcessing}
                                                className={`px-6 py-3 rounded-xl text-white transition-all ${
                                                    selectedJob 
                                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transform hover:scale-105' 
                                                        : 'bg-gray-400 cursor-not-allowed'
                                                } ${isProcessing ? 'opacity-75' : ''}`}
                                                onClick={handleContactProfessional}
                                            >
                                                {isProcessing ? (
                                                    <div className="flex items-center">
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center">
                                                        <FiMessageSquare className="mr-2" />
                                                        <span>Contact for {selectedJob?.coins || 0} coins</span>
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
             
            {/* Chat Modal */}
            {showChat && teacherId && userData && chatJobData && teacher && (
                <>
                    {console.log('ViewTeacherProfile: Rendering ChatModal with:', {
                        teacherId: teacherId,
                        teacherUserId: teacher.userId,
                        jobId: chatJobData.jobId,
                        receiverId: teacher.userId
                    })}
                    <ChatModal
                        isOpen={showChat}
                        receiverId={teacher.userId} // Use teacher's actual userId instead of teacherId
                        jobId={chatJobData.jobId}
                        onClose={() => {
                            setShowChat(false);
                            setChatJobData(null);
                        }}
                        initialMessage={`Hi, I'm interested in your tutoring services for my ${chatJobData.subjects} requirement`}
                        senderType="student"
                    />
                </>
            )}

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Enhanced Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
                        >
                            <FiArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" /> 
                            Back to Professionals
                        </button>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                <FaHeart className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                                <FaShare className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="text-center">
                                <div className="relative inline-block mb-4">
                                    {imageError || !teacher.imagePath ? (
                                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 border-4 border-white shadow-lg flex items-center justify-center">
                                            <span className="text-2xl font-bold text-white">
                                                {teacher.displayName.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    ) : (
                                        <img
                                            src={teacher.imagePath}
                                            alt={`Profile image of ${teacher.displayName}`}
                                            className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                                            onError={() => setImageError(true)}
                                            loading="lazy"
                                        />
                                    )}
                                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-2 border-2 border-white shadow-lg">
                                        <FaIdBadge className="text-white text-sm" />
                                    </div>
                                </div>
                                
                                <h2 className="text-xl font-bold text-gray-800 mb-2">{teacher.displayName}</h2>
                                <p className="text-gray-600 text-sm mb-4">Professional Teacher</p>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center justify-center text-sm text-gray-600">
                                        <FaVenusMars className="mr-2 text-gray-400" />
                                        {teacher.gender || 'Not specified'}
                                    </div>
                                    <div className="flex items-center justify-center text-sm text-gray-600">
                                        <FaMapMarkerAlt className="mr-2 text-gray-400" />
                                        {teacher.location || 'Location not provided'}
                                    </div>
                                    <div className="flex items-center justify-center text-sm text-gray-600">
                                        <FaMoneyBillWave className="mr-2 text-gray-400" />
                                        ${teacher.minFee || '0'}-${teacher.maxFee || '0'}/hr
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FaStar className="mr-2 text-yellow-500" />
                                Quick Stats
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                    <div className="flex items-center">
                                        <FaClock className="mr-2 text-blue-500" />
                                        <span className="text-sm font-medium text-gray-700">Experience</span>
                                    </div>
                                    <span className="text-sm font-bold text-blue-600">{teacher.totalExpYears || '0'} years</span>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                                    <div className="flex items-center">
                                        <FaLaptop className="mr-2 text-green-500" />
                                        <span className="text-sm font-medium text-gray-700">Online</span>
                                    </div>
                                    {getAvailabilityStatus(teacher.onlineAvailability)}
                                </div>
                                
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                                    <div className="flex items-center">
                                        <FaHome className="mr-2 text-purple-500" />
                                        <span className="text-sm font-medium text-gray-700">Home</span>
                                    </div>
                                    {getAvailabilityStatus(teacher.homeAvailability)}
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FaPhone className="mr-2 text-blue-500" />
                                Contact Info
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                                    <FaPhone className="mr-2 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {teacher.phoneNumber || 'Not provided'}
                                    </span>
                                </div>
                                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                                    <FaEnvelope className="mr-2 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {teacher.email || 'Not provided'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <button 
                                onClick={openContactModal}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg transform hover:scale-105 flex items-center justify-center"
                            >
                                <FiMessageSquare className="mr-2" />
                                Contact Professional
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            {/* Enhanced Profile Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                    <div className="relative">
                                        {imageError || !teacher.imagePath ? (
                                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-blue-400 border-4 border-white shadow-lg flex items-center justify-center">
                                                <span className="text-2xl md:text-3xl font-bold text-white">
                                                    {teacher.displayName.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        ) : (
                                            <img
                                                src={teacher.imagePath}
                                                alt={`Profile image of ${teacher.displayName}`}
                                                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                                                onError={() => setImageError(true)}
                                                loading="lazy"
                                            />
                                        )}
                                        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                                            <FaIdBadge className="text-blue-600 text-lg" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{teacher.displayName}</h1>
                                        <p className="text-blue-100 text-lg mb-4">Professional Teacher & Tutor</p>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                                                <FaUserTie className="mr-2" /> {teacher.gender || 'Not specified'}
                                            </span>
                                            <span className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                                                <FaMapMarkerAlt className="mr-2" /> {teacher.location || 'Location not provided'}
                                            </span>
                                            <span className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                                                <FaMoneyBillWave className="mr-2" /> ${teacher.minFee || '0'}-${teacher.maxFee || '0'}/hr
                                            </span>
                                            <span className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                                                <IoMdTime className="mr-2" /> {teacher.totalExpYears || '0'} years experience
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tab Navigation */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex space-x-8">
                                    {[
                                        { id: 'about', label: 'About', icon: FaUserTie },
                                        { id: 'education', label: 'Education', icon: FaGraduationCap },
                                        { id: 'experience', label: 'Experience', icon: FaBriefcase },
                                        { id: 'subjects', label: 'Skills', icon: FaBook }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all ${
                                                activeTab === tab.id
                                                    ? 'bg-blue-600 text-white shadow-lg'
                                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                            }`}
                                        >
                                            <tab.icon className="mr-2" />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="p-8">
                                {activeTab === 'about' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                            <FaUserTie className="mr-3 text-blue-600" /> About Me
                                        </h2>
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                                {teacher.profileDescription || (
                                                    <span className="text-gray-400 italic">This professional hasn't provided an about section yet.</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'education' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                            <FaGraduationCap className="mr-3 text-blue-600" /> Education & Qualifications
                                        </h2>
                                        {teacher.educations && teacher.educations.length > 0 ? (
                                            <div className="space-y-6">
                                                {teacher.educations.map((edu, index) => (
                                                    <div key={index} className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                                    {edu.degreeName} <span className="text-blue-600">({edu.degreeType})</span>
                                                                </h3>
                                                                <p className="text-gray-600 text-lg font-medium mb-3">{edu.institutionName}</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                                                    </span>
                                                                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                                                        {edu.association}
                                                                    </span>
                                                                    {edu.specialization && (
                                                                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                                                            {edu.specialization}
                                                                        </span>
                                                                    )}
                                                                    {edu.score && (
                                                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                                            GPA: {edu.score}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center ml-4">
                                                                <FaGraduationCap className="text-white text-xl" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <FaGraduationCap className="text-gray-400 text-4xl mb-4 mx-auto" />
                                                <p className="text-gray-400 italic text-lg">No education information provided.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'experience' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                            <FaBriefcase className="mr-3 text-blue-600" /> Work Experience
                                        </h2>
                                        {teacher.experiences && teacher.experiences.length > 0 ? (
                                            <div className="space-y-6">
                                                {teacher.experiences.map((exp, index) => (
                                                    <div key={index} className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                                    {exp.designation} at <span className="text-blue-600">{exp.organizationName}</span>
                                                                </h3>
                                                                <div className="flex flex-wrap gap-2 mb-3">
                                                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                                                    </span>
                                                                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                                                        {exp.association}
                                                                    </span>
                                                                    {exp.currentJob && (
                                                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                                            Current Position
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {exp.jobDescription && (
                                                                    <div className="mt-4">
                                                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Responsibilities:</h4>
                                                                        {formatJobDescription(exp.jobDescription)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center ml-4">
                                                                <FaBriefcase className="text-white text-xl" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <FaBriefcase className="text-gray-400 text-4xl mb-4 mx-auto" />
                                                <p className="text-gray-400 italic text-lg">No work experience provided.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'subjects' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                            <FaBook className="mr-3 text-blue-600" /> Skills & Expertise
                                        </h2>
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                                            {renderSubjects()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTeacherProfile;