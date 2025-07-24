import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue', 
  text = null, 
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    white: 'border-white'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div 
        className={`
          ${sizeClasses[size]} 
          border-4 
          ${colorClasses[color]} 
          border-t-transparent 
          border-solid 
          rounded-full 
          animate-spin
        `}
      />
      {text && (
        <p className={`text-sm ${color === 'white' ? 'text-white' : 'text-gray-600'}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;