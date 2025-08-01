import axios from 'axios';
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8089";
const API_BASE_URL = `${BACKEND_BASE_URL}/api/v1/chat`;

export const getJobApplicantCount = async (jobId, token) => {
  try {
    console.log("Fetching applicant count for jobId:", jobId);
    const response = await axios.get(
      `${API_BASE_URL}/${jobId}/applicants/count`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    
    // Return the count from response data
    const count = response.data?.body?.data;
    return count !== undefined && count !== null ? count : 0;
  } catch (error) {
    console.error("Failed to fetch applicant count:", error);
    
    // Check if it's a SQL error specifically
    if (error.response?.data?.message?.includes('bad SQL grammar') || 
        error.response?.data?.message?.includes('executeMany')) {
      console.warn("Backend SQL query error detected, returning fallback count");
      return 0; // Return 0 as fallback for SQL errors
    }
    
    // For other errors, throw to let the component handle it
    throw error;
  }
};