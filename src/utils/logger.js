// Development logging utility
const isDevelopment = process.env.NODE_ENV === 'development';

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const LOG_COLORS = {
  ERROR: '#dc3545',
  WARN: '#ffc107',
  INFO: '#0dcaf0',
  DEBUG: '#6c757d'
};

class Logger {
  constructor(level = LOG_LEVELS.INFO) {
    this.level = level;
  }

  _log(level, message, ...args) {
    if (!isDevelopment || level > this.level) return;
    
    const timestamp = new Date().toISOString();
    const levelName = Object.keys(LOG_LEVELS)[level];
    
    const style = `color: ${LOG_COLORS[levelName]}; font-weight: bold;`;
    
    console.log(
      `%c[${timestamp}] ${levelName}:`,
      style,
      message,
      ...args
    );
  }

  error(message, ...args) {
    this._log(LOG_LEVELS.ERROR, message, ...args);
    // In production, you might want to send errors to a monitoring service
    if (!isDevelopment) {
      // TODO: Send to error monitoring service (e.g., Sentry)
    }
  }

  warn(message, ...args) {
    this._log(LOG_LEVELS.WARN, message, ...args);
  }

  info(message, ...args) {
    this._log(LOG_LEVELS.INFO, message, ...args);
  }

  debug(message, ...args) {
    this._log(LOG_LEVELS.DEBUG, message, ...args);
  }

  // API-specific logging methods
  apiRequest(method, url, data = null) {
    this.debug(`🔄 API ${method.toUpperCase()} ${url}`, data && { data });
  }

  apiSuccess(method, url, duration, data = null) {
    this.info(`✅ API ${method.toUpperCase()} ${url} - ${duration}ms`, data && { data });
  }

  apiError(method, url, error, duration = null) {
    const durationText = duration ? ` - ${duration}ms` : '';
    this.error(`❌ API ${method.toUpperCase()} ${url}${durationText}`, { error });
  }

  // Component lifecycle logging
  componentMount(componentName) {
    this.debug(`🔧 Component mounted: ${componentName}`);
  }

  componentUnmount(componentName) {
    this.debug(`🗑️ Component unmounted: ${componentName}`);
  }

  // Auth-related logging
  authSuccess(action) {
    this.info(`🔐 Auth success: ${action}`);
  }

  authError(action, error) {
    this.error(`🚫 Auth error: ${action}`, { error });
  }
}

// Create default logger instance
const logger = new Logger(
  isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR
);

// Export individual methods for convenience
export const {
  error,
  warn,
  info,
  debug,
  apiRequest,
  apiSuccess,
  apiError,
  componentMount,
  componentUnmount,
  authSuccess,
  authError
} = logger;

export default logger;