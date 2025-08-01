import React, { useState, useEffect, useCallback } from 'react';
import { FaMapMarkerAlt, FaRegClock, FaCoins, FaArrowLeft, FaArrowRight, FaUsers, FaCheckCircle, FaStar, FaEye, FaHeart } from 'react-icons/fa';
import { differenceInHours } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { getJobApplicantCount } from '../../components/services/jobApplicantCount';
import { fetchUserProfile } from '../../components/services/authProfile';
import Search from './SearchForm';
import Footer from '../../features/shared/Footer';
import SkeletonJobCard from '../../features/shared/SkeletonJobCard';
import SidebarFilters from '../../components/pages/SidebarFilters';
import { MapPin, Clock, DollarSign, Users, CheckCircle, Star, Eye, Heart, ArrowRight, Sparkles, TrendingUp, Award, ArrowLeft, BookOpen, Zap } from 'lucide-react';

const JobCard = React.memo(({ job, countsLoading, applicantCounts, getTitle, getFormattedDate, handlePageChange, currentPage, totalPages, handleCompleteProfile, handleCancel }) => (
  <div key={job.jobId} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:scale-[1.02] transform relative">
    {/* Card Header */}
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            <Link to={`/jobinfo/${job.jobId}`} className="hover:underline">
              {getTitle(job)}
            </Link>
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-medium">
              <BookOpen className="w-3 h-3 mr-1" />
              {job.subjects}
            </span>
            <span className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {getFormattedDate(job.createdAt)}
            </span>
            <span className="flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              {job.location}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Save job">
            <Heart className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors" title="Quick view">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    {/* Card Body */}
    <div className="p-6">
      <p className="text-gray-700 mb-6 leading-relaxed line-clamp-3">{job.jobRequirements}</p>
      
      {/* Job Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
          <DollarSign className="w-5 h-5 text-yellow-600 mr-3" />
          <div>
            <div className="text-xs text-gray-600 font-medium">Budget</div>
            <div className="font-bold text-gray-900">${job.budget} {job.frequency}</div>
          </div>
        </div>
        <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <Zap className="w-5 h-5 text-green-600 mr-3" />
          <div>
            <div className="text-xs text-gray-600 font-medium">Application Cost</div>
            <div className="font-bold text-gray-900">{job.coins} coins</div>
          </div>
        </div>
        <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <Users className="w-5 h-5 text-blue-600 mr-3" />
          <div>
            <div className="text-xs text-gray-600 font-medium">Applicants</div>
            <div className="font-bold text-gray-900">
              {countsLoading[job.jobId] ? (
                <span className="animate-pulse text-sm">Loading...</span>
              ) : applicantCounts[job.jobId] === 0 ? (
                "Be first!"
              ) : (
                `${applicantCounts[job.jobId]}`
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status and Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className={`flex items-center px-3 py-2 rounded-lg font-medium text-sm ${
            job.jobStatus === 'Open' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            <CheckCircle className="w-4 h-4 mr-2" />
            {job.jobStatus === 'Open' ? 'Open for applications' : 'Applications closed'}
          </div>
          {applicantCounts[job.jobId] > 0 && (
            <div className="text-xs text-gray-500">
              {applicantCounts[job.jobId]} {applicantCounts[job.jobId] === 1 ? 'person' : 'people'} applied
            </div>
          )}
        </div>
        
        <Link 
          to={`/jobinfo/${job.jobId}`}
          className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  </div>
));

const JobDisplay = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState({
    jobCategory: null,
    meetingOptions: [],
    dateFilter: null,
    jobStatus: null,
    startDate: null,
    endDate: null,
  });
  const [keyword, setKeyword] = useState('');
  const [applicantCounts, setApplicantCounts] = useState({});
  const [countsLoading, setCountsLoading] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();

  const tutorRoutes = {
    PROFILE: "/profileform",
    EDUCATION: "/education",
    EXPERIENCE: "/experience",
    SUBJECTS: "/subjects",
    DETAILS: "/details",
    COMPLETE: "/jobs"
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const profile = await fetchUserProfile(token);
          if (isMounted) {
            setUserProfile(profile);
          }
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    };

    fetchUserData();

    const fetchJobs = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }
        const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8089";
        let url = `${BACKEND_BASE_URL}/api/v1/jobs`;
        const queryParams = new URLSearchParams({
          page: currentPage,
          size: pageSize,
          ...(filters.jobCategory && { jobCategory: filters.jobCategory }),
          ...(filters.jobStatus && { jobStatus: filters.jobStatus }),
          ...(filters.dateFilter && { dateFilter: filters.dateFilter }),
          ...(filters.startDate && { startDate: filters.startDate }),
          ...(filters.endDate && { endDate: filters.endDate }),
          ...(Array.isArray(filters.meetingOptions) && filters.meetingOptions.length > 0 && { meetingOptions: filters.meetingOptions.join(',') }),
          ...(keyword && { keyword }),
        });

        const response = await fetch(`${url}?${queryParams.toString()}`);
        const data = await response.json();

        if (!isMounted) return;

        if (data.headers.responseCode === 404) {
          setError(data.headers.customerMessage);
          setJobs([]);
          setTotalPages(0);
        } else {
          setJobs(data.body.data.jobs);
          setTotalPages(data.body.data.totalPages);
          
          const loadingStates = {};
          const counts = {};
          
          data.body.data.jobs.forEach(job => {
            loadingStates[job.jobId] = true;
            counts[job.jobId] = 0;
          });
          
          setCountsLoading(loadingStates);
          setApplicantCounts(counts);

          const token = localStorage.getItem('authToken');
          
          // Use Promise.allSettled to handle all applicant count requests
          const applicantCountPromises = data.body.data.jobs.map(async (job) => {
            try {
              const count = await getJobApplicantCount(job.jobId, token);
              return { jobId: job.jobId, count, success: true };
            } catch (err) {
              console.error(`Error fetching applicant count for job ${job.jobId}:`, err);
              return { jobId: job.jobId, count: 0, success: false };
            }
          });

          const results = await Promise.allSettled(applicantCountPromises);
          
          if (isMounted) {
            const newCounts = { ...applicantCounts };
            const newLoadingStates = { ...countsLoading };
            
            results.forEach((result) => {
              if (result.status === 'fulfilled') {
                const { jobId, count, success } = result.value;
                newCounts[jobId] = count;
                newLoadingStates[jobId] = false;
                
                if (!success) {
                  console.warn(`Using fallback count for job ${jobId} due to backend error`);
                }
              }
            });
            
            setApplicantCounts(newCounts);
            setCountsLoading(newLoadingStates);
          }
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        if (isMounted) {
          setError('Error fetching job postings');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialLoad(false);
        }
      }
    };

    fetchJobs();

    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, filters, keyword]);

  const getFormattedDate = (createdAtArray) => {
    try {
      if (!createdAtArray || !Array.isArray(createdAtArray)) {
        return 'some time ago';
      }

      const date = new Date(
        createdAtArray[0],
        createdAtArray[1] - 1,
        createdAtArray[2],
        createdAtArray[3],
        createdAtArray[4],
        createdAtArray[5],
        Math.floor(createdAtArray[6] / 1000000)
      );

      const now = new Date();
      const hours = differenceInHours(now, date);
      
      if (hours < 1) return 'now';
      if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
      
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
      
      const weeks = Math.floor(days / 7);
      if (weeks < 4) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
      
      const months = Math.floor(days / 30);
      if (months < 6) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
      
      return 'over 6 months ago';
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'some time ago';
    }
  };

  const handleCompleteProfile = useCallback(() => {
    if (userProfile?.roleName === 'ROLE_TUTOR' && userProfile?.stepName) {
      navigate(tutorRoutes[userProfile.stepName] || '/profileform');
    } else {
      navigate('/profileform');
    }
  }, [navigate, userProfile, tutorRoutes]);

  const handleCancel = useCallback(() => {
    navigate('/jobs');
  }, [navigate]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }, [totalPages]);

  const getTitle = (job) => {
    if (job.meetingOptions === 'Travel to tutor' || job.meetingOptions === 'At my place') {
      return `Home ${job.subjects} Professional(s) needed in ${job.location}`;
    }
    if (job.meetingOptions === 'Online') {
      return `Online ${job.subjects} Professional(s) needed in ${job.location}`;
    }
    return `${job.subjects} Professional in ${job.location}`;
  };

  if (!profileLoading && userProfile && userProfile.roleName === 'ROLE_TUTOR' && userProfile.stepName !== 'COMPLETE') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Search setKeyword={setKeyword} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-1/4">
              <SidebarFilters setFilters={setFilters} />
            </aside>
            <main className="lg:w-3/4">
              {/* Profile completion content */}
            </main>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Search setKeyword={setKeyword} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <SidebarFilters setFilters={setFilters} />
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            {/* Results Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Available Opportunities
                  </h2>
                  <p className="text-gray-600">
                    {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-500">Latest opportunities</span>
                </div>
              </div>
            </div>

            {/* Jobs List */}
            {initialLoad ? (
              <div className="space-y-6" aria-busy="true" aria-label="Loading jobs...">
                {[...Array(5)].map((_, idx) => (
                  <SkeletonJobCard key={idx} />
                ))}
              </div>
            ) : error && jobs.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Found</h3>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job.jobId}
                    job={job}
                    countsLoading={countsLoading}
                    applicantCounts={applicantCounts}
                    getTitle={getTitle}
                    getFormattedDate={getFormattedDate}
                    handlePageChange={handlePageChange}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handleCompleteProfile={handleCompleteProfile}
                    handleCancel={handleCancel}
                  />
                ))}

                {/* Pagination */}
                {jobs.length > 0 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center space-x-2 bg-white rounded-2xl shadow-lg p-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl hover:bg-blue-50 transition-all duration-200"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </button>
                      <span className="px-6 py-2 text-gray-700 font-medium">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl hover:bg-blue-50 transition-all duration-200"
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDisplay;