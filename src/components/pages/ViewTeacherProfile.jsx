import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { profileByTeacherId } from '../services/allTeachersProfile';
import { fetchMyRequirements } from '../services/myRequirements';
import { FaChalkboardTeacher, FaCheck, FaVenusMars, FaMoneyBillWave, FaHome, FaLaptop, FaPhone, FaMapMarkerAlt, FaIdBadge, FaGraduationCap, FaBook, FaClock, FaUserTie, FaBriefcase, FaTimes, FaCopy } from 'react-icons/fa';
import { FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import { IoMdTime } from 'react-icons/io';
import { fetchUserProfile } from '../services/authProfile';
import { deductCoinsClient } from '../services/digitalCoins';
import ChatModal from '../chat/ChatModal';

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
    const [chatJobData, setChatJobData] = useState(null); // New state for chat job data
  
    // Fetch teacher profile and user data
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('authToken');
            try {
                setLoading(true);
                const [userProfile, teacherResponse] = await Promise.all([
                    fetchUserProfile(token),
                    profileByTeacherId(teacherId)
                ]);
                setUserData(userProfile);
                setTeacher(teacherResponse.body.data);
            } catch (err) {
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [teacherId]);

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
            const firstFiveWords = selectedJob.jobRequirements.split(' ').slice(0, 5).join(' ');
            const payload = {
                coins: selectedJob.coins,
                reason: `For contacting Professional ${teacher.displayName} regarding job# ${selectedJob.jobId}-${firstFiveWords}`,
                jobId: selectedJob.jobId
            };

            const response = await deductCoinsClient(teacherId, userData?.userId, payload, token);
            
            if (response.headers.responseCode === 200 || response.headers.responseCode === 409) {
                // Store the necessary job data for chat before closing the modal
                setChatJobData({
                    jobId: selectedJob.jobId,
                    subjects: selectedJob.subjects
                });
                setShowChat(true);
                closeContactModal();
            } else {
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
            <div className="flex flex-wrap gap-2">
                {teacher.subjects.map((subject, index) => (
                    <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm"
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-6 bg-white rounded-xl shadow-md max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Profile</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                    >
                        <FiArrowLeft className="mr-2" /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!teacher) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-6 bg-white rounded-xl shadow-md max-w-md">
                    <div className="text-gray-400 text-5xl mb-4">
                        <FaChalkboardTeacher className="inline-block" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Teacher Not Found</h2>
                    <p className="text-gray-600 mb-4">The requested teacher profile could not be found.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                    >
                        <FiArrowLeft className="mr-2" /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Error Modal */}
            {chatError && (
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
                            <p className="text-sm text-gray-600">{chatError}</p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setChatError(null)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        {/* Background overlay */}
                        <div 
                            className="fixed inset-0 transition-opacity" 
                            aria-hidden="true"
                            onClick={closeContactModal}
                        >
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        {/* Modal container */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        
                        {/* Modal content */}
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">Contact Professional</h2>
                                    <button 
                                        onClick={closeContactModal}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <FaTimes className="text-xl" />
                                    </button>
                                </div>

                                {loadingJobs ? (
                                    <div className="flex justify-center py-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : jobsError ? (
                                    <div className="text-red-500 mb-4">{jobsError}</div>
                                ) : (
                                    <>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                                Select Job/Assignment
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                                <h3 className="font-medium text-gray-800 mb-2">Job Details</h3>
                                                <p className="text-gray-600 text-sm mb-1">
                                                    <span className="font-medium">Subject:</span> {selectedJob.subjects}
                                                </p>
                                                <p className="text-gray-600 text-sm mb-1">
                                                    <span className="font-medium">Level:</span> {selectedJob.level}
                                                </p>
                                                <p className="text-gray-600 text-sm mb-1">
                                                    <span className="font-medium">Budget:</span> ${selectedJob.budget} ({selectedJob.frequency})
                                                </p>
                                                <p className="text-gray-600 text-sm">
                                                    <span className="font-medium">Coins required:</span> {selectedJob.coins}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center mt-6">
                                            <button
                                                onClick={closeContactModal}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                disabled={!selectedJob || isProcessing}
                                                className={`px-4 py-2 rounded-md text-white ${selectedJob ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} ${isProcessing ? 'opacity-75' : ''}`}
                                                onClick={handleContactProfessional}
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
                                                        <span>Contact for {selectedJob?.coins || 0} coins</span>
                                                    </>
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
            {showChat && teacherId && userData && chatJobData && (
                <ChatModal
                    isOpen={showChat}
                    receiverId={teacherId}
                    jobId={chatJobData.jobId}
                    onClose={() => {
                        setShowChat(false);
                        setChatJobData(null); // Clear chat job data when closing
                    }}
                    initialMessage={`Hi, I'm interested in your tutoring services for my ${chatJobData.subjects} requirement`}
                    senderType="student"
                />
            )}

            <div className="container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors group"
                >
                    <FiArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" /> 
                    Back to Professionals
                </button>

                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="relative">
                                {imageError || !teacher.imagePath ? (
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-blue-400 border-4 border-white shadow-lg flex items-center justify-center">
                                        <span className="text-2xl md:text-4xl font-bold text-white">
                                            {teacher.displayName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                ) : (
                                    <img
                                        src={teacher.imagePath}
                                        alt={teacher.displayName}
                                        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                        onError={() => setImageError(true)}
                                    />
                                )}
                                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md">
                                    <FaIdBadge className="text-blue-600 text-lg" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-white">{teacher.displayName}</h1>
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                    <span className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                        <FaUserTie className="mr-1" /> {teacher.gender || 'Not specified'}
                                    </span>
                                    <span className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                        <FaMapMarkerAlt className="mr-1" /> {teacher.location || 'Location not provided'}
                                    </span>
                                    <span className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                        <FaMoneyBillWave className="mr-1" /> Rate: ${teacher.minFee || '0'}-${teacher.maxFee || '0'}/hr
                                    </span>
                                    <span className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                        <IoMdTime className="mr-1" /> {teacher.totalExpYears || '0'} years experience
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
                        {/* Left Column - About and Education */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* About Section */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <FaUserTie className="mr-2 text-blue-600" /> About Me
                                </h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {teacher.profileDescription || (
                                        <span className="text-gray-400 italic">This teacher hasn't provided an about section yet.</span>
                                    )}
                                </p>
                            </div>

                            {/* Education Section */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <FaGraduationCap className="mr-2 text-blue-600" /> Education & Qualifications
                                </h2>
                                {teacher.educations && teacher.educations.length > 0 ? (
                                    <ul className="space-y-4">
                                        {teacher.educations.map((edu, index) => (
                                            <li key={index} className="relative pl-6 pb-4 border-l-2 border-blue-300">
                                                <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                                                <div className="bg-blue-50 rounded-lg p-4 shadow-inner">
                                                    <h3 className="font-semibold text-gray-800 text-lg">
                                                        {edu.degreeName} <span className="text-blue-600">({edu.degreeType})</span>
                                                    </h3>
                                                    <p className="text-gray-600 text-sm font-medium">{edu.institutionName}</p>
                                                    <div className="mt-2 text-gray-500 text-xs flex flex-wrap gap-2 items-center">
                                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                                        </span>
                                                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                                            {edu.association}
                                                        </span>
                                                        {edu.specialization && (
                                                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                                                {edu.specialization}
                                                            </span>
                                                        )}
                                                        {edu.score && (
                                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                                                GPA: {edu.score}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400 italic">No education information provided.</p>
                                )}
                            </div>

                            {/* Experience Section */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <FaBriefcase className="mr-2 text-blue-600" /> Work Experience
                                </h2>
                                {teacher.experiences && teacher.experiences.length > 0 ? (
                                    <ul className="space-y-6">
                                        {teacher.experiences.map((exp, index) => (
                                            <li key={index} className="relative pl-10">
                                                <div className="absolute left-0 top-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <FaCheck className="text-blue-600 text-xs" />
                                                </div>
                                                <div className="bg-blue-50 rounded-lg p-5 shadow-inner">
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                                        <h3 className="font-semibold text-gray-800 text-lg">
                                                            {exp.designation} at <span className="text-blue-600">{exp.organizationName}</span>
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                                                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                                            </span>
                                                            {exp.currentJob && (
                                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                                                    Current Position
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 text-sm mt-1">
                                                        {exp.association}
                                                    </p>
                                                    {exp.jobDescription && (
                                                        <div className="mt-4">
                                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Key Responsibilities:</h4>
                                                            {formatJobDescription(exp.jobDescription)}
                                                        </div>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400 italic">No work experience provided.</p>
                                )}
                            </div>

                            {/* Subjects Section */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <FaBook className="mr-2 text-blue-600" /> Skills & Expertise
                                </h2>
                                {renderSubjects()}
                            </div>
                        </div>

                        {/* Right Column - Contact and Details */}
                        <div className="space-y-6">
                            {/* Contact Card */}
                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <FaPhone className="mr-2 text-blue-600" /> Contact Information
                                </h2>
                                <div className="space-y-4">
                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                                        <p className="text-gray-800 font-medium mt-1">
                                            {teacher.phoneNumber || (
                                                <span className="text-gray-400 italic">Not provided</span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-500 font-medium">Email</p>
                                        <p className="text-gray-800 font-medium mt-1">
                                            {teacher.email || (
                                                <span className="text-gray-400 italic">Not provided</span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-blue-200">
                                    <h3 className="font-medium text-gray-800 mb-3">Teaching Options</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                                            <FaLaptop className="text-blue-600 mr-3" />
                                            <div>
                                                <p className="text-gray-700 font-medium">Online Lessons</p>
                                                <p className="text-gray-500 text-sm">
                                                    {teacher.onlineAvailability ? 'Available' : 'Not available'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                                            <FaHome className="text-blue-600 mr-3" />
                                            <div>
                                                <p className="text-gray-700 font-medium">Home Tutoring</p>
                                                <p className="text-gray-500 text-sm">
                                                    {teacher.homeAvailability ? 'Available' : 'Not available'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Experience Summary Card */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <FaClock className="mr-2 text-blue-600" /> Professional Experience
                                </h2>
                                <div className="flex items-start">
                                    <div className="bg-blue-100 text-blue-800 rounded-full w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0">
                                        <IoMdTime className="text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-xl">{teacher.totalExpYears || '0'} Years</h3>
                                        <p className="text-gray-600">Total teaching experience</p>
                                        {teacher.onlineExpYears && (
                                            <p className="text-gray-600 text-sm mt-2 bg-blue-50 px-3 py-1 rounded-full inline-block">
                                                {teacher.onlineExpYears} years online teaching
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details */}
                            {teacher.paymentDetails && (
                                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <FaMoneyBillWave className="mr-2 text-blue-600" /> Payment Details
                                    </h2>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-gray-700 whitespace-pre-line text-sm">
                                            {teacher.paymentDetails}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button 
                                    onClick={openContactModal}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    Contact This Professional
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTeacherProfile;