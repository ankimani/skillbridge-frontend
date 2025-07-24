import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import jobCategories from '../../data/jobCategories.json';
import { FiFilter, FiCalendar, FiBriefcase, FiCheckCircle, FiGlobe, FiHome } from 'react-icons/fi';

const SidebarFilters = ({ setFilters }) => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState(null);
  const [selectedJobStatus, setSelectedJobStatus] = useState(null);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [isAllJobsSelected, setIsAllJobsSelected] = useState(false);
  const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:8089';
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
    { value: 'anytime', label: 'Anytime', icon: <FiCalendar className="mr-2" /> },
    { value: 'today', label: 'Today', icon: <FiCalendar className="mr-2" /> },
    { value: 'past24Hours', label: 'Past 24 Hours', icon: <FiCalendar className="mr-2" /> },
    { value: 'pastWeek', label: 'Past Week', icon: <FiCalendar className="mr-2" /> },
    { value: 'pastMonth', label: 'Past Month', icon: <FiCalendar className="mr-2" /> },
  ];

  const jobStatusOptions = [
    { value: 'Open', label: 'Open', icon: <FiCheckCircle className="mr-2 text-green-500" /> },
    { value: 'Closed', label: 'Closed', icon: <FiCheckCircle className="mr-2 text-red-500" /> },
  ];

  const meetingOptions = [
    { value: 'Online', label: 'Online', icon: <FiGlobe className="mr-2 text-blue-500" /> },
    { value: 'Physical', label: 'Physical', icon: <FiHome className="mr-2 text-indigo-500" /> },
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
      minHeight: '42px',
      borderRadius: '8px',
      borderColor: state.isFocused ? '#6366f1' : '#e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#6366f1' : '#d1d5db',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#e0e7ff' : state.isFocused ? '#f5f3ff' : 'white',
      color: state.isSelected ? '#4338ca' : '#1f2937',
      padding: '8px 12px',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e0e7ff',
      borderRadius: '6px',
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
  };

  return (
    <div className="w-full md:w-72 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center mb-6">
        <FiFilter className="text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Job Filters</h2>
      </div>

      {/* "All Jobs" Toggle */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={isAllJobsSelected}
              onChange={(e) => setIsAllJobsSelected(e.target.checked)}
              className="sr-only"
            />
            <div className={`block w-10 h-6 rounded-full ${isAllJobsSelected ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                isAllJobsSelected ? 'translate-x-4' : ''
              }`}
            ></div>
          </div>
          <span className="ml-3 text-sm font-medium text-gray-700">Show All Jobs</span>
        </label>
      </div>

      {/* Meeting Options */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <FiGlobe className="mr-2 text-gray-500" />
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
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <FiCalendar className="mr-2 text-gray-500" />
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
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <FiBriefcase className="mr-2 text-gray-500" />
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
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <FiCheckCircle className="mr-2 text-gray-500" />
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
    </div>
  );
};

export default SidebarFilters;