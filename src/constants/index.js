// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// UI Constants
export const UI_CONSTANTS = {
  // Image compression
  MAX_IMAGE_WIDTH: 300,
  MAX_IMAGE_HEIGHT: 300,
  IMAGE_QUALITY: 90,
  
  // File sizes
  MAX_FILE_SIZE: 5000, // 5MB in KB
  
  // Timeouts and delays
  DEFAULT_TIMEOUT: 10000, // 10 seconds
  TOAST_DURATION: 3000,
  SHORT_DELAY: 1500,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // Breakpoints
  MOBILE_BREAKPOINT: 768,
  
  // Progress and percentages
  FULL_PERCENTAGE: 100,
  HALF_PERCENTAGE: 50,
  
  // Array limits
  MAX_SKILLS_DISPLAY: 5,
  MAX_DESCRIPTION_LENGTH: 200,
  MAX_TEXT_LENGTH: 1000,
  
  // Form validation
  MIN_PASSWORD_LENGTH: 8,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  
  // Currency
  CURRENCY_MULTIPLIER: 1000000, // For currency calculations
};

// API Constants
export const API_CONSTANTS = {
  ENDPOINTS: {
    LOGIN: '/api/v1/auth/login',
    PROFILE: '/api/v1/users/me',
    STUDENTS: '/api/v1/students',
    TEACHERS: '/api/v1/teachers',
    JOBS: '/api/v1/jobs',
    CHAT: '/api/v1/chat',
    COINS: '/api/v1/coins',
  },
};

// Application States
export const APP_STATES = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  IDLE: 'idle',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'ROLE_ADMIN',
  TEACHER: 'ROLE_TUTOR',
  STUDENT: 'ROLE_STUDENT',
};

// Job Status
export const JOB_STATUS = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};