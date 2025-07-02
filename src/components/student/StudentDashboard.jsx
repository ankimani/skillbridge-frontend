import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Menus from './Menus';
import Footer from '../shared/Footer';
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
  FaHandshake
} from 'react-icons/fa';
import { fetchMyRequirements, closeRequirement, updateJobRequirement } from '../services/myRequirements';
import { fetchUserProfile } from '../services/authProfile';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const userData = await fetchUserProfile(token);
        if (!userData || !userData.userId) {
          throw new Error('User ID not found');
        }

        const requirementsData = await fetchMyRequirements(
          userData.userId,
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

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
      jobCategory: job.jobCategory,
      subjects: job.subjects,
      jobRequirements: job.jobRequirements,
      jobType: job.jobType,
      level: job.level,
      language: job.language,
      budget: job.budget,
      frequency: job.frequency,
      numberOfTutors: job.numberOfTutors,
      jobNature: job.jobNature,
      location: job.location,
      phone: job.phone
    });
    setShowUpdateModal(true);
  };

  const confirmCloseRequirement = async () => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const userData = await fetchUserProfile(token);
      await closeRequirement(selectedJob.jobId, userData.userId, token);
      
      const updatedRequirements = await fetchMyRequirements(
        userData.userId,
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
      setError(err.message);
      toast.error('Failed to close requirement');
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateRequirement = async () => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const userData = await fetchUserProfile(token);
      await updateJobRequirement(
        selectedJob.jobId,
        userData.userId,
        updatedJobData,
        token
      );
      
      const updatedRequirements = await fetchMyRequirements(
        userData.userId,
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
      setError(err.message);
      toast.error('Failed to update requirement');
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

  // Enhanced Update Modal with better form layout
  const UpdateJobModal = ({ job, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
      jobCategory: job.jobCategory,
      subjects: job.subjects,
      jobRequirements: job.jobRequirements,
      jobType: job.jobType,
      level: job.level,
      language: job.language,
      budget: job.budget,
      frequency: job.frequency,
      numberOfTutors: job.numberOfTutors,
      jobNature: job.jobNature,
      location: job.location,
      phone: job.phone
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">Update Job Requirement</h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Form Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1 */}
              <div className="space-y-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Category</label>
                  <input
                    type="text"
                    name="jobCategory"
                    value={formData.jobCategory}
                    onChange={handleChange}
                    className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subjects</label>
                  <input
                    type="text"
                    name="subjects"
                    value={formData.subjects}
                    onChange={handleChange}
                    className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="form-select w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="One-time">One-time</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="form-select w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="form-select w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="per hour">per hour</option>
                    <option value="per session">per session</option>
                    <option value="per week">per week</option>
                    <option value="per month">per month</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tutors Needed</label>
                  <input
                    type="number"
                    name="numberOfTutors"
                    value={formData.numberOfTutors}
                    onChange={handleChange}
                    className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Full-width fields */}
            <div className="mt-6 space-y-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Nature</label>
                <select
                  name="jobNature"
                  value={formData.jobNature}
                  onChange={handleChange}
                  className="form-select w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="In-person">In-person</option>
                  <option value="Online">Online</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                <textarea
                  name="jobRequirements"
                  value={formData.jobRequirements}
                  onChange={handleChange}
                  rows={5}
                  className="form-textarea w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onUpdate(formData)}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md"
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : 'Update Requirement'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Job Card Component
  const JobCard = ({ job }) => (
    <div key={job.jobId} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {job.jobCategory} - {job.subjects}
            </h2>
            <div className="flex items-center mt-2 space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                job.jobStatus === 'Open' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {job.jobStatus}
              </span>
              <span className="text-xs text-gray-500 flex items-center">
                <FaCalendarAlt className="mr-1" />
                {formatDate(job.createdAt)}
              </span>
              {job.hasActiveConnections && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <FaHandshake className="mr-1" /> Connected
                </span>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleUpdateClick(job)}
              disabled={job.jobStatus === 'Closed'}
              className={`p-2 rounded-full transition-colors ${
                job.jobStatus === 'Closed'
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
              }`}
              title={job.jobStatus === 'Closed' ? 'Cannot edit closed requirements' : 'Edit'}
            >
              <FaEdit />
            </button>
            <button 
              onClick={() => handleCloseClick(job)}
              disabled={job.jobStatus === 'Closed'}
              className={`p-2 rounded-full transition-colors ${
                job.jobStatus === 'Closed'
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-red-600 hover:text-red-800 hover:bg-red-50'
              }`}
              title={job.jobStatus === 'Closed' ? 'Requirement already closed' : 'Close'}
            >
              <FaTimes />
            </button>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Job Requirements</h3>
          <div className="text-gray-600">
            <p className="whitespace-pre-line">
              {truncateDescription(job.jobRequirements, job.jobId)}
            </p>
            {job.jobRequirements && job.jobRequirements.length > 200 && (
              <button
                onClick={() => toggleDescription(job.jobId)}
                className="text-blue-600 hover:text-blue-800 text-sm mt-1 flex items-center"
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
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                <FaBook className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-gray-700">{job.jobCategory}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                <FaClock className="text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Type</p>
                <p className="text-gray-700">{job.jobType}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-3">
                <FaUser className="text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Level</p>
                <p className="text-gray-700">{job.level}</p>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center mr-3">
                <FaMoneyBillWave className="text-yellow-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Budget</p>
                <p className="text-gray-700">${job.budget} {job.frequency}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mr-3">
                <FaLanguage className="text-red-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Language</p>
                <p className="text-gray-700">{job.language}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-3">
                <FaMapMarkerAlt className="text-indigo-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-gray-700">{job.location}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* <div className="mt-6 flex flex-wrap gap-3">
          <button 
            className="flex-1 min-w-[150px] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
            onClick={() => handleViewMessages(job.jobId)}
          >
            <FaSearch className="mr-2" /> View Messages
          </button>
        </div> */}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Menus />
        <div className="flex-grow p-8 flex justify-center items-center">
          <div className="text-center">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading your requirements...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Menus />
        <div className="flex-grow p-8 flex justify-center items-center">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md text-center">
            <div className="bg-red-100 text-red-800 p-4 rounded-lg flex items-center justify-center">
              <FaExclamationCircle className="mr-2 text-lg" />
              <span>{error}</span>
            </div>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Menus />

      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Requirements</h1>
                <p className="text-gray-600 mt-1">
                  {totalItems} {totalItems === 1 ? 'requirement' : 'requirements'} posted
                </p>
              </div>
              <button 
                className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
                onClick={handlePostJob}
              >
                <FaPlus className="mr-2" /> Post New Job
              </button>
            </div>

            {/* Encouragement to close connected requirements */}
            {hasOpenRequirementsWithConnections() && (
              <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaHandshake className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Great news!</h3>
                    <div className="mt-1 text-sm text-blue-700">
                      <p>
                        You have open requirements with active connections. Please remember to close 
                        your requirements once you've found the right professional to help prevent 
                        unnecessary messages from other tutors.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Requirements List */}
          <div className="space-y-6">
            {requirements.length > 0 ? (
              requirements.map(job => <JobCard key={job.jobId} job={job} />)
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaExclamationCircle className="text-blue-500 text-2xl" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">No Requirements Found</h3>
                  <p className="text-gray-600 mb-6">You haven't posted any requirements yet. Get started by posting your first job!</p>
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                    onClick={handlePostJob}
                  >
                    Post Your First Job
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-l-lg border border-gray-300 ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <div className="px-4 py-2 bg-white border-t border-b border-gray-300 text-gray-700 font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-r-lg border border-gray-300 ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
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
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
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
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
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

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800">{selectedJob.jobCategory} - {selectedJob.subjects}</h4>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
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
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  disabled={processing}
                >
                  No, Keep Open
                </button>
                <button
                  onClick={confirmCloseRequirement}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-md flex items-center"
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