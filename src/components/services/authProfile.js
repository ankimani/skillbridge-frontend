import apiClient from '../../services/httpClient';
import { API_CONFIG } from '../../config/api';

// Get auth profile from backend
export const fetchUserProfile = async () => {
  const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.USERS}/me`);
  
  if (response.success) {
    return response.data?.body?.data;
  } 
    throw new Error(response.error || 'Failed to fetch user profile');
  
};

// Get username by user ID
export const fetchUsernameById = async (userId) => {
  const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.USERS}/info/${userId}`);
  
  if (response.success) {
    return response.data?.body?.data?.username;
  } 
    throw new Error(response.error || `Failed to fetch username for user ${userId}`);
  
};