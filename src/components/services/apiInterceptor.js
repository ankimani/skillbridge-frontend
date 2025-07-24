import axios from 'axios';
import { logoutUser } from './authLogout'; // Adjust the import path as needed

const createApiInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken'); // Changed to match your logout function
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // Handle token expiration (typically 401 status)
        if (error.response.status === 401) {
          // Show error message
          alert('Your session has expired. Please login again.');
          
          // Logout user
          logoutUser();
          
          // Redirect to login page
          window.location.href = '/login'; // Adjust the path as needed
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createApiInstance;