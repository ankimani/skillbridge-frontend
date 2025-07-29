import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import jobCategories from '../../data/jobCategories.json';
import { FiFilter, FiCalendar, FiBriefcase, FiCheckCircle, FiGlobe, FiHome, FiRefreshCw, FiX } from 'react-icons/fi';

const SidebarFilters = ({ setFilters }) => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState(null);
  const [selectedJobStatus, setSelectedJobStatus] = useState(null);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [isAllJobsSelected, setIsAllJobsSelected] = useState(false);
  const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8089";
  
  useEffect(() => {
    const formattedCategories = jobCategories.map((category) => ({
      value: category,
      label: category,
    }));
    setCategoryOptions(formattedCategories);
  }, []);

  useEffect(() => {
    if (isAllJobsSelected) {
      setFilters({
        url: `${BACKEND_BASE_URL}/api/v1/jobs?page=1&size=10`,
      });
    } else {
      setFilters({
        jobCategory: selectedCategory?.value || null,
        meetingOptions: selectedJobTypes.length > 0 ? selectedJobTypes : null,
        dateFilter: selectedTimeFilter?.value || null,
        jobStatus: selectedJobStatus?.value || null,
      });
    }
  }, [
    isAllJobsSelected,
    selectedCategory,
    selectedTimeFilter,
    selectedJobStatus,
    selectedJobTypes,
    setFilters,
  ]);

  const timeFilterOptions = [
    { value: 'anytime', label: 'Anytime', icon: <FiCalendar className="mr-2 text-blue-500" /> },
    { value: 'today', label: 'Today', icon: <FiCalendar className="mr-2 text-green-500" /> },
    { value: 'past24Hours', label: 'Past 24 Hours', icon: <FiCalendar className="mr-2 text-orange-500" /> },
    { value: 'pastWeek', label: 'Past Week', icon: <FiCalendar className="mr-2 text-purple-500" /> },
    { value: 'pastMonth', label: 'Past Month', icon: <FiCalendar className="mr-2 text-indigo-500" /> },
  ];

  const jobStatusOptions = [
    { value: 'Open', label: 'Open Jobs', icon: <FiCheckCircle className="mr-2 text-green-500" /> },
    { value: 'Closed', label: 'Closed Jobs', icon: <FiCheckCircle className="mr-2 text-red-500" /> },
  ];

  const meetingOptions = [
    { value: 'Online', label: 'Online Sessions', icon: <FiGlobe className="mr-2 text-blue-500" /> },
    { value: 'Physical', label: 'In-Person', icon: <FiHome className="mr-2 text-indigo-500" /> },
  ];

  const formatOptionLabel = ({ label, icon }) => (
    <div className="flex items-center">
      {icon}
      {label}
    </div>
  );

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '44px',
      borderRadius: '12px',
      borderColor: state.isFocused ? '#6366f1' : '#e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : 'none',
      backgroundColor: state.isFocused ? '#ffffff' : '#f9fafb',
      '&:hover': {
        borderColor: state.isFocused ? '#6366f1' : '#d1d5db',
        backgroundColor: state.isFocused ? '#ffffff' : '#f3f4f6',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#e0e7ff' : state.isFocused ? '#f5f3ff' : 'white',
      color: state.isSelected ? '#4338ca' : '#1f2937',
      padding: '12px 16px',
      borderRadius: '8px',
      margin: '2px 8px',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e0e7ff',
      borderRadius: '8px',
      padding: '4px 8px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#4338ca',
      fontWeight: '500',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#4338ca',
      ':hover': {
        backgroundColor: '#a5b4fc',
        color: '#4338ca',
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      zIndex: 9999,
      position: 'absolute',
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '8px',
      maxHeight: '200px',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
    }),
  };

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedTimeFilter(null);
    setSelectedJobStatus(null);
    setSelectedJobTypes([]);
    setIsAllJobsSelected(false);
  };

  const hasActiveFilters = selectedCategory || selectedTimeFilter || selectedJobStatus || selectedJobTypes.length > 0;

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-visible">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
              <FiFilter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Job Filters</h2>
              <p className="text-blue-100 text-sm">Find your perfect opportunity</p>
            </div>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
              title="Clear all filters"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Content */}
      <div className="p-6 space-y-6">
        {/* "All Jobs" Toggle */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={isAllJobsSelected}
                onChange={(e) => setIsAllJobsSelected(e.target.checked)}
                className="sr-only"
              />
              <div className={`block w-12 h-6 rounded-full transition-colors duration-300 ${isAllJobsSelected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform duration-300 ${
                  isAllJobsSelected ? 'translate-x-6' : ''
                }`}
              ></div>
            </div>
            <div className="ml-3">
              <span className="text-sm font-semibold text-gray-700">Show All Jobs</span>
              <p className="text-xs text-gray-500">Disable all filters</p>
            </div>
          </label>
        </div>

        {/* Meeting Options */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 flex items-center">
            <FiGlobe className="mr-2 text-blue-500" />
            Meeting Type
          </label>
          <Select
            options={meetingOptions}
            value={selectedJobTypes.map((type) => meetingOptions.find(opt => opt.value === type))}
            onChange={(selectedOptions) => {
              setSelectedJobTypes(selectedOptions ? selectedOptions.map((opt) => opt.value) : []);
            }}
            formatOptionLabel={formatOptionLabel}
            isMulti
            placeholder="Select meeting type..."
            styles={customSelectStyles}
            isDisabled={isAllJobsSelected}
            className="text-sm"
          />
        </div>

        {/* Date Posted Filter */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 flex items-center">
            <FiCalendar className="mr-2 text-green-500" />
            Date Posted
          </label>
          <Select
            options={timeFilterOptions}
            value={selectedTimeFilter}
            onChange={setSelectedTimeFilter}
            formatOptionLabel={formatOptionLabel}
            placeholder="Select time range..."
            styles={customSelectStyles}
            isDisabled={isAllJobsSelected}
            className="text-sm"
          />
        </div>

        {/* Job Category */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 flex items-center">
            <FiBriefcase className="mr-2 text-purple-500" />
            Job Category
          </label>
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            isSearchable
            placeholder="Search categories..."
            styles={customSelectStyles}
            isDisabled={isAllJobsSelected}
            className="text-sm"
          />
        </div>

        {/* Job Status */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 flex items-center">
            <FiCheckCircle className="mr-2 text-indigo-500" />
            Job Status
          </label>
          <Select
            options={jobStatusOptions}
            value={selectedJobStatus}
            onChange={setSelectedJobStatus}
            formatOptionLabel={formatOptionLabel}
            placeholder="Select status..."
            styles={customSelectStyles}
            isDisabled={isAllJobsSelected}
            className="text-sm"
          />
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Active Filters
            </h4>
            <div className="space-y-2">
              {selectedCategory && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-700">Category:</span>
                  <span className="text-xs font-medium text-blue-800">{selectedCategory.label}</span>
                </div>
              )}
              {selectedTimeFilter && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-700">Date:</span>
                  <span className="text-xs font-medium text-blue-800">{selectedTimeFilter.label}</span>
                </div>
              )}
              {selectedJobStatus && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-700">Status:</span>
                  <span className="text-xs font-medium text-blue-800">{selectedJobStatus.label}</span>
                </div>
              )}
              {selectedJobTypes.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-700">Meeting Type:</span>
                  <span className="text-xs font-medium text-blue-800">{selectedJobTypes.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarFilters;