// Centralized validation utilities

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  return phoneRegex.test(phone);
};

// Required field validation
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined && value !== '';
};

// Minimum length validation
export const hasMinLength = (value, minLength) => {
  if (typeof value !== 'string') return false;
  return value.trim().length >= minLength;
};

// Maximum length validation
export const hasMaxLength = (value, maxLength) => {
  if (typeof value !== 'string') return false;
  return value.trim().length <= maxLength;
};

// Number validation
export const isValidNumber = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

// Positive number validation
export const isPositiveNumber = (value) => {
  return isValidNumber(value) && parseFloat(value) > 0;
};

// Date validation
export const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

// Future date validation
export const isFutureDate = (date) => {
  return isValidDate(date) && date > new Date();
};

// URL validation
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validation rule engine
export class ValidationRule {
  constructor(field, message) {
    this.field = field;
    this.message = message;
    this.validators = [];
  }

  required(customMessage = null) {
    this.validators.push({
      validate: isRequired,
      message: customMessage || `${this.field} is required`
    });
    return this;
  }

  email(customMessage = null) {
    this.validators.push({
      validate: isValidEmail,
      message: customMessage || `${this.field} must be a valid email`
    });
    return this;
  }

  password(customMessage = null) {
    this.validators.push({
      validate: isValidPassword,
      message: customMessage || `${this.field} must be at least 8 characters with uppercase, lowercase, and number`
    });
    return this;
  }

  phone(customMessage = null) {
    this.validators.push({
      validate: isValidPhone,
      message: customMessage || `${this.field} must be a valid phone number`
    });
    return this;
  }

  minLength(length, customMessage = null) {
    this.validators.push({
      validate: (value) => hasMinLength(value, length),
      message: customMessage || `${this.field} must be at least ${length} characters`
    });
    return this;
  }

  maxLength(length, customMessage = null) {
    this.validators.push({
      validate: (value) => hasMaxLength(value, length),
      message: customMessage || `${this.field} must be no more than ${length} characters`
    });
    return this;
  }

  number(customMessage = null) {
    this.validators.push({
      validate: isValidNumber,
      message: customMessage || `${this.field} must be a valid number`
    });
    return this;
  }

  positive(customMessage = null) {
    this.validators.push({
      validate: isPositiveNumber,
      message: customMessage || `${this.field} must be a positive number`
    });
    return this;
  }

  custom(validator, message) {
    this.validators.push({
      validate: validator,
      message: message
    });
    return this;
  }

  validate(value) {
    for (const validator of this.validators) {
      if (!validator.validate(value)) {
        return { valid: false, message: validator.message };
      }
    }
    return { valid: true, message: null };
  }
}

// Form validation helper
export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;

  for (const [field, rule] of Object.entries(rules)) {
    const value = formData[field];
    const result = rule.validate(value);
    
    if (!result.valid) {
      errors[field] = result.message;
      isValid = false;
    }
  }

  return { isValid, errors };
};

// Create validation rule
export const createRule = (field, message = '') => {
  return new ValidationRule(field, message);
};

// Common validation rules
export const commonRules = {
  email: createRule('Email').required().email(),
  password: createRule('Password').required().password(),
  confirmPassword: (password) => createRule('Confirm Password')
    .required()
    .custom((value) => value === password, 'Passwords do not match'),
  firstName: createRule('First Name').required().minLength(2).maxLength(50),
  lastName: createRule('Last Name').required().minLength(2).maxLength(50),
  phone: createRule('Phone').required().phone(),
  description: createRule('Description').maxLength(1000),
};