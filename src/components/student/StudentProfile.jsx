import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaLockOpen, FaKey, FaBirthdayCake, 
    FaMapMarkerAlt, FaPhone, FaIdCard, FaInfoCircle, FaEdit, FaCamera } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProfileEditModal from './ProfileEditModal';
import Menus from './Menus';
import ChangePasswordModal from './ChangePasswordModal';
import { 
    getStudentProfileByUserId, 
    uploadStudentProfileImage,
    updateStudentProfile 
  } from '../services/studentProfile';

const StudentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [studentProfile, setStudentProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const { userId } = useParams();
  
    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            
            // Fetch user profile using service method
            const userResponse = await getStudentProfileByUserId(userId);
            if (userResponse.success) {
              setProfile(userResponse.data);
            } else {
              setError(userResponse.error);
            }
    
            // Fetch student profile
            const studentProfileResponse = await getStudentProfileByUserId(userId);
            if (studentProfileResponse.success) {
              setStudentProfile(studentProfileResponse.data);
              if (studentProfileResponse.data.imagePath) {
                setImagePreview(studentProfileResponse.data.imagePath);
              }
            }
          } catch (err) {
            setError(err.message || 'Failed to fetch profile');
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, [userId]);
  
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
        <div className="flex flex-col min-h-screen">
          <Menus />
          <div className="flex-grow flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex flex-col min-h-screen">
          <Menus />
          <div className="flex-grow flex justify-center items-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        </div>
      );
    }
  
    if (!profile) {
      return (
        <div className="flex flex-col min-h-screen">
          <Menus />
          <div className="flex-grow flex justify-center items-center">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              Profile not found
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Menus />
        <div className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-1">Manage your personal and account information</p>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-colors shadow-md"
              >
                <FaKey className="mr-2" />
                Change Password
              </button>
            </div>
  
            {/* Profile Card */}
            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
              <div className="px-8 py-6">
                {/* Profile Header with Image */}
                <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
                  {/* Profile Image with Upload */}
                  <div className="relative mb-6 md:mb-0">
                    <div className="h-40 w-40 rounded-full bg-gradient-to-br from-blue-100 to-gray-200 flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Profile" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaUser className="text-gray-400 text-6xl" />
                      )}
                    </div>
                    <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                      <FaCamera className="text-blue-600" />
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
                        <h2 className="text-2xl font-bold text-gray-800">
                          {studentProfile?.fullName || profile.username}
                        </h2>
                        <p className="text-gray-600 capitalize mt-1">
                          {profile.roleName?.replace('ROLE_', '').toLowerCase()}
                        </p>
                      </div>
                      {studentProfile && (
                        <button
                          onClick={() => setIsEditModalOpen(true)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit Profile"
                        >
                          <FaEdit size={20} />
                        </button>
                      )}
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {profile.email}
                      </span>
                      {profile.activeStatus && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Active
                        </span>
                      )}
                      {profile.unreadMessagesCount > 0 && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          {profile.unreadMessagesCount} unread messages
                        </span>
                      )}
                    </div>
                  </div>
                </div>
  
                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>
  
                {/* Details Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Account Information */}
                  <div className="bg-gray-50 p-5 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaLockOpen className="mr-2 text-blue-500" />
                      Account Information
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <FaUser className="mr-3 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-700">
                          <span className="font-medium">Username:</span> {profile.username}
                        </span>
                      </li>
                      <li className="flex items-center">
                        <FaEnvelope className="mr-3 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-700">
                          <span className="font-medium">Email:</span> {profile.email}
                        </span>
                      </li>
                      <li className="flex items-center">
                        {profile.locked ? (
                          <FaLock className="mr-3 text-red-500 flex-shrink-0" />
                        ) : (
                          <FaLockOpen className="mr-3 text-green-500 flex-shrink-0" />
                        )}
                        <span className="text-gray-700">
                          <span className="font-medium">Status:</span> {profile.locked ? 'Locked' : 'Active'}
                        </span>
                      </li>
                    </ul>
                  </div>
  
                  {/* Personal Information */}
                  {studentProfile ? (
                    <div className="bg-gray-50 p-5 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FaUser className="mr-2 text-blue-500" />
                        Personal Information
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <FaUser className="mr-3 text-gray-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">
                            <span className="font-medium">Full Name:</span> {studentProfile.fullName}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <FaBirthdayCake className="mr-3 text-gray-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">
                            <span className="font-medium">Date of Birth:</span> {formatDate(studentProfile.birthdate)}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <FaUser className="mr-3 text-gray-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 capitalize">
                            <span className="font-medium">Gender:</span> {studentProfile.gender?.toLowerCase()}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <FaMapMarkerAlt className="mr-3 text-gray-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">
                            <span className="font-medium">Location:</span> {studentProfile.location}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <FaIdCard className="mr-3 text-gray-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">
                            <span className="font-medium">Postal Code:</span> {studentProfile.postalCode}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <FaPhone className="mr-3 text-gray-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">
                            <span className="font-medium">Phone:</span> {studentProfile.phoneNumber}
                          </span>
                        </li>
                        {studentProfile.bio && (
                          <li className="flex items-start">
                            <FaInfoCircle className="mr-3 text-gray-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">
                              <span className="font-medium">Bio:</span> {studentProfile.bio}
                            </span>
                          </li>
                        )}
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-xl">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">Complete Your Profile</h3>
                          <p className="mt-1 text-sm text-blue-700">
                            Add personal information to access all features. Click the edit button above to get started.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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