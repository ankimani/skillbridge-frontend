import axios from 'axios';
import createApiInstance from "./apiInterceptor";
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || "http://localhost:8089";
const API_BASE_URL = `${BACKEND_BASE_URL}/api/v1/teachers`;
const teachersApi= createApiInstance(API_BASE_URL);
export const fetchAllTeachers = async (filters = {}) => {
  try {
    const {
      page = 1,
      size = 10,
      gender = '',
      minFee = '',
      maxFee = '',
      onlineAvailability = '',
      homeAvailability = ''
    } = filters;

    const params = new URLSearchParams({
      page,
      size,
      ...(gender && { gender }),
      ...(minFee && { minFee }),
      ...(maxFee && { maxFee }),
      ...(onlineAvailability && { onlineAvailability }),
      ...(homeAvailability && { homeAvailability })
    });

    const response = await axios.get(`${API_BASE_URL}/all?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }
};

export const fetchAllTeachersWithoutFilters = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all?page=1&size=10`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all teachers:', error);
    throw error;
  }
};
export const profileByTeacherId = async (teacherId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profiles/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
      throw error;
    }
  };
  export const allTeachersPaginated = async (page = 1, size = 5, displayName = '') => {
    try {
      const response = await teachersApi.get(`/profiles/all`, {
        params: {
          page,
          size,
          displayName
        }
      });
  
      // The response structure matches what you provided
      if (response.data && response.data.body && response.data.body.data) {
        return {
          success: true,
          data: response.data.body.data,
          headers: response.data.headers
        };
      }
      
      throw new Error('Unexpected response structure');
    } catch (error) {
      console.error('Error fetching paginated teachers:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
};
  