import axios from "axios";

const API_BASE_URL = process.env.BACKEND_BASE_URL || "http://localhost:8089";
const API_URL = `${API_BASE_URL}/api/v1/users`;
const API_URL_ME = `${API_URL}/me`;

// Get auth profile from backend
export const fetchUserProfile = async (token) => {
  try {
    const response = await axios.get(API_URL_ME, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data?.body?.data; // Return the 'data' object
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
};

// Get username by user ID
export const fetchUsernameById = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/info/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data?.body?.data?.username; // Return just the username
  } catch (error) {
    console.error(`Failed to fetch username for user ${userId}:`, error);
    throw error;
  }
};