import { useState } from 'react';
import { logoutUser } from '../../components/services/authLogout';
import { useAuthStore } from '../../store/useAuthStore';

const TopHeader = ({ activeTab }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    // Use Zustand store logout to properly update state
    useAuthStore.getState().logout();
    // Also clear localStorage for consistency
    const result = logoutUser();
    if (result.success) {
      // Redirect to login page or refresh
      window.location.href = '/login'; // Adjust as needed for your routing
    } else {
      console.error(result.message);
    }
  };

  return (
    <div className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <button className="md:hidden text-gray-500 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="ml-4 text-xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
      </div>
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search..."
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <button className="ml-4 p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div className="ml-4 relative">
          <button 
            className="flex items-center focus:outline-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img
              className="w-8 h-8 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Admin avatar"
              loading="lazy"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Admin</span>
            <svg className="ml-1 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopHeader;