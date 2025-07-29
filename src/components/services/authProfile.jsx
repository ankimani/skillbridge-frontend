import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8089";
const API_URL = `${API_BASE_URL}/api/v1/users`;
const API_URL_ME = `${API_URL}/me`;

// Get auth profile from backend
export const fetchUserProfile = async (token) => {
  try {
    console.log('fetchUserProfile: Fetching user profile');
    console.log('fetchUserProfile: Using token:', token ? 'Token exists' : 'No token');
    
    const response = await axios.get(API_URL_ME, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('fetchUserProfile: API response:', response.data);
    return response.data?.body?.data; // Return the 'data' object
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    console.error('fetchUserProfile error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      hasToken: !!token
    });
    throw error;
  }
};

// Get username by user ID
export const fetchUsernameById = async (userId, token) => {
  try {
    console.log('fetchUsernameById: Fetching username for userId:', userId);
    console.log('fetchUsernameById: Using token:', token ? 'Token exists' : 'No token');
    
    const response = await axios.get(`${API_URL}/info/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('fetchUsernameById: API response:', response.data);
    return response.data?.body?.data?.username; // Return just the username
  } catch (error) {
    console.error(`Failed to fetch username for user ${userId}:`, error);
    console.error('fetchUsernameById error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      userId: userId,
      hasToken: !!token
    });
    throw error;
  }
};