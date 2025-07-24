export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8089",
  ENDPOINTS: {
    AUTH: "/api/v1/auth",
    USERS: "/api/v1/users", 
    TEACHERS: "/api/v1/teachers",
    STUDENTS: "/api/v1/students",
    JOBS: "/api/v1/jobs",
    CHAT: "/api/v1/chat",
    COINS: "/api/v1/coins",
    PAYMENTS: "/api/v1/payments",
    DASHBOARD: "/api/v1/dashboard",
    SUBJECTS: "/api/v1/subjects",
    EXPERIENCES: "/api/v1/experiences",
    EDUCATION: "/api/v1/education",
    PRICING: "/api/v1/pricing",
    TRANSACTIONS: "/api/v1/transactions"
  },
  STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUBLIC_KEY
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint, path = '') => {
  return `${API_CONFIG.BASE_URL}${endpoint}${path}`;
};