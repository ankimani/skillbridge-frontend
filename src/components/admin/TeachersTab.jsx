import { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from 'lucide-react';
import { allTeachersPaginated } from '../services/allTeachersProfile';

const TeachersTab = () => {
  // State for teachers data and loading
  const [teachersData, setTeachersData] = useState({
    teachers: [],
    totalItems: 0,
    totalPages: 1,
    currentPage: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [teachersPerPage] = useState(5);

  // Fetch teachers data with search functionality
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const result = await allTeachersPaginated(currentPage, teachersPerPage, searchTerm);
        
        if (result.success) {
          setTeachersData({
            teachers: result.data.teachers,
            totalItems: result.data.totalItems,
            totalPages: result.data.totalPages,
            currentPage: result.data.currentPage
          });
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Add debounce to search to prevent too many API calls
    const debounceTimer = setTimeout(() => {
      fetchTeachers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, teachersPerPage, searchTerm]);

  // Format birthdate
  const formatBirthdate = (birthdateArray) => {
    if (!birthdateArray || birthdateArray.length !== 3) return 'N/A';
    const [year, month, day] = birthdateArray;
    return new Date(year, month - 1, day).toLocaleDateString();
  };

  // Open modal with teacher details
  const openTeacherModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center text-red-500">
        Error loading teachers: {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with title and controls */}
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Teachers Management</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search input */}
          <div className="relative flex-grow sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Teachers table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birthdate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachersData.teachers.length > 0 ? (
              teachersData.teachers.map((teacher) => (
                <tr key={teacher.teacherId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{teacher.displayName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{teacher.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {formatBirthdate(teacher.birthdate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{teacher.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{teacher.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button 
                      onClick={() => openTeacherModal(teacher)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No teachers found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{(currentPage - 1) * teachersPerPage + 1}</span> to{' '}
          <span className="font-medium">
            {Math.min(currentPage * teachersPerPage, teachersData.totalItems)}
          </span>{' '}
          of <span className="font-medium">{teachersData.totalItems}</span> teachers
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: Math.min(5, teachersData.totalPages) }, (_, i) => {
              let pageNum;
              if (teachersData.totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= teachersData.totalPages - 2) {
                pageNum = teachersData.totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-md flex items-center justify-center ${
                    currentPage === pageNum
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, teachersData.totalPages))}
            disabled={currentPage === teachersData.totalPages}
            className={`p-2 rounded-md ${currentPage === teachersData.totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentPage(teachersData.totalPages)}
            disabled={currentPage === teachersData.totalPages}
            className={`p-2 rounded-md ${currentPage === teachersData.totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Teacher Details Modal */}
      {isModalOpen && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close Button (Top Right) */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Content */}
            <div className="p-8">
              {/* Header Section with Gradient Background */}
              <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-lg p-6 mb-6 text-white relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-6 -mb-6"></div>
                
                {/* Teacher Image and Basic Info */}
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                  {selectedTeacher.imagePath ? (
                    <img 
                      src={selectedTeacher.imagePath} 
                      alt={selectedTeacher.displayName}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white border-opacity-30 shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-4 border-white border-opacity-30 shadow-md">
                      <span className="text-3xl font-bold text-white">
                        {selectedTeacher.displayName.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-2xl font-bold">{selectedTeacher.displayName}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                        {selectedTeacher.gender}
                      </span>
                      {selectedTeacher.company && (
                        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                          Company: {selectedTeacher.companyName || 'Yes'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Personal Details */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-5">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                      <svg className="w-5 h-5 inline-block mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Personal Information
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher ID</p>
                        <p className="mt-1 text-gray-900 font-medium">{selectedTeacher.teacherId}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</p>
                        <p className="mt-1 text-gray-900 font-medium">{selectedTeacher.userId}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Birthdate</p>
                        <p className="mt-1 text-gray-900 font-medium">{formatBirthdate(selectedTeacher.birthdate)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</p>
                        <p className="mt-1 text-gray-900 font-medium">{selectedTeacher.phoneNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* Location Card */}
                  <div className="bg-gray-50 rounded-lg p-5">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                      <svg className="w-5 h-5 inline-block mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Location
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</p>
                        <p className="mt-1 text-gray-900 font-medium">{selectedTeacher.location}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Postal Code</p>
                        <p className="mt-1 text-gray-900 font-medium">{selectedTeacher.postalCode || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Professional Details */}
                <div className="space-y-6">
                  {/* Professional Info Card */}
                  <div className="bg-gray-50 rounded-lg p-5">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                      <svg className="w-5 h-5 inline-block mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Professional Information
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Role</p>
                        <p className="mt-1 text-gray-900 font-medium">{selectedTeacher.role || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Company</p>
                        <p className="mt-1 text-gray-900 font-medium">
                          {selectedTeacher.company ? (selectedTeacher.companyName || 'Yes') : 'No'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Description Card */}
                  <div className="bg-gray-50 rounded-lg p-5">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                      <svg className="w-5 h-5 inline-block mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      Profile Description
                    </h4>
                    
                    <div className="prose max-w-none text-gray-700">
                      {selectedTeacher.profileDescription || 'No description available'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersTab;