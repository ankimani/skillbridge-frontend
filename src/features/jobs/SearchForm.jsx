import React, { useState } from 'react';
import { FaSearch, FaBriefcase, FaMapMarkerAlt, FaFilter } from 'react-icons/fa';
import { Search, Sparkles, TrendingUp } from 'lucide-react';

const SearchForm = ({ setKeyword }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setKeyword(searchTerm);
    }
  };

  const popularSearches = [
    { term: 'Mathematics', icon: '📐' },
    { term: 'Computer Science', icon: '💻' },
    { term: 'English', icon: '📚' },
    { term: 'Physics', icon: '⚡' },
    { term: 'Chemistry', icon: '🧪' },
    { term: 'Art', icon: '🎨' }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Find Your Perfect Professional Opportunity
            </h1>
          </div>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Connect with students worldwide and build your professional career
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-5">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for subjects, skills, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Search className="w-4 h-4 mr-2" />
                Search Jobs
              </button>
            </form>

            {/* Popular Searches */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-500">Popular searches:</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSearchTerm(search.term)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    <span className="mr-1">{search.icon}</span>
                    {search.term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;