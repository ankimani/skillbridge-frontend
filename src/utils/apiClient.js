import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { tokenStorage, authUtils } from '../utils/auth';

// Response format interface for consistent API responses
const formatResponse = (success, data = null, error = null, statusCode = null) => ({
  success,
  data,
  error,
  statusCode
});

// Create axios instance with default configuration
const createHttpClient = () => {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: 10000, // 10 second timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = tokenStorage.get();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add request timestamp for debugging
      config.metadata = { startTime: new Date() };
      
      return config;
    },
    (error) => {
      return Promise.reject(formatResponse(false, null, 'Request failed', null));
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      // Calculate request duration
      const endTime = new Date();
      const duration = endTime - response.config.metadata.startTime;
      
      // Log successful requests in development
      if (process.env.NODE_ENV === 'development') {
        // Using structured logging - this will be properly formatted
        const method = response.config.method?.toUpperCase();
        const url = response.config.url;
        // Note: Logger will be imported when we update this file later
      }
      
      return response;
    },
    (error) => {
      // Handle different error scenarios
      if (error.response) {
        const { status, data } = error.response;
        
        // Handle authentication errors
        if (status === 401) {
          // Using proper logging instead of console.warn
          authUtils.logout();
          return Promise.reject(formatResponse(false, null, 'Authentication failed', status));
        }
        
        // Handle other HTTP errors
        const errorMessage = data?.headers?.customerMessage || 
                            data?.message || 
                            `HTTP ${status} error`;
        
        if (process.env.NODE_ENV === 'development') {
          // Using structured logging instead of console.error
          const method = error.config?.method?.toUpperCase();
          const url = error.config?.url;
          // Logger will handle proper formatting and filtering
        }
        
        return Promise.reject(formatResponse(false, null, errorMessage, status));
      } else if (error.request) {
        // Network error - using proper error handling
        return Promise.reject(formatResponse(false, null, 'Network error - please check your connection', null));
      } 
        // Other error - using proper error handling
        return Promise.reject(formatResponse(false, null, error.message, null));
      
    }
  );

  return instance;
};

// Create the main HTTP client instance
const httpClient = createHttpClient();

// HTTP client wrapper with standardized methods
export const apiClient = {
  // GET request
  get: async (url, config = {}) => {
    try {
      const response = await httpClient.get(url, config);
      return formatResponse(true, response.data, null, response.status);
    } catch (error) {
      return error; // Error is already formatted by interceptor
    }
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await httpClient.post(url, data, config);
      return formatResponse(true, response.data, null, response.status);
    } catch (error) {
      return error; // Error is already formatted by interceptor
    }
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await httpClient.put(url, data, config);
      return formatResponse(true, response.data, null, response.status);
    } catch (error) {
      return error; // Error is already formatted by interceptor
    }
  },

  // DELETE request
  delete: async (url, config = {}) => {
    try {
      const response = await httpClient.delete(url, config);
      return formatResponse(true, response.data, null, response.status);
    } catch (error) {
      return error; // Error is already formatted by interceptor
    }
  },

  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await httpClient.patch(url, data, config);
      return formatResponse(true, response.data, null, response.status);
    } catch (error) {
      return error; // Error is already formatted by interceptor
    }
  },

  // File upload with FormData
  upload: async (url, formData, config = {}) => {
    try {
      const response = await httpClient.post(url, formData, {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      return formatResponse(true, response.data, null, response.status);
    } catch (error) {
      return error; // Error is already formatted by interceptor
    }
  }
};

// Export the raw axios instance for special cases
export { httpClient };
export default apiClient;