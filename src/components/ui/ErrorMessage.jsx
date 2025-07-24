import React from 'react';
import { FaExclamationTriangle, FaTimes, FaRedo } from 'react-icons/fa';

const ErrorMessage = ({ 
  error, 
  onRetry = null, 
  onDismiss = null,
  variant = 'default',
  className = ''
}) => {
  if (!error) return null;

  const variantClasses = {
    default: 'bg-red-50 border-red-200 text-red-800',
    minimal: 'bg-transparent border-red-300 text-red-600',
    solid: 'bg-red-600 border-red-600 text-white'
  };

  return (
    <div className={`
      border rounded-lg p-4 flex items-start space-x-3
      ${variantClasses[variant]}
      ${className}
    `}>
      <FaExclamationTriangle className="flex-shrink-0 w-5 h-5 mt-0.5" />
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {typeof error === 'string' ? error : 'An unexpected error occurred'}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className={`
              mt-2 inline-flex items-center space-x-1 text-sm font-medium
              ${variant === 'solid' 
                ? 'text-white hover:text-gray-200' 
                : 'text-red-700 hover:text-red-800'
              }
            `}
          >
            <FaRedo className="w-3 h-3" />
            <span>Try again</span>
          </button>
        )}
      </div>
      
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`
            flex-shrink-0 p-1 rounded-md
            ${variant === 'solid' 
              ? 'text-white hover:bg-red-700' 
              : 'text-red-600 hover:bg-red-100'
            }
          `}
        >
          <FaTimes className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;