import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaLockOpen, FaKey, FaBirthdayCake, 
    FaMapMarkerAlt, FaPhone, FaIdCard, FaInfoCircle, FaEdit, FaCamera,
    FaStar, FaEye, FaGraduationCap, FaCalendarAlt, FaShieldAlt, FaCheckCircle,
    FaExclamationTriangle, FaPlus, FaBook, FaHandshake } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileEditModal from './ProfileEditModal';
import ChangePasswordModal from './ChangePasswordModal';
import { 
    getStudentProfileByUserId, 
    uploadStudentProfileImage,
    updateStudentProfile 
  } from '../../components/services/studentProfile';
import { fetchUserProfile } from '../../components/services/authProfile';
import SkeletonProfileCard from '../shared/SkeletonProfileCard';
import ErrorBanner from '../shared/ErrorBanner';
import { useAuthStore } from '../../store/useAuthStore';

const StudentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [studentProfile, setStudentProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();
  
    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            
            // Check if token is valid
            const isTokenValid = useAuthStore.getState().isTokenValid;
            if (!isTokenValid()) {
              useAuthStore.getState().forceLogout();
              navigate('/login');
              return;
            }
            
            if (!user?.userId) {
              setError('User not authenticated');
              return;
            }
            
            // Fetch user profile using service method
            try {
              const userResponse = await getStudentProfileByUserId(user.userId);
              if (userResponse.success) {
                setProfile(userResponse.data);
              } else {
                setError(userResponse.error);
              }
            } catch (userErr) {
              console.error('Error fetching user profile:', userErr);
              if (userErr.response?.status === 401) {
                useAuthStore.getState().forceLogout();
                navigate('/login');
                return;
              }
              setError(`Failed to fetch user profile: ${userErr.message}`);
              return;
            }
    
            // Fetch student profile
            try {
              const studentProfileResponse = await getStudentProfileByUserId(user.userId);
              if (studentProfileResponse.success) {
                setStudentProfile(studentProfileResponse.data);
                if (studentProfileResponse.data.imagePath) {
                  setImagePreview(studentProfileResponse.data.imagePath);
                }
              }
            } catch (studentErr) {
              console.error('Error fetching student profile:', studentErr);
              if (studentErr.response?.status === 401) {
                useAuthStore.getState().forceLogout();
                navigate('/login');
                return;
              }
              setError(`Failed to fetch student profile: ${studentErr.message}`);
            }
          } catch (err) {
            console.error('General error in fetchData:', err);
            if (err.response?.status === 401) {
              useAuthStore.getState().forceLogout();
              navigate('/login');
              return;
            }
            setError(err.message || 'Failed to fetch profile');
          } finally {
            setLoading(false);
          }
        };
    
        // Wait a bit for authentication to be ready
        const timer = setTimeout(() => {
          if (user?.userId) {
            fetchData();
          } else {
            setError('User not authenticated. Please login again.');
          }
        }, 100);
        
        return () => clearTimeout(timer);
      }, [user, navigate]);
  
    const handleImageChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
  
      // Upload to server
      try {
        const result = await uploadStudentProfileImage(file);
        if (!result.success) {
          console.error('Failed to upload image:', result.error);
        }
      } catch (err) {
        console.error('Error uploading image:', err);
      }
    };
  
    const handleSave = async (updatedData) => {
        try {
          const result = await updateStudentProfile(studentProfile.userId, updatedData);
          
          if (result.success) {
            setStudentProfile(prev => ({
              ...prev,
              ...result.data
            }));
            setIsEditModalOpen(false);
          } else {
            console.error('Update failed:', result.error);
            // Show error to user
          }
        } catch (err) {
          console.error('Failed to update profile:', err);
          // Show error to user
        }
      };
  
    const formatDate = (dateArray) => {
      if (!dateArray || dateArray.length !== 3) return 'Not specified';
      const [year, month, day] = dateArray;
      return new Date(year, month - 1, day).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
  
    if (loading) {
      return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
          <div className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white shadow-xl rounded-2xl p-6">
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
                <p className="text-center text-gray-600 mt-4">Loading profile...</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
          <div className="flex-grow flex justify-center items-center">
            <div className="w-full max-w-md">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <h3 className="text-lg font-medium text-red-800 mb-2">Authentication Error</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <div className="text-sm text-red-600 mb-4">
                  <p><strong>Debug Info:</strong></p>
                  <p>User: {user ? 'Present' : 'Not found'}</p>
                  <p>User ID: {user?.userId || 'Not available'}</p>
                  <p>Role: {user?.roleName || 'Not available'}</p>
                  <p>Token: {localStorage.getItem('authToken') ? 'Present' : 'Not found'}</p>
                </div>
                <button
                  onClick={() => window.location.href = '/login'}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  
    if (!profile) {
      return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
          <div className="flex-grow flex justify-center items-center">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-xl">
              Profile not found
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                    <FaUser className="text-white text-2xl" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                    <p className="text-gray-600 mt-1">Manage your personal and account information</p>
                  </div>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    aria-label="Change Password"
                  >
                    <FaKey className="mr-2" />
                    Change Password
                  </button>
                  {studentProfile && (
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      aria-label="Edit Profile"
                    >
                      <FaEdit className="mr-2" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content with Sidebar Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Profile Stats */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaStar className="mr-2 text-yellow-500" />
                    Profile Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                          <FaCheckCircle className="text-white text-sm" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Status</span>
                      </div>
                      <span className="text-sm font-bold text-green-600">
                        {profile.activeStatus ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <FaEnvelope className="text-white text-sm" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Messages</span>
                      </div>
                      <span className="text-sm font-bold text-blue-600">
                        {profile.unreadMessagesCount || 0}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                          <FaUser className="text-white text-sm" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Role</span>
                      </div>
                      <span className="text-sm font-bold text-purple-600 capitalize">
                        {profile.roleName?.replace('ROLE_', '').toLowerCase()}
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
                      onClick={() => navigate('/student-dashboard')}
                      className="w-full p-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FaBook className="mr-2" />
                      My Requirements
                    </button>
                    
                    <button 
                      onClick={() => navigate('/messages')}
                      className="w-full p-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FaEye className="mr-2" />
                      View Messages
                    </button>
                    
                    <button 
                      onClick={() => navigate('/postjob')}
                      className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FaPlus className="mr-2" />
                      Post New Job
                    </button>
                  </div>
                </div>

                {/* Account Security */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaShieldAlt className="mr-2 text-orange-500" />
                    Account Security
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                          <FaLockOpen className="text-white text-sm" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Account Status</span>
                      </div>
                      <span className="text-sm font-bold text-green-600">
                        {profile.locked ? 'Locked' : 'Active'}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="w-full p-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FaKey className="mr-2" />
                      Change Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-3">
                {/* Enhanced Profile Card */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                  <div className="px-8 py-6">
                    {/* Profile Header with Image */}
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
                      {/* Profile Image with Upload */}
                      <div className="relative mb-6 md:mb-0">
                        <div className="h-40 w-40 rounded-2xl bg-gradient-to-br from-blue-100 to-gray-200 flex items-center justify-center overflow-hidden shadow-lg">
                          {imagePreview ? (
                            <img 
                              src={imagePreview} 
                              alt="Profile image"
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <FaUser className="text-gray-400 text-6xl" />
                          )}
                        </div>
                        <label className="absolute bottom-2 right-2 bg-white p-3 rounded-xl shadow-lg cursor-pointer hover:bg-gray-100 transition-all duration-200 transform hover:scale-105">
                          <FaCamera className="text-blue-600 text-lg" />
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>

                      {/* Basic Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-3xl font-bold text-gray-800">
                              {studentProfile?.fullName || profile.username}
                            </h2>
                            <p className="text-gray-600 capitalize mt-2 text-lg">
                              {profile.roleName?.replace('ROLE_', '').toLowerCase()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex flex-wrap gap-3">
                          <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-xl text-sm font-medium border border-blue-200">
                            {profile.email}
                          </span>
                          {profile.activeStatus && (
                            <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl text-sm font-medium border border-green-200">
                              <FaCheckCircle className="inline mr-1" />
                              Active
                            </span>
                          )}
                          {profile.unreadMessagesCount > 0 && (
                            <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-xl text-sm font-medium border border-purple-200">
                              <FaEnvelope className="inline mr-1" />
                              {profile.unreadMessagesCount} unread messages
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-8"></div>

                    {/* Details Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Account Information */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                          <FaLockOpen className="mr-3 text-blue-500 text-xl" />
                          Account Information
                        </h3>
                        <ul className="space-y-4">
                          <li className="flex items-center p-3 bg-white rounded-xl shadow-sm">
                            <FaUser className="mr-4 text-blue-500 flex-shrink-0" />
                            <div>
                              <span className="text-sm text-gray-500 font-medium">Username</span>
                              <p className="text-gray-800 font-semibold">{profile.username}</p>
                            </div>
                          </li>
                          <li className="flex items-center p-3 bg-white rounded-xl shadow-sm">
                            <FaEnvelope className="mr-4 text-blue-500 flex-shrink-0" />
                            <div>
                              <span className="text-sm text-gray-500 font-medium">Email</span>
                              <p className="text-gray-800 font-semibold">{profile.email}</p>
                            </div>
                          </li>
                          <li className="flex items-center p-3 bg-white rounded-xl shadow-sm">
                            {profile.locked ? (
                              <FaLock className="mr-4 text-red-500 flex-shrink-0" />
                            ) : (
                              <FaLockOpen className="mr-4 text-green-500 flex-shrink-0" />
                            )}
                            <div>
                              <span className="text-sm text-gray-500 font-medium">Status</span>
                              <p className="text-gray-800 font-semibold">{profile.locked ? 'Locked' : 'Active'}</p>
                            </div>
                          </li>
                        </ul>
                      </div>

                      {/* Personal Information */}
                      {studentProfile ? (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                            <FaUser className="mr-3 text-green-500 text-xl" />
                            Personal Information
                          </h3>
                          <ul className="space-y-4">
                            <li className="flex items-center p-3 bg-white rounded-xl shadow-sm">
                              <FaUser className="mr-4 text-green-500 flex-shrink-0" />
                              <div>
                                <span className="text-sm text-gray-500 font-medium">Full Name</span>
                                <p className="text-gray-800 font-semibold">{studentProfile.fullName}</p>
                              </div>
                            </li>
                            <li className="flex items-center p-3 bg-white rounded-xl shadow-sm">
                              <FaBirthdayCake className="mr-4 text-green-500 flex-shrink-0" />
                              <div>
                                <span className="text-sm text-gray-500 font-medium">Date of Birth</span>
                                <p className="text-gray-800 font-semibold">{formatDate(studentProfile.birthdate)}</p>
                              </div>
                            </li>
                            <li className="flex items-center p-3 bg-white rounded-xl shadow-sm">
                              <FaUser className="mr-4 text-green-500 flex-shrink-0" />
                              <div>
                                <span className="text-sm text-gray-500 font-medium">Gender</span>
                                <p className="text-gray-800 font-semibold capitalize">{studentProfile.gender?.toLowerCase()}</p>
                              </div>
                            </li>
                            <li className="flex items-center p-3 bg-white rounded-xl shadow-sm">
                              <FaMapMarkerAlt className="mr-4 text-green-500 flex-shrink-0" />
                              <div>
                                <span className="text-sm text-gray-500 font-medium">Location</span>
                                <p className="text-gray-800 font-semibold">{studentProfile.location}</p>
                              </div>
                            </li>
                            <li className="flex items-center p-3 bg-white rounded-xl shadow-sm">
                              <FaIdCard className="mr-4 text-green-500 flex-shrink-0" />
                              <div>
                                <span className="text-sm text-gray-500 font-medium">Postal Code</span>
                                <p className="text-gray-800 font-semibold">{studentProfile.postalCode}</p>
                              </div>
                            </li>
                            <li className="flex items-center p-3 bg-white rounded-xl shadow-sm">
                              <FaPhone className="mr-4 text-green-500 flex-shrink-0" />
                              <div>
                                <span className="text-sm text-gray-500 font-medium">Phone</span>
                                <p className="text-gray-800 font-semibold">{studentProfile.phoneNumber}</p>
                              </div>
                            </li>
                            {studentProfile.bio && (
                              <li className="flex items-start p-3 bg-white rounded-xl shadow-sm">
                                <FaInfoCircle className="mr-4 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                  <span className="text-sm text-gray-500 font-medium">Bio</span>
                                  <p className="text-gray-800 font-semibold">{studentProfile.bio}</p>
                                </div>
                              </li>
                            )}
                          </ul>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-6 rounded-2xl">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <FaExclamationTriangle className="h-8 w-8 text-blue-400" />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-semibold text-blue-800">Complete Your Profile</h3>
                              <p className="mt-2 text-blue-700">
                                Add personal information to access all features. Click the edit button above to get started.
                              </p>
                              <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                              >
                                Complete Profile
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Edit Profile Modal */}
          {isEditModalOpen && studentProfile && (
            <ProfileEditModal
              profile={studentProfile}
              onClose={() => setIsEditModalOpen(false)}
              onSave={handleSave}
            />
          )}
  
          {/* Change Password Modal */}
          {isPasswordModalOpen && (
            <ChangePasswordModal
                onClose={() => setIsPasswordModalOpen(false)}
                onSuccess={() => {
                // Optional: Add any success callbacks here
                console.log('Password changed successfully');
                }}
            />
            )}
        </div>
      </div>
    );
  };
  
  export default StudentProfile;