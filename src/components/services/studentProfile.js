import apiClient from '../../utils/apiClient';
import { API_CONFIG } from '../../config/api';
import logger from '../../utils/logger';

const BASE_URL = `${API_CONFIG.BASE_URL}/api/v1/student-profiles`;

export const saveStudentProfile = async (profileData) => {
  try {
    const response = await apiClient.post('/api/v1/student-profiles', profileData);
    
    if (response.success) {
      logger.apiSuccess('POST', 'student-profiles', 'Profile saved successfully');
      return { success: true, data: response.data?.body?.data };
    } else {
      logger.apiError('POST', 'student-profiles', response.error);
      return { success: false, error: response.error || 'Failed to save student profile' };
    }
  } catch (error) {
    logger.apiError('POST', 'student-profiles', error.message);
    return { success: false, error: error.message };
  }
};

export const getStudentProfileByUserId = async (userId) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log('data', data);
    if (response.ok && data.headers.responseCode === 200) {
      return { success: true, data: data.body.data };
    } 
      return { success: false, error: data.headers.customerMessage || 'Failed to get student profile' };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateStudentProfile = async (studentId, profileData) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await fetch(`${BASE_URL}/${studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData),
    });
    const data = await response.json();
    console.log('data', data);
    if (response.ok && data.headers.responseCode === 200) {
      return { success: true, data: data.body.data };
    } 
      return { success: false, error: data.headers.customerMessage || 'Failed to update student profile' };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const uploadStudentProfileImage = async (file) => {
  const token = localStorage.getItem('authToken');
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    const data = await response.json();
    console.log('data', data);
    if (response.ok && data.headers.responseCode === 200) {
      return { success: true, data: data.body.data };
    } 
      return { success: false, error: data.headers.customerMessage || 'Failed to upload profile image' };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
};
export const getAllStudentProfiles = async (page = 1, pageSize = 5, searchTerm = null, genderFilter = null) => {
  try {
    // Construct query parameters
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', pageSize); // Note: backend expects 'size' not 'pageSize'
    
    if (searchTerm) {
      params.append('fullName', searchTerm); // Changed from 'search' to 'fullName'
    }
    
    if (genderFilter) {
      params.append('gender', genderFilter);
    }

    const response = await fetch(`${BASE_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.headers.responseCode === 200) {
      return { 
        success: true, 
        body: data.body
      };
    } 
      return { 
        success: false, 
        error: data.headers.customerMessage || 'Failed to get student profiles' 
      };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
};