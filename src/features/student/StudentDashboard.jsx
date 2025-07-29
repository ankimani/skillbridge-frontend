import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../shared/Footer';
import SkeletonRequirementCard from '../shared/SkeletonRequirementCard';
import ErrorBanner from '../shared/ErrorBanner';
import { 
  FaMapMarkerAlt, 
  FaExclamationCircle, 
  FaCheckCircle, 
  FaPhone, 
  FaClock, 
  FaUser, 
  FaLanguage, 
  FaBook, 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaChevronDown, 
  FaChevronUp,
  FaEdit,
  FaTimes,
  FaPlus,
  FaSearch,
  FaHandshake,
  FaBriefcase,
  FaGraduationCap,
  FaStar,
  FaEye,
  FaUsers,
  FaFileAlt,
  FaImage,
  FaSave
} from 'react-icons/fa';
import { fetchMyRequirements, closeRequirement, updateJobRequirement } from '../../components/services/myRequirements';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';

const StudentDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [requirements, setRequirements] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [updatedJobData, setUpdatedJobData] = useState({});
  const [processing, setProcessing] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const userId = user?.userId;
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = useAuthStore.getState().token || localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // Check if token is valid
        const isTokenValid = useAuthStore.getState().isTokenValid;
        if (!isTokenValid()) {
          useAuthStore.getState().forceLogout();
          navigate('/login');
          return;
        }
        
        if (!userId) {
          throw new Error('User ID not found');
        }
        const requirementsData = await fetchMyRequirements(
          userId,
          currentPage,
          itemsPerPage,
          token
        );
        setRequirements(requirementsData.jobs || []);
        setTotalPages(requirementsData.totalPages || 1);
        setTotalItems(requirementsData.totalItems || 0);
        setExpandedDescriptions({});
      } catch (err) {
        console.error('Error fetching requirements:', err);
        if (err.response?.status === 401) {
          useAuthStore.getState().forceLogout();
          navigate('/login');
          return;
        }
        addNotification({ type: 'error', message: err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, userId, navigate]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePostJob = () => {
    navigate('/postjob');
  };

  const handleViewMessages = (jobId) => {
    navigate(`/messages/${jobId}`);
  };

  const handleCloseClick = (job) => {
    if (job.jobStatus === 'Closed') {
      toast.info('This requirement is already closed');
      return;
    }
    setSelectedJob(job);
    setShowCloseConfirm(true);
  };

  const handleUpdateClick = (job) => {
    if (job.jobStatus === 'Closed') {
      toast.info('Closed requirements cannot be edited');
      return;
    }
    setSelectedJob(job);
    setUpdatedJobData({
      jobCategory: job.jobCategory || "Education & Training",
      subjects: job.subjects || "",
      jobRequirements: job.jobRequirements || "",
      jobType: job.jobType || "Tutoring",
      level: job.level || "High School",
      language: job.language || "English",
      budget: job.budget || "",
      frequency: job.frequency || "Weekly",
      numberOfTutors: job.numberOfTutors || 1,
      jobNature: job.jobNature || "Part-time",
      meetingOptions: job.meetingOptions || "Online",
      location: job.location || "",
      phone: job.phone || "",
      profileImg: job.profileImg || ""
    });
    setShowUpdateModal(true);
  };

  const confirmCloseRequirement = async () => {
    try {
      setProcessing(true);
      const token = useAuthStore.getState().token || localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      if (!userId) {
        throw new Error('User ID not found');
      }
      await closeRequirement(selectedJob.jobId, userId, token);
      const updatedRequirements = await fetchMyRequirements(
        userId,
        currentPage,
        itemsPerPage,
        token
      );
      setRequirements(updatedRequirements.jobs || []);
      setTotalPages(updatedRequirements.totalPages || 1);
      setTotalItems(updatedRequirements.totalItems || 0);
      setShowCloseConfirm(false);
      toast.success('Requirement closed successfully!');
    } catch (err) {
      console.error('Error closing requirement:', err);
      addNotification({ type: 'error', message: err.message || 'Failed to close requirement' });
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateRequirement = async (formData) => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      if (!userId) {
        throw new Error('User ID not found');
      }

      console.log('Submitting update with data:', formData);
      
      await updateJobRequirement(
        selectedJob.jobId,
        userId,
        formData,
        token
      );
      
      const updatedRequirements = await fetchMyRequirements(
        userId,
        currentPage,
        itemsPerPage,
        token
      );
      setRequirements(updatedRequirements.jobs || []);
      setTotalPages(updatedRequirements.totalPages || 1);
      setTotalItems(updatedRequirements.totalItems || 0);
      setShowUpdateModal(false);
      toast.success('Requirement updated successfully!');
    } catch (err) {
      console.error('Error updating requirement:', err);
      throw err; // Re-throw to let the modal handle the error
    } finally {
      setProcessing(false);
    }
  };

  const toggleDescription = (jobId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  const formatDate = (dateArray) => {
    // Note: month is 0-indexed in JavaScript Date, so we subtract 1 from the month
    const [year, month, day, hours, minutes, seconds, milliseconds] = dateArray;
    const date = new Date(year, month - 1, day, hours, minutes, seconds, milliseconds / 1000000);
    
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return date.toLocaleDateString(undefined, options);
};

  const truncateDescription = (text, jobId) => {
    const maxLength = 300;
    if (!text) return '';
    
    if (text.length <= maxLength || expandedDescriptions[jobId]) {
      return text;
    }
    
    return text.substring(0, maxLength) + '...';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedJobData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Check if there are open requirements with active connections
  const hasOpenRequirementsWithConnections = () => {
    return requirements.some(job => 
      job.jobStatus === 'Open' && job.hasActiveConnections
    );
  };

  // Enhanced Update Modal with beautiful design and message handling
  const UpdateJobModal = ({ job, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
      jobCategory: job.jobCategory || "Education & Training",
      subjects: job.subjects || "",
      jobRequirements: job.jobRequirements || "",
      jobType: job.jobType || "Tutoring",
      level: job.level || "High School",
      language: job.language || "English",
      budget: job.budget || "",
      frequency: job.frequency || "Weekly",
      numberOfTutors: job.numberOfTutors || 1,
      jobNature: job.jobNature || "Part-time",
      meetingOptions: job.meetingOptions || "Online",
      location: job.location || "",
      phone: job.phone || "",
      profileImg: job.profileImg || ""
    });

    const [message, setMessage] = useState({ text: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      // Clear any existing messages when user starts typing
      if (message.text) {
        setMessage({ text: '', type: '' });
      }
    };

    const handleSubmit = async () => {
      setIsSubmitting(true);
      setMessage({ text: '', type: '' });
      
      try {
        await onUpdate(formData);
        setMessage({ text: 'Job requirement updated successfully!', type: 'success' });
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (error) {
        setMessage({ 
          text: error.message || 'Failed to update job requirement. Please try again.', 
          type: 'error' 
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto border border-gray-100">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-3xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <FaEdit className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Update Job Requirement</h3>
                  <p className="text-blue-100 text-sm">Modify your tutoring request details</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-white hover:text-blue-100 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Message Display */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-xl flex items-center ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <FaCheckCircle className="mr-3 text-lg text-green-600" />
                ) : (
                  <FaExclamationCircle className="mr-3 text-lg text-red-600" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            )}

            {/* Enhanced Form Grid */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Column 1 */}
              <div className="space-y-6">
                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FaBriefcase className="mr-2 text-blue-500" />
                    Job Category
                  </label>
                  <input
                    type="text"
                    name="jobCategory"
                    value={formData.jobCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="e.g. Education & Training"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FaBook className="mr-2 text-blue-500" />
                    Subjects
                  </label>
                  <input
                    type="text"
                    name="subjects"
                    value={formData.subjects}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="e.g. Mathematics, Physics"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FaHandshake className="mr-2 text-blue-500" />
                    Job Type
                  </label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="Tutoring">Tutoring</option>
                    <option value="One-time">One-time</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FaGraduationCap className="mr-2 text-blue-500" />
                    Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="Primary School">Primary School</option>
                    <option value="High School">High School</option>
                    <option value="University">University</option>
                    <option value="Professional">Professional</option>
                  </select>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-6">
                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FaMoneyBillWave className="mr-2 text-blue-500" />
                    Budget ($)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FaClock className="mr-2 text-blue-500" />
                    Frequency
                  </label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="Hourly">Hourly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Fixed">Fixed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FaUsers className="mr-2 text-blue-500" />
                    Tutors Needed
                  </label>
                  <input
                    type="number"
                    name="numberOfTutors"
                    value={formData.numberOfTutors}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    min="1"
                    max="10"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FaLanguage className="mr-2 text-blue-500" />
                    Language
                  </label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="e.g. English"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FaEye className="mr-2 text-blue-500" />
                    Meeting Options
                  </label>
                  <select
                    name="meetingOptions"
                    value={formData.meetingOptions}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="Online">Online</option>
                    <option value="At my place">At my place</option>
                    <option value="Travel to tutor">Travel to tutor</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>

                        {/* Full-width fields */}
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="e.g. Nairobi"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FaPhone className="mr-2 text-blue-500" />
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="e.g. +25411000002"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaClock className="mr-2 text-blue-500" />
                  Job Nature
                </label>
                <select
                  name="jobNature"
                  value={formData.jobNature}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="Part-time">Part-time</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaFileAlt className="mr-2 text-blue-500" />
                  Requirements
                </label>
                <textarea
                  name="jobRequirements"
                  value={formData.jobRequirements}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Describe your tutoring requirements in detail..."
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaImage className="mr-2 text-blue-500" />
                  Profile Image URL (Optional)
                </label>
                <input
                  type="text"
                  name="profileImg"
                  value={formData.profileImg}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter image URL or leave empty"
                />
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FaSave className="mr-2" />
                    Update Requirement
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Job Card Component with modern design
  const JobCard = ({ job }) => (
    <div key={job.jobId} className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <FaBriefcase className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {job.jobCategory} - {job.subjects}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    job.jobStatus === 'Open' 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    <FaCheckCircle className="mr-1" />
                    {job.jobStatus}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    {formatDate(job.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            
            {job.hasActiveConnections && (
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  <FaHandshake className="mr-1" />
                  Active Connections
                </span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => handleUpdateClick(job)}
              disabled={job.jobStatus === 'Closed'}
              className={`p-3 rounded-xl transition-all duration-200 ${
                job.jobStatus === 'Closed'
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50 hover:scale-105'
              }`}
              title={job.jobStatus === 'Closed' ? 'Cannot edit closed requirements' : 'Edit'}
            >
              <FaEdit className="text-lg" />
            </button>
            <button 
              onClick={() => handleCloseClick(job)}
              disabled={job.jobStatus === 'Closed'}
              className={`p-3 rounded-xl transition-all duration-200 ${
                job.jobStatus === 'Closed'
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-red-600 hover:text-red-800 hover:bg-red-50 hover:scale-105'
              }`}
              title={job.jobStatus === 'Closed' ? 'Requirement already closed' : 'Close'}
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Requirements Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FaBook className="mr-2 text-blue-500" />
            Job Requirements
          </h3>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {truncateDescription(job.jobRequirements, job.jobId)}
            </p>
            {job.jobRequirements && job.jobRequirements.length > 200 && (
              <button
                onClick={() => toggleDescription(job.jobId)}
                className="text-blue-600 hover:text-blue-800 text-sm mt-3 flex items-center font-medium transition-colors"
              >
                {expandedDescriptions[job.jobId] ? (
                  <>
                    <FaChevronUp className="mr-1" /> Show Less
                  </>
                ) : (
                  <>
                    <FaChevronDown className="mr-1" /> View More
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center mr-4">
                <FaBook className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Category</p>
                <p className="text-gray-800 font-semibold">{job.jobCategory}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center mr-4">
                <FaClock className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Type</p>
                <p className="text-gray-800 font-semibold">{job.jobType}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center mr-4">
                <FaGraduationCap className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Level</p>
                <p className="text-gray-800 font-semibold">{job.level}</p>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center mr-4">
                <FaMoneyBillWave className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Budget</p>
                <p className="text-gray-800 font-semibold">${job.budget} {job.frequency}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center mr-4">
                <FaLanguage className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Language</p>
                <p className="text-gray-800 font-semibold">{job.language}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center mr-4">
                <FaMapMarkerAlt className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Location</p>
                <p className="text-gray-800 font-semibold">{job.location}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Action Buttons */}
        <div className="mt-6 space-y-3">
          {/* Close Job Reminder for Open Jobs */}
          {job.jobStatus === 'Open' && job.hasActiveConnections && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <FaCheckCircle className="text-white text-sm" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-800">
                    ✅ Satisfied with the assistance?
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Close this job to stop receiving messages and help other students find available professionals.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={() => handleViewMessages(job.jobId)}
            >
              <FaEye className="mr-2" /> View Messages
            </button>
            
            {job.jobStatus === 'Open' && (
              <button 
                onClick={() => handleCloseClick(job)}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaCheckCircle className="mr-2" /> Close Job
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen flex flex-col">
        <div className="flex-grow p-8">
          <div className="space-y-6" aria-busy="true" aria-label="Loading requirements...">
            {[...Array(4)].map((_, idx) => (
              <SkeletonRequirementCard key={idx} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen flex flex-col">
        <div className="flex-grow p-8 flex justify-center items-center">
          <div className="w-full max-w-md">
            <ErrorBanner message={error} onRetry={() => window.location.reload()} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen flex flex-col">
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="mb-8 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <FaBriefcase className="text-white text-xl" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Requirements</h1>
                    <p className="text-gray-600 mt-1">
                      {totalItems} {totalItems === 1 ? 'requirement' : 'requirements'} posted
                    </p>
                  </div>
                </div>
              </div>
              <button 
                aria-label="Post New Job"
                className="mt-4 md:mt-0 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                onClick={handlePostJob}
              >
                <FaPlus className="mr-3 text-lg" /> Post New Job
              </button>
            </div>

            {/* Enhanced encouragement banner */}
            {hasOpenRequirementsWithConnections() && (
              <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-xl shadow-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <FaCheckCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-xl font-bold text-green-800 mb-2">🎉 Success! Time to Close Your Job</h3>
                    <div className="text-green-700 space-y-2">
                      <p className="font-medium">
                        You have open requirements with active connections. If you've found the right professional 
                        and are satisfied with their assistance, please close your job to:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Stop receiving unnecessary messages from other professionals</li>
                        <li>Help other students find available professionals faster</li>
                        <li>Keep your dashboard organized and up-to-date</li>
                        <li>Show appreciation to the professional who helped you</li>
                      </ul>
                      <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                        <p className="text-sm font-semibold text-green-800">
                          💡 <strong>Tip:</strong> Only close jobs when you're completely satisfied with the assistance received. 
                          You can always post a new job if you need additional help later.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional prominent reminder for all open jobs */}
            {requirements.filter(job => job.jobStatus === 'Open').length > 0 && (
              <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-xl shadow-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                      <FaHandshake className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-bold text-blue-800 mb-2">📋 Manage Your Open Jobs</h3>
                    <div className="text-blue-700">
                      <p className="mb-3">
                        You have <strong>{requirements.filter(job => job.jobStatus === 'Open').length} open job(s)</strong>. 
                        Remember to review and close jobs that have been successfully completed to:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Prevent spam messages</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Help other students</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Keep dashboard clean</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Show appreciation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content with Sidebar Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Stats Cards */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaStar className="mr-2 text-yellow-500" />
                  Dashboard Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                        <FaCheckCircle className="text-white text-sm" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Open</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {requirements.filter(job => job.jobStatus === 'Open').length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <FaHandshake className="text-white text-sm" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Connected</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">
                      {requirements.filter(job => job.hasActiveConnections).length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center mr-3">
                        <FaTimes className="text-white text-sm" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Closed</span>
                    </div>
                    <span className="text-lg font-bold text-gray-600">
                      {requirements.filter(job => job.jobStatus === 'Closed').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaPlus className="mr-2 text-blue-500" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={handlePostJob}
                    className="w-full p-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FaPlus className="mr-2" />
                    Post New Job
                  </button>
                  
                  <button 
                    onClick={() => navigate('/messages')}
                    className="w-full p-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FaEye className="mr-2" />
                    View Messages
                  </button>
                  
                  <button 
                    onClick={() => navigate('/profile')}
                    className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FaUser className="mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaClock className="mr-2 text-orange-500" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {requirements.slice(0, 3).map((job, index) => (
                    <div key={job.jobId} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {job.jobCategory}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(job.createdAt)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.jobStatus === 'Open' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.jobStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                  {requirements.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No recent activity
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Requirements List */}
              <div className="space-y-6">
                {requirements.length > 0 ? (
                  requirements.map(job => <JobCard key={job.jobId} job={job} />)
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FaExclamationCircle className="text-white text-3xl" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">No Requirements Found</h3>
                      <p className="text-gray-600 mb-8 text-lg">You haven't posted any requirements yet. Get started by posting your first job!</p>
                      <button
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        onClick={handlePostJob}
                      >
                        <FaPlus className="mr-2 inline" />
                        Post Your First Job
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="inline-flex rounded-xl shadow-lg overflow-hidden">
                    <button
                      aria-label="Previous Page"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`px-6 py-3 border-r border-gray-200 ${
                        currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-700 hover:bg-gray-50 transition-colors'
                      }`}
                    >
                      Previous
                    </button>
                    <div className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold">
                      Page {currentPage} of {totalPages}
                    </div>
                    <button
                      aria-label="Next Page"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`px-6 py-3 ${
                        currentPage === totalPages 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-700 hover:bg-gray-50 transition-colors'
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Update Modal */}
      {showUpdateModal && selectedJob && (
        <UpdateJobModal 
          job={selectedJob} 
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateRequirement}
        />
      )}

      {/* Enhanced Close Confirmation Modal */}
      {showCloseConfirm && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">Confirm Requirement Closure</h3>
                <button 
                  onClick={() => setShowCloseConfirm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              <div className="mt-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FaExclamationCircle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Closing this requirement will prevent new tutors from applying. Existing conversations will remain accessible.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-800">{selectedJob.jobCategory} - {selectedJob.subjects}</h4>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2 font-medium">{selectedJob.jobStatus}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Posted:</span>
                      <span className="ml-2 font-medium">{formatDate(selectedJob.createdAt)}</span>
                    </div>
                    {selectedJob.hasActiveConnections && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Connections:</span>
                        <span className="ml-2 font-medium text-green-600">
                          <FaHandshake className="inline mr-1" /> Active conversations
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setShowCloseConfirm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  disabled={processing}
                >
                  No, Keep Open
                </button>
                <button
                  onClick={confirmCloseRequirement}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg flex items-center"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Closing...
                    </>
                  ) : (
                    <>
                      <FaTimes className="mr-2" />
                      Yes, Close Requirement
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;