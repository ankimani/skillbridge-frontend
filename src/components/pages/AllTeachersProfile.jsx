import React, { useState, useEffect } from 'react';
import { fetchAllTeachers, fetchAllTeachersWithoutFilters } from '../services/allTeachersProfile';
import Menus from '../student/Menus';
import { FaChalkboardTeacher, FaVenusMars, FaMoneyBillWave, FaHome, FaLaptop, FaPhone, FaMapMarkerAlt, FaIdBadge } from 'react-icons/fa';
import { FiFilter, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { IoMdTime } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const AllTeachersProfile = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    gender: '',
    minFee: '',
    maxFee: '',
    onlineAvailability: '',
    homeAvailability: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  useEffect(() => {
    loadTeachers();
  }, [filters]);

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const response = await fetchAllTeachers(filters);
      setTeachers(response.body.data.teachers);
      setPagination({
        currentPage: response.body.data.currentPage,
        totalPages: response.body.data.totalPages,
        totalItems: response.body.data.totalItems
      });
    } catch (error) {
      console.error('Error loading teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = async () => {
    setFilters({
      gender: '',
      minFee: '',
      maxFee: '',
      onlineAvailability: '',
      homeAvailability: ''
    });
    const response = await fetchAllTeachersWithoutFilters();
    setTeachers(response.body.data.teachers);
    setPagination({
      currentPage: response.body.data.currentPage,
      totalPages: response.body.data.totalPages,
      totalItems: response.body.data.totalItems
    });
  };
  const navigate = useNavigate();

  const handleViewProfile = (teacherId) => {
    navigate(`/teachers/${teacherId}`);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Menus />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FiFilter className="mr-2 text-blue-600" /> Filter Professionals
                </h2>
                <button 
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaVenusMars className="mr-2 text-blue-500" /> Gender
                  </label>
                  <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Fee Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiDollarSign className="mr-2 text-blue-500" /> Fee Range (USD)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400">$</span>
                        <input
                          type="number"
                          name="minFee"
                          placeholder="20"
                          value={filters.minFee}
                          onChange={handleFilterChange}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400">$</span>
                        <input
                          type="number"
                          name="maxFee"
                          placeholder="100"
                          value={filters.maxFee}
                          onChange={handleFilterChange}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Availability Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <IoMdTime className="mr-2 text-blue-500" /> Availability
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name="onlineAvailability"
                        checked={filters.onlineAvailability === 'true'}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          onlineAvailability: e.target.checked ? 'true' : ''
                        }))}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex items-center">
                        <FaLaptop className="text-gray-600 mr-2" />
                        <span className="text-gray-700">Online Lessons</span>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name="homeAvailability"
                        checked={filters.homeAvailability === 'true'}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          homeAvailability: e.target.checked ? 'true' : ''
                        }))}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex items-center">
                        <FaHome className="text-gray-600 mr-2" />
                        <span className="text-gray-700">Home Tutoring</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Teachers List */}
          <div className="w-full md:w-3/4">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    <FaChalkboardTeacher className="inline mr-2 text-blue-600" />
                    Qualified Professionals
                  </h1>
                  <p className="text-gray-500 mt-1">Find the perfect professionals for your learning needs</p>
                </div>
                <div className="mt-3 sm:mt-0 bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  Showing {teachers.length} of {pagination.totalItems} professionals
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : teachers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaChalkboardTeacher className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">No teachers found</h3>
                  <p className="text-gray-500 mt-1 mb-4">Try adjusting your filters or search criteria</p>
                  <button
                    onClick={resetFilters}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {teachers.map((teacher) => (
                    <div key={teacher.teacherId} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-100">
                      <div className="p-6">
                        <div className="flex items-start">
                          <div className="relative">
                            <img
                              src={teacher.imagePath}
                              alt={teacher.displayName}
                              className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-white shadow-md"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-blue-100 rounded-full p-1 border-2 border-white">
                              <FaIdBadge className="text-blue-600 text-xs" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-800">{teacher.displayName}</h3>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <span className="flex items-center mr-3">
                                <FaVenusMars className="mr-1 text-gray-400" /> {teacher.gender}
                              </span>
                              <span className="flex items-center">
                                <FaMapMarkerAlt className="mr-1 text-gray-400" /> {teacher.location}
                              </span>
                            </div>
                            <div className="mt-3">
                              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                Rate: ${teacher.minFee}-${teacher.maxFee}/hr
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">About</h4>
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {teacher.profileDescription}
                          </p>
                        </div>
                        <div className="mt-5 pt-4 border-t border-gray-100">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Contact</h4>
                              <div className="flex items-center text-sm text-gray-700">
                                <FaPhone className="mr-2 text-gray-400" />
                                {teacher.phoneNumber}
                              </div>
                            </div>

                          </div>
                          <div className="mt-4 flex justify-end">
                          <button 
                            onClick={() => handleViewProfile(teacher.teacherId)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md flex items-center"
                            >
                            View Full Profile
                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-10 flex justify-center">
                  <nav className="inline-flex rounded-md shadow-sm">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setFilters(prev => ({ ...prev, page }))}
                        className={`px-4 py-2 border ${pagination.currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          } ${page === 1 ? 'rounded-l-md' : ''} ${page === pagination.totalPages ? 'rounded-r-md' : ''}`}
                      >
                        {page}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTeachersProfile;