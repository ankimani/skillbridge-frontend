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
    return response.data?.body?.data;
  } catch (error) {
    console.error("Failed to fetch applicant count:", error);
    throw error;
  }
};