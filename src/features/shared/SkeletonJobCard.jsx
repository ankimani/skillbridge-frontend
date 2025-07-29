import React from 'react';

const SkeletonJobCard = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse mb-6">
    <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
    <div className="flex gap-2 mb-4">
      <div className="h-4 w-20 bg-gray-200 rounded"></div>
      <div className="h-4 w-16 bg-gray-200 rounded"></div>
      <div className="h-4 w-24 bg-gray-200 rounded"></div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
    <div className="flex gap-4">
      <div className="h-8 w-32 bg-gray-200 rounded"></div>
      <div className="h-8 w-40 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default SkeletonJobCard; 